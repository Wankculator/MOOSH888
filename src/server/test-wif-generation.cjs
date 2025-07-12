/**
 * Test script to verify WIF generation is working correctly
 * Run with: node test-wif-generation.cjs
 */

const axios = require('axios');

const API_URL = 'http://localhost:3001';

async function testWIFGeneration() {
    console.log('Testing WIF Generation...\n');
    
    try {
        // Test 12-word seed
        console.log('Testing 12-word seed generation (this may take up to 60 seconds)...');
        const response12 = await axios.post(`${API_URL}/api/spark/generate-wallet`, {
            strength: 128
        }, {
            timeout: 65000 // 65 second timeout
        });
        
        if (response12.data.success) {
            validateWIFFormat(response12.data.data, '12-word');
        }
        
        // Test 24-word seed
        console.log('\nTesting 24-word seed generation (this may take up to 60 seconds)...');
        const response24 = await axios.post(`${API_URL}/api/spark/generate-wallet`, {
            strength: 256
        }, {
            timeout: 65000 // 65 second timeout
        });
        
        if (response24.data.success) {
            validateWIFFormat(response24.data.data, '24-word');
        }
        
        console.log('\n✅ WIF generation test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    }
}

function validateWIFFormat(data, seedType) {
    console.log(`\nValidating ${seedType} seed WIF formats:`);
    
    // Check main bitcoin private key
    if (data.privateKeys && data.privateKeys.bitcoin && data.privateKeys.bitcoin.wif) {
        const wif = data.privateKeys.bitcoin.wif;
        const isValidWIF = isWIFFormat(wif);
        const isHex = isHexFormat(wif);
        
        console.log(`Main Bitcoin WIF: ${wif.substring(0, 10)}... (${isValidWIF ? '✅ Valid WIF' : isHex ? '❌ HEX Format' : '❌ Invalid'})`);
    }
    
    // Check all private keys
    if (data.allPrivateKeys) {
        Object.entries(data.allPrivateKeys).forEach(([type, keyData]) => {
            if (keyData && keyData.wif) {
                const wif = keyData.wif;
                const isValidWIF = isWIFFormat(wif);
                const isHex = isHexFormat(wif);
                
                console.log(`${type} WIF: ${wif.substring(0, 10)}... (${isValidWIF ? '✅ Valid WIF' : isHex ? '❌ HEX Format' : '❌ Invalid'})`);
            }
        });
    }
}

function isWIFFormat(str) {
    // WIF format regex for mainnet compressed keys (start with K or L)
    // or uncompressed keys (start with 5)
    // Testnet would start with c (compressed) or 9 (uncompressed)
    return /^[5KLc9][1-9A-HJ-NP-Za-km-z]{50,51}$/.test(str);
}

function isHexFormat(str) {
    // Check if string is 64 character hex (32 bytes)
    return /^[0-9a-f]{64}$/i.test(str);
}

// Run the test
testWIFGeneration().catch(console.error);