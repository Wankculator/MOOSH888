// Fix for wallet import - Support multiple derivation paths and indices

// 1. Update walletService.js to support custom indices
// Add these parameters to each address generation function:

/**
 * Generate Nested SegWit address (BIP49) with custom indices
 * @param {HDKey} root - HD wallet root
 * @param {object} network - Bitcoin network
 * @param {number} accountIndex - Account index (default 0)
 * @param {number} addressIndex - Address index (default 0)
 */
function generateNestedSegwitAddressWithIndex(root, network, accountIndex = 0, addressIndex = 0) {
    const path = `m/49'/0'/${accountIndex}'/0/${addressIndex}`;
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
    
    const keyPair = ECPair.fromPrivateKey(Buffer.from(child.privateKey), { network });
    
    return {
        address,
        publicKey: Buffer.from(child.publicKey).toString('hex'),
        privateKey: Buffer.from(child.privateKey).toString('hex'),
        wif: keyPair.toWIF(),
        path,
        accountIndex,
        addressIndex
    };
}

// 2. Add a function to scan multiple addresses to find matching ones
async function scanForMatchingAddress(mnemonic, targetAddress, network = 'MAINNET') {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = HDKey.fromMasterSeed(seed);
    const btcNetwork = network === 'TESTNET' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
    
    const results = [];
    
    // Scan first 5 accounts and first 20 addresses in each
    for (let account = 0; account < 5; account++) {
        for (let address = 0; address < 20; address++) {
            // Check all address types
            const addresses = {
                nestedSegwit: generateNestedSegwitAddressWithIndex(root, btcNetwork, account, address),
                segwit: generateSegwitAddressWithIndex(root, btcNetwork, account, address),
                legacy: generateLegacyAddressWithIndex(root, btcNetwork, account, address),
                taproot: generateTaprootAddressWithIndex(root, btcNetwork, account, address)
            };
            
            // Check if any match the target
            for (const [type, data] of Object.entries(addresses)) {
                if (data.address === targetAddress) {
                    results.push({
                        type,
                        ...data,
                        found: true
                    });
                }
            }
        }
    }
    
    return results;
}

// 3. Update the import endpoint to support address scanning
app.post('/api/spark/import-with-scan', async (req, res) => {
    try {
        const { mnemonic, targetAddress } = req.body;
        
        if (!mnemonic) {
            return res.status(400).json({
                success: false,
                error: 'Mnemonic phrase is required'
            });
        }
        
        // Normal import
        const wallet = await importSparkCompatibleWallet(mnemonic);
        
        // If target address provided, scan for it
        let scanResults = null;
        if (targetAddress) {
            scanResults = await scanForMatchingAddress(mnemonic, targetAddress);
        }
        
        res.json({
            ...wallet,
            scanResults
        });
    } catch (error) {
        console.error('Wallet import with scan error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 4. Client-side fix to check nested SegWit address
// In moosh-wallet.js, update getCurrentWalletAddress to handle nested SegWit:

getCurrentWalletAddress() {
    const selectedType = this.app.state.get('selectedWalletType') || localStorage.getItem('selectedWalletType') || 'taproot';
    
    console.log('[Dashboard] Getting wallet address for type:', selectedType);
    
    const currentAccount = this.app.state.getCurrentAccount();
    
    if (currentAccount && currentAccount.addresses) {
        console.log('[Dashboard] Current account addresses:', currentAccount.addresses);
        
        // Map wallet types to their addresses from current account
        const addressMap = {
            'taproot': currentAccount.addresses.taproot || '',
            'nativeSegWit': currentAccount.addresses.segwit || currentAccount.addresses.bitcoin || '',
            'nestedSegWit': currentAccount.addresses.nestedSegWit || currentAccount.addresses.nestedSegwit || '',  // Fix case sensitivity
            'legacy': currentAccount.addresses.legacy || '',
            'spark': currentAccount.addresses.spark || ''
        };
        
        const address = addressMap[selectedType] || currentAccount.addresses.bitcoin || '';
        
        console.log('[Dashboard] Selected address type:', selectedType);
        console.log('[Dashboard] Resolved address:', address);
        
        return address;
    }
    
    return 'No wallet loaded';
}

// 5. Debug helper to show all addresses for imported wallet
function debugImportedAddresses(mnemonic) {
    console.log('\n=== IMPORTED WALLET ADDRESS ANALYSIS ===');
    console.log('Mnemonic words:', mnemonic.split(' ').length);
    
    // Generate all addresses for first account
    const addresses = generateBitcoinWallet(mnemonic, 'MAINNET');
    
    console.log('\nGenerated Addresses (Account 0, Address 0):');
    console.log('Native SegWit (bc1q...):', addresses.addresses.segwit.address);
    console.log('Nested SegWit (3...):', addresses.addresses.nestedSegwit.address);
    console.log('Legacy (1...):', addresses.addresses.legacy.address);
    console.log('Taproot (bc1p...):', addresses.addresses.taproot.address);
    
    console.log('\nDerivation Paths:');
    console.log('Native SegWit:', addresses.addresses.segwit.path);
    console.log('Nested SegWit:', addresses.addresses.nestedSegwit.path);
    console.log('Legacy:', addresses.addresses.legacy.path);
    console.log('Taproot:', addresses.addresses.taproot.path);
    
    return addresses;
}

// Example usage:
// If the user's UniSat address is "bc1qnl8rzz6ch58ldxltjv35x2gfrglx2xmt8pszxf"
// This is a native SegWit address, not nested SegWit
// Nested SegWit addresses start with "3"

console.log(`
WALLET IMPORT ANALYSIS:
======================
The address "bc1qnl8rzz6ch58ldxltjv35x2gfrglx2xmt8pszxf" is a NATIVE SEGWIT address.

Address Types:
- Native SegWit: starts with "bc1q" (bech32)
- Nested SegWit: starts with "3" (P2SH-wrapped)
- Legacy: starts with "1" (P2PKH)
- Taproot: starts with "bc1p" (bech32m)

If UniSat shows this address, they are using Native SegWit, not Nested SegWit.
To get the same address in MOOSH Wallet, ensure you select "Native SegWit" address type.

If UniSat is showing a different address for the same seed phrase, it could be:
1. Using a different account index (not 0)
2. Using a different address index within the account (not 0)
3. Using a different derivation path standard
`);