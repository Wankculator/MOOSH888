// Quick test to verify private keys are being generated
const http = require('http');

console.log('Testing wallet generation with private keys...\n');

const data = JSON.stringify({ strength: 256 });

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/spark/generate-wallet',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
        body += chunk;
    });
    
    res.on('end', () => {
        try {
            const wallet = JSON.parse(body);
            
            if (wallet.success) {
                console.log('✅ WALLET GENERATED!\n');
                
                console.log('🔑 SEED PHRASE:');
                console.log(wallet.data.mnemonic);
                console.log();
                
                console.log('📍 ADDRESSES:');
                console.log('Bitcoin:', wallet.data.addresses.bitcoin);
                console.log('Spark:', wallet.data.addresses.spark);
                console.log();
                
                console.log('🔐 PRIVATE KEYS:');
                console.log('Bitcoin (HEX):', wallet.data.privateKeys.bitcoin.hex);
                console.log('Bitcoin (WIF):', wallet.data.privateKeys.bitcoin.wif);
                console.log('Spark (HEX):', wallet.data.privateKeys.spark.hex);
                console.log();
                
                console.log('🔐 ALL PRIVATE KEYS:');
                if (wallet.data.allPrivateKeys) {
                    console.log('SegWit:', wallet.data.allPrivateKeys.segwit);
                    console.log('Taproot:', wallet.data.allPrivateKeys.taproot);
                    console.log('Legacy:', wallet.data.allPrivateKeys.legacy);
                }
            } else {
                console.log('❌ Error:', wallet.error);
            }
        } catch (e) {
            console.log('❌ Failed to parse response:', e.message);
            console.log('Response:', body);
        }
    });
});

req.on('error', (e) => {
    console.error('❌ Connection error:', e.message);
    console.log('\n⚠️  Make sure to restart the API server to load the private key fixes!');
    console.log('Run: node src/server/api-server.js');
});

req.write(data);
req.end();