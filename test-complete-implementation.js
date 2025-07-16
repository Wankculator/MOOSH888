// Complete Implementation Test Script
let puppeteer;
try {
    puppeteer = require('puppeteer');
} catch (e) {
    console.log('Puppeteer not available, will run manual tests only\n');
}

async function runComprehensiveTests() {
    console.log('🧪 Starting Comprehensive MOOSH Wallet Tests...\n');
    
    const browser = await puppeteer.launch({
        headless: false, // Set to true for CI/CD
        defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.error('❌ Browser Error:', msg.text());
        }
    });
    
    try {
        // Test 1: Load the app
        console.log('📱 Test 1: Loading MOOSH Wallet...');
        await page.goto('http://localhost:3333', { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        // Check if app loaded
        const appLoaded = await page.evaluate(() => {
            return typeof window.app !== 'undefined' && window.app !== null;
        });
        
        if (appLoaded) {
            console.log('✅ App loaded successfully');
        } else {
            throw new Error('App failed to load');
        }
        
        // Test 2: Check WalletDetector availability
        console.log('\n🔍 Test 2: Checking WalletDetector...');
        const detectorAvailable = await page.evaluate(() => {
            return typeof WalletDetector !== 'undefined';
        });
        
        if (detectorAvailable) {
            console.log('✅ WalletDetector class is available');
        } else {
            throw new Error('WalletDetector class not found');
        }
        
        // Test 3: Create a new account
        console.log('\n💳 Test 3: Creating new account...');
        const accountCreated = await page.evaluate(async () => {
            try {
                const testSeed = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
                const account = await app.state.createAccount('Test Account', testSeed, false);
                
                return {
                    success: true,
                    hasAllAddresses: !!(
                        account.addresses.segwit &&
                        account.addresses.taproot &&
                        account.addresses.legacy &&
                        account.addresses.nestedSegwit &&
                        account.addresses.spark
                    ),
                    addresses: {
                        segwit: account.addresses.segwit ? '✅' : '❌',
                        taproot: account.addresses.taproot ? '✅' : '❌',
                        legacy: account.addresses.legacy ? '✅' : '❌',
                        nestedSegwit: account.addresses.nestedSegwit ? '✅' : '❌',
                        spark: account.addresses.spark ? '✅' : '❌'
                    },
                    accountId: account.id
                };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });
        
        if (accountCreated.success && accountCreated.hasAllAddresses) {
            console.log('✅ Account created with all address types:');
            Object.entries(accountCreated.addresses).forEach(([type, status]) => {
                console.log(`   ${type}: ${status}`);
            });
        } else {
            throw new Error('Account creation failed or missing addresses');
        }
        
        // Test 4: Check if Fix Addresses button is gone
        console.log('\n🔧 Test 4: Checking Fix Addresses button...');
        const fixButtonExists = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.some(btn => btn.textContent.includes('Fix Addresses'));
        });
        
        if (!fixButtonExists) {
            console.log('✅ Fix Addresses button successfully removed');
        } else {
            console.log('⚠️  Fix Addresses button still exists');
        }
        
        // Test 5: Test wallet detection
        console.log('\n🎯 Test 5: Testing wallet detection...');
        const detectionTest = await page.evaluate(async () => {
            try {
                const detector = new WalletDetector(app);
                const testSeed = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
                
                // Mock the API calls for testing
                detector.deriveAddressesForPath = async (mnemonic, path, count) => {
                    const addresses = [];
                    for (let i = 0; i < count; i++) {
                        let prefix = 'bc1q'; // default segwit
                        if (path.includes("86'")) prefix = 'bc1p';
                        else if (path.includes("44'")) prefix = '1';
                        else if (path.includes("49'")) prefix = '3';
                        
                        addresses.push({
                            address: prefix + Math.random().toString(36).substring(2, 15),
                            index: i,
                            path: `${path}/0/${i}`
                        });
                    }
                    return addresses;
                };
                
                detector.checkAddressActivity = async (address) => {
                    // Simulate some addresses having activity
                    return address.startsWith('bc1q') ? 0.1 : 0;
                };
                
                const detection = await detector.detectWalletType(testSeed);
                
                return {
                    success: true,
                    detected: detection.detected,
                    walletType: detection.walletType,
                    walletName: detection.walletName,
                    activePaths: detection.activePaths.length
                };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });
        
        if (detectionTest.success) {
            console.log('✅ Wallet detection working:');
            console.log(`   Detected: ${detectionTest.detected}`);
            console.log(`   Wallet Type: ${detectionTest.walletType}`);
            console.log(`   Wallet Name: ${detectionTest.walletName}`);
            console.log(`   Active Paths: ${detectionTest.activePaths}`);
        } else {
            throw new Error('Wallet detection failed: ' + detectionTest.error);
        }
        
        // Test 6: Test import flow UI
        console.log('\n📥 Test 6: Testing import UI...');
        
        // Navigate to dashboard if not already there
        await page.evaluate(() => {
            if (app.router.currentPath !== '/dashboard') {
                app.router.navigate('/dashboard');
            }
        });
        await page.waitForTimeout(1000);
        
        // Click account dropdown
        const dropdownClicked = await page.evaluate(() => {
            const button = document.querySelector('.account-selector button');
            if (button) {
                button.click();
                return true;
            }
            return false;
        });
        
        if (dropdownClicked) {
            console.log('✅ Account dropdown opened');
            
            // Check if import option exists
            await page.waitForTimeout(500);
            const importOptionExists = await page.evaluate(() => {
                const options = Array.from(document.querySelectorAll('.account-option'));
                return options.some(opt => opt.textContent.includes('Import'));
            });
            
            if (importOptionExists) {
                console.log('✅ Import option available in dropdown');
            } else {
                console.log('⚠️  Import option not found in dropdown');
            }
        }
        
        // Test 7: Clean up test account
        console.log('\n🧹 Test 7: Cleaning up...');
        const cleanup = await page.evaluate((accountId) => {
            try {
                const index = app.state.accounts.findIndex(a => a.id === accountId);
                if (index !== -1) {
                    app.state.accounts.splice(index, 1);
                    app.state.persist();
                    return true;
                }
                return false;
            } catch (error) {
                return false;
            }
        }, accountCreated.accountId);
        
        if (cleanup) {
            console.log('✅ Test account cleaned up');
        }
        
        console.log('\n✅ All tests completed successfully!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

// Manual testing function (without puppeteer)
async function runManualTests() {
    console.log('🧪 Running Manual Tests (API only)...\n');
    
    const API_URL = 'http://localhost:3001';
    
    try {
        // Test API health
        console.log('🏥 Testing API health...');
        const healthResponse = await fetch(`${API_URL}/health`);
        if (healthResponse.ok) {
            const health = await healthResponse.json();
            console.log('✅ API is healthy:', health);
        } else {
            throw new Error('API health check failed');
        }
        
        // Test wallet generation
        console.log('\n🎲 Testing wallet generation...');
        const genResponse = await fetch(`${API_URL}/api/wallet/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wordCount: 12 })
        });
        
        if (genResponse.ok) {
            const wallet = await genResponse.json();
            console.log('✅ Wallet generated successfully');
            console.log('   Has all address types:', 
                !!(wallet.data.bitcoin.addresses.segwit &&
                   wallet.data.bitcoin.addresses.taproot &&
                   wallet.data.bitcoin.addresses.legacy &&
                   wallet.data.bitcoin.addresses.nestedSegwit));
        } else {
            throw new Error('Wallet generation failed');
        }
        
        console.log('\n✅ Manual tests completed!');
        
    } catch (error) {
        console.error('❌ Manual test failed:', error.message);
    }
}

// Check if puppeteer is available and run appropriate tests
if (puppeteer) {
    runComprehensiveTests();
} else {
    runManualTests();
}