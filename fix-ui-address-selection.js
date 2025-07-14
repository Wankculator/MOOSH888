// UI Fix for Address Type Selection in Dashboard

// This fix ensures users can properly select and view different address types
// after importing a wallet, especially for UniSat compatibility

// 1. Add address type selector to Dashboard
// Replace the existing wallet type selector creation in DashboardPage

createWalletTypeSelector() {
    const $ = window.ElementFactory || ElementFactory;
    const selectedType = this.app.state.get('selectedWalletType') || localStorage.getItem('selectedWalletType') || 'nativeSegWit';
    
    // Get current account to check available addresses
    const currentAccount = this.app.state.getCurrentAccount();
    const hasAllTypes = currentAccount && currentAccount.addresses;
    
    return $.div({ 
        style: 'margin-bottom: 20px; background: #000000; border: 2px solid #f57315; padding: 15px;'
    }, [
        $.div({ style: 'color: #888888; font-size: 12px; margin-bottom: 10px;' }, ['Select Address Type:']),
        $.select({
            id: 'walletTypeSelector',
            style: 'width: 100%; padding: 10px; background: #000000; border: 1px solid #f57315; color: #f57315; font-family: JetBrains Mono, monospace; font-size: 14px;',
            onchange: (e) => this.handleWalletTypeChange(e.target.value),
            value: selectedType
        }, [
            $.option({ value: 'nativeSegWit' }, ['Native SegWit (bc1q...) - Recommended']),
            $.option({ value: 'nestedSegWit' }, ['Nested SegWit (3...) - Legacy Compatible']),
            $.option({ value: 'taproot' }, ['Taproot (bc1p...) - Latest']),
            $.option({ value: 'legacy' }, ['Legacy (1...) - Oldest']),
            $.option({ value: 'spark' }, ['Spark Protocol (sp1p...)'])
        ]),
        hasAllTypes ? $.div({ 
            style: 'margin-top: 10px; padding: 10px; background: rgba(245, 115, 21, 0.1); border: 1px solid #333; font-size: 11px;' 
        }, [
            $.div({ style: 'color: #f57315; margin-bottom: 5px;' }, ['Current Addresses:']),
            $.div({ style: 'color: #888; word-break: break-all; font-size: 10px;' }, [
                currentAccount.addresses.segwit ? $.div({}, [`Native SegWit: ${currentAccount.addresses.segwit}`]) : null,
                currentAccount.addresses.nestedSegwit ? $.div({}, [`Nested SegWit: ${currentAccount.addresses.nestedSegwit}`]) : null,
                currentAccount.addresses.taproot ? $.div({}, [`Taproot: ${currentAccount.addresses.taproot}`]) : null,
                currentAccount.addresses.legacy ? $.div({}, [`Legacy: ${currentAccount.addresses.legacy}`]) : null,
            ])
        ]) : null
    ]);
}

// 2. Fix the handleWalletTypeChange to properly update display
handleWalletTypeChange(walletType) {
    console.log('[Dashboard] Wallet type changed to:', walletType);
    
    // Save selection
    this.app.state.set('selectedWalletType', walletType);
    localStorage.setItem('selectedWalletType', walletType);
    
    // Update the display immediately
    this.updateAddressDisplay();
    
    // Show notification
    const typeNames = {
        'nativeSegWit': 'Native SegWit',
        'nestedSegWit': 'Nested SegWit',
        'taproot': 'Taproot',
        'legacy': 'Legacy',
        'spark': 'Spark Protocol'
    };
    
    this.app.showNotification(`Switched to ${typeNames[walletType]} address`, 'success');
}

// 3. Fix getCurrentWalletAddress to properly handle all types
getCurrentWalletAddress() {
    const selectedType = this.app.state.get('selectedWalletType') || localStorage.getItem('selectedWalletType') || 'nativeSegWit';
    
    console.log('[Dashboard] Getting wallet address for type:', selectedType);
    
    const currentAccount = this.app.state.getCurrentAccount();
    
    if (currentAccount && currentAccount.addresses) {
        console.log('[Dashboard] Current account addresses:', currentAccount.addresses);
        
        // Map wallet types to their addresses from current account
        // Handle both lowercase and camelCase variations
        const addressMap = {
            'taproot': currentAccount.addresses.taproot || '',
            'nativeSegWit': currentAccount.addresses.segwit || currentAccount.addresses.bitcoin || '',
            'nestedSegWit': currentAccount.addresses.nestedSegWit || currentAccount.addresses.nestedSegwit || '',
            'legacy': currentAccount.addresses.legacy || '',
            'spark': currentAccount.addresses.spark || ''
        };
        
        const address = addressMap[selectedType];
        
        if (!address) {
            console.warn('[Dashboard] No address found for type:', selectedType);
            console.log('[Dashboard] Available addresses:', Object.keys(currentAccount.addresses));
            // Fallback to any available address
            return currentAccount.addresses.bitcoin || 
                   currentAccount.addresses.segwit || 
                   currentAccount.addresses.taproot || 
                   'No address available';
        }
        
        console.log('[Dashboard] Resolved address:', address);
        return address;
    }
    
    return 'No wallet loaded';
}

// 4. Add a debug function to check imported addresses
function debugImportedWallet() {
    const currentAccount = this.app.state.getCurrentAccount();
    if (!currentAccount) {
        console.log('No account loaded');
        return;
    }
    
    console.log('\n=== IMPORTED WALLET DEBUG INFO ===');
    console.log('Account Name:', currentAccount.name);
    console.log('Account Type:', currentAccount.type);
    console.log('Created At:', new Date(currentAccount.createdAt).toLocaleString());
    console.log('\nAddresses:');
    console.log('Native SegWit (segwit):', currentAccount.addresses.segwit || 'Not available');
    console.log('Nested SegWit:', currentAccount.addresses.nestedSegWit || currentAccount.addresses.nestedSegwit || 'Not available');
    console.log('Taproot:', currentAccount.addresses.taproot || 'Not available');
    console.log('Legacy:', currentAccount.addresses.legacy || 'Not available');
    console.log('Spark:', currentAccount.addresses.spark || 'Not available');
    console.log('\nRaw addresses object:', currentAccount.addresses);
}

// 5. Add import validation helper
async function validateImportedAddress(targetAddress) {
    const generatedSeed = localStorage.getItem('generatedSeed') || localStorage.getItem('importedSeed');
    if (!generatedSeed) {
        console.error('No seed found in storage');
        return;
    }
    
    const mnemonic = generatedSeed;
    
    // Check all address types
    const response = await fetch('/api/spark/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mnemonic })
    });
    
    const result = await response.json();
    
    console.log('\n=== ADDRESS VALIDATION ===');
    console.log('Target Address:', targetAddress);
    console.log('Target Type:', 
        targetAddress.startsWith('bc1q') ? 'Native SegWit' :
        targetAddress.startsWith('bc1p') ? 'Taproot' :
        targetAddress.startsWith('3') ? 'Nested SegWit' :
        targetAddress.startsWith('1') ? 'Legacy' :
        'Unknown'
    );
    
    console.log('\nGenerated Addresses:');
    if (result.data.bitcoinAddresses) {
        console.log('Native SegWit:', result.data.bitcoinAddresses.segwit);
        console.log('Nested SegWit:', result.data.bitcoinAddresses.nestedSegwit);
        console.log('Taproot:', result.data.bitcoinAddresses.taproot);
        console.log('Legacy:', result.data.bitcoinAddresses.legacy);
        
        // Check if target matches any
        const matches = [];
        if (result.data.bitcoinAddresses.segwit === targetAddress) matches.push('Native SegWit');
        if (result.data.bitcoinAddresses.nestedSegwit === targetAddress) matches.push('Nested SegWit');
        if (result.data.bitcoinAddresses.taproot === targetAddress) matches.push('Taproot');
        if (result.data.bitcoinAddresses.legacy === targetAddress) matches.push('Legacy');
        
        if (matches.length > 0) {
            console.log('\n✅ MATCH FOUND:', matches.join(', '));
        } else {
            console.log('\n❌ NO MATCH FOUND');
            console.log('This could mean:');
            console.log('1. UniSat is using a different account index (not 0)');
            console.log('2. UniSat is using a different address index (not 0)');
            console.log('3. The seed phrase is different');
        }
    }
}

// 6. Usage instructions
console.log(`
HOW TO USE THIS FIX:
====================

1. For Users:
   - After importing your wallet, use the address type selector in the dashboard
   - Select "Nested SegWit" if you're looking for addresses starting with "3"
   - Select "Native SegWit" for addresses starting with "bc1q"
   
2. For Debugging:
   - Open browser console and run: debugImportedWallet()
   - To validate against UniSat address: validateImportedAddress("your-unisat-address")
   
3. Common Issues:
   - If address doesn't match, UniSat might be using a different account/address index
   - MOOSH uses index 0/0 by default, UniSat might use different indices
   
4. Address Format Guide:
   - bc1q... = Native SegWit (BIP84)
   - 3... = Nested SegWit (BIP49) 
   - 1... = Legacy (BIP44)
   - bc1p... = Taproot (BIP86)
`);