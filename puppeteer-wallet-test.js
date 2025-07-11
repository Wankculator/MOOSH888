const puppeteer = require('puppeteer');

async function testWallet() {
    // Launch browser
    const browser = await puppeteer.launch({
        headless: false, // Set to false to see the browser
        defaultViewport: null,
        args: ['--start-maximized']
    });

    try {
        // Create a new page
        const page = await browser.newPage();
        
        // Navigate to your wallet
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
        
        // Wait for the page to load
        await page.waitForTimeout(2000);
        
        // Take a screenshot
        await page.screenshot({ path: 'wallet-screenshot.png', fullPage: true });
        console.log('Screenshot saved as wallet-screenshot.png');
        
        // Get page title
        const title = await page.title();
        console.log('Page title:', title);
        
        // Check if specific elements exist
        const hasGenerateButton = await page.$('#generateWalletBtn') !== null;
        console.log('Generate wallet button exists:', hasGenerateButton);
        
        // Get all buttons on the page
        const buttons = await page.$$eval('button', buttons => 
            buttons.map(btn => ({
                text: btn.innerText,
                id: btn.id,
                classes: btn.className
            }))
        );
        console.log('Buttons found:', buttons);
        
        // Get navigation items
        const navItems = await page.$$eval('.nav-link', links => 
            links.map(link => ({
                text: link.innerText,
                href: link.href,
                classes: link.className
            }))
        );
        console.log('Navigation items:', navItems);
        
        // Example: Click generate wallet button if it exists
        if (hasGenerateButton) {
            console.log('Clicking generate wallet button...');
            await page.click('#generateWalletBtn');
            await page.waitForTimeout(2000);
            
            // Check if modal appeared
            const modalVisible = await page.$('.modal.show') !== null;
            console.log('Modal visible after click:', modalVisible);
        }
        
        // Keep browser open for manual interaction
        console.log('\nBrowser will stay open. Press Ctrl+C to close.');
        await new Promise(() => {}); // Keep process running
        
    } catch (error) {
        console.error('Error during test:', error);
    } finally {
        // Browser will close when you stop the script
        // await browser.close();
    }
}

// Run the test
testWallet().catch(console.error);