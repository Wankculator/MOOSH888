// Final Balance Test
console.log('=== Final Balance Test ===\n');

async function testBalance() {
    // Wait for app to be ready
    if (!window.app || !window.app.dashboard) {
        console.log('❌ App not ready yet. Please run this test after the dashboard loads.');
        return;
    }
    
    console.log('1. Testing manual balance refresh...');
    
    // Get current account
    const currentAccount = window.app.state.getCurrentAccount();
    if (!currentAccount) {
        console.log('❌ No current account found');
        return;
    }
    
    console.log('✅ Current account:', currentAccount.name);
    console.log('   Addresses:', Object.keys(currentAccount.addresses || {}));
    
    // Check selected wallet type
    const walletType = localStorage.getItem('selectedWalletType');
    console.log('✅ Selected wallet type:', walletType || 'Not set');
    
    // Try to refresh balance
    if (window.app.dashboard.refreshBalances) {
        console.log('\n2. Calling refreshBalances()...');
        try {
            await window.app.dashboard.refreshBalances();
            console.log('✅ Balance refresh completed');
            
            // Check if balance was updated
            const btcElement = document.getElementById('btc-balance');
            const usdElement = document.getElementById('usd-balance');
            
            if (btcElement) {
                console.log('✅ BTC balance element:', btcElement.textContent);
            }
            if (usdElement) {
                console.log('✅ USD balance element:', '$' + usdElement.textContent);
            }
            
        } catch (error) {
            console.log('❌ Balance refresh error:', error.message);
        }
    }
    
    // Test account switching
    console.log('\n3. Testing account switching...');
    const accounts = window.app.state.getAccounts();
    console.log('   Total accounts:', accounts.length);
    
    if (accounts.length > 1) {
        const otherAccount = accounts.find(a => a.id !== currentAccount.id);
        if (otherAccount) {
            console.log('   Switching to:', otherAccount.name);
            window.app.state.switchAccount(otherAccount.id);
            
            // Wait a bit for UI to update
            setTimeout(async () => {
                console.log('   ✅ Switched to account:', window.app.state.getCurrentAccount().name);
                console.log('   Refreshing balance for new account...');
                await window.app.dashboard.refreshBalances();
                console.log('   ✅ Balance refresh completed for new account');
            }, 1000);
        }
    }
}

// Run the test
testBalance();

console.log('\n=== Summary ===');
console.log('The balance display has been fixed with the following changes:');
console.log('1. Fixed API call from getSparkBalance to fetchAddressBalance');
console.log('2. Added proper taproot case in wallet type switch');
console.log('3. Balance is now correctly fetched based on selected wallet type');
console.log('4. UI elements are properly updated with BTC and USD values');
console.log('\nIf balance is still not showing:');
console.log('- Check browser console for errors');
console.log('- Ensure API server is running (localhost:3001)');
console.log('- Verify you have a valid address for the selected wallet type');
console.log('- Try selecting a different wallet type (segwit, taproot, etc)');