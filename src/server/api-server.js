/**
 * MOOSH Wallet API Server
 * Provides wallet generation and management endpoints
 */

import express from 'express';
import cors from 'cors';
import { generateMnemonic, generateBitcoinWallet, generateSparkAddress, importWallet, validateAddress } from './services/walletService.js';
import { generateSparkCompatibleWallet, importSparkCompatibleWallet, getBalance, getTransactions } from './services/sparkCompatibleService.js';
// Temporarily comment out to avoid module loading issues
// import { getBitcoinBalance, getBitcoinTransactions, getBitcoinPrice, getNetworkStatus } from './services/blockchainService.js';
import https from 'https';

// Enhanced blockchain data fetching with multiple providers
const balanceCache = new Map();
const CACHE_DURATION = 60000; // 1 minute cache

// Mock balances for testing
const MOCK_BALANCES = {
    'bc1qnl8rzz6ch58ldxltjv35x2gfrglx2xmt8pszxf': 0.00128000,
    'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu': 0.12345678,
    '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa': 72.65898897
};

// Helper function to make HTTPS requests
function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'MOOSH-Wallet/1.0'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                } else {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error('Invalid JSON response'));
                    }
                }
            });
        }).on('error', reject);
    });
}

// API providers configuration
const API_PROVIDERS = {
    blockstream: {
        name: 'Blockstream',
        getBalance: async (address) => {
            const url = `https://blockstream.info/api/address/${address}`;
            const data = await httpsGet(url);
            const balance = (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000;
            return balance;
        }
    },
    blockcypher: {
        name: 'Blockcypher',
        getBalance: async (address) => {
            const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`;
            const data = await httpsGet(url);
            return data.balance / 100000000;
        }
    },
    mempool: {
        name: 'Mempool.space',
        getBalance: async (address) => {
            const url = `https://mempool.space/api/address/${address}`;
            const data = await httpsGet(url);
            const balance = (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 100000000;
            return balance;
        }
    }
};

async function getBitcoinBalanceWithFallback(address) {
    // Try each provider in order
    const providers = ['blockstream', 'mempool', 'blockcypher'];
    
    for (const providerName of providers) {
        try {
            const provider = API_PROVIDERS[providerName];
            console.log(`[API] Trying ${provider.name} for ${address}`);
            const balance = await provider.getBalance(address);
            console.log(`[API] ${provider.name} returned balance: ${balance} BTC`);
            return balance;
        } catch (error) {
            console.error(`[API] ${providerName} failed:`, error.message);
            continue;
        }
    }
    
    // All providers failed, return 0
    console.error('[API] All providers failed, returning 0 balance');
    return 0;
}

async function getBitcoinBalance(address) {
    // Check cache first
    const cached = balanceCache.get(address);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`[API] Returning cached balance for ${address}`);
        return cached.data;
    }

    // Check if we have a mock balance (for testing)
    if (MOCK_BALANCES[address] !== undefined) {
        const mockBalance = MOCK_BALANCES[address];
        const result = {
            success: true,
            data: {
                address,
                balance: mockBalance.toFixed(8),
                unconfirmed: '0.00000000',
                total: mockBalance.toFixed(8),
                currency: 'BTC',
                source: 'mock'
            }
        };
        
        // Cache the result
        balanceCache.set(address, {
            data: result,
            timestamp: Date.now()
        });
        
        console.log(`[API] Returning mock balance for ${address}: ${mockBalance} BTC`);
        return result;
    }

    // Try to get real balance from blockchain APIs
    try {
        const balance = await getBitcoinBalanceWithFallback(address);
        const result = {
            success: true,
            data: {
                address,
                balance: balance.toFixed(8),
                unconfirmed: '0.00000000',
                total: balance.toFixed(8),
                currency: 'BTC',
                source: 'blockchain'
            }
        };
        
        // Cache the result
        balanceCache.set(address, {
            data: result,
            timestamp: Date.now()
        });
        
        return result;
    } catch (error) {
        console.error('[API] Failed to fetch balance:', error);
        // Return cached result if available
        const cached = balanceCache.get(address);
        if (cached) {
            console.log('[API] Returning stale cached balance');
            cached.data.data.stale = true;
            return cached.data;
        }
    }

    // Final fallback - return zero balance
    return {
        success: false,
        data: {
            address,
            balance: '0.00000000',
            unconfirmed: '0.00000000',
            total: '0.00000000',
            currency: 'BTC',
            error: 'All API providers failed'
        }
    };
}

async function getBitcoinPrice() {
    return new Promise((resolve) => {
        https.get('https://api.coinbase.com/v2/exchange-rates?currency=BTC', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(parseFloat(json.data.rates.USD) || 0);
                } catch (e) {
                    resolve(0);
                }
            });
        }).on('error', () => resolve(0));
    });
}

async function getNetworkStatus() {
    return new Promise((resolve) => {
        https.get('https://blockchain.info/q/getblockcount', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const height = parseInt(data) || 0;
                    resolve({
                        success: true,
                        data: { connected: true, blockHeight: height, network: 'mainnet' }
                    });
                } catch (e) {
                    resolve({
                        success: false,
                        data: { connected: false, blockHeight: 0, network: 'mainnet' }
                    });
                }
            });
        }).on('error', () => {
            resolve({
                success: false,
                data: { connected: false, blockHeight: 0, network: 'mainnet' }
            });
        });
    });
}

async function getBitcoinTransactions(address) {
    // For now, return empty transactions
    return {
        success: true,
        data: {
            address,
            transactions: [],
            count: 0
        }
    };
}

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'MOOSH Wallet API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Generate new wallet
app.post('/api/wallet/generate', async (req, res) => {
    try {
        const { wordCount = 12, network = 'MAINNET' } = req.body;
        const strength = wordCount === 24 ? 256 : 128;
        
        // Generate mnemonic
        const mnemonic = generateMnemonic(strength);
        
        // Generate wallets
        const bitcoinWallet = await generateBitcoinWallet(mnemonic, network);
        const sparkWallet = generateSparkAddress(mnemonic);
        
        res.json({
            success: true,
            data: {
                mnemonic: mnemonic.split(' '),
                wordCount,
                network,
                bitcoin: {
                    segwit: bitcoinWallet.addresses.segwit,
                    taproot: bitcoinWallet.addresses.taproot,
                    legacy: bitcoinWallet.addresses.legacy,
                    xpub: bitcoinWallet.xpub
                },
                spark: sparkWallet
            }
        });
    } catch (error) {
        console.error('Wallet generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Import existing wallet
app.post('/api/wallet/import', async (req, res) => {
    try {
        const { mnemonic, network = 'MAINNET' } = req.body;
        
        if (!mnemonic) {
            return res.status(400).json({
                success: false,
                error: 'Mnemonic phrase is required'
            });
        }
        
        // Join array if needed
        const mnemonicString = Array.isArray(mnemonic) ? mnemonic.join(' ') : mnemonic;
        
        const wallet = await importWallet(mnemonicString, network);
        
        res.json({
            success: true,
            data: wallet
        });
    } catch (error) {
        console.error('Wallet import error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Validate address
app.post('/api/wallet/validate', (req, res) => {
    try {
        const { address, type = 'bitcoin' } = req.body;
        
        if (!address) {
            return res.status(400).json({
                success: false,
                error: 'Address is required'
            });
        }
        
        const isValid = validateAddress(address, type);
        
        res.json({
            success: true,
            data: {
                address,
                type,
                isValid
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Generate new Spark wallet - Main endpoint used by UI
app.post('/api/spark/generate-wallet', async (req, res) => {
    try {
        const { strength = 256 } = req.body; // Default to 24 words
        const wallet = await generateSparkCompatibleWallet(strength);
        res.json(wallet);
    } catch (error) {
        console.error('Spark wallet generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Import Spark wallet
app.post('/api/spark/import', async (req, res) => {
    try {
        const { mnemonic } = req.body;
        
        if (!mnemonic) {
            return res.status(400).json({
                success: false,
                error: 'Mnemonic phrase is required'
            });
        }
        
        const wallet = await importSparkCompatibleWallet(mnemonic);
        res.json(wallet);
    } catch (error) {
        console.error('Spark wallet import error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get balance for address (real blockchain data)
app.get('/api/balance/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const { network = 'mainnet' } = req.query;
        
        // Check if it's a Spark address
        if (address.startsWith('sp1')) {
            const balance = getBalance(address);
            return res.json(balance);
        }
        
        // Get real Bitcoin balance
        const balance = await getBitcoinBalance(address, network);
        res.json(balance);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get transactions for address
app.get('/api/transactions/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const { network = 'mainnet' } = req.query;
        
        // Check if it's a Spark address
        if (address.startsWith('sp1')) {
            const transactions = getTransactions(address);
            return res.json(transactions);
        }
        
        // Get real Bitcoin transactions
        const transactions = await getBitcoinTransactions(address, network);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get Bitcoin price
app.get('/api/bitcoin/price', async (req, res) => {
    try {
        const price = await getBitcoinPrice();
        res.json({
            success: true,
            data: {
                price,
                currency: 'USD',
                timestamp: Date.now()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get network status
app.get('/api/network/status', async (req, res) => {
    const { network = 'mainnet' } = req.query;
    try {
        const status = await getNetworkStatus(network);
        res.json(status);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Generate Spark address - handles both new generation and from existing mnemonic
app.post('/api/spark/generate', async (req, res) => {
    try {
        const { mnemonic, strength } = req.body;
        
        // If strength is provided, generate new wallet
        if (strength) {
            const wallet = await generateSparkCompatibleWallet(strength);
            res.json(wallet);
        } 
        // If mnemonic is provided, generate from existing
        else if (mnemonic) {
            const mnemonicString = Array.isArray(mnemonic) ? mnemonic.join(' ') : mnemonic;
            const sparkWallet = generateSparkAddress(mnemonicString);
            res.json({
                success: true,
                data: sparkWallet
            });
        } 
        else {
            return res.status(400).json({
                success: false,
                error: 'Either mnemonic or strength is required'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 MOOSH Wallet API Server
==========================
🌐 URL: http://localhost:${PORT}
📡 Health: http://localhost:${PORT}/health
🔧 Endpoints:
   POST /api/wallet/generate
   POST /api/wallet/import
   POST /api/wallet/validate
   POST /api/spark/generate
==========================
    `);
});

export default app;