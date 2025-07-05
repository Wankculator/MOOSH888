// MOOSH WALLET - 100% PURE JAVASCRIPT IMPLEMENTATION
// Professional Bitcoin Wallet with NO HTML strings

(function() {
    'use strict';
    
    // Create and inject Google Fonts link
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    // Create main style element
    const styleElement = document.createElement('style');
    const styles = `
        /* MOBILE-FIRST RESPONSIVE DESIGN - Enhanced Build Rules v4.0 */
        :root {
            --bg-primary: #000000;
            --bg-secondary: #000000;
            --bg-tertiary: #0a0a0a;
            --bg-hover: #1a1a1a;
            --text-primary: #f57315;
            --text-secondary: #ffffff;
            --text-accent: #69fd97bd;
            --text-string: #9bffac;
            --text-keyword: #6fedbfc2;
            --text-comment: #c8fff2;
            --text-dim: #71767b;
            --accent-color: #1d1d1d;
            --border-color: #2f3336;
            --border-active: #51555a;
            --border-width: 0.25px;
            --transition-speed: 0.2s;
            --border-radius: 16px;
            
            /* DYNAMIC SCALING SYSTEM */
            --scale-factor: 0.8;        /* Mobile first */
            --font-base: 14px;          /* Base font size */
            --spacing-unit: 8px;        /* Base spacing */
            --container-padding: 16px;  /* Mobile padding */
            --button-height: 48px;      /* Touch-friendly buttons */
            --input-height: 44px;       /* Touch-friendly inputs */
        }
        
        /* RESPONSIVE SCALING - Dynamic breakpoints */
        @media (min-width: 480px) {
            :root {
                --scale-factor: 0.85;
                --font-base: 15px;
                --container-padding: 20px;
            }
        }
        
        @media (min-width: 768px) {
            :root {
                --scale-factor: 0.9;
                --font-base: 16px;
                --container-padding: 24px;
                --button-height: 44px;
                --input-height: 40px;
            }
        }
        
        @media (min-width: 1024px) {
            :root {
                --scale-factor: 0.95;
                --font-base: 16px;
                --container-padding: 32px;
            }
        }
        
        @media (min-width: 1200px) {
            :root {
                --scale-factor: 1.0;
            }
        }
        
        /* GLOBAL STYLES - Mobile First */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Roboto Mono', 'Consolas', monospace;
            background-color: var(--bg-primary);
            color: var(--text-secondary);
            line-height: 1.6;
            font-size: calc(var(--font-base) * var(--scale-factor));
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            min-height: 100vh;
            width: 100%;
            position: relative;
        }
        
        /* THEME VARIATIONS - MOOSH Mode */
        body.theme-spark {
            --text-primary: #69fd97bd;
            --text-accent: #f57315;
        }
        
        /* CURSOR THEME BASE - Enhanced for v4.0 */
        .cursor-theme {
            width: 100%;
            min-height: 100vh;
            background: var(--bg-primary);
            color: var(--text-secondary);
            position: relative;
            overflow-x: hidden;
        }
        
        /* CONTAINER SYSTEM - Dynamic Responsive */
        .cursor-container {
            max-width: calc(1200px * var(--scale-factor));
            margin: 0 auto;
            padding: calc(var(--container-padding) * var(--scale-factor));
            position: relative;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        /* HEADER SECTION - Professional Terminal Style */
        .cursor-header {
            background: var(--bg-primary);
            border-bottom: calc(var(--border-width) * var(--scale-factor)) solid var(--border-color);
            padding: calc(20px * var(--scale-factor)) 0;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        
        .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: calc(20px * var(--scale-factor));
        }
        
        .logo-section {
            display: flex;
            align-items: center;
            gap: calc(12px * var(--scale-factor));
            cursor: pointer;
            transition: transform var(--transition-speed) ease;
        }
        
        .logo-section:hover {
            transform: translateY(-2px);
        }
        
        .logo-icon {
            width: calc(32px * var(--scale-factor));
            height: calc(32px * var(--scale-factor));
            font-size: calc(24px * var(--scale-factor));
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .logo-text {
            font-size: calc(20px * var(--scale-factor));
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.02em;
            display: none;
        }
        
        @media (min-width: 480px) {
            .logo-text {
                display: block;
            }
        }
        
        /* ACTION BUTTONS - Mobile Optimized */
        .header-actions {
            display: flex;
            gap: calc(12px * var(--scale-factor));
            align-items: center;
        }
        
        .theme-toggle {
            background: transparent;
            border: calc(1px * var(--scale-factor)) solid var(--border-color);
            color: var(--text-primary);
            width: calc(var(--button-height) * var(--scale-factor));
            height: calc(var(--button-height) * var(--scale-factor));
            border-radius: calc(var(--border-radius) * var(--scale-factor));
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-speed) ease;
            font-size: calc(20px * var(--scale-factor));
        }
        
        .theme-toggle:hover {
            background: var(--bg-hover);
            border-color: var(--text-primary);
            transform: translateY(-2px);
        }
        
        /* MAIN CONTENT AREA */
        .cursor-content {
            flex: 1;
            padding: calc(40px * var(--scale-factor)) 0;
            display: flex;
            flex-direction: column;
            gap: calc(40px * var(--scale-factor));
        }
        
        /* HERO SECTION - Professional Welcome */
        .hero-section {
            text-align: center;
            padding: calc(40px * var(--scale-factor)) 0;
        }
        
        .hero-title {
            font-size: calc(48px * var(--scale-factor));
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: calc(16px * var(--scale-factor));
            letter-spacing: -0.02em;
            line-height: 1.1;
        }
        
        @media (max-width: 768px) {
            .hero-title {
                font-size: calc(36px * var(--scale-factor));
            }
        }
        
        .hero-subtitle {
            font-size: calc(18px * var(--scale-factor));
            color: var(--text-dim);
            margin-bottom: calc(32px * var(--scale-factor));
            line-height: 1.4;
        }
        
        /* FEATURE BADGES - Professional Display */
        .feature-badges {
            display: flex;
            gap: calc(16px * var(--scale-factor));
            justify-content: center;
            flex-wrap: wrap;
            margin-top: calc(24px * var(--scale-factor));
        }
        
        .badge {
            background: var(--bg-secondary);
            border: calc(1px * var(--scale-factor)) solid var(--border-color);
            padding: calc(8px * var(--scale-factor)) calc(16px * var(--scale-factor));
            border-radius: calc(var(--border-radius) * var(--scale-factor));
            font-size: calc(12px * var(--scale-factor));
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: calc(8px * var(--scale-factor));
            transition: all var(--transition-speed) ease;
        }
        
        .badge:hover {
            border-color: var(--text-primary);
            transform: translateY(-2px);
        }
        
        /* WALLET OPTIONS - Card Based Layout */
        .wallet-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(calc(280px * var(--scale-factor)), 1fr));
            gap: calc(24px * var(--scale-factor));
            margin-top: calc(40px * var(--scale-factor));
        }
        
        .option-card {
            background: var(--bg-secondary);
            border: calc(1px * var(--scale-factor)) solid var(--border-color);
            border-radius: calc(var(--border-radius) * var(--scale-factor));
            padding: calc(32px * var(--scale-factor));
            text-align: center;
            transition: all var(--transition-speed) ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        
        .option-card:hover {
            border-color: var(--text-primary);
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(245, 115, 21, 0.1);
        }
        
        .option-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: calc(4px * var(--scale-factor));
            background: var(--text-primary);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
        
        .option-card:hover::before {
            transform: translateX(0);
        }
        
        .option-icon {
            font-size: calc(48px * var(--scale-factor));
            margin-bottom: calc(16px * var(--scale-factor));
            filter: grayscale(0);
        }
        
        .option-title {
            font-size: calc(20px * var(--scale-factor));
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: calc(8px * var(--scale-factor));
        }
        
        .option-description {
            font-size: calc(14px * var(--scale-factor));
            color: var(--text-dim);
            line-height: 1.5;
        }
        
        /* WALLET FORM STYLES - Professional Forms */
        .wallet-form {
            background: var(--bg-secondary);
            border: calc(1px * var(--scale-factor)) solid var(--border-color);
            border-radius: calc(var(--border-radius) * var(--scale-factor));
            padding: calc(32px * var(--scale-factor));
            margin-top: calc(24px * var(--scale-factor));
        }
        
        .form-group {
            margin-bottom: calc(24px * var(--scale-factor));
        }
        
        .form-label {
            display: block;
            margin-bottom: calc(8px * var(--scale-factor));
            color: var(--text-primary);
            font-size: calc(14px * var(--scale-factor));
            font-weight: 500;
        }
        
        .form-input {
            width: 100%;
            padding: calc(12px * var(--scale-factor)) calc(16px * var(--scale-factor));
            background: var(--bg-primary);
            border: calc(1px * var(--scale-factor)) solid var(--border-color);
            border-radius: calc(8px * var(--scale-factor));
            color: var(--text-secondary);
            font-size: calc(14px * var(--scale-factor));
            font-family: 'JetBrains Mono', monospace;
            transition: all var(--transition-speed) ease;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--text-primary);
            box-shadow: 0 0 0 3px rgba(245, 115, 21, 0.1);
        }
        
        .form-input::placeholder {
            color: var(--text-dim);
        }
        
        /* PASSWORD INPUT GROUP - Enhanced Security Display */
        .password-input-group {
            position: relative;
            display: flex;
            align-items: center;
        }
        
        .password-input {
            flex: 1;
            padding-right: calc(48px * var(--scale-factor));
        }
        
        .password-toggle {
            position: absolute;
            right: calc(12px * var(--scale-factor));
            background: transparent;
            border: none;
            color: var(--text-dim);
            cursor: pointer;
            padding: calc(8px * var(--scale-factor));
            font-size: calc(16px * var(--scale-factor));
            transition: color var(--transition-speed) ease;
        }
        
        .password-toggle:hover {
            color: var(--text-primary);
        }
        
        /* MNEMONIC DISPLAY - Word Grid */
        .mnemonic-display {
            background: var(--bg-primary);
            border: calc(1px * var(--scale-factor)) solid var(--text-primary);
            border-radius: calc(8px * var(--scale-factor));
            padding: calc(24px * var(--scale-factor));
            margin: calc(24px * var(--scale-factor)) 0;
        }
        
        .mnemonic-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(calc(100px * var(--scale-factor)), 1fr));
            gap: calc(12px * var(--scale-factor));
        }
        
        .mnemonic-word {
            background: var(--bg-secondary);
            border: calc(1px * var(--scale-factor)) solid var(--border-color);
            padding: calc(8px * var(--scale-factor)) calc(12px * var(--scale-factor));
            border-radius: calc(6px * var(--scale-factor));
            text-align: center;
            font-size: calc(12px * var(--scale-factor));
            color: var(--text-primary);
            font-weight: 500;
        }
        
        .word-number {
            color: var(--text-dim);
            margin-right: calc(8px * var(--scale-factor));
        }
        
        /* BUTTONS - Professional CTA Design */
        .btn {
            padding: calc(14px * var(--scale-factor)) calc(28px * var(--scale-factor));
            border: calc(2px * var(--scale-factor)) solid transparent;
            border-radius: calc(8px * var(--scale-factor));
            font-size: calc(14px * var(--scale-factor));
            font-weight: 600;
            font-family: 'JetBrains Mono', monospace;
            cursor: pointer;
            transition: all var(--transition-speed) ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            min-height: calc(var(--button-height) * var(--scale-factor));
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: calc(8px * var(--scale-factor));
        }
        
        .btn-primary {
            background: var(--text-primary);
            color: var(--bg-primary);
            border-color: var(--text-primary);
        }
        
        .btn-primary:hover {
            background: transparent;
            color: var(--text-primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(245, 115, 21, 0.3);
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--text-primary);
            border-color: var(--border-color);
        }
        
        .btn-secondary:hover {
            border-color: var(--text-primary);
            transform: translateY(-2px);
        }
        
        .btn-danger {
            background: transparent;
            color: #ff4444;
            border-color: #ff4444;
        }
        
        .btn-danger:hover {
            background: #ff4444;
            color: var(--bg-primary);
        }
        
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
        }
        
        /* RADIO BUTTONS - Custom Design */
        .radio-group {
            display: flex;
            gap: calc(24px * var(--scale-factor));
            margin: calc(16px * var(--scale-factor)) 0;
        }
        
        .radio-item {
            display: flex;
            align-items: center;
            gap: calc(8px * var(--scale-factor));
            cursor: pointer;
        }
        
        .radio-button {
            width: calc(20px * var(--scale-factor));
            height: calc(20px * var(--scale-factor));
            border: calc(2px * var(--scale-factor)) solid var(--border-color);
            border-radius: 50%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-speed) ease;
        }
        
        .radio-inner {
            width: calc(8px * var(--scale-factor));
            height: calc(8px * var(--scale-factor));
            background: transparent;
            border-radius: 50%;
            transition: all var(--transition-speed) ease;
        }
        
        .radio-label {
            font-size: calc(14px * var(--scale-factor));
            color: var(--text-secondary);
        }
        
        /* NOTIFICATIONS - Professional Toast System */
        .notification {
            position: fixed;
            padding: calc(16px * var(--scale-factor)) calc(24px * var(--scale-factor));
            background: var(--bg-primary);
            border: calc(2px * var(--scale-factor)) solid var(--text-primary);
            border-radius: calc(8px * var(--scale-factor));
            font-size: calc(14px * var(--scale-factor));
            font-weight: 500;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
        
        /* NAVIGATION BUTTONS - Mobile Optimized */
        .nav-buttons {
            display: flex;
            gap: calc(16px * var(--scale-factor));
            margin-top: calc(32px * var(--scale-factor));
            justify-content: center;
            flex-wrap: wrap;
        }
        
        /* FOOTER - Professional Credits */
        .cursor-footer {
            background: var(--bg-secondary);
            border-top: calc(var(--border-width) * var(--scale-factor)) solid var(--border-color);
            padding: calc(32px * var(--scale-factor)) 0;
            margin-top: auto;
            text-align: center;
        }
        
        .footer-content {
            display: flex;
            flex-direction: column;
            gap: calc(16px * var(--scale-factor));
            align-items: center;
        }
        
        .footer-links {
            display: flex;
            gap: calc(24px * var(--scale-factor));
            flex-wrap: wrap;
            justify-content: center;
        }
        
        .footer-link {
            color: var(--text-dim);
            text-decoration: none;
            font-size: calc(14px * var(--scale-factor));
            transition: color var(--transition-speed) ease;
        }
        
        .footer-link:hover {
            color: var(--text-primary);
        }
        
        .footer-text {
            color: var(--text-dim);
            font-size: calc(12px * var(--scale-factor));
        }
        
        /* ANIMATIONS */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(-100%);
            }
            to {
                transform: translateX(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        /* RESPONSIVE UTILITIES */
        @media (max-width: 768px) {
            .hide-mobile {
                display: none !important;
            }
        }
        
        @media (min-width: 769px) {
            .hide-desktop {
                display: none !important;
            }
        }
        
        /* THEME-SPECIFIC OVERRIDES */
        body.theme-spark .btn-primary {
            background: var(--text-primary);
            border-color: var(--text-primary);
            color: var(--bg-primary);
        }
        
        body.theme-spark .btn-primary:hover {
            background: transparent;
            color: var(--text-primary);
        }
        
        /* LOADING STATES */
        .loading {
            position: relative;
            overflow: hidden;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(245, 115, 21, 0.1), transparent);
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }
        
        /* BUY BUTTON SPECIAL STYLING */
        .buy-button {
            background: var(--text-primary);
            color: var(--bg-primary);
            border: calc(2px * var(--scale-factor)) solid var(--text-primary);
            padding: calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor));
            font-weight: 700;
            letter-spacing: 0.1em;
            position: relative;
            overflow: hidden;
        }
        
        .buy-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .buy-button:hover::before {
            width: 300px;
            height: 300px;
        }
        
        .buy-button:hover {
            background: transparent;
            color: var(--text-primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(245, 115, 21, 0.4);
        }
        
        /* Dashboard specific styles */
        .wallet-dashboard-container * {
            box-sizing: border-box;
        }
        
        .wallet-dashboard-container button {
            font-family: 'JetBrains Mono', monospace;
            outline: none;
        }
        
        .wallet-dashboard-container button:focus {
            outline: calc(2px * var(--scale-factor)) solid var(--text-primary);
            outline-offset: calc(2px * var(--scale-factor));
        }
    `;
    
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    // Global state management
    window.walletState = {
        currentPage: 'home',
        selectedMnemonic: 12,
        isSparkTheme: false,
        generatedSeed: null,
        walletAddress: null
    };
    
    // Build the entire application with JavaScript
    function buildApplication() {
        // Clear body
        document.body.innerHTML = '';
        
        // Create main container
        const cursorTheme = document.createElement('div');
        cursorTheme.className = 'cursor-theme';
        
        const cursorContainer = document.createElement('div');
        cursorContainer.className = 'cursor-container';
        
        // Build header
        const header = buildHeader();
        cursorContainer.appendChild(header);
        
        // Build content area
        const content = document.createElement('div');
        content.className = 'cursor-content';
        cursorContainer.appendChild(content);
        
        // Build footer
        const footer = buildFooter();
        cursorContainer.appendChild(footer);
        
        cursorTheme.appendChild(cursorContainer);
        document.body.appendChild(cursorTheme);
        
        // Initialize with home page
        navigateToPage('home');
    }
    
    function buildHeader() {
        const header = document.createElement('header');
        header.className = 'cursor-header';
        
        const headerContent = document.createElement('div');
        headerContent.className = 'header-content';
        
        // Logo section
        const logoSection = document.createElement('div');
        logoSection.className = 'logo-section';
        logoSection.onclick = () => navigateToPage('home');
        
        const logoIcon = document.createElement('div');
        logoIcon.className = 'logo-icon';
        logoIcon.textContent = '₿';
        
        const logoText = document.createElement('div');
        logoText.className = 'logo-text';
        logoText.textContent = 'MOOSH';
        
        logoSection.appendChild(logoIcon);
        logoSection.appendChild(logoText);
        
        // Header actions
        const headerActions = document.createElement('div');
        headerActions.className = 'header-actions';
        
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.id = 'themeToggle';
        themeToggle.onclick = toggleTheme;
        themeToggle.textContent = '🎨';
        
        headerActions.appendChild(themeToggle);
        
        headerContent.appendChild(logoSection);
        headerContent.appendChild(headerActions);
        header.appendChild(headerContent);
        
        return header;
    }
    
    function buildFooter() {
        const footer = document.createElement('footer');
        footer.className = 'cursor-footer';
        
        const footerContent = document.createElement('div');
        footerContent.className = 'footer-content';
        
        const footerLinks = document.createElement('div');
        footerLinks.className = 'footer-links';
        
        const links = [
            { text: 'Website', href: 'https://www.moosh.money/', emoji: '🌐' },
            { text: 'Whitepaper', href: 'https://docs.moosh.money/', emoji: '📄' },
            { text: 'Twitter', href: 'https://twitter.com/mooshmoney', emoji: '𝕏' },
            { text: 'Telegram', href: 'https://t.me/mooshmoney', emoji: '💬' }
        ];
        
        links.forEach(link => {
            const a = document.createElement('a');
            a.className = 'footer-link';
            a.href = link.href;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            
            const emoji = document.createElement('span');
            emoji.textContent = link.emoji + ' ';
            
            const text = document.createElement('span');
            text.textContent = link.text;
            
            a.appendChild(emoji);
            a.appendChild(text);
            footerLinks.appendChild(a);
        });
        
        const footerText = document.createElement('div');
        footerText.className = 'footer-text';
        footerText.textContent = '© 2025 MOOSH Wallet - Built on Spark Protocol ✨';
        
        footerContent.appendChild(footerLinks);
        footerContent.appendChild(footerText);
        footer.appendChild(footerContent);
        
        return footer;
    }
    
    // Page navigation system
    function navigateToPage(pageId) {
        window.walletState.currentPage = pageId;
        const content = document.querySelector('.cursor-content');
        content.innerHTML = '';
        
        switch(pageId) {
            case 'home':
                buildHomePage(content);
                break;
            case 'generate':
                buildGenerateWalletPage(content);
                break;
            case 'import':
                buildImportWalletPage(content);
                break;
            case 'dashboard':
                openWalletDashboard();
                break;
            default:
                buildHomePage(content);
        }
    }
    
    function buildHomePage(container) {
        // Hero section
        const heroSection = document.createElement('div');
        heroSection.className = 'hero-section';
        
        const heroTitle = document.createElement('h1');
        heroTitle.className = 'hero-title';
        heroTitle.textContent = 'Bitcoin Native Wallet';
        
        const heroSubtitle = document.createElement('p');
        heroSubtitle.className = 'hero-subtitle';
        heroSubtitle.textContent = 'Professional-grade Bitcoin wallet with Spark Protocol integration';
        
        // Feature badges
        const featureBadges = document.createElement('div');
        featureBadges.className = 'feature-badges';
        
        const badges = [
            { emoji: '🔒', text: 'Secure' },
            { emoji: '⚡', text: 'Lightning' },
            { emoji: '✨', text: 'Spark Protocol' },
            { emoji: '🎨', text: 'Ordinals' }
        ];
        
        badges.forEach(badge => {
            const badgeEl = document.createElement('div');
            badgeEl.className = 'badge';
            
            const emoji = document.createElement('span');
            emoji.textContent = badge.emoji;
            
            const text = document.createElement('span');
            text.textContent = badge.text;
            
            badgeEl.appendChild(emoji);
            badgeEl.appendChild(text);
            featureBadges.appendChild(badgeEl);
        });
        
        heroSection.appendChild(heroTitle);
        heroSection.appendChild(heroSubtitle);
        heroSection.appendChild(featureBadges);
        
        // Wallet options
        const walletOptions = document.createElement('div');
        walletOptions.className = 'wallet-options';
        
        const options = [
            {
                icon: '🔑',
                title: 'Generate New Wallet',
                description: 'Create a new Bitcoin wallet with secure seed phrase',
                action: () => navigateToPage('generate')
            },
            {
                icon: '📥',
                title: 'Import Existing Wallet',
                description: 'Import your wallet using seed phrase or private key',
                action: () => navigateToPage('import')
            },
            {
                icon: '💸',
                title: 'Buy MOOSH Token',
                description: 'Purchase MOOSH tokens on the Spark Protocol',
                action: () => openTokenSite()
            }
        ];
        
        options.forEach(option => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.onclick = option.action;
            
            const icon = document.createElement('div');
            icon.className = 'option-icon';
            icon.textContent = option.icon;
            
            const title = document.createElement('h3');
            title.className = 'option-title';
            title.textContent = option.title;
            
            const desc = document.createElement('p');
            desc.className = 'option-description';
            desc.textContent = option.description;
            
            card.appendChild(icon);
            card.appendChild(title);
            card.appendChild(desc);
            walletOptions.appendChild(card);
        });
        
        container.appendChild(heroSection);
        container.appendChild(walletOptions);
    }
    
    function buildGenerateWalletPage(container) {
        const form = document.createElement('div');
        form.className = 'wallet-form';
        
        const title = document.createElement('h2');
        title.style.cssText = 'font-size: calc(28px * var(--scale-factor)); color: var(--text-primary); margin-bottom: calc(24px * var(--scale-factor));';
        title.textContent = 'Generate New Wallet';
        
        // Mnemonic selection
        const mnemonicGroup = document.createElement('div');
        mnemonicGroup.className = 'form-group';
        
        const mnemonicLabel = document.createElement('label');
        mnemonicLabel.className = 'form-label';
        mnemonicLabel.textContent = 'Select Mnemonic Length';
        
        const radioGroup = document.createElement('div');
        radioGroup.className = 'radio-group';
        
        [12, 24].forEach(words => {
            const radioItem = document.createElement('div');
            radioItem.className = 'radio-item';
            radioItem.onclick = () => selectMnemonic(words);
            
            const radioButton = document.createElement('div');
            radioButton.className = 'radio-button';
            radioButton.id = 'radio' + words;
            
            const radioInner = document.createElement('div');
            radioInner.className = 'radio-inner';
            if (words === window.walletState.selectedMnemonic) {
                radioInner.style.background = 'var(--text-primary)';
                radioInner.style.transform = 'scale(1)';
            }
            
            radioButton.appendChild(radioInner);
            
            const radioLabel = document.createElement('span');
            radioLabel.className = 'radio-label';
            radioLabel.textContent = words + ' Words';
            
            radioItem.appendChild(radioButton);
            radioItem.appendChild(radioLabel);
            radioGroup.appendChild(radioItem);
        });
        
        mnemonicGroup.appendChild(mnemonicLabel);
        mnemonicGroup.appendChild(radioGroup);
        
        // Password input
        const passwordGroup = document.createElement('div');
        passwordGroup.className = 'form-group';
        
        const passwordLabel = document.createElement('label');
        passwordLabel.className = 'form-label';
        passwordLabel.textContent = 'Wallet Password';
        
        const passwordInputGroup = document.createElement('div');
        passwordInputGroup.className = 'password-input-group';
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.className = 'form-input password-input';
        passwordInput.id = 'walletPassword';
        passwordInput.placeholder = 'Enter a strong password';
        
        const passwordToggle = document.createElement('button');
        passwordToggle.className = 'password-toggle';
        passwordToggle.type = 'button';
        passwordToggle.textContent = '👁';
        passwordToggle.onclick = () => togglePasswordVisibility('walletPassword');
        
        passwordInputGroup.appendChild(passwordInput);
        passwordInputGroup.appendChild(passwordToggle);
        passwordGroup.appendChild(passwordLabel);
        passwordGroup.appendChild(passwordInputGroup);
        
        // Confirm password
        const confirmGroup = document.createElement('div');
        confirmGroup.className = 'form-group';
        
        const confirmLabel = document.createElement('label');
        confirmLabel.className = 'form-label';
        confirmLabel.textContent = 'Confirm Password';
        
        const confirmInputGroup = document.createElement('div');
        confirmInputGroup.className = 'password-input-group';
        
        const confirmInput = document.createElement('input');
        confirmInput.type = 'password';
        confirmInput.className = 'form-input password-input';
        confirmInput.id = 'confirmPassword';
        confirmInput.placeholder = 'Confirm your password';
        
        const confirmToggle = document.createElement('button');
        confirmToggle.className = 'password-toggle';
        confirmToggle.type = 'button';
        confirmToggle.textContent = '👁';
        confirmToggle.onclick = () => togglePasswordVisibility('confirmPassword');
        
        confirmInputGroup.appendChild(confirmInput);
        confirmInputGroup.appendChild(confirmToggle);
        confirmGroup.appendChild(confirmLabel);
        confirmGroup.appendChild(confirmInputGroup);
        
        // Action buttons
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';
        
        const backButton = document.createElement('button');
        backButton.className = 'btn btn-secondary';
        backButton.textContent = '← Back';
        backButton.onclick = () => navigateToPage('home');
        
        const generateButton = document.createElement('button');
        generateButton.className = 'btn btn-primary';
        generateButton.textContent = 'Generate Wallet →';
        generateButton.onclick = generateWallet;
        
        navButtons.appendChild(backButton);
        navButtons.appendChild(generateButton);
        
        form.appendChild(title);
        form.appendChild(mnemonicGroup);
        form.appendChild(passwordGroup);
        form.appendChild(confirmGroup);
        form.appendChild(navButtons);
        
        container.appendChild(form);
    }
    
    function buildImportWalletPage(container) {
        const form = document.createElement('div');
        form.className = 'wallet-form';
        
        const title = document.createElement('h2');
        title.style.cssText = 'font-size: calc(28px * var(--scale-factor)); color: var(--text-primary); margin-bottom: calc(24px * var(--scale-factor));';
        title.textContent = 'Import Existing Wallet';
        
        // Seed phrase input
        const seedGroup = document.createElement('div');
        seedGroup.className = 'form-group';
        
        const seedLabel = document.createElement('label');
        seedLabel.className = 'form-label';
        seedLabel.textContent = 'Seed Phrase';
        
        const seedTextarea = document.createElement('textarea');
        seedTextarea.className = 'form-input';
        seedTextarea.id = 'seedPhrase';
        seedTextarea.placeholder = 'Enter your 12 or 24 word seed phrase';
        seedTextarea.style.minHeight = 'calc(100px * var(--scale-factor))';
        seedTextarea.style.resize = 'vertical';
        
        seedGroup.appendChild(seedLabel);
        seedGroup.appendChild(seedTextarea);
        
        // Password input
        const passwordGroup = document.createElement('div');
        passwordGroup.className = 'form-group';
        
        const passwordLabel = document.createElement('label');
        passwordLabel.className = 'form-label';
        passwordLabel.textContent = 'New Wallet Password';
        
        const passwordInputGroup = document.createElement('div');
        passwordInputGroup.className = 'password-input-group';
        
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.className = 'form-input password-input';
        passwordInput.id = 'importPassword';
        passwordInput.placeholder = 'Create a new password';
        
        const passwordToggle = document.createElement('button');
        passwordToggle.className = 'password-toggle';
        passwordToggle.type = 'button';
        passwordToggle.textContent = '👁';
        passwordToggle.onclick = () => togglePasswordVisibility('importPassword');
        
        passwordInputGroup.appendChild(passwordInput);
        passwordInputGroup.appendChild(passwordToggle);
        passwordGroup.appendChild(passwordLabel);
        passwordGroup.appendChild(passwordInputGroup);
        
        // Action buttons
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';
        
        const backButton = document.createElement('button');
        backButton.className = 'btn btn-secondary';
        backButton.textContent = '← Back';
        backButton.onclick = () => navigateToPage('home');
        
        const importButton = document.createElement('button');
        importButton.className = 'btn btn-primary';
        importButton.textContent = 'Import Wallet →';
        importButton.onclick = importWallet;
        
        navButtons.appendChild(backButton);
        navButtons.appendChild(importButton);
        
        form.appendChild(title);
        form.appendChild(seedGroup);
        form.appendChild(passwordGroup);
        form.appendChild(navButtons);
        
        container.appendChild(form);
    }
    
    // Utility functions
    function selectMnemonic(words) {
        window.walletState.selectedMnemonic = words;
        
        // Update radio buttons
        document.querySelectorAll('.radio-inner').forEach((inner, index) => {
            if ((index === 0 && words === 12) || (index === 1 && words === 24)) {
                inner.style.background = 'var(--text-primary)';
                inner.style.transform = 'scale(1)';
            } else {
                inner.style.background = 'transparent';
                inner.style.transform = 'scale(0.8)';
            }
        });
        
        showNotification(words + ' word mnemonic selected', 'success');
    }
    
    function togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        const toggle = input.nextElementSibling;
        
        if (input.type === 'password') {
            input.type = 'text';
            toggle.textContent = '👁‍🗨';
        } else {
            input.type = 'password';
            toggle.textContent = '👁';
        }
    }
    
    function generateWallet() {
        const password = document.getElementById('walletPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!password) {
            showNotification('Please enter a password', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 8) {
            showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        
        // Generate seed phrase
        const wordCount = window.walletState.selectedMnemonic;
        const words = generateMnemonic(wordCount);
        window.walletState.generatedSeed = words.join(' ');
        
        // Show seed phrase
        showSeedPhrase(words);
    }
    
    function generateMnemonic(wordCount) {
        const wordlist = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert'];
        const words = [];
        for (let i = 0; i < wordCount; i++) {
            words.push(wordlist[Math.floor(Math.random() * wordlist.length)]);
        }
        return words;
    }
    
    function showSeedPhrase(words) {
        const content = document.querySelector('.cursor-content');
        content.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'wallet-form';
        
        const title = document.createElement('h2');
        title.style.cssText = 'font-size: calc(28px * var(--scale-factor)); color: var(--text-primary); margin-bottom: calc(16px * var(--scale-factor));';
        title.textContent = 'Your Seed Phrase';
        
        const warning = document.createElement('div');
        warning.style.cssText = 'background: rgba(255, 68, 68, 0.1); border: calc(1px * var(--scale-factor)) solid #ff4444; padding: calc(16px * var(--scale-factor)); border-radius: calc(8px * var(--scale-factor)); margin-bottom: calc(24px * var(--scale-factor));';
        
        const warningStrong = document.createElement('strong');
        warningStrong.textContent = '⚠️ IMPORTANT:';
        const warningText = document.createTextNode(' Write down these words in order. This is the only way to recover your wallet.');
        warning.appendChild(warningStrong);
        warning.appendChild(warningText);
        
        const mnemonicDisplay = document.createElement('div');
        mnemonicDisplay.className = 'mnemonic-display';
        
        const mnemonicGrid = document.createElement('div');
        mnemonicGrid.className = 'mnemonic-grid';
        
        words.forEach((word, index) => {
            const wordEl = document.createElement('div');
            wordEl.className = 'mnemonic-word';
            
            const wordNumber = document.createElement('span');
            wordNumber.className = 'word-number';
            wordNumber.textContent = (index + 1) + '.';
            
            const wordText = document.createTextNode(word);
            
            wordEl.appendChild(wordNumber);
            wordEl.appendChild(wordText);
            mnemonicGrid.appendChild(wordEl);
        });
        
        mnemonicDisplay.appendChild(mnemonicGrid);
        
        const copyButton = document.createElement('button');
        copyButton.className = 'btn btn-secondary';
        copyButton.textContent = '📋 Copy Seed Phrase';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(words.join(' '));
            showNotification('Seed phrase copied to clipboard', 'success');
        };
        copyButton.style.marginTop = 'calc(16px * var(--scale-factor))';
        
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';
        
        const continueButton = document.createElement('button');
        continueButton.className = 'btn btn-primary';
        continueButton.textContent = 'I\'ve Written It Down →';
        continueButton.onclick = () => confirmSeedPhrase(words);
        
        navButtons.appendChild(continueButton);
        
        container.appendChild(title);
        container.appendChild(warning);
        container.appendChild(mnemonicDisplay);
        container.appendChild(copyButton);
        container.appendChild(navButtons);
        
        content.appendChild(container);
    }
    
    function confirmSeedPhrase(originalWords) {
        const content = document.querySelector('.cursor-content');
        content.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'wallet-form';
        
        const title = document.createElement('h2');
        title.style.cssText = 'font-size: calc(28px * var(--scale-factor)); color: var(--text-primary); margin-bottom: calc(24px * var(--scale-factor));';
        title.textContent = 'Confirm Your Seed Phrase';
        
        const instruction = document.createElement('p');
        instruction.style.cssText = 'color: var(--text-dim); margin-bottom: calc(24px * var(--scale-factor));';
        instruction.textContent = 'Please select the words in the correct order to confirm you\'ve saved your seed phrase.';
        
        // Create confirmation interface
        const confirmationGrid = document.createElement('div');
        confirmationGrid.style.cssText = 'display: grid; gap: calc(16px * var(--scale-factor)); margin-bottom: calc(24px * var(--scale-factor));';
        
        // Randomly select 3 positions to verify
        const positions = [2, 5, 8]; // Example positions
        
        positions.forEach(pos => {
            const group = document.createElement('div');
            group.className = 'form-group';
            
            const label = document.createElement('label');
            label.className = 'form-label';
            label.textContent = 'Word #' + pos;
            
            const select = document.createElement('select');
            select.className = 'form-input';
            select.id = 'word-' + pos;
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select word...';
            select.appendChild(defaultOption);
            
            // Add shuffled words as options
            const shuffled = [...originalWords].sort(() => Math.random() - 0.5);
            shuffled.forEach(word => {
                const option = document.createElement('option');
                option.value = word;
                option.textContent = word;
                select.appendChild(option);
            });
            
            group.appendChild(label);
            group.appendChild(select);
            confirmationGrid.appendChild(group);
        });
        
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';
        
        const backButton = document.createElement('button');
        backButton.className = 'btn btn-secondary';
        backButton.textContent = '← Back';
        backButton.onclick = () => showSeedPhrase(originalWords);
        
        const confirmButton = document.createElement('button');
        confirmButton.className = 'btn btn-primary';
        confirmButton.textContent = 'Confirm & Create Wallet';
        confirmButton.onclick = () => {
            // Verify selections
            let correct = true;
            positions.forEach(pos => {
                const select = document.getElementById('word-' + pos);
                if (select.value !== originalWords[pos - 1]) {
                    correct = false;
                }
            });
            
            if (correct) {
                createWalletSuccess();
            } else {
                showNotification('Incorrect words selected. Please try again.', 'error');
            }
        };
        
        navButtons.appendChild(backButton);
        navButtons.appendChild(confirmButton);
        
        container.appendChild(title);
        container.appendChild(instruction);
        container.appendChild(confirmationGrid);
        container.appendChild(navButtons);
        
        content.appendChild(container);
    }
    
    function createWalletSuccess() {
        // Generate wallet address (mock)
        window.walletState.walletAddress = 'bc1p' + Math.random().toString(36).substring(2, 15);
        
        const content = document.querySelector('.cursor-content');
        content.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'wallet-form';
        container.style.textAlign = 'center';
        
        const successIcon = document.createElement('div');
        successIcon.style.cssText = 'font-size: calc(64px * var(--scale-factor)); margin-bottom: calc(24px * var(--scale-factor));';
        successIcon.textContent = '✅';
        
        const title = document.createElement('h2');
        title.style.cssText = 'font-size: calc(32px * var(--scale-factor)); color: var(--text-primary); margin-bottom: calc(16px * var(--scale-factor));';
        title.textContent = 'Wallet Created Successfully!';
        
        const address = document.createElement('div');
        address.style.cssText = 'background: var(--bg-primary); border: calc(1px * var(--scale-factor)) solid var(--text-primary); padding: calc(16px * var(--scale-factor)); border-radius: calc(8px * var(--scale-factor)); margin: calc(24px * var(--scale-factor)) 0; word-break: break-all; font-family: monospace; font-size: calc(14px * var(--scale-factor));';
        address.textContent = window.walletState.walletAddress;
        
        const dashboardButton = document.createElement('button');
        dashboardButton.className = 'btn btn-primary';
        dashboardButton.textContent = 'Open Wallet Dashboard';
        dashboardButton.onclick = () => openWalletDashboard();
        dashboardButton.style.marginTop = 'calc(24px * var(--scale-factor))';
        
        container.appendChild(successIcon);
        container.appendChild(title);
        container.appendChild(address);
        container.appendChild(dashboardButton);
        
        content.appendChild(container);
        
        showNotification('Wallet created successfully!', 'success');
    }
    
    function importWallet() {
        const seedPhrase = document.getElementById('seedPhrase').value.trim();
        const password = document.getElementById('importPassword').value;
        
        if (!seedPhrase) {
            showNotification('Please enter your seed phrase', 'error');
            return;
        }
        
        const words = seedPhrase.split(/\s+/);
        if (words.length !== 12 && words.length !== 24) {
            showNotification('Seed phrase must be 12 or 24 words', 'error');
            return;
        }
        
        if (!password || password.length < 8) {
            showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        
        // Mock wallet import
        window.walletState.walletAddress = 'bc1q' + Math.random().toString(36).substring(2, 15);
        
        showNotification('Wallet imported successfully!', 'success');
        setTimeout(() => openWalletDashboard(), 1000);
    }
    
    function toggleTheme() {
        window.walletState.isSparkTheme = !window.walletState.isSparkTheme;
        
        if (window.walletState.isSparkTheme) {
            document.body.classList.add('theme-spark');
            showNotification('MOOSH Mode ON', 'moosh');
        } else {
            document.body.classList.remove('theme-spark');
            showNotification('Original Mode ON', 'original');
        }
        
        localStorage.setItem('mooshTheme', window.walletState.isSparkTheme ? 'moosh' : 'original');
    }
    
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        // Position based on screen size
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            notification.style.bottom = 'calc(var(--spacing-unit) * 3 * var(--scale-factor))';
            notification.style.left = 'calc(var(--spacing-unit) * 2 * var(--scale-factor))';
            notification.style.right = 'calc(var(--spacing-unit) * 2 * var(--scale-factor))';
            notification.style.transform = 'translateY(calc(50px * var(--scale-factor)))';
        } else {
            notification.style.bottom = 'calc(var(--spacing-unit) * 3 * var(--scale-factor))';
            notification.style.right = 'calc(var(--spacing-unit) * 3 * var(--scale-factor))';
            notification.style.transform = 'translateX(calc(400px * var(--scale-factor)))';
        }
        
        // Type-specific styling
        const isCurrentlyMooshTheme = document.body.classList.contains('theme-spark');
        const primaryColor = isCurrentlyMooshTheme ? '#69fd97bd' : '#f57315';
        
        if (type === 'moosh') {
            notification.style.borderColor = '#69fd97bd';
            notification.style.color = '#69fd97bd';
        } else if (type === 'original') {
            notification.style.borderColor = '#f57315';
            notification.style.color = '#f57315';
        } else if (type === 'error') {
            notification.style.borderColor = '#ff4444';
            notification.style.color = '#ff4444';
        } else {
            notification.style.borderColor = primaryColor;
            notification.style.color = primaryColor;
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animation
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            if (isMobile) {
                notification.style.transform = 'translateY(0)';
            } else {
                notification.style.transform = 'translateX(0)';
            }
        });
        
        // Auto-dismiss
        setTimeout(() => {
            notification.style.opacity = '0';
            if (isMobile) {
                notification.style.transform = 'translateY(calc(50px * var(--scale-factor)))';
            } else {
                notification.style.transform = 'translateX(calc(400px * var(--scale-factor)))';
            }
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }
    
    function openTokenSite() {
        showNotification('Opening MOOSH.money...', 'success');
        setTimeout(() => {
            window.open('https://www.moosh.money/', '_blank');
        }, 500);
    }
    
    // Dashboard implementation
    function openWalletDashboard() {
        showNotification('Opening wallet dashboard...', 'success');
        
        // Clear current content
        const cursorContent = document.querySelector('.cursor-content');
        if (!cursorContent) {
            showNotification('Error: Content container not found', 'error');
            return;
        }
        
        cursorContent.innerHTML = '';
        
        // Create dashboard container
        const dashboardContainer = document.createElement('div');
        dashboardContainer.className = 'wallet-dashboard-container';
        dashboardContainer.style.cssText = 'max-width: calc(1200px * var(--scale-factor)); margin: 0 auto; padding: calc(var(--container-padding) * var(--scale-factor)); min-height: 100vh; font-family: \'JetBrains Mono\', monospace;';
        
        // Initialize dashboard state
        window.dashboardState = {
            selectedWallet: 'taproot',
            wallets: [
                { id: 'taproot', name: 'Taproot', prefix: 'bc1p...', ordinals: true, icon: '🔐' },
                { id: 'segwit', name: 'SegWit', prefix: 'bc1q...', ordinals: false, icon: '⚡' },
                { id: 'legacy', name: 'Legacy', prefix: '1...', ordinals: false, icon: '🏛️' },
                { id: 'lightning', name: 'Lightning', prefix: 'lnbc...', ordinals: false, icon: '⚡' },
                { id: 'spark', name: 'Spark', prefix: 'sp1...', ordinals: false, icon: '✨' }
            ],
            balances: {
                btc: '0.00000000',
                usd: '0.00',
                tokens: []
            },
            privacyMode: false
        };
        
        // Build dashboard components
        dashboardContainer.appendChild(createDashboardHeader());
        dashboardContainer.appendChild(createWalletSelector());
        dashboardContainer.appendChild(createBalanceSection());
        dashboardContainer.appendChild(createQuickActions());
        dashboardContainer.appendChild(createTransactionHistory());
        
        // Append to content
        cursorContent.appendChild(dashboardContainer);
        
        // Initialize dashboard functionality
        initializeDashboard();
    }
    
    function createDashboardHeader() {
        const header = document.createElement('div');
        header.className = 'dashboard-header';
        header.style.cssText = 'background: var(--bg-primary); border: calc(1px * var(--scale-factor)) solid var(--border-color); padding: calc(20px * var(--scale-factor)); margin-bottom: calc(20px * var(--scale-factor)); position: relative;';
        
        // Terminal prompt
        const terminalPrompt = document.createElement('div');
        terminalPrompt.className = 'terminal-prompt';
        terminalPrompt.style.cssText = 'font-size: calc(16px * var(--scale-factor)); display: flex; align-items: center; gap: calc(8px * var(--scale-factor)); margin-bottom: calc(16px * var(--scale-factor));';
        
        const promptPath = document.createElement('span');
        promptPath.style.color = 'var(--text-dim)';
        promptPath.textContent = '~/moosh/wallet $';
        
        const promptCommand = document.createElement('span');
        promptCommand.style.color = 'var(--text-primary)';
        promptCommand.textContent = 'dashboard --professional';
        
        const cursor = document.createElement('span');
        cursor.className = 'blinking-cursor';
        cursor.style.cssText = 'color: var(--text-primary); animation: blink 1s infinite;';
        cursor.textContent = '|';
        
        terminalPrompt.appendChild(promptPath);
        terminalPrompt.appendChild(promptCommand);
        terminalPrompt.appendChild(cursor);
        
        // Title
        const title = document.createElement('h1');
        title.style.cssText = 'font-size: calc(24px * var(--scale-factor)); color: var(--text-primary); margin: calc(16px * var(--scale-factor)) 0; font-weight: 700; letter-spacing: 0.05em;';
        title.textContent = 'MOOSH WALLET DASHBOARD';
        
        // Status banner
        const statusBanner = document.createElement('div');
        statusBanner.className = 'status-banner';
        statusBanner.style.cssText = 'background: var(--bg-secondary); border: calc(1px * var(--scale-factor)) solid var(--text-primary); padding: calc(8px * var(--scale-factor)) calc(16px * var(--scale-factor)); border-radius: 0; display: inline-flex; align-items: center; gap: calc(8px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));';
        
        const statusDot = document.createElement('span');
        statusDot.style.cssText = 'width: calc(8px * var(--scale-factor)); height: calc(8px * var(--scale-factor)); background: var(--text-primary); border-radius: 50%; animation: pulse 2s infinite;';
        
        const statusText = document.createElement('span');
        statusText.style.color = 'var(--text-primary)';
        statusText.textContent = 'SPARK PROTOCOL ACTIVE';
        
        statusBanner.appendChild(statusDot);
        statusBanner.appendChild(statusText);
        
        // Action buttons
        const actionButtons = document.createElement('div');
        actionButtons.style.cssText = 'position: absolute; top: calc(20px * var(--scale-factor)); right: calc(20px * var(--scale-factor)); display: flex; gap: calc(12px * var(--scale-factor));';
        
        const refreshBtn = createIconButton('🔄', 'Refresh', () => {
            showNotification('Refreshing wallet data...', 'success');
        });
        
        const settingsBtn = createIconButton('⚙️', 'Settings', () => {
            showNotification('Opening settings...', 'success');
        });
        
        actionButtons.appendChild(refreshBtn);
        actionButtons.appendChild(settingsBtn);
        
        header.appendChild(terminalPrompt);
        header.appendChild(title);
        header.appendChild(statusBanner);
        header.appendChild(actionButtons);
        
        return header;
    }
    
    function createWalletSelector() {
        const selectorContainer = document.createElement('div');
        selectorContainer.className = 'wallet-selector';
        selectorContainer.style.cssText = 'background: var(--bg-primary); border: calc(1px * var(--scale-factor)) solid var(--border-color); padding: calc(16px * var(--scale-factor)); margin-bottom: calc(20px * var(--scale-factor));';
        
        const selectorTitle = document.createElement('h3');
        selectorTitle.style.cssText = 'font-size: calc(14px * var(--scale-factor)); color: var(--text-dim); margin-bottom: calc(12px * var(--scale-factor)); text-transform: uppercase; letter-spacing: 0.1em;';
        selectorTitle.textContent = 'SELECT WALLET TYPE';
        
        const walletGrid = document.createElement('div');
        walletGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(140px * var(--scale-factor)), 1fr)); gap: calc(12px * var(--scale-factor));';
        
        window.dashboardState.wallets.forEach(wallet => {
            const walletCard = document.createElement('div');
            walletCard.className = 'wallet-card';
            walletCard.dataset.walletId = wallet.id;
            walletCard.style.cssText = 'background: var(--bg-secondary); border: calc(2px * var(--scale-factor)) solid ' + (wallet.id === window.dashboardState.selectedWallet ? 'var(--text-primary)' : 'var(--border-color)') + '; padding: calc(16px * var(--scale-factor)); cursor: pointer; transition: all 0.2s ease; text-align: center;';
            
            const walletIcon = document.createElement('div');
            walletIcon.style.cssText = 'font-size: calc(24px * var(--scale-factor)); margin-bottom: calc(8px * var(--scale-factor));';
            walletIcon.textContent = wallet.icon;
            
            const walletName = document.createElement('div');
            walletName.style.cssText = 'font-size: calc(14px * var(--scale-factor)); color: ' + (wallet.id === window.dashboardState.selectedWallet ? 'var(--text-primary)' : 'var(--text-secondary)') + '; font-weight: 600; margin-bottom: calc(4px * var(--scale-factor));';
            walletName.textContent = wallet.name;
            
            const walletPrefix = document.createElement('div');
            walletPrefix.style.cssText = 'font-size: calc(12px * var(--scale-factor)); color: var(--text-dim);';
            walletPrefix.textContent = wallet.prefix;
            
            walletCard.appendChild(walletIcon);
            walletCard.appendChild(walletName);
            walletCard.appendChild(walletPrefix);
            
            if (wallet.ordinals) {
                const ordinalsTag = document.createElement('div');
                ordinalsTag.style.cssText = 'font-size: calc(10px * var(--scale-factor)); color: var(--text-primary); background: rgba(245, 115, 21, 0.1); padding: calc(2px * var(--scale-factor)) calc(6px * var(--scale-factor)); margin-top: calc(8px * var(--scale-factor)); display: inline-block;';
                ordinalsTag.textContent = 'ORDINALS';
                walletCard.appendChild(ordinalsTag);
            }
            
            walletCard.addEventListener('click', () => selectWallet(wallet.id));
            walletCard.addEventListener('mouseenter', () => {
                if (wallet.id !== window.dashboardState.selectedWallet) {
                    walletCard.style.borderColor = 'var(--text-dim)';
                }
            });
            walletCard.addEventListener('mouseleave', () => {
                if (wallet.id !== window.dashboardState.selectedWallet) {
                    walletCard.style.borderColor = 'var(--border-color)';
                }
            });
            
            walletGrid.appendChild(walletCard);
        });
        
        selectorContainer.appendChild(selectorTitle);
        selectorContainer.appendChild(walletGrid);
        
        return selectorContainer;
    }
    
    function createBalanceSection() {
        const balanceSection = document.createElement('div');
        balanceSection.className = 'balance-section';
        balanceSection.style.cssText = 'margin-bottom: calc(20px * var(--scale-factor));';
        
        // Main balance card
        const mainBalanceCard = document.createElement('div');
        mainBalanceCard.style.cssText = 'background: var(--bg-primary); border: calc(2px * var(--scale-factor)) solid var(--text-primary); padding: calc(24px * var(--scale-factor)); margin-bottom: calc(16px * var(--scale-factor)); position: relative;';
        
        const balanceLabel = document.createElement('div');
        balanceLabel.style.cssText = 'font-size: calc(12px * var(--scale-factor)); color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: calc(8px * var(--scale-factor));';
        balanceLabel.textContent = 'TOTAL BALANCE';
        
        const balanceAmount = document.createElement('div');
        balanceAmount.className = 'balance-amount';
        balanceAmount.style.cssText = 'font-size: calc(36px * var(--scale-factor)); color: var(--text-primary); font-weight: 700; margin-bottom: calc(8px * var(--scale-factor));';
        balanceAmount.textContent = window.dashboardState.privacyMode ? '••••••••' : '0.00000000 BTC';
        
        const balanceUSD = document.createElement('div');
        balanceUSD.style.cssText = 'font-size: calc(18px * var(--scale-factor)); color: var(--text-secondary);';
        balanceUSD.textContent = window.dashboardState.privacyMode ? '•••••' : '$0.00 USD';
        
        // Privacy toggle
        const privacyToggle = document.createElement('button');
        privacyToggle.style.cssText = 'position: absolute; top: calc(24px * var(--scale-factor)); right: calc(24px * var(--scale-factor)); background: transparent; border: calc(1px * var(--scale-factor)) solid var(--border-color); color: var(--text-primary); padding: calc(8px * var(--scale-factor)); cursor: pointer; font-size: calc(16px * var(--scale-factor)); transition: all 0.2s ease;';
        privacyToggle.textContent = window.dashboardState.privacyMode ? '👁️' : '👁️‍🗨️';
        privacyToggle.onclick = togglePrivacyMode;
        
        mainBalanceCard.appendChild(balanceLabel);
        mainBalanceCard.appendChild(balanceAmount);
        mainBalanceCard.appendChild(balanceUSD);
        mainBalanceCard.appendChild(privacyToggle);
        
        // Balance cards grid
        const cardsGrid = document.createElement('div');
        cardsGrid.className = 'balance-cards-grid';
        cardsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(200px * var(--scale-factor)), 1fr)); gap: calc(16px * var(--scale-factor));';
        
        // Create balance cards based on wallet type
        const selectedWallet = window.dashboardState.wallets.find(w => w.id === window.dashboardState.selectedWallet);
        const cardTypes = selectedWallet.ordinals 
            ? ['Bitcoin', 'Lightning', 'Stablecoins', 'Ordinals', 'Network']
            : ['Bitcoin', 'Lightning', 'Stablecoins', 'Network'];
        
        cardTypes.forEach(type => {
            const card = createBalanceCard(type);
            cardsGrid.appendChild(card);
        });
        
        balanceSection.appendChild(mainBalanceCard);
        balanceSection.appendChild(cardsGrid);
        
        return balanceSection;
    }
    
    function createBalanceCard(type) {
        const card = document.createElement('div');
        card.className = 'balance-card';
        card.style.cssText = 'background: var(--bg-primary); border: calc(1px * var(--scale-factor)) solid var(--border-color); padding: calc(20px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;';
        
        const icon = document.createElement('div');
        icon.style.cssText = 'font-size: calc(24px * var(--scale-factor)); margin-bottom: calc(12px * var(--scale-factor));';
        
        const label = document.createElement('div');
        label.style.cssText = 'font-size: calc(12px * var(--scale-factor)); color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: calc(8px * var(--scale-factor));';
        
        const value = document.createElement('div');
        value.style.cssText = 'font-size: calc(18px * var(--scale-factor)); color: var(--text-primary); font-weight: 600;';
        
        switch(type) {
            case 'Bitcoin':
                icon.textContent = '₿';
                label.textContent = 'BITCOIN';
                value.textContent = window.dashboardState.privacyMode ? '••••' : '0.0000 BTC';
                break;
            case 'Lightning':
                icon.textContent = '⚡';
                label.textContent = 'LIGHTNING';
                value.textContent = window.dashboardState.privacyMode ? '••••' : '0 SATS';
                break;
            case 'Stablecoins':
                icon.textContent = '💵';
                label.textContent = 'STABLECOINS';
                value.textContent = window.dashboardState.privacyMode ? '••••' : '$0.00';
                break;
            case 'Ordinals':
                icon.textContent = '🎨';
                label.textContent = 'ORDINALS';
                value.textContent = window.dashboardState.privacyMode ? '••' : '0 ITEMS';
                break;
            case 'Network':
                icon.textContent = '🌐';
                label.textContent = 'NETWORK';
                value.textContent = 'MAINNET';
                break;
        }
        
        card.appendChild(icon);
        card.appendChild(label);
        card.appendChild(value);
        
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--text-primary)';
            card.style.transform = 'translateY(calc(-2px * var(--scale-factor)))';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'var(--border-color)';
            card.style.transform = 'translateY(0)';
        });
        
        return card;
    }
    
    function createQuickActions() {
        const actionsSection = document.createElement('div');
        actionsSection.className = 'quick-actions';
        actionsSection.style.cssText = 'background: var(--bg-primary); border: calc(1px * var(--scale-factor)) solid var(--border-color); padding: calc(24px * var(--scale-factor)); margin-bottom: calc(20px * var(--scale-factor));';
        
        const actionsTitle = document.createElement('h3');
        actionsTitle.style.cssText = 'font-size: calc(16px * var(--scale-factor)); color: var(--text-primary); margin-bottom: calc(16px * var(--scale-factor)); text-transform: uppercase; letter-spacing: 0.05em;';
        actionsTitle.textContent = 'QUICK ACTIONS';
        
        const actionsGrid = document.createElement('div');
        actionsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(120px * var(--scale-factor)), 1fr)); gap: calc(16px * var(--scale-factor));';
        
        const actions = [
            { icon: '📤', label: 'SEND', action: () => showSendModal() },
            { icon: '📥', label: 'RECEIVE', action: () => showReceiveModal() },
            { icon: '🔄', label: 'SWAP', action: () => showNotification('Swap feature coming soon!', 'success') },
            { icon: '💸', label: 'BUY', action: () => openTokenSite() }
        ];
        
        actions.forEach(({ icon, label, action }) => {
            const button = document.createElement('button');
            button.style.cssText = 'background: var(--bg-secondary); border: calc(2px * var(--scale-factor)) solid var(--border-color); color: var(--text-primary); padding: calc(20px * var(--scale-factor)) calc(16px * var(--scale-factor)); cursor: pointer; transition: all 0.2s ease; font-family: \'JetBrains Mono\', monospace; display: flex; flex-direction: column; align-items: center; gap: calc(8px * var(--scale-factor)); min-height: calc(100px * var(--scale-factor));';
            
            const buttonIcon = document.createElement('div');
            buttonIcon.style.cssText = 'font-size: calc(32px * var(--scale-factor));';
            buttonIcon.textContent = icon;
            
            const buttonLabel = document.createElement('div');
            buttonLabel.style.cssText = 'font-size: calc(12px * var(--scale-factor)); font-weight: 600; letter-spacing: 0.1em;';
            buttonLabel.textContent = label;
            
            button.appendChild(buttonIcon);
            button.appendChild(buttonLabel);
            
            button.addEventListener('click', action);
            button.addEventListener('mouseenter', () => {
                button.style.borderColor = 'var(--text-primary)';
                button.style.background = 'var(--bg-hover)';
                button.style.transform = 'translateY(calc(-2px * var(--scale-factor)))';
            });
            button.addEventListener('mouseleave', () => {
                button.style.borderColor = 'var(--border-color)';
                button.style.background = 'var(--bg-secondary)';
                button.style.transform = 'translateY(0)';
            });
            
            actionsGrid.appendChild(button);
        });
        
        actionsSection.appendChild(actionsTitle);
        actionsSection.appendChild(actionsGrid);
        
        return actionsSection;
    }
    
    function createTransactionHistory() {
        const historySection = document.createElement('div');
        historySection.className = 'transaction-history';
        historySection.style.cssText = 'background: var(--bg-primary); border: calc(1px * var(--scale-factor)) solid var(--border-color); padding: calc(24px * var(--scale-factor));';
        
        const historyHeader = document.createElement('div');
        historyHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: calc(20px * var(--scale-factor));';
        
        const historyTitle = document.createElement('h3');
        historyTitle.style.cssText = 'font-size: calc(16px * var(--scale-factor)); color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em;';
        historyTitle.textContent = 'TRANSACTION HISTORY';
        
        const filterButton = document.createElement('button');
        filterButton.style.cssText = 'background: transparent; border: calc(1px * var(--scale-factor)) solid var(--border-color); color: var(--text-primary); padding: calc(8px * var(--scale-factor)) calc(16px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor)); cursor: pointer; transition: all 0.2s ease; font-family: \'JetBrains Mono\', monospace;';
        filterButton.textContent = 'FILTER';
        
        historyHeader.appendChild(historyTitle);
        historyHeader.appendChild(filterButton);
        
        // Empty state
        const emptyState = document.createElement('div');
        emptyState.style.cssText = 'text-align: center; padding: calc(40px * var(--scale-factor)); color: var(--text-dim);';
        
        const emptyIcon = document.createElement('div');
        emptyIcon.style.cssText = 'font-size: calc(48px * var(--scale-factor)); margin-bottom: calc(16px * var(--scale-factor)); opacity: 0.5;';
        emptyIcon.textContent = '📋';
        
        const emptyText = document.createElement('div');
        emptyText.style.cssText = 'font-size: calc(14px * var(--scale-factor));';
        emptyText.textContent = 'No transactions yet';
        
        emptyState.appendChild(emptyIcon);
        emptyState.appendChild(emptyText);
        
        historySection.appendChild(historyHeader);
        historySection.appendChild(emptyState);
        
        return historySection;
    }
    
    function createIconButton(icon, tooltip, onClick) {
        const button = document.createElement('button');
        button.style.cssText = 'background: transparent; border: calc(1px * var(--scale-factor)) solid var(--border-color); color: var(--text-primary); width: calc(40px * var(--scale-factor)); height: calc(40px * var(--scale-factor)); font-size: calc(16px * var(--scale-factor)); cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;';
        button.textContent = icon;
        button.title = tooltip;
        button.onclick = onClick;
        
        button.addEventListener('mouseenter', () => {
            button.style.borderColor = 'var(--text-primary)';
            button.style.background = 'var(--bg-hover)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.borderColor = 'var(--border-color)';
            button.style.background = 'transparent';
        });
        
        return button;
    }
    
    function selectWallet(walletId) {
        window.dashboardState.selectedWallet = walletId;
        const wallet = window.dashboardState.wallets.find(w => w.id === walletId);
        showNotification('Switched to ' + wallet.name + ' wallet', 'success');
        
        // Update wallet selector UI
        document.querySelectorAll('.wallet-card').forEach(card => {
            const isSelected = card.dataset.walletId === walletId;
            card.style.borderColor = isSelected ? 'var(--text-primary)' : 'var(--border-color)';
            card.querySelector('div:nth-child(2)').style.color = isSelected ? 'var(--text-primary)' : 'var(--text-secondary)';
        });
        
        // Rebuild balance section to update cards
        const balanceSection = document.querySelector('.balance-section');
        const newBalanceSection = createBalanceSection();
        balanceSection.replaceWith(newBalanceSection);
    }
    
    function togglePrivacyMode() {
        window.dashboardState.privacyMode = !window.dashboardState.privacyMode;
        showNotification(window.dashboardState.privacyMode ? 'Privacy mode enabled' : 'Privacy mode disabled', 'success');
        
        // Update all balance displays
        const balanceAmount = document.querySelector('.balance-amount');
        const balanceCards = document.querySelectorAll('.balance-card');
        
        if (balanceAmount) {
            balanceAmount.textContent = window.dashboardState.privacyMode ? '••••••••' : '0.00000000 BTC';
        }
        
        // Rebuild balance section to update privacy state
        const balanceSection = document.querySelector('.balance-section');
        const newBalanceSection = createBalanceSection();
        balanceSection.replaceWith(newBalanceSection);
    }
    
    function initializeDashboard() {
        // Initialize advanced dashboard controller
        window.dashboardController = new DashboardController();
        window.dashboardController.init();
        
        showNotification('Dashboard loaded successfully', 'success');
    }
    
    // Advanced Dashboard Controller Class
    class DashboardController {
        constructor() {
            this.state = {
                wallet: {
                    masterKey: null,
                    accounts: [],
                    activeAccountId: 'acc_001'
                },
                ui: {
                    currentView: 'dashboard',
                    modals: { active: null, data: {} },
                    privacy: { balancesHidden: false },
                    animations: { enabled: true }
                },
                network: {
                    connected: true,
                    latency: 0,
                    lastBlock: 0,
                    feeRates: { fast: 0, medium: 0, slow: 0 },
                    sparkStatus: 'active'
                },
                cache: {
                    prices: { BTC_USD: 0, lastUpdate: null },
                    transactions: new Map(),
                    expiry: 300000
                },
                security: {
                    sessionId: null,
                    lastActivity: Date.now(),
                    lockTimeout: 1800000,
                    locked: false
                }
            };
            
            this.apis = {
                blockstream: new BlockstreamAPI(),
                priceData: new PriceAPI()
            };
            
            this.refreshInterval = null;
            this.activityTimer = null;
        }
        
        init() {
            this.bindEvents();
            this.startDataRefresh();
            this.startActivityMonitoring();
            this.loadInitialData();
        }
        
        bindEvents() {
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && document.querySelector('.wallet-dashboard-container')) {
                    showNotification('Returning to wallet...', 'success');
                    setTimeout(() => location.reload(), 500);
                }
                
                // Additional shortcuts
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 'r':
                            e.preventDefault();
                            this.refreshData();
                            break;
                        case 'p':
                            e.preventDefault();
                            togglePrivacyMode();
                            break;
                    }
                }
            });
            
            // Activity monitoring
            ['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
                document.addEventListener(event, () => this.updateActivity());
            });
        }
        
        async loadInitialData() {
            try {
                // Load BTC price
                const price = await this.apis.priceData.getBTCPrice();
                this.updateState('cache.prices.BTC_USD', price);
                
                // Update UI
                this.updatePriceDisplays(price);
                
            } catch (error) {
                console.error('Failed to load initial data:', error);
                showNotification('Failed to load price data', 'error');
            }
        }
        
        startDataRefresh() {
            // Initial refresh
            this.refreshData();
            
            // Set up periodic refresh
            this.refreshInterval = setInterval(() => {
                this.refreshData();
            }, 30000); // 30 seconds
        }
        
        async refreshData() {
            showNotification('Refreshing wallet data...', 'success');
            
            try {
                // Refresh price data
                const price = await this.apis.priceData.getBTCPrice();
                this.updateState('cache.prices.BTC_USD', price);
                this.updatePriceDisplays(price);
                
                // TODO: Refresh balance data when addresses are available
                
            } catch (error) {
                console.error('Refresh failed:', error);
                showNotification('Failed to refresh data', 'error');
            }
        }
        
        updatePriceDisplays(price) {
            const usdDisplay = document.querySelector('.balance-section .balance-usd');
            if (usdDisplay && !window.dashboardState.privacyMode) {
                // Update based on actual BTC balance
                const btcBalance = parseFloat(window.dashboardState.balances.btc);
                const usdValue = (btcBalance * price).toFixed(2);
                usdDisplay.textContent = `$${usdValue} USD`;
            }
        }
        
        startActivityMonitoring() {
            this.activityTimer = setInterval(() => {
                const inactive = Date.now() - this.state.security.lastActivity;
                if (inactive > this.state.security.lockTimeout) {
                    this.lockDashboard();
                }
            }, 60000); // Check every minute
        }
        
        updateActivity() {
            this.state.security.lastActivity = Date.now();
        }
        
        lockDashboard() {
            this.state.security.locked = true;
            showNotification('Dashboard locked due to inactivity', 'warning');
            setTimeout(() => location.reload(), 1000);
        }
        
        updateState(path, value) {
            const keys = path.split('.');
            let current = this.state;
            
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = value;
        }
        
        destroy() {
            if (this.refreshInterval) clearInterval(this.refreshInterval);
            if (this.activityTimer) clearInterval(this.activityTimer);
        }
    }
    
    // Modal Functions
    function showSendModal() {
        const modal = createModal('SEND BITCOIN', () => {
            // Modal closed
        });
        
        const content = document.createElement('div');
        content.style.cssText = 'padding: calc(20px * var(--scale-factor));';
        
        // Recipient address input
        const addressGroup = createInputGroup('Recipient Address', 'text', 'Enter Bitcoin address...');
        
        // Amount input
        const amountGroup = createInputGroup('Amount (BTC)', 'number', '0.00000000');
        amountGroup.querySelector('input').step = '0.00000001';
        
        // Fee selector
        const feeGroup = document.createElement('div');
        feeGroup.style.cssText = 'margin-bottom: calc(20px * var(--scale-factor));';
        
        const feeLabel = document.createElement('label');
        feeLabel.style.cssText = 'display: block; margin-bottom: calc(8px * var(--scale-factor)); color: var(--text-dim); font-size: calc(12px * var(--scale-factor)); text-transform: uppercase;';
        feeLabel.textContent = 'Network Fee';
        
        const feeOptions = document.createElement('div');
        feeOptions.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(8px * var(--scale-factor));';
        
        ['Slow', 'Medium', 'Fast'].forEach((speed, index) => {
            const option = document.createElement('button');
            option.style.cssText = 'background: var(--bg-secondary); border: calc(1px * var(--scale-factor)) solid var(--border-color); color: var(--text-primary); padding: calc(12px * var(--scale-factor)); cursor: pointer; transition: all 0.2s ease; font-family: \'JetBrains Mono\', monospace;';
            option.textContent = speed;
            option.onclick = () => {
                feeOptions.querySelectorAll('button').forEach(btn => {
                    btn.style.borderColor = 'var(--border-color)';
                    btn.style.background = 'var(--bg-secondary)';
                });
                option.style.borderColor = 'var(--text-primary)';
                option.style.background = 'var(--bg-hover)';
            };
            if (index === 1) option.click(); // Default to medium
            feeOptions.appendChild(option);
        });
        
        feeGroup.appendChild(feeLabel);
        feeGroup.appendChild(feeOptions);
        
        // Send button
        const sendButton = document.createElement('button');
        sendButton.style.cssText = 'width: 100%; background: var(--text-primary); color: var(--bg-primary); border: none; padding: calc(16px * var(--scale-factor)); font-size: calc(16px * var(--scale-factor)); font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-family: \'JetBrains Mono\', monospace; text-transform: uppercase; letter-spacing: 0.05em;';
        sendButton.textContent = 'SEND BITCOIN';
        sendButton.onclick = () => {
            showNotification('Transaction feature coming soon!', 'warning');
            modal.remove();
        };
        
        content.appendChild(addressGroup);
        content.appendChild(amountGroup);
        content.appendChild(feeGroup);
        content.appendChild(sendButton);
        
        modal.querySelector('.modal-body').appendChild(content);
        document.body.appendChild(modal);
    }
    
    function showReceiveModal() {
        const modal = createModal('RECEIVE BITCOIN', () => {
            // Modal closed
        });
        
        const content = document.createElement('div');
        content.style.cssText = 'padding: calc(20px * var(--scale-factor)); text-align: center;';
        
        // Address type selector
        const typeSelector = document.createElement('div');
        typeSelector.style.cssText = 'display: flex; gap: calc(8px * var(--scale-factor)); margin-bottom: calc(20px * var(--scale-factor)); justify-content: center;';
        
        ['On-chain', 'Lightning'].forEach((type, index) => {
            const btn = document.createElement('button');
            btn.style.cssText = 'background: var(--bg-secondary); border: calc(1px * var(--scale-factor)) solid var(--border-color); color: var(--text-primary); padding: calc(8px * var(--scale-factor)) calc(16px * var(--scale-factor)); cursor: pointer; transition: all 0.2s ease; font-family: \'JetBrains Mono\', monospace;';
            btn.textContent = type;
            btn.onclick = () => {
                typeSelector.querySelectorAll('button').forEach(b => {
                    b.style.borderColor = 'var(--border-color)';
                    b.style.background = 'var(--bg-secondary)';
                });
                btn.style.borderColor = 'var(--text-primary)';
                btn.style.background = 'var(--bg-hover)';
            };
            if (index === 0) btn.click(); // Default to on-chain
            typeSelector.appendChild(btn);
        });
        
        // QR Code placeholder
        const qrContainer = document.createElement('div');
        qrContainer.style.cssText = 'width: calc(200px * var(--scale-factor)); height: calc(200px * var(--scale-factor)); background: var(--bg-secondary); border: calc(2px * var(--scale-factor)) solid var(--text-primary); margin: 0 auto calc(20px * var(--scale-factor)); display: flex; align-items: center; justify-content: center;';
        
        const qrPlaceholder = document.createElement('div');
        qrPlaceholder.style.cssText = 'color: var(--text-dim); font-size: calc(14px * var(--scale-factor));';
        qrPlaceholder.textContent = 'QR Code';
        qrContainer.appendChild(qrPlaceholder);
        
        // Address display
        const addressDisplay = document.createElement('div');
        addressDisplay.style.cssText = 'background: var(--bg-secondary); border: calc(1px * var(--scale-factor)) solid var(--border-color); padding: calc(16px * var(--scale-factor)); margin-bottom: calc(16px * var(--scale-factor)); font-family: \'JetBrains Mono\', monospace; font-size: calc(12px * var(--scale-factor)); word-break: break-all;';
        addressDisplay.textContent = 'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297';
        
        // Copy button
        const copyButton = document.createElement('button');
        copyButton.style.cssText = 'width: 100%; background: transparent; border: calc(2px * var(--scale-factor)) solid var(--text-primary); color: var(--text-primary); padding: calc(12px * var(--scale-factor)); font-size: calc(14px * var(--scale-factor)); cursor: pointer; transition: all 0.2s ease; font-family: \'JetBrains Mono\', monospace; text-transform: uppercase;';
        copyButton.textContent = 'COPY ADDRESS';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(addressDisplay.textContent);
            showNotification('Address copied to clipboard!', 'success');
        };
        
        content.appendChild(typeSelector);
        content.appendChild(qrContainer);
        content.appendChild(addressDisplay);
        content.appendChild(copyButton);
        
        modal.querySelector('.modal-body').appendChild(content);
        document.body.appendChild(modal);
    }
    
    function createModal(title, onClose) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); display: flex; align-items: center; justify-content: center; z-index: 1000;';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = 'background: var(--bg-primary); border: calc(2px * var(--scale-factor)) solid var(--text-primary); max-width: calc(500px * var(--scale-factor)); width: 90%; max-height: 90vh; overflow-y: auto;';
        
        const modalHeader = document.createElement('div');
        modalHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: calc(20px * var(--scale-factor)); border-bottom: calc(1px * var(--scale-factor)) solid var(--border-color);';
        
        const modalTitle = document.createElement('h2');
        modalTitle.style.cssText = 'font-size: calc(18px * var(--scale-factor)); color: var(--text-primary); margin: 0; text-transform: uppercase; letter-spacing: 0.05em;';
        modalTitle.textContent = title;
        
        const closeButton = document.createElement('button');
        closeButton.style.cssText = 'background: transparent; border: none; color: var(--text-primary); font-size: calc(24px * var(--scale-factor)); cursor: pointer; padding: 0; width: calc(32px * var(--scale-factor)); height: calc(32px * var(--scale-factor)); display: flex; align-items: center; justify-content: center;';
        closeButton.textContent = '×';
        closeButton.onclick = () => {
            modal.remove();
            if (onClose) onClose();
        };
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                if (onClose) onClose();
            }
        });
        
        // Close on Escape
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                if (onClose) onClose();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        return modal;
    }
    
    function createInputGroup(label, type, placeholder) {
        const group = document.createElement('div');
        group.style.cssText = 'margin-bottom: calc(20px * var(--scale-factor));';
        
        const labelEl = document.createElement('label');
        labelEl.style.cssText = 'display: block; margin-bottom: calc(8px * var(--scale-factor)); color: var(--text-dim); font-size: calc(12px * var(--scale-factor)); text-transform: uppercase;';
        labelEl.textContent = label;
        
        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.style.cssText = 'width: 100%; background: var(--bg-secondary); border: calc(1px * var(--scale-factor)) solid var(--border-color); color: var(--text-primary); padding: calc(12px * var(--scale-factor)); font-size: calc(14px * var(--scale-factor)); font-family: \'JetBrains Mono\', monospace; transition: all 0.2s ease;';
        
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--text-primary)';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = 'var(--border-color)';
        });
        
        group.appendChild(labelEl);
        group.appendChild(input);
        
        return group;
    }
    
    // API Integration Classes
    class BlockstreamAPI {
        constructor() {
            this.baseURL = 'https://blockstream.info/api';
        }
        
        async getBalance(address) {
            try {
                const response = await fetch(`${this.baseURL}/address/${address}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                return {
                    confirmed: data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum,
                    unconfirmed: data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum,
                    txCount: data.chain_stats.tx_count
                };
            } catch (error) {
                console.error('Blockstream API error:', error);
                throw error;
            }
        }
        
        async getTransactions(address, limit = 10) {
            try {
                const response = await fetch(`${this.baseURL}/address/${address}/txs`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const txs = await response.json();
                return txs.slice(0, limit);
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
                return [];
            }
        }
    }
    
    class PriceAPI {
        async getBTCPrice() {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
                const data = await response.json();
                return data.bitcoin.usd;
            } catch (error) {
                // Fallback to CoinCap
                try {
                    const response = await fetch('https://api.coincap.io/v2/rates/bitcoin');
                    const data = await response.json();
                    return parseFloat(data.data.rateUsd);
                } catch (fallbackError) {
                    console.error('All price APIs failed:', fallbackError);
                    return 0;
                }
            }
        }
    }
    
    // Initialize application
    document.addEventListener('DOMContentLoaded', () => {
        // Load theme preference
        const savedTheme = localStorage.getItem('mooshTheme');
        if (savedTheme === 'moosh') {
            window.walletState.isSparkTheme = true;
            document.body.classList.add('theme-spark');
        }
        
        // Build application
        buildApplication();
    });
    
})();