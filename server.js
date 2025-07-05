const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Handle static files (images, etc.)
  if (req.url.endsWith('.png') || req.url.endsWith('.jpg') || req.url.endsWith('.gif') || req.url.endsWith('.ico')) {
    const filePath = path.join(__dirname, req.url);
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
      
      const ext = path.extname(filePath).toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.ico') contentType = 'image/x-icon';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
    return;
  }

  // Serve the main page with pure JavaScript DOM creation
  res.writeHead(200, { 'Content-Type': 'text/html' });
  
  // Create the entire application using pure JavaScript
  const jsCode = `
    // MOOSH WALLET - 100% PURE JAVASCRIPT IMPLEMENTATION
    // Matching the exact reference UI
    
    (function() {
        'use strict';
        
        // State management
        const state = {
            theme: 'original',
            network: 'mainnet',
            selectedMnemonic: 12,
            passwordsMatch: false
        };
        
        // Create and inject Google Fonts link
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        
        // Set page metadata
        document.title = 'MOOSH Wallet - Bitcoin Native Wallet';
        
        const viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
        document.head.appendChild(viewportMeta);
        
        const charsetMeta = document.createElement('meta');
        charsetMeta.setAttribute('charset', 'UTF-8');
        document.head.appendChild(charsetMeta);
        
        // Create main style element with ALL styles from reference
        const styleElement = document.createElement('style');
        const styles = \`
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
                    --scale-factor: 1;
                    --font-base: 16px;
                    --container-padding: 40px;
                }
            }
            
            @media (min-width: 1600px) {
                :root {
                    --scale-factor: 1.05;
                    --font-base: 17px;
                }
            }

            * {
                box-sizing: border-box;
            }

            html {
                scroll-behavior: smooth;
            }

            body {
                font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Roboto Mono', 'Consolas', monospace;
                background: var(--bg-primary);
                color: var(--text-primary);
                min-height: 100vh;
                margin: 0;
                padding: 0;
                font-size: calc(var(--font-base) * var(--scale-factor));
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            /* THEME VARIATIONS */
            body.theme-moosh {
                --text-primary: #51fe5c;
                --text-accent: #69fd97;
                --text-string: #9bffac;
                --text-keyword: #6fedbf;
                --text-comment: #c8fff2;
                --border-active: #51fe5c;
            }
            
            /* CURSOR CONTAINER */
            .cursor-container {
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                width: 100%;
                background: var(--bg-primary);
            }
            
            /* HEADER STYLES */
            .cursor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: calc(16px * var(--scale-factor)) calc(20px * var(--scale-factor));
                border-bottom: 1px solid var(--border-color);
                background: var(--bg-primary);
                position: sticky;
                top: 0;
                z-index: 100;
            }
            
            /* BRAND BOX */
            .brand-box {
                display: flex;
                align-items: center;
                gap: calc(8px * var(--scale-factor));
            }
            
            .brand-logo {
                width: calc(20px * var(--scale-factor));
                height: calc(20px * var(--scale-factor));
                object-fit: contain;
            }
            
            .brand-text {
                font-size: calc(14px * var(--scale-factor));
                display: flex;
                align-items: center;
            }
            
            /* NAV LINKS */
            .nav-links {
                display: flex;
                align-items: center;
                gap: calc(20px * var(--scale-factor));
            }
            
            .nav-link {
                color: var(--text-primary);
                text-decoration: none;
                font-size: calc(14px * var(--scale-factor));
                transition: opacity 0.2s ease;
                cursor: pointer;
            }
            
            .nav-link:hover {
                opacity: 0.8;
            }
            
            /* THEME TOGGLE */
            .theme-toggle {
                display: flex;
                align-items: center;
                gap: calc(8px * var(--scale-factor));
                cursor: pointer;
            }
            
            .theme-toggle-icon {
                color: var(--text-primary);
                font-size: calc(12px * var(--scale-factor));
            }
            
            .theme-toggle-button {
                width: calc(24px * var(--scale-factor));
                height: calc(12px * var(--scale-factor));
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: calc(12px * var(--scale-factor));
                position: relative;
                transition: all 0.3s ease;
            }
            
            .theme-toggle-inner {
                width: calc(8px * var(--scale-factor));
                height: calc(8px * var(--scale-factor));
                background: var(--text-primary);
                border-radius: 50%;
                position: absolute;
                top: calc(1px * var(--scale-factor));
                left: calc(1px * var(--scale-factor));
                transition: transform 0.3s ease;
            }
            
            body.theme-moosh .theme-toggle-inner {
                transform: translateX(calc(12px * var(--scale-factor)));
            }
            
            /* CONTENT AREA */
            .cursor-content {
                flex: 1;
                padding: calc(var(--container-padding) * var(--scale-factor));
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
            }
            
            /* CARD */
            .card {
                width: 100%;
                max-width: calc(520px * var(--scale-factor));
                background: var(--bg-primary);
                padding: calc(32px * var(--scale-factor));
            }
            
            /* HEADINGS */
            h1 {
                margin: 0;
                font-weight: 700;
            }
            
            /* FLASH ANIMATION */
            .moosh-flash {
                animation: flash 1.5s ease-in-out infinite;
            }
            
            @keyframes flash {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            /* BLINK ANIMATION */
            .blink {
                animation: blink 1s infinite;
            }
            
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            
            /* TEXT STYLES */
            .text-dim {
                color: var(--text-dim);
            }
            
            .text-primary {
                color: var(--text-primary);
            }
            
            .text-keyword {
                color: var(--text-keyword);
            }
            
            .text-variable {
                color: var(--text-accent);
            }
            
            /* SUBTITLE */
            .token-site-subtitle {
                color: var(--text-dim);
                font-size: calc(14px * var(--scale-factor));
            }
            
            /* ADDRESS TYPES LIST */
            .address-types-list {
                cursor: pointer;
                transition: color 0.3s ease;
            }
            
            .address-types-list:hover {
                color: var(--text-secondary);
            }
            
            .address-type {
                color: var(--text-primary);
            }
            
            /* NETWORK TOGGLE */
            .network-toggle {
                display: flex;
                align-items: center;
                gap: calc(12px * var(--scale-factor));
            }
            
            .toggle-switch {
                width: calc(44px * var(--scale-factor));
                height: calc(22px * var(--scale-factor));
                background: var(--bg-tertiary);
                border: 2px solid var(--text-primary);
                border-radius: 0;
                position: relative;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .toggle-slider {
                width: calc(16px * var(--scale-factor));
                height: calc(16px * var(--scale-factor));
                background: var(--text-primary);
                position: absolute;
                top: calc(1px * var(--scale-factor));
                left: calc(1px * var(--scale-factor));
                transition: transform 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: calc(10px * var(--scale-factor));
                color: var(--bg-primary);
                font-weight: bold;
            }
            
            .toggle-switch.testnet .toggle-slider {
                transform: translateX(calc(22px * var(--scale-factor)));
            }
            
            .network-label {
                color: var(--text-primary);
                font-size: calc(12px * var(--scale-factor));
                font-weight: 500;
                text-transform: uppercase;
            }
            
            /* TERMINAL BOX */
            .terminal-box {
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                margin-bottom: calc(24px * var(--scale-factor));
                padding: calc(16px * var(--scale-factor));
            }
            
            .terminal-header {
                color: var(--text-dim);
                font-size: calc(12px * var(--scale-factor));
                margin-bottom: calc(16px * var(--scale-factor));
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .terminal-content {
                font-size: calc(12px * var(--scale-factor));
                line-height: 1.6;
            }
            
            /* TERMINAL RADIO SECTION */
            .terminal-radio-section {
                background: rgba(245, 115, 21, 0.05);
                border: 1px solid var(--border-color);
                border-radius: 0;
                padding: calc(12px * var(--scale-factor));
                margin-bottom: calc(16px * var(--scale-factor));
            }
            
            .security-seed-header {
                margin-bottom: calc(12px * var(--scale-factor));
                font-size: calc(12px * var(--scale-factor));
                font-weight: 600;
                text-align: center;
                cursor: pointer;
                transition: color 0.3s ease;
            }
            
            .security-seed-header:hover {
                color: var(--text-secondary);
            }
            
            /* CUSTOM RADIO */
            .custom-radio {
                width: calc(16px * var(--scale-factor));
                height: calc(16px * var(--scale-factor));
                border: 1px solid #333333;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #000000;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }
            
            .custom-radio.selected {
                border-color: var(--text-primary);
            }
            
            .radio-inner {
                width: calc(6px * var(--scale-factor));
                height: calc(6px * var(--scale-factor));
                border-radius: 50%;
                background: transparent;
                transition: all 0.2s ease;
            }
            
            .custom-radio.selected .radio-inner {
                background: var(--text-primary);
            }
            
            /* PASSWORD SECURITY SECTION */
            .password-security-section {
                background: rgba(245, 115, 21, 0.1);
                border: 1px solid var(--text-primary);
                border-radius: 0;
                padding: calc(24px * var(--scale-factor));
                margin-bottom: calc(24px * var(--scale-factor));
            }
            
            .password-security-title {
                color: var(--text-primary);
                font-weight: 600;
                margin-bottom: calc(12px * var(--scale-factor));
                font-size: calc(16px * var(--scale-factor));
                text-align: center;
            }
            
            .typing-text {
                margin-bottom: calc(20px * var(--scale-factor));
                text-align: center;
                line-height: 1.4;
            }
            
            .password-text-hover {
                color: var(--text-primary);
                transition: color 0.3s ease;
                cursor: pointer;
            }
            
            .password-text-hover:hover {
                color: var(--text-secondary);
            }
            
            .typing-cursor {
                display: inline-block;
                width: calc(2px * var(--scale-factor));
                height: calc(14px * var(--scale-factor));
                background: var(--text-primary);
                animation: blink 1s infinite;
                margin-left: calc(2px * var(--scale-factor));
                vertical-align: middle;
            }
            
            /* INPUT FIELDS */
            .input-field {
                width: 100%;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                font-family: 'JetBrains Mono', monospace;
                font-size: calc(14px * var(--scale-factor));
                padding: calc(12px * var(--scale-factor));
                border-radius: 0;
                transition: all 0.2s ease;
                outline: none;
            }
            
            .input-field:hover {
                border-color: var(--text-primary);
                color: var(--text-primary);
            }
            
            .input-field:focus {
                border-color: var(--text-primary);
                color: var(--text-primary);
            }
            
            /* WALLET ACTIONS */
            .wallet-actions {
                display: flex;
                flex-direction: column;
                gap: calc(16px * var(--scale-factor));
                margin-top: calc(32px * var(--scale-factor));
            }
            
            /* BUTTONS */
            button {
                background: #000000;
                border: 2px solid var(--text-primary);
                border-radius: 0;
                color: var(--text-primary);
                font-weight: 600;
                font-size: calc(16px * var(--scale-factor));
                padding: calc(16px * var(--scale-factor)) calc(32px * var(--scale-factor));
                font-family: 'JetBrains Mono', monospace;
                cursor: pointer;
                transition: all 0.2s ease;
                width: 100%;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                height: calc(56px * var(--scale-factor));
            }
            
            button:hover {
                background: var(--text-primary);
                color: #000000;
            }
            
            /* SVG ICON STYLES */
            svg {
                width: calc(16px * var(--scale-factor));
                height: calc(16px * var(--scale-factor));
            }
            
            /* FOOTER */
            footer {
                text-align: center;
                padding: calc(20px * var(--scale-factor)) 0;
                margin-top: calc(20px * var(--scale-factor));
                border-top: 1px solid var(--border-color);
                position: relative;
            }
            
            /* MOBILE RESPONSIVE */
            @media (max-width: 768px) {
                .cursor-header {
                    padding: calc(12px * var(--scale-factor)) calc(16px * var(--scale-factor));
                }
                
                .brand-text {
                    font-size: calc(12px * var(--scale-factor));
                }
                
                .nav-links {
                    gap: calc(12px * var(--scale-factor));
                }
                
                .card {
                    padding: calc(24px * var(--scale-factor));
                }
                
                h1 {
                    font-size: calc(28px * var(--scale-factor)) !important;
                }
                
                .terminal-box {
                    padding: calc(12px * var(--scale-factor));
                }
                
                .terminal-header,
                .terminal-content {
                    font-size: calc(10px * var(--scale-factor));
                }
                
                .custom-radio {
                    width: calc(12px * var(--scale-factor));
                    height: calc(12px * var(--scale-factor));
                }
                
                .radio-inner {
                    width: calc(4px * var(--scale-factor));
                    height: calc(4px * var(--scale-factor));
                }
                
                button {
                    font-size: calc(14px * var(--scale-factor));
                    padding: calc(14px * var(--scale-factor)) calc(24px * var(--scale-factor));
                    height: calc(48px * var(--scale-factor));
                }
            }
        \`;
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
        
        // Helper functions
        function toggleTheme() {
            document.body.classList.toggle('theme-moosh');
            state.theme = state.theme === 'original' ? 'moosh' : 'original';
        }
        
        function openTokenSite() {
            console.log('Opening Moosh.money...');
        }
        
        function toggleNetwork() {
            state.network = state.network === 'mainnet' ? 'testnet' : 'mainnet';
            const toggleSwitch = document.getElementById('networkToggle');
            const networkLabel = document.getElementById('networkLabel');
            const toggleSlider = toggleSwitch.querySelector('.toggle-slider');
            
            if (state.network === 'testnet') {
                toggleSwitch.classList.add('testnet');
                networkLabel.textContent = 'TESTNET';
                toggleSlider.textContent = '✓';
            } else {
                toggleSwitch.classList.remove('testnet');
                networkLabel.textContent = 'MAINNET';
                toggleSlider.textContent = '+';
            }
        }
        
        function selectMnemonic(count) {
            state.selectedMnemonic = count;
            const radio12 = document.getElementById('radio12');
            const radio24 = document.getElementById('radio24');
            
            if (count === 12) {
                radio12.classList.add('selected');
                radio24.classList.remove('selected');
            } else {
                radio24.classList.add('selected');
                radio12.classList.remove('selected');
            }
        }
        
        function togglePasswordVisibility(inputId, buttonId) {
            const input = document.getElementById(inputId);
            const button = document.getElementById(buttonId);
            
            if (input.type === 'password') {
                input.type = 'text';
                button.innerHTML = \`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>\`;
            } else {
                input.type = 'password';
                button.innerHTML = \`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>\`;
            }
        }
        
        function createWallet() {
            const createPassword = document.getElementById('createPasswordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            const errorDiv = document.getElementById('passwordError');
            const successDiv = document.getElementById('passwordSuccess');
            
            if (!createPassword || !confirmPassword) {
                errorDiv.textContent = 'Please enter passwords';
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
                return;
            }
            
            if (createPassword !== confirmPassword) {
                errorDiv.textContent = 'Passwords do not match';
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
                return;
            }
            
            console.log('Creating wallet...');
        }
        
        function importWallet() {
            console.log('Importing wallet...');
        }
        
        // Build the UI
        function buildUI() {
            // Clear body
            document.body.innerHTML = '';
            
            // Create cursor container
            const cursorContainer = document.createElement('div');
            cursorContainer.className = 'cursor-container';
            
            // Create header
            const header = document.createElement('header');
            header.className = 'cursor-header';
            
            // Brand box
            const brandBox = document.createElement('div');
            brandBox.className = 'brand-box';
            
            const brandLogo = document.createElement('img');
            brandLogo.src = '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png';
            brandLogo.alt = 'MOOSH Logo';
            brandLogo.className = 'brand-logo';
            brandLogo.onerror = function() { this.style.display = 'none'; };
            brandBox.appendChild(brandLogo);
            
            const brandText = document.createElement('div');
            brandText.className = 'brand-text';
            brandText.innerHTML = '<span class="text-dim">~/</span><span class="text-primary">moosh</span><span class="text-dim">/</span><span class="text-primary">wallet</span><span class="text-dim">.ts</span><span style="font-size: calc(8px * var(--scale-factor)); color: var(--text-primary); font-weight: 600; margin-left: calc(6px * var(--scale-factor)); text-transform: uppercase; letter-spacing: 0.05em;">BETA</span>';
            brandBox.appendChild(brandText);
            
            header.appendChild(brandBox);
            
            // Nav links
            const navLinks = document.createElement('nav');
            navLinks.className = 'nav-links';
            
            // Theme toggle
            const themeToggle = document.createElement('div');
            themeToggle.className = 'theme-toggle';
            themeToggle.onclick = toggleTheme;
            themeToggle.title = 'Toggle Theme';
            
            const themeIcon = document.createElement('span');
            themeIcon.id = 'themeIcon';
            themeIcon.className = 'theme-toggle-icon';
            themeIcon.textContent = '.theme';
            themeToggle.appendChild(themeIcon);
            
            const themeToggleButton = document.createElement('div');
            themeToggleButton.id = 'themeToggle';
            themeToggleButton.className = 'theme-toggle-button';
            
            const themeToggleInner = document.createElement('div');
            themeToggleInner.className = 'theme-toggle-inner';
            themeToggleButton.appendChild(themeToggleInner);
            
            themeToggle.appendChild(themeToggleButton);
            navLinks.appendChild(themeToggle);
            
            // Moosh.money link
            const mooshLink = document.createElement('a');
            mooshLink.href = '#';
            mooshLink.onclick = function(e) { e.preventDefault(); openTokenSite(); };
            mooshLink.className = 'nav-link';
            mooshLink.innerHTML = '<span class="text-dim">&lt;</span>Moosh.money<span class="text-dim"> /&gt;</span>';
            navLinks.appendChild(mooshLink);
            
            header.appendChild(navLinks);
            cursorContainer.appendChild(header);
            
            // Main content
            const content = document.createElement('div');
            content.className = 'cursor-content';
            
            const card = document.createElement('div');
            card.className = 'card';
            
            // Title
            const h1 = document.createElement('h1');
            h1.style.textAlign = 'center';
            h1.style.fontSize = 'calc(32px * var(--scale-factor))';
            h1.style.marginBottom = 'calc(8px * var(--scale-factor))';
            h1.style.display = 'flex';
            h1.style.alignItems = 'center';
            h1.style.justifyContent = 'center';
            h1.style.gap = 'calc(12px * var(--scale-factor))';
            
            const titleLogo = document.createElement('img');
            titleLogo.src = '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png';
            titleLogo.alt = 'MOOSH';
            titleLogo.style.width = 'calc(48px * var(--scale-factor))';
            titleLogo.style.height = 'calc(48px * var(--scale-factor))';
            titleLogo.style.objectFit = 'contain';
            titleLogo.onerror = function() { this.style.display = 'none'; };
            h1.appendChild(titleLogo);
            
            const mooshSpan = document.createElement('span');
            mooshSpan.className = 'moosh-flash';
            mooshSpan.textContent = 'MOOSH';
            h1.appendChild(mooshSpan);
            
            const walletSpan = document.createElement('span');
            walletSpan.className = 'text-dim';
            walletSpan.textContent = 'WALLET';
            h1.appendChild(walletSpan);
            
            card.appendChild(h1);
            
            // Subtitle
            const subtitle = document.createElement('p');
            subtitle.className = 'token-site-subtitle';
            subtitle.style.textAlign = 'center';
            subtitle.style.marginBottom = 'calc(16px * var(--scale-factor))';
            subtitle.textContent = 'Moosh.money Native Bitcoin wallet';
            card.appendChild(subtitle);
            
            // Address types list
            const addressTypes = document.createElement('div');
            addressTypes.className = 'address-types-list';
            addressTypes.style.textAlign = 'center';
            addressTypes.style.marginBottom = 'calc(var(--spacing-unit) * 3 * var(--scale-factor))';
            addressTypes.style.fontSize = 'calc(10px * var(--scale-factor))';
            addressTypes.style.lineHeight = 'var(--mobile-line-height)';
            addressTypes.style.color = 'var(--text-primary)';
            addressTypes.style.fontFamily = "'JetBrains Mono', monospace";
            addressTypes.style.cursor = 'pointer';
            addressTypes.style.transition = 'color 0.3s ease';
            addressTypes.style.padding = '0 calc(var(--spacing-unit) * var(--scale-factor))';
            addressTypes.innerHTML = '<span class="text-dim">&lt;</span> <span class="address-type">Spark Protocol</span> • <span class="address-type">Taproot</span> • <span class="address-type">Native SegWit</span> • <span class="address-type">Nested SegWit</span> • <span class="address-type">Legacy</span> <span class="text-dim">/&gt;</span>';
            card.appendChild(addressTypes);
            
            // Network toggle container
            const networkContainer = document.createElement('div');
            networkContainer.style.display = 'flex';
            networkContainer.style.justifyContent = 'flex-end';
            networkContainer.style.marginBottom = 'calc(var(--spacing-unit) * var(--scale-factor))';
            
            const networkToggle = document.createElement('div');
            networkToggle.className = 'network-toggle';
            
            const toggleSwitch = document.createElement('div');
            toggleSwitch.id = 'networkToggle';
            toggleSwitch.className = 'toggle-switch';
            toggleSwitch.onclick = toggleNetwork;
            
            const toggleSlider = document.createElement('div');
            toggleSlider.className = 'toggle-slider';
            toggleSlider.textContent = '+';
            toggleSwitch.appendChild(toggleSlider);
            
            networkToggle.appendChild(toggleSwitch);
            
            const networkLabel = document.createElement('span');
            networkLabel.id = 'networkLabel';
            networkLabel.className = 'network-label';
            networkLabel.textContent = 'MAINNET';
            networkToggle.appendChild(networkLabel);
            
            networkContainer.appendChild(networkToggle);
            card.appendChild(networkContainer);
            
            // Terminal box
            const terminalBox = document.createElement('div');
            terminalBox.className = 'terminal-box';
            
            const terminalHeader = document.createElement('div');
            terminalHeader.className = 'terminal-header';
            
            const terminalPrompt = document.createElement('span');
            terminalPrompt.textContent = '~/moosh/spark-wallet $';
            terminalHeader.appendChild(terminalPrompt);
            
            const sparkReady = document.createElement('span');
            sparkReady.className = 'text-keyword';
            sparkReady.innerHTML = 'spark-ready <span class="blink" style="font-size: calc(8px * var(--scale-factor));">●</span>';
            terminalHeader.appendChild(sparkReady);
            
            terminalBox.appendChild(terminalHeader);
            
            // Radio section
            const radioSection = document.createElement('div');
            radioSection.className = 'terminal-radio-section';
            
            const radioHeader = document.createElement('div');
            radioHeader.className = 'security-seed-header';
            radioHeader.innerHTML = '<span style="color: var(--text-dim);">&lt;</span><span style="color: var(--text-dim);"> Select Security Seed </span><span style="color: var(--text-dim);">/&gt;</span>';
            radioSection.appendChild(radioHeader);
            
            const radioOptions = document.createElement('div');
            radioOptions.style.display = 'flex';
            radioOptions.style.flexDirection = 'row';
            radioOptions.style.gap = 'calc(var(--spacing-unit) * 2 * var(--scale-factor))';
            radioOptions.style.justifyContent = 'center';
            radioOptions.style.alignItems = 'center';
            radioOptions.style.flexWrap = 'wrap';
            
            // 12 word option
            const option12 = document.createElement('div');
            option12.style.display = 'flex';
            option12.style.alignItems = 'center';
            option12.style.cursor = 'pointer';
            option12.style.padding = 'calc(var(--spacing-unit) * var(--scale-factor))';
            option12.onclick = function() { selectMnemonic(12); };
            
            const radio12 = document.createElement('div');
            radio12.id = 'radio12';
            radio12.className = 'custom-radio selected';
            
            const radioInner12 = document.createElement('div');
            radioInner12.className = 'radio-inner';
            radio12.appendChild(radioInner12);
            
            option12.appendChild(radio12);
            
            const label12 = document.createElement('span');
            label12.style.fontSize = 'calc(12px * var(--scale-factor))';
            label12.style.fontWeight = '500';
            label12.style.userSelect = 'none';
            label12.style.color = 'var(--text-primary)';
            label12.style.marginLeft = 'calc(var(--spacing-unit) * var(--scale-factor))';
            label12.textContent = '12 Word';
            option12.appendChild(label12);
            
            radioOptions.appendChild(option12);
            
            // 24 word option
            const option24 = document.createElement('div');
            option24.style.display = 'flex';
            option24.style.alignItems = 'center';
            option24.style.cursor = 'pointer';
            option24.style.padding = 'calc(var(--spacing-unit) * var(--scale-factor))';
            option24.onclick = function() { selectMnemonic(24); };
            
            const radio24 = document.createElement('div');
            radio24.id = 'radio24';
            radio24.className = 'custom-radio';
            
            const radioInner24 = document.createElement('div');
            radioInner24.className = 'radio-inner';
            radio24.appendChild(radioInner24);
            
            option24.appendChild(radio24);
            
            const label24 = document.createElement('span');
            label24.style.fontSize = 'calc(12px * var(--scale-factor))';
            label24.style.fontWeight = '500';
            label24.style.userSelect = 'none';
            label24.style.color = 'var(--text-primary)';
            label24.style.marginLeft = 'calc(var(--spacing-unit) * var(--scale-factor))';
            label24.textContent = '24 Word';
            option24.appendChild(label24);
            
            radioOptions.appendChild(option24);
            
            radioSection.appendChild(radioOptions);
            terminalBox.appendChild(radioSection);
            
            // Terminal content
            const terminalContent = document.createElement('div');
            terminalContent.className = 'terminal-content';
            terminalContent.innerHTML = \`
                <span style="color: var(--text-dim); font-size: calc(10px * var(--scale-factor)); line-height: 1.6;"># MOOSH Spark Protocol Wallet</span><br>
                <span class="text-keyword" style="font-size: calc(10px * var(--scale-factor)); line-height: 1.6;">import</span> <span class="text-primary" style="font-size: calc(10px * var(--scale-factor));">{</span> <span class="text-variable" style="font-size: calc(10px * var(--scale-factor));">SparkWallet</span> <span class="text-primary" style="font-size: calc(10px * var(--scale-factor));">}</span> <span class="text-keyword" style="font-size: calc(10px * var(--scale-factor));">from</span> <span class="text-keyword" style="font-size: calc(10px * var(--scale-factor));">"@buildonspark/spark-sdk"</span><span class="text-primary" style="font-size: calc(10px * var(--scale-factor));">;</span><br>
                <span class="text-keyword" style="font-size: calc(10px * var(--scale-factor)); line-height: 1.6;">const</span> <span class="text-variable" style="font-size: calc(10px * var(--scale-factor));">wallet</span> <span class="text-primary" style="font-size: calc(10px * var(--scale-factor));">=</span> <span class="text-keyword" style="font-size: calc(10px * var(--scale-factor));">await</span> <span class="text-variable" style="font-size: calc(10px * var(--scale-factor));">SparkWallet</span><span class="text-primary" style="font-size: calc(10px * var(--scale-factor));">.</span><span class="text-variable" style="font-size: calc(10px * var(--scale-factor));">initialize</span><span class="text-primary" style="font-size: calc(10px * var(--scale-factor));">();</span><br>
                <span style="color: var(--text-dim); font-size: calc(10px * var(--scale-factor)); line-height: 1.6;"># Real sp1... addresses + Bitcoin Layer 2</span><br>
                <span style="color: var(--text-keyword); font-size: calc(10px * var(--scale-factor)); line-height: 1.6;"># Development Server: Bitcoin Blockchain</span>
            \`;
            terminalBox.appendChild(terminalContent);
            
            card.appendChild(terminalBox);
            
            // Password security section
            const passwordSection = document.createElement('div');
            passwordSection.className = 'password-security-section';
            
            const passwordTitle = document.createElement('div');
            passwordTitle.className = 'password-security-title';
            passwordTitle.textContent = 'Moosh Wallet Security';
            passwordSection.appendChild(passwordTitle);
            
            const typingText = document.createElement('div');
            typingText.className = 'typing-text';
            typingText.innerHTML = '<span class="text-dim">&lt;</span><span class="password-text-hover">Create a secure password to protect your wallet access</span><span class="text-dim"> /&gt;</span><span class="typing-cursor"></span>';
            passwordSection.appendChild(typingText);
            
            // Create password field
            const createPasswordDiv = document.createElement('div');
            createPasswordDiv.style.marginBottom = 'calc(16px * var(--scale-factor))';
            
            const createLabel = document.createElement('label');
            createLabel.className = 'text-dim';
            createLabel.style.display = 'block';
            createLabel.style.marginBottom = 'calc(8px * var(--scale-factor))';
            createLabel.style.fontWeight = '500';
            createLabel.textContent = 'Create Password';
            createPasswordDiv.appendChild(createLabel);
            
            const createInputWrapper = document.createElement('div');
            createInputWrapper.style.position = 'relative';
            createInputWrapper.style.display = 'flex';
            createInputWrapper.style.alignItems = 'center';
            
            const createInput = document.createElement('input');
            createInput.id = 'createPasswordInput';
            createInput.className = 'input-field';
            createInput.type = 'password';
            createInput.placeholder = 'Enter secure password...';
            createInput.style.paddingRight = 'calc(40px * var(--scale-factor))';
            createInputWrapper.appendChild(createInput);
            
            const createToggle = document.createElement('button');
            createToggle.id = 'toggleCreatePassword';
            createToggle.type = 'button';
            createToggle.onclick = function() { togglePasswordVisibility('createPasswordInput', 'toggleCreatePassword'); };
            createToggle.style.position = 'absolute';
            createToggle.style.right = 'calc(12px * var(--scale-factor))';
            createToggle.style.background = 'none';
            createToggle.style.border = 'none';
            createToggle.style.color = 'var(--text-dim)';
            createToggle.style.cursor = 'pointer';
            createToggle.style.padding = 'calc(4px * var(--scale-factor))';
            createToggle.style.transition = 'color 0.2s ease';
            createToggle.style.width = 'calc(20px * var(--scale-factor))';
            createToggle.style.height = 'calc(20px * var(--scale-factor))';
            createToggle.style.display = 'flex';
            createToggle.style.alignItems = 'center';
            createToggle.style.justifyContent = 'center';
            createToggle.title = 'Show password';
            createToggle.onmouseover = function() { this.style.color = 'var(--text-primary)'; };
            createToggle.onmouseout = function() { this.style.color = 'var(--text-dim)'; };
            createToggle.innerHTML = \`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>\`;
            createInputWrapper.appendChild(createToggle);
            
            createPasswordDiv.appendChild(createInputWrapper);
            passwordSection.appendChild(createPasswordDiv);
            
            // Confirm password field
            const confirmPasswordDiv = document.createElement('div');
            confirmPasswordDiv.style.marginBottom = 'calc(16px * var(--scale-factor))';
            
            const confirmLabel = document.createElement('label');
            confirmLabel.className = 'text-dim';
            confirmLabel.style.display = 'block';
            confirmLabel.style.marginBottom = 'calc(8px * var(--scale-factor))';
            confirmLabel.style.fontWeight = '500';
            confirmLabel.textContent = 'Re-enter Password';
            confirmPasswordDiv.appendChild(confirmLabel);
            
            const confirmInputWrapper = document.createElement('div');
            confirmInputWrapper.style.position = 'relative';
            confirmInputWrapper.style.display = 'flex';
            confirmInputWrapper.style.alignItems = 'center';
            
            const confirmInput = document.createElement('input');
            confirmInput.id = 'confirmPasswordInput';
            confirmInput.className = 'input-field';
            confirmInput.type = 'password';
            confirmInput.placeholder = 'Confirm password...';
            confirmInput.style.paddingRight = 'calc(40px * var(--scale-factor))';
            confirmInputWrapper.appendChild(confirmInput);
            
            const confirmToggle = document.createElement('button');
            confirmToggle.id = 'toggleConfirmPassword';
            confirmToggle.type = 'button';
            confirmToggle.onclick = function() { togglePasswordVisibility('confirmPasswordInput', 'toggleConfirmPassword'); };
            confirmToggle.style.position = 'absolute';
            confirmToggle.style.right = 'calc(12px * var(--scale-factor))';
            confirmToggle.style.background = 'none';
            confirmToggle.style.border = 'none';
            confirmToggle.style.color = 'var(--text-dim)';
            confirmToggle.style.cursor = 'pointer';
            confirmToggle.style.padding = 'calc(4px * var(--scale-factor))';
            confirmToggle.style.transition = 'color 0.2s ease';
            confirmToggle.style.width = 'calc(20px * var(--scale-factor))';
            confirmToggle.style.height = 'calc(20px * var(--scale-factor))';
            confirmToggle.style.display = 'flex';
            confirmToggle.style.alignItems = 'center';
            confirmToggle.style.justifyContent = 'center';
            confirmToggle.title = 'Show password';
            confirmToggle.onmouseover = function() { this.style.color = 'var(--text-primary)'; };
            confirmToggle.onmouseout = function() { this.style.color = 'var(--text-dim)'; };
            confirmToggle.innerHTML = \`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>\`;
            confirmInputWrapper.appendChild(confirmToggle);
            
            confirmPasswordDiv.appendChild(confirmInputWrapper);
            passwordSection.appendChild(confirmPasswordDiv);
            
            // Error and success messages
            const passwordError = document.createElement('div');
            passwordError.id = 'passwordError';
            passwordError.style.color = '#ff4444';
            passwordError.style.fontSize = 'calc(10px * var(--scale-factor))';
            passwordError.style.marginTop = 'calc(6px * var(--scale-factor))';
            passwordError.style.display = 'none';
            passwordSection.appendChild(passwordError);
            
            const passwordSuccess = document.createElement('div');
            passwordSuccess.id = 'passwordSuccess';
            passwordSuccess.style.color = 'var(--text-keyword)';
            passwordSuccess.style.fontSize = 'calc(10px * var(--scale-factor))';
            passwordSuccess.style.marginTop = 'calc(6px * var(--scale-factor))';
            passwordSuccess.style.display = 'none';
            passwordSuccess.textContent = 'Passwords match!';
            passwordSection.appendChild(passwordSuccess);
            
            card.appendChild(passwordSection);
            
            // Wallet actions
            const walletActions = document.createElement('div');
            walletActions.className = 'wallet-actions';
            
            const createButton = document.createElement('button');
            createButton.onclick = createWallet;
            createButton.textContent = '<Create Wallet/>';
            createButton.onmouseover = function() { this.style.background = 'var(--text-primary)'; this.style.color = '#000000'; };
            createButton.onmouseout = function() { this.style.background = '#000000'; this.style.color = 'var(--text-primary)'; };
            walletActions.appendChild(createButton);
            
            const importButton = document.createElement('button');
            importButton.onclick = importWallet;
            importButton.textContent = '<Import Wallet/>';
            importButton.onmouseover = function() { this.style.background = 'var(--text-primary)'; this.style.color = '#000000'; };
            importButton.onmouseout = function() { this.style.background = '#000000'; this.style.color = 'var(--text-primary)'; };
            walletActions.appendChild(importButton);
            
            card.appendChild(walletActions);
            
            content.appendChild(card);
            cursorContainer.appendChild(content);
            
            // Footer
            const footer = document.createElement('footer');
            
            const footerText1 = document.createElement('div');
            footerText1.style.color = 'var(--text-primary)';
            footerText1.style.fontSize = 'calc(11px * var(--scale-factor))';
            footerText1.style.fontWeight = '500';
            footerText1.style.letterSpacing = '0.05em';
            footerText1.style.fontFamily = "'JetBrains Mono', monospace";
            footerText1.textContent = '© 2025 MOOSH Wallet Limited. All rights reserved.';
            footer.appendChild(footerText1);
            
            const footerText2 = document.createElement('div');
            footerText2.style.color = 'var(--text-dim)';
            footerText2.style.fontSize = 'calc(10px * var(--scale-factor))';
            footerText2.style.marginTop = 'calc(4px * var(--scale-factor))';
            footerText2.style.fontFamily = "'JetBrains Mono', monospace";
            footerText2.textContent = "World's First AI-Powered Bitcoin Wallet";
            footer.appendChild(footerText2);
            
            cursorContainer.appendChild(footer);
            
            // Add to body
            document.body.appendChild(cursorContainer);
            
            // Add event listeners for password validation
            document.getElementById('createPasswordInput').addEventListener('input', validatePasswords);
            document.getElementById('confirmPasswordInput').addEventListener('input', validatePasswords);
        }
        
        function validatePasswords() {
            const createPassword = document.getElementById('createPasswordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            const errorDiv = document.getElementById('passwordError');
            const successDiv = document.getElementById('passwordSuccess');
            
            if (createPassword && confirmPassword) {
                if (createPassword === confirmPassword) {
                    successDiv.style.display = 'block';
                    errorDiv.style.display = 'none';
                    state.passwordsMatch = true;
                } else {
                    errorDiv.textContent = 'Passwords do not match';
                    errorDiv.style.display = 'block';
                    successDiv.style.display = 'none';
                    state.passwordsMatch = false;
                }
            } else {
                errorDiv.style.display = 'none';
                successDiv.style.display = 'none';
                state.passwordsMatch = false;
            }
        }
        
        // Initialize the UI
        buildUI();
        
        // Make functions available globally
        window.toggleTheme = toggleTheme;
        window.openTokenSite = openTokenSite;
        window.toggleNetwork = toggleNetwork;
        window.selectMnemonic = selectMnemonic;
        window.togglePasswordVisibility = togglePasswordVisibility;
        window.createWallet = createWallet;
        window.importWallet = importWallet;
    })();
  `;
  
  // Send the response with minimal HTML wrapper
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
</head>
<body>
<script>${jsCode}</script>
</body>
</html>`);
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MOOSH Wallet Server running on http://localhost:${PORT}`);
  console.log(`🌐 Also accessible at http://0.0.0.0:${PORT}`);
  console.log(`📱 100% Pure JavaScript Implementation - No HTML!`);
  console.log(`🕐 Server started at: ${new Date().toISOString()}`);
});