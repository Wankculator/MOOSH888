const puppeteer = require('puppeteer');

async function viewMooshWallet() {
    console.log('🚀 Launching browser to view MOOSH Wallet UI...');
    
    const browser = await puppeteer.launch({
        headless: false, // Show the browser window
        defaultViewport: null, // Use full screen
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    
    const page = await browser.newPage();
    
    // Navigate to the local server
    console.log('📱 Opening MOOSH Wallet at http://localhost:3333');
    await page.goto('http://localhost:3333', {
        waitUntil: 'networkidle2'
    });
    
    console.log('✅ MOOSH Wallet loaded successfully!');
    console.log('👀 Browser window is open - you can interact with the UI');
    console.log('');
    console.log('Navigation tips:');
    console.log('- Main page: http://localhost:3333');
    console.log('- Wallet details: http://localhost:3333/#wallet-details');
    console.log('- Dashboard: http://localhost:3333/#dashboard');
    console.log('');
    console.log('Press Ctrl+C to close the browser and exit');
    
    // Keep the browser open
    await new Promise(() => {});
}

// Run the viewer
viewMooshWallet().catch(console.error);