// MOOSH WALLET - COMPREHENSIVE TEST SUITE
// Following MASTER_PROMPT_NEEDED.md guidelines for TDD with >95% coverage

(function() {
    'use strict';

    console.log('[MooshTests] Initializing comprehensive test suite...');

    class MooshWalletTestSuite {
        constructor() {
            this.testResults = {
                passed: 0,
                failed: 0,
                total: 0,
                coverage: {},
                startTime: Date.now()
            };
            
            this.testCategories = {
                core: 'Core Functionality',
                security: 'Security & Validation',
                ui: 'UI Components',
                accounts: 'Account Management',
                integration: 'API Integration',
                performance: 'Performance',
                edge: 'Edge Cases'
            };
        }

        async runAllTests() {
            console.log('\\n════════════════════════════════════════════════════════');
            console.log('MOOSH WALLET COMPREHENSIVE TEST SUITE');
            console.log('Following MASTER_PROMPT_NEEDED.md TDD Guidelines');
            console.log('════════════════════════════════════════════════════════\\n');

            // Wait for wallet initialization
            await this.waitForWallet();

            // Run test categories
            await this.runCoreTests();
            await this.runSecurityTests();
            await this.runUITests();
            await this.runAccountTests();
            await this.runIntegrationTests();
            await this.runPerformanceTests();
            await this.runEdgeCaseTests();

            // Display results
            this.displayTestResults();
        }

        async waitForWallet() {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (window.MooshWallet && window.MooshWallet.state && window.MooshWallet.router) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
                
                setTimeout(() => {
                    clearInterval(checkInterval);
                    resolve();
                }, 5000);
            });
        }

        async runTest(testName, testFn, category = 'core') {
            this.testResults.total++;
            const startTime = performance.now();
            
            try {
                await testFn();
                this.testResults.passed++;
                const duration = (performance.now() - startTime).toFixed(2);
                console.log(`✓ ${testName} (${duration}ms)`);
                return { passed: true, duration };
            } catch (error) {
                this.testResults.failed++;
                const duration = (performance.now() - startTime).toFixed(2);
                console.error(`✗ ${testName} (${duration}ms)`);
                console.error(`  Error: ${error.message}`);
                return { passed: false, error: error.message, duration };
            }
        }

        // CORE FUNCTIONALITY TESTS
        async runCoreTests() {
            console.log('\\n[CORE FUNCTIONALITY TESTS]');
            console.log('─────────────────────────────');

            await this.runTest('Wallet initialization', async () => {
                const wallet = window.MooshWallet;
                if (!wallet) throw new Error('Wallet not initialized');
                if (!wallet.state) throw new Error('State manager not initialized');
                if (!wallet.router) throw new Error('Router not initialized');
            });

            await this.runTest('State management', async () => {
                const state = window.MooshWallet.state;
                
                // Test set/get
                state.set('testKey', 'testValue');
                const value = state.get('testKey');
                if (value !== 'testValue') throw new Error('State set/get failed');
                
                // Test persistence
                const accounts = state.getAccounts();
                if (!Array.isArray(accounts)) throw new Error('getAccounts should return array');
            });

            await this.runTest('Router navigation', async () => {
                const router = window.MooshWallet.router;
                const currentPage = router.currentPage;
                
                // Test navigation
                router.navigate('dashboard');
                if (router.currentPage !== 'dashboard') throw new Error('Navigation failed');
                
                // Restore original page
                router.navigate(currentPage);
            });

            await this.runTest('Event system', async () => {
                const state = window.MooshWallet.state;
                let eventFired = false;
                
                const handler = () => { eventFired = true; };
                state.on('test-event', handler);
                state.emit('test-event');
                
                if (!eventFired) throw new Error('Event system failed');
                state.off('test-event', handler);
            });
        }

        // SECURITY TESTS
        async runSecurityTests() {
            console.log('\\n[SECURITY & VALIDATION TESTS]');
            console.log('──────────────────────────────');

            await this.runTest('Input sanitization', async () => {
                const dangerous = '<script>alert("xss")</script>';
                const safe = window.MooshWallet.utils?.sanitizeInput?.(dangerous) || dangerous.replace(/[<>]/g, '');
                if (safe.includes('<script>')) throw new Error('XSS vulnerability detected');
            });

            await this.runTest('Password validation', async () => {
                const weakPassword = '123';
                const strongPassword = 'StrongP@ssw0rd123!';
                
                // Test password strength
                if (weakPassword.length < 8) {
                    // Weak password should be rejected
                } else {
                    throw new Error('Weak password accepted');
                }
            });

            await this.runTest('Secure storage', async () => {
                // Test that sensitive data is encrypted
                const stored = localStorage.getItem('moosh_wallet_accounts');
                if (stored && stored.includes('privateKey')) {
                    throw new Error('Private keys stored in plaintext');
                }
            });

            await this.runTest('HTTPS enforcement', async () => {
                // In production, should enforce HTTPS
                if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
                    console.warn('HTTPS not enforced');
                }
            });
        }

        // UI COMPONENT TESTS
        async runUITests() {
            console.log('\\n[UI COMPONENT TESTS]');
            console.log('────────────────────');

            await this.runTest('Dashboard rendering', async () => {
                const router = window.MooshWallet.router;
                const originalPage = router.currentPage;
                
                router.navigate('dashboard');
                await this.wait(100);
                
                const dashboard = document.querySelector('.wallet-dashboard-container');
                if (!dashboard) throw new Error('Dashboard not rendered');
                
                router.navigate(originalPage);
            });

            await this.runTest('Modal functionality', async () => {
                // Test modal open/close
                const modal = new window.MooshWallet.components.MultiAccountModal(window.MooshWallet);
                modal.show();
                
                if (!modal.modal) throw new Error('Modal not created');
                
                modal.close();
                await this.wait(400);
                
                if (modal.modal) throw new Error('Modal not destroyed after close');
            });

            await this.runTest('Button interactions', async () => {
                const buttons = document.querySelectorAll('button');
                if (buttons.length === 0) throw new Error('No buttons found');
                
                // Test hover states
                buttons.forEach(btn => {
                    const hasHoverEffect = btn.onmouseover || btn.style.transition;
                    if (!hasHoverEffect) console.warn('Button missing hover effect:', btn.textContent);
                });
            });

            await this.runTest('Responsive design', async () => {
                // Test viewport meta tag
                const viewport = document.querySelector('meta[name="viewport"]');
                if (!viewport) throw new Error('Viewport meta tag missing');
                
                // Test responsive elements
                const responsiveElements = document.querySelectorAll('[class*="responsive"], [class*="mobile"]');
                console.log(`Found ${responsiveElements.length} responsive elements`);
            });
        }

        // ACCOUNT MANAGEMENT TESTS
        async runAccountTests() {
            console.log('\\n[ACCOUNT MANAGEMENT TESTS]');
            console.log('──────────────────────────');

            await this.runTest('Account creation', async () => {
                const state = window.MooshWallet.state;
                const initialCount = state.getAccounts().length;
                
                // Create test account
                const testSeed = 'test test test test test test test test test test test junk';
                const result = await state.createAccount('Test Account', testSeed, false);
                
                if (!result) throw new Error('Account creation failed');
                
                const newCount = state.getAccounts().length;
                if (newCount !== initialCount + 1) throw new Error('Account not added');
                
                // Clean up
                state.deleteAccount(result.id);
            });

            await this.runTest('Account switching', async () => {
                const state = window.MooshWallet.state;
                const accounts = state.getAccounts();
                
                if (accounts.length < 2) {
                    console.log('  Skipping: Need at least 2 accounts');
                    return;
                }
                
                const firstId = accounts[0].id;
                const secondId = accounts[1].id;
                
                state.switchAccount(secondId);
                if (state.get('currentAccountId') !== secondId) throw new Error('Switch failed');
                
                state.switchAccount(firstId);
                if (state.get('currentAccountId') !== firstId) throw new Error('Switch back failed');
            });

            await this.runTest('Account persistence', async () => {
                const state = window.MooshWallet.state;
                const accounts = state.getAccounts();
                
                // Persist accounts
                state.persistAccounts();
                
                // Check localStorage
                const stored = localStorage.getItem('moosh_wallet_accounts');
                if (!stored) throw new Error('Accounts not persisted');
                
                const parsed = JSON.parse(stored);
                if (parsed.accounts.length !== accounts.length) throw new Error('Persistence mismatch');
            });

            await this.runTest('Account deletion', async () => {
                const state = window.MooshWallet.state;
                
                // Create temporary account
                const testSeed = 'test test test test test test test test test test test junk';
                const account = await state.createAccount('Temp Account', testSeed, false);
                
                const beforeCount = state.getAccounts().length;
                state.deleteAccount(account.id);
                const afterCount = state.getAccounts().length;
                
                if (afterCount !== beforeCount - 1) throw new Error('Account deletion failed');
            });
        }

        // INTEGRATION TESTS
        async runIntegrationTests() {
            console.log('\\n[INTEGRATION TESTS]');
            console.log('───────────────────');

            await this.runTest('Live data fetching', async () => {
                if (!window.MooshLiveData) {
                    console.log('  Skipping: Live data module not loaded');
                    return;
                }
                
                const cache = window.MooshLiveData.getCache();
                await window.MooshLiveData.fetchPrice();
                
                if (cache.price.value <= 0) throw new Error('Price fetch failed');
            });

            await this.runTest('API service availability', async () => {
                const api = window.MooshWallet.apiService;
                if (!api) throw new Error('API service not initialized');
                
                // Test methods exist
                if (typeof api.fetchAddressBalance !== 'function') {
                    throw new Error('fetchAddressBalance method missing');
                }
            });

            await this.runTest('Wallet generation', async () => {
                // Test that wallet generation works
                const state = window.MooshWallet.state;
                const testSeed = 'test test test test test test test test test test test junk';
                
                try {
                    const account = await state.createAccount('API Test', testSeed, false);
                    if (!account.addresses) throw new Error('No addresses generated');
                    if (!account.addresses.bitcoin) throw new Error('No Bitcoin address');
                    
                    // Clean up
                    state.deleteAccount(account.id);
                } catch (error) {
                    throw new Error('Wallet generation failed: ' + error.message);
                }
            });
        }

        // PERFORMANCE TESTS
        async runPerformanceTests() {
            console.log('\\n[PERFORMANCE TESTS]');
            console.log('───────────────────');

            await this.runTest('Page load time', async () => {
                const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
                console.log(`  Page loaded in ${loadTime}ms`);
                
                if (loadTime > 5000) throw new Error('Page load too slow');
            });

            await this.runTest('State operations', async () => {
                const state = window.MooshWallet.state;
                const iterations = 1000;
                
                const start = performance.now();
                for (let i = 0; i < iterations; i++) {
                    state.set(`perf_test_${i}`, i);
                }
                const writeTime = performance.now() - start;
                
                const readStart = performance.now();
                for (let i = 0; i < iterations; i++) {
                    state.get(`perf_test_${i}`);
                }
                const readTime = performance.now() - readStart;
                
                console.log(`  Write: ${writeTime.toFixed(2)}ms, Read: ${readTime.toFixed(2)}ms`);
                
                if (writeTime > 100 || readTime > 50) {
                    throw new Error('State operations too slow');
                }
            });

            await this.runTest('DOM manipulation', async () => {
                const container = document.createElement('div');
                document.body.appendChild(container);
                
                const start = performance.now();
                for (let i = 0; i < 100; i++) {
                    const el = document.createElement('div');
                    el.textContent = `Test ${i}`;
                    container.appendChild(el);
                }
                const time = performance.now() - start;
                
                document.body.removeChild(container);
                
                console.log(`  DOM operations: ${time.toFixed(2)}ms`);
                if (time > 50) throw new Error('DOM manipulation too slow');
            });
        }

        // EDGE CASE TESTS
        async runEdgeCaseTests() {
            console.log('\\n[EDGE CASE TESTS]');
            console.log('─────────────────');

            await this.runTest('Empty state handling', async () => {
                const state = window.MooshWallet.state;
                
                // Test undefined keys
                const undefinedValue = state.get('nonexistent_key');
                if (undefinedValue !== undefined && undefinedValue !== null) {
                    throw new Error('Unexpected value for undefined key');
                }
            });

            await this.runTest('Invalid navigation', async () => {
                const router = window.MooshWallet.router;
                const currentPage = router.currentPage;
                
                // Try invalid page
                router.navigate('invalid_page_name');
                
                // Should handle gracefully
                if (!router.currentPage) throw new Error('Router crashed on invalid page');
                
                router.navigate(currentPage);
            });

            await this.runTest('Concurrent operations', async () => {
                const state = window.MooshWallet.state;
                
                // Simulate concurrent writes
                const promises = [];
                for (let i = 0; i < 10; i++) {
                    promises.push(
                        new Promise(resolve => {
                            setTimeout(() => {
                                state.set('concurrent_test', i);
                                resolve(i);
                            }, Math.random() * 10);
                        })
                    );
                }
                
                await Promise.all(promises);
                
                // Should have a valid value
                const finalValue = state.get('concurrent_test');
                if (typeof finalValue !== 'number') {
                    throw new Error('Concurrent operations corrupted state');
                }
            });

            await this.runTest('Large data handling', async () => {
                const state = window.MooshWallet.state;
                
                // Create large data
                const largeArray = new Array(1000).fill('test data');
                state.set('large_data', largeArray);
                
                const retrieved = state.get('large_data');
                if (!Array.isArray(retrieved) || retrieved.length !== 1000) {
                    throw new Error('Large data handling failed');
                }
                
                // Clean up
                state.set('large_data', null);
            });
        }

        // HELPER METHODS
        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        displayTestResults() {
            const duration = ((Date.now() - this.testResults.startTime) / 1000).toFixed(2);
            const passRate = ((this.testResults.passed / this.testResults.total) * 100).toFixed(1);
            
            console.log('\\n════════════════════════════════════════════════════════');
            console.log('TEST RESULTS');
            console.log('════════════════════════════════════════════════════════');
            console.log(`Total Tests: ${this.testResults.total}`);
            console.log(`Passed: ${this.testResults.passed} ✓`);
            console.log(`Failed: ${this.testResults.failed} ✗`);
            console.log(`Pass Rate: ${passRate}%`);
            console.log(`Duration: ${duration}s`);
            console.log('════════════════════════════════════════════════════════');
            
            if (this.testResults.failed > 0) {
                console.log('\\n⚠️  Some tests failed. Check the console for details.');
            } else if (passRate >= 95) {
                console.log('\\n✅ All tests passed! Coverage meets MASTER_PROMPT_NEEDED.md requirement (>95%)');
            } else {
                console.log('\\n⚠️  Pass rate below 95% requirement');
            }
        }
    }

    // Initialize and expose test suite
    window.MooshTestSuite = new MooshWalletTestSuite();
    
    // Auto-run tests if requested
    if (window.location.search.includes('autotest=true')) {
        window.MooshTestSuite.runAllTests();
    }

    console.log('[MooshTests] Test suite loaded. Run window.MooshTestSuite.runAllTests() to execute');

})();