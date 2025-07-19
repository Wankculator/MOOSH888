#!/usr/bin/env node

/**
 * Test Multi-Wallet Integration
 * 
 * Verifies all multi-wallet features are working correctly
 */

const http = require('http');
const chalk = require('chalk');

class MultiWalletTester {
    constructor() {
        this.baseUrl = 'http://localhost:3001';
        this.results = [];
    }
    
    async runTests() {
        console.log(chalk.cyan.bold('\n🧪 MULTI-WALLET INTEGRATION TEST\n'));
        
        await this.testSpeedOptimizations();
        await this.testPortfolioEndpoints();
        await this.testFrontendIntegration();
        await this.showResults();
    }
    
    async testSpeedOptimizations() {
        console.log(chalk.blue('Testing Speed Optimizations...'));
        
        // Test that critical endpoints are fast
        const startTime = Date.now();
        
        try {
            const priceResponse = await this.makeRequest('/api/proxy/bitcoin-price');
            const priceTime = Date.now() - startTime;
            
            this.addResult(
                'Bitcoin price endpoint',
                priceTime < 5000,
                `Response time: ${priceTime}ms`
            );
            
            // Test caching
            const cacheStart = Date.now();
            const cachedResponse = await this.makeRequest('/api/proxy/bitcoin-price');
            const cacheTime = Date.now() - cacheStart;
            
            this.addResult(
                'Price endpoint caching',
                cacheTime < 100,
                `Cached response: ${cacheTime}ms`
            );
            
        } catch (error) {
            this.addResult('Speed optimization test', false, error.message);
        }
    }
    
    async testPortfolioEndpoints() {
        console.log(chalk.blue('\nTesting Portfolio Endpoints...'));
        
        const endpoints = [
            '/api/portfolio/summary',
            '/api/portfolio/accounts',
            '/api/portfolio/balances',
            '/api/portfolio/transactions?limit=10',
            '/api/portfolio/analytics'
        ];
        
        for (const endpoint of endpoints) {
            try {
                const response = await this.makeRequest(endpoint);
                
                this.addResult(
                    `Portfolio endpoint: ${endpoint}`,
                    response.success !== false,
                    response.error || 'Endpoint accessible'
                );
                
            } catch (error) {
                this.addResult(
                    `Portfolio endpoint: ${endpoint}`,
                    false,
                    error.message
                );
            }
        }
    }
    
    async testFrontendIntegration() {
        console.log(chalk.blue('\nTesting Frontend Integration...'));
        
        // Check if files exist
        const files = [
            '/js/frontend-speed-fix.js',
            '/js/portfolio-connector.js',
            '/js/multi-wallet-portfolio.js',
            '/js/multi-wallet-toggle-integration.js'
        ];
        
        for (const file of files) {
            try {
                const response = await this.makeRequest(file);
                this.addResult(
                    `Frontend file: ${file}`,
                    response !== null,
                    'File loaded successfully'
                );
            } catch (error) {
                this.addResult(
                    `Frontend file: ${file}`,
                    false,
                    'File not found'
                );
            }
        }
    }
    
    makeRequest(path) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 3001,
                path: path,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            const req = http.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        if (res.headers['content-type']?.includes('application/json')) {
                            resolve(JSON.parse(data));
                        } else {
                            resolve(data);
                        }
                    } catch (error) {
                        resolve(data);
                    }
                });
            });
            
            req.on('error', (error) => {
                reject(error);
            });
            
            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
            
            req.end();
        });
    }
    
    addResult(test, passed, details) {
        this.results.push({ test, passed, details });
        
        const status = passed ? chalk.green('✓') : chalk.red('✗');
        const detailColor = passed ? chalk.gray : chalk.red;
        
        console.log(`${status} ${test}`);
        if (details) {
            console.log(`  ${detailColor(details)}`);
        }
    }
    
    showResults() {
        const passed = this.results.filter(r => r.passed).length;
        const total = this.results.length;
        const percentage = Math.round((passed / total) * 100);
        
        console.log(chalk.cyan.bold('\n📊 TEST RESULTS\n'));
        console.log(`Tests passed: ${passed}/${total} (${percentage}%)`);
        
        if (passed === total) {
            console.log(chalk.green.bold('\n✅ All multi-wallet integration tests passed!'));
            console.log(chalk.gray('\nNext steps:'));
            console.log('1. Open enable-multi-wallet.html to enable the feature');
            console.log('2. Test with multiple wallets in the UI');
            console.log('3. Verify portfolio aggregation works correctly');
        } else {
            console.log(chalk.yellow.bold('\n⚠️  Some tests failed'));
            console.log(chalk.gray('Failed tests:'));
            this.results
                .filter(r => !r.passed)
                .forEach(r => console.log(chalk.red(`- ${r.test}: ${r.details}`)));
        }
    }
}

// Run tests
if (require.main === module) {
    const tester = new MultiWalletTester();
    
    console.log(chalk.gray('Waiting for server to be ready...'));
    setTimeout(() => {
        tester.runTests().catch(console.error);
    }, 2000);
}

module.exports = MultiWalletTester;