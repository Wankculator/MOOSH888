// Automated Test Runner for MOOSH Wallet
const http = require('http');
const https = require('https');
const fs = require('fs');

class TestRunner {
    constructor() {
        this.results = [];
        this.apiUrl = 'http://localhost:3001';
        this.frontendUrl = 'http://localhost:3333';
    }

    log(test, status, details = '') {
        const result = {
            timestamp: new Date().toISOString(),
            test,
            status,
            details
        };
        this.results.push(result);
        console.log(`[${status}] ${test}: ${details}`);
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async testApiHealth() {
        try {
            const response = await this.httpGet(`${this.apiUrl}/health`);
            const data = JSON.parse(response);
            if (data.status === 'ok') {
                this.log('API Health Check', 'PASS', `API version ${data.version} is running`);
                return true;
            }
            this.log('API Health Check', 'FAIL', 'Invalid response');
            return false;
        } catch (error) {
            this.log('API Health Check', 'FAIL', error.message);
            return false;
        }
    }

    async testWalletGeneration() {
        try {
            const response = await this.httpPost(`${this.apiUrl}/api/wallet/generate`, {
                wordCount: 12,
                network: 'MAINNET'
            });
            const data = JSON.parse(response);
            
            if (data.success && data.data) {
                const addresses = data.data.bitcoin.addresses;
                const hasAll = !!(addresses.segwit && addresses.taproot && 
                                 addresses.legacy && addresses.nestedSegwit);
                
                if (hasAll) {
                    this.log('Wallet Generation', 'PASS', 'All address types generated');
                    this.log('Address Types', 'INFO', 
                        `SegWit: ${addresses.segwit.substring(0, 10)}..., ` +
                        `Taproot: ${addresses.taproot.substring(0, 10)}..., ` +
                        `Legacy: ${addresses.legacy.substring(0, 10)}..., ` +
                        `Nested: ${addresses.nestedSegwit.substring(0, 10)}...`
                    );
                    return true;
                }
                this.log('Wallet Generation', 'FAIL', 'Missing address types');
                return false;
            }
            this.log('Wallet Generation', 'FAIL', 'Invalid response structure');
            return false;
        } catch (error) {
            this.log('Wallet Generation', 'FAIL', error.message);
            return false;
        }
    }

    async testCustomPath() {
        try {
            const response = await this.httpPost(`${this.apiUrl}/api/wallet/test-paths`, {
                mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
                customPath: "m/84'/0'/0'",
                addressCount: 3
            });
            const data = JSON.parse(response);
            
            if (data.success && data.addresses && data.addresses.length === 3) {
                this.log('Custom Path Derivation', 'PASS', 
                    `Generated ${data.addresses.length} addresses for path ${data.path}`);
                return true;
            }
            this.log('Custom Path Derivation', 'FAIL', 'Invalid response');
            return false;
        } catch (error) {
            this.log('Custom Path Derivation', 'FAIL', error.message);
            return false;
        }
    }

    async testFrontendLoad() {
        try {
            const response = await this.httpGet(this.frontendUrl);
            if (response.includes('MOOSH Wallet') && response.includes('moosh-wallet.js')) {
                this.log('Frontend Load', 'PASS', 'Index page loads correctly');
                return true;
            }
            this.log('Frontend Load', 'FAIL', 'Missing expected content');
            return false;
        } catch (error) {
            this.log('Frontend Load', 'FAIL', error.message);
            return false;
        }
    }

    async testJavaScriptFile() {
        try {
            const response = await this.httpGet(`${this.frontendUrl}/js/moosh-wallet.js`);
            
            // Check for key classes
            const hasWalletDetector = response.includes('class WalletDetector');
            const hasStateManager = response.includes('class StateManager');
            const hasMultiAccountModal = response.includes('class MultiAccountModal');
            const hasDetectionMethods = response.includes('showDetectionResults') && 
                                      response.includes('proceedWithImport');
            
            if (hasWalletDetector) {
                this.log('WalletDetector Class', 'PASS', 'Class found in JavaScript file');
            } else {
                this.log('WalletDetector Class', 'FAIL', 'Class not found');
            }
            
            if (hasDetectionMethods) {
                this.log('Detection Methods', 'PASS', 'Import detection methods found');
            } else {
                this.log('Detection Methods', 'FAIL', 'Import detection methods missing');
            }
            
            // Check for Fix Addresses button removal
            const fixButtonRegex = /Fix\s+(Missing\s+)?Addresses/gi;
            const fixButtonMatches = response.match(fixButtonRegex) || [];
            const validMatches = fixButtonMatches.filter(match => {
                const context = response.substring(
                    response.indexOf(match) - 50,
                    response.indexOf(match) + 50
                );
                return !context.includes('// Removed') && !context.includes('comment');
            });
            
            if (validMatches.length === 0) {
                this.log('Fix Addresses Button', 'PASS', 'Button has been removed');
            } else {
                this.log('Fix Addresses Button', 'WARN', 
                    `Found ${validMatches.length} references to Fix Addresses`);
            }
            
            return hasWalletDetector && hasDetectionMethods;
        } catch (error) {
            this.log('JavaScript File Test', 'FAIL', error.message);
            return false;
        }
    }

    async testImportDetection() {
        try {
            // Test the import endpoint with detection
            const response = await this.httpPost(`${this.apiUrl}/api/wallet/import`, {
                mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
                walletType: 'test'
            });
            const data = JSON.parse(response);
            
            if (data.success && data.data) {
                const addresses = data.data.bitcoin.addresses;
                const hasAll = !!(addresses.segwit && addresses.taproot && 
                                 addresses.legacy && addresses.nestedSegwit);
                
                if (hasAll) {
                    this.log('Import with Detection', 'PASS', 'All addresses generated on import');
                    return true;
                }
            }
            this.log('Import with Detection', 'FAIL', 'Missing addresses on import');
            return false;
        } catch (error) {
            this.log('Import with Detection', 'FAIL', error.message);
            return false;
        }
    }

    async testMempool() {
        try {
            // Test external API connectivity (for wallet detection)
            const response = await new Promise((resolve, reject) => {
                https.get('https://mempool.space/api/blocks/tip/height', (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => resolve(data));
                }).on('error', reject);
            });
            
            const height = parseInt(response);
            if (height > 0) {
                this.log('External API Access', 'PASS', 
                    `Mempool.space accessible (block height: ${height})`);
                return true;
            }
            this.log('External API Access', 'FAIL', 'Invalid response from mempool.space');
            return false;
        } catch (error) {
            this.log('External API Access', 'WARN', 
                'Cannot reach mempool.space - wallet detection may be limited');
            return true; // Don't fail the test
        }
    }

    httpGet(url) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https') ? https : http;
            protocol.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });
    }

    httpPost(url, body) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(body);
            const urlObj = new URL(url);
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };
            
            const req = http.request(options, (res) => {
                let responseData = '';
                res.on('data', chunk => responseData += chunk);
                res.on('end', () => resolve(responseData));
            });
            
            req.on('error', reject);
            req.write(data);
            req.end();
        });
    }

    async runAllTests() {
        console.log('🧪 MOOSH Wallet Automated Test Suite\n');
        console.log('=' .repeat(50));
        
        const tests = [
            { name: 'API Health', fn: () => this.testApiHealth() },
            { name: 'Wallet Generation', fn: () => this.testWalletGeneration() },
            { name: 'Custom Path Derivation', fn: () => this.testCustomPath() },
            { name: 'Import Detection', fn: () => this.testImportDetection() },
            { name: 'Frontend Load', fn: () => this.testFrontendLoad() },
            { name: 'JavaScript Integration', fn: () => this.testJavaScriptFile() },
            { name: 'External API Access', fn: () => this.testMempool() }
        ];
        
        let passed = 0;
        let failed = 0;
        let warnings = 0;
        
        for (const test of tests) {
            console.log(`\nRunning: ${test.name}`);
            await this.delay(500);
            
            try {
                const result = await test.fn();
                if (result) passed++;
                else failed++;
            } catch (error) {
                this.log(test.name, 'ERROR', error.message);
                failed++;
            }
        }
        
        // Count warnings
        warnings = this.results.filter(r => r.status === 'WARN').length;
        
        // Generate summary
        console.log('\n' + '=' .repeat(50));
        console.log('📊 Test Summary\n');
        console.log(`Total Tests: ${tests.length}`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`⚠️  Warnings: ${warnings}`);
        console.log('\n' + '=' .repeat(50));
        
        // Save detailed results
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: tests.length,
                passed,
                failed,
                warnings
            },
            results: this.results
        };
        
        fs.writeFileSync('test-results.json', JSON.stringify(report, null, 2));
        console.log('\n📄 Detailed results saved to test-results.json');
        
        if (failed === 0) {
            console.log('\n🎉 All tests passed! Implementation is working correctly.');
        } else {
            console.log('\n⚠️  Some tests failed. Check the details above.');
        }
    }
}

// Run the tests
const runner = new TestRunner();
runner.runAllTests().catch(console.error);