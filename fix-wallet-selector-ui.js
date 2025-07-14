/**
 * UI Fix for Wallet Address Type Selection
 * This fix improves the address type selector to help users find the correct address
 * that matches their UniSat/Xverse wallet
 */

// Enhanced getCurrentWalletAddress function
const enhancedGetCurrentWalletAddress = `
getCurrentWalletAddress() {
    // Get the selected wallet type - default to segwit (most common)
    const selectedType = this.app.state.get('selectedWalletType') || localStorage.getItem('selectedWalletType') || 'nativeSegWit';
    
    console.log('[Dashboard] Getting wallet address for type:', selectedType);
    
    // Get current account
    const currentAccount = this.app.state.getCurrentAccount();
    
    if (currentAccount && currentAccount.addresses) {
        console.log('[Dashboard] Current account addresses:', currentAccount.addresses);
        
        // Map wallet types to their addresses from current account
        // Handle both naming conventions for better compatibility
        const addressMap = {
            'taproot': currentAccount.addresses.taproot || '',
            'nativeSegWit': currentAccount.addresses.segwit || currentAccount.addresses.bitcoin || '',
            'nestedSegWit': currentAccount.addresses.nestedSegWit || currentAccount.addresses.nestedSegwit || '',
            'legacy': currentAccount.addresses.legacy || '',
            'spark': currentAccount.addresses.spark || ''
        };
        
        // Return the selected address
        const selectedAddress = addressMap[selectedType];
        if (selectedAddress) {
            console.log('[Dashboard] Returning address for type', selectedType, ':', selectedAddress);
            return selectedAddress;
        }
        
        // If selected type not available, show message
        return \`No \${selectedType} address available\`;
    }
    
    // Legacy fallback for old wallet data
    const sparkWallet = JSON.parse(localStorage.getItem('sparkWallet') || '{}');
    const currentWallet = this.app.state.get('currentWallet') || {};
    
    console.log('[Dashboard] Checking legacy wallet data - sparkWallet:', sparkWallet);
    
    // Map wallet types to their addresses with case handling
    const addressMap = {
        'taproot': currentWallet.taprootAddress || sparkWallet.addresses?.taproot || sparkWallet.bitcoinAddresses?.taproot || '',
        'nativeSegWit': currentWallet.bitcoinAddress || sparkWallet.addresses?.bitcoin || sparkWallet.addresses?.segwit || sparkWallet.bitcoinAddresses?.segwit || '',
        'nestedSegWit': currentWallet.nestedSegWitAddress || sparkWallet.addresses?.nestedSegWit || sparkWallet.addresses?.nestedSegwit || sparkWallet.bitcoinAddresses?.nestedSegwit || '',
        'legacy': currentWallet.legacyAddress || sparkWallet.addresses?.legacy || sparkWallet.bitcoinAddresses?.legacy || '',
        'spark': currentWallet.sparkAddress || sparkWallet.addresses?.spark || ''
    };
    
    // Return the selected address or indicate type not available
    const selectedAddress = addressMap[selectedType];
    if (selectedAddress) {
        return selectedAddress;
    }
    
    // Don't fallback to wrong type - return a clear message
    return \`No \${selectedType} address available\`;
}
`;

// Enhanced wallet type selector UI component
const enhancedWalletTypeSelector = `
createWalletTypeSelector() {
    const $ = window.ElementFactory || ElementFactory;
    const currentType = this.app.state.get('selectedWalletType') || 'nativeSegWit';
    const currentAccount = this.app.state.getCurrentAccount();
    
    const walletTypes = [
        { 
            id: 'nativeSegWit', 
            name: 'Native SegWit', 
            prefix: 'bc1q...', 
            description: 'Default for most wallets',
            color: '#50fa7b'
        },
        { 
            id: 'nestedSegWit', 
            name: 'Nested SegWit', 
            prefix: '3...', 
            description: 'P2SH wrapped, older standard',
            color: '#8be9fd'
        },
        { 
            id: 'taproot', 
            name: 'Taproot', 
            prefix: 'bc1p...', 
            description: 'Newest Bitcoin standard',
            color: '#ff79c6'
        },
        { 
            id: 'legacy', 
            name: 'Legacy', 
            prefix: '1...', 
            description: 'Original Bitcoin format',
            color: '#f1fa8c'
        },
        { 
            id: 'spark', 
            name: 'Spark Protocol', 
            prefix: 'sp1...', 
            description: 'Lightning-fast protocol',
            color: '#69fd97'
        }
    ];
    
    return $.div({ className: 'wallet-type-selector-enhanced' }, [
        $.div({ 
            style: 'display: flex; align-items: center; gap: 12px; margin-bottom: 16px;' 
        }, [
            $.label({ 
                style: 'color: var(--text-dim); font-size: 12px;' 
            }, ['ADDRESS TYPE:']),
            $.div({ style: 'display: flex; gap: 8px; flex-wrap: wrap;' },
                walletTypes.map(type => {
                    const isSelected = currentType === type.id;
                    const address = this.getAddressForType(currentAccount, type.id);
                    
                    return $.button({
                        className: \`wallet-type-btn \${isSelected ? 'selected' : ''}\`,
                        style: \`
                            background: \${isSelected ? type.color + '20' : 'transparent'};
                            border: 1px solid \${isSelected ? type.color : '#444'};
                            color: \${isSelected ? type.color : 'var(--text-dim)'};
                            padding: 8px 12px;
                            cursor: pointer;
                            transition: all 0.2s;
                            font-size: 11px;
                            position: relative;
                        \`,
                        onclick: () => this.selectWalletType(type.id),
                        title: address || 'Not available'
                    }, [
                        $.div({ style: 'font-weight: bold;' }, [type.name]),
                        $.div({ style: 'font-size: 10px; opacity: 0.7;' }, [type.prefix])
                    ]);
                })
            )
        ]),
        
        // Show current address with copy functionality
        currentAccount && $.div({ 
            className: 'current-address-display',
            style: 'background: #0a0a0a; border: 1px solid #333; padding: 12px; margin-top: 8px;'
        }, [
            $.div({ style: 'font-size: 11px; color: var(--text-dim); margin-bottom: 4px;' }, [
                walletTypes.find(t => t.id === currentType)?.description || ''
            ]),
            $.div({ 
                style: 'display: flex; align-items: center; gap: 8px;'
            }, [
                $.span({ 
                    style: 'font-family: monospace; word-break: break-all; flex: 1;' 
                }, [this.getCurrentWalletAddress()]),
                $.button({
                    style: 'padding: 4px 8px; font-size: 11px;',
                    onclick: () => this.copyAddress()
                }, ['Copy'])
            ])
        ])
    ]);
}

getAddressForType(account, type) {
    if (!account || !account.addresses) return '';
    
    const addressMap = {
        'nativeSegWit': account.addresses.segwit || account.addresses.bitcoin,
        'nestedSegWit': account.addresses.nestedSegWit || account.addresses.nestedSegwit,
        'taproot': account.addresses.taproot,
        'legacy': account.addresses.legacy,
        'spark': account.addresses.spark
    };
    
    return addressMap[type] || '';
}

selectWalletType(type) {
    this.app.state.set('selectedWalletType', type);
    localStorage.setItem('selectedWalletType', type);
    
    // Update UI immediately
    this.updateAddressDisplay();
    
    // Show notification
    const typeNames = {
        'nativeSegWit': 'Native SegWit',
        'nestedSegWit': 'Nested SegWit',
        'taproot': 'Taproot',
        'legacy': 'Legacy',
        'spark': 'Spark Protocol'
    };
    
    this.app.showNotification(\`Switched to \${typeNames[type]} address\`, 'success');
}

copyAddress() {
    const address = this.getCurrentWalletAddress();
    if (address && !address.startsWith('No ')) {
        navigator.clipboard.writeText(address).then(() => {
            this.app.showNotification('Address copied to clipboard', 'success');
        });
    }
}

updateAddressDisplay() {
    // Update all address displays in the UI
    const addressElements = document.querySelectorAll('.wallet-address');
    addressElements.forEach(el => {
        el.textContent = this.getCurrentWalletAddress();
    });
    
    // Re-render the selector
    const selectorContainer = document.querySelector('.wallet-type-selector-container');
    if (selectorContainer) {
        selectorContainer.innerHTML = '';
        selectorContainer.appendChild(this.createWalletTypeSelector());
    }
}
`;

// Helper function to debug address generation
const debugAddressGeneration = `
// Add this to the browser console to debug address issues
function debugWalletAddresses() {
    const account = window.app?.state?.getCurrentAccount();
    if (!account) {
        console.log('No account found');
        return;
    }
    
    console.log('=== Wallet Address Debug ===');
    console.log('Account Name:', account.name);
    console.log('Account Type:', account.type);
    console.log('\\nGenerated Addresses:');
    console.log('Native SegWit (bc1q...):', account.addresses.segwit || account.addresses.bitcoin || 'NOT GENERATED');
    console.log('Nested SegWit (3...):', account.addresses.nestedSegWit || account.addresses.nestedSegwit || 'NOT GENERATED');
    console.log('Taproot (bc1p...):', account.addresses.taproot || 'NOT GENERATED');
    console.log('Legacy (1...):', account.addresses.legacy || 'NOT GENERATED');
    console.log('Spark (sp1...):', account.addresses.spark || 'NOT GENERATED');
    
    // Check localStorage for legacy data
    const sparkWallet = JSON.parse(localStorage.getItem('sparkWallet') || '{}');
    if (sparkWallet.bitcoinAddresses) {
        console.log('\\nLegacy Bitcoin Addresses:');
        console.log(sparkWallet.bitcoinAddresses);
    }
    
    console.log('\\nFull account data:', account);
}

// Call it
debugWalletAddresses();
`;

// Instructions for implementing the fix
const implementationSteps = `
## Implementation Steps

1. **Update moosh-wallet.js**:
   - Replace the getCurrentWalletAddress function with the enhanced version
   - Add the wallet type selector UI component
   - Ensure proper case handling for nestedSegWit vs nestedSegWit

2. **Update api-server.js**:
   - Ensure the import endpoint properly generates all address types
   - Add logging to debug address generation

3. **Test the fix**:
   - Import a known seed phrase
   - Check all address types are generated
   - Verify the UI shows all address types correctly

4. **Common Issues and Solutions**:
   - If nested SegWit not showing: Check case sensitivity (nestedSegwit vs nestedSegWit)
   - If addresses don't match UniSat: They might use different account/address indices
   - If no addresses show: Check the API response structure

5. **User Instructions**:
   - After importing, click through all address types
   - Compare with UniSat/Xverse to find the matching type
   - Note: "bc1q..." is Native SegWit, "3..." is Nested SegWit

Remember: The address "bc1qnl8rzz6ch58ldxltjv35x2gfrglx2xmt8pszxf" mentioned by the user 
is a Native SegWit address, not Nested SegWit as they thought.
`;

console.log('UI fix generated. Key improvements:');
console.log('1. Better address type selector with visual indicators');
console.log('2. Proper case handling for nestedSegwit');
console.log('3. Debug helpers for troubleshooting');
console.log('4. Clear user guidance on address types');

module.exports = {
    enhancedGetCurrentWalletAddress,
    enhancedWalletTypeSelector,
    debugAddressGeneration,
    implementationSteps
};