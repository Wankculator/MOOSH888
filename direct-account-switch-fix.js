// MOOSH WALLET - DIRECT ACCOUNT SWITCH FIX
// Directly patches the wallet to fix account switching and dashboard refresh

(function() {
    'use strict';

    console.log('[DirectAccountSwitchFix] Applying direct fix for account switching...');

    // Wait for wallet initialization
    const waitInterval = setInterval(() => {
        if (window.MooshWallet && window.MooshWallet.state && window.MooshWallet.router) {
            clearInterval(waitInterval);
            applyDirectFix();
        }
    }, 100);

    function applyDirectFix() {
        console.log('[DirectAccountSwitchFix] Wallet ready, applying patches...');

        // 1. Fix the state switchAccount method
        const state = window.MooshWallet.state;
        const originalSwitchAccount = state.switchAccount.bind(state);
        
        state.switchAccount = function(accountId) {
            console.log('[DirectAccountSwitchFix] switchAccount called:', accountId);
            
            // Find the account
            const account = this.state.accounts.find(a => a.id === accountId);
            if (!account) {
                console.error('[DirectAccountSwitchFix] Account not found:', accountId);
                return false;
            }
            
            const oldAccountId = this.state.currentAccountId;
            console.log('[DirectAccountSwitchFix] Switching from', oldAccountId, 'to', accountId);
            
            // Update current account ID in state
            this.state.currentAccountId = accountId;
            this.set('currentAccountId', accountId);
            
            // Update last used timestamp
            account.lastUsed = Date.now();
            
            // Persist to localStorage
            this.persistAccounts();
            
            console.log('[DirectAccountSwitchFix] Account switched successfully');
            
            // Emit event for listeners
            this.emit('accountSwitched', account);
            
            // Force dashboard refresh if on dashboard
            if (window.MooshWallet.router.currentPage === 'dashboard') {
                console.log('[DirectAccountSwitchFix] Refreshing dashboard...');
                setTimeout(() => {
                    window.MooshWallet.router.navigate('dashboard');
                }, 50);
            }
            
            return true;
        };

        // 2. Monitor for MultiAccountModal and patch it when available
        const patchModal = () => {
            const modalCheck = setInterval(() => {
                if (window.MooshWallet.components && window.MooshWallet.components.MultiAccountModal) {
                    clearInterval(modalCheck);
                    
                    console.log('[DirectAccountSwitchFix] Patching MultiAccountModal...');
                    
                    // Get any existing modal instance
                    const modalInstances = [];
                    if (window.MooshWallet.multiAccountModal) {
                        modalInstances.push(window.MooshWallet.multiAccountModal);
                    }
                    
                    // Patch the prototype for future instances
                    const MultiAccountModal = window.MooshWallet.components.MultiAccountModal;
                    const originalShow = MultiAccountModal.prototype.show;
                    
                    MultiAccountModal.prototype.show = function() {
                        console.log('[DirectAccountSwitchFix] MultiAccountModal.show called');
                        
                        // Call original show
                        const result = originalShow.call(this);
                        
                        // After modal is shown, enhance account items
                        setTimeout(() => {
                            enhanceAccountItems();
                        }, 100);
                        
                        return result;
                    };
                }
            }, 100);
            
            // Stop checking after 10 seconds
            setTimeout(() => clearInterval(modalCheck), 10000);
        };

        // 3. Enhance account items in the modal to ensure they work
        const enhanceAccountItems = () => {
            console.log('[DirectAccountSwitchFix] Enhancing account items...');
            
            // Find all account items in the modal
            const modal = document.querySelector('.multi-account-modal, [style*="z-index: 10000"]');
            if (!modal) {
                console.log('[DirectAccountSwitchFix] Modal not found');
                return;
            }
            
            // Find account items (divs with onclick that contain account info)
            const accountItems = modal.querySelectorAll('div[style*="cursor: pointer"][style*="padding: 15px"]');
            console.log('[DirectAccountSwitchFix] Found', accountItems.length, 'account items');
            
            accountItems.forEach((item, index) => {
                // Check if this is an active account
                const isActive = item.style.border.includes('#f57315') || item.textContent.includes('(Active)');
                
                if (!isActive) {
                    // Get account name from the h4 element
                    const accountNameElement = item.querySelector('h4');
                    const accountName = accountNameElement ? accountNameElement.textContent.trim() : 'Unknown';
                    
                    console.log('[DirectAccountSwitchFix] Enhancing account item:', accountName);
                    
                    // Replace onclick handler
                    item.onclick = (e) => {
                        e.stopPropagation();
                        
                        console.log('[DirectAccountSwitchFix] Account item clicked:', accountName);
                        
                        // Find the account by name
                        const accounts = window.MooshWallet.state.getAccounts();
                        const account = accounts.find(a => a.name === accountName);
                        
                        if (account) {
                            console.log('[DirectAccountSwitchFix] Found account:', account.id);
                            
                            // Switch account
                            const switched = window.MooshWallet.state.switchAccount(account.id);
                            
                            if (switched) {
                                window.MooshWallet.showNotification(`Switched to ${account.name}`, 'success');
                                
                                // Close modal
                                const closeButton = modal.querySelector('button:contains("Close"), button:contains("✕")') ||
                                                  Array.from(modal.querySelectorAll('button')).find(btn => btn.textContent === 'Close');
                                
                                if (closeButton) {
                                    closeButton.click();
                                } else {
                                    // Fallback: remove modal directly
                                    modal.remove();
                                }
                            }
                        } else {
                            console.error('[DirectAccountSwitchFix] Account not found:', accountName);
                        }
                    };
                }
            });
        };

        patchModal();

        // 4. Add global helper for manual switching
        window.switchAccount = (nameOrId) => {
            const accounts = window.MooshWallet.state.getAccounts();
            let account;
            
            if (typeof nameOrId === 'number') {
                account = accounts[nameOrId];
            } else {
                account = accounts.find(a => 
                    a.id === nameOrId || 
                    a.name.toLowerCase().includes(nameOrId.toLowerCase())
                );
            }
            
            if (account) {
                console.log(`Switching to account: ${account.name}`);
                const switched = window.MooshWallet.state.switchAccount(account.id);
                if (switched) {
                    console.log('Account switched successfully');
                }
            } else {
                console.log('Account not found. Available accounts:');
                accounts.forEach((acc, idx) => {
                    console.log(`${idx}: ${acc.name} (${acc.id})`);
                });
            }
        };

        console.log('[DirectAccountSwitchFix] Fix applied successfully');
        console.log('[DirectAccountSwitchFix] Use switchAccount("name") or switchAccount(index) to test');
    }

    // Also listen for clicks on the + Accounts button to apply enhancements
    document.addEventListener('click', (e) => {
        if (e.target.textContent && (e.target.textContent.includes('+ Accounts') || e.target.textContent.includes('Accounts'))) {
            console.log('[DirectAccountSwitchFix] Accounts button clicked, will enhance modal...');
            setTimeout(enhanceAccountItems, 500);
        }
    });

})();