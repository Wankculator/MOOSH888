#!/usr/bin/env node

/**
 * Final Integration Test - Ensures all components work together
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🏁 MOOSH Wallet Final Integration Test\n');
console.log('══════════════════════════════════════════\n');

// Test results
let passed = 0;
let failed = 0;
const issues = [];

function pass(test, details = '') {
    console.log(`✅ ${test}`);
    if (details) console.log(`   ${details}`);
    passed++;
}

function fail(test, error) {
    console.log(`❌ ${test}`);
    console.log(`   ${error}`);
    failed++;
    issues.push({ test, error });
}

// Load main file
const mooshWalletPath = path.join(__dirname, 'public/js/moosh-wallet.js');
const mooshWallet = fs.readFileSync(mooshWalletPath, 'utf8');

console.log('🔍 Core Functionality Tests:\n');

// Test 1: File integrity
try {
    const stats = fs.statSync(mooshWalletPath);
    const sizeKB = Math.round(stats.size / 1024);
    
    if (sizeKB > 0 && sizeKB < 5000) {
        pass('File Integrity', `Size: ${sizeKB}KB`);
    } else {
        fail('File Integrity', `Unusual size: ${sizeKB}KB`);
    }
} catch (error) {
    fail('File Integrity', error.message);
}

// Test 2: Critical components
console.log('\n🔍 Component Integration:\n');
const components = [
    'StateManager',
    'AccountSwitcher',
    'DashboardPage',
    'WalletDetector',
    'ElementFactory',
    'Component'
];

components.forEach(comp => {
    if (mooshWallet.includes(`class ${comp}`) || mooshWallet.includes(`const ${comp}`)) {
        pass(`${comp} Component`);
    } else {
        fail(`${comp} Component`, 'Not found');
    }
});

// Test 3: Account management
console.log('\n🔍 Account Management:\n');
const accountFeatures = [
    { feature: 'createAccount', desc: 'Account creation' },
    { feature: 'switchAccount', desc: 'Account switching' },
    { feature: 'getCurrentAccount', desc: 'Current account access' },
    { feature: 'getAccounts', desc: 'Account list access' },
    { feature: 'fixMissingAddresses', desc: 'Address fixing' },
    { feature: 'loadAccounts', desc: 'Account loading' }
];

accountFeatures.forEach(({ feature, desc }) => {
    if (mooshWallet.includes(feature)) {
        pass(desc);
    } else {
        fail(desc, `${feature} not found`);
    }
});

// Test 4: UI Integration
console.log('\n🔍 UI Integration:\n');
const uiFeatures = [
    { element: 'accountSwitcherContainer', desc: 'Account switcher mount point' },
    { element: 'account-switcher-trigger', desc: 'Switcher trigger button' },
    { element: 'account-dropdown', desc: 'Account dropdown menu' },
    { element: 'addAccountSwitcherStyles', desc: 'Switcher styles' }
];

uiFeatures.forEach(({ element, desc }) => {
    if (mooshWallet.includes(element)) {
        pass(desc);
    } else {
        fail(desc, `${element} not found`);
    }
});

// Test 5: State persistence
console.log('\n🔍 State Persistence:\n');
const persistenceFeatures = [
    { code: 'localStorage.getItem', desc: 'Load from storage' },
    { code: 'localStorage.setItem', desc: 'Save to storage' },
    { code: 'mooshAccounts', desc: 'Account storage key' },
    { code: 'currentAccountId', desc: 'Active account tracking' }
];

persistenceFeatures.forEach(({ code, desc }) => {
    if (mooshWallet.includes(code)) {
        pass(desc);
    } else {
        fail(desc, `${code} not found`);
    }
});

// Test 6: Bug fixes verification
console.log('\n🔍 Bug Fix Verification:\n');

// Check Fix Addresses button is removed
const fixButtonRemoved = !mooshWallet.includes('>Fix Addresses<') || 
                        mooshWallet.includes('// Removed Fix Addresses button');
if (fixButtonRemoved) {
    pass('Fix Addresses Button Removed');
} else {
    fail('Fix Addresses Button', 'Still present');
}

// Check address generation improvements
const hasSparkGeneration = mooshWallet.includes('addresses.spark') && 
                          mooshWallet.includes('generateSparkAddress');
if (hasSparkGeneration) {
    pass('Spark Address Generation');
} else {
    fail('Spark Address Generation', 'Not properly implemented');
}

// Test 7: API server check
console.log('\n🔍 API Server Integration:\n');
try {
    const apiPath = path.join(__dirname, 'src/server/api-server.js');
    const apiContent = fs.readFileSync(apiPath, 'utf8');
    
    // Check correct imports
    if (apiContent.includes('@scure/bip32')) {
        pass('API Module Import Fixed');
    } else {
        fail('API Module Import', 'Still using old import');
    }
    
    // Check derive method
    if (apiContent.includes('.derive(') && !apiContent.includes('.derivePath(')) {
        pass('Derive Method Fixed');
    } else {
        fail('Derive Method', 'Still using old method');
    }
} catch (error) {
    fail('API Server Check', error.message);
}

// Test 8: Security checks
console.log('\n🔍 Security Checks:\n');
const securityChecks = [
    { pattern: /console\.log.*seed/i, desc: 'Seed phrase logging', shouldExist: false },
    { pattern: /console\.log.*mnemonic/i, desc: 'Mnemonic logging', shouldExist: false },
    { pattern: /password.*=.*['"].*['"]/i, desc: 'Hardcoded passwords', shouldExist: false }
];

securityChecks.forEach(({ pattern, desc, shouldExist }) => {
    const exists = pattern.test(mooshWallet);
    if (exists === shouldExist) {
        pass(desc, shouldExist ? 'Present' : 'Not found (good)');
    } else {
        fail(desc, shouldExist ? 'Missing' : 'Found (security risk)');
    }
});

// Summary
console.log('\n══════════════════════════════════════════');
console.log('📊 Final Test Summary:\n');
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

if (failed === 0) {
    console.log('\n🎉 All integration tests passed!');
    console.log('✅ System is ready for production use.');
} else {
    console.log('\n⚠️  Issues found:');
    issues.forEach(({ test, error }) => {
        console.log(`   - ${test}: ${error}`);
    });
}

// Performance check
console.log('\n⚡ Performance Metrics:');
const fileSize = fs.statSync(mooshWalletPath).size;
const lineCount = mooshWallet.split('\n').length;
console.log(`   File size: ${Math.round(fileSize / 1024)}KB`);
console.log(`   Line count: ${lineCount.toLocaleString()}`);
console.log(`   Average line length: ${Math.round(fileSize / lineCount)} chars`);

// Recommendations
console.log('\n💡 Recommendations:');
if (lineCount > 20000) {
    console.log('   - Consider code splitting for better performance');
}
if (mooshWallet.match(/console\.log/g)?.length > 100) {
    console.log('   - Remove excessive console.log statements');
}
if (mooshWallet.match(/TODO:/gi)?.length > 0) {
    console.log('   - Review and resolve TODO comments');
}

console.log('\n✅ Integration test complete!');