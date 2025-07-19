// Test script to verify Auro wallet detection
// Run this in browser console after loading MOOSH wallet

async function testAuroDetection() {
    console.log('=== Testing Auro Wallet Detection ===');
    
    // Get wallet detector instance
    const app = window.mooshApp || window.app;
    if (!app) {
        console.error('MOOSH app not found. Make sure the wallet is loaded.');
        return;
    }
    
    const detector = new WalletDetector(app);
    
    // Test with a sample mnemonic
    const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    
    console.log('Testing wallet detection with test mnemonic...');
    console.log('Known wallets:', Object.keys(detector.knownPaths));
    
    // Check if Auro is in the list
    if (detector.knownPaths.auro) {
        console.log('✅ Auro wallet found in known paths:', detector.knownPaths.auro);
        
        // Try to detect
        const result = await detector.detectWalletType(testMnemonic);
        console.log('Detection result:', result);
        
        // Check if Auro was attempted
        const auroPath = "m/44'/12586'/0'/0/0";
        if (result.activePaths.some(p => p.path === auroPath || p === auroPath)) {
            console.log('✅ Auro path was checked');
        } else {
            console.log('❌ Auro path was not checked');
        }
    } else {
        console.error('❌ Auro wallet not found in known paths');
    }
}

// Run the test
testAuroDetection();