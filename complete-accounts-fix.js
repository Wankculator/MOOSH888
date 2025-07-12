// COMPLETE ACCOUNTS FIX FOR MOOSH WALLET
// This file ensures accounts are properly initialized with all required properties

(function() {
    'use strict';

    console.log('[CompleteAccountsFix] Starting comprehensive accounts fix...');

    // Wait for wallet to be ready
    function waitForWallet() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (window.MooshWallet && window.MooshWallet.state) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 10000);
        });
    }

    // Create a properly structured account object
    function createAccountObject(data = {}) {
        const now = Date.now();
        return {
            id: data.id || `acc_${now}_${Math.random().toString(36).substr(2, 9)}`,
            name: data.name || 'Main Account',
            type: data.type || 'HD Wallet',
            addresses: {
                spark: data.addresses?.spark || '',
                bitcoin: data.addresses?.bitcoin || data.addresses?.segwit || '',
                segwit: data.addresses?.segwit || data.addresses?.bitcoin || '',
                taproot: data.addresses?.taproot || '',
                legacy: data.addresses?.legacy || ''
            },
            balances: {
                bitcoin: data.balances?.bitcoin || data.balance?.bitcoin || 0,
                lightning: data.balances?.lightning || data.balance?.lightning || data.balance?.spark || 0,
                stablecoins: data.balances?.stablecoins || data.balance?.stablecoins || {}
            },
            createdAt: data.createdAt || now,
            lastUsed: data.lastUsed || now,
            isImport: data.isImport || false,
            seedHash: data.seedHash || null
        };
    }

    // Initialize account system
    async function initializeAccounts() {
        try {
            const state = window.MooshWallet.state;
            let accounts = state.getAccounts();
            
            console.log('[CompleteAccountsFix] Current accounts:', accounts.length);

            // If no accounts exist, check for existing wallet data
            if (!accounts || accounts.length === 0) {
                console.log('[CompleteAccountsFix] No accounts found, checking for existing wallet data...');
                
                // Check localStorage for wallet data
                const sparkWallet = JSON.parse(localStorage.getItem('sparkWallet') || '{}');
                const generatedSeed = JSON.parse(localStorage.getItem('generatedSeed') || localStorage.getItem('importedSeed') || '[]');
                const mooshAccounts = JSON.parse(localStorage.getItem('mooshAccounts') || '{}');
                
                // If we have existing wallet data, create an account from it
                if ((sparkWallet.addresses || mooshAccounts.accounts) && generatedSeed.length > 0) {
                    console.log('[CompleteAccountsFix] Found existing wallet data, creating account...');
                    
                    const accountData = {
                        name: 'Main Account',
                        addresses: sparkWallet.addresses || {},
                        isImport: !!localStorage.getItem('importedSeed')
                    };
                    
                    const account = createAccountObject(accountData);
                    
                    // Set the accounts in state
                    state.state.accounts = [account];
                    state.state.currentAccountId = account.id;
                    
                    // Persist
                    state.persistAccounts();
                    
                    console.log('[CompleteAccountsFix] Created initial account:', account);
                }
            } else {
                // Fix existing accounts
                console.log('[CompleteAccountsFix] Fixing existing accounts...');
                
                accounts = accounts.map(account => createAccountObject(account));
                
                // Update state
                state.state.accounts = accounts;
                
                // Ensure we have a current account ID
                if (!state.state.currentAccountId && accounts.length > 0) {
                    state.state.currentAccountId = accounts[0].id;
                }
                
                // Persist
                state.persistAccounts();
                
                console.log('[CompleteAccountsFix] Fixed accounts:', accounts);
            }
            
        } catch (error) {
            console.error('[CompleteAccountsFix] Error initializing accounts:', error);
        }
    }

    // Patch the dashboard to ensure initialization
    function patchDashboard() {
        if (!window.MooshWallet?.ui?.dashboard) {
            console.warn('[CompleteAccountsFix] Dashboard not found');
            return;
        }

        const dashboard = window.MooshWallet.ui.dashboard;
        const originalInit = dashboard.initializeDashboard;
        
        dashboard.initializeDashboard = async function() {
            console.log('[CompleteAccountsFix] Dashboard initializing...');
            
            // Ensure accounts are initialized
            await initializeAccounts();
            
            // Call original init if exists
            if (originalInit) {
                originalInit.call(this);
            }
            
            // Start refresh
            this.refreshBalances();
        };
        
        // Also patch refreshBalances to handle missing data
        const originalRefresh = dashboard.refreshBalances;
        
        dashboard.refreshBalances = async function() {
            try {
                const account = this.app.state.getCurrentAccount();
                if (!account) {
                    console.warn('[CompleteAccountsFix] No current account for balance refresh');
                    return;
                }
                
                // Ensure account has proper structure
                if (!account.balances) {
                    account.balances = { bitcoin: 0, lightning: 0, stablecoins: {} };
                }
                
                // Call original if exists
                if (originalRefresh) {
                    await originalRefresh.call(this);
                }
            } catch (error) {
                console.error('[CompleteAccountsFix] Error refreshing balances:', error);
            }
        };
    }

    // Main initialization
    async function init() {
        try {
            await waitForWallet();
            await initializeAccounts();
            patchDashboard();
            
            console.log('[CompleteAccountsFix] Initialization complete');
            
            // If dashboard is already loaded, initialize it
            if (window.MooshWallet?.ui?.dashboard) {
                window.MooshWallet.ui.dashboard.initializeDashboard();
            }
            
        } catch (error) {
            console.error('[CompleteAccountsFix] Failed to initialize:', error);
        }
    }

    // Run initialization
    init();

})();