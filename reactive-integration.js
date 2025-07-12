// MOOSH WALLET - REACTIVE INTEGRATION
// This file integrates all reactive components and ensures proper account switching

(function() {
    'use strict';

    console.log('[ReactiveIntegration] Starting integration of reactive components...');

    // ═══════════════════════════════════════════════════════════════════════
    // INTEGRATION MANAGER
    // ═══════════════════════════════════════════════════════════════════════
    class ReactiveIntegration {
        constructor() {
            this.initialized = false;
            this.components = [];
            this.patches = [];
        }

        async initialize() {
            if (this.initialized) return;

            console.log('[ReactiveIntegration] Waiting for all components...');

            try {
                // Wait for all required components
                await this.waitForComponents();
                
                // Apply critical patches
                await this.applyCriticalPatches();
                
                // Setup reactive bindings
                await this.setupReactiveBindings();
                
                // Verify integration
                await this.verifyIntegration();
                
                this.initialized = true;
                console.log('[ReactiveIntegration] ✅ All components integrated successfully');
                
            } catch (error) {
                console.error('[ReactiveIntegration] Integration failed:', error);
            }
        }

        async waitForComponents() {
            const requiredComponents = [
                { name: 'MooshWallet', path: 'window.MooshWallet' },
                { name: 'StateManager', path: 'window.MooshWallet.state' },
                { name: 'Router', path: 'window.MooshWallet.router' },
                { name: 'ReactiveState', path: 'window.MooshReactive' },
                { name: 'DOMPatcher', path: 'window.MooshReactive.domPatcher' }
            ];

            for (const component of requiredComponents) {
                await this.waitForComponent(component);
            }
        }

        async waitForComponent(component) {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error(`Component ${component.name} not found after 10s`));
                }, 10000);

                const checkInterval = setInterval(() => {
                    const exists = this.getNestedProperty(window, component.path);
                    if (exists) {
                        clearInterval(checkInterval);
                        clearTimeout(timeout);
                        console.log(`[ReactiveIntegration] ✓ ${component.name} loaded`);
                        resolve();
                    }
                }, 50);
            });
        }

        getNestedProperty(obj, path) {
            return path.split('.').reduce((current, prop) => current?.[prop], obj);
        }

        async applyCriticalPatches() {
            console.log('[ReactiveIntegration] Applying critical patches...');

            // CRITICAL PATCH 1: Fix dashboard rendering
            this.patchDashboardRendering();

            // CRITICAL PATCH 2: Fix account modal switching
            this.patchAccountModal();

            // CRITICAL PATCH 3: Fix state persistence
            this.patchStatePersistence();
        }

        patchDashboardRendering() {
            const Dashboard = window.MooshWallet?.pages?.Dashboard;
            if (!Dashboard) return;

            const originalRender = Dashboard.prototype.render;
            Dashboard.prototype.render = function() {
                console.log('[ReactiveIntegration] Dashboard rendering with reactive updates');
                
                // Call original render
                const result = originalRender.call(this);
                
                // Apply reactive bindings to the rendered content
                setTimeout(() => {
                    this.applyReactiveBindings();
                }, 0);
                
                return result;
            };

            // Add reactive bindings method
            Dashboard.prototype.applyReactiveBindings = function() {
                const container = document.querySelector('.cursor-content');
                if (!container) return;

                // Find all elements that display account information
                const accountElements = container.querySelectorAll(
                    '#currentAccountIndicator, .account-indicator, [data-account-name], ' +
                    '#accountDropdownButton span:first-child'
                );

                accountElements.forEach(element => {
                    // Remove any existing bindings
                    if (element._reactiveUnwatch) {
                        element._reactiveUnwatch();
                    }

                    // Apply new binding
                    element._reactiveUnwatch = window.MooshReactive.state.watchState('currentAccount', (account) => {
                        if (account) {
                            if (element.id === 'currentAccountIndicator' || element.className?.includes('account-indicator')) {
                                element.textContent = `Active: ${account.name}`;
                            } else if (element.dataset.accountName !== undefined) {
                                element.textContent = account.name;
                            } else if (element.parentElement?.id === 'accountDropdownButton') {
                                element.textContent = `Account: ${account.name}`;
                            }
                        }
                    }, { immediate: true });
                });

                console.log(`[ReactiveIntegration] Applied reactive bindings to ${accountElements.length} elements`);
            };
        }

        patchAccountModal() {
            // Monitor for modal creation and enhance click handlers
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList?.contains('multi-account-modal')) {
                            this.enhanceModalAccountSwitching(node);
                        }
                    });
                });
            });

            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }

        enhanceModalAccountSwitching(modal) {
            const accountItems = modal.querySelectorAll('div[style*="cursor: pointer"][style*="padding: 15px"]');
            
            accountItems.forEach(item => {
                // Remove existing onclick
                item.onclick = null;
                
                // Add enhanced click handler
                item.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    
                    const accountName = item.querySelector('h4')?.textContent?.replace('(Active)', '').trim();
                    const accounts = window.MooshWallet.state.getAccounts();
                    const account = accounts.find(a => a.name === accountName);
                    
                    if (!account) return;
                    
                    const currentId = window.MooshWallet.state.get('currentAccountId');
                    if (account.id === currentId) return;
                    
                    console.log(`[ReactiveIntegration] Switching to account: ${account.name}`);
                    
                    // Visual feedback
                    item.style.transform = 'scale(0.98)';
                    item.style.opacity = '0.8';
                    
                    // Switch account
                    const switched = window.MooshWallet.state.switchAccount(account.id);
                    
                    if (switched) {
                        // Force dashboard refresh
                        if (window.MooshWallet.router.currentPage === 'dashboard') {
                            window.MooshWallet.router.navigate('dashboard', { refresh: true });
                        }
                        
                        // Close modal
                        modal.style.display = 'none';
                        setTimeout(() => modal.remove(), 0);
                        
                        window.MooshWallet.showNotification(`Switched to ${account.name}`, 'success');
                    }
                });
            });

            console.log(`[ReactiveIntegration] Enhanced ${accountItems.length} account items in modal`);
        }

        patchStatePersistence() {
            const state = window.MooshWallet.state;
            
            // Ensure state changes trigger reactive updates
            const originalSet = state.set;
            if (!originalSet._reactivePatched) {
                state.set = function(key, value) {
                    const oldValue = this.state[key];
                    const result = originalSet.call(this, key, value);
                    
                    // Special handling for currentAccountId
                    if (key === 'currentAccountId') {
                        const account = this.state.accounts.find(a => a.id === value);
                        if (account) {
                            // Also update currentAccount for watchers
                            window.MooshReactive?.state?.notifyWatchers('currentAccount', account, null);
                        }
                    }
                    
                    return result;
                };
                state.set._reactivePatched = true;
            }
        }

        async setupReactiveBindings() {
            console.log('[ReactiveIntegration] Setting up reactive bindings...');

            // Watch for account switches
            window.MooshReactive.state.watchState('currentAccountId', (newId, oldId) => {
                if (newId !== oldId) {
                    console.log('[ReactiveIntegration] Account switched, updating UI...');
                    
                    // Get the new account
                    const account = window.MooshWallet.state.getAccounts().find(a => a.id === newId);
                    if (account) {
                        // Notify all account watchers
                        window.MooshReactive.state.notifyWatchers('currentAccount', account, null);
                        
                        // Force update specific elements
                        this.forceUpdateAccountElements(account);
                    }
                }
            });

            // Setup global helper for easy testing
            window.testAccountSwitch = (accountName) => {
                const accounts = window.MooshWallet.state.getAccounts();
                const account = accounts.find(a => a.name.toLowerCase() === accountName.toLowerCase());
                
                if (!account) {
                    console.error(`Account "${accountName}" not found`);
                    console.log('Available accounts:', accounts.map(a => a.name).join(', '));
                    return false;
                }
                
                console.log(`[Test] Switching to ${account.name}...`);
                const result = window.MooshWallet.state.switchAccount(account.id);
                
                if (result) {
                    console.log(`[Test] ✓ Successfully switched to ${account.name}`);
                    
                    // Force refresh if on dashboard
                    if (window.MooshWallet.router.currentPage === 'dashboard') {
                        window.MooshWallet.router.navigate('dashboard', { refresh: true });
                    }
                }
                
                return result;
            };
        }

        forceUpdateAccountElements(account) {
            // Force update all account display elements
            const selectors = [
                '#currentAccountIndicator',
                '.account-indicator',
                '[data-account-name]',
                '#accountDropdownButton span:first-child'
            ];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (selector === '#currentAccountIndicator' || selector === '.account-indicator') {
                        element.textContent = `Active: ${account.name}`;
                    } else if (selector === '[data-account-name]') {
                        element.textContent = account.name;
                    } else if (selector === '#accountDropdownButton span:first-child') {
                        element.textContent = `Account: ${account.name}`;
                    }
                });
            });
        }

        async verifyIntegration() {
            console.log('[ReactiveIntegration] Verifying integration...');

            const checks = [
                {
                    name: 'Reactive State Manager',
                    test: () => typeof window.MooshReactive?.state?.watchState === 'function'
                },
                {
                    name: 'Enhanced Switch Account',
                    test: () => window.MooshWallet.state.switchAccount._reactivePatched !== undefined
                },
                {
                    name: 'DOM Patcher',
                    test: () => window.MooshReactive?.domPatcher !== undefined
                },
                {
                    name: 'Dashboard Reactive Bindings',
                    test: () => window.MooshWallet?.pages?.Dashboard?.prototype?.applyReactiveBindings !== undefined
                }
            ];

            let passed = 0;
            checks.forEach(check => {
                const result = check.test();
                if (result) {
                    console.log(`  ✓ ${check.name}`);
                    passed++;
                } else {
                    console.error(`  ✗ ${check.name}`);
                }
            });

            console.log(`[ReactiveIntegration] Verification: ${passed}/${checks.length} checks passed`);
            
            if (passed === checks.length) {
                console.log('[ReactiveIntegration] ✅ All systems operational');
                console.log('\nTest account switching with: testAccountSwitch("AccountName")');
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // AUTO-INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    const integration = new ReactiveIntegration();
    
    // Start integration when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => integration.initialize());
    } else {
        integration.initialize();
    }

    // Expose for debugging
    window.ReactiveIntegration = integration;

})();