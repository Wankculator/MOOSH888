// MOOSH WALLET - REACTIVE ACCOUNT SWITCHING WITH INSTANT UI UPDATES
// Following MASTER_PROMPT_NEEDED.md best practices: Security-first, TDD, >95% coverage

(function() {
    'use strict';

    console.log('[ReactiveAccountSwitching] Initializing instant account switching system...');

    // ═══════════════════════════════════════════════════════════════════════
    // REACTIVE STATE MANAGER - Performance-optimized with instant updates
    // ═══════════════════════════════════════════════════════════════════════
    class ReactiveStateManager {
        constructor() {
            this.subscribers = new Map();
            this.state = {};
            this.updateQueue = [];
            this.isUpdating = false;
            this.performanceMetrics = {
                switchTime: 0,
                renderTime: 0,
                lastSwitch: Date.now()
            };
        }

        // Subscribe to state changes with granular control
        subscribe(key, callback, options = {}) {
            if (!this.subscribers.has(key)) {
                this.subscribers.set(key, new Set());
            }
            
            const subscription = {
                callback,
                immediate: options.immediate || false,
                debounce: options.debounce || 0,
                priority: options.priority || 0
            };
            
            this.subscribers.get(key).add(subscription);
            
            // Return unsubscribe function
            return () => {
                const subs = this.subscribers.get(key);
                if (subs) {
                    subs.delete(subscription);
                }
            };
        }

        // Batch updates for performance
        batchUpdate(updates) {
            this.updateQueue.push(...Object.entries(updates));
            
            if (!this.isUpdating) {
                this.isUpdating = true;
                // Use microtask for instant updates
                queueMicrotask(() => this.processBatch());
            }
        }

        // Process batched updates
        processBatch() {
            const startTime = performance.now();
            const updates = new Map();
            
            // Collect all updates
            while (this.updateQueue.length > 0) {
                const [key, value] = this.updateQueue.shift();
                updates.set(key, value);
            }
            
            // Apply updates
            updates.forEach((value, key) => {
                const oldValue = this.state[key];
                if (oldValue !== value) {
                    this.state[key] = value;
                    this.notifySubscribers(key, value, oldValue);
                }
            });
            
            this.isUpdating = false;
            this.performanceMetrics.renderTime = performance.now() - startTime;
        }

        // Notify subscribers with priority ordering
        notifySubscribers(key, newValue, oldValue) {
            const subscribers = this.subscribers.get(key);
            if (!subscribers || subscribers.size === 0) return;
            
            // Sort by priority
            const sorted = Array.from(subscribers).sort((a, b) => b.priority - a.priority);
            
            sorted.forEach(sub => {
                if (sub.immediate) {
                    sub.callback(newValue, oldValue);
                } else if (sub.debounce > 0) {
                    clearTimeout(sub.timeoutId);
                    sub.timeoutId = setTimeout(() => {
                        sub.callback(newValue, oldValue);
                    }, sub.debounce);
                } else {
                    // Use requestAnimationFrame for smooth UI updates
                    requestAnimationFrame(() => {
                        sub.callback(newValue, oldValue);
                    });
                }
            });
        }

        // Direct state access
        get(key) {
            return this.state[key];
        }

        // Instant state update
        set(key, value) {
            this.batchUpdate({ [key]: value });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ENHANCED STATE WITH REACTIVE ACCOUNT SWITCHING
    // ═══════════════════════════════════════════════════════════════════════
    async function enhanceWalletState() {
        // Wait for wallet
        await new Promise(resolve => {
            const check = setInterval(() => {
                if (window.MooshWallet?.state) {
                    clearInterval(check);
                    resolve();
                }
            }, 10);
        });

        const state = window.MooshWallet.state;
        const reactiveState = new ReactiveStateManager();
        
        // Initialize reactive state with current values
        reactiveState.set('currentAccountId', state.get('currentAccountId'));
        reactiveState.set('accounts', state.getAccounts());

        // Override switchAccount for instant updates
        const originalSwitchAccount = state.switchAccount.bind(state);
        
        state.switchAccount = function(accountId) {
            console.log('[ReactiveAccountSwitching] Switching to account:', accountId);
            const startTime = performance.now();
            
            // Validate account exists
            const accounts = this.getAccounts();
            const targetAccount = accounts.find(a => a.id === accountId);
            
            if (!targetAccount) {
                console.error('[ReactiveAccountSwitching] Account not found:', accountId);
                return false;
            }
            
            // Update state immediately (no delays)
            const previousId = this.state.currentAccountId;
            this.state.currentAccountId = accountId;
            targetAccount.lastUsed = Date.now();
            
            // Persist in background (non-blocking)
            requestIdleCallback(() => {
                this.persistAccounts();
            });
            
            // Update reactive state
            reactiveState.batchUpdate({
                currentAccountId: accountId,
                currentAccount: targetAccount,
                previousAccountId: previousId
            });
            
            // Emit event
            this.emit('accountSwitched', targetAccount);
            
            // Log performance
            const switchTime = performance.now() - startTime;
            console.log(`[ReactiveAccountSwitching] Switch completed in ${switchTime.toFixed(2)}ms`);
            reactiveState.performanceMetrics.switchTime = switchTime;
            
            return true;
        };

        // Expose reactive state
        window.MooshWallet.reactiveState = reactiveState;
        
        return reactiveState;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // UI COMPONENT UPDATERS - Instant DOM updates
    // ═══════════════════════════════════════════════════════════════════════
    class UIUpdater {
        constructor(reactiveState) {
            this.reactiveState = reactiveState;
            this.updateFunctions = new Map();
            this.setupUpdaters();
        }

        setupUpdaters() {
            // Account name updater
            this.updateFunctions.set('accountName', (account) => {
                const elements = [
                    document.getElementById('currentAccountIndicator'),
                    document.querySelector('#accountDropdownButton span'),
                    document.querySelector('.account-indicator'),
                    ...document.querySelectorAll('[data-account-name]')
                ];
                
                elements.forEach(el => {
                    if (el) {
                        const text = el.textContent || '';
                        if (text.includes('Account:')) {
                            el.textContent = `Account: ${account?.name || 'Main Account'}`;
                        } else {
                            el.textContent = account?.name || 'Main Account';
                        }
                    }
                });
            });

            // Balance updater
            this.updateFunctions.set('balance', (account) => {
                const balanceElements = document.querySelectorAll('[data-balance], .balance-display, #btcBalance');
                balanceElements.forEach(el => {
                    if (el) {
                        // Show loading state briefly
                        el.style.opacity = '0.5';
                        el.textContent = 'Updating...';
                        
                        // Simulate balance update (replace with actual balance fetch)
                        requestAnimationFrame(() => {
                            el.style.opacity = '1';
                            const balance = account?.balances?.bitcoin || 0;
                            el.textContent = `${balance.toFixed(8)} BTC`;
                        });
                    }
                });
            });

            // Address updater
            this.updateFunctions.set('addresses', (account) => {
                const addressElements = document.querySelectorAll('[data-address], .address-display');
                addressElements.forEach(el => {
                    if (el && account?.addresses) {
                        const addressType = el.dataset.addressType || 'bitcoin';
                        el.textContent = account.addresses[addressType] || 'Loading...';
                    }
                });
            });

            // Dropdown state updater
            this.updateFunctions.set('dropdown', (accountId) => {
                const dropdownItems = document.querySelectorAll('.account-dropdown-item');
                dropdownItems.forEach(item => {
                    const itemAccount = item.dataset.accountId;
                    const isActive = itemAccount === accountId;
                    
                    // Update styles instantly
                    item.style.color = isActive ? 'var(--text-accent)' : 'var(--text-primary)';
                    item.style.background = isActive ? 'rgba(105, 253, 151, 0.1)' : 'transparent';
                    
                    // Update active indicator
                    const indicator = item.querySelector('.active-indicator');
                    if (indicator) {
                        indicator.style.display = isActive ? 'inline' : 'none';
                    }
                });
            });

            // Modal state updater
            this.updateFunctions.set('modalAccounts', (accountId) => {
                const modal = document.querySelector('.multi-account-modal');
                if (!modal) return;
                
                const accountItems = modal.querySelectorAll('[style*="cursor: pointer"]');
                accountItems.forEach(item => {
                    const accountName = item.querySelector('h4')?.textContent?.replace('(Active)', '').trim();
                    const accounts = window.MooshWallet.state.getAccounts();
                    const account = accounts.find(a => a.name === accountName);
                    
                    if (account) {
                        const isActive = account.id === accountId;
                        item.style.border = `1px solid ${isActive ? '#f57315' : '#333'}`;
                        item.style.background = isActive ? 'rgba(245, 115, 21, 0.1)' : 'transparent';
                        
                        // Update active label
                        const activeLabel = item.querySelector('.active-label, span[style*="f57315"]');
                        if (isActive && !activeLabel) {
                            const h4 = item.querySelector('h4');
                            if (h4 && !h4.textContent.includes('(Active)')) {
                                const span = document.createElement('span');
                                span.style.cssText = 'color: #f57315; margin-left: 10px; font-size: 12px;';
                                span.textContent = '(Active)';
                                span.className = 'active-label';
                                h4.appendChild(span);
                            }
                        } else if (!isActive && activeLabel) {
                            activeLabel.remove();
                        }
                    }
                });
            });
        }

        // Update all UI components
        updateAll(account, accountId) {
            this.updateFunctions.forEach((fn, key) => {
                if (key === 'dropdown' || key === 'modalAccounts') {
                    fn(accountId);
                } else {
                    fn(account);
                }
            });
        }

        // Update specific component
        update(component, data) {
            const fn = this.updateFunctions.get(component);
            if (fn) {
                fn(data);
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // FAST WALLET CREATION - Optimized for speed
    // ═══════════════════════════════════════════════════════════════════════
    async function optimizeWalletCreation() {
        if (!window.MooshWallet?.components?.MultiAccountModal) return;

        const MultiAccountModal = window.MooshWallet.components.MultiAccountModal;
        const originalHandleCreate = MultiAccountModal.prototype.handleCreateAccount;

        MultiAccountModal.prototype.handleCreateAccount = async function() {
            console.log('[ReactiveAccountSwitching] Fast wallet creation initiated');
            const startTime = performance.now();

            const nameInput = document.getElementById('newAccountName');
            if (!nameInput) {
                this.app.showNotification('Error: Name input not found', 'error');
                return;
            }

            const name = nameInput.value.trim();
            if (!name) {
                this.app.showNotification('Please enter an account name', 'error');
                return;
            }

            try {
                // Show immediate feedback
                this.app.showNotification('Creating wallet...', 'info');
                
                // Update UI immediately
                const createButton = this.modal.querySelector('button[onclick*="handleCreateAccount"]');
                if (createButton) {
                    createButton.disabled = true;
                    createButton.textContent = 'Creating...';
                }

                // Generate wallet in parallel with UI updates
                const [walletResponse] = await Promise.all([
                    this.app.apiService.generateSparkWallet(12),
                    // Preload UI components while generating
                    new Promise(resolve => requestAnimationFrame(resolve))
                ]);

                if (!walletResponse?.data?.mnemonic) {
                    throw new Error('Invalid wallet generation response');
                }

                // Create account
                const account = await this.app.state.createAccount(name, walletResponse.data.mnemonic, false);
                
                // Close modal instantly
                this.close();
                
                // Switch to new account immediately
                this.app.state.switchAccount(account.id);
                
                // Show success
                const creationTime = performance.now() - startTime;
                console.log(`[ReactiveAccountSwitching] Wallet created in ${creationTime.toFixed(2)}ms`);
                this.app.showNotification(`${name} created successfully!`, 'success');
                
            } catch (error) {
                console.error('[ReactiveAccountSwitching] Creation error:', error);
                this.app.showNotification('Failed to create account: ' + error.message, 'error');
                
                // Re-enable button
                const createButton = this.modal.querySelector('button[onclick*="handleCreateAccount"]');
                if (createButton) {
                    createButton.disabled = false;
                    createButton.textContent = 'Create Account';
                }
            }
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MODAL ENHANCEMENT - Instant account switching
    // ═══════════════════════════════════════════════════════════════════════
    async function enhanceModalSwitching() {
        const checkModal = setInterval(() => {
            const modal = document.querySelector('.multi-account-modal');
            if (modal) {
                clearInterval(checkModal);
                enhanceAccountItems(modal);
            }
        }, 100);

        // Stop checking after 5 seconds
        setTimeout(() => clearInterval(checkModal), 5000);
    }

    function enhanceAccountItems(modal) {
        const accountItems = modal.querySelectorAll('div[style*="cursor: pointer"][style*="padding: 15px"]');
        
        accountItems.forEach(item => {
            // Skip if already enhanced
            if (item.dataset.enhanced) return;
            
            item.dataset.enhanced = 'true';
            
            // Get account info
            const accountName = item.querySelector('h4')?.textContent?.replace('(Active)', '').trim();
            const accounts = window.MooshWallet.state.getAccounts();
            const account = accounts.find(a => a.name === accountName);
            
            if (!account) return;
            
            // Store account ID for quick access
            item.dataset.accountId = account.id;
            
            // Replace onclick with optimized version
            item.onclick = async (e) => {
                e.stopPropagation();
                
                const currentId = window.MooshWallet.state.get('currentAccountId');
                if (account.id === currentId) {
                    console.log('[ReactiveAccountSwitching] Account already active');
                    return;
                }
                
                // Instant visual feedback
                item.style.opacity = '0.7';
                item.style.transform = 'scale(0.98)';
                
                // Switch account
                const switched = window.MooshWallet.state.switchAccount(account.id);
                
                if (switched) {
                    // Close modal immediately
                    const modal = item.closest('.multi-account-modal');
                    if (modal) {
                        modal.style.opacity = '0';
                        setTimeout(() => modal.remove(), 200);
                    }
                    
                    window.MooshWallet.showNotification(`Switched to ${account.name}`, 'success');
                } else {
                    // Reset visual state
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                    window.MooshWallet.showNotification('Failed to switch account', 'error');
                }
            };
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    async function initialize() {
        try {
            // Setup reactive state
            const reactiveState = await enhanceWalletState();
            
            // Create UI updater
            const uiUpdater = new UIUpdater(reactiveState);
            
            // Subscribe to account changes
            reactiveState.subscribe('currentAccountId', (accountId) => {
                const account = window.MooshWallet.state.getCurrentAccount();
                console.log('[ReactiveAccountSwitching] UI update triggered for:', account?.name);
                uiUpdater.updateAll(account, accountId);
            }, { immediate: true, priority: 10 });
            
            // Optimize wallet creation
            await optimizeWalletCreation();
            
            // Monitor for modals
            document.addEventListener('click', (e) => {
                if (e.target.textContent?.includes('+ Accounts') || 
                    e.target.textContent?.includes('Accounts')) {
                    setTimeout(() => enhanceModalSwitching(), 100);
                }
            });
            
            // Expose API
            window.MooshReactive = {
                state: reactiveState,
                updater: uiUpdater,
                switchAccount: (nameOrId) => {
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
                        return window.MooshWallet.state.switchAccount(account.id);
                    }
                    
                    console.error('Account not found:', nameOrId);
                    return false;
                },
                getMetrics: () => reactiveState.performanceMetrics
            };
            
            console.log('[ReactiveAccountSwitching] ✅ System initialized successfully');
            console.log('[ReactiveAccountSwitching] Average switch time:', reactiveState.performanceMetrics.switchTime.toFixed(2) + 'ms');
            
        } catch (error) {
            console.error('[ReactiveAccountSwitching] Initialization error:', error);
        }
    }

    // Start initialization
    initialize();

})();