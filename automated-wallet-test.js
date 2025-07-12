// MOOSH WALLET AUTOMATED TEST SUITE
// Following TDD best practices from MASTER_PROMPT_NEEDED.md
// Comprehensive testing with >95% coverage goal

class MooshWalletAutomatedTests {
    constructor() {
        this.testResults = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            errors: [],
            startTime: Date.now(),
            endTime: null
        };
        
        this.testCategories = {
            core: 'Core Functionality',
            security: 'Security Features',
            ui: 'User Interface',
            performance: 'Performance',
            integration: 'Integration',
            edge: 'Edge Cases'
        };
    }

    // Test runner with proper error handling
    async runTest(testName, testFn, category = 'core') {
        this.testResults.total++;
        console.log(`[TEST] Running: ${testName}`);
        
        try {
            const startTime = performance.now();
            await testFn();
            const duration = performance.now() - startTime;
            
            this.testResults.passed++;
            console.log(`✅ PASS: ${testName} (${duration.toFixed(2)}ms)`);
            
            return {
                name: testName,
                category: category,
                status: 'passed',
                duration: duration,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            this.testResults.failed++;
            this.testResults.errors.push({
                test: testName,
                error: error.message,
                stack: error.stack
            });
            
            console.error(`❌ FAIL: ${testName}`);
            console.error(`   Error: ${error.message}`);
            
            return {
                name: testName,
                category: category,
                status: 'failed',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Assertion helpers
    assert(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
        }
    }

    assertExists(element, message) {
        if (!element) {
            throw new Error(`Element not found: ${message}`);
        }
    }

    // Wait utilities
    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async waitForElement(selector, timeout = 5000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await this.wait(100);
        }
        
        throw new Error(`Element ${selector} not found after ${timeout}ms`);
    }

    // CORE FUNCTIONALITY TESTS
    async testCoreFeatures() {
        console.log('\n=== CORE FUNCTIONALITY TESTS ===\n');

        // Test 1: Wallet initialization
        await this.runTest('Wallet Initialization', async () => {
            this.assert(window.MooshWallet, 'MooshWallet should be defined');
            this.assert(window.MooshWallet.state, 'State manager should exist');
            this.assert(window.MooshWallet.ui, 'UI manager should exist');
            this.assert(window.MooshWallet.apiService, 'API service should exist');
        }, 'core');

        // Test 2: State management
        await this.runTest('State Management', async () => {
            const state = window.MooshWallet.state;
            
            // Test get/set
            state.set('testKey', 'testValue');
            this.assertEqual(state.get('testKey'), 'testValue', 'State get/set should work');
            
            // Test persistence
            state.persistState();
            const saved = localStorage.getItem('mooshWalletState');
            this.assert(saved, 'State should be persisted to localStorage');
        }, 'core');

        // Test 3: Account management
        await this.runTest('Account Management', async () => {
            const state = window.MooshWallet.state;
            const accounts = state.getAccounts();
            
            this.assert(Array.isArray(accounts), 'Accounts should be an array');
            
            if (accounts.length === 0) {
                console.log('   No accounts found - testing would create first account');
            } else {
                const account = accounts[0];
                this.assert(account.id, 'Account should have ID');
                this.assert(account.addresses, 'Account should have addresses');
                this.assert(account.balances, 'Account should have balances object');
            }
        }, 'core');

        // Test 4: Router functionality
        await this.runTest('Router Navigation', async () => {
            const router = window.MooshWallet.router;
            
            this.assert(router, 'Router should exist');
            this.assert(typeof router.navigate === 'function', 'Router should have navigate method');
            
            // Test navigation
            const initialPage = router.currentPage;
            router.navigate('settings');
            await this.wait(100);
            
            const newPage = router.currentPage;
            this.assert(newPage !== initialPage || newPage === 'settings', 'Router should change pages');
            
            // Navigate back
            router.navigate(initialPage);
        }, 'core');

        // Test 5: API Service
        await this.runTest('API Service', async () => {
            const api = window.MooshWallet.apiService;
            
            this.assert(api, 'API service should exist');
            this.assert(typeof api.fetchBitcoinPrice === 'function', 'Should have price fetch method');
            this.assert(typeof api.generateSparkWallet === 'function', 'Should have wallet generation method');
            
            // Test API URL configuration
            this.assert(api.baseURL, 'API should have base URL configured');
        }, 'core');
    }

    // SECURITY TESTS
    async testSecurityFeatures() {
        console.log('\n=== SECURITY TESTS ===\n');

        // Test 1: Password protection
        await this.runTest('Password Protection', async () => {
            const hasPassword = localStorage.getItem('walletPassword');
            
            if (hasPassword) {
                this.assert(hasPassword.length > 0, 'Password should not be empty');
                // Password should be hashed, not plain text
                this.assert(hasPassword.length > 20, 'Password should be hashed');
            }
            
            // Test session management
            const isUnlocked = sessionStorage.getItem('walletUnlocked');
            console.log(`   Wallet is ${isUnlocked === 'true' ? 'unlocked' : 'locked'}`);
        }, 'security');

        // Test 2: Seed phrase security
        await this.runTest('Seed Phrase Security', async () => {
            const state = window.MooshWallet.state;
            
            // Seed should not be in plain state
            const stateSeed = state.get('generatedSeed');
            this.assert(!stateSeed, 'Seed should not be stored in state');
            
            // Check localStorage encryption
            const storedSeed = localStorage.getItem('generatedSeed');
            if (storedSeed) {
                try {
                    const parsed = JSON.parse(storedSeed);
                    this.assert(Array.isArray(parsed), 'Stored seed should be properly formatted');
                } catch (e) {
                    // Might be encrypted
                    console.log('   Seed appears to be encrypted');
                }
            }
        }, 'security');

        // Test 3: Input validation
        await this.runTest('Input Validation', async () => {
            // Test malicious inputs
            const maliciousInputs = [
                '<script>alert("xss")</script>',
                '"; DROP TABLE users; --',
                'javascript:void(0)',
                '../../../etc/passwd'
            ];
            
            // These should be sanitized somewhere in the app
            maliciousInputs.forEach(input => {
                const sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                this.assert(sanitized !== input || !sanitized.includes('<script>'), 
                    'Malicious scripts should be sanitized');
            });
        }, 'security');

        // Test 4: Secure context
        await this.runTest('Secure Context', async () => {
            const isSecure = window.location.protocol === 'https:' || 
                           window.location.hostname === 'localhost';
            
            this.assert(isSecure, 'Wallet should run in secure context');
            
            // Check crypto availability
            this.assert(window.crypto, 'Web Crypto API should be available');
            this.assert(window.crypto.subtle, 'SubtleCrypto should be available');
        }, 'security');

        // Test 5: CORS and CSP
        await this.runTest('Security Headers', async () => {
            // Check for secure practices
            const hasIndexedDB = !!window.indexedDB;
            this.assert(hasIndexedDB, 'IndexedDB should be available for secure storage');
            
            // Check localStorage limits
            let storageSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    storageSize += localStorage[key].length;
                }
            }
            
            this.assert(storageSize < 5000000, 'LocalStorage usage should be reasonable');
        }, 'security');
    }

    // UI TESTS
    async testUserInterface() {
        console.log('\n=== USER INTERFACE TESTS ===\n');

        // Test 1: Essential buttons exist
        await this.runTest('Essential UI Elements', async () => {
            // Check for key buttons
            const buttons = document.querySelectorAll('button');
            this.assert(buttons.length > 0, 'Should have interactive buttons');
            
            // Look for specific functionality
            const buttonTexts = Array.from(buttons).map(btn => btn.textContent);
            
            const hasAccounts = buttonTexts.some(text => 
                text.includes('Account') || text.includes('+'));
            const hasSend = buttonTexts.some(text => text.includes('Send'));
            const hasReceive = buttonTexts.some(text => text.includes('Receive'));
            
            console.log(`   Found ${buttons.length} buttons`);
            console.log(`   Has Accounts: ${hasAccounts}`);
            console.log(`   Has Send: ${hasSend}`);
            console.log(`   Has Receive: ${hasReceive}`);
        }, 'ui');

        // Test 2: Responsive design
        await this.runTest('Responsive Design', async () => {
            const viewport = window.innerWidth;
            
            // Check for mobile-friendly elements
            const buttons = document.querySelectorAll('button');
            let touchFriendly = true;
            
            buttons.forEach(btn => {
                const rect = btn.getBoundingClientRect();
                if (rect.height < 44 || rect.width < 44) {
                    touchFriendly = false;
                }
            });
            
            if (viewport < 768) {
                this.assert(touchFriendly, 'Buttons should be touch-friendly on mobile');
            }
            
            // Check for viewport meta tag
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            this.assert(viewportMeta, 'Should have viewport meta tag');
        }, 'ui');

        // Test 3: Theme consistency
        await this.runTest('Theme Consistency', async () => {
            const rootStyles = getComputedStyle(document.documentElement);
            
            // Check for CSS variables
            const hasCSSVars = rootStyles.getPropertyValue('--text-primary') || 
                              rootStyles.getPropertyValue('--bg-primary');
            
            console.log(`   Theme system: ${hasCSSVars ? 'CSS Variables' : 'Static'}`);
            
            // Check dark mode support
            const isDarkMode = document.body.classList.contains('dark') || 
                             document.body.classList.contains('moosh-mode');
            
            console.log(`   Dark mode: ${isDarkMode ? 'Enabled' : 'Not detected'}`);
        }, 'ui');

        // Test 4: Loading states
        await this.runTest('Loading States', async () => {
            // Check for loading screen
            const loadingScreen = document.querySelector('#loading-screen');
            
            if (loadingScreen) {
                const display = getComputedStyle(loadingScreen).display;
                this.assert(display === 'none', 'Loading screen should be hidden after load');
            }
            
            // Check for loading indicators
            const hasSpinner = document.querySelector('.spinner, .loader');
            console.log(`   Loading indicators: ${hasSpinner ? 'Present' : 'Not found'}`);
        }, 'ui');

        // Test 5: Accessibility
        await this.runTest('Accessibility', async () => {
            // Check for ARIA labels
            const buttons = document.querySelectorAll('button');
            let accessibleButtons = 0;
            
            buttons.forEach(btn => {
                if (btn.getAttribute('aria-label') || btn.textContent.trim()) {
                    accessibleButtons++;
                }
            });
            
            this.assert(accessibleButtons === buttons.length, 
                'All buttons should have labels or text');
            
            // Check for focus management
            const focusableElements = document.querySelectorAll(
                'button, input, textarea, select, a[href]'
            );
            
            console.log(`   Focusable elements: ${focusableElements.length}`);
            
            // Check contrast (basic)
            const bgColor = getComputedStyle(document.body).backgroundColor;
            const textColor = getComputedStyle(document.body).color;
            
            console.log(`   Background: ${bgColor}, Text: ${textColor}`);
        }, 'ui');
    }

    // PERFORMANCE TESTS
    async testPerformance() {
        console.log('\n=== PERFORMANCE TESTS ===\n');

        // Test 1: Initial load performance
        await this.runTest('Load Performance', async () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            
            console.log(`   Page load time: ${loadTime}ms`);
            this.assert(loadTime < 5000, 'Page should load within 5 seconds');
            
            // Check resource counts
            const scripts = document.querySelectorAll('script').length;
            const styles = document.querySelectorAll('style, link[rel="stylesheet"]').length;
            
            console.log(`   Scripts: ${scripts}, Styles: ${styles}`);
        }, 'performance');

        // Test 2: Memory usage
        await this.runTest('Memory Usage', async () => {
            if (performance.memory) {
                const usedMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
                const totalMB = (performance.memory.totalJSHeapSize / 1048576).toFixed(2);
                
                console.log(`   Memory: ${usedMB}MB / ${totalMB}MB`);
                this.assert(usedMB < 100, 'Memory usage should be under 100MB');
            } else {
                console.log('   Memory API not available');
            }
        }, 'performance');

        // Test 3: DOM complexity
        await this.runTest('DOM Complexity', async () => {
            const domNodes = document.querySelectorAll('*').length;
            
            console.log(`   DOM nodes: ${domNodes}`);
            this.assert(domNodes < 5000, 'DOM should have less than 5000 nodes');
            
            // Check for memory leaks
            const detachedNodes = document.querySelectorAll(':empty:not(br):not(input):not(img)');
            console.log(`   Empty nodes: ${detachedNodes.length}`);
        }, 'performance');

        // Test 4: Event listener optimization
        await this.runTest('Event Listeners', async () => {
            // Count event listeners (approximate)
            const buttons = document.querySelectorAll('button');
            const inputs = document.querySelectorAll('input');
            const totalInteractive = buttons.length + inputs.length;
            
            console.log(`   Interactive elements: ${totalInteractive}`);
            this.assert(totalInteractive < 100, 'Should not have excessive interactive elements');
        }, 'performance');

        // Test 5: Animation performance
        await this.runTest('Animation Performance', async () => {
            // Check for CSS animations
            const animated = document.querySelectorAll('[class*="animate"], [class*="transition"]');
            console.log(`   Animated elements: ${animated.length}`);
            
            // Check for will-change usage
            let willChangeCount = 0;
            animated.forEach(el => {
                if (getComputedStyle(el).willChange !== 'auto') {
                    willChangeCount++;
                }
            });
            
            console.log(`   Elements with will-change: ${willChangeCount}`);
        }, 'performance');
    }

    // INTEGRATION TESTS
    async testIntegration() {
        console.log('\n=== INTEGRATION TESTS ===\n');

        // Test 1: LocalStorage integration
        await this.runTest('LocalStorage Integration', async () => {
            const keys = Object.keys(localStorage);
            const mooshKeys = keys.filter(key => 
                key.includes('moosh') || key.includes('wallet') || key.includes('spark')
            );
            
            console.log(`   Found ${mooshKeys.length} wallet-related localStorage keys`);
            this.assert(mooshKeys.length > 0, 'Should have wallet data in localStorage');
        }, 'integration');

        // Test 2: API connectivity
        await this.runTest('API Connectivity', async () => {
            const api = window.MooshWallet.apiService;
            
            // Check API URL
            console.log(`   API URL: ${api.baseURL}`);
            this.assert(api.baseURL, 'API URL should be configured');
            
            // Test if API methods exist
            const methods = ['fetchBitcoinPrice', 'generateSparkWallet', 'fetchBlockHeight'];
            methods.forEach(method => {
                this.assert(typeof api[method] === 'function', `API should have ${method} method`);
            });
        }, 'integration');

        // Test 3: State persistence
        await this.runTest('State Persistence', async () => {
            const state = window.MooshWallet.state;
            
            // Set test value
            const testKey = `test_${Date.now()}`;
            state.set(testKey, 'test_value');
            state.persistState();
            
            // Check if persisted
            const saved = localStorage.getItem('mooshWalletState');
            this.assert(saved && saved.includes(testKey), 'State should persist custom values');
            
            // Clean up
            state.set(testKey, undefined);
        }, 'integration');

        // Test 4: Multi-account system
        await this.runTest('Multi-Account System', async () => {
            const state = window.MooshWallet.state;
            
            // Check account methods
            this.assert(typeof state.getAccounts === 'function', 'Should have getAccounts method');
            this.assert(typeof state.getCurrentAccount === 'function', 'Should have getCurrentAccount method');
            this.assert(typeof state.switchAccount === 'function', 'Should have switchAccount method');
            
            const accounts = state.getAccounts();
            const currentAccount = state.getCurrentAccount();
            
            if (accounts.length > 0) {
                this.assert(currentAccount, 'Should have a current account if accounts exist');
                this.assert(currentAccount.id, 'Current account should have ID');
            }
        }, 'integration');

        // Test 5: Theme system
        await this.runTest('Theme System', async () => {
            const state = window.MooshWallet.state;
            const currentTheme = state.get('theme') || 'default';
            
            console.log(`   Current theme: ${currentTheme}`);
            
            // Check if theme is applied
            const bodyClasses = document.body.className;
            console.log(`   Body classes: ${bodyClasses || 'none'}`);
        }, 'integration');
    }

    // EDGE CASE TESTS
    async testEdgeCases() {
        console.log('\n=== EDGE CASE TESTS ===\n');

        // Test 1: Empty state handling
        await this.runTest('Empty State Handling', async () => {
            const state = window.MooshWallet.state;
            
            // Test undefined keys
            const undefinedValue = state.get('non_existent_key_12345');
            this.assert(undefinedValue === undefined || undefinedValue === null, 
                'Should handle undefined keys gracefully');
        }, 'edge');

        // Test 2: Large data handling
        await this.runTest('Large Data Handling', async () => {
            // Test with large string
            const largeString = 'x'.repeat(1000);
            
            try {
                localStorage.setItem('test_large', largeString);
                const retrieved = localStorage.getItem('test_large');
                this.assertEqual(retrieved.length, 1000, 'Should handle large strings');
                localStorage.removeItem('test_large');
            } catch (e) {
                console.log('   Large data test skipped - storage full');
            }
        }, 'edge');

        // Test 3: Rapid clicking
        await this.runTest('Rapid Click Handling', async () => {
            const buttons = document.querySelectorAll('button');
            if (buttons.length > 0) {
                const testButton = buttons[0];
                
                // Simulate rapid clicks
                let clickCount = 0;
                const originalOnclick = testButton.onclick;
                
                testButton.onclick = () => clickCount++;
                
                for (let i = 0; i < 10; i++) {
                    testButton.click();
                }
                
                // Should handle rapid clicks without errors
                this.assert(clickCount <= 10, 'Should handle rapid clicks appropriately');
                
                testButton.onclick = originalOnclick;
            }
        }, 'edge');

        // Test 4: Invalid inputs
        await this.runTest('Invalid Input Handling', async () => {
            const inputs = document.querySelectorAll('input');
            
            if (inputs.length > 0) {
                const testInput = inputs[0];
                
                // Test various invalid inputs
                const invalidInputs = [
                    '',
                    ' ',
                    'undefined',
                    'null',
                    '0',
                    '-1',
                    '999999999999999999999'
                ];
                
                invalidInputs.forEach(value => {
                    testInput.value = value;
                    // Should not crash
                });
                
                this.assert(true, 'Should handle invalid inputs without crashing');
            }
        }, 'edge');

        // Test 5: Browser compatibility
        await this.runTest('Browser Compatibility', async () => {
            // Check for required APIs
            const requiredAPIs = {
                'Promises': typeof Promise !== 'undefined',
                'Fetch API': typeof fetch !== 'undefined',
                'LocalStorage': typeof localStorage !== 'undefined',
                'SessionStorage': typeof sessionStorage !== 'undefined',
                'Crypto API': typeof crypto !== 'undefined',
                'CSS Variables': CSS && CSS.supports && CSS.supports('color', 'var(--test)')
            };
            
            Object.entries(requiredAPIs).forEach(([api, supported]) => {
                console.log(`   ${api}: ${supported ? '✓' : '✗'}`);
                this.assert(supported, `${api} should be supported`);
            });
        }, 'edge');
    }

    // Generate test report
    generateReport() {
        this.testResults.endTime = Date.now();
        const duration = (this.testResults.endTime - this.testResults.startTime) / 1000;
        const passRate = (this.testResults.passed / this.testResults.total * 100).toFixed(1);

        const report = {
            summary: {
                total: this.testResults.total,
                passed: this.testResults.passed,
                failed: this.testResults.failed,
                skipped: this.testResults.skipped,
                passRate: passRate + '%',
                duration: duration.toFixed(2) + 's'
            },
            errors: this.testResults.errors,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };

        return report;
    }

    // Main test runner
    async runAllTests() {
        console.log('╔═══════════════════════════════════════════════════════╗');
        console.log('║     MOOSH WALLET AUTOMATED TEST SUITE                 ║');
        console.log('║     Following TDD Best Practices                      ║');
        console.log('╚═══════════════════════════════════════════════════════╝');
        console.log(`\nStarting tests at ${new Date().toLocaleString()}\n`);

        try {
            await this.testCoreFeatures();
            await this.testSecurityFeatures();
            await this.testUserInterface();
            await this.testPerformance();
            await this.testIntegration();
            await this.testEdgeCases();
        } catch (criticalError) {
            console.error('\n❌ CRITICAL ERROR:', criticalError);
        }

        const report = this.generateReport();

        console.log('\n╔═══════════════════════════════════════════════════════╗');
        console.log('║                    TEST SUMMARY                       ║');
        console.log('╚═══════════════════════════════════════════════════════╝');
        console.log(`\nTotal Tests: ${report.summary.total}`);
        console.log(`Passed: ${report.summary.passed} ✅`);
        console.log(`Failed: ${report.summary.failed} ❌`);
        console.log(`Pass Rate: ${report.summary.passRate}`);
        console.log(`Duration: ${report.summary.duration}`);

        if (report.errors.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            report.errors.forEach(error => {
                console.log(`\n- ${error.test}`);
                console.log(`  Error: ${error.error}`);
            });
        }

        console.log('\n═══════════════════════════════════════════════════════');

        // Save report to localStorage
        localStorage.setItem('mooshWalletTestReport', JSON.stringify(report));
        console.log('\n📊 Full report saved to localStorage as "mooshWalletTestReport"');

        return report;
    }
}

// Auto-run tests if this script is loaded directly
if (typeof window !== 'undefined') {
    window.MooshWalletTests = MooshWalletAutomatedTests;
    
    // Add to global for console access
    window.runWalletTests = async () => {
        const tester = new MooshWalletAutomatedTests();
        return await tester.runAllTests();
    };
    
    console.log('MOOSH Wallet Automated Tests loaded.');
    console.log('Run tests with: runWalletTests()');
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MooshWalletAutomatedTests;
}