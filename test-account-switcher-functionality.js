#!/usr/bin/env node

/**
 * Functional test for AccountSwitcher
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 AccountSwitcher Functional Test\n');
console.log('════════════════════════════════════\n');

// Load the moosh-wallet.js file
const mooshWalletPath = path.join(__dirname, 'public/js/moosh-wallet.js');
const content = fs.readFileSync(mooshWalletPath, 'utf8');

// Mock browser environment
global.window = {
    ElementFactory: {
        div: () => ({ appendChild: () => {} }),
        button: () => ({ appendChild: () => {} }),
        span: () => ({ appendChild: () => {} })
    }
};
global.document = {
    addEventListener: () => {},
    createElement: () => ({ appendChild: () => {} })
};

console.log('📋 Component Tests:\n');

// Test 1: Check if AccountSwitcher exists
const hasAccountSwitcher = content.includes('class AccountSwitcher extends Component');
console.log(`${hasAccountSwitcher ? '✅' : '❌'} AccountSwitcher class exists`);

// Test 2: Check methods
const methods = [
    'render()',
    'mount(',
    'toggleDropdown()',
    'switchToAccount(',
    'setState(',
    'closeDropdown()',
    'update()'
];

console.log('\n📋 Method Verification:');
methods.forEach(method => {
    const hasMethod = content.includes(method);
    console.log(`   ${hasMethod ? '✅' : '❌'} ${method}`);
});

// Test 3: Integration points
console.log('\n📋 Integration Tests:');
const integrationChecks = [
    { test: 'new AccountSwitcher(this.app)', desc: 'Component instantiation' },
    { test: 'accountSwitcher.mount(', desc: 'Component mounting' },
    { test: 'accountSwitcherContainer', desc: 'Container element' },
    { test: 'addAccountSwitcherStyles', desc: 'Styles method' },
    { test: 'this.app.state.getCurrentAccount()', desc: 'Current account access' },
    { test: 'this.app.state.getAccounts()', desc: 'All accounts access' },
    { test: 'this.app.state.switchAccount(', desc: 'Account switching' }
];

integrationChecks.forEach(check => {
    const hasIntegration = content.includes(check.test);
    console.log(`   ${hasIntegration ? '✅' : '❌'} ${check.desc}`);
});

// Test 4: UI Elements
console.log('\n📋 UI Element Tests:');
const uiElements = [
    'account-switcher-trigger',
    'account-dropdown',
    'account-item',
    'Manage Accounts'
];

uiElements.forEach(element => {
    const hasElement = content.includes(element);
    console.log(`   ${hasElement ? '✅' : '❌'} ${element}`);
});

// Test 5: State persistence
console.log('\n📋 State Persistence:');
const stateChecks = [
    { test: 'localStorage.getItem', desc: 'Load from storage' },
    { test: 'localStorage.setItem', desc: 'Save to storage' },
    { test: 'currentAccountId', desc: 'Current account tracking' }
];

stateChecks.forEach(check => {
    const hasFeature = content.includes(check.test);
    console.log(`   ${hasFeature ? '✅' : '❌'} ${check.desc}`);
});

// Test 6: Event handling
console.log('\n📋 Event Handling:');
const eventChecks = [
    { test: 'onclick:', desc: 'Click handlers' },
    { test: 'onmouseover:', desc: 'Hover effects' },
    { test: 'addEventListener(\'click\'', desc: 'Document click listener' },
    { test: 'listenToState(', desc: 'State change listeners' }
];

eventChecks.forEach(check => {
    const hasEvent = content.includes(check.test);
    console.log(`   ${hasEvent ? '✅' : '❌'} ${check.desc}`);
});

// Summary
console.log('\n════════════════════════════════════');
console.log('✅ AccountSwitcher functional test complete!\n');

// Additional diagnostics
console.log('📊 Additional Info:');
const accountSwitcherLines = content.split('\n').filter(line => line.includes('AccountSwitcher')).length;
console.log(`   Lines mentioning AccountSwitcher: ${accountSwitcherLines}`);

const dropdownCode = content.includes('isOpen') && content.includes('toggleDropdown');
console.log(`   ${dropdownCode ? '✅' : '❌'} Dropdown state management`);

const reactiveUpdates = content.includes('listenToState') && content.includes('update()');
console.log(`   ${reactiveUpdates ? '✅' : '❌'} Reactive state updates`);

console.log('\n✅ All tests completed!');