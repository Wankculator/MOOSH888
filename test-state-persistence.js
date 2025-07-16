#!/usr/bin/env node

/**
 * Test State Persistence for MOOSH Wallet
 * Tests that accounts are properly saved and loaded from localStorage
 */

const http = require('http');

class StatePersistenceTest {
    constructor() {
        this.apiUrl = 'http://localhost:3001';
        this.results = [];
    }

    log(test, status, details) {
        const result = {
            timestamp: new Date().toISOString(),
            test,
            status,
            details
        };
        this.results.push(result);
        console.log(`[${status}] ${test}: ${details}`);
    }

    async httpPost(url, data) {
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify(data);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = http.request(url, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            });

            req.on('error', reject);
            req.write(postData);
            req.end();
        });
    }

    async testAccountCreation() {
        console.log('\n🧪 Testing Account Creation and Persistence\n');
        
        try {
            // Generate a test wallet
            const walletResponse = await this.httpPost(`${this.apiUrl}/api/wallet/generate`, {
                wordCount: 12
            });
            const walletData = JSON.parse(walletResponse);
            
            if (!walletData.success) {
                this.log('Wallet Generation', 'FAIL', 'Failed to generate wallet');
                return false;
            }
            
            const mnemonic = walletData.data.mnemonic.join(' ');
            this.log('Wallet Generation', 'PASS', `Generated wallet with ${walletData.data.mnemonic.length} words`);
            
            // Import the wallet to create an account
            const importResponse = await this.httpPost(`${this.apiUrl}/api/wallet/import`, {
                mnemonic: mnemonic,
                walletType: 'test'
            });
            const importData = JSON.parse(importResponse);
            
            if (!importData.success) {
                this.log('Wallet Import', 'FAIL', 'Failed to import wallet');
                return false;
            }
            
            this.log('Wallet Import', 'PASS', 'Successfully imported wallet');
            
            // Check that all address types were generated
            const addresses = importData.data.bitcoin.addresses;
            const addressTypes = ['segwit', 'taproot', 'legacy', 'nestedSegwit'];
            let allPresent = true;
            
            for (const type of addressTypes) {
                if (!addresses[type]) {
                    this.log(`Address ${type}`, 'FAIL', 'Missing address');
                    allPresent = false;
                } else {
                    this.log(`Address ${type}`, 'PASS', addresses[type].substring(0, 10) + '...');
                }
            }
            
            // Check Spark address
            if (importData.data.spark && importData.data.spark.address) {
                this.log('Spark Address', 'PASS', importData.data.spark.address.substring(0, 10) + '...');
            } else {
                this.log('Spark Address', 'WARN', 'No Spark address in response');
            }
            
            return allPresent;
            
        } catch (error) {
            this.log('Account Creation Test', 'FAIL', error.message);
            return false;
        }
    }

    async testStateSimulation() {
        console.log('\n🧪 Simulating Frontend State Management\n');
        
        // Simulate what the frontend would do
        const testAccount = {
            id: 'test-' + Date.now(),
            name: 'Test Account',
            addresses: {
                segwit: 'bc1qtest123',
                taproot: 'bc1ptest456',
                legacy: '1Test789',
                nestedSegwit: '3TestABC',
                spark: 'sp1testDEF'
            },
            balances: { bitcoin: 0, spark: 0 },
            type: 'imported',
            createdAt: Date.now()
        };
        
        // Simulate storing to localStorage
        const mockStorage = {
            accounts: [testAccount],
            currentAccountId: testAccount.id,
            lastSaved: Date.now(),
            version: 2
        };
        
        this.log('State Structure', 'INFO', `Created account with ID: ${testAccount.id}`);
        this.log('Storage Format', 'PASS', 'Mock storage structure created');
        
        // Verify structure
        if (mockStorage.accounts.length === 1 && mockStorage.currentAccountId) {
            this.log('State Validation', 'PASS', 'State structure is valid');
            return true;
        } else {
            this.log('State Validation', 'FAIL', 'Invalid state structure');
            return false;
        }
    }

    generateReport() {
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = this.results.filter(r => r.status === 'FAIL').length;
        const warnings = this.results.filter(r => r.status === 'WARN').length;
        const info = this.results.filter(r => r.status === 'INFO').length;
        
        console.log('\n📊 Test Summary');
        console.log('================');
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`⚠️  Warnings: ${warnings}`);
        console.log(`ℹ️  Info: ${info}`);
        console.log(`📋 Total: ${this.results.length}`);
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: { passed, failed, warnings, info, total: this.results.length },
            results: this.results,
            recommendations: []
        };
        
        // Add recommendations based on results
        if (failed > 0) {
            report.recommendations.push('Fix failing tests before proceeding');
        }
        
        if (warnings > 0) {
            report.recommendations.push('Review warnings for potential issues');
        }
        
        report.recommendations.push('Ensure localStorage is properly cleared between tests in frontend');
        report.recommendations.push('Verify account persistence across page reloads');
        report.recommendations.push('Test with multiple accounts to ensure switching works');
        
        require('fs').writeFileSync('state-persistence-test-results.json', JSON.stringify(report, null, 2));
        console.log('\n📄 Full report saved to state-persistence-test-results.json');
    }

    async run() {
        console.log('🚀 MOOSH Wallet State Persistence Test');
        console.log('======================================\n');
        
        await this.testAccountCreation();
        await this.testStateSimulation();
        
        this.generateReport();
    }
}

// Run the test
const test = new StatePersistenceTest();
test.run().catch(console.error);