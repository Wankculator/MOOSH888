const sparkSDKService = require('./src/server/services/sparkSDKService.js');

async function testSparkGeneration() {
    console.log('=== TESTING SPARK ADDRESS GENERATION ===\n');
    
    const testMnemonic = 'cup you sheriff recall law brother gaze wreck enemy soul you cloth';
    
    console.log('Test Mnemonic:', testMnemonic);
    console.log('\nGenerating wallet from this seed...\n');
    
    try {
        const result = await sparkSDKService.generateSparkFromMnemonic(testMnemonic);
        
        if (result.success) {
            console.log('✅ Generation successful!\n');
            console.log('Generated Addresses:');
            console.log('Bitcoin:', result.data.addresses.bitcoin);
            console.log('Spark:  ', result.data.addresses.spark);
            console.log('\nSpark Address Length:', result.data.addresses.spark.length);
            console.log('Spark Address Prefix:', result.data.addresses.spark.substring(0, 7));
            console.log('\nPrivate Keys:');
            console.log('WIF:', result.data.privateKeys.wif);
            console.log('HEX:', result.data.privateKeys.hex);
        } else {
            console.log('❌ Generation failed:', result.error);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testSparkGeneration();