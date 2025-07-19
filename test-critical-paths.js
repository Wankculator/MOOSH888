#!/usr/bin/env node

/**
 * MOOSH Wallet Critical Path Testing
 * Tests all critical functionality before and after changes
 * MUST pass 100% before proceeding with multi-wallet implementation
 */

const fetch = require('node-fetch');
const chalk = require('chalk');

// Test configuration
const API_BASE = 'http://localhost:3001';
const UI_BASE = 'http://localhost:3333';

// Test results collector
const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

// Console styling
const log = {
    test: (name) => console.log(chalk.blue(`\n🧪 Testing: ${name}`)),
    pass: (msg) => console.log(chalk.green(`   ✅ ${msg}`)),
    fail: (msg) => console.log(chalk.red(`   ❌ ${msg}`)),
    info: (msg) => console.log(chalk.gray(`   ℹ️  ${msg}`)),
    warn: (msg) => console.log(chalk.yellow(`   ⚠️  ${msg}`))
};

// Test utilities
async function runTest(name, testFn) {
    log.test(name);
    const startTime = Date.now();
    
    try {
        await testFn();
        const duration = Date.now() - startTime;
        log.pass(`Passed in ${duration}ms`);
        testResults.passed++;
        testResults.tests.push({ name, status: 'passed', duration });
    } catch (error) {
        const duration = Date.now() - startTime;
        log.fail(`Failed: ${error.message}`);
        testResults.failed++;
        testResults.tests.push({ name, status: 'failed', error: error.message, duration });
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// CRITICAL PATH TESTS - MUST NOT BREAK
// ═══════════════════════════════════════════════════════════════════════

async function testSeedGeneration() {
    // Test 12-word seed
    const response12 = await fetch(`${API_BASE}/api/spark/generate-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strength: 128 })
    });

    if (!response12.ok) {
        throw new Error(`12-word generation failed: ${response12.status}`);
    }

    const data12 = await response12.json();
    
    // Validate response structure (CRITICAL - from CLAUDE.md)
    if (!data12.success) {
        throw new Error('Response missing success field');
    }
    
    if (!data12.data || typeof data12.data !== 'object') {
        throw new Error('Response missing data object');
    }
    
    if (typeof data12.data.mnemonic !== 'string') {
        throw new Error('Mnemonic must be string format, not array');
    }
    
    const words12 = data12.data.mnemonic.split(' ');
    if (words12.length !== 12) {
        throw new Error(`Expected 12 words, got ${words12.length}`);
    }
    
    if (!data12.data.addresses?.bitcoin || !data12.data.addresses?.spark) {
        throw new Error('Missing required addresses');
    }
    
    log.info(`12-word mnemonic: ${words12.slice(0, 3).join(' ')}...`);
    log.info(`Bitcoin address: ${data12.data.addresses.bitcoin}`);
    log.info(`Spark address: ${data12.data.addresses.spark}`);

    // Test 24-word seed
    const response24 = await fetch(`${API_BASE}/api/spark/generate-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strength: 256 })
    });

    if (!response24.ok) {
        throw new Error(`24-word generation failed: ${response24.status}`);
    }

    const data24 = await response24.json();
    const words24 = data24.data.mnemonic.split(' ');
    
    if (words24.length !== 24) {
        throw new Error(`Expected 24 words, got ${words24.length}`);
    }
    
    log.info(`24-word mnemonic: ${words24.slice(0, 3).join(' ')}...`);
}

async function testWalletImport() {
    // Test with a known test mnemonic (DO NOT USE FOR REAL FUNDS)
    const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    
    const response = await fetch(`${API_BASE}/api/wallet/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            mnemonic: testMnemonic,
            walletType: 'moosh'
        })
    });

    if (!response.ok) {
        throw new Error(`Import failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
        throw new Error('Import response not successful');
    }
    
    // Verify all address types are generated
    const requiredAddresses = ['segwit', 'taproot', 'legacy', 'nestedSegwit', 'spark'];
    for (const addrType of requiredAddresses) {
        if (!data.data.addresses?.[addrType]) {
            throw new Error(`Missing ${addrType} address`);
        }
        log.info(`${addrType}: ${data.data.addresses[addrType]}`);
    }
}

async function testServerHealth() {
    // Check API server
    try {
        const apiResponse = await fetch(`${API_BASE}/health`);
        if (apiResponse.ok) {
            log.info('API server is healthy');
        } else {
            log.warn(`API server returned ${apiResponse.status}`);
        }
    } catch (error) {
        throw new Error(`API server not reachable: ${error.message}`);
    }

    // Check UI server
    try {
        const uiResponse = await fetch(UI_BASE);
        if (uiResponse.ok) {
            log.info('UI server is healthy');
        } else {
            log.warn(`UI server returned ${uiResponse.status}`);
        }
    } catch (error) {
        log.warn(`UI server not reachable: ${error.message}`);
    }
}

async function testResponseTiming() {
    const timings = [];
    
    // Test generation speed (should be ~10 seconds per CLAUDE.md)
    for (let i = 0; i < 3; i++) {
        const start = Date.now();
        const response = await fetch(`${API_BASE}/api/spark/generate-wallet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ strength: 128 })
        });
        
        if (!response.ok) {
            throw new Error(`Generation failed on attempt ${i + 1}`);
        }
        
        await response.json();
        const duration = Date.now() - start;
        timings.push(duration);
        log.info(`Attempt ${i + 1}: ${duration}ms`);
    }
    
    const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
    log.info(`Average generation time: ${avgTime}ms`);
    
    if (avgTime > 60000) {
        log.warn('Generation taking longer than 60 seconds!');
    }
}

// ═══════════════════════════════════════════════════════════════════════
// RUN ALL TESTS
// ═══════════════════════════════════════════════════════════════════════

async function runAllTests() {
    console.log(chalk.bold.cyan('\n🏁 MOOSH Wallet Critical Path Testing\n'));
    console.log(chalk.gray('This will test all critical functionality that MUST NOT break'));
    console.log(chalk.gray('during multi-wallet implementation.\n'));

    const criticalTests = [
        ['Server Health Check', testServerHealth],
        ['Seed Generation (12/24 words)', testSeedGeneration],
        ['Wallet Import', testWalletImport],
        ['Response Timing', testResponseTiming]
    ];

    let criticalFailure = false;

    for (const [name, test] of criticalTests) {
        try {
            await runTest(name, test);
        } catch (error) {
            criticalFailure = true;
            log.fail(`CRITICAL TEST FAILED: ${name}`);
            break;
        }
    }

    // Summary
    console.log(chalk.bold.cyan('\n📊 Test Summary\n'));
    console.log(chalk.green(`   Passed: ${testResults.passed}`));
    console.log(chalk.red(`   Failed: ${testResults.failed}`));
    
    if (criticalFailure) {
        console.log(chalk.bold.red('\n⛔ CRITICAL FAILURE - DO NOT PROCEED WITH CHANGES'));
        console.log(chalk.red('Fix the issues above before implementing multi-wallet features.\n'));
        process.exit(1);
    } else if (testResults.failed === 0) {
        console.log(chalk.bold.green('\n✅ ALL TESTS PASSED - Safe to proceed!'));
        console.log(chalk.green('You can now implement multi-wallet features.\n'));
        
        // Save test results
        const fs = require('fs');
        const timestamp = new Date().toISOString();
        fs.writeFileSync(
            'test-results-baseline.json',
            JSON.stringify({ timestamp, ...testResults }, null, 2)
        );
        console.log(chalk.gray('Baseline test results saved to test-results-baseline.json\n'));
    }
}

// Run tests if executed directly
if (require.main === module) {
    runAllTests().catch(error => {
        console.error(chalk.red('\n💥 Test suite crashed:'), error);
        process.exit(1);
    });
}

module.exports = { runAllTests, runTest };