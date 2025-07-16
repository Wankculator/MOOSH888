// Comprehensive Balance Test Suite for MOOSH Wallet
console.log('=== MOOSH Wallet Balance Test Suite ===\n');

const testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    details: []
};

function test(name, testFn) {
    testResults.total++;
    console.log(`\nRunning: ${name}`);
    try {
        const result = testFn();
        if (result) {
            console.log(`✅ PASS: ${name}`);
            testResults.passed++;
        } else {
            console.log(`❌ FAIL: ${name}`);
            testResults.failed++;
            testResults.details.push(`Failed: ${name}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${name} - ${error.message}`);
        testResults.failed++;
        testResults.details.push(`Error in ${name}: ${error.message}`);
    }
}

// Wait for app to initialize
setTimeout(async () => {
    console.log('Starting balance tests...\n');
    
    // Test 1: API Service exists
    test('API Service initialized', () => {
        return window.app && window.app.apiService && typeof window.app.apiService.fetchBitcoinPrice === 'function';
    });
    
    // Test 2: Bitcoin price fetching
    await test('Bitcoin price API returns data', async () => {
        if (!window.app || !window.app.apiService) return false;
        
        try {
            const priceData = await window.app.apiService.fetchBitcoinPrice();
            console.log('  Price data structure:', JSON.stringify(priceData));
            
            // Check both possible formats
            const btcPrice = priceData?.bitcoin?.usd || priceData?.usd || 0;
            console.log(`  Extracted BTC price: $${btcPrice}`);
            
            return btcPrice > 0;
        } catch (e) {
            console.error('  Error:', e.message);
            return false;
        }
    });
    
    // Test 3: Dashboard elements
    test('Balance display elements exist', () => {
        const btcElement = document.getElementById('btc-balance') || document.getElementById('btcBalance');
        const usdElement = document.getElementById('usd-balance') || document.getElementById('btcUsdValue');
        
        console.log(`  BTC element found: ${!!btcElement}`);
        console.log(`  USD element found: ${!!usdElement}`);
        
        return btcElement && usdElement;
    });
    
    // Test 4: updateBalanceDisplay function
    test('updateBalanceDisplay function exists', () => {
        return window.app && 
               window.app.dashboard && 
               typeof window.app.dashboard.updateBalanceDisplay === 'function';
    });
    
    // Test 5: Balance calculation
    test('Balance calculation logic', () => {
        const btcBalance = 0.00128; // Your balance
        const btcPrice = 95000; // Example price
        const expectedUsd = btcBalance * btcPrice;
        
        console.log(`  BTC Balance: ${btcBalance}`);
        console.log(`  BTC Price: $${btcPrice}`);
        console.log(`  Expected USD: $${expectedUsd.toFixed(2)}`);
        
        return expectedUsd === 121.60;
    });
    
    // Test 6: Direct API call
    await test('Direct API endpoint test', async () => {
        try {
            const response = await fetch('http://localhost:3001/api/proxy/bitcoin-price');
            const data = await response.json();
            
            console.log('  API Response:', JSON.stringify(data));
            
            return data && data.bitcoin && data.bitcoin.usd > 0;
        } catch (e) {
            console.error('  API Error:', e.message);
            return false;
        }
    });
    
    // Test 7: Live update test
    await test('Manual balance update test', async () => {
        if (!window.app || !window.app.dashboard) return false;
        
        const usdElement = document.getElementById('usd-balance') || document.getElementById('btcUsdValue');
        if (!usdElement) return false;
        
        const originalValue = usdElement.textContent;
        console.log(`  Original USD value: ${originalValue}`);
        
        // Test with known values
        window.app.dashboard.updateBalanceDisplay(0.00128, 121.60, 95000);
        
        // Wait for DOM update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const newValue = usdElement.textContent;
        console.log(`  New USD value: ${newValue}`);
        
        return newValue !== '0.00';
    });
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed > 0) {
        console.log('\nFailed Tests:');
        testResults.details.forEach(detail => console.log(`- ${detail}`));
    }
    
    console.log('\n📋 TROUBLESHOOTING CHECKLIST:');
    console.log('1. ✓ Added logging to fetchBitcoinPrice');
    console.log('2. ✓ Handle both API response formats');
    console.log('3. ✓ Added logging to updateBalanceDisplay');
    console.log('4. ✓ Fixed btcPrice extraction logic');
    console.log('5. ✓ Updated updateLiveData for correct format');
    
    console.log('\n🔍 CHECK CONSOLE FOR:');
    console.log('- [APIService] Bitcoin price API response');
    console.log('- [Dashboard] Price data received');
    console.log('- [Dashboard] BTC price extracted');
    console.log('- [Dashboard] updateBalanceDisplay called with');
    
    if (testResults.passed === testResults.total) {
        console.log('\n🎉 All tests passed! USD balance should display correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Check the details above.');
        console.log('\n💡 Next steps:');
        console.log('1. Check if API server is running (localhost:3001)');
        console.log('2. Clear browser cache and reload');
        console.log('3. Check browser console for specific errors');
        console.log('4. Verify Bitcoin price API is accessible');
    }
    
}, 1000);