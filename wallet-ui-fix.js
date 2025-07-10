// MOOSH WALLET UI FIX
// This script fixes the UI to show all wallet data

console.log('🔧 Applying wallet UI fix...');

// Override the getRealWalletAddresses function
if (window.WalletDetailsPage) {
    const originalProto = window.WalletDetailsPage.prototype;
    
    // Fix address display
    originalProto.getRealWalletAddresses = function(sparkWallet, currentWallet) {
        console.log('📍 Fixed getRealWalletAddresses called');
        
        // Try to get the full wallet data from the last API call
        const lastWalletData = JSON.parse(localStorage.getItem('lastFullWalletData') || '{}');
        
        return {
            'spark': sparkWallet.addresses?.spark || currentWallet.sparkAddress || 'Generating...',
            'taproot': lastWalletData.taproot || 'Click refresh to load',
            'native-segwit': sparkWallet.addresses?.bitcoin || currentWallet.bitcoinAddress || 'Generating...',
            'nested-segwit': lastWalletData.nestedSegwit || 'Click refresh to load',
            'legacy': lastWalletData.legacy || 'Click refresh to load'
        };
    };
    
    // Fix private key display
    originalProto.getRealPrivateKeys = function(sparkWallet, currentWallet) {
        console.log('🔑 Fixed getRealPrivateKeys called');
        
        const lastWalletData = JSON.parse(localStorage.getItem('lastFullWalletData') || '{}');
        const privateKeys = sparkWallet.privateKeys || currentWallet.privateKeys || {};
        
        return {
            hex: lastWalletData.hexKey || privateKeys.bitcoin?.hex || 'Click refresh to load',
            wif: lastWalletData.wifKey || privateKeys.bitcoin?.wif || 'Click refresh to load'
        };
    };
}

// Add a refresh button to fetch full data
function addRefreshButton() {
    const existingBtn = document.getElementById('walletRefreshBtn');
    if (existingBtn) return;
    
    const titleElement = document.querySelector('.wallet-details-title');
    if (titleElement) {
        const refreshBtn = document.createElement('button');
        refreshBtn.id = 'walletRefreshBtn';
        refreshBtn.textContent = '🔄 Load All Data';
        refreshBtn.style.cssText = `
            background: #00ff00;
            color: #000;
            border: none;
            padding: 10px 20px;
            margin-left: 20px;
            cursor: pointer;
            font-weight: bold;
            border-radius: 4px;
        `;
        
        refreshBtn.onclick = async function() {
            console.log('🔄 Fetching full wallet data...');
            
            // Get current seed phrase
            const seedElement = document.querySelector('.recovery-phrase-box code');
            const seedPhrase = seedElement ? seedElement.textContent : '';
            
            if (!seedPhrase) {
                alert('No seed phrase found!');
                return;
            }
            
            try {
                // Import wallet to get all data
                const response = await fetch('http://localhost:3001/api/wallet/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mnemonic: seedPhrase,
                        network: 'MAINNET'
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    const wallet = data.data;
                    
                    // Store full data
                    const fullData = {
                        taproot: wallet.bitcoin?.taproot?.address || 'Not available',
                        nestedSegwit: wallet.bitcoin?.['nested-segwit']?.address || 'Not available',
                        legacy: wallet.bitcoin?.legacy?.address || 'Not available',
                        hexKey: wallet.bitcoin?.segwit?.privateKey || 'Not available',
                        wifKey: wallet.bitcoin?.segwit?.wif || wallet.bitcoin?.segwit?.privateKey || 'Not available'
                    };
                    
                    localStorage.setItem('lastFullWalletData', JSON.stringify(fullData));
                    
                    // Update display
                    location.reload();
                }
            } catch (err) {
                console.error('Error fetching wallet data:', err);
                alert('Error loading wallet data. Check console.');
            }
        };
        
        titleElement.appendChild(refreshBtn);
    }
}

// Apply fix when page loads
setTimeout(addRefreshButton, 1000);
setTimeout(addRefreshButton, 3000);

console.log('✅ Wallet UI fix applied! Click "Load All Data" button to see everything.');