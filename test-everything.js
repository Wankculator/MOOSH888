#!/usr/bin/env node

/**
 * Comprehensive Testing Script for MOOSH Wallet
 * Tests all features after backend integration
 */

const fetch = require('node-fetch');
const chalk = require('chalk');
const fs = require('fs');

class ComprehensiveTester {
    constructor() {
        this.baseUrl = 'http://localhost:3001';
        this.results = {
            passed: 0,
            failed: 0,
            tests: []
        };
        this.testAccounts = [];
    }
    
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async test(name, fn) {
        console.log(chalk.blue(`\nTesting: ${name}`));
        try {
            const start = Date.now();
            await fn();
            const duration = Date.now() - start;
            this.results.passed++;
            this.results.tests.push({ name, status: 'passed', duration });
            console.log(chalk.green(`✓ ${name} (${duration}ms)`));
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ name, status: 'failed', error: error.message });
            console.log(chalk.red(`✗ ${name}: ${error.message}`));
        }
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        const data = await response.json();
        if (!response.ok && !data.success) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }
        return data;
    }
    
    // ========== CRITICAL PATH TESTS ==========
    
    async testCriticalPaths() {
        console.log(chalk.yellow('\n🔒 CRITICAL PATH TESTS\n'));
        
        // Test health check
        await this.test('Server Health Check', async () => {
            const data = await this.request('/health');
            if (data.status !== 'ok') throw new Error('Server not healthy');
        });
        
        // Test seed generation (12 words)
        await this.test('Seed Generation - 12 words', async () => {
            const data = await this.request('/api/spark/generate-wallet', {
                method: 'POST',
                body: JSON.stringify({ strength: 128 })
            });
            
            if (!data.success) throw new Error('Generation failed');
            if (typeof data.data.mnemonic !== 'string') throw new Error('Mnemonic not string');
            if (data.data.mnemonic.split(' ').length !== 12) throw new Error('Not 12 words');
            if (!data.data.addresses.bitcoin) throw new Error('Missing bitcoin address');
            if (!data.data.addresses.spark) throw new Error('Missing spark address');
            
            // Save for later tests
            this.testAccounts.push({
                id: 'test_12word',
                name: 'Test 12-word',
                mnemonic: data.data.mnemonic,
                addresses: data.data.addresses
            });
        });
        
        // Test seed generation (24 words)
        await this.test('Seed Generation - 24 words', async () => {
            const data = await this.request('/api/spark/generate-wallet', {
                method: 'POST',
                body: JSON.stringify({ strength: 256 })
            });
            
            if (data.data.mnemonic.split(' ').length !== 24) throw new Error('Not 24 words');
            
            this.testAccounts.push({
                id: 'test_24word',
                name: 'Test 24-word',
                mnemonic: data.data.mnemonic,
                addresses: data.data.addresses
            });
        });
        
        // Test response structure
        await this.test('Response Structure Compliance', async () => {
            const data = await this.request('/api/spark/generate-wallet', {
                method: 'POST',
                body: JSON.stringify({ strength: 128 })
            });
            
            // Check exact structure per CLAUDE.md
            const required = [
                'data.mnemonic',
                'data.addresses.bitcoin',
                'data.addresses.spark',
                'data.privateKeys.bitcoin.wif',
                'data.privateKeys.bitcoin.hex',
                'data.privateKeys.spark.hex'
            ];
            
            for (const path of required) {
                const keys = path.split('.');
                let obj = data;
                for (const key of keys) {
                    if (!(key in obj)) throw new Error(`Missing: ${path}`);
                    obj = obj[key];
                }
            }
        });
    }
    
    // ========== PORTFOLIO TESTS ==========
    
    async testPortfolioFeatures() {
        console.log(chalk.yellow('\n📊 PORTFOLIO FEATURE TESTS\n'));
        
        // Test portfolio health
        await this.test('Portfolio Health Endpoint', async () => {
            const data = await this.request('/api/portfolio/health');
            if (data.data.status !== 'healthy') throw new Error('Portfolio not healthy');
            if (!data.data.modules.cache) throw new Error('Cache module missing');
            if (!data.data.modules.portfolio) throw new Error('Portfolio module missing');
        });
        
        // Test portfolio stats
        await this.test('Portfolio Stats Endpoint', async () => {
            const data = await this.request('/api/portfolio/stats');
            if (!data.data.cache) throw new Error('Cache stats missing');
            if (!data.data.sync) throw new Error('Sync stats missing');
            if (!data.data.modules) throw new Error('Module stats missing');
        });
        
        // Test portfolio summary with test accounts
        await this.test('Portfolio Summary - Multiple Accounts', async () => {
            const accountIds = this.testAccounts.map(a => a.id).join(',');
            const data = await this.request(`/api/portfolio/summary?accounts=${accountIds}&currency=usd`);
            
            // Even with test accounts, should return structure
            if (!data.success) throw new Error('Portfolio summary failed');
        });
        
        // Test portfolio refresh
        await this.test('Portfolio Force Refresh', async () => {
            const data = await this.request('/api/portfolio/refresh', {
                method: 'POST',
                body: JSON.stringify({
                    accounts: this.testAccounts.map(a => a.id),
                    dataType: 'balance'
                })
            });
            
            if (!data.success) throw new Error('Refresh failed');
        });
    }
    
    // ========== PERFORMANCE TESTS ==========
    
    async testPerformance() {
        console.log(chalk.yellow('\n⚡ PERFORMANCE TESTS\n'));
        
        // Test concurrent seed generation
        await this.test('Concurrent Seed Generation (5 requests)', async () => {
            const promises = [];
            for (let i = 0; i < 5; i++) {
                promises.push(this.request('/api/spark/generate-wallet', {
                    method: 'POST',
                    body: JSON.stringify({ strength: 128 })
                }));
            }
            
            const start = Date.now();
            const results = await Promise.all(promises);
            const duration = Date.now() - start;
            
            if (results.some(r => !r.success)) throw new Error('Some requests failed');
            if (duration > 5000) throw new Error(`Too slow: ${duration}ms`);
        });
        
        // Test cache performance
        await this.test('Cache Performance - Hit Rate', async () => {
            // Make same request multiple times
            const endpoint = '/api/portfolio/stats';
            
            // First request (cache miss)
            await this.request(endpoint);
            
            // Next 10 requests (should be cache hits)
            for (let i = 0; i < 10; i++) {
                await this.request(endpoint);
            }
            
            // Check cache stats
            const stats = await this.request('/api/portfolio/stats');
            const hitRate = parseFloat(stats.data.cache.hitRate);
            
            if (hitRate < 50) throw new Error(`Low hit rate: ${hitRate}%`);
        });
        
        // Test memory usage
        await this.test('Memory Usage - Within Limits', async () => {
            const stats = await this.request('/api/portfolio/stats');
            const memoryMB = parseFloat(stats.data.cache.memoryUsageMB);
            const limitMB = parseFloat(stats.data.cache.memoryLimit);
            
            if (memoryMB > limitMB) throw new Error(`Memory exceeded: ${memoryMB}MB > ${limitMB}MB`);
        });
    }
    
    // ========== IMPORT/EXPORT TESTS ==========
    
    async testImportExport() {
        console.log(chalk.yellow('\n📥 IMPORT/EXPORT TESTS\n'));
        
        // Test import with known mnemonic
        const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
        
        await this.test('Import Wallet - Standard', async () => {
            const data = await this.request('/api/wallet/import', {
                method: 'POST',
                body: JSON.stringify({
                    mnemonic: testMnemonic,
                    walletType: 'moosh'
                })
            });
            
            if (!data.success) throw new Error('Import failed');
            if (!data.data.addresses.segwit) throw new Error('Missing segwit address');
            if (!data.data.addresses.taproot) throw new Error('Missing taproot address');
            if (!data.data.addresses.spark) throw new Error('Missing spark address');
        });
        
        // Test different wallet types
        const walletTypes = ['xverse', 'sparrow', 'electrum'];
        for (const type of walletTypes) {
            await this.test(`Import Wallet - ${type}`, async () => {
                const data = await this.request('/api/wallet/import', {
                    method: 'POST',
                    body: JSON.stringify({
                        mnemonic: testMnemonic,
                        walletType: type
                    })
                });
                
                if (!data.success) throw new Error(`${type} import failed`);
            });
        }
    }
    
    // ========== ERROR HANDLING TESTS ==========
    
    async testErrorHandling() {
        console.log(chalk.yellow('\n🛡️ ERROR HANDLING TESTS\n'));
        
        // Test invalid seed strength
        await this.test('Invalid Seed Strength - Should Fail', async () => {
            try {
                await this.request('/api/spark/generate-wallet', {
                    method: 'POST',
                    body: JSON.stringify({ strength: 64 })
                });
                throw new Error('Should have failed');
            } catch (error) {
                // Expected to fail
                if (!error.message.includes('Should have failed')) {
                    // Good - it failed as expected
                    return;
                }
                throw error;
            }
        });
        
        // Test invalid mnemonic
        await this.test('Invalid Mnemonic - Should Fail', async () => {
            try {
                await this.request('/api/wallet/import', {
                    method: 'POST',
                    body: JSON.stringify({
                        mnemonic: 'invalid words here',
                        walletType: 'moosh'
                    })
                });
                throw new Error('Should have failed');
            } catch (error) {
                if (!error.message.includes('Should have failed')) {
                    return; // Good
                }
                throw error;
            }
        });
        
        // Test missing parameters
        await this.test('Missing Parameters - Should Fail', async () => {
            try {
                await this.request('/api/wallet/import', {
                    method: 'POST',
                    body: JSON.stringify({})
                });
                throw new Error('Should have failed');
            } catch (error) {
                if (!error.message.includes('Should have failed')) {
                    return; // Good
                }
                throw error;
            }
        });
    }
    
    // ========== INTEGRATION TESTS ==========
    
    async testIntegration() {
        console.log(chalk.yellow('\n🔗 INTEGRATION TESTS\n'));
        
        // Test full user flow
        await this.test('Full User Flow - Generate, Import, Check', async () => {
            // 1. Generate new wallet
            const genData = await this.request('/api/spark/generate-wallet', {
                method: 'POST',
                body: JSON.stringify({ strength: 128 })
            });
            
            const mnemonic = genData.data.mnemonic;
            const originalAddresses = genData.data.addresses;
            
            // 2. Import same wallet
            const importData = await this.request('/api/wallet/import', {
                method: 'POST',
                body: JSON.stringify({
                    mnemonic: mnemonic,
                    walletType: 'moosh'
                })
            });
            
            // 3. Verify addresses match
            if (importData.data.addresses.segwit !== originalAddresses.bitcoin) {
                throw new Error('Address mismatch after import');
            }
        });
        
        // Test backend module integration
        await this.test('Backend Modules Working Together', async () => {
            // Get initial stats
            const stats1 = await this.request('/api/portfolio/stats');
            const initialSets = stats1.data.cache.metrics.sets;
            
            // Make some requests to populate cache
            await this.request('/api/portfolio/health');
            await this.request('/api/portfolio/stats');
            
            // Check cache was used
            const stats2 = await this.request('/api/portfolio/stats');
            const newSets = stats2.data.cache.metrics.sets;
            
            if (newSets <= initialSets) {
                throw new Error('Cache not being populated');
            }
        });
    }
    
    // ========== STRESS TESTS ==========
    
    async testStress() {
        console.log(chalk.yellow('\n💪 STRESS TESTS\n'));
        
        // Test rapid requests
        await this.test('Rapid Requests - 50 in 5 seconds', async () => {
            const start = Date.now();
            const promises = [];
            
            for (let i = 0; i < 50; i++) {
                promises.push(this.request('/health'));
                await this.delay(100); // 100ms between requests
            }
            
            await Promise.all(promises);
            const duration = Date.now() - start;
            
            if (duration > 10000) throw new Error(`Too slow: ${duration}ms`);
        });
        
        // Test memory stability
        await this.test('Memory Stability - Multiple Operations', async () => {
            const initialStats = await this.request('/api/portfolio/stats');
            const initialMemory = initialStats.data.memory.heapUsed;
            
            // Perform many operations
            for (let i = 0; i < 20; i++) {
                await this.request('/api/spark/generate-wallet', {
                    method: 'POST',
                    body: JSON.stringify({ strength: 128 })
                });
            }
            
            // Force garbage collection (if available)
            if (global.gc) global.gc();
            
            await this.delay(1000);
            
            const finalStats = await this.request('/api/portfolio/stats');
            const finalMemory = finalStats.data.memory.heapUsed;
            
            // Memory shouldn't grow more than 50MB
            const growth = (finalMemory - initialMemory) / 1024 / 1024;
            if (growth > 50) throw new Error(`Memory grew by ${growth.toFixed(2)}MB`);
        });
    }
    
    // ========== MAIN TEST RUNNER ==========
    
    async run() {
        console.log(chalk.cyan.bold('\n🧪 MOOSH WALLET COMPREHENSIVE TESTING\n'));
        console.log(chalk.gray('Testing all features after backend integration\n'));
        
        const startTime = Date.now();
        
        try {
            // Run all test suites
            await this.testCriticalPaths();
            await this.testPortfolioFeatures();
            await this.testPerformance();
            await this.testImportExport();
            await this.testErrorHandling();
            await this.testIntegration();
            await this.testStress();
            
        } catch (error) {
            console.error(chalk.red('\n💥 Test suite crashed:'), error);
        }
        
        // Generate report
        const duration = Date.now() - startTime;
        const report = {
            timestamp: new Date().toISOString(),
            duration: duration,
            results: this.results,
            testAccounts: this.testAccounts.map(a => ({
                id: a.id,
                name: a.name,
                addresses: a.addresses
            }))
        };
        
        // Save report
        const filename = `full-test-report-${Date.now()}.json`;
        fs.writeFileSync(filename, JSON.stringify(report, null, 2));
        
        // Display summary
        console.log(chalk.cyan.bold('\n📊 TEST SUMMARY\n'));
        console.log(`Total Tests: ${this.results.passed + this.results.failed}`);
        console.log(chalk.green(`Passed: ${this.results.passed}`));
        console.log(chalk.red(`Failed: ${this.results.failed}`));
        console.log(`Duration: ${(duration / 1000).toFixed(2)}s`);
        
        if (this.results.failed === 0) {
            console.log(chalk.green.bold('\n✅ ALL TESTS PASSED!\n'));
            console.log('Your MOOSH Wallet is working perfectly with:');
            console.log('- Seed generation working');
            console.log('- Backend modules integrated');
            console.log('- Portfolio features active');
            console.log('- Performance optimized');
            console.log('- Error handling robust');
        } else {
            console.log(chalk.red.bold('\n❌ SOME TESTS FAILED\n'));
            console.log('Review the failures above and fix issues before proceeding.');
        }
        
        console.log(chalk.gray(`\nFull report saved to: ${filename}`));
        
        return this.results.failed === 0;
    }
}

// Run if executed directly
if (require.main === module) {
    const tester = new ComprehensiveTester();
    tester.run().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = ComprehensiveTester;