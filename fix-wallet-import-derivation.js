/**
 * Fix for Wallet Import Derivation Path Issues
 * 
 * This script addresses the issue where importing wallets from UniSat/Xverse
 * shows different addresses than expected due to derivation path differences.
 * 
 * Common wallet derivation path differences:
 * - UniSat typically uses account index 0
 * - Some wallets use different address indices within accounts
 * - Different wallets may default to different address types
 */

// Enhanced wallet service with multiple derivation path support
const enhancedWalletService = `
/**
 * Enhanced import function that checks multiple derivation paths
 * to find addresses matching those from other wallets like UniSat
 */
export async function importWalletWithPathScanning(mnemonic, network = 'MAINNET') {
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
    }
    
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = HDKey.fromMasterSeed(seed);
    const btcNetwork = network === 'TESTNET' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
    
    // Generate addresses for multiple account/address indices
    const addresses = {
        // Standard paths (account 0, address 0)
        standard: {
            segwit: generateSegwitAddress(root, btcNetwork),
            taproot: generateTaprootAddress(root, btcNetwork),
            legacy: generateLegacyAddress(root, btcNetwork),
            nestedSegwit: generateNestedSegwitAddress(root, btcNetwork)
        },
        // Additional paths that UniSat might use
        extended: []
    };
    
    // Scan first 5 accounts and first 5 addresses
    for (let account = 0; account < 5; account++) {
        for (let addressIndex = 0; addressIndex < 5; addressIndex++) {
            addresses.extended.push({
                account,
                addressIndex,
                segwit: generateSegwitAddressCustomPath(root, btcNetwork, account, addressIndex),
                nestedSegwit: generateNestedSegwitAddressCustomPath(root, btcNetwork, account, addressIndex),
                legacy: generateLegacyAddressCustomPath(root, btcNetwork, account, addressIndex),
                taproot: generateTaprootAddressCustomPath(root, btcNetwork, account, addressIndex)
            });
        }
    }
    
    return {
        mnemonic,
        network,
        addresses,
        xpub: root.publicExtendedKey
    };
}

// Generate addresses with custom account/address indices
function generateSegwitAddressCustomPath(root, network, accountIndex = 0, addressIndex = 0) {
    const path = \`m/84'/0'/\${accountIndex}'/0/\${addressIndex}\`;
    const child = root.derive(path);
    const { address } = bitcoin.payments.p2wpkh({ 
        pubkey: Buffer.from(child.publicKey), 
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

function generateNestedSegwitAddressCustomPath(root, network, accountIndex = 0, addressIndex = 0) {
    const path = \`m/49'/0'/\${accountIndex}'/0/\${addressIndex}\`;
    const child = root.derive(path);
    
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

function generateLegacyAddressCustomPath(root, network, accountIndex = 0, addressIndex = 0) {
    const path = \`m/44'/0'/\${accountIndex}'/0/\${addressIndex}\`;
    const child = root.derive(path);
    const { address } = bitcoin.payments.p2pkh({ 
        pubkey: Buffer.from(child.publicKey), 
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

function generateTaprootAddressCustomPath(root, network, accountIndex = 0, addressIndex = 0) {
    const path = \`m/86'/0'/\${accountIndex}'/0/\${addressIndex}\`;
    const child = root.derive(path);
    
    const xOnlyPubkey = Buffer.from(child.publicKey).slice(1, 33);
    
    const { address } = bitcoin.payments.p2tr({ 
        internalPubkey: xOnlyPubkey,
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
`;

// Enhanced API endpoint for import with path scanning
const enhancedImportEndpoint = `
// Import Spark wallet with enhanced path scanning
app.post('/api/spark/import-enhanced', async (req, res) => {
    try {
        const { mnemonic, targetAddress } = req.body;
        
        if (!mnemonic) {
            return res.status(400).json({
                success: false,
                error: 'Mnemonic phrase is required'
            });
        }
        
        // Import with standard paths first
        const standardWallet = await importSparkCompatibleWallet(mnemonic);
        
        // If a target address is provided, scan for it
        if (targetAddress) {
            console.log('Scanning for target address:', targetAddress);
            
            // Use the enhanced import with path scanning
            const extendedWallet = await importWalletWithPathScanning(mnemonic);
            
            // Check if target address matches any standard addresses
            const standardAddresses = standardWallet.data.bitcoinAddresses;
            if (Object.values(standardAddresses).includes(targetAddress)) {
                console.log('Target address found in standard paths');
                return res.json(standardWallet);
            }
            
            // Check extended paths
            for (const extPath of extendedWallet.addresses.extended) {
                const addresses = [
                    extPath.segwit.address,
                    extPath.nestedSegwit.address,
                    extPath.legacy.address,
                    extPath.taproot.address
                ];
                
                if (addresses.includes(targetAddress)) {
                    console.log(\`Target address found at account \${extPath.account}, address \${extPath.addressIndex}\`);
                    
                    // Return wallet with the found path's addresses
                    return res.json({
                        success: true,
                        data: {
                            ...standardWallet.data,
                            bitcoinAddresses: {
                                segwit: extPath.segwit.address,
                                taproot: extPath.taproot.address,
                                legacy: extPath.legacy.address,
                                nestedSegwit: extPath.nestedSegwit.address
                            },
                            derivationPath: {
                                account: extPath.account,
                                addressIndex: extPath.addressIndex
                            }
                        }
                    });
                }
            }
            
            console.log('Target address not found in scanned paths');
        }
        
        // Return standard wallet if no target or target not found
        res.json(standardWallet);
        
    } catch (error) {
        console.error('Enhanced wallet import error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
`;

// UI Enhancement for address type selection
const uiAddressTypeSelector = `
// Enhanced address type selector with better UniSat/Xverse compatibility
class EnhancedWalletSelector {
    constructor(app) {
        this.app = app;
        this.addressTypes = [
            { id: 'nativeSegWit', name: 'Native SegWit (bc1q...)', label: 'SegWit' },
            { id: 'nestedSegWit', name: 'Nested SegWit (3...)', label: 'Nested' },
            { id: 'taproot', name: 'Taproot (bc1p...)', label: 'Taproot' },
            { id: 'legacy', name: 'Legacy (1...)', label: 'Legacy' },
            { id: 'spark', name: 'Spark Protocol (sp1...)', label: 'Spark' }
        ];
    }
    
    render() {
        const $ = window.ElementFactory || ElementFactory;
        const currentType = this.app.state.get('selectedWalletType') || 'nativeSegWit';
        const currentAccount = this.app.state.getCurrentAccount();
        
        if (!currentAccount) return $.div({}, ['No wallet available']);
        
        return $.div({ className: 'wallet-selector-enhanced' }, [
            $.div({ className: 'selector-header' }, [
                $.h3({}, ['Select Address Type']),
                $.p({ className: 'hint' }, [
                    'UniSat typically shows Native SegWit by default. ' +
                    'If you see a different address in UniSat, try selecting a different type below.'
                ])
            ]),
            
            $.div({ className: 'address-types' }, 
                this.addressTypes.map(type => {
                    const address = this.getAddressForType(currentAccount, type.id);
                    const isSelected = currentType === type.id;
                    
                    return $.div({
                        className: \`address-type-option \${isSelected ? 'selected' : ''}\`,
                        onclick: () => this.selectAddressType(type.id)
                    }, [
                        $.div({ className: 'type-info' }, [
                            $.strong({}, [type.label]),
                            $.span({ className: 'type-name' }, [' - ' + type.name])
                        ]),
                        $.div({ className: 'address-preview' }, [
                            address || 'Not available'
                        ])
                    ]);
                })
            ),
            
            $.div({ className: 'debug-info' }, [
                $.details({}, [
                    $.summary({}, ['Debug: All Generated Addresses']),
                    $.pre({ className: 'debug-addresses' }, [
                        JSON.stringify(currentAccount.addresses, null, 2)
                    ])
                ])
            ])
        ]);
    }
    
    getAddressForType(account, type) {
        const addressMap = {
            'nativeSegWit': account.addresses.segwit || account.addresses.bitcoin,
            'nestedSegWit': account.addresses.nestedSegWit,
            'taproot': account.addresses.taproot,
            'legacy': account.addresses.legacy,
            'spark': account.addresses.spark
        };
        return addressMap[type] || '';
    }
    
    selectAddressType(type) {
        this.app.state.set('selectedWalletType', type);
        localStorage.setItem('selectedWalletType', type);
        this.app.showNotification(\`Switched to \${type} address type\`, 'success');
        this.app.router.render();
    }
}
`;

// Instructions for fixing the issue
const fixInstructions = `
## How to Fix Wallet Import Address Mismatch

### The Issue
When importing wallets from UniSat or Xverse, the displayed address may not match because:
1. Different wallets default to different address types (SegWit vs Nested SegWit)
2. Some wallets use different derivation paths or account indices
3. The user may be looking at different address types in each wallet

### Quick Fix for Users
1. After importing your wallet, check all address types in the wallet selector
2. The address "bc1qnl8rzz6ch58ldxltjv35x2gfrglx2xmt8pszxf" is a Native SegWit address
3. If UniSat shows a "3..." address, that's Nested SegWit - select that type in MOOSH

### Technical Implementation
1. Add the enhanced import endpoint to api-server.js
2. Update walletService.js with path scanning functions
3. Add the enhanced wallet selector to the UI
4. Test with known seed phrases to verify address generation

### Testing Steps
1. Import this test seed: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
2. Expected addresses:
   - Native SegWit: bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu
   - Nested SegWit: 37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf
   - Legacy: 1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA
   - Taproot: bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr

### Debugging Helper
Run this in the browser console after importing:
\`\`\`javascript
const account = window.app.state.getCurrentAccount();
console.log('All addresses:', account.addresses);
console.log('Native SegWit:', account.addresses.segwit);
console.log('Nested SegWit:', account.addresses.nestedSegWit);
\`\`\`
`;

console.log('Fix instructions and code generated. Key points:');
console.log('1. The address provided (bc1q...) is Native SegWit, not Nested SegWit');
console.log('2. UniSat may be showing a different address type by default');
console.log('3. The fix includes path scanning for different derivation paths');
console.log('4. Enhanced UI selector helps users find the right address type');

// Export the fix modules
module.exports = {
    enhancedWalletService,
    enhancedImportEndpoint,
    uiAddressTypeSelector,
    fixInstructions
};