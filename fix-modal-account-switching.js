// MOOSH WALLET - FIX MODAL ACCOUNT SWITCHING
// Ensures account switching works properly from the MultiAccountModal

(function() {
    'use strict';

    console.log('[ModalAccountSwitching] Initializing modal account switching fix...');

    // Wait for wallet to be ready
    function waitForWallet() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (window.MooshWallet && 
                    window.MooshWallet.state && 
                    window.MooshWallet.router &&
                    window.MooshWallet.components &&
                    window.MooshWallet.components.MultiAccountModal) {
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

    async function fixModalAccountSwitching() {
        await waitForWallet();

        console.log('[ModalAccountSwitching] Patching MultiAccountModal...');

        // Get the MultiAccountModal class
        const MultiAccountModal = window.MooshWallet.components.MultiAccountModal;
        
        // Override the createAccountItem method
        const originalCreateAccountItem = MultiAccountModal.prototype.createAccountItem;
        
        MultiAccountModal.prototype.createAccountItem = function(account, isActive) {
            const $ = window.ElementFactory || ElementFactory;
            
            return $.div({
                style: {
                    padding: '15px',
                    border: `1px solid ${isActive ? '#f57315' : '#333'}`,
                    marginBottom: '10px',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(245, 115, 21, 0.1)' : 'transparent',
                    transition: 'all 0.2s ease'
                },
                onmouseover: (e) => {
                    if (!isActive) e.currentTarget.style.borderColor = '#666';
                },
                onmouseout: (e) => {
                    if (!isActive) e.currentTarget.style.borderColor = '#333';
                },
                onclick: async (e) => {
                    // Prevent event bubbling
                    e.stopPropagation();
                    
                    if (!isActive) {
                        console.log('[ModalAccountSwitching] Switching to account:', account.name, account.id);
                        
                        try {
                            // Switch account
                            const switched = this.app.state.switchAccount(account.id);
                            
                            if (switched) {
                                console.log('[ModalAccountSwitching] Account switched successfully');
                                this.app.showNotification(`Switched to ${account.name}`, 'success');
                                
                                // Close modal first
                                this.close();
                                
                                // Wait a moment for modal to close
                                setTimeout(() => {
                                    // Force navigation to dashboard
                                    console.log('[ModalAccountSwitching] Navigating to dashboard...');
                                    this.app.router.navigate('dashboard');
                                    
                                    // Update any live data
                                    if (window.MooshLiveData && window.MooshLiveData.refreshAll) {
                                        setTimeout(() => {
                                            window.MooshLiveData.refreshAll();
                                        }, 100);
                                    }
                                }, 100);
                            } else {
                                console.error('[ModalAccountSwitching] Failed to switch account');
                                this.app.showNotification('Failed to switch account', 'error');
                            }
                        } catch (error) {
                            console.error('[ModalAccountSwitching] Error switching account:', error);
                            this.app.showNotification('Error switching account: ' + error.message, 'error');
                        }
                    } else {
                        console.log('[ModalAccountSwitching] Account already active');
                    }
                }
            }, [
                $.div({ style: 'display: flex; justify-content: space-between; align-items: center;' }, [
                    $.div({}, [
                        $.h4({ style: 'color: var(--text-primary); margin-bottom: 5px;' }, [
                            account.name,
                            isActive ? $.span({ style: 'color: #f57315; margin-left: 10px; font-size: 12px;' }, ['(Active)']) : null
                        ]),
                        $.p({ style: 'font-size: 12px; color: #666;' }, [
                            `Created: ${new Date(account.createdAt).toLocaleDateString()}`
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
                        this.app.state.getAccounts().length > 1 ? $.button({
                            style: 'background: transparent; border: 1px solid #ff4444; color: #ff4444; padding: 5px 10px; font-size: 12px;',
                            onclick: (e) => {
                                e.stopPropagation();
                                this.deleteAccount(account);
                            }
                        }, ['Delete']) : null
                    ])
                ])
            ]);
        };

        // Also ensure the state's switchAccount method works properly
        const originalSwitchAccount = window.MooshWallet.state.switchAccount;
        
        window.MooshWallet.state.switchAccount = function(accountId) {
            console.log('[ModalAccountSwitching] State.switchAccount called with:', accountId);
            
            const account = this.state.accounts.find(a => a.id === accountId);
            if (!account) {
                console.error('[ModalAccountSwitching] Account not found:', accountId);
                return false;
            }
            
            console.log('[ModalAccountSwitching] Found account:', account.name);
            
            // Update the current account ID
            const oldAccountId = this.state.currentAccountId;
            this.state.currentAccountId = accountId;
            this.set('currentAccountId', accountId);
            
            // Update last used
            account.lastUsed = Date.now();
            
            // Persist changes
            this.persistAccounts();
            
            console.log('[ModalAccountSwitching] Account switched from', oldAccountId, 'to', accountId);
            
            // Emit event
            this.emit('accountSwitched', account);
            
            return true;
        };

        console.log('[ModalAccountSwitching] Fix applied successfully');
    }

    // Apply the fix
    fixModalAccountSwitching().then(() => {
        console.log('[ModalAccountSwitching] Modal account switching ready');
        
        // Add helper to test
        window.testModalAccountSwitch = () => {
            console.log('\\n=== Testing Modal Account Switch ===');
            const state = window.MooshWallet.state;
            const accounts = state.getAccounts();
            const currentId = state.get('currentAccountId');
            
            console.log('Current account ID:', currentId);
            console.log('Accounts:', accounts.map(a => ({
                id: a.id,
                name: a.name,
                isCurrent: a.id === currentId
            })));
            
            console.log('\\nTo test:');
            console.log('1. Click "+ Accounts" button');
            console.log('2. Click on a different account');
            console.log('3. Modal should close and dashboard should update');
        };
    });

})();