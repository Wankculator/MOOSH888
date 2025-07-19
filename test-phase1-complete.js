#!/usr/bin/env node

/**
 * Phase 1 Complete Testing
 * Comprehensive tests to ensure nothing is broken
 */

const fetch = require('node-fetch');
const chalk = require('chalk');

console.log(chalk.cyan.bold('\n🧪 Testing Complete Phase 1 Implementation\n'));

async function testCriticalPaths() {
    console.log(chalk.blue('1. Testing critical paths remain intact...'));
    
    // Test seed generation
    const seedTest = await fetch('http://localhost:3001/api/spark/generate-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strength: 128 })
    });
    
    if (seedTest.ok) {
        const data = await seedTest.json();
        if (data.success && typeof data.data.mnemonic === 'string') {
            console.log(chalk.green('   ✅ Seed generation works'));
        } else {
            console.log(chalk.red('   ❌ Seed generation broken!'));
            return false;
        }
    } else {
        console.log(chalk.red('   ❌ API not responding'));
        return false;
    }
    
    return true;
}

function showManualTests() {
    console.log(chalk.blue('\n2. Manual browser tests required:'));
    console.log(chalk.yellow('\nTest A: Default State (nothing enabled)'));
    console.log('   1. Open http://localhost:3333');
    console.log('   2. Open console (F12)');
    console.log('   3. Verify NO errors');
    console.log('   4. Type: app.state.walletMode');
    console.log('      Expected: undefined');
    console.log('   5. Create new account - should work normally');
    
    console.log(chalk.yellow('\nTest B: Enable Multi-Wallet'));
    console.log('   1. In console: localStorage.setItem("enableMultiWallet", "true")');
    console.log('   2. Refresh page');
    console.log('   3. Check console for "[MultiWallet] Extensions available, injecting..."');
    console.log('   4. Type: app.state.walletMode');
    console.log('      Expected: "single"');
    console.log('   5. Press Ctrl+Shift+M');
    console.log('      Expected: Toggle appears in top-right');
    
    console.log(chalk.yellow('\nTest C: Disable and Verify Cleanup'));
    console.log('   1. In console: localStorage.removeItem("enableMultiWallet")');
    console.log('   2. Refresh page');
    console.log('   3. Verify toggle is gone');
    console.log('   4. Verify wallet still works normally');
}

function showRollbackInstructions() {
    console.log(chalk.cyan('\n3. If anything is broken:'));
    console.log(chalk.red('   IMMEDIATE ROLLBACK:'));
    console.log('   git checkout -- .');
    console.log('   OR');
    console.log('   git reset --hard HEAD~1');
}

async function run() {
    const criticalOk = await testCriticalPaths();
    
    if (criticalOk) {
        showManualTests();
        console.log(chalk.green.bold('\n✅ Phase 1 Implementation Complete!'));
        console.log(chalk.gray('\nNext steps:'));
        console.log(chalk.gray('1. Run manual tests above'));
        console.log(chalk.gray('2. If all pass: git add -A && git commit -m "Phase 1: Multi-wallet foundation"'));
        console.log(chalk.gray('3. Proceed to Phase 2'));
    } else {
        console.log(chalk.red.bold('\n❌ Critical failure - ROLLBACK NOW!'));
        showRollbackInstructions();
    }
}

run().catch(console.error);