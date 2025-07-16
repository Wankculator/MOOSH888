#!/usr/bin/env node

/**
 * Test script for AccountSwitcher functionality
 * Tests account switching, dropdown behavior, and state updates
 */

const puppeteer = require('puppeteer');

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAccountSwitcher() {
    console.log('🧪 Starting AccountSwitcher Tests...\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: null
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        if (msg.type() === 'log' || msg.type() === 'info') {
            console.log('Browser:', msg.text());
        }
    });
    
    try {
        console.log('📋 Test 1: Load wallet and check AccountSwitcher presence');
        await page.goto('http://localhost:3002');
        await delay(2000);
        
        // Check if AccountSwitcher exists
        const accountSwitcherExists = await page.evaluate(() => {
            return document.querySelector('.account-switcher') !== null;
        });
        
        if (!accountSwitcherExists) {
            // Try to add an account first
            console.log('   ℹ️  No AccountSwitcher found, creating an account first...');
            
            // Navigate to dashboard if not already there
            await page.evaluate(() => {
                if (window.app && window.app.navigateTo) {
                    window.app.navigateTo('dashboard');
                }
            });
            await delay(1000);
            
            // Create a test account
            await page.evaluate(() => {
                return window.app.state.createAccount('Test Account 1');
            });
            await delay(1000);
            
            // Refresh to ensure AccountSwitcher loads
            await page.reload();
            await delay(2000);
        }
        
        // Re-check for AccountSwitcher
        const switcherFound = await page.evaluate(() => {
            const switcher = document.querySelector('.account-switcher');
            return switcher !== null;
        });
        
        console.log(`   ${switcherFound ? '✅' : '❌'} AccountSwitcher component found`);
        
        if (!switcherFound) {
            console.log('   ⚠️  No accounts exist, creating test accounts...');
            
            // Create multiple test accounts
            for (let i = 1; i <= 3; i++) {
                await page.evaluate((num) => {
                    return window.app.state.createAccount(`Test Account ${num}`);
                }, i);
                await delay(500);
            }
            
            // Reload page to see AccountSwitcher
            await page.reload();
            await delay(2000);
        }
        
        console.log('\n📋 Test 2: Check AccountSwitcher trigger button');
        const triggerInfo = await page.evaluate(() => {
            const trigger = document.querySelector('.account-switcher-trigger');
            if (!trigger) return null;
            
            return {
                text: trigger.textContent,
                visible: trigger.offsetParent !== null,
                className: trigger.className
            };
        });
        
        if (triggerInfo) {
            console.log(`   ✅ Trigger button found`);
            console.log(`      Text: "${triggerInfo.text}"`);
            console.log(`      Visible: ${triggerInfo.visible}`);
        } else {
            console.log(`   ❌ Trigger button not found`);
        }
        
        console.log('\n📋 Test 3: Test dropdown toggle');
        
        // Click the trigger to open dropdown
        await page.click('.account-switcher-trigger');
        await delay(500);
        
        const dropdownOpen = await page.evaluate(() => {
            const dropdown = document.querySelector('.account-dropdown');
            return dropdown && dropdown.classList.contains('show');
        });
        
        console.log(`   ${dropdownOpen ? '✅' : '❌'} Dropdown opened on click`);
        
        // Get account list
        const accounts = await page.evaluate(() => {
            const items = document.querySelectorAll('.account-item');
            return Array.from(items).map(item => ({
                name: item.querySelector('.account-name')?.textContent || '',
                balance: item.querySelector('.account-balance')?.textContent || '',
                isActive: item.classList.contains('active')
            }));
        });
        
        console.log(`   📊 Found ${accounts.length} accounts in dropdown:`);
        accounts.forEach((acc, i) => {
            console.log(`      ${i + 1}. ${acc.name} - ${acc.balance} ${acc.isActive ? '(Active)' : ''}`);
        });
        
        console.log('\n📋 Test 4: Test account switching');
        
        if (accounts.length > 1) {
            // Find a non-active account to switch to
            const targetIndex = accounts.findIndex(acc => !acc.isActive);
            if (targetIndex !== -1) {
                const targetName = accounts[targetIndex].name;
                console.log(`   🔄 Switching to: ${targetName}`);
                
                // Click on the target account
                await page.evaluate((index) => {
                    const items = document.querySelectorAll('.account-item');
                    if (items[index]) items[index].click();
                }, targetIndex);
                
                await delay(1000);
                
                // Check if account switched
                const newActiveAccount = await page.evaluate(() => {
                    const currentAccount = window.app.state.getCurrentAccount();
                    return currentAccount ? currentAccount.name : null;
                });
                
                console.log(`   ${newActiveAccount === targetName ? '✅' : '❌'} Account switched successfully`);
                console.log(`      Current account: ${newActiveAccount}`);
                
                // Check if dropdown closed
                const dropdownClosed = await page.evaluate(() => {
                    const dropdown = document.querySelector('.account-dropdown');
                    return !dropdown || !dropdown.classList.contains('show');
                });
                
                console.log(`   ${dropdownClosed ? '✅' : '❌'} Dropdown closed after selection`);
                
                // Check if trigger updated
                const updatedTrigger = await page.evaluate(() => {
                    const trigger = document.querySelector('.account-switcher-trigger');
                    return trigger ? trigger.textContent : null;
                });
                
                console.log(`   ${updatedTrigger?.includes(targetName) ? '✅' : '❌'} Trigger text updated`);
                console.log(`      New trigger text: "${updatedTrigger}"`);
            }
        } else {
            console.log('   ⚠️  Not enough accounts to test switching');
        }
        
        console.log('\n📋 Test 5: Test click outside to close');
        
        // Open dropdown again
        await page.click('.account-switcher-trigger');
        await delay(500);
        
        // Click outside
        await page.click('body');
        await delay(500);
        
        const dropdownClosedOutside = await page.evaluate(() => {
            const dropdown = document.querySelector('.account-dropdown');
            return !dropdown || !dropdown.classList.contains('show');
        });
        
        console.log(`   ${dropdownClosedOutside ? '✅' : '❌'} Dropdown closed on outside click`);
        
        console.log('\n📋 Test 6: Test state persistence');
        
        // Get current account before reload
        const accountBeforeReload = await page.evaluate(() => {
            const current = window.app.state.getCurrentAccount();
            return current ? current.name : null;
        });
        
        // Reload page
        await page.reload();
        await delay(2000);
        
        // Check if same account is active
        const accountAfterReload = await page.evaluate(() => {
            const current = window.app.state.getCurrentAccount();
            return current ? current.name : null;
        });
        
        console.log(`   ${accountBeforeReload === accountAfterReload ? '✅' : '❌'} Active account persisted after reload`);
        console.log(`      Before: ${accountBeforeReload}`);
        console.log(`      After: ${accountAfterReload}`);
        
        console.log('\n✅ AccountSwitcher tests completed!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
    } finally {
        await delay(3000); // Keep browser open for observation
        await browser.close();
    }
}

// Run the tests
testAccountSwitcher();