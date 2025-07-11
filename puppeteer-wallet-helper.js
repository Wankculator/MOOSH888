const puppeteer = require('puppeteer');
const readline = require('readline');

class WalletHelper {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ['--start-maximized']
        });
        
        this.page = await this.browser.newPage();
        await this.page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
        console.log('Wallet loaded successfully');
    }

    async getElementInfo(selector) {
        try {
            const element = await this.page.$(selector);
            if (!element) {
                return { exists: false };
            }

            const info = await this.page.evaluate(el => {
                const rect = el.getBoundingClientRect();
                return {
                    exists: true,
                    text: el.innerText || el.value || '',
                    tagName: el.tagName,
                    id: el.id,
                    classes: el.className,
                    visible: el.offsetParent !== null,
                    position: {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    },
                    attributes: Array.from(el.attributes).reduce((acc, attr) => {
                        acc[attr.name] = attr.value;
                        return acc;
                    }, {})
                };
            }, element);

            return info;
        } catch (error) {
            return { exists: false, error: error.message };
        }
    }

    async getAllElements(selector) {
        const elements = await this.page.$$eval(selector, els => 
            els.map(el => ({
                text: el.innerText || el.value || '',
                id: el.id,
                classes: el.className,
                tagName: el.tagName,
                visible: el.offsetParent !== null
            }))
        );
        return elements;
    }

    async clickElement(selector) {
        try {
            await this.page.click(selector);
            await this.page.waitForTimeout(1000);
            return { success: true, message: `Clicked ${selector}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async typeText(selector, text) {
        try {
            await this.page.type(selector, text);
            return { success: true, message: `Typed text into ${selector}` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async takeScreenshot(filename = 'wallet-current.png') {
        await this.page.screenshot({ path: filename, fullPage: true });
        return { success: true, path: filename };
    }

    async getCurrentState() {
        const state = await this.page.evaluate(() => {
            return {
                url: window.location.href,
                title: document.title,
                bodyClasses: document.body.className,
                activeElement: document.activeElement ? {
                    tagName: document.activeElement.tagName,
                    id: document.activeElement.id,
                    classes: document.activeElement.className
                } : null,
                modals: Array.from(document.querySelectorAll('.modal')).map(modal => ({
                    id: modal.id,
                    visible: modal.classList.contains('show'),
                    title: modal.querySelector('.modal-title')?.innerText || ''
                })),
                forms: Array.from(document.querySelectorAll('form')).map(form => ({
                    id: form.id,
                    action: form.action,
                    method: form.method
                }))
            };
        });
        return state;
    }

    async waitForElement(selector, timeout = 5000) {
        try {
            await this.page.waitForSelector(selector, { timeout });
            return { success: true, message: `Element ${selector} found` };
        } catch (error) {
            return { success: false, error: `Element ${selector} not found within ${timeout}ms` };
        }
    }

    async executeScript(script) {
        try {
            const result = await this.page.evaluate(script);
            return { success: true, result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Interactive CLI
async function runInteractive() {
    const helper = new WalletHelper();
    await helper.init();
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\nWallet Helper Ready! Commands:');
    console.log('- info <selector>: Get element info');
    console.log('- all <selector>: Get all matching elements');
    console.log('- click <selector>: Click an element');
    console.log('- type <selector> <text>: Type text into an element');
    console.log('- screenshot [filename]: Take a screenshot');
    console.log('- state: Get current page state');
    console.log('- wait <selector>: Wait for element');
    console.log('- exec <script>: Execute JavaScript');
    console.log('- exit: Close browser and exit\n');

    const askCommand = () => {
        rl.question('> ', async (input) => {
            const [command, ...args] = input.trim().split(' ');
            
            try {
                switch(command) {
                    case 'info':
                        console.log(await helper.getElementInfo(args[0]));
                        break;
                    case 'all':
                        console.log(await helper.getAllElements(args[0]));
                        break;
                    case 'click':
                        console.log(await helper.clickElement(args[0]));
                        break;
                    case 'type':
                        const selector = args[0];
                        const text = args.slice(1).join(' ');
                        console.log(await helper.typeText(selector, text));
                        break;
                    case 'screenshot':
                        console.log(await helper.takeScreenshot(args[0]));
                        break;
                    case 'state':
                        console.log(JSON.stringify(await helper.getCurrentState(), null, 2));
                        break;
                    case 'wait':
                        console.log(await helper.waitForElement(args[0]));
                        break;
                    case 'exec':
                        const script = args.join(' ');
                        console.log(await helper.executeScript(script));
                        break;
                    case 'exit':
                        await helper.close();
                        rl.close();
                        process.exit(0);
                        break;
                    default:
                        console.log('Unknown command');
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
            
            askCommand();
        });
    };

    askCommand();
}

// Export for use in other scripts
module.exports = WalletHelper;

// Run interactive mode if called directly
if (require.main === module) {
    runInteractive().catch(console.error);
}