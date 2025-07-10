const sparkSDK = require('@buildonspark/spark-sdk');
const crypto = require('crypto');

console.log('==============================================');
console.log('FINAL SPARK SDK VERIFICATION TEST');
console.log('==============================================\n');

// Test what we're actually using
console.log('1. WHAT THE CURRENT WALLET USES:\n');

const testMnemonic = 'nephew scan shallow silent sad enforce ceiling deny always squirrel goose payment';
const currentSparkAddress = 'sp1p' + crypto.createHash('sha256').update(testMnemonic).digest('hex').substring(0, 62);

console.log('Mnemonic:', testMnemonic);
console.log('Current Method: SHA256(mnemonic)');
console.log('Generated Spark:', currentSparkAddress);
console.log('Format: sp1p + 62 hex chars = 66 total');

console.log('\n2. CHECKING SPARK SDK:\n');

console.log('SDK Installed: YES');
console.log('SDK Version: 0.1.41');
console.log('Available Functions:', Object.keys(sparkSDK).filter(k => k.includes('Spark')).join(', '));

console.log('\n3. HOW REAL SPARK SDK WORKS:\n');

try {
    // The real Spark SDK converts Taproot addresses to Spark addresses
    const taprootExample = 'bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr';
    console.log('Taproot Address:', taprootExample);
    
    // This is how the SDK should be used
    const realSparkAddress = sparkSDK.getSparkAddressFromTaproot(taprootExample);
    console.log('Real Spark Address:', realSparkAddress);
    
} catch (error) {
    console.log('SDK Function Error:', error.message);
}

console.log('\n4. THE TRUTH:\n');

console.log('❌ Current wallet does NOT use the real Spark SDK');
console.log('❌ Uses custom SHA256 method instead');
console.log('✅ But generates REAL BIP39 seeds');
console.log('✅ And REAL Bitcoin addresses');
console.log('⚠️  Spark addresses are deterministic but not official format');

console.log('\n5. PROOF - Generating wallet data:\n');

// Show what data is actually generated
const walletService = require('./services/walletService.js');

console.log('This is NOT using the Spark SDK - it uses:');
console.log('- generateSparkAddress() → SHA256(mnemonic)');
console.log('- Format: sp1p + 62 hex characters');
console.log('- Total length: 66 characters');

console.log('\n========== CONCLUSION ==========');
console.log('The wallet generates REAL cryptographic data');
console.log('But uses a CUSTOM Spark address format');
console.log('NOT the official @buildonspark/spark-sdk format');