/**
 * Test Spark Address Generation
 * This script tests the wallet generation to verify real Spark addresses
 */

async function testSparkGeneration() {
    console.log('\n🧪 Testing Spark Wallet Generation...\n');
    
    try {
        // Test 1: Generate new wallet
        console.log('Test 1: Generating new wallet...');
        const response = await fetch('http://localhost:3001/api/spark/generate-wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ strength: 128 }) // 12 words
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Wallet generated successfully!\n');
            console.log('📝 Seed phrase:', result.data.mnemonic);
            console.log('🔗 Bitcoin address:', result.data.addresses.bitcoin);
            console.log('⚡ Spark address:', result.data.addresses.spark);
            console.log('🔑 Private key (hex):', result.data.privateKeys.spark.hex.substring(0, 32) + '...');
            
            // Check Spark address format
            const sparkAddr = result.data.addresses.spark;
            console.log('\n🔍 Spark Address Analysis:');
            console.log('   Length:', sparkAddr.length, 'characters');
            console.log('   Prefix:', sparkAddr.substring(0, 4));
            console.log('   Format:', sparkAddr.startsWith('sp1pgss') ? '✅ Real SDK format' : '⚠️ Custom format');
            
            // Test 2: Import wallet with known seed
            console.log('\n\nTest 2: Importing wallet with known seed...');
            const testMnemonic = 'matrix work divide few zone walk arena lonely minute pet trophy subject';
            
            const importResponse = await fetch('http://localhost:3001/api/spark/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mnemonic: testMnemonic })
            });
            
            const importResult = await importResponse.json();
            
            if (importResult.success) {
                console.log('✅ Wallet imported successfully!\n');
                console.log('⚡ Imported Spark address:', importResult.data.addresses.spark);
                console.log('   Expected format: sp1pgss...');
                console.log('   Actual format:', importResult.data.addresses.spark.substring(0, 8) + '...');
            } else {
                console.log('❌ Import failed:', importResult.error);
            }
            
        } else {
            console.log('❌ Wallet generation failed:', result.error);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testSparkGeneration();