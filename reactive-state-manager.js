// MOOSH WALLET - REACTIVE STATE MANAGER
// Following MASTER_PROMPT_NEEDED.md: Security-first, TDD, Modular Design

(function() {
    'use strict';

    console.log('[ReactiveStateManager] Initializing reactive state system...');

    // ═══════════════════════════════════════════════════════════════════════
    // ENHANCED STATE MANAGER WITH REACTIVE BINDINGS
    // ═══════════════════════════════════════════════════════════════════════
    class ReactiveStateManager {
        constructor() {
            this.observers = new WeakMap();
            this.stateWatchers = new Map();
            this.updateQueue = [];
            this.isProcessing = false;
            this.transactions = new Map();
            
            // Performance tracking
            this.metrics = {
                updates: 0,
                avgUpdateTime: 0,
                lastUpdate: Date.now()
            };
        }

        // Enhanced state watching with automatic UI updates
        watchState(key, callback, options = {}) {
            const watcher = {
                callback,
                immediate: options.immediate || false,
                deep: options.deep || false,
                throttle: options.throttle || 0,
                lastCall: 0
            };

            if (!this.stateWatchers.has(key)) {
                this.stateWatchers.set(key, new Set());
            }
            
            this.stateWatchers.get(key).add(watcher);

            // Immediate execution if requested
            if (watcher.immediate && window.MooshWallet?.state) {
                const currentValue = window.MooshWallet.state.get(key);
                if (currentValue !== undefined) {
                    this.executeWatcher(watcher, currentValue, undefined);
                }
            }

            // Return unwatch function
            return () => {
                const watchers = this.stateWatchers.get(key);
                if (watchers) {
                    watchers.delete(watcher);
                }
            };
        }

        // Execute watcher with throttling
        executeWatcher(watcher, newValue, oldValue) {
            const now = Date.now();
            
            if (watcher.throttle > 0) {
                if (now - watcher.lastCall < watcher.throttle) {
                    return;
                }
                watcher.lastCall = now;
            }

            // Use requestAnimationFrame for smooth updates
            requestAnimationFrame(() => {
                try {
                    watcher.callback(newValue, oldValue);
                } catch (error) {
                    console.error('[ReactiveStateManager] Watcher error:', error);
                }
            });
        }

        // Notify all watchers for a key
        notifyWatchers(key, newValue, oldValue) {
            const watchers = this.stateWatchers.get(key);
            if (!watchers || watchers.size === 0) return;

            watchers.forEach(watcher => {
                this.executeWatcher(watcher, newValue, oldValue);
            });
        }

        // Transaction support for atomic updates
        beginTransaction() {
            const transactionId = this.generateSecureId();
            this.transactions.set(transactionId, new Map());
            return transactionId;
        }

        commitTransaction(transactionId) {
            const transaction = this.transactions.get(transactionId);
            if (!transaction) return false;

            const startTime = performance.now();
            
            // Apply all updates atomically
            transaction.forEach((value, key) => {
                const oldValue = window.MooshWallet.state.get(key);
                window.MooshWallet.state.state[key] = value;
                this.notifyWatchers(key, value, oldValue);
            });

            // Update metrics
            const updateTime = performance.now() - startTime;
            this.updateMetrics(updateTime);

            this.transactions.delete(transactionId);
            return true;
        }

        // Update performance metrics
        updateMetrics(updateTime) {
            this.metrics.updates++;
            this.metrics.avgUpdateTime = 
                (this.metrics.avgUpdateTime * (this.metrics.updates - 1) + updateTime) / 
                this.metrics.updates;
            this.metrics.lastUpdate = Date.now();
        }

        // Secure ID generation (constant-time)
        generateSecureId() {
            const array = new Uint8Array(16);
            crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // REACTIVE COMPONENT BASE CLASS
    // ═══════════════════════════════════════════════════════════════════════
    class ReactiveComponent {
        constructor(app) {
            this.app = app;
            this.element = null;
            this.subscriptions = [];
            this.updateQueue = new Set();
            this.isUpdating = false;
        }

        // Bind component to state changes
        bindToState(stateKey, updateMethod) {
            const unwatch = reactiveState.watchState(stateKey, (newValue, oldValue) => {
                this.queueUpdate(updateMethod, newValue, oldValue);
            });

            this.subscriptions.push(unwatch);
        }

        // Queue updates for batch processing
        queueUpdate(updateMethod, ...args) {
            this.updateQueue.add({ method: updateMethod, args });
            
            if (!this.isUpdating) {
                this.isUpdating = true;
                requestAnimationFrame(() => this.processUpdates());
            }
        }

        // Process all queued updates
        processUpdates() {
            const updates = Array.from(this.updateQueue);
            this.updateQueue.clear();
            
            updates.forEach(({ method, args }) => {
                if (typeof this[method] === 'function') {
                    this[method].apply(this, args);
                }
            });
            
            this.isUpdating = false;
        }

        // Cleanup subscriptions
        destroy() {
            this.subscriptions.forEach(unsubscribe => unsubscribe());
            this.subscriptions = [];
            this.updateQueue.clear();
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // DOM PATCHER FOR INSTANT UPDATES
    // ═══════════════════════════════════════════════════════════════════════
    class DOMPatcher {
        constructor() {
            this.patches = new Map();
            this.observer = null;
            this.setupObserver();
        }

        // Setup MutationObserver for new elements
        setupObserver() {
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            this.applyPatchesToElement(node);
                        }
                    });
                });
            });

            // Start observing when ready
            if (document.body) {
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }

        // Register a patch function for specific selectors
        registerPatch(selector, patchFn) {
            if (!this.patches.has(selector)) {
                this.patches.set(selector, new Set());
            }
            this.patches.get(selector).add(patchFn);
        }

        // Apply patches to element and its children
        applyPatchesToElement(element) {
            this.patches.forEach((patchFns, selector) => {
                const matches = element.matches(selector);
                const children = element.querySelectorAll(selector);
                
                if (matches) {
                    patchFns.forEach(fn => fn(element));
                }
                
                children.forEach(child => {
                    patchFns.forEach(fn => fn(child));
                });
            });
        }

        // Patch all existing elements
        patchAll() {
            this.patches.forEach((patchFns, selector) => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    patchFns.forEach(fn => fn(element));
                });
            });
        }

        // Destroy observer
        destroy() {
            if (this.observer) {
                this.observer.disconnect();
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ENHANCED WALLET STATE INTEGRATION
    // ═══════════════════════════════════════════════════════════════════════
    async function enhanceWalletState() {
        // Wait for wallet initialization
        await new Promise(resolve => {
            const check = setInterval(() => {
                if (window.MooshWallet?.state) {
                    clearInterval(check);
                    resolve();
                }
            }, 10);
        });

        const state = window.MooshWallet.state;
        const domPatcher = new DOMPatcher();

        // Override the original set method to trigger watchers
        const originalSet = state.set.bind(state);
        state.set = function(key, value) {
            const oldValue = this.state[key];
            originalSet(key, value);
            
            // Notify reactive state watchers
            reactiveState.notifyWatchers(key, value, oldValue);
        };

        // Enhanced switchAccount with immediate UI updates
        const originalSwitchAccount = state.switchAccount.bind(state);
        state.switchAccount = function(accountId) {
            console.log('[ReactiveStateManager] Enhanced switchAccount:', accountId);
            
            const account = this.state.accounts.find(a => a.id === accountId);
            if (!account) {
                console.error('[ReactiveStateManager] Account not found:', accountId);
                return false;
            }

            // Begin transaction for atomic updates
            const txId = reactiveState.beginTransaction();
            
            // Update state
            const oldAccountId = this.state.currentAccountId;
            this.state.currentAccountId = accountId;
            account.lastUsed = Date.now();
            
            // Notify watchers immediately
            reactiveState.notifyWatchers('currentAccountId', accountId, oldAccountId);
            reactiveState.notifyWatchers('currentAccount', account, null);
            
            // Persist in background
            requestIdleCallback(() => {
                this.persistAccounts();
            });
            
            // Emit event
            this.emit('accountSwitched', account);
            
            // Commit transaction
            reactiveState.commitTransaction(txId);
            
            console.log('[ReactiveStateManager] Account switched successfully');
            return true;
        };

        // Setup DOM patches for account elements
        setupDOMPatches(domPatcher);

        return { reactiveState, domPatcher };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // DOM PATCHES FOR INSTANT UPDATES
    // ═══════════════════════════════════════════════════════════════════════
    function setupDOMPatches(domPatcher) {
        // Patch account name displays
        domPatcher.registerPatch('#currentAccountIndicator, .account-indicator, [data-account-name]', (element) => {
            reactiveState.watchState('currentAccount', (account) => {
                if (account) {
                    const text = element.textContent || '';
                    if (text.includes('Account:') || text.includes('Active:')) {
                        element.textContent = element.textContent.replace(/(?:Account:|Active:)\s*[^,\s]+/, `${text.includes('Account:') ? 'Account:' : 'Active:'} ${account.name}`);
                    } else if (element.dataset.accountName !== undefined) {
                        element.textContent = account.name;
                    }
                }
            }, { immediate: true });
        });

        // Patch balance displays
        domPatcher.registerPatch('[data-balance], .balance-display, #btcBalance', (element) => {
            reactiveState.watchState('currentAccount', (account) => {
                if (account) {
                    const balance = account.balances?.bitcoin || 0;
                    element.textContent = `${(balance / 100000000).toFixed(8)} BTC`;
                }
            }, { immediate: true, throttle: 100 });
        });

        // Patch address displays
        domPatcher.registerPatch('[data-address], .address-display', (element) => {
            reactiveState.watchState('currentAccount', (account) => {
                if (account?.addresses) {
                    const type = element.dataset.addressType || 'bitcoin';
                    element.textContent = account.addresses[type] || 'Loading...';
                }
            }, { immediate: true });
        });

        // Patch dropdown buttons
        domPatcher.registerPatch('#accountDropdownButton', (element) => {
            reactiveState.watchState('currentAccount', (account) => {
                if (account) {
                    const span = element.querySelector('span:first-child');
                    if (span) {
                        span.textContent = `Account: ${account.name}`;
                    }
                }
            }, { immediate: true });
        });

        // Apply patches to existing elements
        domPatcher.patchAll();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ROUTER ENHANCEMENT FOR FORCE REFRESH
    // ═══════════════════════════════════════════════════════════════════════
    function enhanceRouter() {
        if (!window.MooshWallet?.router) return;

        const router = window.MooshWallet.router;
        
        // Add refresh method
        router.refresh = function() {
            const currentPage = this.currentPage;
            const content = document.querySelector('.cursor-content');
            
            if (content && currentPage) {
                // Store scroll position
                const scrollY = window.scrollY;
                
                // Clear and re-render
                content.innerHTML = '';
                
                // Force re-render
                setTimeout(() => {
                    this.render();
                    window.scrollTo(0, scrollY);
                }, 0);
            }
        };

        // Enhanced navigate with force option
        const originalNavigate = router.navigate.bind(router);
        router.navigate = function(pageId, options = {}) {
            if (options.force || (pageId === this.currentPage && options.refresh)) {
                this.refresh();
            } else {
                originalNavigate(pageId);
            }
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    const reactiveState = new ReactiveStateManager();
    
    async function initialize() {
        try {
            console.log('[ReactiveStateManager] Starting initialization...');
            
            // Enhance wallet state
            const { domPatcher } = await enhanceWalletState();
            
            // Enhance router
            enhanceRouter();
            
            // Watch for account switches to refresh dashboard
            reactiveState.watchState('currentAccountId', (newId, oldId) => {
                if (newId !== oldId && window.MooshWallet.router.currentPage === 'dashboard') {
                    console.log('[ReactiveStateManager] Account changed, refreshing dashboard...');
                    window.MooshWallet.router.navigate('dashboard', { refresh: true });
                }
            });
            
            // Expose global API
            window.MooshReactive = {
                state: reactiveState,
                domPatcher,
                ReactiveComponent,
                metrics: () => reactiveState.metrics,
                switchAccount: (nameOrId) => {
                    const accounts = window.MooshWallet.state.getAccounts();
                    let account;
                    
                    if (typeof nameOrId === 'number') {
                        account = accounts[nameOrId];
                    } else {
                        account = accounts.find(a => 
                            a.id === nameOrId || 
                            a.name.toLowerCase() === nameOrId.toLowerCase()
                        );
                    }
                    
                    if (account) {
                        return window.MooshWallet.state.switchAccount(account.id);
                    }
                    return false;
                }
            };
            
            console.log('[ReactiveStateManager] ✅ Initialization complete');
            
        } catch (error) {
            console.error('[ReactiveStateManager] Initialization error:', error);
        }
    }
    
    // Start initialization
    initialize();

})();