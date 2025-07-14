/**
 * MOOSH Wallet API Server
 * Provides wallet generation and management endpoints
 */

import express from 'express';
import cors from 'cors';
import { generateMnemonic, generateBitcoinWallet, generateSparkAddress, importWallet, validateAddress } from './services/walletService.js';
import { generateSparkCompatibleWallet, importSparkCompatibleWallet, getBalance, getTransactions } from './services/sparkCompatibleService.js';

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

// Get balance for address
app.get('/api/balance/:address', (req, res) => {
    try {
        const { address } = req.params;
        const balance = getBalance(address);
        res.json(balance);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get transactions for address
app.get('/api/transactions/:address', (req, res) => {
    try {
        const { address } = req.params;
        const transactions = getTransactions(address);
        res.json(transactions);
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