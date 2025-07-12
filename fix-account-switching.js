// MOOSH WALLET - FIX ACCOUNT SWITCHING
// Adds proper account selector dropdown to dashboard

(function() {
    'use strict';

    console.log('[AccountSwitching] Initializing account switching fix...');

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

    // Override the createDashboardHeader method to add account selector
    async function enhanceDashboardWithAccountSelector() {
        await waitForWallet();

        const DashboardPage = window.MooshWallet.pages.Dashboard;
        if (!DashboardPage) {
            console.error('[AccountSwitching] Dashboard page not found');
            return;
        }

        // Store original methods
        const originalCreateDashboardHeader = DashboardPage.prototype.createDashboardHeader;
        const originalGetAccountDisplayName = DashboardPage.prototype.getAccountDisplayName;

        // Create account selector dropdown
        DashboardPage.prototype.createAccountSelector = function() {
            const $ = window.ElementFactory || ElementFactory;
            const accounts = this.app.state.getAccounts();
            const currentAccountId = this.app.state.get('currentAccountId');
            const currentAccount = accounts.find(acc => acc.id === currentAccountId) || accounts[0];

            if (accounts.length <= 1) {
                // If only one account, just show the name
                return $.div({ 
                    id: 'currentAccountIndicator',
                    className: 'account-indicator',
                    style: 'font-family: JetBrains Mono, monospace; font-size: calc(11px * var(--scale-factor)); color: var(--text-accent); padding: calc(4px * var(--scale-factor)) calc(8px * var(--scale-factor)); background: rgba(105, 253, 151, 0.1); border: 1px solid var(--text-accent); border-radius: 0; display: inline-block; cursor: pointer; transition: all 0.2s ease;',
                    onclick: () => this.showMultiAccountManager(),
                    onmouseover: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.2)',
                    onmouseout: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.1)'
                }, [`Account: ${currentAccount?.name || 'Main Account'}`]);
            }

            // Create dropdown for multiple accounts
            const dropdownContainer = $.div({
                style: 'position: relative; display: inline-block;'
            });

            const dropdownButton = $.button({
                id: 'accountDropdownButton',
                className: 'account-dropdown-button',
                style: `
                    font-family: JetBrains Mono, monospace; 
                    font-size: calc(11px * var(--scale-factor)); 
                    color: var(--text-accent); 
                    padding: calc(6px * var(--scale-factor)) calc(12px * var(--scale-factor)); 
                    background: rgba(105, 253, 151, 0.1); 
                    border: 1px solid var(--text-accent); 
                    border-radius: 0; 
                    cursor: pointer; 
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                `,
                onclick: (e) => {
                    e.stopPropagation();
                    const dropdown = document.getElementById('accountDropdownMenu');
                    if (dropdown) {
                        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                    }
                },
                onmouseover: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.2)',
                onmouseout: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.1)'
            }, [
                $.span({}, [`Account: ${currentAccount?.name || 'Main Account'}`]),
                $.span({ style: 'font-size: 10px;' }, ['▼'])
            ]);

            const dropdownMenu = $.div({
                id: 'accountDropdownMenu',
                style: `
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    margin-top: 4px;
                    background: #000000;
                    border: 1px solid var(--text-accent);
                    border-radius: 0;
                    min-width: 200px;
                    z-index: 1000;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                `
            }, accounts.map(account => {
                const isActive = account.id === currentAccountId;
                return $.div({
                    className: 'account-dropdown-item',
                    style: `
                        padding: 8px 12px;
                        font-family: JetBrains Mono, monospace;
                        font-size: 11px;
                        color: ${isActive ? 'var(--text-accent)' : 'var(--text-primary)'};
                        background: ${isActive ? 'rgba(105, 253, 151, 0.1)' : 'transparent'};
                        cursor: pointer;
                        transition: all 0.2s ease;
                        border-bottom: 1px solid #333333;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    `,
                    onclick: (e) => {
                        e.stopPropagation();
                        if (!isActive) {
                            console.log('[AccountSwitching] Switching to account:', account.name, account.id);
                            this.switchToAccount(account.id);
                        }
                    },
                    onmouseover: function() {
                        if (!isActive) {
                            this.style.background = 'rgba(105, 253, 151, 0.1)';
                            this.style.color = 'var(--text-accent)';
                        }
                    },
                    onmouseout: function() {
                        if (!isActive) {
                            this.style.background = 'transparent';
                            this.style.color = 'var(--text-primary)';
                        }
                    }
                }, [
                    $.span({}, [account.name]),
                    isActive && $.span({ style: 'color: var(--text-accent); font-size: 10px;' }, ['●'])
                ]);
            }));

            dropdownContainer.appendChild(dropdownButton);
            dropdownContainer.appendChild(dropdownMenu);

            // Add plus button to add new account
            const addAccountButton = $.button({
                style: `
                    margin-left: 8px;
                    padding: 4px 8px;
                    background: transparent;
                    border: 1px solid var(--text-accent);
                    color: var(--text-accent);
                    font-family: JetBrains Mono, monospace;
                    font-size: 11px;
                    cursor: pointer;
                    border-radius: 0;
                    transition: all 0.2s ease;
                `,
                onclick: () => this.showMultiAccountManager(),
                onmouseover: function() {
                    this.style.background = 'var(--text-accent)';
                    this.style.color = '#000000';
                },
                onmouseout: function() {
                    this.style.background = 'transparent';
                    this.style.color = 'var(--text-accent)';
                }
            }, ['+']);

            const container = $.div({
                style: 'display: flex; align-items: center;'
            });
            container.appendChild(dropdownContainer);
            container.appendChild(addAccountButton);

            return container;
        };

        // Add method to switch accounts
        DashboardPage.prototype.switchToAccount = function(accountId) {
            console.log('[AccountSwitching] Switching to account ID:', accountId);
            
            // Close dropdown
            const dropdown = document.getElementById('accountDropdownMenu');
            if (dropdown) {
                dropdown.style.display = 'none';
            }

            // Switch account
            const switched = this.app.state.switchAccount(accountId);
            
            if (switched) {
                console.log('[AccountSwitching] Account switched successfully');
                this.app.showNotification('Account switched successfully', 'success');
                
                // Re-render dashboard
                this.app.router.navigate('dashboard');
                
                // Update live data if available
                if (window.MooshLiveData && window.MooshLiveData.refreshAll) {
                    setTimeout(() => {
                        window.MooshLiveData.refreshAll();
                    }, 100);
                }
            } else {
                console.error('[AccountSwitching] Failed to switch account');
                this.app.showNotification('Failed to switch account', 'error');
            }
        };

        // Override createDashboardHeader to use new account selector
        DashboardPage.prototype.createDashboardHeader = function() {
            const $ = window.ElementFactory || ElementFactory;
            
            return $.div({ className: 'terminal-box', style: 'margin-bottom: calc(24px * var(--scale-factor));' }, [
                $.div({ className: 'terminal-header' }, [
                    $.span({}, ['~/moosh/wallet/dashboard $']),
                    $.span({ className: 'text-keyword' }, ['active'])
                ]),
                $.div({ className: 'terminal-content' }, [
                    $.div({ 
                        style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: calc(12px * var(--scale-factor));'
                    }, [
                        // Left side: Terminal title
                        $.h2({ 
                            style: 'font-size: calc(20px * var(--scale-factor)); font-weight: 600; font-family: JetBrains Mono, monospace; margin: 0;'
                        }, ['MOOSH WALLET TERMINAL']),
                        
                        // Right side: Header buttons
                        $.div({ 
                            className: 'header-buttons',
                            style: 'display: flex; gap: calc(8px * var(--scale-factor)); align-items: center;'
                        }, [
                            $.button({
                                className: 'btn-secondary dashboard-btn',
                                onclick: () => this.handleRefresh()
                            }, ['Refresh']),
                            $.button({
                                className: 'btn-secondary dashboard-btn',
                                onclick: () => this.toggleBalanceVisibility()
                            }, ['Hide'])
                        ])
                    ]),
                    
                    // Account selector dropdown
                    this.createAccountSelector()
                ])
            ]);
        };

        console.log('[AccountSwitching] Dashboard header enhanced with account selector');
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('accountDropdownMenu');
        const button = document.getElementById('accountDropdownButton');
        
        if (dropdown && button && !button.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Apply the enhancement
    enhanceDashboardWithAccountSelector().then(() => {
        console.log('[AccountSwitching] Account switching fix applied successfully');
        
        // Force re-render if on dashboard
        if (window.MooshWallet && window.MooshWallet.router && window.MooshWallet.router.currentPage === 'dashboard') {
            window.MooshWallet.router.navigate('dashboard');
        }
    });

    // Test helper
    window.testAccountSwitching = () => {
        console.log('\\n=== Testing Account Switching ===');
        const state = window.MooshWallet.state;
        const accounts = state.getAccounts();
        const currentId = state.get('currentAccountId');
        
        console.log('Total accounts:', accounts.length);
        console.log('Current account ID:', currentId);
        console.log('Accounts:', accounts.map(a => ({ id: a.id, name: a.name })));
        
        if (accounts.length > 1) {
            console.log('\\nClick the account dropdown to switch between accounts');
        } else {
            console.log('\\nOnly one account exists. Create more accounts to test switching.');
        }
    };

})();