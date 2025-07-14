// Test if Spark SDK can be loaded
console.log('Testing Spark SDK...');

try {
    const sparkSDK = require('@buildonspark/spark-sdk');
    console.log('✅ Spark SDK loaded successfully!');
    console.log('Available exports:', Object.keys(sparkSDK));
} catch (error) {
    console.log('❌ Spark SDK not available:', error.message);
}

// Test address generation with fallback
const crypto = require('crypto');
const bip39 = require('bip39');

const mnemonic = "cup you sheriff recall law brother gaze wreck enemy soul you cloth";
const seed = bip39.mnemonicToSeedSync(mnemonic);

console.log('\nTest seed details:');
console.log('Mnemonic:', mnemonic);
console.log('Seed (hex):', seed.toString('hex').substring(0, 64) + '...');

// Show what the current implementation generates
const sparkKeyData = crypto.createHash('sha256')
    .update(Buffer.concat([seed.slice(0, 32), Buffer.from('spark-protocol')]))
    .digest();

console.log('\nGenerated key data (first 32 bytes):', sparkKeyData.toString('hex'));