// Balance Display Diagnostic Test
console.log('=== Balance Display Diagnostic ===\n');

function diagnoseBalanceIssue() {
    // Check 1: Balance elements exist
    console.log('1. Checking balance elements:');
    const btcBalance = document.getElementById('btc-balance');
    const usdBalance = document.getElementById('usd-balance');
    console.log('   BTC balance element:', btcBalance ? '✅ Found' : '❌ Missing');
    console.log('   USD balance element:', usdBalance ? '✅ Found' : '❌ Missing');
    if (btcBalance) {
        console.log('   BTC balance content:', btcBalance.textContent);
    }
    
    // Check 2: API Service
    console.log('\n2. Checking API Service:');
    if (window.app && window.app.apiService) {
        console.log('   API Service:', '✅ Available');
        console.log('   Base URL:', window.app.apiService.baseURL);
        console.log('   Endpoints:', window.app.apiService.endpoints);
    } else {
        console.log('   API Service:', '❌ Not available');
    }
    
    // Check 3: Current Account
    console.log('\n3. Checking current account:');
    if (window.app && window.app.state) {
        const currentAccount = window.app.state.getCurrentAccount();
        if (currentAccount) {
            console.log('   Account:', '✅ Found');
            console.log('   Name:', currentAccount.name);
            console.log('   Addresses:', currentAccount.addresses ? '✅ Available' : '❌ Missing');
            if (currentAccount.addresses) {
                console.log('   - Segwit:', currentAccount.addresses.segwit || 'N/A');
                console.log('   - Taproot:', currentAccount.addresses.taproot || 'N/A');
                console.log('   - Legacy:', currentAccount.addresses.legacy || 'N/A');
                console.log('   - Spark:', currentAccount.addresses.spark || 'N/A');
            }
        } else {
            console.log('   Account:', '❌ No current account');
        }
    }
    
    // Check 4: Wallet Type Selection
    console.log('\n4. Checking wallet type:');
    const selectedType = localStorage.getItem('selectedWalletType');
    console.log('   Selected type:', selectedType || 'Not set');
    
    // Check 5: Dashboard Page
    console.log('\n5. Checking dashboard:');
    if (window.app && window.app.dashboard) {
        console.log('   Dashboard:', '✅ Available');
        console.log('   refreshBalances method:', typeof window.app.dashboard.refreshBalances === 'function' ? '✅ Found' : '❌ Missing');
    } else {
        console.log('   Dashboard:', '❌ Not available');
    }
    
    // Check 6: Try to manually refresh
    console.log('\n6. Attempting manual balance refresh...');
    if (window.app && window.app.dashboard && window.app.dashboard.refreshBalances) {
        console.log('   Calling refreshBalances()...');
        window.app.dashboard.refreshBalances().then(() => {
            console.log('   ✅ Balance refresh completed');
            const newBalance = document.getElementById('btc-balance')?.textContent;
            console.log('   New balance:', newBalance);
        }).catch(err => {
            console.log('   ❌ Balance refresh failed:', err.message);
        });
    }
    
    // Check 7: Network connectivity
    console.log('\n7. Testing API connectivity:');
    if (window.app && window.app.apiService) {
        // Test Bitcoin price fetch
        window.app.apiService.fetchBitcoinPrice().then(price => {
            console.log('   ✅ Bitcoin price API working:', price);
        }).catch(err => {
            console.log('   ❌ Bitcoin price API failed:', err.message);
        });
    }
}

// Run diagnostics
setTimeout(() => {
    diagnoseBalanceIssue();
    
    console.log('\n=== Possible Issues ===');
    console.log('1. API service might not be running (check localhost:3001)');
    console.log('2. No address selected for balance lookup');
    console.log('3. refreshBalances method might have errors');
    console.log('4. Network/CORS issues preventing API calls');
}, 1000);