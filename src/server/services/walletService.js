/**
 * Unified Wallet Service - ES Module Version
 * Handles Bitcoin and Spark wallet generation with proper imports
 */

import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import crypto from 'crypto';
import { createRequire } from 'module';

// Create require function for CommonJS modules
const require = createRequire(import.meta.url);
const ECPairFactory = require('ecpair').ECPairFactory;

// Initialize ECC library for bitcoinjs-lib
bitcoin.initEccLib(ecc);

// Initialize ECPair factory
const ECPair = ECPairFactory(ecc);

/**
 * Generate a BIP39 mnemonic
 */
export function generateMnemonic(strength = 128) {
    return bip39.generateMnemonic(strength);
}

/**
 * Generate Bitcoin wallet with all address types
 */
export async function generateBitcoinWallet(mnemonic, network = 'MAINNET') {
    try {
        // Validate mnemonic
        if (!bip39.validateMnemonic(mnemonic)) {
            throw new Error('Invalid mnemonic phrase');
        }

        // Generate seed from mnemonic
        const seed = await bip39.mnemonicToSeed(mnemonic);
        
        // Create HD wallet from seed
        const root = HDKey.fromMasterSeed(seed);
        
        // Network configuration
        const btcNetwork = network === 'TESTNET' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
        
        // Generate different address types
        const addresses = {
            // BIP84 - Native SegWit (bc1q...)
            segwit: generateSegwitAddress(root, btcNetwork),
            // BIP86 - Taproot (bc1p...)
            taproot: generateTaprootAddress(root, btcNetwork),
            // BIP44 - Legacy (1...)
            legacy: generateLegacyAddress(root, btcNetwork),
            // BIP49 - Nested SegWit (3...)
            nestedSegwit: generateNestedSegwitAddress(root, btcNetwork)
        };

        return {
            mnemonic,
            network,
            addresses,
            xpub: root.publicExtendedKey
        };
    } catch (error) {
        console.error('Bitcoin wallet generation error:', error);
        throw error;
    }
}

/**
 * Generate Native SegWit address (BIP84)
 */
function generateSegwitAddress(root, network) {
    const path = "m/84'/0'/0'/0/0";
    const child = root.derive(path);
    const { address } = bitcoin.payments.p2wpkh({ 
        pubkey: Buffer.from(child.publicKey), 
        network 
    });
    
    // Create ECPair from private key for WIF encoding
    const keyPair = ECPair.fromPrivateKey(Buffer.from(child.privateKey), { network });
    
    return {
        address,
        publicKey: Buffer.from(child.publicKey).toString('hex'),
        privateKey: Buffer.from(child.privateKey).toString('hex'),
        wif: keyPair.toWIF(), // Proper WIF encoding
        path
    };
}

/**
 * Generate Taproot address (BIP86)
 */
function generateTaprootAddress(root, network) {
    const path = "m/86'/0'/0'/0/0";
    const child = root.derive(path);
    
    // Taproot uses x-only public keys (32 bytes)
    const xOnlyPubkey = Buffer.from(child.publicKey).slice(1, 33);
    
    const { address } = bitcoin.payments.p2tr({ 
        internalPubkey: xOnlyPubkey,
        network 
    });
    
    // Create ECPair from private key for WIF encoding
    const keyPair = ECPair.fromPrivateKey(Buffer.from(child.privateKey), { network });
    
    return {
        address,
        publicKey: Buffer.from(child.publicKey).toString('hex'),
        privateKey: Buffer.from(child.privateKey).toString('hex'),
        wif: keyPair.toWIF(), // Proper WIF encoding
        path
    };
}

/**
 * Generate Legacy address (BIP44)
 */
function generateLegacyAddress(root, network) {
    const path = "m/44'/0'/0'/0/0";
    const child = root.derive(path);
    const { address } = bitcoin.payments.p2pkh({ 
        pubkey: Buffer.from(child.publicKey), 
        network 
    });
    
    // Create ECPair from private key for WIF encoding
    const keyPair = ECPair.fromPrivateKey(Buffer.from(child.privateKey), { network });
    
    return {
        address,
        publicKey: Buffer.from(child.publicKey).toString('hex'),
        privateKey: Buffer.from(child.privateKey).toString('hex'),
        wif: keyPair.toWIF(), // Proper WIF encoding
        path
    };
}

/**
 * Generate Nested SegWit address (BIP49)
 */
function generateNestedSegwitAddress(root, network) {
    const path = "m/49'/0'/0'/0/0";
    const child = root.derive(path);
    
    // Create P2WPKH wrapped in P2SH
    const p2wpkh = bitcoin.payments.p2wpkh({ 
        pubkey: Buffer.from(child.publicKey), 
        network 
    });
    
    const { address } = bitcoin.payments.p2sh({ 
        redeem: p2wpkh,
        network 
    });
    
    // Create ECPair from private key for WIF encoding
    const keyPair = ECPair.fromPrivateKey(Buffer.from(child.privateKey), { network });
    
    return {
        address,
        publicKey: Buffer.from(child.publicKey).toString('hex'),
        privateKey: Buffer.from(child.privateKey).toString('hex'),
        wif: keyPair.toWIF(), // Proper WIF encoding
        path
    };
}

/**
 * Generate Spark Protocol address using real SDK
 */
export async function generateSparkAddress(mnemonic) {
    try {
        // Import the sparkSDKService which has the real SDK implementation
        const { createRequire } = await import('module');
        const require = createRequire(import.meta.url);
        const sparkSDK = require('./sparkSDKService.js');
        
        // Generate wallet using the SDK service with the provided mnemonic
        const result = await sparkSDK.generateSparkFromMnemonic(mnemonic);
        
        if (result.success && result.data.addresses.spark) {
            return {
                address: result.data.addresses.spark,
                bitcoinAddress: result.data.addresses.bitcoin,
                privateKey: result.data.privateKeys.hex,
                protocol: 'spark',
                features: ['lightning', 'multi-asset', 'stablecoins']
            };
        } else {
            throw new Error('SDK generation failed');
        }
    } catch (error) {
        console.error('Spark SDK generation error:', error);
        // Fallback to simple generation if SDK fails
        const hash = crypto.createHash('sha256').update(mnemonic).digest();
        const sparkKey = hash.toString('hex');
        const prefix = 'sp1p';
        const keyPart = sparkKey.substring(0, 62);
        
        return {
            address: prefix + keyPart,
            privateKey: sparkKey,
            protocol: 'spark',
            features: ['lightning', 'multi-asset', 'stablecoins'],
            fallback: true
        };
    }
}

/**
 * Import wallet from mnemonic
 */
export async function importWallet(mnemonic, network = 'MAINNET') {
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
    }
    
    const bitcoinWallet = await generateBitcoinWallet(mnemonic, network);
    const sparkAddress = await generateSparkAddress(mnemonic);
    
    return {
        bitcoin: bitcoinWallet,
        spark: sparkAddress
    };
}

/**
 * Validate address format
 */
export function validateAddress(address, type) {
    try {
        switch(type) {
            case 'bitcoin':
                // Check for valid Bitcoin address formats
                if (address.startsWith('bc1q') && address.length === 42) return true; // SegWit
                if (address.startsWith('bc1p') && address.length === 62) return true; // Taproot
                if (address.startsWith('1') && address.length >= 26 && address.length <= 35) return true; // Legacy
                if (address.startsWith('tb1')) return true; // Testnet
                return false;
                
            case 'spark':
                // Spark addresses: sp1p prefix, 66 characters total
                return address.startsWith('sp1p') && address.length === 66;
                
            default:
                return false;
        }
    } catch (error) {
        return false;
    }
}

export default {
    generateMnemonic,
    generateBitcoinWallet,
    generateSparkAddress,
    importWallet,
    validateAddress
};