// MOOSH WALLET ACCOUNTS BUTTON FIX
// This fixes the TypeError when clicking the + Accounts button

(function() {
    'use strict';

    console.log('[AccountsFix] Starting accounts button fix...');

    // Wait for wallet to be ready
    function waitForWallet() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (window.MooshWallet && window.MooshWallet.state) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 10000);
        });
    }

    // Fix account structure
    function fixAccountStructure(account) {
        // Ensure all required properties exist
        if (!account.addresses) {
            account.addresses = {};
        }
        
        // Ensure balance structure exists
        if (!account.balance && !account.balances) {
            account.balances = {
                bitcoin: 0,
                lightning: 0,
                stablecoins: {}
            };
        } else if (account.balance && !account.balances) {
            // Convert old balance structure to new
            account.balances = {
                bitcoin: account.balance.bitcoin || 0,
                lightning: account.balance.lightning || account.balance.spark || 0,
                stablecoins: account.balance.stablecoins || {}
            };
        }
        
        // Ensure addresses have proper structure
        if (!account.addresses.bitcoin && account.addresses.segwit) {
            account.addresses.bitcoin = account.addresses.segwit;
        }
        
        return account;
    }

    // Initialize accounts for existing wallets
    async function initializeAccountsIfNeeded() {
        const state = window.MooshWallet.state;
        const accounts = state.getAccounts();
        
        console.log('[AccountsFix] Current accounts:', accounts.length);
        
        // Fix existing accounts
        accounts.forEach(account => {
            fixAccountStructure(account);
        });
        
        // If no accounts exist but we have wallet data, create the first account
        if (accounts.length === 0) {
            const sparkWallet = JSON.parse(localStorage.getItem('sparkWallet') || '{}');
            const generatedSeed = JSON.parse(localStorage.getItem('generatedSeed') || localStorage.getItem('importedSeed') || '[]');
            
            if (sparkWallet.addresses && generatedSeed.length > 0) {
                console.log('[AccountsFix] Creating initial account from existing wallet data');
                
                const account = {
                    id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: 'Main Account',
                    addresses: {
                        spark: sparkWallet.addresses?.spark || '',
                        bitcoin: sparkWallet.addresses?.bitcoin || sparkWallet.addresses?.segwit || '',
                        taproot: sparkWallet.addresses?.taproot || '',
                        legacy: sparkWallet.addresses?.legacy || ''
                    },
                    balances: {
                        bitcoin: 0,
                        lightning: 0,
                        stablecoins: {}
                    },
                    createdAt: Date.now(),
                    lastUsed: Date.now(),
                    isImport: !!localStorage.getItem('importedSeed')
                };
                
                // Add the account
                state.state.accounts = [account];
                state.state.currentAccountId = account.id;
                state.persistAccounts();
                
                console.log('[AccountsFix] Initial account created:', account);
            }
        }
        
        // Persist the fixed accounts
        state.persistAccounts();
    }

    // Override the MultiAccountModal to fix the display issue
    function patchMultiAccountModal() {
        if (!window.MultiAccountModal) {
            console.warn('[AccountsFix] MultiAccountModal not found');
            return;
        }

        const originalCreateAccountList = window.MultiAccountModal.prototype.createAccountList;
        
        window.MultiAccountModal.prototype.createAccountList = function(accounts, currentAccountId) {
            const $ = window.ElementFactory || ElementFactory;
            
            // Ensure accounts have proper structure
            const fixedAccounts = accounts.map(account => fixAccountStructure(account));
            
            if (fixedAccounts.length === 0) {
                return $.div({ style: 'text-align: center; padding: 40px; color: #666;' }, [
                    $.p({}, ['No accounts found. Create your first account!'])
                ]);
            }
            
            return $.div({ style: 'margin-bottom: 20px;' }, [
                $.h3({ style: 'margin-bottom: 15px; color: var(--text-primary);' }, ['Your Accounts']),
                ...fixedAccounts.map(account => this.createAccountItem(account, account.id === currentAccountId))
            ]);
        };

        // Also patch createAccountItem to handle the balance display
        const originalCreateAccountItem = window.MultiAccountModal.prototype.createAccountItem;
        
        window.MultiAccountModal.prototype.createAccountItem = function(account, isActive) {
            const $ = window.ElementFactory || ElementFactory;
            
            // Fix account structure
            account = fixAccountStructure(account);
            
            const balance = account.balances?.bitcoin || 0;
            const btcBalance = (balance / 100000000).toFixed(8);
            
            return $.div({
                style: 'padding: 15px; margin: 10px 0; background: ' + (isActive ? '#111' : '#000') + 
                       '; border: 1px solid ' + (isActive ? 'var(--text-primary)' : '#333') + 
                       '; cursor: pointer; transition: all 0.2s;',
                onclick: () => {
                    if (!isActive) {
                        this.app.state.switchAccount(account.id);
                        this.close();
                        this.app.router.render();
                    }
                }
            }, [
                $.div({}, [
                    $.div({ style: 'font-weight: 600; margin-bottom: 5px;' }, [account.name || 'Unnamed Account']),
                    $.div({ style: 'font-size: 12px; color: #666; font-family: monospace;' }, [
                        account.addresses?.bitcoin || account.addresses?.spark ? 
                        `${(account.addresses.bitcoin || account.addresses.spark || '').slice(0, 16)}...${(account.addresses.bitcoin || account.addresses.spark || '').slice(-8)}` :
                        'No address'
                    ]),
                    $.div({ style: 'font-size: 12px; color: var(--text-dim); margin-top: 5px;' }, [
                        `Balance: ${btcBalance} BTC`
                    ])
                ]),
                $.div({ style: 'display: flex; gap: 10px;' }, [
                    $.button({
                        style: 'background: transparent; border: 1px solid #666; color: #666; padding: 5px 10px; font-size: 12px;',
                        onclick: (e) => {
                            e.stopPropagation();
                            this.renameAccount(account);
                        }
                    }, ['Rename']),
                    accounts.length > 1 ? $.button({
                        style: 'background: transparent; border: 1px solid #ff4444; color: #ff4444; padding: 5px 10px; font-size: 12px;',
                        onclick: (e) => {
                            e.stopPropagation();
                            this.deleteAccount(account.id);
                        }
                    }, ['Delete']) : null
                ])
            ]);
        };
        
        console.log('[AccountsFix] MultiAccountModal patched successfully');
    }

    // Main initialization
    async function init() {
        await waitForWallet();
        await initializeAccountsIfNeeded();
        patchMultiAccountModal();
        
        // Also patch the dashboard's showMultiAccountManager if needed
        if (window.MooshWallet?.ui?.dashboard) {
            const originalShow = window.MooshWallet.ui.dashboard.showMultiAccountManager;
            
            window.MooshWallet.ui.dashboard.showMultiAccountManager = function() {
                console.log('[AccountsFix] showMultiAccountManager called');
                
                // Ensure accounts are fixed before showing
                const accounts = window.MooshWallet.state.getAccounts();
                accounts.forEach(account => fixAccountStructure(account));
                window.MooshWallet.state.persistAccounts();
                
                // Call original or create new modal
                if (originalShow) {
                    originalShow.call(this);
                } else {
                    const modal = new window.MultiAccountModal(window.MooshWallet);
                    modal.show();
                }
            };
        }
        
        console.log('[AccountsFix] Initialization complete');
    }

    // Run the fix
    init().catch(error => {
        console.error('[AccountsFix] Failed to initialize:', error);
    });

})();