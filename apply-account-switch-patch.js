// MOOSH WALLET - QUICK ACCOUNT SWITCH PATCH
// Apply this to immediately fix account switching UI updates

(function() {
    'use strict';

    console.log('[AccountSwitchPatch] Applying quick fix for account switching UI...');

    // Wait for wallet
    const waitForWallet = setInterval(() => {
        if (window.MooshWallet && window.MooshWallet.state) {
            clearInterval(waitForWallet);
            applyPatch();
        }
    }, 100);

    function applyPatch() {
        // Store original switchAccount
        const originalSwitch = window.MooshWallet.state.switchAccount;
        
        // Override with UI update version
        window.MooshWallet.state.switchAccount = function(accountId) {
            console.log('[AccountSwitchPatch] Switching account to:', accountId);
            
            // Call original
            const result = originalSwitch.call(this, accountId);
            
            if (result) {
                // Get new account info
                const newAccount = this.getCurrentAccount();
                console.log('[AccountSwitchPatch] Switched to:', newAccount?.name);
                
                // Force immediate UI update
                if (window.MooshWallet.router.currentPage === 'dashboard') {
                    // Option 1: Re-navigate to dashboard (cleanest)
                    window.MooshWallet.router.navigate('dashboard');
                    
                    // Option 2: Update specific elements (faster but manual)
                    /*
                    setTimeout(() => {
                        // Update all account name displays
                        const accountDisplays = document.querySelectorAll(
                            '#currentAccountIndicator, .account-indicator, #accountDropdownButton span:first-child'
                        );
                        
                        accountDisplays.forEach(el => {
                            if (el && el.textContent.includes('Account:')) {
                                el.textContent = `Account: ${newAccount?.name || 'Main Account'}`;
                            }
                        });
                        
                        // Update dropdown active states
                        const dropdownItems = document.querySelectorAll('.account-dropdown-item');
                        dropdownItems.forEach(item => {
                            const itemText = item.querySelector('span')?.textContent;
                            const isActive = itemText === newAccount?.name;
                            
                            item.style.color = isActive ? 'var(--text-accent)' : 'var(--text-primary)';
                            item.style.background = isActive ? 'rgba(105, 253, 151, 0.1)' : 'transparent';
                        });
                    }, 100);
                    */
                }
                
                // Emit event for other components
                this.emit('accountSwitched', newAccount);
            }
            
            return result;
        };
        
        console.log('[AccountSwitchPatch] ✓ Patch applied successfully');
        console.log('[AccountSwitchPatch] Account switching will now update the UI immediately');
    }

    // Add manual switch helper
    window.switchToAccount = (nameOrIndex) => {
        const state = window.MooshWallet.state;
        const accounts = state.getAccounts();
        
        let targetAccount;
        if (typeof nameOrIndex === 'number') {
            targetAccount = accounts[nameOrIndex];
        } else {
            targetAccount = accounts.find(a => a.name.toLowerCase().includes(nameOrIndex.toLowerCase()));
        }
        
        if (targetAccount) {
            console.log(`Switching to account: ${targetAccount.name}`);
            state.switchAccount(targetAccount.id);
        } else {
            console.log('Account not found. Available accounts:');
            accounts.forEach((acc, idx) => {
                console.log(`${idx}: ${acc.name}`);
            });
        }
    };

    console.log('[AccountSwitchPatch] Helper added: switchToAccount("name") or switchToAccount(index)');

})();