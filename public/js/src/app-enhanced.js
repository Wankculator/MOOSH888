// MOOSH WALLET - Enhanced App with HTML Integration
// Uses existing HTML structure instead of creating everything in JS

// Import existing modules - they all still work!
import { ResponsiveUtils } from './utils/ResponsiveUtils.js';
import { bitcoinService } from './services/BitcoinService.js';
import { eventBus, Events, StateKeys } from './core/EventBus.js';

class MooshWalletEnhanced {
    constructor() {
        // Cache DOM elements
        this.elements = {
            // Views
            landingView: document.getElementById('landingView'),
            dashboardView: document.getElementById('dashboardView'),
            
            // Landing elements
            createWalletForm: document.getElementById('createWalletForm'),
            passwordInput: document.getElementById('password'),
            confirmPasswordInput: document.getElementById('confirmPassword'),
            passwordError: document.getElementById('passwordError'),
            importWalletBtn: document.getElementById('importWalletBtn'),
            
            // Dashboard elements
            balanceAmount: document.getElementById('balanceAmount'),
            balanceUSD: document.getElementById('balanceUSD'),
            transactionsList: document.getElementById('transactionsList'),
            sendBtn: document.getElementById('sendBtn'),
            receiveBtn: document.getElementById('receiveBtn'),
            swapBtn: document.getElementById('swapBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            lockBtn: document.getElementById('lockBtn')
        };
        
        this.currentView = 'landing';
    }
    
    async init() {
        console.log('🚀 Initializing MOOSH Wallet (HTML Enhanced)...');
        
        try {
            // Initialize services - exactly the same as before!
            await bitcoinService.initialize();
            
            // Setup event listeners
            this.setupEventListeners();
            this.attachDOMListeners();
            
            // Load saved state
            this.loadSavedState();
            
            // Setup responsive handlers - still works!
            ResponsiveUtils.setupViewportHandler();
            
            // Check initial view
            this.updateView();
            
            eventBus.emit(Events.APP_READY);
            console.log('✅ MOOSH Wallet initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize:', error);
            eventBus.emit(Events.APP_ERROR, error);
        }
    }
    
    attachDOMListeners() {
        // Form submission
        this.elements.createWalletForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateWallet();
        });
        
        // Import wallet button
        this.elements.importWalletBtn.addEventListener('click', () => {
            this.handleImportWallet();
        });
        
        // Dashboard buttons
        this.elements.sendBtn?.addEventListener('click', () => this.showSendModal());
        this.elements.receiveBtn?.addEventListener('click', () => this.showReceiveModal());
        this.elements.swapBtn?.addEventListener('click', () => this.showSwapModal());
        this.elements.settingsBtn?.addEventListener('click', () => this.showSettings());
        this.elements.lockBtn?.addEventListener('click', () => this.lockWallet());
        
        // Password validation
        this.elements.confirmPasswordInput.addEventListener('input', () => {
            this.validatePasswords();
        });
    }
    
    setupEventListeners() {
        // Same event listeners as before - no changes needed!
        eventBus.on(Events.WALLET_CREATED, (wallet) => {
            console.log('Wallet created:', wallet);
            this.showDashboard();
        });
        
        eventBus.on(Events.WALLET_IMPORTED, (wallet) => {
            console.log('Wallet imported:', wallet);
            this.showDashboard();
        });
        
        eventBus.on(Events.THEME_CHANGED, (theme) => {
            document.body.className = `theme-${theme}`;
            localStorage.setItem('moosh-theme', theme);
        });
    }
    
    loadSavedState() {
        // Exactly the same as before
        const savedTheme = localStorage.getItem('moosh-theme') || 'dark';
        eventBus.setState(StateKeys.CURRENT_THEME, savedTheme);
        document.body.className = `theme-${savedTheme}`;
        
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
    
    updateView() {
        // Simple view switching with HTML sections
        if (this.currentView === 'landing') {
            this.elements.landingView.hidden = false;
            this.elements.dashboardView.hidden = true;
        } else {
            this.elements.landingView.hidden = true;
            this.elements.dashboardView.hidden = false;
            this.updateDashboard();
        }
    }
    
    showDashboard() {
        this.currentView = 'dashboard';
        this.updateView();
    }
    
    updateDashboard() {
        // Update balance display
        const wallet = eventBus.getState(StateKeys.CURRENT_WALLET);
        if (wallet) {
            // This would connect to real balance data
            this.elements.balanceAmount.textContent = '0.00000000 BTC';
            this.elements.balanceUSD.textContent = '≈ $0.00 USD';
        }
    }
    
    validatePasswords() {
        const password = this.elements.passwordInput.value;
        const confirmPassword = this.elements.confirmPasswordInput.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showError('Passwords do not match');
            return false;
        }
        
        this.hideError();
        return true;
    }
    
    showError(message) {
        this.elements.passwordError.textContent = message;
        this.elements.passwordError.style.display = 'block';
    }
    
    hideError() {
        this.elements.passwordError.textContent = '';
        this.elements.passwordError.style.display = 'none';
    }
    
    async handleCreateWallet() {
        const password = this.elements.passwordInput.value;
        const confirmPassword = this.elements.confirmPasswordInput.value;
        
        // Validate
        if (password.length < 8) {
            this.showError('Password must be at least 8 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }
        
        try {
            // Use the same BitcoinService!
            const { mnemonic } = await bitcoinService.generateMnemonic();
            const wallet = await bitcoinService.createWallet(mnemonic, password);
            
            eventBus.setState(StateKeys.CURRENT_WALLET, wallet);
            localStorage.setItem('moosh-wallet', JSON.stringify(wallet));
            eventBus.emit(Events.WALLET_CREATED, wallet);
            
            console.log('Mnemonic:', mnemonic);
            
        } catch (error) {
            this.showError('Failed to create wallet: ' + error.message);
        }
    }
    
    async handleImportWallet() {
        console.log('Import wallet - would show import modal');
        // TODO: Show import modal
    }
    
    lockWallet() {
        eventBus.setState(StateKeys.CURRENT_WALLET, null);
        localStorage.removeItem('moosh-wallet');
        this.currentView = 'landing';
        this.updateView();
        eventBus.emit(Events.WALLET_LOCKED);
    }
    
    // Modal methods - can reuse your existing modal components!
    showSendModal() {
        console.log('Show send modal');
    }
    
    showReceiveModal() {
        console.log('Show receive modal');
    }
    
    showSwapModal() {
        console.log('Show swap modal');
    }
    
    showSettings() {
        console.log('Show settings');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new MooshWalletEnhanced();
        app.init();
        window.mooshWallet = app;
    });
} else {
    const app = new MooshWalletEnhanced();
    app.init();
    window.mooshWallet = app;
}

export default MooshWalletEnhanced;