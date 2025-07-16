// Test script to verify AccountSwitcher and UI fixes
console.log('=== UI Fixes Test ===');

// Check if app is available
if (window.app) {
    console.log('✅ App is available');
    
    // Check current account
    const currentAccount = window.app.state.getCurrentAccount();
    console.log('Current account:', currentAccount);
    
    // Check AccountSwitcher container
    const container = document.getElementById('accountSwitcherContainer');
    console.log('AccountSwitcher container exists:', !!container);
    if (container) {
        console.log('Container contents:', container.innerHTML.substring(0, 100) + '...');
        console.log('Container children:', container.children.length);
    }
    
    // Check terminal header for account name
    const terminalHeaders = document.querySelectorAll('.terminal-header');
    console.log('Terminal headers found:', terminalHeaders.length);
    terminalHeaders.forEach((header, index) => {
        const text = header.textContent;
        console.log(`Header ${index}:`, text);
        if (text.includes('active')) {
            console.log('  ✅ Contains "active"');
            if (currentAccount && text.includes(currentAccount.name)) {
                console.log('  ✅ Shows account name:', currentAccount.name);
            } else {
                console.log('  ❌ Account name not visible');
            }
        }
    });
    
    // Check Add Account button
    const addAccountBtns = document.querySelectorAll('.dashboard-btn');
    console.log('\nAdd Account buttons found:', addAccountBtns.length);
    addAccountBtns.forEach((btn, index) => {
        if (btn.textContent.includes('Add Account')) {
            const styles = window.getComputedStyle(btn);
            console.log(`Button ${index}: "${btn.textContent}"`);
            console.log('  Font size:', styles.fontSize);
            console.log('  Padding:', styles.padding);
            console.log('  Height:', styles.height);
            console.log('  Min width:', styles.minWidth);
            console.log('  Max width:', styles.maxWidth);
        }
    });
    
    // Check if AccountSwitcher was mounted
    if (window.app.dashboard && window.app.dashboard.accountSwitcher) {
        console.log('\n✅ AccountSwitcher component exists on dashboard');
        console.log('AccountSwitcher element:', !!window.app.dashboard.accountSwitcher.element);
    } else {
        console.log('\n❌ AccountSwitcher component not found on dashboard');
    }
    
} else {
    console.log('❌ App not available');
}

console.log('\n=== Test Complete ===');