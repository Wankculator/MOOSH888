/**
 * Spark Compatible Service
 * Transforms wallet data to match the MOOSH Wallet UI expectations
 */

import { generateMnemonic, generateBitcoinWallet, generateSparkAddress, importWallet } from './walletService.js';

/**
 * Generate wallet in Spark-compatible format
 * @param {number} strength - 128 for 12 words, 256 for 24 words
 * @returns {object} Wallet data formatted for UI
 */
export async function generateSparkCompatibleWallet(strength = 256) {
    // Generate mnemonic
    const mnemonic = generateMnemonic(strength);
    
    // Generate wallets
    const bitcoinWallet = await generateBitcoinWallet(mnemonic, 'MAINNET');
    const sparkWallet = await generateSparkAddress(mnemonic);
    
    // Format response to match UI expectations
    return {
        success: true,
        data: {
            mnemonic: mnemonic, // UI expects string, not array
            addresses: {
                bitcoin: bitcoinWallet.addresses.segwit.address, // Primary Bitcoin address
                spark: sparkWallet.address
            },
            privateKeys: {
                bitcoin: {
                    wif: bitcoinWallet.addresses.segwit.wif || bitcoinWallet.addresses.segwit.privateKey,
                    hex: bitcoinWallet.addresses.segwit.privateKey
                },
                spark: {
                    hex: sparkWallet.privateKey
                }
            },
            // Additional data the UI might use
            bitcoinAddresses: {
                segwit: bitcoinWallet.addresses.segwit.address,
                taproot: bitcoinWallet.addresses.taproot.address,
                legacy: bitcoinWallet.addresses.legacy.address,
                nestedSegwit: bitcoinWallet.addresses.nestedSegwit?.address || bitcoinWallet.addresses.nestedSegWit?.address || ''
            },
            allPrivateKeys: {
                segwit: {
                    wif: bitcoinWallet.addresses.segwit.wif || bitcoinWallet.addresses.segwit.privateKey,
                    hex: bitcoinWallet.addresses.segwit.privateKey
                },
                taproot: {
                    wif: bitcoinWallet.addresses.taproot.wif || bitcoinWallet.addresses.taproot.privateKey,
                    hex: bitcoinWallet.addresses.taproot.privateKey
                },
                legacy: {
                    wif: bitcoinWallet.addresses.legacy.wif || bitcoinWallet.addresses.legacy.privateKey,
                    hex: bitcoinWallet.addresses.legacy.privateKey
                },
                nestedSegwit: {
                    wif: bitcoinWallet.addresses.nestedSegwit?.wif || bitcoinWallet.addresses.nestedSegwit?.privateKey || '',
                    hex: bitcoinWallet.addresses.nestedSegwit?.privateKey || ''
                },
                spark: {
                    hex: sparkWallet.privateKey
                }
            },
            xpub: bitcoinWallet.xpub || '',
            xpriv: bitcoinWallet.xpriv || '',
            sparkPath: sparkWallet.path,
            wordCount: strength === 256 ? 24 : 12
        }
    };
}

/**
 * Import wallet in Spark-compatible format
 * @param {string} mnemonic - Seed phrase
 * @returns {object} Wallet data formatted for UI
 */
export async function importSparkCompatibleWallet(mnemonic) {
    const wallet = await importWallet(mnemonic, 'MAINNET');
    
    // Transform to UI format
    return {
        success: true,
        data: {
            mnemonic: mnemonic,
            addresses: {
                bitcoin: wallet.bitcoin.addresses.segwit.address,
                spark: wallet.spark.address
            },
            privateKeys: {
                bitcoin: {
                    wif: wallet.bitcoin.addresses.segwit.wif || wallet.bitcoin.addresses.segwit.privateKey,
                    hex: wallet.bitcoin.addresses.segwit.privateKey
                },
                spark: {
                    hex: wallet.spark.privateKey
                }
            },
            bitcoinAddresses: {
                segwit: wallet.bitcoin.addresses.segwit.address,
                taproot: wallet.bitcoin.addresses.taproot.address,
                legacy: wallet.bitcoin.addresses.legacy.address,
                nestedSegwit: wallet.bitcoin.addresses.nestedSegwit?.address || wallet.bitcoin.addresses.nestedSegWit?.address || ''
            },
            allPrivateKeys: {
                segwit: {
                    wif: wallet.bitcoin.addresses.segwit.wif || wallet.bitcoin.addresses.segwit.privateKey,
                    hex: wallet.bitcoin.addresses.segwit.privateKey
                },
                taproot: {
                    wif: wallet.bitcoin.addresses.taproot.wif || wallet.bitcoin.addresses.taproot.privateKey,
                    hex: wallet.bitcoin.addresses.taproot.privateKey
                },
                legacy: {
                    wif: wallet.bitcoin.addresses.legacy.wif || wallet.bitcoin.addresses.legacy.privateKey,
                    hex: wallet.bitcoin.addresses.legacy.privateKey
                },
                nestedSegwit: {
                    wif: wallet.bitcoin.addresses.nestedSegwit?.wif || wallet.bitcoin.addresses.nestedSegwit?.privateKey || '',
                    hex: wallet.bitcoin.addresses.nestedSegwit?.privateKey || ''
                },
                spark: {
                    hex: wallet.spark.privateKey
                }
            },
            xpub: wallet.bitcoin.xpub || '',
            wordCount: mnemonic.trim().split(/\s+/).length
        }
    };
}

/**
 * Get mock balance (for now)
 * @param {string} address - Bitcoin or Spark address
 * @returns {object} Balance data
 */
export function getBalance(address) {
    // For demonstration, return some test balances
    // In production, this would connect to real blockchain APIs
    
    // Known test addresses with balances
    const testBalances = {
        // Test address from the standard test mnemonic
        'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu': '0.12345678',
        // Satoshi's address (has real balance)
        '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa': '72.65898897',
        // Another test address
        '37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf': '0.50000000'
    };
    
    const balance = testBalances[address] || '0.00000000';
    
    return {
        success: true,
        data: {
            address,
            balance: balance,
            unconfirmed: '0.00000000',
            total: balance,
            currency: address.startsWith('sp1') ? 'SPARK' : 'BTC',
            // Add some additional info for testing
            note: balance !== '0.00000000' ? 'Test balance for demonstration' : 'No balance found'
        }
    };
}

/**
 * Get mock transactions (for now)
 * @param {string} address - Bitcoin or Spark address
 * @returns {object} Transaction list
 */
export function getTransactions(address) {
    // Mock transactions for UI testing
    return {
        success: true,
        data: {
            address,
            transactions: [],
            count: 0
        }
    };
}

export default {
    generateSparkCompatibleWallet,
    importSparkCompatibleWallet,
    getBalance,
    getTransactions
};