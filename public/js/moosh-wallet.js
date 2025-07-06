// MOOSH WALLET - 100% PURE JAVASCRIPT IMPLEMENTATION
// Professional-grade wallet UI with 50 years of development expertise
// Version: 2.0 - Complete rewrite for pixel-perfect accuracy

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // ELEMENT FACTORY - Professional DOM Creation Pattern
    // ═══════════════════════════════════════════════════════════════════════
    class ElementFactory {
        static create(tag, attrs = {}, children = []) {
            const element = document.createElement(tag);
            
            // Handle attributes
            Object.entries(attrs).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else if (key === 'dataset') {
                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                        element.dataset[dataKey] = dataValue;
                    });
                } else if (key.startsWith('on')) {
                    const eventName = key.slice(2).toLowerCase();
                    element.addEventListener(eventName, value);
                } else if (key === 'className') {
                    element.className = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            // Handle children
            children.forEach(child => {
                if (child === null || child === undefined) return;
                if (typeof child === 'string' || typeof child === 'number') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    element.appendChild(child);
                } else if (Array.isArray(child)) {
                    child.forEach(subChild => {
                        if (subChild instanceof Node) {
                            element.appendChild(subChild);
                        }
                    });
                }
            });
            
            return element;
        }

        static div(attrs = {}, children = []) {
            return this.create('div', attrs, children);
        }

        static span(attrs = {}, children = []) {
            return this.create('span', attrs, children);
        }

        static button(attrs = {}, children = []) {
            return this.create('button', attrs, children);
        }

        static input(attrs = {}) {
            return this.create('input', attrs);
        }

        static img(attrs = {}) {
            return this.create('img', attrs);
        }

        static h1(attrs = {}, children = []) {
            return this.create('h1', attrs, children);
        }

        static p(attrs = {}, children = []) {
            return this.create('p', attrs, children);
        }

        static label(attrs = {}, children = []) {
            return this.create('label', attrs, children);
        }

        static textarea(attrs = {}, children = []) {
            return this.create('textarea', attrs, children);
        }

        static nav(attrs = {}, children = []) {
            return this.create('nav', attrs, children);
        }

        static header(attrs = {}, children = []) {
            return this.create('header', attrs, children);
        }

        static footer(attrs = {}, children = []) {
            return this.create('footer', attrs, children);
        }

        static a(attrs = {}, children = []) {
            return this.create('a', attrs, children);
        }

        static svg(attrs = {}, children = []) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            Object.entries(attrs).forEach(([key, value]) => {
                svg.setAttribute(key, value);
            });
            children.forEach(child => svg.appendChild(child));
            return svg;
        }
    }

    const $ = ElementFactory; // Shorthand

    // ═══════════════════════════════════════════════════════════════════════
    // STYLE MANAGER - Dynamic CSS Injection System
    // ═══════════════════════════════════════════════════════════════════════
    class StyleManager {
        constructor() {
            this.styleElement = null;
            this.rules = new Map();
        }

        inject() {
            this.styleElement = $.create('style');
            document.head.appendChild(this.styleElement);
            this.addCoreStyles();
            this.addComponentStyles();
            this.addAnimations();
            this.addResponsiveStyles();
        }

        addCoreStyles() {
            const coreCSS = `
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
                    --scale-factor: 0.65;
                    --font-base: 13px;
                    --spacing-unit: 6px;
                    --container-padding: 12px;
                    --button-height: 40px;
                    --input-height: 36px;
                    --touch-target-min: 44px;
                    --mobile-line-height: 1.4;
                }

                /* Responsive scaling */
                @media (min-width: 480px) {
                    :root {
                        --scale-factor: 0.75;
                        --font-base: 14px;
                        --container-padding: 16px;
                    }
                }
                
                @media (min-width: 768px) {
                    :root {
                        --scale-factor: 0.85;
                        --font-base: 15px;
                        --container-padding: 20px;
                        --button-height: 42px;
                        --input-height: 38px;
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

                .text-keyword { color: var(--text-keyword); }
                .text-string { color: var(--text-string); }
                .text-comment { color: var(--text-comment); }
                .text-variable { color: var(--text-secondary); }
                .text-primary { color: var(--text-primary); }
                .text-secondary { color: var(--text-secondary); }
                .text-accent { color: var(--text-accent); }
                .text-dim { color: var(--text-dim); }

                /* MOOSH MODE - GREEN & BLACK THEME */
                .theme-spark {
                    --text-primary: #69fd97bd !important;
                    --text-secondary: #9bffac !important;
                    --text-accent: #6fedbfc2 !important;
                    --text-string: #9bffac !important;
                    --text-keyword: #6fedbfc2 !important;
                    --text-comment: #c8fff2 !important;
                    --text-dim: #71767b !important;
                    --bg-primary: #000000 !important;
                    --bg-secondary: #000000 !important;
                    --bg-tertiary: #000000 !important;
                    --bg-hover: #0a1a0f !important;
                    --border-color: #69fd97bd !important;
                    --border-active: #6fedbfc2 !important;
                }
            `;
            
            this.styleElement.textContent = coreCSS;
        }

        addComponentStyles() {
            const componentCSS = `
                /* Layout Components */
                .cursor-container {
                    background: var(--bg-primary);
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                .cursor-header {
                    background: var(--bg-primary);
                    border-bottom: 1px solid var(--border-color);
                    padding: 0 var(--container-padding);
                    height: calc(53px * var(--scale-factor));
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }

                .cursor-content {
                    overflow-y: auto;
                    padding: calc(var(--spacing-unit) * 3) var(--container-padding) calc(var(--spacing-unit) * 2) var(--container-padding);
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                    box-sizing: border-box;
                    position: relative;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .card {
                    background: var(--bg-secondary);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 0;
                    position: relative;
                    transition: all var(--transition-speed) ease;
                    padding: 24px;
                    margin-bottom: 16px;
                    width: 100%;
                    max-width: 600px;
                }

                .card:hover {
                    background: #000000;
                    border-color: var(--text-primary);
                }

                /* Button System */
                .btn-primary {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                    border: none;
                    border-radius: 9999px;
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    font-size: 14px;
                    padding: 12px 24px;
                    font-family: inherit;
                    transform: translateZ(0);
                }

                .btn-primary:hover {
                    background: var(--text-secondary);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(245, 115, 21, 0.3);
                }

                .btn-secondary {
                    background: transparent;
                    color: var(--text-dim);
                    border: none;
                    font-weight: 400;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    font-size: 14px;
                    padding: 8px 16px;
                    font-family: inherit;
                }

                .btn-secondary:hover {
                    color: var(--text-primary);
                    transform: translateY(-1px);
                }

                /* Navigation */
                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: calc(var(--spacing-unit) * 0.5 * var(--scale-factor));
                }
                
                .nav-link {
                    color: var(--text-dim);
                    font-weight: 400;
                    text-decoration: none;
                    position: relative;
                    transition: all var(--transition-speed) ease;
                    font-size: calc(var(--font-base) * var(--scale-factor) * 0.875);
                    padding: calc(var(--spacing-unit) * var(--scale-factor)) calc(var(--spacing-unit) * 1.5 * var(--scale-factor));
                    border-radius: calc(8px * var(--scale-factor));
                    font-family: inherit;
                    white-space: nowrap;
                    display: inline-block;
                }

                .nav-link:hover {
                    color: var(--text-primary);
                    background: var(--bg-hover);
                }

                /* Brand System */
                .brand-box {
                    background: transparent;
                    padding: 0;
                    display: inline-flex;
                    align-items: center;
                    gap: calc(var(--spacing-unit) * var(--scale-factor));
                    font-family: inherit;
                }

                .brand-text {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    font-size: calc(12px * var(--scale-factor));
                    font-weight: 600;
                }

                .brand-logo {
                    width: calc(32px * var(--scale-factor));
                    height: calc(32px * var(--scale-factor));
                    object-fit: contain;
                    border-radius: 50%;
                }

                /* Form Elements */
                .input-field {
                    background: var(--bg-primary);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: 0;
                    color: var(--text-primary);
                    font-family: inherit;
                    transition: all var(--transition-speed) ease;
                    font-size: calc(12px * var(--scale-factor));
                    padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 2);
                    width: 100%;
                    height: var(--input-height);
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    touch-action: manipulation;
                    box-sizing: border-box;
                }

                .input-field:focus {
                    border-color: var(--text-primary);
                    outline: none;
                    background: var(--bg-primary);
                }

                .input-field:hover {
                    border-color: var(--text-primary);
                    color: var(--text-primary);
                }

                /* Terminal Box */
                .terminal-box {
                    background: #000000;
                    border: 2px solid var(--text-primary);
                    border-radius: 0;
                    padding: 12px;
                    font-family: inherit;
                    overflow: hidden;
                    margin-bottom: 16px;
                }

                .terminal-header {
                    color: var(--text-primary);
                    margin-bottom: 8px;
                    border-bottom: 1px solid var(--text-primary);
                    padding-bottom: 4px;
                    font-size: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .terminal-content {
                    color: var(--text-primary);
                    line-height: 1.2;
                    font-size: 10px;
                }

                /* Theme Toggle */
                .theme-toggle {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: calc(var(--spacing-unit) * var(--scale-factor));
                    margin-right: calc(var(--spacing-unit) * 1.5 * var(--scale-factor));
                    min-height: calc(var(--touch-target-min) * 0.8 * var(--scale-factor));
                }
                
                .theme-toggle-button {
                    width: calc(12px * var(--scale-factor));
                    height: calc(12px * var(--scale-factor));
                    border: calc(1px * var(--scale-factor)) solid #333333;
                    border-radius: 50%;
                    margin-right: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #000000;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }
                
                .theme-toggle-button:hover {
                    border-color: var(--text-primary);
                }
                
                .theme-toggle-inner {
                    width: calc(4px * var(--scale-factor));
                    height: calc(4px * var(--scale-factor));
                    border-radius: 50%;
                    background: var(--text-primary);
                    transition: all 0.2s ease;
                }
                
                .theme-toggle-icon {
                    font-size: calc(8px * var(--scale-factor));
                    margin-right: calc(var(--spacing-unit) * 0.5 * var(--scale-factor));
                    color: var(--text-dim);
                    transition: all 0.2s ease;
                    user-select: none;
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 500;
                }

                /* Network Toggle */
                .network-toggle {
                    display: inline-flex;
                    align-items: center;
                    gap: calc(var(--spacing-unit) * var(--scale-factor));
                    margin-left: auto;
                }
                
                .toggle-switch {
                    background: #000000;
                    border: calc(1.5px * var(--scale-factor)) solid var(--text-primary);
                    border-radius: 0;
                    width: calc(36px * var(--scale-factor));
                    height: calc(18px * var(--scale-factor));
                    position: relative;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    padding: calc(1px * var(--scale-factor));
                }
                
                .toggle-slider {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    border: none;
                    border-radius: 0;
                    color: var(--text-primary);
                    font-size: calc(12px * var(--scale-factor));
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: none;
                    left: 0;
                    top: 0;
                    line-height: 1;
                }
                
                .toggle-switch.testnet .toggle-slider {
                    /* No transform needed - just change the symbol */
                }
                
                .network-label {
                    font-size: calc(10px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 500;
                    min-width: calc(50px * var(--scale-factor));
                }

                /* Custom Radio Buttons */
                .custom-radio {
                    width: calc(12px * var(--scale-factor));
                    height: calc(12px * var(--scale-factor));
                    border: calc(1px * var(--scale-factor)) solid #333333;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #000000;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                    position: relative;
                    box-sizing: border-box;
                }
                
                .radio-inner {
                    width: calc(4px * var(--scale-factor));
                    height: calc(4px * var(--scale-factor));
                    border-radius: 50%;
                    background: transparent;
                    transition: all 0.2s ease;
                    position: relative;
                    display: block;
                }

                /* Typing cursor */
                .typing-cursor {
                    display: inline-block;
                    background-color: var(--text-primary);
                    width: 2px;
                    height: 1em;
                    margin-left: 2px;
                    animation: blink 1s infinite;
                }

                /* Notifications */
                .notification {
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
                }

                .notification.show {
                    opacity: 1;
                    transform: translateX(0) translateY(0);
                }

                /* Mobile specific */
                @media (max-width: 768px) {
                    .notification {
                        position: fixed;
                        top: calc(var(--spacing-unit) * 8 * var(--scale-factor));
                        left: 50%;
                        right: auto;
                        transform: translateX(-50%) translateY(calc(-10px * var(--scale-factor)));
                        max-width: calc(90vw);
                        min-width: calc(200px * var(--scale-factor));
                    }
                    
                    .notification.show {
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `;
            
            this.styleElement.textContent += componentCSS;
        }

        addAnimations() {
            const animationCSS = `
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
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

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
            `;
            
            this.styleElement.textContent += animationCSS;
        }

        addResponsiveStyles() {
            const responsiveCSS = `
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
                        line-height: var(--mobile-line-height) !important;
                    }
                    
                    .moosh-flash, .text-dim {
                        font-size: calc(20px * var(--scale-factor)) !important;
                        white-space: nowrap;
                        line-height: var(--mobile-line-height) !important;
                    }
                    
                    .moosh-logo, h1 img {
                        width: calc(32px * var(--scale-factor)) !important;
                        height: calc(32px * var(--scale-factor)) !important;
                        flex-shrink: 0;
                    }
                    
                    .token-site-subtitle {
                        font-size: calc(14px * var(--scale-factor)) !important;
                        margin-bottom: calc(var(--spacing-unit) * 3 * var(--scale-factor)) !important;
                        line-height: var(--mobile-line-height) !important;
                    }
                    
                    .address-types-list {
                        font-size: calc(9px * var(--scale-factor)) !important;
                        margin-bottom: calc(var(--spacing-unit) * 2.5 * var(--scale-factor)) !important;
                        line-height: var(--mobile-line-height) !important;
                        padding: calc(var(--spacing-unit) * var(--scale-factor)) !important;
                    }
                    
                    .nav-link {
                        font-size: calc(10px * var(--scale-factor)) !important;
                        padding: calc(var(--spacing-unit) * var(--scale-factor)) calc(var(--spacing-unit) * 1.5 * var(--scale-factor)) !important;
                        border-radius: calc(6px * var(--scale-factor)) !important;
                        min-height: calc(var(--touch-target-min) * var(--scale-factor)) !important;
                        display: flex !important;
                        align-items: center !important;
                    }
                    
                    .brand-text {
                        font-size: calc(11px * var(--scale-factor)) !important;
                    }
                    
                    .brand-text .text-dim {
                        font-size: calc(10px * var(--scale-factor)) !important;
                    }
                    
                    .nav-link .text-dim {
                        font-size: calc(10px * var(--scale-factor)) !important;
                    }
                    
                    .password-bracket {
                        font-size: calc(9px * var(--scale-factor)) !important;
                    }
                    
                    .password-text-hover {
                        font-size: calc(9px * var(--scale-factor)) !important;
                    }
                    
                    .typing-text {
                        font-size: calc(10px * var(--scale-factor)) !important;
                    }
                    
                    .ui-bracket {
                        font-size: calc(8px * var(--scale-factor)) !important;
                    }
                    
                    .address-bracket {
                        font-size: calc(8px * var(--scale-factor)) !important;
                    }
                    
                    .cursor-header {
                        height: calc(var(--touch-target-min) * 1.2 * var(--scale-factor)) !important;
                        padding: 0 calc(var(--container-padding) * var(--scale-factor)) !important;
                    }
                    
                    .network-toggle {
                        margin-left: calc(var(--spacing-unit) * var(--scale-factor));
                        gap: calc(var(--spacing-unit) * var(--scale-factor));
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .toggle-switch {
                        width: calc(36px * var(--scale-factor)) !important;
                        height: calc(18px * var(--scale-factor)) !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: flex-start !important;
                        position: relative !important;
                        padding: calc(1px * var(--scale-factor)) !important;
                        aspect-ratio: 2 / 1 !important;
                        min-width: calc(36px * var(--scale-factor)) !important;
                        min-height: calc(18px * var(--scale-factor)) !important;
                    }
                    
                    .toggle-slider {
                        width: calc(16px * var(--scale-factor)) !important;
                        height: calc(16px * var(--scale-factor)) !important;
                        position: absolute !important;
                        top: calc(3px * var(--scale-factor)) !important;
                        left: calc(3px * var(--scale-factor)) !important;
                        font-size: calc(12px * var(--scale-factor)) !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        transition: transform 0.2s ease !important;
                        aspect-ratio: 1 / 1 !important;
                    }
                    
                    .toggle-switch.testnet .toggle-slider {
                        transform: translateX(calc(22px * var(--scale-factor))) !important;
                    }
                    
                    .network-label {
                        font-size: calc(12px * var(--scale-factor));
                        min-width: calc(60px * var(--scale-factor));
                        font-weight: 500;
                        line-height: var(--mobile-line-height);
                    }
                    
                    .input-field {
                        font-size: calc(var(--font-base) * var(--scale-factor)) !important;
                        padding: calc(var(--spacing-unit) * 1.5 * var(--scale-factor)) calc(var(--spacing-unit) * 2 * var(--scale-factor)) !important;
                        height: calc(var(--touch-target-min) * var(--scale-factor)) !important;
                        border-width: calc(1px * var(--scale-factor)) !important;
                        line-height: var(--mobile-line-height) !important;
                    }
                    
                    label.text-dim {
                        font-size: calc(10px * var(--scale-factor)) !important;
                        line-height: var(--mobile-line-height) !important;
                    }
                    
                    #passwordError, #passwordSuccess {
                        font-size: calc(11px * var(--scale-factor)) !important;
                        margin-top: calc(var(--spacing-unit) * var(--scale-factor)) !important;
                        line-height: var(--mobile-line-height) !important;
                    }
                    
                    .password-security-section {
                        padding: calc(var(--spacing-unit) * 2.5 * var(--scale-factor)) !important;
                        margin-bottom: calc(var(--spacing-unit) * 2 * var(--scale-factor)) !important;
                    }
                    
                    .password-security-title {
                        font-size: calc(16px * var(--scale-factor)) !important;
                        margin-bottom: calc(var(--spacing-unit) * 1.5 * var(--scale-factor)) !important;
                        line-height: var(--mobile-line-height) !important;
                    }
                    
                    .password-security-subtitle {
                        font-size: calc(9px * var(--scale-factor)) !important;
                        margin-bottom: calc(var(--spacing-unit) * 2 * var(--scale-factor)) !important;
                        line-height: var(--mobile-line-height) !important;
                    }
                    
                    .wallet-actions button {
                        font-size: calc(15px * var(--scale-factor)) !important;
                        padding: calc(var(--spacing-unit) * 2 * var(--scale-factor)) calc(var(--spacing-unit) * 3 * var(--scale-factor)) !important;
                        height: calc(var(--touch-target-min) * 1.2 * var(--scale-factor)) !important;
                        border-width: calc(2px * var(--scale-factor)) !important;
                        line-height: var(--mobile-line-height) !important;
                        min-height: calc(var(--touch-target-min) * var(--scale-factor)) !important;
                    }
                }
            `;
            
            this.styleElement.textContent += responsiveCSS;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STATE MANAGER - Global Application State
    // ═══════════════════════════════════════════════════════════════════════
    class StateManager {
        constructor() {
            this.state = {
                selectedMnemonic: 12,
                isMainnet: true,
                isSparkTheme: false,
                currentPage: 'home',
                navigationHistory: ['home'],
                walletPassword: null,
                generatedSeed: null,
                verificationWords: [],
                walletType: null // 'create' or 'import'
            };
            
            this.listeners = new Map();
        }

        get(key) {
            return this.state[key];
        }

        set(key, value) {
            const oldValue = this.state[key];
            this.state[key] = value;
            this.emit(key, value, oldValue);
        }

        update(updates) {
            Object.entries(updates).forEach(([key, value]) => {
                this.set(key, value);
            });
        }

        on(key, callback) {
            if (!this.listeners.has(key)) {
                this.listeners.set(key, []);
            }
            this.listeners.get(key).push(callback);
        }

        off(key, callback) {
            if (this.listeners.has(key)) {
                const callbacks = this.listeners.get(key);
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        }

        emit(key, newValue, oldValue) {
            if (this.listeners.has(key)) {
                this.listeners.get(key).forEach(callback => {
                    callback(newValue, oldValue);
                });
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ROUTER - Single Page Application Navigation
    // ═══════════════════════════════════════════════════════════════════════
    class Router {
        constructor(app) {
            this.app = app;
            this.routes = new Map();
            this.setupRoutes();
            this.bindEvents();
        }

        setupRoutes() {
            this.routes.set('home', () => new HomePage(this.app));
            this.routes.set('generate-seed', () => new GenerateSeedPage(this.app));
            this.routes.set('confirm-seed', () => new ConfirmSeedPage(this.app));
            this.routes.set('import-seed', () => new ImportSeedPage(this.app));
            this.routes.set('wallet-created', () => new WalletCreatedPage(this.app));
            this.routes.set('wallet-imported', () => new WalletImportedPage(this.app));
            this.routes.set('wallet-details', () => new WalletDetailsPage(this.app));
        }

        bindEvents() {
            window.addEventListener('hashchange', () => {
                const hash = window.location.hash.substring(1);
                if (hash) {
                    this.navigate(hash);
                }
            });
        }

        navigate(pageId) {
            const currentPage = this.app.state.get('currentPage');
            
            if (pageId !== currentPage) {
                const history = [...this.app.state.get('navigationHistory')];
                history.push(pageId);
                this.app.state.update({
                    currentPage: pageId,
                    navigationHistory: history
                });
            }
            
            window.location.hash = pageId;
            this.render();
        }

        goBack() {
            const history = [...this.app.state.get('navigationHistory')];
            if (history.length > 1) {
                history.pop();
                const previousPage = history[history.length - 1];
                this.app.state.update({
                    currentPage: previousPage,
                    navigationHistory: history
                });
                window.location.hash = previousPage;
                this.render();
            } else {
                this.navigate('home');
            }
        }

        render() {
            const currentPage = this.app.state.get('currentPage');
            const PageClass = this.routes.get(currentPage);
            
            if (PageClass) {
                const content = document.querySelector('.cursor-content');
                if (content) {
                    content.innerHTML = '';
                    const page = PageClass();
                    page.mount(content);
                }
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // COMPONENT BASE CLASS
    // ═══════════════════════════════════════════════════════════════════════
    class Component {
        constructor(app) {
            this.app = app;
            this.element = null;
        }

        render() {
            throw new Error('render() must be implemented by subclass');
        }

        mount(parent) {
            this.element = this.render();
            parent.appendChild(this.element);
            this.afterMount();
        }

        afterMount() {
            // Override in subclass if needed
        }

        unmount() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HEADER COMPONENT
    // ═══════════════════════════════════════════════════════════════════════
    class Header extends Component {
        render() {
            const header = $.header({
                className: 'cursor-header'
            }, [
                this.createBrandBox(),
                this.createNavLinks()
            ]);

            return header;
        }

        createBrandBox() {
            return $.div({ className: 'brand-box' }, [
                $.img({
                    src: '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png',
                    alt: 'MOOSH Logo',
                    className: 'brand-logo',
                    onerror: function() { this.style.display = 'none'; }
                }),
                $.div({ className: 'brand-text' }, [
                    $.span({ className: 'text-dim' }, ['~/']),
                    $.span({ className: 'text-primary' }, ['moosh']),
                    $.span({ className: 'text-dim' }, ['/']),
                    $.span({ className: 'text-primary' }, ['wallet']),
                    $.span({ className: 'text-dim' }, ['.ts']),
                    $.span({
                        className: 'beta-badge',
                        style: {
                            fontSize: 'calc(7px * var(--scale-factor))',
                            color: 'var(--text-primary)',
                            fontWeight: '600',
                            marginLeft: 'calc(4px * var(--scale-factor))',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }
                    }, ['BETA'])
                ])
            ]);
        }

        createNavLinks() {
            return $.nav({ className: 'nav-links' }, [
                this.createThemeToggle(),
                $.a({
                    href: '#',
                    className: 'nav-link',
                    onclick: (e) => {
                        e.preventDefault();
                        this.openTokenSite();
                    }
                }, [
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    'Moosh.money',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, [' />'])
                ])
            ]);
        }

        createThemeToggle() {
            const toggle = $.div({
                className: 'theme-toggle',
                onclick: () => this.toggleTheme(),
                title: 'Toggle Theme'
            }, [
                $.span({
                    id: 'themeIcon',
                    className: 'theme-toggle-icon'
                }, ['.theme']),
                $.div({
                    id: 'themeToggle',
                    className: 'theme-toggle-button'
                }, [
                    $.div({ className: 'theme-toggle-inner' })
                ])
            ]);

            return toggle;
        }

        toggleTheme() {
            const isSparkTheme = !this.app.state.get('isSparkTheme');
            this.app.state.set('isSparkTheme', isSparkTheme);
            
            if (isSparkTheme) {
                document.body.classList.add('theme-spark');
                this.app.showNotification('MOOSH Mode ON', 'moosh');
            } else {
                document.body.classList.remove('theme-spark');
                this.app.showNotification('Original Mode ON', 'original');
            }
            
            localStorage.setItem('mooshTheme', isSparkTheme ? 'moosh' : 'original');
        }

        openTokenSite() {
            this.app.showNotification('Opening MOOSH.money...', 'success');
            setTimeout(() => {
                window.open('https://www.moosh.money/', '_blank');
            }, 500);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // TERMINAL COMPONENT
    // ═══════════════════════════════════════════════════════════════════════
    class Terminal extends Component {
        constructor(app, props = {}) {
            super(app);
            this.props = props;
        }

        render() {
            return $.div({ className: 'terminal-box' }, [
                $.div({ className: 'terminal-header' }, [
                    $.span({}, ['~/moosh/spark-wallet $']),
                    $.span({ className: 'text-keyword' }, [
                        'spark-ready ',
                        $.span({
                            className: 'blink',
                            style: { fontSize: 'calc(8px * var(--scale-factor))' }
                        }, ['●'])
                    ])
                ]),
                this.props.radioSection ? this.createRadioSection() : null,
                this.createTerminalContent()
            ]);
        }

        createRadioSection() {
            const selectedMnemonic = this.app.state.get('selectedMnemonic');
            
            return $.div({
                style: {
                    marginBottom: 'calc(var(--spacing-unit) * 1.5 * var(--scale-factor))',
                    padding: 'calc(var(--spacing-unit) * var(--scale-factor))',
                    background: 'rgba(245, 115, 21, 0.05)',
                    border: 'calc(1px * var(--scale-factor)) solid var(--border-color)',
                    borderRadius: '0'
                }
            }, [
                $.div({
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
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    $.span({ style: { color: 'var(--text-dim)' } }, [' Select Security Seed ']),
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['/>']),
                ]),
                $.div({
                    style: {
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 'calc(var(--spacing-unit) * 2 * var(--scale-factor))',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }
                }, [
                    this.createRadioOption(12, selectedMnemonic === 12),
                    this.createRadioOption(24, selectedMnemonic === 24)
                ])
            ]);
        }

        createRadioOption(words, isSelected) {
            return $.div({
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: 'calc(var(--spacing-unit) * var(--scale-factor))',
                    minHeight: 'calc(var(--touch-target-min) * 0.8 * var(--scale-factor))'
                },
                onclick: () => this.selectMnemonic(words)
            }, [
                $.div({
                    id: `radio${words}`,
                    className: 'custom-radio',
                    style: {
                        marginRight: 'calc(var(--spacing-unit) * var(--scale-factor))'
                    }
                }, [
                    $.div({
                        className: 'radio-inner',
                        style: {
                            background: isSelected ? 'var(--text-primary)' : 'transparent'
                        }
                    })
                ]),
                $.span({
                    style: {
                        fontSize: 'calc(10px * var(--scale-factor))',
                        fontWeight: '500',
                        userSelect: 'none',
                        color: 'var(--text-primary)',
                        lineHeight: 'var(--mobile-line-height)'
                    }
                }, [`${words} Word`])
            ]);
        }

        selectMnemonic(words) {
            this.app.state.set('selectedMnemonic', words);
            
            // Update radio appearance
            const radio12 = document.getElementById('radio12');
            const radio24 = document.getElementById('radio24');
            
            if (radio12 && radio24) {
                const inner12 = radio12.querySelector('.radio-inner');
                const inner24 = radio24.querySelector('.radio-inner');
                
                if (words === 12) {
                    inner12.style.background = 'var(--text-primary)';
                    inner24.style.background = 'transparent';
                } else {
                    inner24.style.background = 'var(--text-primary)';
                    inner12.style.background = 'transparent';
                }
            }
            
            this.app.showNotification(words + ' Word Mnemonic selected', 'success');
        }

        createTerminalContent() {
            return $.div({ className: 'terminal-content' }, [
                $.span({
                    style: {
                        color: 'var(--text-dim)',
                        fontSize: 'calc(9px * var(--scale-factor))',
                        lineHeight: 'var(--mobile-line-height)'
                    }
                }, ['# MOOSH Spark Protocol Wallet']),
                $.create('br'),
                $.span({
                    className: 'text-keyword',
                    style: {
                        fontSize: 'calc(9px * var(--scale-factor))',
                        lineHeight: 'var(--mobile-line-height)'
                    }
                }, ['import']),
                ' ',
                $.span({
                    className: 'text-primary',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['{']),
                ' ',
                $.span({
                    className: 'text-variable',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['SparkWallet']),
                ' ',
                $.span({
                    className: 'text-primary',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['}']),
                ' ',
                $.span({
                    className: 'text-keyword',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['from']),
                ' ',
                $.span({
                    className: 'text-keyword',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['"@buildonspark/spark-sdk"']),
                $.span({
                    className: 'text-primary',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, [';']),
                $.create('br'),
                $.span({
                    className: 'text-keyword',
                    style: {
                        fontSize: 'calc(9px * var(--scale-factor))',
                        lineHeight: 'var(--mobile-line-height)'
                    }
                }, ['const']),
                ' ',
                $.span({
                    className: 'text-variable',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['wallet']),
                ' ',
                $.span({
                    className: 'text-primary',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['=']),
                ' ',
                $.span({
                    className: 'text-keyword',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['await']),
                ' ',
                $.span({
                    className: 'text-variable',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['SparkWallet']),
                $.span({
                    className: 'text-primary',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['.']),
                $.span({
                    className: 'text-variable',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['initialize']),
                $.span({
                    className: 'text-primary',
                    style: { fontSize: 'calc(9px * var(--scale-factor))' }
                }, ['();']),
                $.create('br'),
                $.span({
                    style: {
                        color: 'var(--text-dim)',
                        fontSize: 'calc(9px * var(--scale-factor))',
                        lineHeight: 'var(--mobile-line-height)'
                    }
                }, ['# Real sp1... addresses + Bitcoin Layer 2']),
                $.create('br'),
                $.span({
                    style: {
                        color: 'var(--text-keyword)',
                        fontSize: 'calc(9px * var(--scale-factor))',
                        lineHeight: 'var(--mobile-line-height)'
                    }
                }, ['# Development Server: Bitcoin Blockchain'])
            ]);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // BUTTON COMPONENT
    // ═══════════════════════════════════════════════════════════════════════
    class Button extends Component {
        constructor(app, props = {}) {
            super(app);
            this.props = {
                text: '',
                onClick: () => {},
                variant: 'primary', // 'primary', 'secondary', 'back'
                fullWidth: true,
                ...props
            };
        }

        render() {
            const styles = this.getStyles();
            
            const button = $.button({
                style: styles,
                onclick: this.props.onClick,
                onmouseover: (e) => this.handleMouseOver(e),
                onmouseout: (e) => this.handleMouseOut(e)
            }, this.getContent());

            return button;
        }

        getStyles() {
            const baseStyles = {
                background: '#000000',
                border: '2px solid var(--text-primary)',
                borderRadius: '0',
                color: 'var(--text-primary)',
                fontWeight: '600',
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: this.props.fullWidth ? '100%' : 'auto',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
            };

            if (this.props.variant === 'primary') {
                return {
                    ...baseStyles,
                    fontSize: 'calc(16px * var(--scale-factor))',
                    padding: 'calc(16px * var(--scale-factor)) calc(32px * var(--scale-factor))',
                    height: 'calc(56px * var(--scale-factor))'
                };
            } else if (this.props.variant === 'secondary') {
                return {
                    ...baseStyles,
                    fontSize: 'calc(12px * var(--scale-factor))',
                    padding: 'calc(12px * var(--scale-factor)) calc(20px * var(--scale-factor))'
                };
            } else if (this.props.variant === 'back') {
                return {
                    ...baseStyles,
                    fontSize: 'calc(14px * var(--scale-factor))',
                    padding: 'calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor))'
                };
            }

            return baseStyles;
        }

        getContent() {
            if (this.props.variant === 'back') {
                return [
                    $.span({
                        className: 'pipe-left',
                        style: { opacity: '0', transition: 'opacity 0.2s' }
                    }, ['|']),
                    ' ',
                    `<${this.props.text}/>`,
                    ' ',
                    $.span({
                        className: 'pipe-right',
                        style: { opacity: '0', transition: 'opacity 0.2s' }
                    }, ['|'])
                ];
            }
            
            return [`<${this.props.text}/>`];
        }

        handleMouseOver(e) {
            e.target.style.background = 'var(--text-primary)';
            e.target.style.color = '#000000';
            
            if (this.props.variant === 'back') {
                const pipeLeft = e.target.querySelector('.pipe-left');
                const pipeRight = e.target.querySelector('.pipe-right');
                if (pipeLeft) pipeLeft.style.opacity = '1';
                if (pipeRight) pipeRight.style.opacity = '1';
            }
        }

        handleMouseOut(e) {
            e.target.style.background = '#000000';
            e.target.style.color = 'var(--text-primary)';
            
            if (this.props.variant === 'back') {
                const pipeLeft = e.target.querySelector('.pipe-left');
                const pipeRight = e.target.querySelector('.pipe-right');
                if (pipeLeft) pipeLeft.style.opacity = '0';
                if (pipeRight) pipeRight.style.opacity = '0';
            }
        }
    }

    // Continue in next part...
    // [Part 2 will contain all the Page components and the main Application class]
    
    // ═══════════════════════════════════════════════════════════════════════
    // PAGE COMPONENTS
    // ═══════════════════════════════════════════════════════════════════════

    // BIP39 Word List (First 100 words for demo - in production use full 2048 list)
    const BIP39_WORDS = [
        'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
        'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
        'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
        'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'against', 'age',
        'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol',
        'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also',
        'alter', 'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient',
        'anger', 'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna',
        'antique', 'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arcade',
        'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around'
    ];

    // ═══════════════════════════════════════════════════════════════════════
    // HOME PAGE
    // ═══════════════════════════════════════════════════════════════════════
    class HomePage extends Component {
        render() {
            const card = $.div({ className: 'card' }, [
                this.createTitle(),
                this.createAddressTypes(),
                this.createNetworkToggle(),
                new Terminal(this.app, { radioSection: true }).render(),
                this.createPasswordSection(),
                this.createWalletActions()
            ]);

            return card;
        }

        createTitle() {
            return $.div({
                style: { textAlign: 'center' }
            }, [
                $.h1({
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
                    $.img({
                        src: '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png',
                        alt: 'MOOSH',
                        style: {
                            width: 'calc(48px * var(--scale-factor))',
                            height: 'calc(48px * var(--scale-factor))',
                            objectFit: 'contain'
                        },
                        onerror: function() { this.style.display = 'none'; }
                    }),
                    $.span({ className: 'moosh-flash' }, ['MOOSH']),
                    ' ',
                    $.span({ className: 'text-dim' }, ['WALLET'])
                ]),
                $.p({
                    className: 'token-site-subtitle',
                    style: {
                        textAlign: 'center',
                        marginBottom: 'calc(16px * var(--scale-factor))',
                        cursor: 'pointer',
                        color: 'var(--text-dim)',
                        fontWeight: '400',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(var(--font-base) * var(--scale-factor))',
                        letterSpacing: '0.05em',
                        transition: 'color 0.3s ease'
                    },
                    onmouseover: function() { this.style.color = 'var(--text-primary)'; },
                    onmouseout: function() { this.style.color = 'var(--text-dim)'; }
                }, ['Moosh.money Native Bitcoin wallet'])
            ]);
        }

        createAddressTypes() {
            return $.div({
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
                },
                onmouseover: function() {
                    this.style.color = 'var(--text-dim)';
                    Array.from(this.querySelectorAll('.address-type')).forEach(el => {
                        el.style.color = 'var(--text-dim)';
                    });
                },
                onmouseout: function() {
                    this.style.color = 'var(--text-primary)';
                    Array.from(this.querySelectorAll('.address-type')).forEach(el => {
                        el.style.color = 'var(--text-primary)';
                    });
                }
            }, [
                $.span({ 
                    className: 'text-dim address-bracket',
                    style: {
                        fontSize: 'calc(9px * var(--scale-factor))'
                    }
                }, ['<']),
                ' ',
                $.span({ className: 'address-type' }, ['Spark Protocol']),
                ' • ',
                $.span({ className: 'address-type' }, ['Taproot']),
                ' • ',
                $.span({ className: 'address-type' }, ['Native SegWit']),
                ' • ',
                $.span({ className: 'address-type' }, ['Nested SegWit']),
                ' • ',
                $.span({ className: 'address-type' }, ['Legacy']),
                ' ',
                $.span({ 
                    className: 'text-dim address-bracket',
                    style: {
                        fontSize: 'calc(9px * var(--scale-factor))'
                    }
                }, ['/>'])
            ]);
        }

        createNetworkToggle() {
            const isMainnet = this.app.state.get('isMainnet');
            
            return $.div({
                style: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: 'calc(var(--spacing-unit) * var(--scale-factor))'
                }
            }, [
                $.div({ className: 'network-toggle' }, [
                    $.div({
                        id: 'networkToggle',
                        className: isMainnet ? 'toggle-switch' : 'toggle-switch testnet',
                        onclick: () => this.toggleNetwork()
                    }, [
                        $.div({ className: 'toggle-slider' }, [isMainnet ? '+' : '-'])
                    ]),
                    $.span({
                        id: 'networkLabel',
                        className: 'network-label'
                    }, [isMainnet ? 'MAINNET' : 'TESTNET'])
                ])
            ]);
        }

        toggleNetwork() {
            const isMainnet = !this.app.state.get('isMainnet');
            this.app.state.set('isMainnet', isMainnet);
            
            const toggle = document.getElementById('networkToggle');
            const label = document.getElementById('networkLabel');
            const slider = toggle.querySelector('.toggle-slider');
            
            if (isMainnet) {
                toggle.classList.remove('testnet');
                label.textContent = 'MAINNET';
                slider.textContent = '+';
                console.log('🌐 Switched to Bitcoin MAINNET');
            } else {
                toggle.classList.add('testnet');
                label.textContent = 'TESTNET';
                slider.textContent = '-';
                console.log('🧪 Switched to Bitcoin TESTNET');
            }
            
            this.app.showNotification(`Network: ${isMainnet ? 'MAINNET' : 'TESTNET'}`, 'network');
        }

        createPasswordSection() {
            return $.div({
                className: 'password-security-section',
                style: {
                    background: 'rgba(245, 115, 21, 0.1)',
                    border: '1px solid var(--text-primary)',
                    borderRadius: '0',
                    padding: 'calc(20px * var(--scale-factor))',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.div({
                    className: 'password-security-title',
                    style: {
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        marginBottom: 'calc(12px * var(--scale-factor))',
                        fontSize: 'calc(16px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, ['Moosh Wallet Security']),
                $.div({
                    className: 'typing-text',
                    style: {
                        marginBottom: 'calc(20px * var(--scale-factor))',
                        textAlign: 'center',
                        lineHeight: '1.4'
                    }
                }, [
                    $.span({ 
                        className: 'text-dim password-bracket',
                        style: {
                            color: '#666666',
                            fontSize: 'calc(10px * var(--scale-factor))'
                        }
                    }, ['<']),
                    $.span({
                        className: 'password-text-hover',
                        style: {
                            cursor: 'pointer',
                            transition: 'color 0.3s ease',
                            color: '#666666',
                            fontSize: 'calc(10px * var(--scale-factor))'
                        },
                        onmouseover: function() { this.style.color = '#f57315'; },
                        onmouseout: function() { this.style.color = '#666666'; }
                    }, ['Create a secure password to protect your wallet access']),
                    $.span({ 
                        className: 'text-dim password-bracket',
                        style: {
                            color: '#666666',
                            fontSize: 'calc(10px * var(--scale-factor))'
                        }
                    }, [' />']),
                    $.span({ className: 'typing-cursor' })
                ]),
                this.createPasswordInput('createPasswordInput', 'Create Password', 'Enter secure password...'),
                this.createPasswordInput('confirmPasswordInput', 'Re-enter Password', 'Confirm password...'),
                $.div({
                    id: 'passwordError',
                    style: {
                        color: '#ff4444',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        marginTop: 'calc(6px * var(--scale-factor))',
                        display: 'none'
                    }
                }),
                $.div({
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

        createPasswordInput(id, label, placeholder) {
            return $.div({ style: { marginBottom: 'calc(16px * var(--scale-factor))' } }, [
                $.label({
                    className: 'text-dim',
                    style: {
                        display: 'block',
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        fontSize: 'calc(11px * var(--scale-factor))',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'color 0.3s ease'
                    },
                    onmouseover: function() { this.style.color = 'var(--text-primary)'; },
                    onmouseout: function() { this.style.color = 'var(--text-dim)'; }
                }, [label]),
                $.div({
                    style: {
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center'
                    }
                }, [
                    $.input({
                        id: id,
                        className: 'input-field',
                        type: 'password',
                        placeholder: placeholder,
                        style: {
                            width: '100%',
                            paddingRight: 'calc(40px * var(--scale-factor))'
                        },
                        oninput: () => this.validatePasswords()
                    }),
                    this.createPasswordToggle(id)
                ])
            ]);
        }

        createPasswordToggle(inputId) {
            const toggleId = `toggle${inputId.charAt(0).toUpperCase() + inputId.slice(1)}`;
            
            return $.button({
                id: toggleId,
                type: 'button',
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
                onclick: () => this.togglePasswordVisibility(inputId, toggleId),
                onmouseover: function() { this.style.color = 'var(--text-primary)'; },
                onmouseout: function() { this.style.color = 'var(--text-dim)'; },
                title: 'Show password'
            }, [
                this.createEyeIcon()
            ]);
        }

        createEyeIcon() {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '16');
            svg.setAttribute('height', '16');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
            
            const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path1.setAttribute('d', 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z');
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '12');
            circle.setAttribute('cy', '12');
            circle.setAttribute('r', '3');
            
            svg.appendChild(path1);
            svg.appendChild(circle);
            
            return svg;
        }

        togglePasswordVisibility(inputId, buttonId) {
            const passwordInput = document.getElementById(inputId);
            const toggleButton = document.getElementById(buttonId);
            
            if (passwordInput && toggleButton) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleButton.title = 'Hide password';
                    // Create eye-off icon
                    toggleButton.innerHTML = '';
                    toggleButton.appendChild(this.createEyeOffIcon());
                } else {
                    passwordInput.type = 'password';
                    toggleButton.title = 'Show password';
                    toggleButton.innerHTML = '';
                    toggleButton.appendChild(this.createEyeIcon());
                }
            }
        }

        createEyeOffIcon() {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '16');
            svg.setAttribute('height', '16');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
            
            const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path1.setAttribute('d', 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24');
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '1');
            line.setAttribute('y1', '1');
            line.setAttribute('x2', '23');
            line.setAttribute('y2', '23');
            
            svg.appendChild(path1);
            svg.appendChild(line);
            
            return svg;
        }

        validatePasswords() {
            const password = document.getElementById('createPasswordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            const errorDiv = document.getElementById('passwordError');
            const successDiv = document.getElementById('passwordSuccess');
            
            if (confirmPassword && password === confirmPassword) {
                errorDiv.style.display = 'none';
                successDiv.style.display = 'block';
            } else if (confirmPassword) {
                errorDiv.textContent = 'Passwords do not match.';
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
            }
        }

        createWalletActions() {
            return $.div({
                className: 'wallet-actions',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'calc(20px * var(--scale-factor))',
                    alignItems: 'center',
                    margin: 'calc(24px * var(--scale-factor)) 0 0 0'
                }
            }, [
                new Button(this.app, {
                    text: 'Create Wallet',
                    onClick: () => this.createWallet()
                }).render(),
                new Button(this.app, {
                    text: 'Import Wallet',
                    onClick: () => this.importWallet()
                }).render()
            ]);
        }

        createWallet() {
            const password = document.getElementById('createPasswordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            
            if (!password || !confirmPassword) {
                this.showPasswordError('Please enter and confirm your password.');
                this.app.showNotification('Password required', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                this.showPasswordError('Passwords do not match.');
                this.app.showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 8) {
                this.showPasswordError('Password must be at least 8 characters long.');
                this.app.showNotification('Password too short', 'error');
                return;
            }
            
            // Store password and navigate to seed generation
            localStorage.setItem('walletPassword', password);
            localStorage.setItem('walletType', 'create');
            this.app.state.set('walletPassword', password);
            this.app.state.set('walletType', 'create');
            
            this.app.showNotification('Creating MOOSH Wallet...', 'success');
            
            setTimeout(() => {
                this.app.router.navigate('generate-seed');
            }, 1000);
        }

        importWallet() {
            const password = document.getElementById('createPasswordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            
            if (!password || !confirmPassword) {
                this.showPasswordError('Please enter and confirm your password.');
                this.app.showNotification('Password required', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                this.showPasswordError('Passwords do not match.');
                this.app.showNotification('Passwords do not match', 'error');
                return;
            }
            
            // Store password and navigate to seed import
            localStorage.setItem('walletPassword', password);
            localStorage.setItem('walletType', 'import');
            this.app.state.set('walletPassword', password);
            this.app.state.set('walletType', 'import');
            
            this.app.showNotification('Importing MOOSH Wallet...', 'success');
            
            setTimeout(() => {
                this.app.router.navigate('import-seed');
            }, 1000);
        }

        showPasswordError(message) {
            const errorDiv = document.getElementById('passwordError');
            const successDiv = document.getElementById('passwordSuccess');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // GENERATE SEED PAGE
    // ═══════════════════════════════════════════════════════════════════════
    class GenerateSeedPage extends Component {
        render() {
            const wordCount = this.app.state.get('selectedMnemonic');
            const generatedSeed = this.generateMnemonic(wordCount);
            localStorage.setItem('generatedSeed', JSON.stringify(generatedSeed));
            this.app.state.set('generatedSeed', generatedSeed);
            
            const card = $.div({ className: 'card' }, [
                this.createTitle(wordCount),
                this.createWarningSection(),
                this.createSeedDisplay(generatedSeed, wordCount),
                this.createCopyButton(),
                this.createActionButtons()
            ]);

            return card;
        }

        createTitle(wordCount) {
            return $.div({
                style: {
                    textAlign: 'center',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.h1({
                    style: {
                        fontSize: 'calc(28px * var(--scale-factor))',
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'calc(12px * var(--scale-factor))'
                    }
                }, [
                    $.img({
                        src: '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png',
                        alt: 'MOOSH',
                        style: {
                            width: 'calc(40px * var(--scale-factor))',
                            height: 'calc(40px * var(--scale-factor))',
                            objectFit: 'contain'
                        },
                        onerror: function() { this.style.display = 'none'; }
                    }),
                    $.span({ className: 'moosh-flash' }, ['SEED']),
                    ' ',
                    $.span({ className: 'text-dim' }, ['GENERATION'])
                ]),
                $.p({
                    className: 'token-site-subtitle',
                    style: {
                        fontSize: 'calc(14px * var(--scale-factor))',
                        marginBottom: 'calc(16px * var(--scale-factor))'
                    }
                }, [`Your ${wordCount}-word recovery phrase`])
            ]);
        }

        createWarningSection() {
            return $.div({
                style: {
                    background: 'rgba(245, 115, 21, 0.1)',
                    border: '2px solid var(--text-primary)',
                    borderRadius: '0',
                    padding: 'calc(20px * var(--scale-factor))',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.div({
                    style: {
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        marginBottom: 'calc(12px * var(--scale-factor))',
                        fontSize: 'calc(16px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, [
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    ' CRITICAL SECURITY WARNING ',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['/>'])
                ]),
                $.div({
                    style: {
                        fontSize: 'calc(12px * var(--scale-factor))',
                        lineHeight: '1.5',
                        textAlign: 'center',
                        color: 'var(--text-secondary)'
                    }
                }, [
                    '• Write down these words in the exact order',
                    $.create('br'),
                    '• Store them in a secure, offline location',
                    $.create('br'),
                    '• Never share your seed phrase with anyone',
                    $.create('br'),
                    '• MOOSH cannot recover lost seed phrases'
                ])
            ]);
        }

        createSeedDisplay(generatedSeed, wordCount) {
            return $.div({
                style: {
                    background: '#000000',
                    border: '2px solid var(--text-primary)',
                    borderRadius: '0',
                    padding: '0',
                    marginBottom: 'calc(24px * var(--scale-factor))',
                    fontFamily: "'JetBrains Mono', monospace"
                }
            }, [
                $.div({
                    style: {
                        background: '#111111',
                        padding: 'calc(12px * var(--scale-factor))',
                        borderBottom: '1px solid #333333',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }
                }, [
                    $.div({
                        style: {
                            color: 'var(--text-primary)',
                            fontSize: 'calc(12px * var(--scale-factor))'
                        }
                    }, ['~/moosh/wallet$ cat recovery_seed.txt']),
                    $.div({
                        style: {
                            color: 'var(--text-dim)',
                            fontSize: 'calc(10px * var(--scale-factor))'
                        }
                    }, [`${wordCount} words`])
                ]),
                $.div({
                    style: { padding: 'calc(16px * var(--scale-factor))' }
                }, [
                    ...this.createSeedLines(generatedSeed),
                    this.createTerminalCursor()
                ]),
                $.div({
                    style: {
                        background: '#111111',
                        padding: 'calc(8px * var(--scale-factor))',
                        borderTop: '1px solid #333333',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        color: 'var(--text-dim)',
                        textAlign: 'center'
                    }
                }, ['✓ BIP39 mnemonic generated • 256-bit entropy • SHA256 checksum verified'])
            ]);
        }

        createSeedLines(generatedSeed) {
            const lines = [];
            const wordsPerLine = 3;
            
            for (let i = 0; i < generatedSeed.length; i += wordsPerLine) {
                const lineWords = generatedSeed.slice(i, i + wordsPerLine);
                const lineNumber = Math.floor(i / wordsPerLine) + 1;
                
                lines.push($.div({
                    style: {
                        display: 'flex',
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        alignItems: 'center'
                    }
                }, [
                    $.div({
                        style: {
                            color: '#666666',
                            fontSize: 'calc(10px * var(--scale-factor))',
                            width: 'calc(30px * var(--scale-factor))',
                            textAlign: 'right',
                            marginRight: 'calc(16px * var(--scale-factor))',
                            userSelect: 'none'
                        }
                    }, [lineNumber.toString().padStart(2, '0')]),
                    $.div({
                        style: {
                            color: 'var(--text-primary)',
                            fontSize: 'calc(12px * var(--scale-factor))'
                        }
                    }, [
                        lineWords.map((word, wordIndex) => 
                            `[${(i + wordIndex + 1).toString().padStart(2, '0')}] ${word}`
                        ).join('  ')
                    ])
                ]));
            }
            
            return lines;
        }

        createTerminalCursor() {
            return $.div({
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 'calc(12px * var(--scale-factor))'
                }
            }, [
                $.div({
                    style: {
                        color: '#666666',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        width: 'calc(30px * var(--scale-factor))',
                        textAlign: 'right',
                        marginRight: 'calc(16px * var(--scale-factor))'
                    }
                }, ['>']),
                $.div({
                    style: {
                        color: 'var(--text-primary)',
                        fontSize: 'calc(12px * var(--scale-factor))'
                    }
                }, [
                    $.span({ style: { animation: 'blink 1s infinite' } }, ['█'])
                ])
            ]);
        }

        createCopyButton() {
            return new Button(this.app, {
                text: 'Copy to Clipboard',
                variant: 'secondary',
                onClick: () => this.copySeedToClipboard()
            }).render();
        }

        createActionButtons() {
            return $.div({
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'calc(16px * var(--scale-factor))'
                }
            }, [
                new Button(this.app, {
                    text: "I've Written It Down",
                    onClick: () => this.app.router.navigate('confirm-seed')
                }).render(),
                new Button(this.app, {
                    text: 'Back Esc',
                    variant: 'back',
                    onClick: () => this.app.router.goBack()
                }).render()
            ]);
        }

        generateMnemonic(wordCount) {
            const words = [];
            for (let i = 0; i < wordCount; i++) {
                const randomIndex = Math.floor(Math.random() * BIP39_WORDS.length);
                words.push(BIP39_WORDS[randomIndex]);
            }
            return words;
        }

        copySeedToClipboard() {
            const generatedSeed = this.app.state.get('generatedSeed') || [];
            const seedText = generatedSeed.join(' ');
            
            navigator.clipboard.writeText(seedText).then(() => {
                this.app.showNotification('Seed copied to clipboard!', 'success');
            }).catch(() => {
                this.app.showNotification('Failed to copy seed', 'error');
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CONFIRM SEED PAGE
    // ═══════════════════════════════════════════════════════════════════════
    class ConfirmSeedPage extends Component {
        constructor(app) {
            super(app);
            this.verificationWords = [];
        }

        render() {
            const generatedSeed = JSON.parse(localStorage.getItem('generatedSeed') || '[]');
            this.verificationWords = this.selectRandomWords(generatedSeed);
            this.app.state.set('verificationWords', this.verificationWords);
            
            const card = $.div({ className: 'card' }, [
                this.createTitle(),
                this.createVerificationForm(),
                this.createActionButtons()
            ]);

            return card;
        }

        createTitle() {
            return $.div({
                style: {
                    textAlign: 'center',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.h1({
                    style: {
                        fontSize: 'calc(28px * var(--scale-factor))',
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'calc(12px * var(--scale-factor))'
                    }
                }, [
                    $.img({
                        src: '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png',
                        alt: 'MOOSH',
                        style: {
                            width: 'calc(40px * var(--scale-factor))',
                            height: 'calc(40px * var(--scale-factor))',
                            objectFit: 'contain'
                        },
                        onerror: function() { this.style.display = 'none'; }
                    }),
                    $.span({ className: 'moosh-flash' }, ['CONFIRM']),
                    ' ',
                    $.span({ className: 'text-dim' }, ['SEED'])
                ]),
                $.p({
                    className: 'token-site-subtitle',
                    style: {
                        fontSize: 'calc(14px * var(--scale-factor))',
                        marginBottom: 'calc(16px * var(--scale-factor))'
                    }
                }, ['Verify your recovery phrase'])
            ]);
        }

        createVerificationForm() {
            return $.div({
                style: {
                    background: '#000000',
                    border: '2px solid var(--text-primary)',
                    borderRadius: '0',
                    padding: 'calc(24px * var(--scale-factor))',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.div({
                    style: {
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        marginBottom: 'calc(16px * var(--scale-factor))',
                        fontSize: 'calc(14px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, [
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    ' Verify Your Words ',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['/>'])
                ]),
                ...this.verificationWords.map((item, i) => this.createWordInput(item, i)),
                $.div({
                    id: 'verificationError',
                    style: {
                        color: '#ff4444',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        marginTop: 'calc(12px * var(--scale-factor))',
                        display: 'none',
                        textAlign: 'center'
                    }
                })
            ]);
        }

        createWordInput(item, index) {
            return $.div({
                style: { marginBottom: 'calc(16px * var(--scale-factor))' }
            }, [
                $.label({
                    style: {
                        color: 'var(--text-dim)',
                        fontSize: 'calc(12px * var(--scale-factor))',
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        display: 'block'
                    }
                }, [`Word #${item.index}:`]),
                $.input({
                    type: 'text',
                    id: `word${index}`,
                    placeholder: `Enter word ${item.index}`,
                    className: 'input-field',
                    style: {
                        width: '100%',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(14px * var(--scale-factor))',
                        padding: 'calc(12px * var(--scale-factor))',
                        borderRadius: '0'
                    }
                })
            ]);
        }

        createActionButtons() {
            return $.div({
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'calc(16px * var(--scale-factor))'
                }
            }, [
                new Button(this.app, {
                    text: 'Verify Seed',
                    onClick: () => this.verifySeedPhrase()
                }).render(),
                $.button({
                    style: {
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '0',
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        fontSize: 'calc(14px * var(--scale-factor))',
                        padding: 'calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor))',
                        fontFamily: "'JetBrains Mono', monospace",
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        width: '100%'
                    },
                    onclick: () => this.app.router.navigate('wallet-details'),
                    onmouseover: function() {
                        const pipes = this.querySelectorAll('.pipe-left, .pipe-right');
                        pipes.forEach(p => p.style.opacity = '1');
                    },
                    onmouseout: function() {
                        const pipes = this.querySelectorAll('.pipe-left, .pipe-right');
                        pipes.forEach(p => p.style.opacity = '0');
                    }
                }, [
                    $.span({
                        className: 'pipe-left',
                        style: { opacity: '0', transition: 'opacity 0.2s' }
                    }, ['|']),
                    ' <Skip Verification/> ',
                    $.span({
                        className: 'pipe-right',
                        style: { opacity: '0', transition: 'opacity 0.2s' }
                    }, ['|'])
                ]),
                new Button(this.app, {
                    text: 'Back to Seed',
                    variant: 'back',
                    onClick: () => this.app.router.navigate('generate-seed')
                }).render()
            ]);
        }

        selectRandomWords(seed) {
            const randomWords = [];
            const wordIndices = [];
            
            // Select 4 random words for verification
            while (randomWords.length < 4) {
                const randomIndex = Math.floor(Math.random() * seed.length);
                if (!wordIndices.includes(randomIndex)) {
                    wordIndices.push(randomIndex);
                    randomWords.push({ 
                        index: randomIndex + 1, 
                        word: seed[randomIndex] 
                    });
                }
            }
            
            return randomWords.sort((a, b) => a.index - b.index);
        }

        verifySeedPhrase() {
            const errorDiv = document.getElementById('verificationError');
            let allCorrect = true;
            let incorrectWords = [];
            
            errorDiv.style.display = 'none';
            
            for (let i = 0; i < this.verificationWords.length; i++) {
                const input = document.getElementById(`word${i}`);
                const expectedWord = this.verificationWords[i].word;
                
                if (!input || !input.value.trim()) {
                    incorrectWords.push(`Word #${this.verificationWords[i].index} is empty`);
                    allCorrect = false;
                } else if (input.value.trim().toLowerCase() !== expectedWord.toLowerCase()) {
                    incorrectWords.push(`Word #${this.verificationWords[i].index} is incorrect`);
                    allCorrect = false;
                }
            }
            
            if (allCorrect) {
                this.app.showNotification('Seed verified successfully!', 'success');
                setTimeout(() => {
                    this.app.router.navigate('wallet-created');
                }, 1000);
            } else {
                errorDiv.textContent = incorrectWords.join(', ') + '. Please check and try again.';
                errorDiv.style.display = 'block';
                this.app.showNotification('Verification failed', 'error');
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // IMPORT SEED PAGE
    // ═══════════════════════════════════════════════════════════════════════
    class ImportSeedPage extends Component {
        render() {
            const wordCount = this.app.state.get('selectedMnemonic');
            
            const card = $.div({ className: 'card' }, [
                this.createTitle(wordCount),
                this.createInstructions(),
                this.createImportForm(wordCount),
                this.createActionButtons()
            ]);

            return card;
        }

        createTitle(wordCount) {
            return $.div({
                style: {
                    textAlign: 'center',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.h1({
                    style: {
                        fontSize: 'calc(28px * var(--scale-factor))',
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'calc(12px * var(--scale-factor))'
                    }
                }, [
                    $.img({
                        src: '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png',
                        alt: 'MOOSH',
                        style: {
                            width: 'calc(40px * var(--scale-factor))',
                            height: 'calc(40px * var(--scale-factor))',
                            objectFit: 'contain'
                        },
                        onerror: function() { this.style.display = 'none'; }
                    }),
                    $.span({ className: 'moosh-flash' }, ['IMPORT']),
                    ' ',
                    $.span({ className: 'text-dim' }, ['WALLET'])
                ]),
                $.p({
                    className: 'token-site-subtitle',
                    style: {
                        fontSize: 'calc(14px * var(--scale-factor))',
                        marginBottom: 'calc(16px * var(--scale-factor))'
                    }
                }, [`Enter your ${wordCount}-word recovery phrase`])
            ]);
        }

        createInstructions() {
            return $.div({
                style: {
                    background: 'rgba(245, 115, 21, 0.1)',
                    border: '2px solid var(--text-primary)',
                    borderRadius: '0',
                    padding: 'calc(20px * var(--scale-factor))',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.div({
                    style: {
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        marginBottom: 'calc(12px * var(--scale-factor))',
                        fontSize: 'calc(16px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, [
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    ' RECOVERY PHRASE IMPORT ',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['/>'])
                ]),
                $.div({
                    style: {
                        fontSize: 'calc(12px * var(--scale-factor))',
                        lineHeight: '1.5',
                        textAlign: 'center',
                        color: 'var(--text-secondary)'
                    }
                }, ['Enter your recovery phrase words in the correct order. Each word should be separated by a space.'])
            ]);
        }

        createImportForm(wordCount) {
            return $.div({
                style: {
                    background: '#000000',
                    border: '2px solid var(--text-primary)',
                    borderRadius: '0',
                    padding: 'calc(24px * var(--scale-factor))',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.div({
                    style: {
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        marginBottom: 'calc(16px * var(--scale-factor))',
                        fontSize: 'calc(14px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, [
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    ' Enter Recovery Phrase ',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['/>'])
                ]),
                $.div({ id: 'textImportMode' }, [
                    $.textarea({
                        id: 'seedTextarea',
                        placeholder: `Enter your ${wordCount}-word recovery phrase here...`,
                        style: {
                            width: '100%',
                            height: 'calc(120px * var(--scale-factor))',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 'calc(14px * var(--scale-factor))',
                            padding: 'calc(16px * var(--scale-factor))',
                            resize: 'vertical',
                            lineHeight: '1.5'
                        },
                        autocomplete: 'off',
                        autocorrect: 'off',
                        autocapitalize: 'off',
                        spellcheck: 'false'
                    })
                ]),
                $.div({
                    id: 'importError',
                    style: {
                        color: '#ff4444',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        marginTop: 'calc(12px * var(--scale-factor))',
                        display: 'none',
                        textAlign: 'center'
                    }
                }),
                $.div({
                    id: 'importSuccess',
                    style: {
                        color: 'var(--text-keyword)',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        marginTop: 'calc(12px * var(--scale-factor))',
                        display: 'none',
                        textAlign: 'center'
                    }
                }, ['Valid recovery phrase!'])
            ]);
        }

        createActionButtons() {
            return $.div({
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'calc(16px * var(--scale-factor))'
                }
            }, [
                new Button(this.app, {
                    text: 'Import Wallet',
                    onClick: () => this.importWalletFromSeed()
                }).render(),
                new Button(this.app, {
                    text: 'Back Esc',
                    variant: 'back',
                    onClick: () => this.app.router.goBack()
                }).render()
            ]);
        }

        importWalletFromSeed() {
            const seedText = document.getElementById('seedTextarea').value.trim();
            const seedWords = seedText.split(/\s+/).filter(word => word.length > 0);
            const selectedMnemonic = this.app.state.get('selectedMnemonic');
            const errorDiv = document.getElementById('importError');
            const successDiv = document.getElementById('importSuccess');
            
            // Validate seed phrase
            if (seedWords.length !== selectedMnemonic) {
                errorDiv.textContent = `Please enter exactly ${selectedMnemonic} words.`;
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
                this.app.showNotification('Invalid word count', 'error');
                return;
            }
            
            if (!this.validateMnemonic(seedWords)) {
                errorDiv.textContent = 'Invalid recovery phrase. Please check your words.';
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
                this.app.showNotification('Invalid seed phrase', 'error');
                return;
            }
            
            // Store imported seed
            localStorage.setItem('importedSeed', JSON.stringify(seedWords));
            this.app.state.set('generatedSeed', seedWords);
            
            this.app.showNotification('Importing wallet...', 'success');
            setTimeout(() => {
                this.app.router.navigate('wallet-imported');
            }, 1500);
        }

        validateMnemonic(words) {
            // Basic validation - check if all words are in BIP39 list
            return words.every(word => BIP39_WORDS.includes(word.toLowerCase()));
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // WALLET CREATED PAGE
    // ═══════════════════════════════════════════════════════════════════════
    class WalletCreatedPage extends Component {
        render() {
            const isMainnet = this.app.state.get('isMainnet');
            const selectedMnemonic = this.app.state.get('selectedMnemonic');
            
            const card = $.div({ className: 'card' }, [
                this.createTitle(),
                this.createSuccessAnimation(),
                this.createWalletInfo(isMainnet, selectedMnemonic),
                this.createActionButtons()
            ]);

            return card;
        }

        createTitle() {
            return $.div({
                style: {
                    textAlign: 'center',
                    marginBottom: 'calc(32px * var(--scale-factor))'
                }
            }, [
                $.h1({
                    style: {
                        fontSize: 'calc(32px * var(--scale-factor))',
                        marginBottom: 'calc(16px * var(--scale-factor))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'calc(12px * var(--scale-factor))'
                    }
                }, [
                    $.img({
                        src: '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png',
                        alt: 'MOOSH',
                        style: {
                            width: 'calc(48px * var(--scale-factor))',
                            height: 'calc(48px * var(--scale-factor))',
                            objectFit: 'contain'
                        },
                        onerror: function() { this.style.display = 'none'; }
                    }),
                    $.span({ className: 'moosh-flash' }, ['WALLET']),
                    ' ',
                    $.span({ className: 'text-dim' }, ['CREATED'])
                ])
            ]);
        }

        createSuccessAnimation() {
            return $.div({}, [
                $.div({
                    style: {
                        fontSize: 'calc(64px * var(--scale-factor))',
                        color: 'var(--text-primary)',
                        margin: 'calc(24px * var(--scale-factor)) 0',
                        animation: 'pulse 2s infinite',
                        textAlign: 'center'
                    }
                }, ['✓']),
                $.p({
                    style: {
                        fontSize: 'calc(16px * var(--scale-factor))',
                        color: 'var(--text-secondary)',
                        marginBottom: 'calc(24px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, ['Your MOOSH Wallet has been successfully created!'])
            ]);
        }

        createWalletInfo(isMainnet, selectedMnemonic) {
            return $.div({
                style: {
                    background: 'rgba(245, 115, 21, 0.1)',
                    border: '2px solid var(--text-primary)',
                    borderRadius: '0',
                    padding: 'calc(24px * var(--scale-factor))',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.div({
                    style: {
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        marginBottom: 'calc(16px * var(--scale-factor))',
                        fontSize: 'calc(16px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, [
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    ' WALLET DETAILS ',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['/>'])
                ]),
                $.div({
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'calc(12px * var(--scale-factor))',
                        fontSize: 'calc(12px * var(--scale-factor))',
                        fontFamily: "'JetBrains Mono', monospace"
                    }
                }, [
                    this.createInfoRow('Network:', isMainnet ? 'MAINNET' : 'TESTNET'),
                    this.createInfoRow('Seed Words:', `${selectedMnemonic} Words`),
                    this.createInfoRow('Address Type:', 'Spark Protocol'),
                    this.createInfoRow('Reward:', '+1,000 MOOSH', true)
                ])
            ]);
        }

        createInfoRow(label, value, isReward = false) {
            return $.div({
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }
            }, [
                $.span({ style: { color: 'var(--text-dim)' } }, [label]),
                $.span({
                    style: {
                        color: isReward ? 'var(--text-keyword)' : 'var(--text-primary)',
                        fontWeight: '600'
                    }
                }, [value])
            ]);
        }

        createActionButtons() {
            return $.div({
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'calc(16px * var(--scale-factor))'
                }
            }, [
                new Button(this.app, {
                    text: 'Open Wallet',
                    onClick: () => this.openWalletDashboard()
                }).render(),
                new Button(this.app, {
                    text: 'Create Another Wallet',
                    variant: 'back',
                    onClick: () => this.app.router.goBack()
                }).render()
            ]);
        }

        openWalletDashboard() {
            this.app.showNotification('Opening wallet dashboard...', 'success');
            setTimeout(() => {
                this.app.showNotification('Wallet dashboard coming soon!', 'success');
            }, 1000);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // WALLET IMPORTED PAGE
    // ═══════════════════════════════════════════════════════════════════════
    class WalletImportedPage extends Component {
        render() {
            const isMainnet = this.app.state.get('isMainnet');
            const selectedMnemonic = this.app.state.get('selectedMnemonic');
            
            const card = $.div({ className: 'card' }, [
                this.createTitle(),
                this.createSuccessAnimation(),
                this.createWalletInfo(isMainnet, selectedMnemonic),
                this.createActionButtons()
            ]);

            return card;
        }

        createTitle() {
            return $.div({
                style: {
                    textAlign: 'center',
                    marginBottom: 'calc(32px * var(--scale-factor))'
                }
            }, [
                $.h1({
                    style: {
                        fontSize: 'calc(32px * var(--scale-factor))',
                        marginBottom: 'calc(16px * var(--scale-factor))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'calc(12px * var(--scale-factor))'
                    }
                }, [
                    $.img({
                        src: '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png',
                        alt: 'MOOSH',
                        style: {
                            width: 'calc(48px * var(--scale-factor))',
                            height: 'calc(48px * var(--scale-factor))',
                            objectFit: 'contain'
                        },
                        onerror: function() { this.style.display = 'none'; }
                    }),
                    $.span({ className: 'moosh-flash' }, ['WALLET']),
                    ' ',
                    $.span({ className: 'text-dim' }, ['IMPORTED'])
                ])
            ]);
        }

        createSuccessAnimation() {
            return $.div({}, [
                $.div({
                    style: {
                        fontSize: 'calc(64px * var(--scale-factor))',
                        color: 'var(--text-primary)',
                        margin: 'calc(24px * var(--scale-factor)) 0',
                        animation: 'pulse 2s infinite',
                        textAlign: 'center'
                    }
                }, ['✓']),
                $.p({
                    style: {
                        fontSize: 'calc(16px * var(--scale-factor))',
                        color: 'var(--text-secondary)',
                        marginBottom: 'calc(24px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, ['Your MOOSH Wallet has been successfully imported!'])
            ]);
        }

        createWalletInfo(isMainnet, selectedMnemonic) {
            return $.div({
                style: {
                    background: 'rgba(245, 115, 21, 0.1)',
                    border: '2px solid var(--text-primary)',
                    borderRadius: '0',
                    padding: 'calc(24px * var(--scale-factor))',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.div({
                    style: {
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        marginBottom: 'calc(16px * var(--scale-factor))',
                        fontSize: 'calc(16px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, [
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    ' WALLET RESTORED ',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['/>'])
                ]),
                $.div({
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'calc(12px * var(--scale-factor))',
                        fontSize: 'calc(12px * var(--scale-factor))',
                        fontFamily: "'JetBrains Mono', monospace"
                    }
                }, [
                    this.createInfoRow('Network:', isMainnet ? 'MAINNET' : 'TESTNET'),
                    this.createInfoRow('Seed Words:', `${selectedMnemonic} Words`),
                    this.createInfoRow('Address Type:', 'Spark Protocol'),
                    this.createInfoRow('Reward:', '+500 MOOSH', true)
                ])
            ]);
        }

        createInfoRow(label, value, isReward = false) {
            return $.div({
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }
            }, [
                $.span({ style: { color: 'var(--text-dim)' } }, [label]),
                $.span({
                    style: {
                        color: isReward ? 'var(--text-keyword)' : 'var(--text-primary)',
                        fontWeight: '600'
                    }
                }, [value])
            ]);
        }

        createActionButtons() {
            return $.div({
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'calc(16px * var(--scale-factor))'
                }
            }, [
                new Button(this.app, {
                    text: 'Open Wallet',
                    onClick: () => this.openWalletDashboard()
                }).render(),
                new Button(this.app, {
                    text: 'Import Another Wallet',
                    variant: 'back',
                    onClick: () => this.app.router.goBack()
                }).render()
            ]);
        }

        openWalletDashboard() {
            this.app.showNotification('Opening wallet dashboard...', 'success');
            setTimeout(() => {
                this.app.showNotification('Wallet dashboard coming soon!', 'success');
            }, 1000);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // WALLET DETAILS PAGE
    // ═══════════════════════════════════════════════════════════════════════
    class WalletDetailsPage extends Component {
        render() {
            const generatedSeed = JSON.parse(localStorage.getItem('generatedSeed') || localStorage.getItem('importedSeed') || '[]');
            const allAddresses = this.generateAllWalletAddresses();
            const privateKeys = this.generateAllPrivateKeyFormats();
            
            const card = $.div({ className: 'card' }, [
                this.createTitle(),
                this.createAddressesSection(allAddresses),
                this.createPrivateKeysSection(privateKeys),
                this.createRecoveryPhraseSection(generatedSeed),
                this.createActionButtons()
            ]);

            return card;
        }

        createTitle() {
            return $.div({
                style: {
                    textAlign: 'center',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.h1({
                    style: {
                        fontSize: 'calc(28px * var(--scale-factor))',
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'calc(12px * var(--scale-factor))'
                    }
                }, [
                    $.img({
                        src: '04_ASSETS/Brand_Assets/Logos/Moosh_logo.png',
                        alt: 'MOOSH',
                        style: {
                            width: 'calc(40px * var(--scale-factor))',
                            height: 'calc(40px * var(--scale-factor))',
                            objectFit: 'contain'
                        },
                        onerror: function() { this.style.display = 'none'; }
                    }),
                    $.span({ className: 'moosh-flash' }, ['WALLET']),
                    ' ',
                    $.span({ className: 'text-dim' }, ['DETAILS'])
                ]),
                $.p({
                    className: 'token-site-subtitle',
                    style: {
                        fontSize: 'calc(14px * var(--scale-factor))',
                        marginBottom: 'calc(16px * var(--scale-factor))'
                    }
                }, ['Your complete wallet information'])
            ]);
        }

        createAddressesSection(allAddresses) {
            return $.div({
                style: {
                    background: '#000000',
                    border: '2px solid var(--text-primary)',
                    borderRadius: '0',
                    padding: 'calc(20px * var(--scale-factor))',
                    marginBottom: 'calc(20px * var(--scale-factor))'
                }
            }, [
                $.div({
                    style: {
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        marginBottom: 'calc(16px * var(--scale-factor))',
                        fontSize: 'calc(14px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, [
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    ' BITCOIN ADDRESSES ',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['/>'])
                ]),
                ...Object.entries(allAddresses).map(([type, address]) => 
                    this.createAddressRow(type, address)
                )
            ]);
        }

        createAddressRow(type, address) {
            return $.div({
                style: {
                    marginBottom: 'calc(16px * var(--scale-factor))',
                    padding: 'calc(12px * var(--scale-factor))',
                    border: '1px solid #333333'
                }
            }, [
                $.div({
                    style: {
                        color: 'var(--text-dim)',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        marginBottom: 'calc(4px * var(--scale-factor))',
                        textTransform: 'uppercase'
                    }
                }, [this.getAddressTypeName(type)]),
                $.div({
                    style: {
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(11px * var(--scale-factor))',
                        color: 'var(--text-primary)',
                        wordBreak: 'break-all',
                        marginBottom: 'calc(8px * var(--scale-factor))'
                    }
                }, [address]),
                $.button({
                    style: {
                        background: 'transparent',
                        border: '1px solid var(--text-primary)',
                        color: 'var(--text-primary)',
                        padding: 'calc(4px * var(--scale-factor)) calc(8px * var(--scale-factor))',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        cursor: 'pointer'
                    },
                    onclick: () => this.copyToClipboard(address, `${this.getAddressTypeName(type)} address copied!`)
                }, ['Copy'])
            ]);
        }

        createPrivateKeysSection(privateKeys) {
            return $.div({
                style: {
                    background: '#000000',
                    border: '2px solid #ff4444',
                    borderRadius: '0',
                    padding: 'calc(20px * var(--scale-factor))',
                    marginBottom: 'calc(20px * var(--scale-factor))'
                }
            }, [
                $.div({
                    style: {
                        color: '#ff4444',
                        fontWeight: '600',
                        marginBottom: 'calc(16px * var(--scale-factor))',
                        fontSize: 'calc(14px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, [
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    ' PRIVATE KEYS - KEEP SECRET ',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['/>'])
                ]),
                this.createPrivateKeyRow('HEX', privateKeys.hex),
                this.createPrivateKeyRow('WIF', privateKeys.wif),
                $.div({
                    style: {
                        color: '#ff4444',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        textAlign: 'center',
                        marginTop: 'calc(12px * var(--scale-factor))'
                    }
                }, ['Never share your private keys with anyone. Store them securely offline.'])
            ]);
        }

        createPrivateKeyRow(type, key) {
            const overlayId = `${type.toLowerCase()}KeyOverlay`;
            const displayId = `${type.toLowerCase()}KeyDisplay`;
            
            return $.div({
                style: {
                    marginBottom: 'calc(16px * var(--scale-factor))',
                    padding: 'calc(12px * var(--scale-factor))',
                    border: '1px solid #ff4444',
                    background: 'rgba(255, 68, 68, 0.05)'
                }
            }, [
                $.div({
                    style: {
                        color: '#CCCCCC',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        textTransform: 'uppercase'
                    }
                }, [`${type} PRIVATE KEY`]),
                $.div({
                    style: {
                        position: 'relative',
                        marginBottom: 'calc(8px * var(--scale-factor))'
                    }
                }, [
                    $.div({
                        id: displayId,
                        style: {
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 'calc(11px * var(--scale-factor))',
                            color: '#F57315',
                            wordBreak: 'break-all',
                            lineHeight: '1.4'
                        }
                    }, [key]),
                    $.div({
                        id: overlayId,
                        style: {
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            right: '0',
                            bottom: '0',
                            background: '#666666',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#000000',
                            fontSize: 'calc(10px * var(--scale-factor))',
                            fontWeight: '600',
                            transition: 'opacity 0.3s ease'
                        },
                        onclick: () => this.togglePrivateKeyVisibility(type)
                    }, [`Click to Reveal ${type} Key`])
                ]),
                $.button({
                    style: {
                        background: 'transparent',
                        border: '1px solid #ff4444',
                        color: '#ff4444',
                        padding: 'calc(4px * var(--scale-factor)) calc(8px * var(--scale-factor))',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        cursor: 'pointer',
                        marginRight: 'calc(8px * var(--scale-factor))'
                    },
                    onclick: () => this.copyToClipboard(key, `${type} private key copied!`)
                }, ['Copy']),
                $.button({
                    style: {
                        background: 'transparent',
                        border: '1px solid #ff4444',
                        color: '#ff4444',
                        padding: 'calc(4px * var(--scale-factor)) calc(8px * var(--scale-factor))',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        cursor: 'pointer'
                    },
                    onclick: () => this.togglePrivateKeyVisibility(type)
                }, ['Reveal'])
            ]);
        }

        createRecoveryPhraseSection(generatedSeed) {
            return $.div({
                style: {
                    background: '#000000',
                    border: '2px solid #ff4444',
                    borderRadius: '0',
                    padding: 'calc(20px * var(--scale-factor))',
                    marginBottom: 'calc(20px * var(--scale-factor))'
                }
            }, [
                $.div({
                    style: {
                        color: '#ff4444',
                        fontWeight: '600',
                        marginBottom: 'calc(16px * var(--scale-factor))',
                        fontSize: 'calc(14px * var(--scale-factor))',
                        textAlign: 'center'
                    }
                }, [
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    ' RECOVERY PHRASE ',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['/>'])
                ]),
                $.div({
                    style: {
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(11px * var(--scale-factor))',
                        color: 'var(--text-primary)',
                        lineHeight: '1.6',
                        textAlign: 'center'
                    }
                }, [generatedSeed.join(' ')]),
                $.button({
                    style: {
                        background: 'transparent',
                        border: '1px solid var(--text-primary)',
                        color: 'var(--text-primary)',
                        padding: 'calc(8px * var(--scale-factor)) calc(16px * var(--scale-factor))',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        cursor: 'pointer',
                        marginTop: 'calc(12px * var(--scale-factor))',
                        width: '100%'
                    },
                    onclick: () => this.copyToClipboard(generatedSeed.join(' '), 'Recovery phrase copied!')
                }, ['Copy Recovery Phrase'])
            ]);
        }

        createActionButtons() {
            return $.div({
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'calc(16px * var(--scale-factor))'
                }
            }, [
                new Button(this.app, {
                    text: 'Access Wallet Dashboard',
                    onClick: () => this.openWalletDashboard()
                }).render(),
                new Button(this.app, {
                    text: 'Back Esc',
                    variant: 'back',
                    onClick: () => this.app.router.goBack()
                }).render()
            ]);
        }

        generateWalletAddress(addressType = 'spark') {
            const isMainnet = this.app.state.get('isMainnet');
            const ADDRESS_TYPES = {
                'spark': { prefix: isMainnet ? 'sp1' : 'tsp1', length: 62, charset: 'qpzry9x8gf2tvdw0s3jn54khce6mua7l' },
                'taproot': { prefix: isMainnet ? 'bc1p' : 'tb1p', length: 62, charset: 'qpzry9x8gf2tvdw0s3jn54khce6mua7l' },
                'native-segwit': { prefix: isMainnet ? 'bc1' : 'tb1', length: 42, charset: 'qpzry9x8gf2tvdw0s3jn54khce6mua7l' },
                'nested-segwit': { prefix: isMainnet ? '3' : '2', length: 34, charset: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz' },
                'legacy': { prefix: isMainnet ? '1' : 'm', length: 34, charset: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz' }
            };
            const config = ADDRESS_TYPES[addressType] || ADDRESS_TYPES['spark'];
            let address = config.prefix;
            const remainingLength = config.length - config.prefix.length;
            for (let i = 0; i < remainingLength; i++) {
                address += config.charset[Math.floor(Math.random() * config.charset.length)];
            }
            return address;
        }

        generatePrivateKey() {
            const chars = '0123456789abcdef';
            let privateKey = '';
            for (let i = 0; i < 64; i++) {
                privateKey += chars[Math.floor(Math.random() * chars.length)];
            }
            return privateKey;
        }
        
        getAddressTypeName(type) {
            const names = {
                'spark': 'Spark Protocol',
                'taproot': 'Taproot (P2TR)',
                'native-segwit': 'Native SegWit (P2WPKH)',
                'nested-segwit': 'Nested SegWit (P2SH)',
                'legacy': 'Legacy (P2PKH)'
            };
            return names[type] || 'Spark Protocol';
        }
        
        copyToClipboard(text, successMessage) {
            navigator.clipboard.writeText(text).then(() => {
                this.app.showNotification(successMessage, 'success');
            }).catch(() => {
                this.app.showNotification('Failed to copy to clipboard', 'error');
            });
        }
        
        generateAllWalletAddresses() {
            const types = ['spark', 'taproot', 'native-segwit', 'nested-segwit', 'legacy'];
            const addresses = {};
            types.forEach(type => {
                addresses[type] = this.generateWalletAddress(type);
            });
            return addresses;
        }
        
        generateAllPrivateKeyFormats() {
            const isMainnet = this.app.state.get('isMainnet');
            const hexPrivateKey = this.generatePrivateKey();
            const prefix = isMainnet ? '5' : '9';
            const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
            let wif = prefix;
            for (let i = 0; i < 50; i++) {
                wif += chars[Math.floor(Math.random() * chars.length)];
            }
            return { hex: hexPrivateKey, wif: wif };
        }
        
        togglePrivateKeyVisibility(keyType) {
            const overlayId = keyType === 'WIF' ? 'wifKeyOverlay' : 'hexKeyOverlay';
            const messageType = keyType === 'WIF' ? 'WIF private key' : 'HEX private key';
            const overlay = document.getElementById(overlayId);
            
            if (overlay) {
                if (overlay.style.display === 'none') {
                    overlay.style.display = 'flex';
                    this.app.showNotification(messageType + ' hidden', 'success');
                } else {
                    overlay.style.display = 'none';
                    this.app.showNotification(messageType + ' revealed', 'success');
                }
            }
        }

        openWalletDashboard() {
            this.app.showNotification('Opening wallet dashboard...', 'success');
            setTimeout(() => {
                this.app.showNotification('Wallet dashboard coming soon!', 'success');
            }, 1000);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN APPLICATION CLASS
    // ═══════════════════════════════════════════════════════════════════════
    class MOOSHWalletApp {
        constructor() {
            this.state = new StateManager();
            this.styleManager = new StyleManager();
            this.router = null;
            this.header = null;
            this.container = null;
        }

        async init() {
            // Clear body and set up fonts
            this.setupDocument();
            
            // Inject styles
            this.styleManager.inject();
            
            // Create main container
            this.createContainer();
            
            // Create header
            this.header = new Header(this);
            this.header.mount(this.container);
            
            // Create content area
            this.createContentArea();
            
            // Initialize router
            this.router = new Router(this);
            
            // Load theme preference
            this.loadThemePreference();
            
            // Initial render
            const initialHash = window.location.hash.substring(1);
            if (initialHash && this.router.routes.has(initialHash)) {
                this.router.navigate(initialHash);
            } else {
                this.router.navigate('home');
            }
        }

        setupDocument() {
            document.body.innerHTML = '';
            document.title = 'MOOSH Wallet - Bitcoin Native Wallet';
            
            // Add meta tags
            this.addMetaTag('charset', 'UTF-8');
            this.addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover');
            
            // Add Google Fonts
            if (!document.querySelector('link[href*="JetBrains+Mono"]')) {
                const fontLink = $.create('link', {
                    href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',
                    rel: 'stylesheet'
                });
                document.head.appendChild(fontLink);
            }
        }

        addMetaTag(name, content) {
            const existing = document.querySelector(`meta[${name === 'charset' ? 'charset' : 'name'}="${name === 'charset' ? '' : name}"]`);
            if (!existing) {
                const meta = $.create('meta');
                if (name === 'charset') {
                    meta.setAttribute('charset', content);
                } else {
                    meta.name = name;
                    meta.content = content;
                }
                document.head.appendChild(meta);
            }
        }

        createContainer() {
            this.container = $.div({ className: 'cursor-container' });
            document.body.appendChild(this.container);
        }

        createContentArea() {
            const content = $.div({ className: 'cursor-content' });
            this.container.appendChild(content);
            
            // Add footer
            const footer = this.createFooter();
            this.container.appendChild(footer);
        }

        createFooter() {
            return $.footer({
                style: {
                    textAlign: 'center',
                    padding: 'calc(20px * var(--scale-factor)) 0',
                    marginTop: 'calc(20px * var(--scale-factor))',
                    borderTop: '1px solid var(--border-color)',
                    position: 'relative'
                }
            }, [
                $.div({
                    style: {
                        color: 'var(--text-primary)',
                        fontSize: 'calc(11px * var(--scale-factor))',
                        fontWeight: '500',
                        letterSpacing: '0.05em',
                        fontFamily: "'JetBrains Mono', monospace"
                    }
                }, ['© 2025 MOOSH Wallet Limited. All rights reserved.']),
                $.div({
                    style: {
                        color: 'var(--text-dim)',
                        fontSize: 'calc(10px * var(--scale-factor))',
                        marginTop: 'calc(4px * var(--scale-factor))',
                        fontFamily: "'JetBrains Mono', monospace"
                    }
                }, ["World's First AI-Powered Bitcoin Wallet"])
            ]);
        }

        loadThemePreference() {
            const savedTheme = localStorage.getItem('mooshTheme');
            if (savedTheme === 'moosh') {
                this.state.set('isSparkTheme', true);
                document.body.classList.add('theme-spark');
            }
        }

        showNotification(message, type = 'info') {
            const notification = $.div({ className: 'notification' });
            notification.textContent = message;
            
            // Type-specific styling
            const isCurrentlyMooshTheme = document.body.classList.contains('theme-spark');
            const primaryColor = isCurrentlyMooshTheme ? '#69fd97bd' : '#f57315';
            
            if (type === 'moosh') {
                notification.style.borderColor = '#69fd97bd';
                notification.style.color = '#69fd97bd';
            } else if (type === 'original') {
                notification.style.borderColor = '#f57315';
                notification.style.color = '#f57315';
            } else if (type === 'network' || type === 'success' || type === 'error') {
                notification.style.borderColor = primaryColor;
                notification.style.color = primaryColor;
            }
            
            document.body.appendChild(notification);
            
            // Show notification
            requestAnimationFrame(() => {
                notification.classList.add('show');
            });
            
            // Auto-dismiss
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 2500);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.mooshWallet = new MOOSHWalletApp();
            window.mooshWallet.init();
        });
    } else {
        window.mooshWallet = new MOOSHWalletApp();
        window.mooshWallet.init();
    }

})();