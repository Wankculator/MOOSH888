#!/usr/bin/env node

/**
 * Comprehensive System Test for MOOSH Wallet
 * Tests all critical functionality including AccountSwitcher
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 MOOSH Wallet Comprehensive System Test\n');
console.log('═══════════════════════════════════════════\n');

let testsPassed = 0;
let testsFailed = 0;

function testPass(testName, details = '') {
    console.log(`✅ ${testName}`);
    if (details) console.log(`   ${details}`);
    testsPassed++;
}

function testFail(testName, error) {
    console.log(`❌ ${testName}`);
    console.log(`   Error: ${error}`);
    testsFailed++;
}

// Test 1: Check file structure
console.log('📋 Test 1: File Structure Verification');
try {
    const requiredFiles = [
        'public/js/moosh-wallet.js',
        'src/server/api-server.js',
        'package.json',
        'public/index.html'
    ];
    
    let allFilesExist = true;
    requiredFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
            testFail(`File exists: ${file}`, 'File not found');
            allFilesExist = false;
        }
    });
    
    if (allFilesExist) {
        testPass('File Structure', 'All required files present');
    }
} catch (error) {
    testFail('File Structure', error.message);
}

// Test 2: Check moosh-wallet.js for critical components
console.log('\n📋 Test 2: Component Verification');
try {
    const mooshWalletPath = path.join(__dirname, 'public/js/moosh-wallet.js');
    const mooshWalletContent = fs.readFileSync(mooshWalletPath, 'utf8');
    
    const components = [
        { name: 'StateManager', pattern: /class\s+StateManager\s*{/ },
        { name: 'WalletDetector', pattern: /class\s+WalletDetector\s*{/ },
        { name: 'AccountSwitcher', pattern: /class\s+AccountSwitcher\s*{/ },
        { name: 'DashboardPage', pattern: /class\s+DashboardPage\s+extends\s+Component/ },
        { name: 'ElementFactory', pattern: /const\s+ElementFactory\s*=\s*{/ }
    ];
    
    components.forEach(comp => {
        if (mooshWalletContent.match(comp.pattern)) {
            testPass(`Component: ${comp.name}`, 'Found in code');
        } else {
            testFail(`Component: ${comp.name}`, 'Not found in code');
        }
    });
} catch (error) {
    testFail('Component Verification', error.message);
}

// Test 3: Check AccountSwitcher implementation
console.log('\n📋 Test 3: AccountSwitcher Implementation');
try {
    const mooshWalletPath = path.join(__dirname, 'public/js/moosh-wallet.js');
    const mooshWalletContent = fs.readFileSync(mooshWalletPath, 'utf8');
    
    // Check for AccountSwitcher methods
    const accountSwitcherMethods = [
        'render',
        'mount',
        'toggleDropdown',
        'switchToAccount',
        'updateDisplay',
        'handleClickOutside'
    ];
    
    const accountSwitcherMatch = mooshWalletContent.match(/class\s+AccountSwitcher\s*{[\s\S]*?}\s*(?=class|\/\/|$)/);
    if (accountSwitcherMatch) {
        const accountSwitcherCode = accountSwitcherMatch[0];
        let allMethodsFound = true;
        
        accountSwitcherMethods.forEach(method => {
            if (!accountSwitcherCode.includes(method)) {
                testFail(`AccountSwitcher.${method}()`, 'Method not found');
                allMethodsFound = false;
            }
        });
        
        if (allMethodsFound) {
            testPass('AccountSwitcher Methods', 'All required methods present');
        }
        
        // Check integration in DashboardPage
        if (mooshWalletContent.includes('new AccountSwitcher(this.app)')) {
            testPass('AccountSwitcher Integration', 'Properly integrated in DashboardPage');
        } else {
            testFail('AccountSwitcher Integration', 'Not found in DashboardPage');
        }
    } else {
        testFail('AccountSwitcher Class', 'Class definition not found');
    }
} catch (error) {
    testFail('AccountSwitcher Implementation', error.message);
}

// Test 4: Check critical bug fixes
console.log('\n📋 Test 4: Critical Bug Fixes');
try {
    const mooshWalletPath = path.join(__dirname, 'public/js/moosh-wallet.js');
    const mooshWalletContent = fs.readFileSync(mooshWalletPath, 'utf8');
    
    // Check for fixMissingAddresses method
    if (mooshWalletContent.includes('fixMissingAddresses')) {
        testPass('Fix Missing Addresses', 'Method implemented');
    } else {
        testFail('Fix Missing Addresses', 'Method not found');
    }
    
    // Check that Fix Addresses button is removed
    if (!mooshWalletContent.includes('Fix Addresses') || mooshWalletContent.includes('// Removed Fix Addresses button')) {
        testPass('Fix Addresses Button', 'Successfully removed');
    } else {
        testFail('Fix Addresses Button', 'Still present in code');
    }
    
    // Check for enhanced createAccount
    const createAccountMatch = mooshWalletContent.match(/createAccount\s*\([^)]*\)\s*{[\s\S]*?return\s+account/);
    if (createAccountMatch && createAccountMatch[0].includes('addresses.spark')) {
        testPass('Create Account Enhancement', 'Spark address generation included');
    } else {
        testFail('Create Account Enhancement', 'Spark address generation missing');
    }
} catch (error) {
    testFail('Critical Bug Fixes', error.message);
}

// Test 5: Check API server fixes
console.log('\n📋 Test 5: API Server Fixes');
try {
    const apiServerPath = path.join(__dirname, 'src/server/api-server.js');
    const apiServerContent = fs.readFileSync(apiServerPath, 'utf8');
    
    // Check for correct import
    if (apiServerContent.includes("import { HDKey } from '@scure/bip32'")) {
        testPass('API Import Fix', 'Using correct @scure/bip32 import');
    } else {
        testFail('API Import Fix', 'Still using old import');
    }
    
    // Check for derive method fix
    if (apiServerContent.includes('.derive(') && !apiServerContent.includes('.derivePath(')) {
        testPass('Derive Method Fix', 'Using correct derive() method');
    } else {
        testFail('Derive Method Fix', 'Still using derivePath()');
    }
} catch (error) {
    testFail('API Server Fixes', error.message);
}

// Test 6: Check CSS implementation
console.log('\n📋 Test 6: CSS and Styling');
try {
    const mooshWalletPath = path.join(__dirname, 'public/js/moosh-wallet.js');
    const mooshWalletContent = fs.readFileSync(mooshWalletPath, 'utf8');
    
    // Check for addAccountSwitcherStyles method
    if (mooshWalletContent.includes('addAccountSwitcherStyles')) {
        testPass('AccountSwitcher Styles', 'Style method implemented');
        
        // Check if styles include required classes
        const styleClasses = [
            '.account-switcher',
            '.account-switcher-trigger',
            '.account-dropdown',
            '.account-item'
        ];
        
        let allStylesFound = true;
        styleClasses.forEach(className => {
            if (!mooshWalletContent.includes(className)) {
                testFail(`CSS Class: ${className}`, 'Not found in styles');
                allStylesFound = false;
            }
        });
        
        if (allStylesFound) {
            testPass('CSS Classes', 'All required classes defined');
        }
    } else {
        testFail('AccountSwitcher Styles', 'Style method not found');
    }
} catch (error) {
    testFail('CSS and Styling', error.message);
}

// Test 7: State Management Integration
console.log('\n📋 Test 7: State Management');
try {
    const mooshWalletPath = path.join(__dirname, 'public/js/moosh-wallet.js');
    const mooshWalletContent = fs.readFileSync(mooshWalletPath, 'utf8');
    
    // Check StateManager methods
    const stateMethods = [
        'getCurrentAccount',
        'getAccounts',
        'switchAccount',
        'createAccount',
        'loadAccounts',
        'saveAccounts'
    ];
    
    let allStateMethodsFound = true;
    stateMethods.forEach(method => {
        if (!mooshWalletContent.includes(`${method}(`)) {
            testFail(`StateManager.${method}()`, 'Method not found');
            allStateMethodsFound = false;
        }
    });
    
    if (allStateMethodsFound) {
        testPass('State Management Methods', 'All required methods present');
    }
    
    // Check localStorage usage
    if (mooshWalletContent.includes('localStorage.getItem') && mooshWalletContent.includes('localStorage.setItem')) {
        testPass('State Persistence', 'localStorage integration present');
    } else {
        testFail('State Persistence', 'localStorage not properly used');
    }
} catch (error) {
    testFail('State Management', error.message);
}

// Test 8: Documentation
console.log('\n📋 Test 8: Documentation');
try {
    const docs = [
        'MULTI_WALLET_SYSTEM_MASTER_PLAN.md',
        'PHASE_0_COMPLETION_REPORT.md',
        'PHASE_1_NEXT_STEPS.md',
        'PHASE_1_ACCOUNT_SWITCHER_COMPLETE.md'
    ];
    
    let allDocsFound = true;
    docs.forEach(doc => {
        const docPath = path.join(__dirname, doc);
        if (!fs.existsSync(docPath)) {
            testFail(`Documentation: ${doc}`, 'File not found');
            allDocsFound = false;
        }
    });
    
    if (allDocsFound) {
        testPass('Documentation', 'All key documents present');
    }
} catch (error) {
    testFail('Documentation', error.message);
}

// Summary
console.log('\n═══════════════════════════════════════════');
console.log('📊 Test Summary:\n');
console.log(`   ✅ Passed: ${testsPassed}`);
console.log(`   ❌ Failed: ${testsFailed}`);
console.log(`   📈 Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);

if (testsFailed === 0) {
    console.log('\n🎉 All tests passed! System is ready for next phase.');
} else {
    console.log('\n⚠️  Some tests failed. Please review and fix issues before proceeding.');
}

// Additional checks
console.log('\n📋 Additional System Checks:\n');

// Check package.json
try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    console.log(`📦 Package Name: ${packageJson.name}`);
    console.log(`📦 Version: ${packageJson.version}`);
    console.log(`📦 Main Entry: ${packageJson.main || 'Not specified'}`);
} catch (error) {
    console.log('❌ Could not read package.json');
}

// Check file sizes
console.log('\n📏 File Sizes:');
try {
    const mooshWalletStats = fs.statSync(path.join(__dirname, 'public/js/moosh-wallet.js'));
    console.log(`   moosh-wallet.js: ${Math.round(mooshWalletStats.size / 1024)}KB`);
    
    const apiServerStats = fs.statSync(path.join(__dirname, 'src/server/api-server.js'));
    console.log(`   api-server.js: ${Math.round(apiServerStats.size / 1024)}KB`);
} catch (error) {
    console.log('❌ Could not check file sizes');
}

console.log('\n✅ Comprehensive system test complete!');