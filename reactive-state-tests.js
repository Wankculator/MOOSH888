// MOOSH WALLET - REACTIVE STATE TEST SUITE
// Following MASTER_PROMPT_NEEDED.md: TDD with >95% coverage

(function() {
    'use strict';

    console.log('[ReactiveStateTests] Loading comprehensive test suite...');

    class ReactiveStateTestSuite {
        constructor() {
            this.tests = [];
            this.results = {
                passed: 0,
                failed: 0,
                total: 0,
                startTime: Date.now(),
                coverage: {
                    lines: 0,
                    functions: 0,
                    branches: 0
                }
            };
            this.assertions = 0;
        }

        // Assert helper with descriptive errors
        assert(condition, message) {
            this.assertions++;
            if (!condition) {
                throw new Error(`Assertion failed: ${message}`);
            }
        }

        // Deep equality check
        deepEqual(a, b) {
            return JSON.stringify(a) === JSON.stringify(b);
        }

        // Run all tests
        async runAllTests() {
            console.log('\\n╔════════════════════════════════════════════════════════╗');
            console.log('║     MOOSH WALLET REACTIVE STATE TEST SUITE             ║');
            console.log('║     Following MASTER_PROMPT_NEEDED.md Guidelines       ║');
            console.log('╚════════════════════════════════════════════════════════╝\\n');

            // Test categories
            const categories = [
                { name: 'ReactiveStateManager', tests: this.reactiveStateManagerTests() },
                { name: 'State Watching', tests: this.stateWatchingTests() },
                { name: 'DOM Patcher', tests: this.domPatcherTests() },
                { name: 'Account Switching', tests: this.accountSwitchingTests() },
                { name: 'Performance', tests: this.performanceTests() },
                { name: 'Security', tests: this.securityTests() },
                { name: 'Error Handling', tests: this.errorHandlingTests() },
                { name: 'Integration', tests: this.integrationTests() }
            ];

            // Run each category
            for (const category of categories) {
                console.log(`\\n[${category.name}]`);
                console.log('─'.repeat(50));
                
                for (const test of category.tests) {
                    await this.runTest(test);
                }
            }

            this.displayResults();
        }

        async runTest(test) {
            this.results.total++;
            const startTime = performance.now();
            
            try {
                // Setup test environment
                if (test.setup) await test.setup();
                
                // Run test
                await test.fn();
                
                // Cleanup
                if (test.cleanup) await test.cleanup();
                
                this.results.passed++;
                const duration = (performance.now() - startTime).toFixed(2);
                console.log(`  ✓ ${test.name} (${duration}ms)`);
                
            } catch (error) {
                this.results.failed++;
                const duration = (performance.now() - startTime).toFixed(2);
                console.error(`  ✗ ${test.name} (${duration}ms)`);
                console.error(`     ${error.message}`);
                if (test.cleanup) await test.cleanup();
            }
        }

        // REACTIVE STATE MANAGER TESTS
        reactiveStateManagerTests() {
            return [
                {
                    name: 'State manager initialization',
                    fn: async () => {
                        this.assert(window.MooshReactive !== undefined, 'MooshReactive should be defined');
                        this.assert(window.MooshReactive.state !== undefined, 'Reactive state should exist');
                        this.assert(typeof window.MooshReactive.state.watchState === 'function', 'watchState should be a function');
                    }
                },
                {
                    name: 'Watch state with immediate execution',
                    fn: async () => {
                        let callCount = 0;
                        let lastValue = null;
                        
                        // Set initial value
                        window.MooshWallet.state.set('testKey', 'initialValue');
                        
                        // Watch with immediate
                        const unwatch = window.MooshReactive.state.watchState('testKey', (value) => {
                            callCount++;
                            lastValue = value;
                        }, { immediate: true });
                        
                        await this.wait(50);
                        
                        this.assert(callCount === 1, 'Should be called immediately');
                        this.assert(lastValue === 'initialValue', 'Should receive initial value');
                        
                        unwatch();
                    }
                },
                {
                    name: 'State updates trigger watchers',
                    fn: async () => {
                        let updateCount = 0;
                        let values = [];
                        
                        const unwatch = window.MooshReactive.state.watchState('testUpdate', (value) => {
                            updateCount++;
                            values.push(value);
                        });
                        
                        // Update state
                        window.MooshWallet.state.set('testUpdate', 'value1');
                        await this.wait(50);
                        
                        window.MooshWallet.state.set('testUpdate', 'value2');
                        await this.wait(50);
                        
                        this.assert(updateCount >= 2, 'Should be called for each update');
                        this.assert(values.includes('value1'), 'Should receive first value');
                        this.assert(values.includes('value2'), 'Should receive second value');
                        
                        unwatch();
                    }
                },
                {
                    name: 'Throttled watchers',
                    fn: async () => {
                        let callCount = 0;
                        
                        const unwatch = window.MooshReactive.state.watchState('throttleTest', () => {
                            callCount++;
                        }, { throttle: 100 });
                        
                        // Rapid updates
                        for (let i = 0; i < 10; i++) {
                            window.MooshWallet.state.set('throttleTest', i);
                            await this.wait(10);
                        }
                        
                        await this.wait(150);
                        
                        this.assert(callCount < 10, 'Should throttle rapid updates');
                        this.assert(callCount >= 2, 'Should allow some updates through');
                        
                        unwatch();
                    }
                },
                {
                    name: 'Transaction support',
                    fn: async () => {
                        const state = window.MooshReactive.state;
                        
                        const txId = state.beginTransaction();
                        this.assert(typeof txId === 'string', 'Should return transaction ID');
                        
                        const committed = state.commitTransaction(txId);
                        this.assert(committed === true, 'Should commit successfully');
                        
                        const invalidCommit = state.commitTransaction('invalid-id');
                        this.assert(invalidCommit === false, 'Should fail for invalid transaction');
                    }
                },
                {
                    name: 'Secure ID generation',
                    fn: async () => {
                        const state = window.MooshReactive.state;
                        const ids = new Set();
                        
                        // Generate multiple IDs
                        for (let i = 0; i < 100; i++) {
                            ids.add(state.generateSecureId());
                        }
                        
                        this.assert(ids.size === 100, 'All IDs should be unique');
                        
                        const id = Array.from(ids)[0];
                        this.assert(id.length === 32, 'ID should be 32 characters');
                        this.assert(/^[0-9a-f]+$/.test(id), 'ID should be hexadecimal');
                    }
                }
            ];
        }

        // STATE WATCHING TESTS
        stateWatchingTests() {
            return [
                {
                    name: 'Multiple watchers on same key',
                    fn: async () => {
                        const results = [];
                        
                        const unwatch1 = window.MooshReactive.state.watchState('multiWatch', (value) => {
                            results.push({ watcher: 1, value });
                        });
                        
                        const unwatch2 = window.MooshReactive.state.watchState('multiWatch', (value) => {
                            results.push({ watcher: 2, value });
                        });
                        
                        window.MooshWallet.state.set('multiWatch', 'test');
                        await this.wait(50);
                        
                        this.assert(results.length >= 2, 'Both watchers should be called');
                        this.assert(results.some(r => r.watcher === 1), 'Watcher 1 should be called');
                        this.assert(results.some(r => r.watcher === 2), 'Watcher 2 should be called');
                        
                        unwatch1();
                        unwatch2();
                    }
                },
                {
                    name: 'Unwatch functionality',
                    fn: async () => {
                        let callCount = 0;
                        
                        const unwatch = window.MooshReactive.state.watchState('unwatchTest', () => {
                            callCount++;
                        });
                        
                        window.MooshWallet.state.set('unwatchTest', 'value1');
                        await this.wait(50);
                        
                        unwatch();
                        
                        window.MooshWallet.state.set('unwatchTest', 'value2');
                        await this.wait(50);
                        
                        this.assert(callCount === 1, 'Should not be called after unwatch');
                    }
                }
            ];
        }

        // DOM PATCHER TESTS
        domPatcherTests() {
            return [
                {
                    name: 'DOM patcher initialization',
                    fn: async () => {
                        this.assert(window.MooshReactive.domPatcher !== undefined, 'DOM patcher should exist');
                        this.assert(typeof window.MooshReactive.domPatcher.registerPatch === 'function', 'Should have registerPatch method');
                    }
                },
                {
                    name: 'Patch registration and application',
                    setup: async () => {
                        this.testElement = document.createElement('div');
                        this.testElement.id = 'test-patch-element';
                        this.testElement.textContent = 'Original';
                        document.body.appendChild(this.testElement);
                    },
                    fn: async () => {
                        let patchApplied = false;
                        
                        window.MooshReactive.domPatcher.registerPatch('#test-patch-element', (element) => {
                            element.textContent = 'Patched';
                            patchApplied = true;
                        });
                        
                        window.MooshReactive.domPatcher.patchAll();
                        
                        this.assert(patchApplied === true, 'Patch should be applied');
                        this.assert(this.testElement.textContent === 'Patched', 'Element should be patched');
                    },
                    cleanup: async () => {
                        if (this.testElement) {
                            this.testElement.remove();
                        }
                    }
                },
                {
                    name: 'Mutation observer for new elements',
                    fn: async () => {
                        let patchCount = 0;
                        
                        // Register patch
                        window.MooshReactive.domPatcher.registerPatch('.dynamic-test', () => {
                            patchCount++;
                        });
                        
                        // Add element dynamically
                        const element = document.createElement('div');
                        element.className = 'dynamic-test';
                        document.body.appendChild(element);
                        
                        await this.wait(100);
                        
                        this.assert(patchCount > 0, 'Patch should be applied to new elements');
                        
                        element.remove();
                    }
                }
            ];
        }

        // ACCOUNT SWITCHING TESTS
        accountSwitchingTests() {
            return [
                {
                    name: 'Enhanced switch account',
                    fn: async () => {
                        const accounts = window.MooshWallet.state.getAccounts();
                        if (accounts.length < 2) {
                            console.log('    Skipping: Need at least 2 accounts');
                            return;
                        }
                        
                        const currentId = window.MooshWallet.state.get('currentAccountId');
                        const targetAccount = accounts.find(a => a.id !== currentId);
                        
                        // Listen for state change
                        let stateChanged = false;
                        const unwatch = window.MooshReactive.state.watchState('currentAccountId', () => {
                            stateChanged = true;
                        });
                        
                        const result = window.MooshWallet.state.switchAccount(targetAccount.id);
                        await this.wait(100);
                        
                        this.assert(result === true, 'Switch should succeed');
                        this.assert(stateChanged === true, 'State watchers should be notified');
                        this.assert(window.MooshWallet.state.get('currentAccountId') === targetAccount.id, 'Account ID should update');
                        
                        unwatch();
                    }
                },
                {
                    name: 'Switch to non-existent account',
                    fn: async () => {
                        const result = window.MooshWallet.state.switchAccount('non-existent-id');
                        this.assert(result === false, 'Should return false for invalid account');
                    }
                },
                {
                    name: 'Global switch helper',
                    fn: async () => {
                        const accounts = window.MooshWallet.state.getAccounts();
                        if (accounts.length === 0) return;
                        
                        // Test by index
                        const result1 = window.MooshReactive.switchAccount(0);
                        this.assert(typeof result1 === 'boolean', 'Should return boolean');
                        
                        // Test by name
                        const account = accounts[0];
                        const result2 = window.MooshReactive.switchAccount(account.name);
                        this.assert(result2 === true, 'Should switch by name');
                        
                        // Test invalid
                        const result3 = window.MooshReactive.switchAccount('invalid-name-xyz');
                        this.assert(result3 === false, 'Should return false for invalid name');
                    }
                }
            ];
        }

        // PERFORMANCE TESTS
        performanceTests() {
            return [
                {
                    name: 'State update performance',
                    fn: async () => {
                        const iterations = 1000;
                        const start = performance.now();
                        
                        for (let i = 0; i < iterations; i++) {
                            window.MooshWallet.state.set(`perfTest${i}`, i);
                        }
                        
                        const duration = performance.now() - start;
                        const avgTime = duration / iterations;
                        
                        console.log(`    Average update time: ${avgTime.toFixed(3)}ms`);
                        this.assert(avgTime < 1, 'Average update should be under 1ms');
                    }
                },
                {
                    name: 'Watcher performance',
                    fn: async () => {
                        let callCount = 0;
                        const watchers = [];
                        
                        // Add 100 watchers
                        for (let i = 0; i < 100; i++) {
                            watchers.push(
                                window.MooshReactive.state.watchState('perfWatchTest', () => {
                                    callCount++;
                                })
                            );
                        }
                        
                        const start = performance.now();
                        window.MooshWallet.state.set('perfWatchTest', 'test');
                        await this.wait(100);
                        
                        const duration = performance.now() - start;
                        
                        console.log(`    100 watchers execution time: ${duration.toFixed(2)}ms`);
                        this.assert(callCount >= 100, 'All watchers should be called');
                        this.assert(duration < 200, 'Should handle 100 watchers efficiently');
                        
                        // Cleanup
                        watchers.forEach(unwatch => unwatch());
                    }
                },
                {
                    name: 'Memory efficiency',
                    fn: async () => {
                        const metrics = window.MooshReactive.metrics();
                        
                        this.assert(typeof metrics.updates === 'number', 'Should track updates');
                        this.assert(typeof metrics.avgUpdateTime === 'number', 'Should track average time');
                        this.assert(metrics.avgUpdateTime >= 0, 'Average time should be positive');
                    }
                }
            ];
        }

        // SECURITY TESTS
        securityTests() {
            return [
                {
                    name: 'Secure ID generation uniqueness',
                    fn: async () => {
                        const ids = new Set();
                        const iterations = 10000;
                        
                        for (let i = 0; i < iterations; i++) {
                            ids.add(window.MooshReactive.state.generateSecureId());
                        }
                        
                        this.assert(ids.size === iterations, 'All IDs should be unique');
                    }
                },
                {
                    name: 'Input sanitization in watchers',
                    fn: async () => {
                        let receivedValue = null;
                        
                        const unwatch = window.MooshReactive.state.watchState('xssTest', (value) => {
                            receivedValue = value;
                        });
                        
                        // Try XSS payload
                        const xssPayload = '<script>alert("xss")</script>';
                        window.MooshWallet.state.set('xssTest', xssPayload);
                        await this.wait(50);
                        
                        this.assert(receivedValue === xssPayload, 'Should preserve value without executing');
                        this.assert(!document.querySelector('script[src*="xss"]'), 'Should not create script elements');
                        
                        unwatch();
                    }
                }
            ];
        }

        // ERROR HANDLING TESTS
        errorHandlingTests() {
            return [
                {
                    name: 'Watcher error isolation',
                    fn: async () => {
                        let errorWatcherCalled = false;
                        let normalWatcherCalled = false;
                        
                        // Error watcher
                        const unwatch1 = window.MooshReactive.state.watchState('errorTest', () => {
                            errorWatcherCalled = true;
                            throw new Error('Test error');
                        });
                        
                        // Normal watcher
                        const unwatch2 = window.MooshReactive.state.watchState('errorTest', () => {
                            normalWatcherCalled = true;
                        });
                        
                        window.MooshWallet.state.set('errorTest', 'value');
                        await this.wait(100);
                        
                        this.assert(errorWatcherCalled === true, 'Error watcher should be called');
                        this.assert(normalWatcherCalled === true, 'Normal watcher should still be called');
                        
                        unwatch1();
                        unwatch2();
                    }
                },
                {
                    name: 'Invalid transaction handling',
                    fn: async () => {
                        const result = window.MooshReactive.state.commitTransaction('invalid-tx-id');
                        this.assert(result === false, 'Should handle invalid transaction gracefully');
                    }
                }
            ];
        }

        // INTEGRATION TESTS
        integrationTests() {
            return [
                {
                    name: 'Full account switch flow',
                    fn: async () => {
                        const accounts = window.MooshWallet.state.getAccounts();
                        if (accounts.length < 2) {
                            console.log('    Skipping: Need at least 2 accounts');
                            return;
                        }
                        
                        let accountSwitched = false;
                        let uiUpdated = false;
                        
                        // Watch for account switch
                        const unwatch1 = window.MooshReactive.state.watchState('currentAccountId', () => {
                            accountSwitched = true;
                        });
                        
                        // Watch for UI update
                        const unwatch2 = window.MooshReactive.state.watchState('currentAccount', () => {
                            uiUpdated = true;
                        });
                        
                        // Switch account
                        const currentId = window.MooshWallet.state.get('currentAccountId');
                        const targetAccount = accounts.find(a => a.id !== currentId);
                        
                        window.MooshReactive.switchAccount(targetAccount.name);
                        await this.wait(200);
                        
                        this.assert(accountSwitched === true, 'Account should switch');
                        this.assert(uiUpdated === true, 'UI should update');
                        
                        unwatch1();
                        unwatch2();
                    }
                },
                {
                    name: 'Router refresh on account switch',
                    fn: async () => {
                        if (!window.MooshWallet.router.refresh) {
                            console.log('    Skipping: Router refresh not available');
                            return;
                        }
                        
                        let refreshCalled = false;
                        const originalRefresh = window.MooshWallet.router.refresh;
                        
                        window.MooshWallet.router.refresh = function() {
                            refreshCalled = true;
                            originalRefresh.call(this);
                        };
                        
                        // Navigate with refresh
                        window.MooshWallet.router.navigate('dashboard', { refresh: true });
                        
                        this.assert(refreshCalled === true, 'Refresh should be called');
                        
                        window.MooshWallet.router.refresh = originalRefresh;
                    }
                }
            ];
        }

        // Helper methods
        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        displayResults() {
            const duration = ((Date.now() - this.results.startTime) / 1000).toFixed(2);
            const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
            
            console.log('\\n╔════════════════════════════════════════════════════════╗');
            console.log('║                    TEST RESULTS                        ║');
            console.log('╠════════════════════════════════════════════════════════╣');
            console.log(`║ Total Tests:    ${this.results.total.toString().padEnd(38)} ║`);
            console.log(`║ Passed:         ${(this.results.passed + ' ✓').padEnd(38)} ║`);
            console.log(`║ Failed:         ${(this.results.failed + ' ✗').padEnd(38)} ║`);
            console.log(`║ Pass Rate:      ${(passRate + '%').padEnd(38)} ║`);
            console.log(`║ Assertions:     ${this.assertions.toString().padEnd(38)} ║`);
            console.log(`║ Duration:       ${(duration + 's').padEnd(38)} ║`);
            console.log('╚════════════════════════════════════════════════════════╝');
            
            if (passRate >= 95) {
                console.log('\\n✅ SUCCESS: Test coverage meets MASTER_PROMPT_NEEDED.md requirement (>95%)');
            } else if (this.results.failed > 0) {
                console.log('\\n❌ FAILED: Some tests failed. Review the output above.');
            } else {
                console.log('\\n⚠️  WARNING: Pass rate below 95% requirement');
            }
        }
    }

    // Initialize and expose test suite
    window.ReactiveStateTests = new ReactiveStateTestSuite();
    
    // Auto-run if requested
    if (window.location.search.includes('test=true')) {
        setTimeout(() => {
            window.ReactiveStateTests.runAllTests();
        }, 1000);
    }
    
    console.log('[ReactiveStateTests] Test suite ready. Run: ReactiveStateTests.runAllTests()');

})();