#!/usr/bin/env node

/**
 * MOOSH Wallet Seed Generation Test Script
 * 
 * This script tests the complete seed generation flow to ensure it's working correctly.
 * Run this after any changes to verify seed generation hasn't been broken.
 * 
 * Usage: node test-seed-generation.js
 */

const http = require('http');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m'
};

// Test configuration
const API_HOST = 'localhost';
const API_PORT = 3001;
const TIMEOUT = 15000; // 15 seconds (generation takes ~10 seconds)

console.log(`${colors.blue}🧪 MOOSH Wallet Seed Generation Test${colors.reset}\n`);

// Test 1: Check API Health
function testAPIHealth() {
    return new Promise((resolve, reject) => {
        console.log(`${colors.yellow}Test 1: Checking API health...${colors.reset}`);
        
        const options = {
            hostname: API_HOST,
            port: API_PORT,
            path: '/health',
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.status === 'ok') {
                        console.log(`${colors.green}✅ API is healthy${colors.reset}`);
                        console.log(`   Service: ${response.service}`);
                        console.log(`   Version: ${response.version}\n`);
                        resolve(true);
                    } else {
                        throw new Error('API health check failed');
                    }
                } catch (error) {
                    console.log(`${colors.red}❌ API health check failed${colors.reset}`);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`${colors.red}❌ Cannot connect to API server${colors.reset}`);
            console.log(`   Make sure the API server is running on port ${API_PORT}`);
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            console.log(`${colors.red}❌ API health check timed out${colors.reset}`);
            reject(new Error('Timeout'));
        });

        req.end();
    });
}

// Test 2: Generate 12-word wallet
function test12WordGeneration() {
    return new Promise((resolve, reject) => {
        console.log(`${colors.yellow}Test 2: Generating 12-word wallet...${colors.reset}`);
        const startTime = Date.now();
        
        const postData = JSON.stringify({ strength: 128 });
        
        const options = {
            hostname: API_HOST,
            port: API_PORT,
            path: '/api/spark/generate-wallet',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: TIMEOUT
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const duration = ((Date.now() - startTime) / 1000).toFixed(2);
                
                try {
                    const response = JSON.parse(data);
                    
                    // Validate response structure
                    if (!response.success || !response.data) {
                        throw new Error('Invalid response structure');
                    }
                    
                    const wallet = response.data;
                    
                    // Check mnemonic
                    if (!wallet.mnemonic || typeof wallet.mnemonic !== 'string') {
                        throw new Error('Mnemonic must be a string');
                    }
                    
                    const words = wallet.mnemonic.split(' ');
                    if (words.length !== 12) {
                        throw new Error(`Expected 12 words, got ${words.length}`);
                    }
                    
                    // Check addresses
                    if (!wallet.addresses || !wallet.addresses.bitcoin || !wallet.addresses.spark) {
                        throw new Error('Missing addresses');
                    }
                    
                    // Validate Bitcoin address
                    const btcAddr = wallet.addresses.bitcoin;
                    if (!btcAddr.startsWith('bc1') && !btcAddr.startsWith('1') && !btcAddr.startsWith('3')) {
                        throw new Error(`Invalid Bitcoin address format: ${btcAddr}`);
                    }
                    
                    // Validate Spark address
                    const sparkAddr = wallet.addresses.spark;
                    if (!sparkAddr.startsWith('sp1p') || (sparkAddr.length !== 65 && sparkAddr.length !== 66)) {
                        throw new Error(`Invalid Spark address format: ${sparkAddr} (length: ${sparkAddr.length})`);
                    }
                    
                    console.log(`${colors.green}✅ 12-word wallet generated successfully (${duration}s)${colors.reset}`);
                    console.log(`   Words: ${words.slice(0, 3).join(' ')}... (${words.length} words)`);
                    console.log(`   Bitcoin: ${btcAddr}`);
                    console.log(`   Spark: ${sparkAddr}\n`);
                    
                    resolve(true);
                } catch (error) {
                    console.log(`${colors.red}❌ 12-word generation failed${colors.reset}`);
                    console.log(`   Error: ${error.message}`);
                    console.log(`   Response: ${data}\n`);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`${colors.red}❌ Request failed${colors.reset}`);
            console.log(`   Error: ${error.message}\n`);
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            console.log(`${colors.red}❌ Request timed out after ${TIMEOUT/1000} seconds${colors.reset}\n`);
            reject(new Error('Timeout'));
        });

        req.write(postData);
        req.end();
    });
}

// Test 3: Generate 24-word wallet
function test24WordGeneration() {
    return new Promise((resolve, reject) => {
        console.log(`${colors.yellow}Test 3: Generating 24-word wallet...${colors.reset}`);
        const startTime = Date.now();
        
        const postData = JSON.stringify({ strength: 256 });
        
        const options = {
            hostname: API_HOST,
            port: API_PORT,
            path: '/api/spark/generate-wallet',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: TIMEOUT
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const duration = ((Date.now() - startTime) / 1000).toFixed(2);
                
                try {
                    const response = JSON.parse(data);
                    
                    // Validate response
                    if (!response.success || !response.data) {
                        throw new Error('Invalid response structure');
                    }
                    
                    const wallet = response.data;
                    const words = wallet.mnemonic.split(' ');
                    
                    if (words.length !== 24) {
                        throw new Error(`Expected 24 words, got ${words.length}`);
                    }
                    
                    console.log(`${colors.green}✅ 24-word wallet generated successfully (${duration}s)${colors.reset}`);
                    console.log(`   Words: ${words.slice(0, 3).join(' ')}... (${words.length} words)`);
                    console.log(`   Bitcoin: ${wallet.addresses.bitcoin}`);
                    console.log(`   Spark: ${wallet.addresses.spark}\n`);
                    
                    resolve(true);
                } catch (error) {
                    console.log(`${colors.red}❌ 24-word generation failed${colors.reset}`);
                    console.log(`   Error: ${error.message}\n`);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.log(`${colors.red}❌ Request failed${colors.reset}`);
            console.log(`   Error: ${error.message}\n`);
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            console.log(`${colors.red}❌ Request timed out${colors.reset}\n`);
            reject(new Error('Timeout'));
        });

        req.write(postData);
        req.end();
    });
}

// Test 4: Validate response structure
function testResponseStructure() {
    return new Promise((resolve, reject) => {
        console.log(`${colors.yellow}Test 4: Validating response structure...${colors.reset}`);
        
        const postData = JSON.stringify({ strength: 128 });
        
        const options = {
            hostname: API_HOST,
            port: API_PORT,
            path: '/api/spark/generate-wallet',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: TIMEOUT
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    const wallet = response.data;
                    
                    // Check all required fields
                    const requiredFields = [
                        'mnemonic',
                        'addresses.bitcoin',
                        'addresses.spark',
                        'privateKeys.bitcoin.hex',
                        'privateKeys.spark.hex',
                        'bitcoinAddresses.segwit',
                        'bitcoinAddresses.taproot',
                        'bitcoinAddresses.legacy'
                    ];
                    
                    const missingFields = [];
                    
                    requiredFields.forEach(field => {
                        const parts = field.split('.');
                        let value = wallet;
                        
                        for (const part of parts) {
                            if (value && value[part] !== undefined) {
                                value = value[part];
                            } else {
                                missingFields.push(field);
                                break;
                            }
                        }
                    });
                    
                    if (missingFields.length > 0) {
                        throw new Error(`Missing fields: ${missingFields.join(', ')}`);
                    }
                    
                    console.log(`${colors.green}✅ Response structure is valid${colors.reset}`);
                    console.log(`   All required fields present`);
                    console.log(`   Mnemonic format: ${typeof wallet.mnemonic}`);
                    console.log(`   Word count: ${wallet.wordCount || 'not specified'}\n`);
                    
                    resolve(true);
                } catch (error) {
                    console.log(`${colors.red}❌ Response structure validation failed${colors.reset}`);
                    console.log(`   Error: ${error.message}\n`);
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// Run all tests
async function runTests() {
    console.log(`Testing API at: http://${API_HOST}:${API_PORT}\n`);
    
    let passed = 0;
    let failed = 0;
    
    try {
        await testAPIHealth();
        passed++;
    } catch (error) {
        failed++;
    }
    
    try {
        await test12WordGeneration();
        passed++;
    } catch (error) {
        failed++;
    }
    
    try {
        await test24WordGeneration();
        passed++;
    } catch (error) {
        failed++;
    }
    
    try {
        await testResponseStructure();
        passed++;
    } catch (error) {
        failed++;
    }
    
    // Summary
    console.log(`${colors.magenta}${'='.repeat(50)}${colors.reset}`);
    console.log(`${colors.magenta}Test Summary:${colors.reset}`);
    console.log(`${colors.green}  Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}  Failed: ${failed}${colors.reset}`);
    console.log(`${colors.magenta}${'='.repeat(50)}${colors.reset}\n`);
    
    if (failed > 0) {
        console.log(`${colors.red}⚠️  SEED GENERATION IS BROKEN!${colors.reset}`);
        console.log(`${colors.red}   See /docs/SEED_GENERATION_CRITICAL_PATH.md for recovery${colors.reset}\n`);
        process.exit(1);
    } else {
        console.log(`${colors.green}✨ All seed generation tests passed!${colors.reset}\n`);
        process.exit(0);
    }
}

// Start tests
runTests().catch(error => {
    console.error(`${colors.red}Unexpected error: ${error.message}${colors.reset}`);
    process.exit(1);
});