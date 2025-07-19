/**
 * Detailed Seed Generation Test Script
 * Run this in the browser console to test seed generation
 */

console.log('=== MOOSH WALLET SEED GENERATION TEST ===');
console.log('Starting comprehensive seed generation diagnostics...\n');

// Test 1: Check if app is initialized
console.log('1. Checking app initialization...');
const app = window.mooshWallet || window.MooshWallet || window.app;
if (app) {
    console.log('✅ App initialized');
    console.log('   - Current page:', app.state?.get('currentPage'));
    console.log('   - Wallet locked:', app.state?.get('isLocked'));
} else {
    console.error('❌ App not initialized!');
}

// Test 2: Check API service
console.log('\n2. Checking API service...');
if (app?.apiService) {
    console.log('✅ API service available');
    console.log('   - Base URL:', app.apiService.baseURL);
} else {
    console.error('❌ API service not found!');
}

// Test 3: Check if password is set
console.log('\n3. Checking password status...');
const password = localStorage.getItem('walletPassword');
if (password) {
    console.log('✅ Password is set');
} else {
    console.warn('⚠️ No password set - setting test password');
    localStorage.setItem('walletPassword', 'testpassword123');
}

// Test 4: Check selected mnemonic
console.log('\n4. Checking mnemonic selection...');
const selectedMnemonic = localStorage.getItem('selectedMnemonic');
if (selectedMnemonic) {
    console.log(`✅ Selected mnemonic: ${selectedMnemonic} words`);
} else {
    console.warn('⚠️ No mnemonic selected - setting to 24 words');
    localStorage.setItem('selectedMnemonic', '24');
}

// Test 5: Direct API test
console.log('\n5. Testing API endpoint directly...');
async function testAPI() {
    try {
        const response = await fetch('http://localhost:3001/api/spark/generate-wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ strength: 256 })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ API test successful');
            console.log('   - Mnemonic words:', data.data.mnemonic.split(' ').length);
            console.log('   - Spark address:', data.data.addresses.spark);
            console.log('   - Bitcoin address:', data.data.addresses.bitcoin);
        } else {
            console.error('❌ API test failed:', data);
        }
    } catch (error) {
        console.error('❌ API connection error:', error.message);
    }
}

// Test 6: Check current route
console.log('\n6. Checking current route...');
const currentHash = window.location.hash;
console.log('Current hash:', currentHash || 'none');

// Test 7: Navigate to seed generation
console.log('\n7. Testing navigation to seed generation...');
function navigateToSeedGeneration() {
    if (!app) {
        console.error('Cannot navigate - app not initialized');
        return;
    }
    
    // Ensure we're unlocked for testing
    sessionStorage.setItem('walletUnlocked', 'true');
    
    // Navigate
    console.log('Navigating to generate-seed page...');
    window.location.hash = '#generate-seed';
    
    // Monitor what happens
    setTimeout(() => {
        const newPage = app.state?.get('currentPage');
        console.log('Current page after navigation:', newPage);
        
        // Check if generateWallet was called
        const seedPage = document.querySelector('.card');
        if (seedPage) {
            console.log('✅ Seed generation page rendered');
            
            // Look for loading indicator
            const loading = seedPage.querySelector('.loading-container');
            if (loading) {
                console.log('✅ Loading indicator visible');
            }
            
            // Look for error messages
            const errorDiv = seedPage.querySelector('[style*="background: rgba(255, 0, 0"]');
            if (errorDiv) {
                console.error('❌ Error displayed on page:', errorDiv.textContent);
            }
        } else {
            console.error('❌ Seed generation page not rendered');
        }
    }, 1000);
}

// Test 8: Monitor console errors
console.log('\n8. Setting up error monitoring...');
let errorCount = 0;
const originalError = console.error;
console.error = function(...args) {
    errorCount++;
    console.log(`[ERROR #${errorCount}]`, ...args);
    originalError.apply(console, args);
};

// Test 9: Check for missing dependencies
console.log('\n9. Checking dependencies...');
const dependencies = {
    'ElementFactory': window.ElementFactory,
    'WalletEncryption': window.WalletEncryption,
    'SecureStorage': window.SecureStorage,
    'ComplianceUtils': window.ComplianceUtils,
    'loadingSystem': window.loadingSystem
};

Object.entries(dependencies).forEach(([name, value]) => {
    if (value) {
        console.log(`✅ ${name} loaded`);
    } else {
        console.error(`❌ ${name} missing!`);
    }
});

// Run tests
console.log('\n=== RUNNING TESTS ===\n');

// First test API
testAPI().then(() => {
    console.log('\n--- Test Results ---');
    console.log('API working: ✅');
    console.log('Errors captured:', errorCount);
    
    console.log('\n--- Next Steps ---');
    console.log('1. If API is working but UI generation fails:');
    console.log('   - Run: navigateToSeedGeneration()');
    console.log('   - Watch for console errors');
    console.log('   - Check Network tab for failed requests');
    console.log('\n2. To manually test seed generation:');
    console.log('   - Run: app.apiService.generateSparkWallet(24)');
    console.log('   - This will call the API directly');
    console.log('\n3. To see what happens during navigation:');
    console.log('   - Open Network tab');
    console.log('   - Run: navigateToSeedGeneration()');
    console.log('   - Look for /api/spark/generate-wallet request');
});

// Export test function for manual use
window.testSeedGeneration = {
    navigateToSeedGeneration,
    testAPI,
    checkApp: () => console.log('App:', app),
    clearStorage: () => {
        localStorage.clear();
        sessionStorage.clear();
        console.log('Storage cleared');
    },
    setTestPassword: () => {
        localStorage.setItem('walletPassword', 'testpassword123');
        console.log('Test password set');
    }
};

console.log('\n--- Manual Test Commands Available ---');
console.log('testSeedGeneration.navigateToSeedGeneration() - Navigate to seed page');
console.log('testSeedGeneration.testAPI() - Test API directly');
console.log('testSeedGeneration.checkApp() - Check app status');
console.log('testSeedGeneration.clearStorage() - Clear all storage');
console.log('testSeedGeneration.setTestPassword() - Set test password');