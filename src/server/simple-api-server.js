const http = require('http');
const url = require('url');
const querystring = require('querystring');
const cors = require('./simple-cors');

// Import services
let generateSparkWallet, importSparkWallet;

// Try exact implementation first (matches test vectors exactly)
try {
    const exactSparkImpl = require('./spark-exact-implementation.js');
    generateSparkWallet = exactSparkImpl.generateSparkWallet;
    importSparkWallet = exactSparkImpl.importSparkWallet;
    console.log('✅ Using EXACT Spark implementation with test vectors');
} catch (err) {
    // Try proper implementation with bech32m
    try {
        const properSparkImpl = require('./proper-spark-implementation.js');
        generateSparkWallet = properSparkImpl.generateSparkWallet;
        importSparkWallet = properSparkImpl.importSparkWallet;
        console.log('✅ Using PROPER Spark implementation with bech32m encoding');
    } catch (err2) {
        // Try real implementation
        try {
            const realSparkImpl = require('./real-spark-implementation.js');
            generateSparkWallet = realSparkImpl.generateSparkWallet;
            importSparkWallet = realSparkImpl.importSparkWallet;
            console.log('✅ Using REAL Spark implementation with test vectors');
        } catch (err3) {
            // Fallback to spark service
            try {
                const sparkService = require('./services/sparkWalletService.js');
                generateSparkWallet = sparkService.generateSparkWallet;
                importSparkWallet = sparkService.importSparkWallet;
                console.log('⚠️ Using spark wallet service');
            } catch (err4) {
                // Final fallback to mock
                console.log('⚠️ Using mock wallet service');
                const mockService = require('./services/mockWalletService.js');
                generateSparkWallet = mockService.generateSparkWallet;
                importSparkWallet = mockService.importSparkWallet;
            }
        }
    }
}

const PORT = process.env.PORT || 3001;

// Create server
const server = http.createServer(async (req, res) => {
    // Add CORS headers
    cors(req, res);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);
    
    // Route handlers
    if (pathname === '/api/spark/generate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { network = 'MAINNET', strength = 128 } = data;
                
                console.log('🔑 Generating new Spark wallet...');
                console.log(`   Strength: ${strength} bits (${strength === 256 ? '24' : '12'} words)`);
                
                const walletData = await generateSparkWallet(network, strength);
                
                if (walletData.success) {
                    console.log('✅ Wallet generated successfully');
                    console.log(`   Spark Address: ${walletData.data.addresses.spark}`);
                    console.log(`   Bitcoin Address: ${walletData.data.addresses.bitcoin}`);
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(walletData));
            } catch (error) {
                console.error('❌ Generation error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
    }
    else if (pathname === '/api/spark/import' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { mnemonic, network = 'MAINNET' } = data;
                
                if (!mnemonic) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Mnemonic phrase is required' }));
                    return;
                }
                
                console.log('📥 Importing Spark wallet...');
                const walletData = await importSparkWallet(mnemonic, network);
                
                if (walletData.success) {
                    console.log('✅ Wallet imported successfully');
                    console.log(`   Spark Address: ${walletData.data.addresses.spark}`);
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(walletData));
            } catch (error) {
                console.error('❌ Import error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
    }
    else if (pathname === '/api/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'moosh-wallet-api'
        }));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Simple CORS module
function simpleCors(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
}

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`
🚀 MOOSH Wallet Simple API Server
============================================
🌐 Local:    http://localhost:${PORT}
🌐 Network:  http://0.0.0.0:${PORT}
🕐 Started:  ${new Date().toISOString()}
💻 Mode:     Simple HTTP API Server
============================================

Available endpoints:
  POST /api/spark/generate   - Generate new Spark wallet
  POST /api/spark/import     - Import from seed phrase
  GET  /api/health          - Health check
    `);
});

// Error handling
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Export the CORS function
module.exports = { cors: simpleCors };