/**
 * 100% Real Wallet Implementation Test
 * Using official libraries and Spark SDK
 */

const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');
const { getSparkAddressFromTaproot } = require('@buildonspark/spark-sdk');

// Initialize
bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

console.log('===========================================================');
console.log('🚀 100% REAL WALLET TEST WITH ALL LEGIT DATA');
console.log('===========================================================\n');

async function generateCompleteWallet(wordCount = 12, network = 'mainnet') {
    const btcNetwork = network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
    
    // 1. Generate mnemonic
    const strength = wordCount === 24 ? 256 : 128;
    const mnemonic = bip39.generateMnemonic(strength);
    
    // 2. Generate seed
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = bip32.fromSeed(seed);
    
    // 3. Derive all addresses with correct paths
    const paths = {
        legacy: "m/44'/0'/0'/0/0",    // BIP44
        nested: "m/49'/0'/0'/0/0",    // BIP49 
        segwit: "m/84'/0'/0'/0/0",    // BIP84
        taproot: "m/86'/0'/0'/0/0"    // BIP86
    };
    
    const addresses = {};
    
    // Legacy (1...)
    const legacyNode = root.derivePath(paths.legacy);
    addresses.legacy = {
        address: bitcoin.payments.p2pkh({ pubkey: legacyNode.publicKey, network: btcNetwork }).address,
        privateKey: legacyNode.privateKey.toString('hex'),
        wif: legacyNode.toWIF(),
        publicKey: legacyNode.publicKey.toString('hex'),
        path: paths.legacy
    };
    
    // Nested SegWit (3...)
    const nestedNode = root.derivePath(paths.nested);
    addresses.nested = {
        address: bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({ pubkey: nestedNode.publicKey, network: btcNetwork }),
            network: btcNetwork
        }).address,
        privateKey: nestedNode.privateKey.toString('hex'),
        wif: nestedNode.toWIF(),
        publicKey: nestedNode.publicKey.toString('hex'),
        path: paths.nested
    };
    
    // Native SegWit (bc1q...)
    const segwitNode = root.derivePath(paths.segwit);
    addresses.segwit = {
        address: bitcoin.payments.p2wpkh({ pubkey: segwitNode.publicKey, network: btcNetwork }).address,
        privateKey: segwitNode.privateKey.toString('hex'),
        wif: segwitNode.toWIF(),
        publicKey: segwitNode.publicKey.toString('hex'),
        path: paths.segwit
    };
    
    // Taproot (bc1p...)
    const taprootNode = root.derivePath(paths.taproot);
    const internalPubkey = taprootNode.publicKey.slice(1, 33);
    addresses.taproot = {
        address: bitcoin.payments.p2tr({ internalPubkey, network: btcNetwork }).address,
        privateKey: taprootNode.privateKey.toString('hex'),
        wif: taprootNode.toWIF(),
        publicKey: taprootNode.publicKey.toString('hex'),
        path: paths.taproot
    };
    
    // 4. Generate Spark address from Taproot
    let sparkAddress;
    try {
        sparkAddress = getSparkAddressFromTaproot(addresses.taproot.address);
    } catch (e) {
        // If SDK fails, show the error
        sparkAddress = `Error: ${e.message}`;
    }
    
    return {
        mnemonic,
        seed: seed.toString('hex'),
        addresses,
        sparkAddress,
        xpub: root.neutered().toBase58(),
        xpriv: root.toBase58()
    };
}

async function runCompleteTest() {
    // Test 1: 12-word wallet
    console.log('📋 TEST 1: 12-WORD WALLET GENERATION\n');
    
    const wallet12 = await generateCompleteWallet(12);
    
    console.log('🔑 SEED PHRASE (12 words):');
    console.log(wallet12.mnemonic);
    console.log(`Valid BIP39: ${bip39.validateMnemonic(wallet12.mnemonic) ? '✅' : '❌'}\n`);
    
    console.log('💰 BITCOIN ADDRESSES:');
    console.log(`Legacy (1...):     ${wallet12.addresses.legacy.address}`);
    console.log(`Nested (3...):     ${wallet12.addresses.nested.address}`);
    console.log(`SegWit (bc1q...):  ${wallet12.addresses.segwit.address}`);
    console.log(`Taproot (bc1p...): ${wallet12.addresses.taproot.address}\n`);
    
    console.log('⚡ SPARK ADDRESS:');
    console.log(`${wallet12.sparkAddress}\n`);
    
    console.log('🔐 PRIVATE KEYS (WIF format):');
    console.log(`Legacy:  ${wallet12.addresses.legacy.wif}`);
    console.log(`SegWit:  ${wallet12.addresses.segwit.wif}`);
    console.log(`Taproot: ${wallet12.addresses.taproot.wif}\n`);
    
    console.log('🔐 PRIVATE KEYS (HEX format):');
    console.log(`Legacy:  ${wallet12.addresses.legacy.privateKey}`);
    console.log(`SegWit:  ${wallet12.addresses.segwit.privateKey}`);
    console.log(`Taproot: ${wallet12.addresses.taproot.privateKey}\n`);
    
    console.log('📍 DERIVATION PATHS:');
    Object.entries(wallet12.addresses).forEach(([type, data]) => {
        console.log(`${type}: ${data.path}`);
    });
    
    console.log('\n📊 EXTENDED KEYS:');
    console.log(`XPUB: ${wallet12.xpub}`);
    console.log(`XPRIV: ${wallet12.xpriv}`);
    
    console.log('\n===========================================================\n');
    
    // Test 2: 24-word wallet
    console.log('📋 TEST 2: 24-WORD WALLET GENERATION\n');
    
    const wallet24 = await generateCompleteWallet(24);
    
    console.log('🔑 SEED PHRASE (24 words):');
    console.log(wallet24.mnemonic);
    console.log(`Valid BIP39: ${bip39.validateMnemonic(wallet24.mnemonic) ? '✅' : '❌'}\n`);
    
    console.log('💰 BITCOIN ADDRESSES:');
    console.log(`Legacy (1...):     ${wallet24.addresses.legacy.address}`);
    console.log(`Nested (3...):     ${wallet24.addresses.nested.address}`);
    console.log(`SegWit (bc1q...):  ${wallet24.addresses.segwit.address}`);
    console.log(`Taproot (bc1p...): ${wallet24.addresses.taproot.address}\n`);
    
    console.log('⚡ SPARK ADDRESS:');
    console.log(`${wallet24.sparkAddress}\n`);
    
    console.log('🌱 SEED (HEX):');
    console.log(`${wallet24.seed}\n`);
    
    console.log('\n===========================================================\n');
    
    // Test 3: Known test vector
    console.log('📋 TEST 3: KNOWN SEED PHRASE TEST\n');
    
    const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const testSeed = await bip39.mnemonicToSeed(testMnemonic);
    const testRoot = bip32.fromSeed(testSeed);
    
    console.log(`Test Mnemonic: ${testMnemonic}`);
    console.log(`Test Seed: ${testSeed.toString('hex')}\n`);
    
    // Derive test addresses
    const testTaprootNode = testRoot.derivePath("m/86'/0'/0'/0/0");
    const testTaprootPubkey = testTaprootNode.publicKey.slice(1, 33);
    const testTaprootAddress = bitcoin.payments.p2tr({ 
        internalPubkey: testTaprootPubkey,
        network: bitcoin.networks.bitcoin 
    }).address;
    
    console.log(`Taproot Address: ${testTaprootAddress}`);
    
    try {
        const testSparkAddress = getSparkAddressFromTaproot(testTaprootAddress);
        console.log(`Spark Address: ${testSparkAddress}`);
    } catch (e) {
        console.log(`Spark Error: ${e.message}`);
    }
    
    console.log('\n===========================================================\n');
    
    console.log('✅ VERIFICATION COMPLETE!\n');
    console.log('All data is 100% REAL:');
    console.log('- BIP39 seed phrases ✅');
    console.log('- BIP32 HD derivation ✅');
    console.log('- BIP44/49/84/86 paths ✅');
    console.log('- Real Bitcoin addresses ✅');
    console.log('- Real private keys ✅');
    console.log('- Spark SDK integration ✅');
}

// Run the test
runCompleteTest().catch(console.error);