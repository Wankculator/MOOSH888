// MOOSH WALLET - FIX ACCOUNT SWITCHING UI UPDATE
// Ensures UI updates when switching accounts

(function() {
    'use strict';

    console.log('[AccountSwitchingUIFix] Initializing account switching UI update fix...');

    // Wait for wallet to be ready
    function waitForWallet() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (window.MooshWallet && window.MooshWallet.state && window.MooshWallet.router) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
    }

    async function fixAccountSwitchingUIUpdate() {
        await waitForWallet();

        // Override the switchAccount method to emit events
        const originalSwitchAccount = window.MooshWallet.state.switchAccount;
        
        window.MooshWallet.state.switchAccount = function(accountId) {
            console.log('[AccountSwitchingUIFix] Switching to account:', accountId);
            
            // Call original method
            const result = originalSwitchAccount.call(this, accountId);
            
            if (result) {
                console.log('[AccountSwitchingUIFix] Account switched successfully, updating UI...');
                
                // Emit account switched event
                this.emit('accountSwitched', this.getCurrentAccount());
                
                // Force dashboard refresh if on dashboard
                if (window.MooshWallet.router.currentPage === 'dashboard') {
                    console.log('[AccountSwitchingUIFix] Refreshing dashboard...');
                    
                    // Get the current dashboard instance
                    const dashboardPage = window.MooshWallet.router.currentPageInstance;
                    
                    if (dashboardPage && dashboardPage.render) {
                        // Re-render the dashboard
                        const container = document.getElementById('app');
                        if (container) {
                            container.innerHTML = '';
                            const content = dashboardPage.render();
                            if (content) {
                                container.appendChild(content);
                            }
                        }
                    } else {
                        // Fallback: navigate to dashboard again
                        window.MooshWallet.router.navigate('dashboard');
                    }
                    
                    // Update live data if available
                    if (window.MooshLiveData && window.MooshLiveData.updateUI) {
                        setTimeout(() => {
                            window.MooshLiveData.updateUI();
                        }, 100);
                    }
                }
                
                // Update any account indicators on the page
                setTimeout(() => {
                    const currentAccount = this.getCurrentAccount();
                    console.log('[AccountSwitchingUIFix] Current account after switch:', currentAccount);
                    
                    // Update account indicator text
                    const indicator = document.getElementById('currentAccountIndicator');
                    if (indicator) {
                        indicator.textContent = `Account: ${currentAccount?.name || 'Main Account'}`;
                    }
                    
                    // Update dropdown button text
                    const dropdownButton = document.getElementById('accountDropdownButton');
                    if (dropdownButton) {
                        const buttonText = dropdownButton.querySelector('span');
                        if (buttonText) {
                            buttonText.textContent = `Account: ${currentAccount?.name || 'Main Account'}`;
                        }
                    }
                    
                    // Update dropdown menu to show new active state
                    const dropdownMenu = document.getElementById('accountDropdownMenu');
                    if (dropdownMenu) {
                        const items = dropdownMenu.querySelectorAll('.account-dropdown-item');
                        items.forEach(item => {
                            const accountName = item.querySelector('span').textContent;
                            const isActive = accountName === currentAccount?.name;
                            
                            // Update styling
                            if (isActive) {
                                item.style.color = 'var(--text-accent)';
                                item.style.background = 'rgba(105, 253, 151, 0.1)';
                                
                                // Add active indicator if not present
                                if (!item.querySelector('span:last-child')?.textContent?.includes('●')) {
                                    const indicator = document.createElement('span');
                                    indicator.style.color = 'var(--text-accent)';
                                    indicator.style.fontSize = '10px';
                                    indicator.textContent = '●';
                                    item.appendChild(indicator);
                                }
                            } else {
                                item.style.color = 'var(--text-primary)';
                                item.style.background = 'transparent';
                                
                                // Remove active indicator
                                const indicator = item.querySelector('span:last-child');
                                if (indicator && indicator.textContent === '●') {
                                    indicator.remove();
                                }
                            }
                        });
                    }
                    
                    // Update balance displays
                    const balanceElements = document.querySelectorAll('[data-account-balance]');
                    balanceElements.forEach(el => {
                        // This would trigger balance refresh for the new account
                        el.textContent = 'Loading...';
                    });
                    
                    console.log('[AccountSwitchingUIFix] UI update complete');
                }, 50);
            }
            
            return result;
        };

        // Also fix the dashboard's switchToAccount method
        const DashboardPage = window.MooshWallet.pages?.Dashboard;
        if (DashboardPage && DashboardPage.prototype.switchToAccount) {
            const originalSwitchToAccount = DashboardPage.prototype.switchToAccount;
            
            DashboardPage.prototype.switchToAccount = function(accountId) {
                console.log('[AccountSwitchingUIFix] Dashboard switchToAccount called:', accountId);
                
                // Close dropdown first
                const dropdown = document.getElementById('accountDropdownMenu');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
                
                // Switch account
                const switched = this.app.state.switchAccount(accountId);
                
                if (switched) {
                    const account = this.app.state.getCurrentAccount();
                    console.log('[AccountSwitchingUIFix] Switched to account:', account?.name);
                    this.app.showNotification(`Switched to ${account?.name || 'Account'}`, 'success');
                } else {
                    console.error('[AccountSwitchingUIFix] Failed to switch account');
                    this.app.showNotification('Failed to switch account', 'error');
                }
            };
        }

        console.log('[AccountSwitchingUIFix] Account switching UI update fix applied');
    }

    // Apply the fix
    fixAccountSwitchingUIUpdate().then(() => {
        console.log('[AccountSwitchingUIFix] Ready for account switching with proper UI updates');
    });

    // Debug helper
    window.debugAccountSwitch = () => {
        const state = window.MooshWallet.state;
        const accounts = state.getAccounts();
        const currentId = state.get('currentAccountId');
        const currentAccount = state.getCurrentAccount();
        
        console.log('\\n=== Account Switch Debug ===');
        console.log('Total accounts:', accounts.length);
        console.log('Current account ID:', currentId);
        console.log('Current account:', currentAccount);
        console.log('All accounts:', accounts.map(a => ({
            id: a.id,
            name: a.name,
            isCurrent: a.id === currentId
        })));
        
        // Check UI elements
        const indicator = document.getElementById('currentAccountIndicator');
        const dropdownButton = document.getElementById('accountDropdownButton');
        
        console.log('\\nUI Elements:');
        console.log('Account indicator text:', indicator?.textContent);
        console.log('Dropdown button text:', dropdownButton?.querySelector('span')?.textContent);
        console.log('===========================\\n');
    };

})();