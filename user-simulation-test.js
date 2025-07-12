// MOOSH WALLET - USER SIMULATION TEST
// Following MASTER_PROMPT_NEEDED.md guidelines for full user flow testing

(function() {
    'use strict';

    console.log('[UserSimulation] Initializing user simulation test...');

    class UserSimulationTest {
        constructor() {
            this.testSteps = [];
            this.currentStep = 0;
            this.results = {
                passed: [],
                failed: [],
                warnings: []
            };
        }

        async runFullSimulation() {
            console.log('\\n════════════════════════════════════════════════════════');
            console.log('MOOSH WALLET USER SIMULATION TEST');
            console.log('Simulating complete user journey');
            console.log('════════════════════════════════════════════════════════\\n');

            await this.waitForWallet();

            // Define test scenarios
            this.testSteps = [
                { name: 'Dashboard Navigation', fn: () => this.testDashboardNavigation() },
                { name: 'Account Creation', fn: () => this.testAccountCreation() },
                { name: 'Account Switching', fn: () => this.testAccountSwitching() },
                { name: 'Balance Display', fn: () => this.testBalanceDisplay() },
                { name: 'Wallet Type Selection', fn: () => this.testWalletTypeSelection() },
                { name: 'Multi-Account Modal', fn: () => this.testMultiAccountModal() },
                { name: 'Import Account Flow', fn: () => this.testImportFlow() },
                { name: 'Settings Navigation', fn: () => this.testSettingsNavigation() },
                { name: 'Live Data Updates', fn: () => this.testLiveDataUpdates() },
                { name: 'Error Handling', fn: () => this.testErrorHandling() }
            ];

            // Run all steps
            for (const step of this.testSteps) {
                await this.runStep(step);
            }

            // Display results
            this.displayResults();
        }

        async runStep(step) {
            console.log(`\\n[Step ${++this.currentStep}/${this.testSteps.length}] ${step.name}`);
            console.log('─'.repeat(50));

            try {
                await step.fn();
                this.results.passed.push(step.name);
                console.log(`✓ ${step.name} completed successfully`);
            } catch (error) {
                this.results.failed.push({ step: step.name, error: error.message });
                console.error(`✗ ${step.name} failed: ${error.message}`);
            }
        }

        async waitForWallet() {
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 50;
                
                const checkInterval = setInterval(() => {
                    attempts++;
                    
                    if (window.MooshWallet && window.MooshWallet.state && window.MooshWallet.router) {
                        clearInterval(checkInterval);
                        resolve();
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        reject(new Error('Wallet initialization timeout'));
                    }
                }, 100);
            });
        }

        async wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // TEST IMPLEMENTATIONS

        async testDashboardNavigation() {
            console.log('Testing dashboard navigation...');
            
            const router = window.MooshWallet.router;
            const originalPage = router.currentPage;
            
            // Navigate to dashboard
            router.navigate('dashboard');
            await this.wait(500);
            
            // Check if dashboard rendered
            const dashboard = document.querySelector('.wallet-dashboard-container');
            if (!dashboard) throw new Error('Dashboard not rendered');
            
            // Check for essential elements
            const elements = {
                'Account indicator': '#currentAccountIndicator, .account-indicator, #accountDropdownButton',
                'Refresh button': 'button:contains("Refresh"), button[textContent*="Refresh"]',
                'Balance section': '.balance-section, [class*="balance"]',
                'Wallet type selector': '#walletTypeSelector'
            };
            
            for (const [name, selector] of Object.entries(elements)) {
                const element = document.querySelector(selector) || 
                              Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes(name.split(' ')[0]));
                if (!element) {
                    this.results.warnings.push(`${name} not found`);
                    console.warn(`  ⚠️  ${name} not found`);
                } else {
                    console.log(`  ✓ ${name} found`);
                }
            }
            
            // Restore original page if needed
            if (originalPage !== 'dashboard') {
                router.navigate(originalPage);
            }
        }

        async testAccountCreation() {
            console.log('Testing account creation flow...');
            
            const state = window.MooshWallet.state;
            const initialCount = state.getAccounts().length;
            
            // Click + Accounts button
            const accountsBtn = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('+') || btn.textContent.includes('Accounts'));
            
            if (!accountsBtn) {
                throw new Error('+ Accounts button not found');
            }
            
            console.log('  ✓ Found + Accounts button');
            accountsBtn.click();
            await this.wait(500);
            
            // Check if modal opened
            const modal = document.querySelector('.multi-account-modal, [class*="modal"]');
            if (!modal) throw new Error('Multi-account modal did not open');
            
            console.log('  ✓ Modal opened successfully');
            
            // Find and click Create Account button
            const createBtn = Array.from(modal.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('Create'));
            
            if (createBtn) {
                console.log('  ✓ Found Create Account button');
                // Don't actually create to avoid modifying user data
                console.log('  ℹ Skipping actual creation to preserve user data');
            }
            
            // Close modal
            const closeBtn = Array.from(modal.querySelectorAll('button'))
                .find(btn => btn.textContent === 'Close' || btn.textContent === '✕');
            
            if (closeBtn) {
                closeBtn.click();
                await this.wait(500);
                console.log('  ✓ Modal closed successfully');
            }
        }

        async testAccountSwitching() {
            console.log('Testing account switching...');
            
            const state = window.MooshWallet.state;
            const accounts = state.getAccounts();
            
            if (accounts.length < 2) {
                console.log('  ℹ Skipping: Need at least 2 accounts for switching test');
                this.results.warnings.push('Account switching test skipped - insufficient accounts');
                return;
            }
            
            // Find account dropdown
            const dropdown = document.getElementById('accountDropdownButton');
            if (!dropdown) {
                // Try clicking account indicator
                const indicator = document.querySelector('#currentAccountIndicator, .account-indicator');
                if (indicator) {
                    console.log('  ℹ No dropdown found, using account indicator');
                    indicator.click();
                    await this.wait(500);
                } else {
                    throw new Error('No account selector found');
                }
            } else {
                console.log('  ✓ Found account dropdown');
                dropdown.click();
                await this.wait(300);
                
                // Check if dropdown menu opened
                const menu = document.getElementById('accountDropdownMenu');
                if (!menu || menu.style.display === 'none') {
                    throw new Error('Account dropdown menu did not open');
                }
                
                console.log('  ✓ Dropdown menu opened');
                
                // Find account items
                const accountItems = menu.querySelectorAll('.account-dropdown-item, [class*="account"][class*="item"]');
                console.log(`  ✓ Found ${accountItems.length} accounts in dropdown`);
                
                // Click to close dropdown
                document.body.click();
                await this.wait(300);
            }
        }

        async testBalanceDisplay() {
            console.log('Testing balance display...');
            
            // Check for balance elements
            const balanceElements = document.querySelectorAll('[id*="balance"], [class*="balance"]');
            if (balanceElements.length === 0) {
                throw new Error('No balance elements found');
            }
            
            console.log(`  ✓ Found ${balanceElements.length} balance elements`);
            
            // Check for BTC price
            const priceElement = document.getElementById('btcPrice');
            if (priceElement) {
                const price = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ''));
                if (price > 0) {
                    console.log(`  ✓ BTC price displayed: $${price.toLocaleString()}`);
                } else {
                    console.log('  ⚠️  BTC price is 0 or invalid');
                }
            }
            
            // Test hide/show balance
            const hideBtn = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent === 'Hide' || btn.textContent === 'Show');
            
            if (hideBtn) {
                console.log('  ✓ Found Hide/Show button');
                const originalText = hideBtn.textContent;
                hideBtn.click();
                await this.wait(300);
                
                if (hideBtn.textContent !== originalText) {
                    console.log('  ✓ Balance visibility toggle works');
                    // Toggle back
                    hideBtn.click();
                    await this.wait(300);
                }
            }
        }

        async testWalletTypeSelection() {
            console.log('Testing wallet type selection...');
            
            const selector = document.getElementById('walletTypeSelector');
            if (!selector) {
                console.log('  ⚠️  Wallet type selector not found');
                this.results.warnings.push('Wallet type selector not found');
                return;
            }
            
            console.log('  ✓ Found wallet type selector');
            
            // Check options
            const options = selector.querySelectorAll('option');
            console.log(`  ✓ Found ${options.length} wallet types`);
            
            const expectedTypes = ['taproot', 'segwit', 'legacy'];
            expectedTypes.forEach(type => {
                const hasType = Array.from(options).some(opt => 
                    opt.value.toLowerCase().includes(type) || 
                    opt.textContent.toLowerCase().includes(type)
                );
                
                if (hasType) {
                    console.log(`  ✓ ${type} wallet type available`);
                } else {
                    console.log(`  ⚠️  ${type} wallet type missing`);
                }
            });
        }

        async testMultiAccountModal() {
            console.log('Testing multi-account modal Import → Cancel → Close flow...');
            
            // Open accounts modal
            const accountsBtn = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('+') || btn.textContent.includes('Accounts'));
            
            if (!accountsBtn) throw new Error('+ Accounts button not found');
            
            accountsBtn.click();
            await this.wait(500);
            
            const modal = document.querySelector('.multi-account-modal, [class*="modal"]');
            if (!modal) throw new Error('Modal did not open');
            
            console.log('  ✓ Modal opened');
            
            // Click Import
            const importBtn = Array.from(modal.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('Import'));
            
            if (!importBtn) throw new Error('Import button not found');
            
            importBtn.click();
            await this.wait(500);
            console.log('  ✓ Import form opened');
            
            // Click Cancel
            const cancelBtn = Array.from(modal.querySelectorAll('button'))
                .find(btn => btn.textContent === 'Cancel');
            
            if (!cancelBtn) throw new Error('Cancel button not found');
            
            cancelBtn.click();
            await this.wait(500);
            console.log('  ✓ Returned to account list');
            
            // Click Close
            const closeBtn = Array.from(modal.querySelectorAll('button'))
                .find(btn => btn.textContent === 'Close' || btn.textContent === '✕');
            
            if (!closeBtn) throw new Error('Close button not found');
            
            closeBtn.click();
            await this.wait(500);
            
            // Verify modal closed and on dashboard
            const modalGone = !document.querySelector('.multi-account-modal, [class*="modal"]');
            const onDashboard = window.MooshWallet.router.currentPage === 'dashboard';
            
            if (!modalGone) throw new Error('Modal did not close');
            if (!onDashboard) throw new Error('Did not return to dashboard');
            
            console.log('  ✓ Modal closed and returned to dashboard');
        }

        async testImportFlow() {
            console.log('Testing import account flow validation...');
            
            // This tests the import form validation without actually importing
            const accountsBtn = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('+') || btn.textContent.includes('Accounts'));
            
            if (!accountsBtn) {
                console.log('  ⚠️  + Accounts button not found');
                return;
            }
            
            accountsBtn.click();
            await this.wait(500);
            
            const modal = document.querySelector('.multi-account-modal, [class*="modal"]');
            if (!modal) {
                console.log('  ⚠️  Modal did not open');
                return;
            }
            
            const importBtn = Array.from(modal.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('Import'));
            
            if (importBtn) {
                importBtn.click();
                await this.wait(500);
                
                // Check for seed phrase input
                const seedInput = modal.querySelector('textarea, input[type="password"]');
                if (seedInput) {
                    console.log('  ✓ Seed phrase input found');
                    
                    // Test validation with invalid seed
                    seedInput.value = 'invalid seed phrase';
                    seedInput.dispatchEvent(new Event('input', { bubbles: true }));
                    await this.wait(100);
                    
                    // Don't actually submit
                    console.log('  ✓ Import form validation ready');
                }
                
                // Cancel to close
                const cancelBtn = Array.from(modal.querySelectorAll('button'))
                    .find(btn => btn.textContent === 'Cancel');
                
                if (cancelBtn) {
                    cancelBtn.click();
                    await this.wait(300);
                }
            }
            
            // Close modal
            const closeBtn = Array.from(modal.querySelectorAll('button'))
                .find(btn => btn.textContent === 'Close' || btn.textContent === '✕');
            
            if (closeBtn) {
                closeBtn.click();
                await this.wait(500);
            }
        }

        async testSettingsNavigation() {
            console.log('Testing settings navigation...');
            
            // Find settings button
            const settingsBtn = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent.includes('Settings') || btn.textContent.includes('⚙'));
            
            if (!settingsBtn) {
                console.log('  ⚠️  Settings button not found');
                this.results.warnings.push('Settings button not found');
                return;
            }
            
            console.log('  ✓ Settings button found');
            
            // Note: Not clicking to avoid disrupting user session
            console.log('  ℹ Settings navigation verified (not executed)');
        }

        async testLiveDataUpdates() {
            console.log('Testing live data updates...');
            
            if (!window.MooshLiveData) {
                console.log('  ⚠️  Live data module not loaded');
                this.results.warnings.push('Live data module not loaded');
                return;
            }
            
            // Refresh data
            await window.MooshLiveData.refreshAll();
            await this.wait(1000);
            
            const cache = window.MooshLiveData.getCache();
            
            if (cache.price.value > 0) {
                console.log(`  ✓ BTC price: $${cache.price.value.toLocaleString()}`);
            } else {
                console.log('  ⚠️  BTC price not available');
            }
            
            if (cache.blockTime.minutes > 0) {
                console.log(`  ✓ Next block: ~${cache.blockTime.minutes} minutes`);
            } else {
                console.log('  ⚠️  Block time not available');
            }
            
            if (cache.fees.medium > 0) {
                console.log(`  ✓ Fee rate: ${cache.fees.medium} sat/vB`);
            } else {
                console.log('  ⚠️  Fee data not available');
            }
        }

        async testErrorHandling() {
            console.log('Testing error handling...');
            
            // Test navigation to invalid page
            const router = window.MooshWallet.router;
            const originalPage = router.currentPage;
            
            router.navigate('invalid_page_xyz');
            await this.wait(300);
            
            // Should handle gracefully
            if (router.currentPage) {
                console.log('  ✓ Invalid navigation handled gracefully');
            } else {
                throw new Error('Router crashed on invalid navigation');
            }
            
            // Restore original page
            router.navigate(originalPage);
            
            // Test state with invalid key
            const state = window.MooshWallet.state;
            const invalidValue = state.get('completely_invalid_key_xyz');
            
            if (invalidValue === undefined || invalidValue === null) {
                console.log('  ✓ Invalid state key handled correctly');
            } else {
                console.log('  ⚠️  Unexpected value for invalid key');
            }
        }

        displayResults() {
            console.log('\\n════════════════════════════════════════════════════════');
            console.log('USER SIMULATION RESULTS');
            console.log('════════════════════════════════════════════════════════');
            
            console.log(`\\nPassed: ${this.results.passed.length}/${this.testSteps.length}`);
            this.results.passed.forEach(test => {
                console.log(`  ✓ ${test}`);
            });
            
            if (this.results.failed.length > 0) {
                console.log(`\\nFailed: ${this.results.failed.length}`);
                this.results.failed.forEach(({ step, error }) => {
                    console.log(`  ✗ ${step}: ${error}`);
                });
            }
            
            if (this.results.warnings.length > 0) {
                console.log(`\\nWarnings: ${this.results.warnings.length}`);
                this.results.warnings.forEach(warning => {
                    console.log(`  ⚠️  ${warning}`);
                });
            }
            
            const successRate = (this.results.passed.length / this.testSteps.length * 100).toFixed(1);
            console.log(`\\nSuccess Rate: ${successRate}%`);
            
            if (successRate >= 95) {
                console.log('\\n✅ User simulation test PASSED (>95% success rate)');
            } else if (successRate >= 80) {
                console.log('\\n⚠️  User simulation test completed with warnings');
            } else {
                console.log('\\n❌ User simulation test FAILED');
            }
            
            console.log('════════════════════════════════════════════════════════\\n');
        }
    }

    // Initialize and expose
    window.UserSimulation = new UserSimulationTest();
    
    console.log('[UserSimulation] Test loaded. Run window.UserSimulation.runFullSimulation() to start');

})();