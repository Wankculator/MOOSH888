// Quick test script for wallet detection
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_URL = 'http://localhost:3001';

// Test wallet generation first
async function testWalletGeneration() {
    console.log('\n=== Testing Wallet Generation ===');
    try {
        const response = await fetch(`${API_URL}/api/wallet/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wordCount: 12 })
        });
        
        if (!response.ok) {
            console.error('Generation failed:', response.status, response.statusText);
            return;
        }
        
        const data = await response.json();
        console.log('✅ Wallet generated successfully');
        console.log('Mnemonic words:', data.data.mnemonic.length);
        console.log('Has SegWit:', !!data.data.bitcoin.addresses.segwit);
        console.log('Has Taproot:', !!data.data.bitcoin.addresses.taproot);
        console.log('Has Legacy:', !!data.data.bitcoin.addresses.legacy);
        console.log('Has Nested SegWit:', !!data.data.bitcoin.addresses.nestedSegwit);
        console.log('Has Spark:', !!data.data.spark);
        
    } catch (error) {
        console.error('❌ Generation error:', error.message);
    }
}

// Test the custom path endpoint
async function testCustomPath() {
    console.log('\n=== Testing Custom Path ===');
    try {
        const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
        
        const response = await fetch(`${API_URL}/api/wallet/test-paths`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mnemonic: testMnemonic,
                customPath: "m/84'/0'/0'",
                addressCount: 3
            })
        });
        
        if (!response.ok) {
            console.error('Custom path test failed:', response.status);
            const text = await response.text();
            console.error('Response:', text);
            return;
        }
        
        const data = await response.json();
        console.log('✅ Custom path test successful');
        console.log('Generated addresses:', data.addresses.length);
        if (data.addresses.length > 0) {
            console.log('First address:', data.addresses[0].address);
            console.log('Address type:', data.addresses[0].address.substring(0, 4));
        }
        
    } catch (error) {
        console.error('❌ Custom path error:', error.message);
    }
}

// Test import detection
async function testImportDetection() {
    console.log('\n=== Testing Import Detection ===');
    try {
        const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
        
        const response = await fetch(`${API_URL}/api/wallet/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mnemonic: testMnemonic,
                walletType: 'test'
            })
        });
        
        if (!response.ok) {
            console.error('Import test failed:', response.status);
            return;
        }
        
        const data = await response.json();
        console.log('✅ Import test successful');
        console.log('Has all address types:', 
            !!data.data.bitcoin.addresses.segwit &&
            !!data.data.bitcoin.addresses.taproot &&
            !!data.data.bitcoin.addresses.legacy &&
            !!data.data.bitcoin.addresses.nestedSegwit
        );
        
    } catch (error) {
        console.error('❌ Import error:', error.message);
    }
}

// Check if API is running
async function checkAPI() {
    try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API is running:', data);
            return true;
        }
    } catch (error) {
        console.error('❌ API is not running:', error.message);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('🧪 Running Wallet Detection Tests...\n');
    
    const apiRunning = await checkAPI();
    if (!apiRunning) {
        console.log('\n⚠️  Please start the API server first: npm run dev:api');
        return;
    }
    
    await testWalletGeneration();
    await testCustomPath();
    await testImportDetection();
    
    console.log('\n✅ All tests completed!');
}

runTests().catch(console.error);