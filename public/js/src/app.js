// MOOSH WALLET - Main Application Entry Point
// Modular architecture with professional patterns

// Import core utilities
import { $, ElementFactory } from './utils/ElementFactory.js';
import { ResponsiveUtils } from './utils/ResponsiveUtils.js';

// Import services
import { bitcoinService } from './services/BitcoinService.js';

// Import core systems
import { eventBus, Events, StateKeys } from './core/EventBus.js';

// Import components
import { Button, buttonStyles, createButton } from './components/Button.js';

// Main Application Class
class MooshWalletApp {
    constructor() {
        this.initialized = false;
        this.components = new Map();
        this.currentView = 'landing';
        
        // Bind methods
        this.handleCreateWallet = this.handleCreateWallet.bind(this);
        this.handleImportWallet = this.handleImportWallet.bind(this);
        this.navigateToDashboard = this.navigateToDashboard.bind(this);
    }
    
    async init() {
        console.log('🚀 Initializing MOOSH Wallet...');
        
        try {
            // Initialize services
            await bitcoinService.initialize();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load saved state
            this.loadSavedState();
            
            // Setup responsive handlers
            ResponsiveUtils.setupViewportHandler();
            
            // Add styles
            this.injectStyles();
            
            // Initial render
            this.render();
            
            this.initialized = true;
            eventBus.emit(Events.APP_READY);
            
            console.log('✅ MOOSH Wallet initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize MOOSH Wallet:', error);
            eventBus.emit(Events.APP_ERROR, error);
        }
    }
    
    setupEventListeners() {
        // Wallet events
        eventBus.on(Events.WALLET_CREATED, (wallet) => {
            console.log('Wallet created:', wallet);
            this.navigateToDashboard();
        });
        
        eventBus.on(Events.WALLET_IMPORTED, (wallet) => {
            console.log('Wallet imported:', wallet);
            this.navigateToDashboard();
        });
        
        // Theme changes
        eventBus.on(Events.THEME_CHANGED, (theme) => {
            document.body.className = `theme-${theme}`;
            localStorage.setItem('moosh-theme', theme);
        });
        
        // Viewport changes
        window.addEventListener('viewportchange', (e) => {
            console.log('Viewport changed:', e.detail);
            if (this.currentView === 'dashboard') {
                this.updateDashboardLayout();
            }
        });
    }
    
    loadSavedState() {
        // Load theme
        const savedTheme = localStorage.getItem('moosh-theme') || 'dark';
        eventBus.setState(StateKeys.CURRENT_THEME, savedTheme);
        document.body.className = `theme-${savedTheme}`;
        
        // Check for existing wallet
        const savedWallet = localStorage.getItem('moosh-wallet');
        if (savedWallet) {
            try {
                const wallet = JSON.parse(savedWallet);
                eventBus.setState(StateKeys.CURRENT_WALLET, wallet);
                this.currentView = 'dashboard';
            } catch (error) {
                console.error('Failed to load saved wallet:', error);
            }
        }
    }
    
    render() {
        const app = document.getElementById('app');
        if (!app) {
            console.error('App container not found');
            return;
        }
        
        app.innerHTML = '';
        
        switch (this.currentView) {
            case 'landing':
                app.appendChild(this.renderLanding());
                break;
            case 'dashboard':
                app.appendChild(this.renderDashboard());
                break;
            default:
                app.appendChild(this.renderError());
        }
    }
    
    renderLanding() {
        const container = $.div({ className: 'app-container' }, [
            // Header
            $.header({ className: 'app-header' }, [
                $.div({ className: 'header-content' }, [
                    $.img({
                        src: '/04_ASSETS/Brand_Assets/Logos/Moosh_logo.png',
                        alt: 'MOOSH Wallet',
                        className: 'app-logo',
                        style: {
                            height: 'calc(48px * var(--scale-factor))',
                            width: 'auto'
                        }
                    }),
                    $.h1({ className: 'app-title' }, ['MOOSH WALLET'])
                ])
            ]),
            
            // Main content
            $.main({ className: 'app-main' }, [
                $.div({ className: 'landing-card' }, [
                    $.h2({ className: 'landing-title' }, ['Welcome to MOOSH']),
                    $.p({ className: 'landing-subtitle' }, [
                        'Professional Bitcoin wallet with Lightning support'
                    ]),
                    
                    // Password section
                    $.div({ className: 'password-section' }, [
                        $.label({ 
                            className: 'input-label',
                            htmlFor: 'password'
                        }, ['Create Password']),
                        $.input({
                            type: 'password',
                            id: 'password',
                            className: 'password-input',
                            placeholder: 'Enter password (min 8 characters)',
                            autocomplete: 'new-password'
                        }),
                        
                        $.label({ 
                            className: 'input-label',
                            htmlFor: 'confirmPassword',
                            style: { marginTop: 'calc(16px * var(--scale-factor))' }
                        }, ['Confirm Password']),
                        $.input({
                            type: 'password',
                            id: 'confirmPassword',
                            className: 'password-input',
                            placeholder: 'Confirm password',
                            autocomplete: 'new-password'
                        }),
                        
                        $.div({ 
                            id: 'passwordError',
                            className: 'error-message',
                            style: { display: 'none' }
                        })
                    ]),
                    
                    // Action buttons
                    $.div({ className: 'wallet-actions' }, [
                        createButton({
                            text: 'Create New Wallet',
                            variant: 'primary',
                            size: 'large',
                            fullWidth: true,
                            onClick: this.handleCreateWallet
                        }),
                        
                        createButton({
                            text: 'Import Existing Wallet',
                            variant: 'secondary',
                            size: 'large',
                            fullWidth: true,
                            onClick: this.handleImportWallet
                        })
                    ])
                ])
            ])
        ]);
        
        return container;
    }
    
    renderDashboard() {
        const wallet = eventBus.getState(StateKeys.CURRENT_WALLET);
        
        return $.div({ className: 'dashboard-container' }, [
            // Dashboard header
            $.header({ className: 'dashboard-header' }, [
                $.div({ className: 'header-left' }, [
                    $.h1({ className: 'dashboard-title' }, ['MOOSH WALLET'])
                ]),
                $.div({ className: 'header-right' }, [
                    createButton({
                        text: 'Settings',
                        variant: 'ghost',
                        size: 'small',
                        onClick: () => this.showSettings()
                    }),
                    createButton({
                        text: 'Lock',
                        variant: 'ghost',
                        size: 'small',
                        onClick: () => this.lockWallet()
                    })
                ])
            ]),
            
            // Balance display
            $.div({ className: 'balance-section' }, [
                $.div({ className: 'balance-label' }, ['Total Balance']),
                $.div({ className: 'balance-amount' }, ['0.00000000 BTC']),
                $.div({ className: 'balance-usd' }, ['≈ $0.00 USD'])
            ]),
            
            // Action buttons
            $.div({ className: 'action-buttons' }, [
                createButton({
                    text: 'Send',
                    variant: 'primary',
                    size: 'large',
                    onClick: () => this.showSendModal()
                }),
                createButton({
                    text: 'Receive',
                    variant: 'primary',
                    size: 'large',
                    onClick: () => this.showReceiveModal()
                }),
                createButton({
                    text: 'Swap',
                    variant: 'secondary',
                    size: 'large',
                    onClick: () => this.showSwapModal()
                })
            ]),
            
            // Transaction history
            $.div({ className: 'transactions-section' }, [
                $.h2({ className: 'section-title' }, ['Recent Transactions']),
                $.div({ className: 'transactions-list' }, [
                    $.p({ className: 'empty-state' }, ['No transactions yet'])
                ])
            ])
        ]);
    }
    
    renderError() {
        return $.div({ className: 'error-container' }, [
            $.h1({}, ['Something went wrong']),
            $.p({}, ['Please refresh the page and try again']),
            createButton({
                text: 'Refresh',
                variant: 'primary',
                onClick: () => window.location.reload()
            })
        ]);
    }
    
    async handleCreateWallet() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorDiv = document.getElementById('passwordError');
        
        // Validate passwords
        if (password.length < 8) {
            errorDiv.textContent = 'Password must be at least 8 characters';
            errorDiv.style.display = 'block';
            return;
        }
        
        if (password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match';
            errorDiv.style.display = 'block';
            return;
        }
        
        errorDiv.style.display = 'none';
        
        try {
            // Generate mnemonic
            const { mnemonic } = await bitcoinService.generateMnemonic();
            
            // Create wallet
            const wallet = await bitcoinService.createWallet(mnemonic, password);
            
            // Save to state
            eventBus.setState(StateKeys.CURRENT_WALLET, wallet);
            localStorage.setItem('moosh-wallet', JSON.stringify(wallet));
            
            // Emit event
            eventBus.emit(Events.WALLET_CREATED, wallet);
            
            // Show mnemonic backup screen (TODO)
            console.log('Mnemonic:', mnemonic);
            
        } catch (error) {
            errorDiv.textContent = 'Failed to create wallet: ' + error.message;
            errorDiv.style.display = 'block';
        }
    }
    
    async handleImportWallet() {
        // TODO: Show import modal
        console.log('Import wallet clicked');
    }
    
    navigateToDashboard() {
        this.currentView = 'dashboard';
        this.render();
    }
    
    showSettings() {
        console.log('Show settings');
        // TODO: Implement settings modal
    }
    
    lockWallet() {
        eventBus.setState(StateKeys.CURRENT_WALLET, null);
        localStorage.removeItem('moosh-wallet');
        this.currentView = 'landing';
        this.render();
        eventBus.emit(Events.WALLET_LOCKED);
    }
    
    showSendModal() {
        console.log('Show send modal');
        // TODO: Implement send modal
    }
    
    showReceiveModal() {
        console.log('Show receive modal');
        // TODO: Implement receive modal
    }
    
    showSwapModal() {
        console.log('Show swap modal');
        // TODO: Implement swap modal
    }
    
    updateDashboardLayout() {
        // Responsive dashboard updates
        const isMobile = ResponsiveUtils.isMobile();
        const actionButtons = document.querySelector('.action-buttons');
        
        if (actionButtons) {
            actionButtons.style.flexDirection = isMobile ? 'column' : 'row';
        }
    }
    
    injectStyles() {
        if (document.getElementById('moosh-wallet-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'moosh-wallet-styles';
        style.textContent = `
            ${buttonStyles}
            
            /* CSS Variables */
            :root {
                --scale-factor: 1;
                --font-base: 14px;
                --spacing-unit: 8px;
                --container-padding: 24px;
                --button-height: 48px;
                --input-height: 48px;
                --touch-target-min: 44px;
                
                /* Colors */
                --bg-primary: #0a0a0a;
                --bg-secondary: #1a1a1a;
                --text-primary: #ffffff;
                --text-secondary: #888888;
                --text-dim: #666666;
                --border-color: #333333;
                --text-accent: #69fd97;
                --text-keyword: #ff8c42;
            }
            
            /* Base styles */
            * {
                box-sizing: border-box;
            }
            
            body {
                margin: 0;
                padding: 0;
                font-family: 'JetBrains Mono', monospace;
                background: var(--bg-primary);
                color: var(--text-primary);
                min-height: 100vh;
            }
            
            #app {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }
            
            /* App container */
            .app-container {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
            }
            
            /* Header */
            .app-header {
                padding: calc(var(--container-padding) * var(--scale-factor));
                border-bottom: 1px solid var(--border-color);
            }
            
            .header-content {
                display: flex;
                align-items: center;
                gap: calc(16px * var(--scale-factor));
            }
            
            .app-title {
                font-size: calc(24px * var(--scale-factor));
                margin: 0;
                color: var(--text-accent);
            }
            
            /* Main content */
            .app-main {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: calc(var(--container-padding) * var(--scale-factor));
            }
            
            /* Landing card */
            .landing-card {
                background: var(--bg-secondary);
                border: 2px solid var(--border-color);
                padding: calc(32px * var(--scale-factor));
                max-width: calc(480px * var(--scale-factor));
                width: 100%;
            }
            
            .landing-title {
                font-size: calc(28px * var(--scale-factor));
                margin: 0 0 calc(8px * var(--scale-factor));
                text-align: center;
            }
            
            .landing-subtitle {
                color: var(--text-secondary);
                text-align: center;
                margin: 0 0 calc(32px * var(--scale-factor));
            }
            
            /* Password section */
            .password-section {
                margin-bottom: calc(24px * var(--scale-factor));
            }
            
            .input-label {
                display: block;
                margin-bottom: calc(8px * var(--scale-factor));
                color: var(--text-secondary);
                font-size: calc(12px * var(--scale-factor));
            }
            
            .password-input {
                width: 100%;
                height: calc(var(--input-height) * var(--scale-factor));
                background: var(--bg-primary);
                border: 2px solid var(--border-color);
                color: var(--text-primary);
                padding: 0 calc(16px * var(--scale-factor));
                font-family: inherit;
                font-size: calc(14px * var(--scale-factor));
                outline: none;
                transition: border-color 0.2s ease;
            }
            
            .password-input:focus {
                border-color: var(--text-accent);
            }
            
            .error-message {
                color: #dc3545;
                font-size: calc(12px * var(--scale-factor));
                margin-top: calc(8px * var(--scale-factor));
            }
            
            /* Wallet actions */
            .wallet-actions {
                display: flex;
                flex-direction: column;
                gap: calc(12px * var(--scale-factor));
            }
            
            /* Dashboard styles */
            .dashboard-container {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: calc(var(--container-padding) * var(--scale-factor));
                border-bottom: 1px solid var(--border-color);
            }
            
            .dashboard-title {
                font-size: calc(20px * var(--scale-factor));
                margin: 0;
                color: var(--text-accent);
            }
            
            .header-right {
                display: flex;
                gap: calc(8px * var(--scale-factor));
            }
            
            .balance-section {
                text-align: center;
                padding: calc(48px * var(--scale-factor)) calc(var(--container-padding) * var(--scale-factor));
                background: var(--bg-secondary);
            }
            
            .balance-label {
                color: var(--text-secondary);
                font-size: calc(14px * var(--scale-factor));
                margin-bottom: calc(8px * var(--scale-factor));
            }
            
            .balance-amount {
                font-size: calc(36px * var(--scale-factor));
                font-weight: 600;
                margin-bottom: calc(4px * var(--scale-factor));
            }
            
            .balance-usd {
                color: var(--text-secondary);
                font-size: calc(16px * var(--scale-factor));
            }
            
            .action-buttons {
                display: flex;
                gap: calc(16px * var(--scale-factor));
                padding: calc(var(--container-padding) * var(--scale-factor));
                justify-content: center;
            }
            
            .transactions-section {
                flex: 1;
                padding: calc(var(--container-padding) * var(--scale-factor));
            }
            
            .section-title {
                font-size: calc(18px * var(--scale-factor));
                margin: 0 0 calc(16px * var(--scale-factor));
            }
            
            .transactions-list {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                padding: calc(24px * var(--scale-factor));
                min-height: calc(200px * var(--scale-factor));
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .empty-state {
                color: var(--text-secondary);
                margin: 0;
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                :root {
                    --scale-factor: 0.85;
                }
                
                .action-buttons {
                    flex-direction: column;
                }
                
                .action-buttons .moosh-button {
                    width: 100%;
                }
            }
            
            @media (max-width: 480px) {
                :root {
                    --scale-factor: 0.75;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new MooshWalletApp();
        app.init();
        
        // Expose to window for debugging
        window.mooshWallet = app;
    });
} else {
    const app = new MooshWalletApp();
    app.init();
    window.mooshWallet = app;
}

export default MooshWalletApp;