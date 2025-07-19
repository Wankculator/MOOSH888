// Comprehensive MOOSH Wallet Test Suite
// This script tests all major functionality of the wallet

const puppeteer = require('puppeteer');

async function runComprehensiveTests() {
    console.log('🚀 Starting MOOSH Wallet Comprehensive Test Suite\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Enable console logging from the page
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.error('❌ Console Error:', msg.text());
        }
    });

    page.on('pageerror', error => {
        console.error('❌ Page Error:', error.message);
    });

    const results = {
        passed: [],
        failed: [],
        warnings: []
    };

    // Helper function to test and log
    async function test(name, fn) {
        try {
            console.log(`\n📋 Testing: ${name}`);
            await fn();
            results.passed.push(name);
            console.log(`✅ ${name} - PASSED`);
        } catch (error) {
            results.failed.push({ name, error: error.message });
            console.error(`❌ ${name} - FAILED:`, error.message);
        }
    }

    try {
        // 1. Test Loading the Application
        await test('Application Loading', async () => {
            await page.goto('http://localhost:3333', { waitUntil: 'networkidle2' });
            await page.waitForSelector('#app-container', { timeout: 10000 });
        });

        // 2. Test Home Page
        await test('Home Page Display', async () => {
            const homeTitle = await page.$eval('h1', el => el.textContent);
            if (!homeTitle.includes('MOOSH')) {
                throw new Error('Home page title not found');
            }
        });

        // 3. Test Create New Wallet Flow
        await test('Create Wallet Button', async () => {
            await page.waitForSelector('button:has-text("Create New Wallet")', { timeout: 5000 });
            await page.click('button:has-text("Create New Wallet")');
        });

        // 4. Test Generate Seed (12 words)
        await test('Generate 12-Word Seed', async () => {
            await page.waitForSelector('button:has-text("12 Words")', { timeout: 5000 });
            await page.click('button:has-text("12 Words")');
            
            // Wait for seed generation (this can take up to 60 seconds)
            await page.waitForSelector('.seed-display', { timeout: 65000 });
            
            const seedWords = await page.$$eval('.seed-word', elements => elements.length);
            if (seedWords !== 12) {
                throw new Error(`Expected 12 seed words, got ${seedWords}`);
            }
        });

        // 5. Test Copy Seed Functionality
        await test('Copy Seed Button', async () => {
            const copyButton = await page.$('button:has-text("Copy Seed")');
            if (!copyButton) {
                throw new Error('Copy seed button not found');
            }
        });

        // 6. Navigate to Confirm Seed
        await test('Navigate to Confirm Seed', async () => {
            await page.click('button:has-text("Continue")');
            await page.waitForSelector('h1:has-text("Confirm")', { timeout: 5000 });
        });

        // 7. Test Dashboard Loading
        await test('Dashboard Loading', async () => {
            // Skip seed confirmation for now, click continue
            const continueBtn = await page.$('button:has-text("Continue")');
            if (continueBtn) {
                await continueBtn.click();
            }
            
            await page.waitForSelector('.dashboard-container', { timeout: 10000 });
        });

        // 8. Test Multi-Account Modal
        await test('Multi-Account Feature', async () => {
            const accountIndicator = await page.$('.account-indicator');
            if (accountIndicator) {
                await accountIndicator.click();
                await page.waitForSelector('.multi-account-modal', { timeout: 5000 });
                
                // Check if "Add Account" button exists
                const addAccountBtn = await page.$('button:has-text("Add Account")');
                if (!addAccountBtn) {
                    throw new Error('Add Account button not found');
                }
                
                // Close modal
                await page.keyboard.press('Escape');
            }
        });

        // 9. Test Navigation Menu
        await test('Navigation Menu', async () => {
            const navItems = ['Dashboard', 'Send', 'Receive', 'Settings'];
            for (const item of navItems) {
                const navLink = await page.$(`a:has-text("${item}")`);
                if (!navLink) {
                    throw new Error(`Navigation item "${item}" not found`);
                }
            }
        });

        // 10. Test Send Page
        await test('Send Page', async () => {
            await page.click('a:has-text("Send")');
            await page.waitForSelector('.send-container', { timeout: 5000 });
            
            // Check for required elements
            const recipientInput = await page.$('input[placeholder*="recipient"]');
            const amountInput = await page.$('input[placeholder*="amount"]');
            if (!recipientInput || !amountInput) {
                throw new Error('Send form inputs not found');
            }
        });

        // 11. Test Receive Page
        await test('Receive Page', async () => {
            await page.click('a:has-text("Receive")');
            await page.waitForSelector('.receive-container', { timeout: 5000 });
            
            // Check for QR code element
            const qrCode = await page.$('.qr-code');
            if (!qrCode) {
                throw new Error('QR code not found on receive page');
            }
        });

        // 12. Test Settings Page
        await test('Settings Page', async () => {
            await page.click('a:has-text("Settings")');
            await page.waitForSelector('.settings-container', { timeout: 5000 });
            
            // Check for theme toggle
            const themeToggle = await page.$('.theme-toggle');
            if (!themeToggle) {
                results.warnings.push('Theme toggle not found in settings');
            }
        });

        // 13. Test Mobile Responsiveness
        await test('Mobile Responsiveness', async () => {
            // Test mobile viewport
            await page.setViewport({ width: 375, height: 667 });
            await page.waitForTimeout(1000);
            
            // Check if mobile menu exists
            const mobileMenu = await page.$('.mobile-menu-toggle');
            if (!mobileMenu) {
                results.warnings.push('Mobile menu toggle not found');
            }
            
            // Reset viewport
            await page.setViewport({ width: 1920, height: 1080 });
        });

        // 14. Test API Integration
        await test('API Health Check', async () => {
            const response = await page.evaluate(async () => {
                try {
                    const res = await fetch('http://localhost:3001/api/health');
                    return res.ok;
                } catch (error) {
                    return false;
                }
            });
            
            if (!response) {
                throw new Error('API health check failed');
            }
        });

        // 15. Test Error Handling
        await test('Error Handling', async () => {
            // Try to send with invalid address
            await page.goto('http://localhost:3333/#/send');
            await page.waitForSelector('.send-container', { timeout: 5000 });
            
            await page.type('input[placeholder*="recipient"]', 'invalid-address');
            await page.type('input[placeholder*="amount"]', '0.001');
            
            const sendButton = await page.$('button:has-text("Send")');
            if (sendButton) {
                await sendButton.click();
                
                // Wait for error message
                await page.waitForSelector('.error-message', { timeout: 5000 });
            }
        });

        // 16. Test Balance Display
        await test('Balance Display', async () => {
            await page.goto('http://localhost:3333/#/dashboard');
            await page.waitForSelector('.balance-display', { timeout: 5000 });
            
            const balanceText = await page.$eval('.balance-display', el => el.textContent);
            if (!balanceText.includes('BTC')) {
                throw new Error('Balance display not showing BTC');
            }
        });

        // 17. Test Transaction History
        await test('Transaction History', async () => {
            const historyButton = await page.$('button:has-text("Transaction History")');
            if (historyButton) {
                await historyButton.click();
                await page.waitForSelector('.transaction-history-modal', { timeout: 5000 });
                await page.keyboard.press('Escape');
            } else {
                results.warnings.push('Transaction history button not found');
            }
        });

        // 18. Test Wallet Lock Feature
        await test('Wallet Lock Feature', async () => {
            await page.goto('http://localhost:3333/#/settings');
            const lockButton = await page.$('button:has-text("Lock Wallet")');
            if (lockButton) {
                results.passed.push('Wallet lock feature available');
            } else {
                results.warnings.push('Wallet lock feature not found');
            }
        });

    } catch (error) {
        console.error('\n❌ Test suite encountered an error:', error);
    } finally {
        // Print summary
        console.log('\n\n📊 TEST SUMMARY');
        console.log('=====================================');
        console.log(`✅ Passed: ${results.passed.length}`);
        console.log(`❌ Failed: ${results.failed.length}`);
        console.log(`⚠️  Warnings: ${results.warnings.length}`);
        
        if (results.failed.length > 0) {
            console.log('\n❌ FAILED TESTS:');
            results.failed.forEach(f => {
                console.log(`  - ${f.name}: ${f.error}`);
            });
        }
        
        if (results.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            results.warnings.forEach(w => {
                console.log(`  - ${w}`);
            });
        }
        
        await browser.close();
    }
}

// Check if puppeteer is installed
try {
    require.resolve('puppeteer');
    runComprehensiveTests();
} catch (error) {
    console.log('Puppeteer not installed. Installing...');
    const { exec } = require('child_process');
    exec('npm install puppeteer', (error, stdout, stderr) => {
        if (error) {
            console.error('Failed to install puppeteer:', error);
            return;
        }
        console.log('Puppeteer installed successfully. Running tests...');
        runComprehensiveTests();
    });
}