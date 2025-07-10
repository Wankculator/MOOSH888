// MOOSH WALLET COMPLETE FIX
// This script properly stores and displays all wallet data

console.log('🔧 Applying complete wallet fix...');

// Store the original fetch to intercept API calls
const originalFetch = window.fetch;

// Override fetch to capture and store complete wallet data
window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    
    // Clone the response so we can read it
    const clonedResponse = response.clone();
    
    // Check if this is a wallet generation response
    if (args[0] && args[0].includes('/api/spark/generate-wallet')) {
        try {
            const data = await clonedResponse.json();
            if (data.success && data.data) {
                console.log('📦 Storing complete wallet data...');
                
                // Store complete wallet data
                const walletData = data.data;
                
                // Store all addresses
                if (walletData.bitcoinAddresses) {
                    localStorage.setItem('walletAddresses', JSON.stringify({
                        spark: walletData.addresses?.spark || '',
                        segwit: walletData.bitcoinAddresses.segwit || '',
                        taproot: walletData.bitcoinAddresses.taproot || '',
                        legacy: walletData.bitcoinAddresses.legacy || '',
                        bitcoin: walletData.addresses?.bitcoin || ''
                    }));
                }
                
                // Store all private keys (should be encrypted in production)
                if (walletData.allPrivateKeys) {
                    localStorage.setItem('walletPrivateKeys', JSON.stringify({
                        segwit: walletData.allPrivateKeys.segwit || {},
                        taproot: walletData.allPrivateKeys.taproot || {},
                        legacy: walletData.allPrivateKeys.legacy || {},
                        spark: walletData.allPrivateKeys.spark || {},
                        bitcoin: walletData.privateKeys?.bitcoin || {}
                    }));
                }
                
                // Store mnemonic
                if (walletData.mnemonic) {
                    localStorage.setItem('walletMnemonic', walletData.mnemonic);
                }
                
                // Store complete data as backup
                localStorage.setItem('completeWalletData', JSON.stringify(walletData));
            }
        } catch (err) {
            console.error('Error storing wallet data:', err);
        }
    }
    
    return response;
};

// Fix the display functions
if (window.WalletDetailsPage) {
    const proto = window.WalletDetailsPage.prototype;
    
    // Override getRealWalletAddresses
    proto.getRealWalletAddresses = function(sparkWallet, currentWallet) {
        console.log('🔍 Getting real wallet addresses...');
        
        // Try to get from localStorage first
        const storedAddresses = JSON.parse(localStorage.getItem('walletAddresses') || '{}');
        const completeData = JSON.parse(localStorage.getItem('completeWalletData') || '{}');
        
        return {
            'spark': storedAddresses.spark || sparkWallet.addresses?.spark || currentWallet.sparkAddress || 'Loading...',
            'taproot': storedAddresses.taproot || completeData.bitcoinAddresses?.taproot || 'Loading...',
            'native-segwit': storedAddresses.segwit || storedAddresses.bitcoin || sparkWallet.addresses?.bitcoin || currentWallet.bitcoinAddress || 'Loading...',
            'nested-segwit': storedAddresses['nested-segwit'] || 'P2SH not implemented',
            'legacy': storedAddresses.legacy || completeData.bitcoinAddresses?.legacy || 'Loading...'
        };
    };
    
    // Override getRealPrivateKeys
    proto.getRealPrivateKeys = function(sparkWallet, currentWallet) {
        console.log('🔑 Getting real private keys...');
        
        // Try to get from localStorage
        const storedKeys = JSON.parse(localStorage.getItem('walletPrivateKeys') || '{}');
        const completeData = JSON.parse(localStorage.getItem('completeWalletData') || '{}');
        
        // Get the primary private key (prefer segwit)
        const primaryHex = storedKeys.segwit?.hex || storedKeys.bitcoin?.hex || 
                          completeData.allPrivateKeys?.segwit?.hex || 
                          completeData.privateKeys?.bitcoin?.hex || 'Loading...';
                          
        const primaryWif = storedKeys.segwit?.wif || storedKeys.bitcoin?.wif || 
                          completeData.allPrivateKeys?.segwit?.wif || 
                          completeData.privateKeys?.bitcoin?.wif || 'Loading...';
        
        return {
            hex: primaryHex,
            wif: primaryWif,
            // Store all keys for potential future use
            all: {
                segwit: storedKeys.segwit || {},
                taproot: storedKeys.taproot || {},
                legacy: storedKeys.legacy || {},
                spark: storedKeys.spark || {}
            }
        };
    };
}

// Add a button to manually refresh wallet data
function addDataRefreshButton() {
    const existingBtn = document.getElementById('fullDataBtn');
    if (existingBtn) return;
    
    const actionsSection = document.querySelector('.wallet-actions');
    if (!actionsSection) {
        setTimeout(addDataRefreshButton, 1000);
        return;
    }
    
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'fullDataBtn';
    refreshBtn.className = 'wallet-action-button';
    refreshBtn.innerHTML = '🔄 Load All Data';
    refreshBtn.style.cssText = `
        background: #00ff00;
        color: #000;
        width: 100%;
        padding: 12px;
        margin-top: 10px;
        border: none;
        cursor: pointer;
        font-weight: bold;
    `;
    
    refreshBtn.onclick = async function() {
        console.log('🔄 Loading complete wallet data...');
        
        const mnemonic = localStorage.getItem('walletMnemonic');
        if (!mnemonic) {
            // Try to get from the page
            const seedElement = document.querySelector('.recovery-phrase-box code');
            if (seedElement) {
                const seed = seedElement.textContent;
                try {
                    const response = await fetch('http://localhost:3001/api/wallet/import', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mnemonic: seed, network: 'MAINNET' })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        // Store the imported data
                        localStorage.setItem('importedWalletData', JSON.stringify(data.data));
                        location.reload();
                    }
                } catch (err) {
                    console.error('Error loading data:', err);
                }
            }
        }
    };
    
    actionsSection.appendChild(refreshBtn);
}

// Apply fixes after page loads
setTimeout(addDataRefreshButton, 1000);
setTimeout(addDataRefreshButton, 2000);
setTimeout(addDataRefreshButton, 3000);

console.log('✅ Complete wallet fix applied!');
console.log('📌 Wallet will now store and display all data properly.');