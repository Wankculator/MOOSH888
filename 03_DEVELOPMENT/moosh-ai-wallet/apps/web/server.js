const http = require("http");
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Handle static files (images)
  if (req.url.endsWith('.png') || req.url.endsWith('.jpg') || req.url.endsWith('.gif') || req.url.endsWith('.ico')) {
    const filePath = path.join(__dirname, '../..', req.url);
    
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
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover">
    <title>MOOSH Wallet - Bitcoin Native Wallet</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style id="mainStyles"></style>
</head>
<body>
    <script>
        // CSS STYLES DEFINITION
        const cssStyles = \`
            /* MOBILE-FIRST RESPONSIVE DESIGN */
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
                --scale-factor: 0.8;
                --font-base: 14px;
                --spacing-unit: 8px;
                --container-padding: 16px;
                --button-height: 48px;
                --input-height: 44px;
            }
            
            /* RESPONSIVE SCALING */
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
                line-height: 1.5;
                font-weight: 400;
                font-size: calc(var(--font-base) * var(--scale-factor));
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                font-variant-numeric: tabular-nums;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            /* Typography */
            .gradient-text {
                color: var(--text-accent);
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }

            .moosh-flash {
                color: var(--text-dim);
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                animation: mooshFlash 3s ease-in-out infinite;
            }

            @keyframes mooshFlash {
                0%, 70%, 100% {
                    color: var(--text-dim);
                }
                15%, 55% {
                    color: var(--text-primary);
                    text-shadow: 0 0 10px rgba(245, 115, 21, 0.5);
                }
            }

            .text-keyword { color: var(--text-keyword); }
            .text-string { color: var(--text-string); }
            .text-comment { color: var(--text-comment); }
            .text-variable { color: var(--text-secondary); }
            .text-primary { color: var(--text-primary); }
            .text-secondary { color: var(--text-secondary); }
            .text-accent { color: var(--text-accent); }
            .text-dim { color: var(--text-dim); }

            /* Layout Components */
            .cursor-container {
                width: 100%;
                max-width: 1280px;
                margin: 0 auto;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }

            .cursor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 var(--container-padding);
                height: 60px;
                border-bottom: var(--border-width) solid var(--border-color);
                background: var(--bg-secondary);
                position: sticky;
                top: 0;
                z-index: 100;
            }

            .brand-box {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .brand-logo {
                width: 24px;
                height: 24px;
                object-fit: contain;
            }

            .brand-text {
                display: flex;
                align-items: center;
                font-size: 14px;
                font-weight: 500;
            }

            .nav-links {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .theme-toggle {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
            }

            .theme-toggle-icon {
                color: var(--text-dim);
                font-size: 12px;
                font-weight: 500;
                transition: color 0.2s ease;
            }

            .theme-toggle:hover .theme-toggle-icon {
                color: var(--text-primary);
            }

            .theme-toggle-button {
                width: 44px;
                height: 24px;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                position: relative;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .theme-toggle-inner {
                width: 18px;
                height: 18px;
                background: var(--text-primary);
                border-radius: 50%;
                position: absolute;
                top: 2px;
                left: 2px;
                transition: transform 0.3s ease;
            }

            body.theme-spark .theme-toggle-inner {
                transform: translateX(20px);
                background: var(--text-accent);
            }

            body.theme-spark {
                --text-primary: #69fd97bd;
                --text-keyword: #9bffac;
            }

            .nav-link {
                color: var(--text-secondary);
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                padding: 8px 16px;
                border-radius: 8px;
                transition: all 0.2s ease;
            }

            .nav-link:hover {
                background: var(--bg-hover);
                color: var(--text-primary);
            }

            .cursor-content {
                flex: 1;
                padding: var(--container-padding);
            }

            .card {
                background: var(--bg-secondary);
                border: var(--border-width) solid var(--border-color);
                border-radius: 0;
                position: relative;
                transition: all var(--transition-speed) ease;
                padding: 24px;
                margin-bottom: 16px;
            }

            .card:hover {
                background: #000000;
                border-color: var(--text-primary);
            }

            /* Terminal Box */
            .terminal-box {
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: 0;
                padding: 16px;
                margin-bottom: 24px;
                font-family: 'JetBrains Mono', monospace;
            }

            .terminal-header {
                color: var(--text-dim);
                font-size: 10px;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .terminal-content {
                font-size: 10px;
                line-height: 1.6;
            }

            /* Form Elements */
            .input-field {
                width: 100%;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: 0;
                padding: 12px 16px;
                color: var(--text-secondary);
                font-family: 'JetBrains Mono', monospace;
                font-size: 14px;
                transition: all 0.2s ease;
                outline: none;
            }

            .input-field:focus {
                border-color: var(--text-primary);
                background: var(--bg-secondary);
            }

            .input-field::placeholder {
                color: var(--text-dim);
            }

            /* Network Toggle */
            .network-toggle {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .toggle-switch {
                width: 48px;
                height: 24px;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: 0;
                position: relative;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .toggle-slider {
                width: 20px;
                height: 20px;
                background: var(--text-primary);
                border-radius: 0;
                position: absolute;
                top: 1px;
                left: 1px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                color: var(--bg-primary);
                transition: transform 0.2s ease;
            }

            .toggle-switch.testnet .toggle-slider {
                transform: translateX(24px);
            }

            .network-label {
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            /* Radio Buttons */
            .terminal-radio-section {
                background: rgba(245, 115, 21, 0.05);
                border: 1px solid var(--border-color);
                border-radius: 0;
                padding: 12px;
                margin-bottom: 16px;
            }

            .security-seed-header {
                font-size: 10px;
                font-weight: 600;
                text-align: center;
                margin-bottom: 8px;
                cursor: pointer;
                transition: color 0.3s ease;
            }

            .security-seed-header:hover {
                color: var(--text-primary);
            }

            .custom-radio {
                width: 12px;
                height: 12px;
                border: 1px solid #333333;
                border-radius: 50%;
                margin-right: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #000000;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .radio-inner {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: transparent;
                transition: all 0.2s ease;
            }

            /* Password Section */
            .password-security-section {
                background: rgba(245, 115, 21, 0.1);
                border: 1px solid var(--text-primary);
                border-radius: 0;
                padding: 20px;
                margin-bottom: 24px;
            }

            .password-security-title {
                color: var(--text-primary);
                font-weight: 600;
                margin-bottom: 12px;
                font-size: 16px;
                text-align: center;
            }

            .typing-text {
                margin-bottom: 20px;
                text-align: center;
                line-height: 1.4;
            }

            .password-text-hover {
                color: var(--text-secondary);
                transition: color 0.3s ease;
            }

            .password-text-hover:hover {
                color: var(--text-primary);
            }

            .typing-cursor {
                display: inline-block;
                width: 2px;
                height: 16px;
                background: var(--text-primary);
                margin-left: 2px;
                animation: blink 1s infinite;
            }

            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }

            /* Buttons */
            .wallet-actions {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-top: 24px;
            }

            .wallet-actions button {
                background: #000000;
                border: 2px solid var(--text-primary);
                border-radius: 0;
                color: var(--text-primary);
                font-weight: 600;
                font-size: 16px;
                padding: 16px 32px;
                font-family: 'JetBrains Mono', monospace;
                cursor: pointer;
                transition: all 0.2s ease;
                width: 100%;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                height: 56px;
            }

            .wallet-actions button:hover {
                background: var(--text-primary);
                color: #000000;
            }

            /* Mobile Styles */
            @media (max-width: 768px) {
                .cursor-content {
                    padding: calc(var(--container-padding) * var(--scale-factor)) calc(var(--container-padding) * var(--scale-factor) * 0.75);
                }
                
                h1 {
                    flex-direction: row !important;
                    gap: calc(var(--spacing-unit) * var(--scale-factor)) !important;
                    align-items: center !important;
                    justify-content: center !important;
                    flex-wrap: nowrap !important;
                    font-size: calc(28px * var(--scale-factor)) !important;
                }
                
                .moosh-flash, .text-dim {
                    font-size: calc(20px * var(--scale-factor)) !important;
                }
                
                .moosh-logo, h1 img {
                    width: calc(32px * var(--scale-factor)) !important;
                    height: calc(32px * var(--scale-factor)) !important;
                }
            }

            /* Footer */
            footer {
                text-align: center;
                padding: 20px 0;
                margin-top: 20px;
                border-top: 1px solid var(--border-color);
            }
        \`;

        // INJECT STYLES
        document.getElementById('mainStyles').textContent = cssStyles;

        // GLOBAL STATE
        let isMainnet = true;
        let selectedMnemonic = 12;
        let isSparkTheme = false;
        let currentPage = 'home';
        let navigationHistory = ['home'];

        // DOM CREATION UTILITIES
        function createElement(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            
            // Set attributes
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else if (key === 'className') {
                    element.className = value;
                } else if (key.startsWith('on')) {
                    element[key] = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            // Add children
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child) {
                    element.appendChild(child);
                }
            });
            
            return element;
        }

        // BUILD HEADER
        function buildHeader() {
            const header = createElement('header', { className: 'cursor-header' }, [
                // Brand Box
                createElement('div', { className: 'brand-box' }, [
                    createElement('img', {
                        src: '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png',
                        alt: 'MOOSH Logo',
                        className: 'brand-logo',
                        onerror: function() { this.style.display = 'none'; }
                    }),
                    createElement('div', { className: 'brand-text' }, [
                        createElement('span', { className: 'text-dim' }, ['~/']),
                        createElement('span', { className: 'text-primary' }, ['moosh']),
                        createElement('span', { className: 'text-dim' }, ['/']),
                        createElement('span', { className: 'text-primary' }, ['wallet']),
                        createElement('span', { className: 'text-dim' }, ['.ts']),
                        createElement('span', {
                            style: {
                                fontSize: 'calc(8px * var(--scale-factor))',
                                color: 'var(--text-primary)',
                                fontWeight: '600',
                                marginLeft: 'calc(6px * var(--scale-factor))',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }
                        }, ['BETA'])
                    ])
                ]),
                
                // Navigation
                createElement('nav', { className: 'nav-links' }, [
                    // Theme Toggle
                    createElement('div', {
                        className: 'theme-toggle',
                        onclick: toggleTheme,
                        title: 'Toggle Theme'
                    }, [
                        createElement('span', {
                            id: 'themeIcon',
                            className: 'theme-toggle-icon'
                        }, ['.theme']),
                        createElement('div', {
                            id: 'themeToggle',
                            className: 'theme-toggle-button'
                        }, [
                            createElement('div', { className: 'theme-toggle-inner' })
                        ])
                    ]),
                    
                    // Moosh.money Link
                    createElement('a', {
                        href: '#',
                        onclick: openTokenSite,
                        className: 'nav-link'
                    }, [
                        createElement('span', { className: 'text-dim' }, ['<']),
                        'Moosh.money',
                        createElement('span', { className: 'text-dim' }, [' />'])
                    ])
                ])
            ]);
            
            return header;
        }

        // BUILD HOME PAGE CONTENT
        function buildHomePage() {
            const card = createElement('div', { className: 'card' }, [
                // Title
                createElement('h1', {
                    style: {
                        textAlign: 'center',
                        fontSize: 'calc(32px * var(--scale-factor))',
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'calc(12px * var(--scale-factor))'
                    }
                }, [
                    createElement('img', {
                        src: '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png',
                        alt: 'MOOSH',
                        style: {
                            width: 'calc(48px * var(--scale-factor))',
                            height: 'calc(48px * var(--scale-factor))',
                            objectFit: 'contain'
                        },
                        onerror: function() { this.style.display = 'none'; }
                    }),
                    createElement('span', { className: 'moosh-flash' }, ['MOOSH']),
                    ' ',
                    createElement('span', { className: 'text-dim' }, ['WALLET'])
                ]),
                
                // Subtitle
                createElement('p', {
                    className: 'token-site-subtitle',
                    style: {
                        textAlign: 'center',
                        marginBottom: 'calc(16px * var(--scale-factor))'
                    }
                }, ['Moosh.money Native Bitcoin wallet']),
                
                // Address Types List
                createElement('div', {
                    className: 'address-types-list',
                    style: {
                        textAlign: 'center',
                        marginBottom: 'calc(var(--spacing-unit) * 3 * var(--scale-factor))',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        lineHeight: 'var(--mobile-line-height)',
                        color: 'var(--text-primary)',
                        fontFamily: "'JetBrains Mono', monospace",
                        cursor: 'pointer',
                        transition: 'color 0.3s ease',
                        padding: '0 calc(var(--spacing-unit) * var(--scale-factor))'
                    }
                }, [
                    createElement('span', { className: 'text-dim' }, ['<']),
                    ' ',
                    createElement('span', { className: 'address-type' }, ['Spark Protocol']),
                    ' • ',
                    createElement('span', { className: 'address-type' }, ['Taproot']),
                    ' • ',
                    createElement('span', { className: 'address-type' }, ['Native SegWit']),
                    ' • ',
                    createElement('span', { className: 'address-type' }, ['Nested SegWit']),
                    ' • ',
                    createElement('span', { className: 'address-type' }, ['Legacy']),
                    ' ',
                    createElement('span', { className: 'text-dim' }, ['/>'])
                ]),
                
                // Network Toggle
                createElement('div', {
                    style: {
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: 'calc(var(--spacing-unit) * var(--scale-factor))'
                    }
                }, [
                    createElement('div', { className: 'network-toggle' }, [
                        createElement('div', {
                            id: 'networkToggle',
                            className: 'toggle-switch',
                            onclick: toggleNetwork
                        }, [
                            createElement('div', { className: 'toggle-slider' }, ['+'])
                        ]),
                        createElement('span', {
                            id: 'networkLabel',
                            className: 'network-label'
                        }, ['MAINNET'])
                    ])
                ]),
                
                // Terminal Box
                buildTerminalBox(),
                
                // Password Security Section
                buildPasswordSection(),
                
                // Wallet Actions
                createElement('div', { className: 'wallet-actions' }, [
                    createElement('button', {
                        onclick: createWallet,
                        style: {
                            background: '#000000',
                            border: '2px solid var(--text-primary)',
                            borderRadius: '0',
                            color: 'var(--text-primary)',
                            fontWeight: '600',
                            fontSize: 'calc(16px * var(--scale-factor))',
                            padding: 'calc(16px * var(--scale-factor)) calc(32px * var(--scale-factor))',
                            fontFamily: "'JetBrains Mono', monospace",
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            width: '100%',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            height: 'calc(56px * var(--scale-factor))'
                        },
                        onmouseover: function() {
                            this.style.background = 'var(--text-primary)';
                            this.style.color = '#000000';
                        },
                        onmouseout: function() {
                            this.style.background = '#000000';
                            this.style.color = 'var(--text-primary)';
                        }
                    }, ['<Create Wallet/>']),
                    
                    createElement('button', {
                        onclick: importWallet,
                        style: {
                            background: '#000000',
                            border: '2px solid var(--text-primary)',
                            borderRadius: '0',
                            color: 'var(--text-primary)',
                            fontWeight: '600',
                            fontSize: 'calc(16px * var(--scale-factor))',
                            padding: 'calc(16px * var(--scale-factor)) calc(32px * var(--scale-factor))',
                            fontFamily: "'JetBrains Mono', monospace",
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            width: '100%',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            height: 'calc(56px * var(--scale-factor))'
                        },
                        onmouseover: function() {
                            this.style.background = 'var(--text-primary)';
                            this.style.color = '#000000';
                        },
                        onmouseout: function() {
                            this.style.background = '#000000';
                            this.style.color = 'var(--text-primary)';
                        }
                    }, ['<Import Wallet/>'])
                ])
            ]);
            
            return card;
        }

        // BUILD TERMINAL BOX
        function buildTerminalBox() {
            return createElement('div', { className: 'terminal-box' }, [
                // Terminal Header
                createElement('div', { className: 'terminal-header' }, [
                    createElement('span', {}, ['~/moosh/spark-wallet $']),
                    createElement('span', { className: 'text-keyword' }, [
                        'spark-ready ',
                        createElement('span', {
                            className: 'blink',
                            style: { fontSize: 'calc(8px * var(--scale-factor))' }
                        }, ['●'])
                    ])
                ]),
                
                // Radio Buttons Section
                createElement('div', {
                    className: 'terminal-radio-section',
                    style: {
                        marginBottom: 'calc(var(--spacing-unit) * 1.5 * var(--scale-factor))',
                        padding: 'calc(var(--spacing-unit) * var(--scale-factor))',
                        background: 'rgba(245, 115, 21, 0.05)',
                        border: 'calc(1px * var(--scale-factor)) solid var(--border-color)',
                        borderRadius: '0'
                    }
                }, [
                    // Header
                    createElement('div', {
                        className: 'security-seed-header',
                        style: {
                            marginBottom: 'calc(var(--spacing-unit) * var(--scale-factor))',
                            fontSize: 'calc(10px * var(--scale-factor))',
                            fontWeight: '600',
                            textAlign: 'center',
                            lineHeight: 'var(--mobile-line-height)',
                            cursor: 'pointer',
                            transition: 'color 0.3s ease'
                        }
                    }, [
                        createElement('span', { style: { color: 'var(--text-dim)' } }, ['<']),
                        createElement('span', { style: { color: 'var(--text-dim)' } }, [' Select Security Seed ']),
                        createElement('span', { style: { color: 'var(--text-dim)' } }, ['/>'])
                    ]),
                    
                    // Radio Options
                    createElement('div', {
                        style: {
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 'calc(var(--spacing-unit) * 2 * var(--scale-factor))',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }
                    }, [
                        // 12 Word Option
                        createElement('div', {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: 'calc(var(--spacing-unit) * var(--scale-factor))',
                                minHeight: 'calc(var(--touch-target-min) * 0.8 * var(--scale-factor))'
                            },
                            onclick: () => selectMnemonic(12)
                        }, [
                            createElement('div', {
                                id: 'radio12',
                                className: 'custom-radio',
                                style: {
                                    width: 'calc(12px * var(--scale-factor))',
                                    height: 'calc(12px * var(--scale-factor))',
                                    border: 'calc(1px * var(--scale-factor)) solid #333333',
                                    borderRadius: '50%',
                                    marginRight: 'calc(var(--spacing-unit) * var(--scale-factor))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#000000',
                                    transition: 'all 0.2s ease',
                                    flexShrink: '0'
                                }
                            }, [
                                createElement('div', {
                                    className: 'radio-inner',
                                    style: {
                                        width: 'calc(4px * var(--scale-factor))',
                                        height: 'calc(4px * var(--scale-factor))',
                                        borderRadius: '50%',
                                        background: 'var(--text-primary)',
                                        transition: 'all 0.2s ease'
                                    }
                                })
                            ]),
                            createElement('span', {
                                style: {
                                    fontSize: 'calc(10px * var(--scale-factor))',
                                    fontWeight: '500',
                                    userSelect: 'none',
                                    color: 'var(--text-primary)',
                                    lineHeight: 'var(--mobile-line-height)'
                                }
                            }, ['12 Word'])
                        ]),
                        
                        // 24 Word Option
                        createElement('div', {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: 'calc(var(--spacing-unit) * var(--scale-factor))',
                                minHeight: 'calc(var(--touch-target-min) * 0.8 * var(--scale-factor))'
                            },
                            onclick: () => selectMnemonic(24)
                        }, [
                            createElement('div', {
                                id: 'radio24',
                                className: 'custom-radio',
                                style: {
                                    width: 'calc(12px * var(--scale-factor))',
                                    height: 'calc(12px * var(--scale-factor))',
                                    border: 'calc(1px * var(--scale-factor)) solid #333333',
                                    borderRadius: '50%',
                                    marginRight: 'calc(var(--spacing-unit) * var(--scale-factor))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#000000',
                                    transition: 'all 0.2s ease',
                                    flexShrink: '0'
                                }
                            }, [
                                createElement('div', {
                                    className: 'radio-inner',
                                    style: {
                                        width: 'calc(4px * var(--scale-factor))',
                                        height: 'calc(4px * var(--scale-factor))',
                                        borderRadius: '50%',
                                        background: 'transparent',
                                        transition: 'all 0.2s ease'
                                    }
                                })
                            ]),
                            createElement('span', {
                                style: {
                                    fontSize: 'calc(10px * var(--scale-factor))',
                                    fontWeight: '500',
                                    userSelect: 'none',
                                    color: 'var(--text-primary)',
                                    lineHeight: 'var(--mobile-line-height)'
                                }
                            }, ['24 Word'])
                        ])
                    ])
                ]),
                
                // Terminal Content
                createElement('div', { className: 'terminal-content' }, [
                    createElement('span', {
                        style: {
                            color: 'var(--text-dim)',
                            fontSize: 'calc(9px * var(--scale-factor))',
                            lineHeight: 'var(--mobile-line-height)'
                        }
                    }, ['# MOOSH Spark Protocol Wallet']),
                    createElement('br'),
                    createElement('span', {
                        className: 'text-keyword',
                        style: {
                            fontSize: 'calc(9px * var(--scale-factor))',
                            lineHeight: 'var(--mobile-line-height)'
                        }
                    }, ['import']),
                    ' ',
                    createElement('span', {
                        className: 'text-primary',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['{']),
                    ' ',
                    createElement('span', {
                        className: 'text-variable',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['SparkWallet']),
                    ' ',
                    createElement('span', {
                        className: 'text-primary',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['}']),
                    ' ',
                    createElement('span', {
                        className: 'text-keyword',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['from']),
                    ' ',
                    createElement('span', {
                        className: 'text-keyword',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['"@buildonspark/spark-sdk"']),
                    createElement('span', {
                        className: 'text-primary',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, [';']),
                    createElement('br'),
                    createElement('span', {
                        className: 'text-keyword',
                        style: {
                            fontSize: 'calc(9px * var(--scale-factor))',
                            lineHeight: 'var(--mobile-line-height)'
                        }
                    }, ['const']),
                    ' ',
                    createElement('span', {
                        className: 'text-variable',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['wallet']),
                    ' ',
                    createElement('span', {
                        className: 'text-primary',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['=']),
                    ' ',
                    createElement('span', {
                        className: 'text-keyword',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['await']),
                    ' ',
                    createElement('span', {
                        className: 'text-variable',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['SparkWallet']),
                    createElement('span', {
                        className: 'text-primary',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['.']),
                    createElement('span', {
                        className: 'text-variable',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['initialize']),
                    createElement('span', {
                        className: 'text-primary',
                        style: { fontSize: 'calc(9px * var(--scale-factor))' }
                    }, ['();']),
                    createElement('br'),
                    createElement('span', {
                        style: {
                            color: 'var(--text-dim)',
                            fontSize: 'calc(9px * var(--scale-factor))',
                            lineHeight: 'var(--mobile-line-height)'
                        }
                    }, ['# Real sp1... addresses + Bitcoin Layer 2']),
                    createElement('br'),
                    createElement('span', {
                        style: {
                            color: 'var(--text-keyword)',
                            fontSize: 'calc(9px * var(--scale-factor))',
                            lineHeight: 'var(--mobile-line-height)'
                        }
                    }, ['# Development Server: Bitcoin Blockchain'])
                ])
            ]);
        }

        // BUILD PASSWORD SECTION
        function buildPasswordSection() {
            return createElement('div', {
                className: 'password-security-section',
                style: {
                    background: 'rgba(245, 115, 21, 0.1)',
                    border: '1px solid var(--text-primary)',
                    borderRadius: '0',
                    padding: 'calc(20px * var(--scale-factor))',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                createElement('div', {
                    className: 'password-security-title',
                    style: {
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        marginBottom: 'calc(12px * var(--scale-factor))',
                        fontSize: 'calc(16px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, ['Moosh Wallet Security']),
                
                createElement('div', {
                    className: 'typing-text',
                    style: {
                        marginBottom: 'calc(20px * var(--scale-factor))',
                        textAlign: 'center',
                        lineHeight: '1.4'
                    }
                }, [
                    createElement('span', { className: 'text-dim' }, ['<']),
                    createElement('span', { className: 'password-text-hover' }, ['Create a secure password to protect your wallet access']),
                    createElement('span', { className: 'text-dim' }, [' />']),
                    createElement('span', { className: 'typing-cursor' })
                ]),
                
                // Create Password Field
                createElement('div', {
                    style: { marginBottom: 'calc(16px * var(--scale-factor))' }
                }, [
                    createElement('label', {
                        className: 'text-dim',
                        style: {
                            display: 'block',
                            marginBottom: 'calc(8px * var(--scale-factor))',
                            fontWeight: '500'
                        }
                    }, ['Create Password']),
                    createElement('div', {
                        style: {
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center'
                        }
                    }, [
                        createElement('input', {
                            id: 'createPasswordInput',
                            className: 'input-field',
                            type: 'password',
                            placeholder: 'Enter secure password...',
                            style: {
                                width: '100%',
                                paddingRight: 'calc(40px * var(--scale-factor))'
                            }
                        }),
                        createElement('button', {
                            id: 'toggleCreatePassword',
                            type: 'button',
                            onclick: () => togglePasswordVisibility('createPasswordInput', 'toggleCreatePassword'),
                            style: {
                                position: 'absolute',
                                right: 'calc(12px * var(--scale-factor))',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-dim)',
                                cursor: 'pointer',
                                padding: 'calc(4px * var(--scale-factor))',
                                transition: 'color 0.2s ease',
                                width: 'calc(20px * var(--scale-factor))',
                                height: 'calc(20px * var(--scale-factor))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            onmouseover: function() { this.style.color = 'var(--text-primary)'; },
                            onmouseout: function() { this.style.color = 'var(--text-dim)'; },
                            title: 'Show password'
                        }, [
                            createSvgElement('svg', {
                                width: '16',
                                height: '16',
                                viewBox: '0 0 24 24',
                                fill: 'none',
                                stroke: 'currentColor',
                                strokeWidth: '2',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round'
                            }, [
                                createSvgElement('path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }),
                                createSvgElement('circle', { cx: '12', cy: '12', r: '3' })
                            ])
                        ])
                    ])
                ]),
                
                // Confirm Password Field
                createElement('div', {
                    style: { marginBottom: 'calc(16px * var(--scale-factor))' }
                }, [
                    createElement('label', {
                        className: 'text-dim',
                        style: {
                            display: 'block',
                            marginBottom: 'calc(8px * var(--scale-factor))',
                            fontWeight: '500'
                        }
                    }, ['Re-enter Password']),
                    createElement('div', {
                        style: {
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center'
                        }
                    }, [
                        createElement('input', {
                            id: 'confirmPasswordInput',
                            className: 'input-field',
                            type: 'password',
                            placeholder: 'Confirm password...',
                            style: {
                                width: '100%',
                                paddingRight: 'calc(40px * var(--scale-factor))'
                            }
                        }),
                        createElement('button', {
                            id: 'toggleConfirmPassword',
                            type: 'button',
                            onclick: () => togglePasswordVisibility('confirmPasswordInput', 'toggleConfirmPassword'),
                            style: {
                                position: 'absolute',
                                right: 'calc(12px * var(--scale-factor))',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-dim)',
                                cursor: 'pointer',
                                padding: 'calc(4px * var(--scale-factor))',
                                transition: 'color 0.2s ease',
                                width: 'calc(20px * var(--scale-factor))',
                                height: 'calc(20px * var(--scale-factor))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            onmouseover: function() { this.style.color = 'var(--text-primary)'; },
                            onmouseout: function() { this.style.color = 'var(--text-dim)'; },
                            title: 'Show password'
                        }, [
                            createSvgElement('svg', {
                                width: '16',
                                height: '16',
                                viewBox: '0 0 24 24',
                                fill: 'none',
                                stroke: 'currentColor',
                                strokeWidth: '2',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round'
                            }, [
                                createSvgElement('path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }),
                                createSvgElement('circle', { cx: '12', cy: '12', r: '3' })
                            ])
                        ])
                    ])
                ]),
                
                // Error/Success Messages
                createElement('div', {
                    id: 'passwordError',
                    style: {
                        color: '#ff4444',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        marginTop: 'calc(6px * var(--scale-factor))',
                        display: 'none'
                    }
                }),
                createElement('div', {
                    id: 'passwordSuccess',
                    style: {
                        color: 'var(--text-keyword)',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        marginTop: 'calc(6px * var(--scale-factor))',
                        display: 'none'
                    }
                }, ['Passwords match!'])
            ]);
        }

        // BUILD FOOTER
        function buildFooter() {
            return createElement('footer', {
                style: {
                    textAlign: 'center',
                    padding: 'calc(20px * var(--scale-factor)) 0',
                    marginTop: 'calc(20px * var(--scale-factor))',
                    borderTop: '1px solid var(--border-color)',
                    position: 'relative'
                }
            }, [
                createElement('div', {
                    style: {
                        color: 'var(--text-primary)',
                        fontSize: 'calc(11px * var(--scale-factor))',
                        fontWeight: '500',
                        letterSpacing: '0.05em',
                        fontFamily: "'JetBrains Mono', monospace"
                    }
                }, ['© 2025 MOOSH Wallet Limited. All rights reserved.']),
                createElement('div', {
                    style: {
                        color: 'var(--text-dim)',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        marginTop: 'calc(4px * var(--scale-factor))',
                        fontFamily: "'JetBrains Mono', monospace"
                    }
                }, ["World's First AI-Powered Bitcoin Wallet"])
            ]);
        }

        // SVG HELPER
        function createSvgElement(tag, attributes = {}, children = []) {
            const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
            
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'strokeWidth') {
                    element.setAttribute('stroke-width', value);
                } else if (key === 'strokeLinecap') {
                    element.setAttribute('stroke-linecap', value);
                } else if (key === 'strokeLinejoin') {
                    element.setAttribute('stroke-linejoin', value);
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            children.forEach(child => {
                element.appendChild(child);
            });
            
            return element;
        }

        // WALLET FUNCTIONS
        function toggleNetwork() {
            const toggle = document.getElementById('networkToggle');
            const label = document.getElementById('networkLabel');
            const slider = toggle.querySelector('.toggle-slider');
            
            isMainnet = !isMainnet;
            
            if (isMainnet) {
                toggle.classList.remove('testnet');
                label.textContent = 'MAINNET';
                slider.textContent = '+';
                console.log('🌐 Switched to Bitcoin MAINNET');
            } else {
                toggle.classList.add('testnet');
                label.textContent = 'TESTNET';
                slider.textContent = '−';
                console.log('🧪 Switched to Bitcoin TESTNET');
            }
            
            updateWalletNetwork(isMainnet ? 'mainnet' : 'testnet');
        }
        
        function updateWalletNetwork(network) {
            console.log(\`🔧 Wallet configured for \${network.toUpperCase()}\`);
            showNotification(\`Network: \${network.toUpperCase()}\`, 'network');
        }
        
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            const isMobile = window.innerWidth <= 768;
            const container = document.querySelector('.cursor-content');
            
            notification.style.cssText = \`
                position: fixed;
                top: calc(var(--spacing-unit) * 12 * var(--scale-factor));
                right: calc(var(--spacing-unit) * 4 * var(--scale-factor));
                background: #000000;
                color: #f57315;
                border: calc(2px * var(--scale-factor)) solid #f57315;
                border-radius: 0;
                padding: calc(var(--spacing-unit) * 1.5 * var(--scale-factor)) calc(var(--spacing-unit) * 2 * var(--scale-factor));
                font-family: 'JetBrains Mono', monospace;
                font-size: calc(11px * var(--scale-factor));
                font-weight: 500;
                z-index: 1000;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                min-width: calc(160px * var(--scale-factor));
                max-width: calc(320px * var(--scale-factor));
                text-align: center;
                box-shadow: 0 calc(6px * var(--scale-factor)) calc(16px * var(--scale-factor)) rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(10px);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.4;
                opacity: 0;
                transform: translateX(calc(20px * var(--scale-factor))) translateY(calc(-10px * var(--scale-factor)));
            \`;
            
            if (isMobile) {
                notification.style.cssText += \`
                    position: fixed;
                    top: calc(var(--spacing-unit) * 8 * var(--scale-factor));
                    left: 50%;
                    right: auto;
                    transform: translateX(-50%) translateY(calc(-10px * var(--scale-factor)));
                    max-width: calc(90vw);
                    min-width: calc(200px * var(--scale-factor));
                \`;
            }
            
            const isCurrentlyMooshTheme = document.body.classList.contains('theme-spark');
            const primaryColor = isCurrentlyMooshTheme ? '#69fd97bd' : '#f57315';
            
            if (type === 'moosh') {
                notification.style.borderColor = '#69fd97bd';
                notification.style.color = '#69fd97bd';
            } else if (type === 'original') {
                notification.style.borderColor = '#f57315';
                notification.style.color = '#f57315';
            } else if (type === 'network') {
                notification.style.borderColor = primaryColor;
                notification.style.color = primaryColor;
            } else if (type === 'success') {
                notification.style.borderColor = primaryColor;
                notification.style.color = primaryColor;
            } else if (type === 'error') {
                notification.style.borderColor = primaryColor;
                notification.style.color = primaryColor;
            }
            
            notification.textContent = message;
            
            if (container) {
                container.appendChild(notification);
            } else {
                document.body.appendChild(notification);
            }
            
            requestAnimationFrame(() => {
                if (isMobile) {
                    notification.style.transform = 'translateX(-50%) translateY(0)';
                } else {
                    notification.style.transform = 'translateX(0) translateY(0)';
                }
                notification.style.opacity = '1';
            });
            
            setTimeout(() => {
                notification.style.opacity = '0';
                if (isMobile) {
                    notification.style.transform = 'translateX(-50%) translateY(calc(-10px * var(--scale-factor)))';
                } else {
                    notification.style.transform = 'translateX(calc(20px * var(--scale-factor))) translateY(calc(-10px * var(--scale-factor)))';
                }
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 2500);
        }

        function openTokenSite() {
            showNotification('Opening MOOSH.money...', 'success');
            setTimeout(() => {
                window.open('https://www.moosh.money/', '_blank');
            }, 500);
        }
        
        function selectMnemonic(words) {
            selectedMnemonic = words;
            
            const radio12 = document.getElementById('radio12');
            const radio24 = document.getElementById('radio24');
            const inner12 = radio12.querySelector('.radio-inner');
            const inner24 = radio24.querySelector('.radio-inner');
            
            if (words === 12) {
                inner12.style.background = 'var(--text-primary)';
                inner12.style.transform = 'scale(1)';
                radio12.style.background = '#000000';
                radio12.style.borderColor = '#333333';
                radio12.style.borderWidth = '1px';
                inner24.style.background = 'transparent';
                inner24.style.transform = 'scale(0.8)';
                radio24.style.background = '#000000';
                radio24.style.borderColor = '#333333';
                radio24.style.borderWidth = '1px';
            } else {
                inner24.style.background = 'var(--text-primary)';
                inner24.style.transform = 'scale(1)';
                radio24.style.background = '#000000';
                radio24.style.borderColor = '#333333';
                radio24.style.borderWidth = '1px';
                inner12.style.background = 'transparent';
                inner12.style.transform = 'scale(0.8)';
                radio12.style.background = '#000000';
                radio12.style.borderColor = '#333333';
                radio12.style.borderWidth = '1px';
            }
            
            showNotification(selectedMnemonic + ' Word Mnemonic selected', 'success');
            console.log('🔧 Mnemonic length:', selectedMnemonic, 'words');
        }
        
        function toggleTheme() {
            const body = document.body;
            const themeButton = document.getElementById('themeToggle');
            const themeIcon = document.getElementById('themeIcon');
            
            isSparkTheme = !isSparkTheme;
            
            if (isSparkTheme) {
                body.classList.add('theme-spark');
                showNotification('MOOSH Mode ON', 'moosh');
                console.log('🚀 Switched to MOOSH Mode (@buildonspark/spark-sdk)');
            } else {
                body.classList.remove('theme-spark');
                showNotification('Original Mode ON', 'original');
                console.log('🎨 Switched to Original Mode');
            }
            
            localStorage.setItem('mooshTheme', isSparkTheme ? 'moosh' : 'original');
        }
        
        function loadThemePreference() {
            const savedTheme = localStorage.getItem('mooshTheme');
            const themeIcon = document.getElementById('themeIcon');
            if (savedTheme === 'moosh') {
                isSparkTheme = true;
                document.body.classList.add('theme-spark');
            }
        }
        
        function togglePasswordVisibility(inputId, buttonId) {
            const input = document.getElementById(inputId);
            const button = document.getElementById(buttonId);
            
            if (input.type === 'password') {
                input.type = 'text';
                button.innerHTML = \`
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                \`;
            } else {
                input.type = 'password';
                button.innerHTML = \`
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                \`;
            }
        }
        
        function createWallet() {
            const password = document.getElementById('createPasswordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            
            if (!password || !confirmPassword) {
                showNotification('Please enter and confirm password', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                document.getElementById('passwordError').style.display = 'block';
                document.getElementById('passwordError').textContent = 'Passwords do not match!';
                document.getElementById('passwordSuccess').style.display = 'none';
                return;
            }
            
            document.getElementById('passwordError').style.display = 'none';
            document.getElementById('passwordSuccess').style.display = 'block';
            
            showNotification('Creating wallet...', 'success');
            setTimeout(() => {
                showNotification('Wallet created successfully!', 'success');
            }, 1000);
        }
        
        function importWallet() {
            showNotification('Import wallet feature coming soon!', 'info');
        }

        // INITIALIZE APP
        function initializeApp() {
            // Build the main container
            const container = createElement('div', { className: 'cursor-container' }, [
                buildHeader(),
                createElement('div', { className: 'cursor-content' }, [
                    buildHomePage()
                ]),
                buildFooter()
            ]);
            
            // Add to body
            document.body.appendChild(container);
            
            // Load theme preference
            loadThemePreference();
        }

        // Start the app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            initializeApp();
        }
    </script>
</body>
</html>`);
});

server.listen(8080, () => {
  console.log("🚀 MOOSH Wallet Server running on http://localhost:8080");
});
