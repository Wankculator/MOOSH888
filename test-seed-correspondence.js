// Test if seed phrase corresponds to the generated addresses
import * as bip39 from 'bip39';
import { HDKey } from '@scure/bip32';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import crypto from 'crypto';

// Initialize Bitcoin library
bitcoin.initEccLib(ecc);

async function testWalletGeneration() {
    console.log('🔍 Testing Seed Phrase to Address Correspondence\n');
    
    // First, get a wallet from the API
    const response = await fetch('http://localhost:3001/api/spark/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strength: 256 })
    });
    
    const apiWallet = await response.json();
    
    if (!apiWallet.success) {
        console.log('❌ API Error:', apiWallet.error);
        return;
    }
    
    const data = apiWallet.data;
    console.log('📡 API Generated Wallet:');
    console.log('Seed:', data.mnemonic.substring(0, 50) + '...');
    console.log('Bitcoin:', data.addresses.bitcoin);
    console.log('Spark:', data.addresses.spark);
    console.log();
    
    // Now manually derive addresses from the seed phrase
    console.log('🔧 Manually Deriving from Same Seed...\n');
    
    const mnemonic = data.mnemonic;
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = HDKey.fromMasterSeed(seed);
    
    // Derive SegWit address (which is the primary Bitcoin address)
    const segwitPath = "m/84'/0'/0'/0/0";
    const segwitKey = root.derive(segwitPath);
    const segwitAddress = bitcoin.payments.p2wpkh({ 
        pubkey: Buffer.from(segwitKey.publicKey),
        network: bitcoin.networks.bitcoin 
    });
    
    // Derive Spark address using the same method as the API
    const sparkHash = crypto.createHash('sha256').update(mnemonic).digest();
    const sparkAddress = 'sp1p' + sparkHash.toString('hex').substring(0, 62);
    
    // Compare results
    console.log('📊 COMPARISON:');
    console.log('─'.repeat(60));
    console.log('Bitcoin Address:');
    console.log('  API returned:', data.addresses.bitcoin);
    console.log('  We derived:  ', segwitAddress.address);
    console.log('  Match?', data.addresses.bitcoin === segwitAddress.address ? '✅ YES' : '❌ NO');
    console.log();
    console.log('Spark Address:');
    console.log('  API returned:', data.addresses.spark);
    console.log('  We derived:  ', sparkAddress);
    console.log('  Match?', data.addresses.spark === sparkAddress ? '✅ YES' : '❌ NO');
    console.log();
    
    // Test if we can derive all address types
    console.log('📍 All Address Types from Same Seed:');
    
    // Legacy
    const legacyKey = root.derive("m/44'/0'/0'/0/0");
    const legacyAddr = bitcoin.payments.p2pkh({ 
        pubkey: Buffer.from(legacyKey.publicKey),
        network: bitcoin.networks.bitcoin 
    });
    console.log('Legacy:', legacyAddr.address);
    
    // Taproot
    const taprootKey = root.derive("m/86'/0'/0'/0/0");
    const taprootAddr = bitcoin.payments.p2tr({ 
        internalPubkey: Buffer.from(taprootKey.publicKey).slice(1, 33),
        network: bitcoin.networks.bitcoin 
    });
    console.log('Taproot:', taprootAddr.address);
    
    // Check private keys
    console.log('\n🔐 Private Key Check:');
    console.log('SegWit Private Key (hex):', Buffer.from(segwitKey.privateKey).toString('hex'));
    console.log('API returned:', data.privateKeys?.bitcoin?.hex || 'NOT PROVIDED');
    
    // Summary
    console.log('\n📋 SUMMARY:');
    if (data.addresses.bitcoin === segwitAddress.address && data.addresses.spark === sparkAddress) {
        console.log('✅ Seed phrase correctly generates all addresses!');
    } else {
        console.log('❌ Seed phrase does NOT match the addresses!');
        console.log('This is a critical issue that needs to be fixed.');
    }
}

testWalletGeneration().catch(console.error);