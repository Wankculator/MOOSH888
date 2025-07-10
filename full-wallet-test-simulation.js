/**
 * MOOSH Wallet Full User Simulation Test
 * This script performs a comprehensive test of all wallet functionality
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class WalletTestSimulation {
    constructor() {
        this.testResults = {
            timestamp: new Date().toISOString(),
            tests: [],
            summary: {
                total: 0,
                passed: 0,
                failed: 0
            }
        };
    }

    async log(message, data = null) {
        const logEntry = {
            time: new Date().toISOString(),
            message,
            data
        };
        console.log(`[${logEntry.time}] ${message}`);
        if (data) {
            console.log(JSON.stringify(data, null, 2));
        }
    }

    async addTestResult(testName, status, details) {
        const result = {
            testName,
            status,
            details,
            timestamp: new Date().toISOString()
        };
        this.testResults.tests.push(result);
        this.testResults.summary.total++;
        if (status === 'PASSED') {
            this.testResults.summary.passed++;
        } else {
            this.testResults.summary.failed++;
        }
    }

    async runTest() {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1280, height: 800 }
        });

        try {
            const page = await browser.newPage();
            
            // Enable console logging
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    this.log(`Browser Console Error: ${msg.text()}`);
                }
            });

            page.on('pageerror', error => {
                this.log(`Page Error: ${error.message}`);
            });

            // Test 1: Load the application
            await this.log('=== TEST 1: Loading MOOSH Wallet ===');
            await page.goto('http://localhost:3333', { waitUntil: 'networkidle2' });
            await page.waitForTimeout(2000);
            
            const title = await page.title();
            await this.log(`Page Title: ${title}`);
            await this.addTestResult('Application Load', 'PASSED', { title });

            // Test 2: Check initial UI state
            await this.log('=== TEST 2: Checking Initial UI State ===');
            const heroSection = await page.$('.hero-section');
            const hasHero = heroSection !== null;
            await this.addTestResult('Initial UI Render', hasHero ? 'PASSED' : 'FAILED', { hasHeroSection: hasHero });

            // Test 3: Create New Wallet
            await this.log('=== TEST 3: Creating New Wallet ===');
            await page.waitForSelector('.primary-button', { visible: true });
            await page.click('.primary-button');
            await page.waitForTimeout(1000);

            // Check if modal opened
            const modal = await page.$('.modal-overlay');
            const modalOpened = modal !== null;
            await this.addTestResult('Create Wallet Modal', modalOpened ? 'PASSED' : 'FAILED', { modalOpened });

            // Test 4: Generate wallet with password
            await this.log('=== TEST 4: Generating Wallet with Password ===');
            const testPassword = 'TestPassword123!@#';
            
            // Enter password
            await page.waitForSelector('#password', { visible: true });
            await page.type('#password', testPassword);
            await page.type('#confirmPassword', testPassword);
            
            // Click generate
            await page.click('#generateBtn');
            await page.waitForTimeout(3000); // Wait for generation

            // Test 5: Capture seed phrase
            await this.log('=== TEST 5: Capturing Generated Seed Phrase ===');
            const seedPhraseElement = await page.$('#seedPhrase');
            let seedPhrase = '';
            
            if (seedPhraseElement) {
                seedPhrase = await page.evaluate(el => el.textContent, seedPhraseElement);
                await this.log('Generated Seed Phrase:', { seedPhrase });
                
                // Verify it's a valid BIP39 seed (12 or 24 words)
                const words = seedPhrase.trim().split(/\s+/);
                const isValidLength = words.length === 12 || words.length === 24;
                await this.addTestResult('Seed Phrase Generation', isValidLength ? 'PASSED' : 'FAILED', {
                    wordCount: words.length,
                    seedPhrase: seedPhrase.substring(0, 50) + '...'
                });
            } else {
                await this.addTestResult('Seed Phrase Generation', 'FAILED', { error: 'Seed phrase element not found' });
            }

            // Test 6: Capture wallet details
            await this.log('=== TEST 6: Capturing Wallet Details ===');
            const walletData = await page.evaluate(() => {
                const data = {};
                
                // Get Spark address
                const sparkElement = document.querySelector('#walletDetails p:nth-of-type(1)');
                if (sparkElement) {
                    const sparkText = sparkElement.textContent;
                    const sparkMatch = sparkText.match(/sp1[a-zA-Z0-9]+/);
                    data.sparkAddress = sparkMatch ? sparkMatch[0] : null;
                }
                
                // Get Bitcoin address
                const btcElement = document.querySelector('#walletDetails p:nth-of-type(2)');
                if (btcElement) {
                    const btcText = btcElement.textContent;
                    const btcMatch = btcText.match(/[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59}/);
                    data.bitcoinAddress = btcMatch ? btcMatch[0] : null;
                }
                
                // Get private keys
                const privKeyElement = document.querySelector('#walletDetails p:nth-of-type(3)');
                if (privKeyElement) {
                    const privKeyText = privKeyElement.textContent;
                    const wifMatch = privKeyText.match(/[5KL][a-km-zA-HJ-NP-Z1-9]{50,51}/);
                    data.privateKeyWIF = wifMatch ? wifMatch[0].substring(0, 10) + '...' : null;
                }
                
                const hexKeyElement = document.querySelector('#walletDetails p:nth-of-type(4)');
                if (hexKeyElement) {
                    const hexKeyText = hexKeyElement.textContent;
                    const hexMatch = hexKeyText.match(/[a-fA-F0-9]{64}/);
                    data.privateKeyHex = hexMatch ? hexMatch[0].substring(0, 10) + '...' : null;
                }
                
                return data;
            });

            await this.log('Wallet Details Captured:', walletData);
            
            // Validate addresses
            const sparkValid = walletData.sparkAddress && walletData.sparkAddress.startsWith('sp1') && walletData.sparkAddress.length === 65;
            const btcValid = walletData.bitcoinAddress && (walletData.bitcoinAddress.startsWith('bc1') || walletData.bitcoinAddress.match(/^[13]/));
            
            await this.addTestResult('Spark Address Generation', sparkValid ? 'PASSED' : 'FAILED', {
                address: walletData.sparkAddress,
                length: walletData.sparkAddress ? walletData.sparkAddress.length : 0
            });
            
            await this.addTestResult('Bitcoin Address Generation', btcValid ? 'PASSED' : 'FAILED', {
                address: walletData.bitcoinAddress
            });

            // Test 7: Test copy functionality
            await this.log('=== TEST 7: Testing Copy Buttons ===');
            const copyButtons = await page.$$('.copy-btn');
            await this.log(`Found ${copyButtons.length} copy buttons`);
            
            if (copyButtons.length > 0) {
                await copyButtons[0].click();
                await page.waitForTimeout(500);
                
                // Check for copy notification
                const notification = await page.$('.copy-notification');
                const copyWorked = notification !== null;
                await this.addTestResult('Copy Functionality', copyWorked ? 'PASSED' : 'FAILED', {
                    copyButtonsFound: copyButtons.length
                });
            }

            // Test 8: Close modal and test dashboard
            await this.log('=== TEST 8: Testing Dashboard Access ===');
            const closeButton = await page.$('.close-button');
            if (closeButton) {
                await closeButton.click();
                await page.waitForTimeout(1000);
            }

            // Navigate to dashboard
            const dashboardLink = await page.$('a[href="#dashboard"]');
            if (dashboardLink) {
                await dashboardLink.click();
                await page.waitForTimeout(2000);
                
                const dashboardSection = await page.$('#dashboard');
                const dashboardVisible = dashboardSection !== null;
                await this.addTestResult('Dashboard Navigation', dashboardVisible ? 'PASSED' : 'FAILED', {
                    dashboardFound: dashboardVisible
                });
            }

            // Test 9: Test import wallet functionality
            await this.log('=== TEST 9: Testing Wallet Import ===');
            await page.goto('http://localhost:3333', { waitUntil: 'networkidle2' });
            await page.waitForTimeout(1000);
            
            const importButton = await page.$('.secondary-button');
            if (importButton) {
                await importButton.click();
                await page.waitForTimeout(1000);
                
                const importModal = await page.$('#importSeedPhrase');
                const importModalVisible = importModal !== null;
                await this.addTestResult('Import Modal Access', importModalVisible ? 'PASSED' : 'FAILED', {
                    importModalFound: importModalVisible
                });
                
                // Try importing the previously generated seed
                if (importModalVisible && seedPhrase) {
                    await page.type('#importSeedPhrase', seedPhrase);
                    await page.type('#importPassword', testPassword);
                    
                    const importBtn = await page.$('#importBtn');
                    if (importBtn) {
                        await importBtn.click();
                        await page.waitForTimeout(2000);
                        
                        // Check if import was successful
                        const importedWallet = await page.$('#walletDetails');
                        const importSuccess = importedWallet !== null;
                        await this.addTestResult('Seed Import Functionality', importSuccess ? 'PASSED' : 'FAILED', {
                            seedImported: importSuccess
                        });
                    }
                }
            }

            // Test 10: Test theme switching
            await this.log('=== TEST 10: Testing Theme Switching ===');
            const themeToggle = await page.$('.theme-toggle');
            if (themeToggle) {
                const initialTheme = await page.evaluate(() => document.body.classList.contains('light-theme'));
                await themeToggle.click();
                await page.waitForTimeout(500);
                
                const newTheme = await page.evaluate(() => document.body.classList.contains('light-theme'));
                const themeChanged = initialTheme !== newTheme;
                await this.addTestResult('Theme Toggle', themeChanged ? 'PASSED' : 'FAILED', {
                    initialTheme: initialTheme ? 'light' : 'dark',
                    newTheme: newTheme ? 'light' : 'dark'
                });
            }

            // Test 11: Test responsive design
            await this.log('=== TEST 11: Testing Responsive Design ===');
            const viewports = [
                { name: 'Mobile', width: 375, height: 667 },
                { name: 'Tablet', width: 768, height: 1024 },
                { name: 'Desktop', width: 1920, height: 1080 }
            ];

            for (const viewport of viewports) {
                await page.setViewport(viewport);
                await page.waitForTimeout(500);
                
                const isResponsive = await page.evaluate(() => {
                    const hero = document.querySelector('.hero-section');
                    return hero && window.getComputedStyle(hero).display !== 'none';
                });
                
                await this.addTestResult(`Responsive Design - ${viewport.name}`, isResponsive ? 'PASSED' : 'FAILED', {
                    viewport,
                    displayed: isResponsive
                });
            }

            // Test 12: Test error handling
            await this.log('=== TEST 12: Testing Error Handling ===');
            await page.goto('http://localhost:3333', { waitUntil: 'networkidle2' });
            await page.click('.secondary-button'); // Open import modal
            await page.waitForTimeout(1000);
            
            // Try importing invalid seed
            await page.evaluate(() => {
                const importField = document.querySelector('#importSeedPhrase');
                if (importField) importField.value = '';
            });
            await page.type('#importSeedPhrase', 'invalid seed phrase test');
            await page.type('#importPassword', 'test123');
            
            const importErrorBtn = await page.$('#importBtn');
            if (importErrorBtn) {
                await importErrorBtn.click();
                await page.waitForTimeout(1000);
                
                // Check for error message
                const errorNotification = await page.evaluate(() => {
                    const notifications = Array.from(document.querySelectorAll('.notification'));
                    return notifications.some(n => n.textContent.toLowerCase().includes('error') || n.textContent.toLowerCase().includes('invalid'));
                });
                
                await this.addTestResult('Error Handling - Invalid Seed', errorNotification ? 'PASSED' : 'FAILED', {
                    errorShown: errorNotification
                });
            }

        } catch (error) {
            await this.log('Test execution error:', error.message);
            await this.addTestResult('Test Execution', 'FAILED', { error: error.message });
        } finally {
            await browser.close();
        }

        // Generate test report
        await this.generateReport();
    }

    async generateReport() {
        const report = {
            ...this.testResults,
            executionTime: new Date().toISOString(),
            environment: {
                url: 'http://localhost:3333',
                platform: process.platform,
                nodeVersion: process.version
            }
        };

        // Save report to file
        await fs.writeFile(
            'full-wallet-test-report.json',
            JSON.stringify(report, null, 2)
        );

        // Generate markdown report
        const markdown = this.generateMarkdownReport(report);
        await fs.writeFile('FULL_WALLET_TEST_REPORT.md', markdown);

        console.log('\n=== TEST SUMMARY ===');
        console.log(`Total Tests: ${report.summary.total}`);
        console.log(`Passed: ${report.summary.passed}`);
        console.log(`Failed: ${report.summary.failed}`);
        console.log(`Success Rate: ${((report.summary.passed / report.summary.total) * 100).toFixed(2)}%`);
    }

    generateMarkdownReport(report) {
        let md = `# MOOSH Wallet Full Test Report\n\n`;
        md += `**Test Date:** ${report.timestamp}\n`;
        md += `**Platform:** ${report.environment.platform}\n`;
        md += `**Node Version:** ${report.environment.nodeVersion}\n\n`;
        
        md += `## Test Summary\n\n`;
        md += `- **Total Tests:** ${report.summary.total}\n`;
        md += `- **Passed:** ${report.summary.passed} ✅\n`;
        md += `- **Failed:** ${report.summary.failed} ❌\n`;
        md += `- **Success Rate:** ${((report.summary.passed / report.summary.total) * 100).toFixed(2)}%\n\n`;
        
        md += `## Detailed Test Results\n\n`;
        
        report.tests.forEach((test, index) => {
            const icon = test.status === 'PASSED' ? '✅' : '❌';
            md += `### ${index + 1}. ${test.testName} ${icon}\n\n`;
            md += `**Status:** ${test.status}\n`;
            md += `**Time:** ${test.timestamp}\n`;
            
            if (test.details) {
                md += `**Details:**\n`;
                md += '```json\n';
                md += JSON.stringify(test.details, null, 2);
                md += '\n```\n';
            }
            md += '\n';
        });
        
        md += `## Key Findings\n\n`;
        
        // Extract key data from tests
        const seedTest = report.tests.find(t => t.testName === 'Seed Phrase Generation');
        const sparkTest = report.tests.find(t => t.testName === 'Spark Address Generation');
        const btcTest = report.tests.find(t => t.testName === 'Bitcoin Address Generation');
        
        if (seedTest?.status === 'PASSED') {
            md += `- ✅ **BIP39 Seed Generation:** Working correctly (${seedTest.details.wordCount} words)\n`;
        }
        
        if (sparkTest?.status === 'PASSED') {
            md += `- ✅ **Spark Address:** Generated successfully (${sparkTest.details.length} characters)\n`;
            md += `  - Format: ${sparkTest.details.address?.substring(0, 10)}...${sparkTest.details.address?.substring(55)}\n`;
        }
        
        if (btcTest?.status === 'PASSED') {
            md += `- ✅ **Bitcoin Address:** Generated successfully\n`;
            md += `  - Format: ${btcTest.details.address?.substring(0, 10)}...\n`;
        }
        
        md += `\n## Recommendations\n\n`;
        
        if (report.summary.failed > 0) {
            md += `### Failed Tests Requiring Attention:\n\n`;
            report.tests.filter(t => t.status === 'FAILED').forEach(test => {
                md += `- **${test.testName}:** ${JSON.stringify(test.details)}\n`;
            });
        } else {
            md += `All tests passed successfully! The wallet is functioning as expected.\n`;
        }
        
        return md;
    }
}

// Run the test
const tester = new WalletTestSimulation();
tester.runTest().catch(console.error);