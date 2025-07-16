// Headless browser test using Node.js built-in features
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

async function runHeadlessTests() {
    console.log('🧪 Running Headless Browser Tests for MOOSH Wallet\n');
    
    try {
        // Load the HTML
        const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
        const jsContent = fs.readFileSync(path.join(__dirname, 'public', 'js', 'moosh-wallet.js'), 'utf8');
        
        // Create virtual DOM
        const dom = new JSDOM(html, {
            url: "http://localhost:3333",
            runScripts: "dangerously",
            resources: "usable",
            beforeParse(window) {
                // Mock fetch for testing
                window.fetch = async (url, options) => {
                    console.log(`[MOCK FETCH] ${options?.method || 'GET'} ${url}`);
                    
                    if (url.includes('/health')) {
                        return {
                            ok: true,
                            json: async () => ({ status: 'ok', version: '1.0.0' })
                        };
                    }
                    
                    if (url.includes('/api/wallet/generate')) {
                        return {
                            ok: true,
                            json: async () => ({
                                success: true,
                                data: {
                                    mnemonic: ['test', 'seed', 'phrase'],
                                    bitcoin: {
                                        addresses: {
                                            segwit: 'bc1qtest',
                                            taproot: 'bc1ptest',
                                            legacy: '1Test',
                                            nestedSegwit: '3Test'
                                        }
                                    },
                                    spark: { address: 'sp1test' }
                                }
                            })
                        };
                    }
                    
                    return { ok: false };
                };
                
                // Add crypto mock
                window.crypto = {
                    getRandomValues: (arr) => {
                        for (let i = 0; i < arr.length; i++) {
                            arr[i] = Math.floor(Math.random() * 256);
                        }
                        return arr;
                    }
                };
                
                // Mock localStorage
                window.localStorage = {
                    data: {},
                    getItem(key) { return this.data[key] || null; },
                    setItem(key, value) { this.data[key] = value; },
                    removeItem(key) { delete this.data[key]; }
                };
            }
        });
        
        const window = dom.window;
        const document = window.document;
        
        // Execute the JavaScript
        const script = document.createElement('script');
        script.textContent = jsContent;
        document.head.appendChild(script);
        
        // Wait for app to initialize
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const results = [];
        
        // Test 1: App Initialization
        console.log('Test 1: App Initialization');
        if (window.app) {
            results.push({ test: 'App Initialization', status: 'PASS', details: 'App loaded successfully' });
            console.log('✅ App loaded');
        } else {
            results.push({ test: 'App Initialization', status: 'FAIL', details: 'App not found' });
            console.log('❌ App not loaded');
        }
        
        // Test 2: WalletDetector Class
        console.log('\nTest 2: WalletDetector Class');
        if (window.WalletDetector) {
            results.push({ test: 'WalletDetector Class', status: 'PASS', details: 'Class is available' });
            console.log('✅ WalletDetector found');
            
            // Test instantiation
            try {
                const detector = new window.WalletDetector(window.app);
                const walletTypes = Object.keys(detector.knownPaths);
                results.push({ 
                    test: 'WalletDetector Wallets', 
                    status: 'INFO', 
                    details: `Supports ${walletTypes.length} wallet types: ${walletTypes.join(', ')}` 
                });
                console.log(`   Supported wallets: ${walletTypes.join(', ')}`);
            } catch (error) {
                results.push({ test: 'WalletDetector Instance', status: 'FAIL', details: error.message });
            }
        } else {
            results.push({ test: 'WalletDetector Class', status: 'FAIL', details: 'Class not found' });
            console.log('❌ WalletDetector not found');
        }
        
        // Test 3: Account Creation
        console.log('\nTest 3: Account Creation');
        if (window.app && window.app.state) {
            try {
                const testSeed = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
                const account = await window.app.state.createAccount('HeadlessTest', testSeed, false);
                
                if (account && account.addresses) {
                    const hasAll = !!(account.addresses.segwit && account.addresses.taproot && 
                                    account.addresses.legacy && account.addresses.nestedSegwit && 
                                    account.addresses.spark);
                    
                    if (hasAll) {
                        results.push({ test: 'Account Creation', status: 'PASS', details: 'All address types generated' });
                        console.log('✅ All address types generated');
                    } else {
                        results.push({ test: 'Account Creation', status: 'FAIL', details: 'Missing address types' });
                        console.log('❌ Missing address types');
                    }
                } else {
                    results.push({ test: 'Account Creation', status: 'FAIL', details: 'Account creation failed' });
                }
            } catch (error) {
                results.push({ test: 'Account Creation', status: 'FAIL', details: error.message });
                console.log('❌ Error:', error.message);
            }
        }
        
        // Test 4: MultiAccountModal Methods
        console.log('\nTest 4: Import UI Methods');
        if (window.MultiAccountModal) {
            try {
                const modal = new window.MultiAccountModal(window.app);
                const hasMethods = !!(modal.showDetectionResults && modal.proceedWithImport && modal.cancelImport);
                
                if (hasMethods) {
                    results.push({ test: 'Import UI Methods', status: 'PASS', details: 'All detection methods present' });
                    console.log('✅ All detection methods found');
                } else {
                    results.push({ test: 'Import UI Methods', status: 'FAIL', details: 'Missing detection methods' });
                    console.log('❌ Missing detection methods');
                }
            } catch (error) {
                results.push({ test: 'Import UI Methods', status: 'FAIL', details: error.message });
            }
        }
        
        // Test 5: Fix Addresses Button
        console.log('\nTest 5: Fix Addresses Button Check');
        // Navigate to dashboard
        if (window.app && window.app.router) {
            window.app.router.navigate('/dashboard');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const buttons = Array.from(document.querySelectorAll('button'));
            const fixButton = buttons.find(btn => 
                btn.textContent.includes('Fix Address') || 
                btn.textContent.includes('Fix Missing')
            );
            
            if (!fixButton) {
                results.push({ test: 'Fix Addresses Button', status: 'PASS', details: 'Button removed successfully' });
                console.log('✅ Fix Addresses button removed');
            } else {
                results.push({ test: 'Fix Addresses Button', status: 'FAIL', details: 'Button still exists' });
                console.log('❌ Fix Addresses button still present');
            }
        }
        
        // Generate report
        const report = {
            timestamp: new Date().toISOString(),
            environment: 'headless',
            results: results,
            summary: {
                total: results.length,
                passed: results.filter(r => r.status === 'PASS').length,
                failed: results.filter(r => r.status === 'FAIL').length,
                info: results.filter(r => r.status === 'INFO').length
            }
        };
        
        fs.writeFileSync('headless-test-results.json', JSON.stringify(report, null, 2));
        
        console.log('\n📊 Summary:');
        console.log(`Total: ${report.summary.total}`);
        console.log(`Passed: ${report.summary.passed}`);
        console.log(`Failed: ${report.summary.failed}`);
        console.log(`Info: ${report.summary.info}`);
        
    } catch (error) {
        console.error('Test runner error:', error);
    }
}

// Check if jsdom is available
try {
    require.resolve('jsdom');
    runHeadlessTests();
} catch (e) {
    console.log('jsdom not available. Installing would be required for headless tests.');
    console.log('Run: npm install jsdom');
}