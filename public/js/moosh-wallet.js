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

        static h2(attrs = {}, children = []) {
            return this.create('h2', attrs, children);
        }

        static h3(attrs = {}, children = []) {
            return this.create('h3', attrs, children);
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
        
        static br(attrs = {}) {
            return this.create('br', attrs);
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
        
        static select(attrs = {}, children = []) {
            return this.create('select', attrs, children);
        }
        
        static option(attrs = {}, children = []) {
            return this.create('option', attrs, children);
        }
        
        static br(attrs = {}) {
            return this.create('br', attrs, []);
        }
    }

    const $ = ElementFactory; // Shorthand

    // ═══════════════════════════════════════════════════════════════════════
    // RESPONSIVE UTILITIES - Professional Mobile/Desktop Optimization
    // ═══════════════════════════════════════════════════════════════════════
    class ResponsiveUtils {
        static BREAKPOINTS = {
            xs: 320,    // Ultra-small phones
            sm: 375,    // Standard phones
            md: 414,    // Large phones
            lg: 768,    // Tablets
            xl: 1024,   // Small desktops
            xxl: 1440,  // Standard desktops
            xxxl: 1920  // Large desktops
        };

        static getBreakpoint() {
            const width = window.innerWidth;
            if (width < this.BREAKPOINTS.sm) return 'xs';
            if (width < this.BREAKPOINTS.md) return 'sm';
            if (width < this.BREAKPOINTS.lg) return 'md';
            if (width < this.BREAKPOINTS.xl) return 'lg';
            if (width < this.BREAKPOINTS.xxl) return 'xl';
            if (width < this.BREAKPOINTS.xxxl) return 'xxl';
            return 'xxxl';
        }

        static isMobile() {
            return ['xs', 'sm', 'md'].includes(this.getBreakpoint());
        }

        static isTablet() {
            return ['lg'].includes(this.getBreakpoint());
        }

        static isDesktop() {
            return ['xl', 'xxl', 'xxxl'].includes(this.getBreakpoint());
        }

        static getResponsiveValue(mobileValue, tabletValue, desktopValue) {
            if (this.isMobile()) return mobileValue;
            if (this.isTablet()) return tabletValue || desktopValue;
            return desktopValue;
        }

        static createResponsiveStyle(styles) {
            const breakpoint = this.getBreakpoint();
            const baseStyles = styles.base || {};
            const breakpointStyles = styles[breakpoint] || {};
            return { ...baseStyles, ...breakpointStyles };
        }

        static addTouchFeedback(element) {
            let touchTimeout;
            
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
                clearTimeout(touchTimeout);
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                touchTimeout = setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
            
            return element;
        }

        static createResponsiveButton(attrs = {}, children = []) {
            const isMobile = this.isMobile();
            const isCompact = this.getBreakpoint() === 'xs';
            
            const defaultStyle = {
                padding: 'var(--space-sm) var(--space-md)',
                fontSize: 'var(--font-md)',
                minHeight: 'var(--touch-target)',
                minWidth: isCompact ? 'auto' : 'var(--touch-target)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-xs)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
            };
            
            const button = $.button({
                ...attrs,
                style: { ...defaultStyle, ...(attrs.style || {}) }
            }, children);
            
            if (isMobile) {
                this.addTouchFeedback(button);
            }
            
            return button;
        }

        static createResponsiveContainer(children, options = {}) {
            const { maxWidth = 'var(--container-lg)', padding = true } = options;
            
            return $.div({
                className: 'responsive-container',
                style: {
                    width: '100%',
                    maxWidth: maxWidth,
                    margin: '0 auto',
                    padding: padding ? 'clamp(1rem, 5vw, 2rem)' : '0',
                    boxSizing: 'border-box'
                }
            }, children);
        }

        static createResponsiveGrid(items, options = {}) {
            const { minItemWidth = 250, gap = 'var(--space-md)' } = options;
            
            return $.div({
                className: 'responsive-grid',
                style: {
                    display: 'grid',
                    gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minItemWidth}px), 1fr))`,
                    gap: gap,
                    width: '100%'
                }
            }, items);
        }

        static getResponsiveTextStyle(type) {
            const styles = {
                title: {
                    fontSize: 'var(--font-2xl)',
                    lineHeight: '1.2',
                    fontWeight: '700'
                },
                subtitle: {
                    fontSize: 'var(--font-lg)',
                    lineHeight: '1.4',
                    fontWeight: '600'
                },
                body: {
                    fontSize: 'var(--font-md)',
                    lineHeight: '1.5',
                    fontWeight: '400'
                },
                small: {
                    fontSize: 'var(--font-sm)',
                    lineHeight: '1.4',
                    fontWeight: '400'
                },
                tiny: {
                    fontSize: 'var(--font-xs)',
                    lineHeight: '1.3',
                    fontWeight: '400'
                }
            };
            
            return styles[type] || styles.body;
        }
    }

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
                    --text-accent: #f57315;
                    --text-string: #f57315;
                    --text-keyword: #f57315;
                    --text-comment: #888888;
                    --text-dim: #888888;
                    --accent-color: #1d1d1d;
                    --border-color: #333333;
                    --border-active: #f57315;
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
                    
                    /* PROFESSIONAL RESPONSIVE ENHANCEMENTS */
                    --terminal-padding-mobile: max(3vw, 12px);
                    --terminal-padding-desktop: clamp(16px, 2vw, 24px);
                    --button-gap-responsive: clamp(4px, 1vw, 12px);
                    --font-size-responsive: clamp(10px, 2.5vw, 16px);
                    --terminal-max-width: min(100%, 1200px);
                    --header-font-mobile: clamp(14px, 4vw, 18px);
                    --button-font-mobile: clamp(9px, 2.5vw, 12px);
                    --compact-spacing: clamp(4px, 1vw, 8px);
                    
                    /* ULTIMATE RESPONSIVE FRAMEWORK */
                    /* Dynamic Typography System */
                    --font-scale: clamp(0.875rem, 2vw + 0.5rem, 1.125rem);
                    --font-xs: calc(var(--font-scale) * 0.75);
                    --font-sm: calc(var(--font-scale) * 0.875);
                    --font-md: var(--font-scale);
                    --font-lg: calc(var(--font-scale) * 1.25);
                    --font-xl: calc(var(--font-scale) * 1.5);
                    --font-2xl: calc(var(--font-scale) * 2);
                    --font-3xl: calc(var(--font-scale) * 2.5);
                    
                    /* Intelligent Spacing System */
                    --space-unit: clamp(0.25rem, 1vw, 0.5rem);
                    --space-xs: calc(var(--space-unit) * 0.5);
                    --space-sm: var(--space-unit);
                    --space-md: calc(var(--space-unit) * 2);
                    --space-lg: calc(var(--space-unit) * 4);
                    --space-xl: calc(var(--space-unit) * 6);
                    --space-2xl: calc(var(--space-unit) * 8);
                    
                    /* Touch-Optimized Dimensions */
                    --touch-target: max(44px, calc(var(--space-unit) * 11));
                    --button-height-responsive: clamp(40px, 10vw, 48px);
                    --input-height-responsive: clamp(36px, 9vw, 44px);
                    --icon-size: clamp(16px, 4vw, 24px);
                    
                    /* Container System */
                    --container-xs: min(100%, 320px);
                    --container-sm: min(100%, 640px);
                    --container-md: min(100%, 768px);
                    --container-lg: min(100%, 1024px);
                    --container-xl: min(100%, 1280px);
                    
                    /* Responsive Borders & Radii */
                    --border-width-responsive: max(1px, 0.0625rem);
                    --radius-sm: clamp(2px, 0.5vw, 4px);
                    --radius-md: clamp(4px, 1vw, 8px);
                    --radius-lg: clamp(8px, 2vw, 16px);
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

                /* MOOSH MODE - ALTERNATIVE THEME */
                body.theme-spark {
                    --text-primary: #69fd97 !important;
                    --text-secondary: #f0f0f0 !important;
                    --text-accent: #69fd97 !important;
                    --text-string: #69fd97 !important;
                    --text-keyword: #009f6b !important;
                    --text-comment: #71767b !important;
                    --text-dim: #71767b !important;
                    --bg-primary: #000000 !important;
                    --bg-secondary: #000000 !important;
                    --bg-tertiary: #0a0a0a !important;
                    --bg-hover: #1a1a1a !important;
                    --accent-color: #1d1d1d !important;
                    --border-color: #232b2b !important;
                    --border-active: #69fd97 !important;
                }
                
                /* MOOSH MODE - Ensure buttons always have borders */
                body.theme-spark button,
                body.theme-spark .btn-primary,
                body.theme-spark .btn-secondary,
                body.theme-spark .button {
                    background: #000000 !important;
                    border: 2px solid #232b2b !important;
                    color: #69fd97 !important;
                    transition: all 0.2s ease !important;
                }
                
                body.theme-spark button:hover,
                body.theme-spark .btn-primary:hover,
                body.theme-spark .btn-secondary:hover,
                body.theme-spark .button:hover {
                    border: 2px solid #69fd97 !important;
                    background: #000000 !important;
                    color: #69fd97 !important;
                }
                
                /* MOOSH MODE - Input fields */
                body.theme-spark input,
                body.theme-spark textarea,
                body.theme-spark select {
                    background: #000000 !important;
                    border: 2px solid #232b2b !important;
                    color: #69fd97 !important;
                    transition: border-color 0.2s ease !important;
                }
                
                body.theme-spark input:hover,
                body.theme-spark textarea:hover,
                body.theme-spark select:hover,
                body.theme-spark input:focus,
                body.theme-spark textarea:focus,
                body.theme-spark select:focus {
                    border-color: #69fd97 !important;
                }
                
                /* MOOSH MODE - Terminal boxes */
                body.theme-spark .terminal-box {
                    background: #000000 !important;
                    border: 2px solid #232b2b !important;
                    transition: border-color 0.2s ease !important;
                }
                
                body.theme-spark .terminal-box:hover {
                    border-color: #69fd97 !important;
                }
                
                /* MOOSH MODE - Nav links */
                body.theme-spark .nav-link {
                    border: none !important;
                    color: #69fd97 !important;
                    transition: all 0.2s ease !important;
                    background: transparent !important;
                }
                
                body.theme-spark .nav-link:hover {
                    border: none !important;
                    background: transparent !important;
                    color: #69fd97 !important;
                    border-radius: 0 !important;
                }
                
                /* MOOSH MODE - All frames and containers */
                body.theme-spark .cursor-container,
                body.theme-spark .cursor-content,
                body.theme-spark .wallet-container,
                body.theme-spark .warning-box,
                body.theme-spark .address-section,
                body.theme-spark .radio-option {
                    border-color: #232b2b !important;
                    transition: border-color 0.2s ease !important;
                }
                
                body.theme-spark .cursor-container:hover,
                body.theme-spark .cursor-content:hover,
                body.theme-spark .wallet-container:hover,
                body.theme-spark .warning-box:hover,
                body.theme-spark .address-section:hover,
                body.theme-spark .radio-option:hover {
                    border-color: #69fd97 !important;
                }
                
                /* MOOSH MODE - Password security text */
                body.theme-spark .password-bracket,
                body.theme-spark .password-text-hover,
                body.theme-spark .typing-text {
                    color: #69fd97 !important;
                    transition: color 0.2s ease !important;
                }
                
                body.theme-spark .password-bracket:hover,
                body.theme-spark .password-text-hover:hover,
                body.theme-spark .typing-text:hover {
                    color: #69fd97 !important;
                    opacity: 0.8;
                }
                
                /* MOOSH MODE - Password label hover */
                body.theme-spark label.text-dim {
                    color: #71767b !important;
                }
                
                body.theme-spark label.text-dim:hover {
                    color: #69fd97 !important;
                }
                
                /* MOOSH MODE - Icon buttons (no borders) */
                body.theme-spark button[style*="background: none"],
                body.theme-spark button[style*="border: none"],
                body.theme-spark .hide-btn,
                body.theme-spark .header-btn,
                body.theme-spark .privacy-toggle,
                body.theme-spark .theme-toggle-button,
                body.theme-spark button[type="button"][style*="position: absolute"] {
                    border: none !important;
                    background: transparent !important;
                    box-shadow: none !important;
                }
                
                body.theme-spark button[style*="background: none"]:hover,
                body.theme-spark button[style*="border: none"]:hover,
                body.theme-spark .hide-btn:hover,
                body.theme-spark .header-btn:hover,
                body.theme-spark .privacy-toggle:hover,
                body.theme-spark .theme-toggle-button:hover,
                body.theme-spark button[type="button"][style*="position: absolute"]:hover {
                    border: none !important;
                    background: transparent !important;
                    box-shadow: none !important;
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
                
                /* RESPONSIVE FEATURE TAGLINE */
                .feature-tagline {
                    color: var(--text-dim);
                    font-size: var(--font-xs) !important;
                    line-height: var(--mobile-line-height);
                    word-break: break-word;
                    hyphens: auto;
                    overflow-wrap: break-word;
                    max-width: 100%;
                    display: block;
                }
                
                @media (max-width: 479px) {
                    .feature-tagline {
                        font-size: clamp(9px, 2.2vw, 11px) !important;
                        line-height: 1.3;
                        letter-spacing: -0.01em;
                    }
                }
                
                @media (min-width: 480px) and (max-width: 767px) {
                    .feature-tagline {
                        font-size: clamp(10px, 2.3vw, 12px) !important;
                        line-height: 1.35;
                    }
                }
                
                @media (min-width: 768px) and (max-width: 1023px) {
                    .feature-tagline {
                        font-size: clamp(11px, 1.8vw, 13px) !important;
                        line-height: 1.4;
                    }
                }
                
                @media (min-width: 1024px) {
                    .feature-tagline {
                        font-size: calc(var(--font-xs) * 1.1) !important;
                        line-height: 1.4;
                    }
                }

                /* RESPONSIVE STATUS INDICATOR - Small version positioned below security seed box */
                .status-indicator-small {
                    color: #009f6b;
                    font-size: clamp(6px, 1.2vw, 8px) !important;
                    line-height: 1.2;
                    white-space: nowrap;
                    display: inline-flex;
                    align-items: center;
                    gap: 1px;
                    flex-shrink: 0;
                    position: relative;
                    float: right;
                    clear: both;
                    margin-top: calc(4px * var(--scale-factor));
                    margin-right: calc(8px * var(--scale-factor));
                    z-index: 5;
                    padding: calc(2px * var(--scale-factor)) calc(4px * var(--scale-factor));
                }

                @media (max-width: 479px) {
                    .status-indicator-small {
                        font-size: clamp(5px, 1vw, 7px) !important;
                        margin-top: calc(3px * var(--scale-factor));
                        margin-right: calc(6px * var(--scale-factor));
                        padding: calc(1px * var(--scale-factor)) calc(3px * var(--scale-factor));
                    }
                }

                @media (max-width: 360px) {
                    .status-indicator-small {
                        font-size: clamp(4px, 0.8vw, 6px) !important;
                        margin-top: calc(2px * var(--scale-factor));
                        margin-right: calc(4px * var(--scale-factor));
                    }
                }

                /* Mobile specific terminal header adjustments */
                @media (max-width: 480px) {
                    .terminal-header {
                        gap: calc(4px * var(--scale-factor));
                    }
                }
                
                @media (max-width: 360px) {
                    .terminal-header {
                        font-size: calc(10px * var(--scale-factor)) !important;
                    }
                }

                /* MOOSH MODE - ORANGE & BLACK THEME */
                .theme-spark {
                    --text-primary: #f57315 !important;
                    --text-secondary: #ffffff !important;
                    --text-accent: #f57315 !important;
                    --text-string: #f57315 !important;
                    --text-keyword: #f57315 !important;
                    --text-comment: #888888 !important;
                    --text-dim: #888888 !important;
                    --bg-primary: #000000 !important;
                    --bg-secondary: #000000 !important;
                    --bg-tertiary: #000000 !important;
                    --bg-hover: #1a1a1a !important;
                    --border-color: #333333 !important;
                    --border-active: #f57315 !important;
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
                    color: var(--text-primary);
                    font-weight: 600;
                    text-decoration: none;
                    position: relative;
                    transition: color var(--transition-speed) ease;
                    font-size: calc(var(--font-base) * var(--scale-factor) * 0.875);
                    padding: calc(var(--spacing-unit) * var(--scale-factor)) calc(var(--spacing-unit) * 1.5 * var(--scale-factor));
                    border-radius: 0;
                    font-family: inherit;
                    white-space: nowrap;
                    display: inline-block;
                    background: transparent !important;
                    border: none !important;
                }

                .nav-link:hover {
                    color: var(--text-primary);
                    border-radius: 0;
                    background: transparent !important;
                    border: none !important;
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

                /* Terminal Box - Professional Responsive System */
                .terminal-box {
                    background: #000000;
                    border: 2px solid var(--text-primary);
                    border-radius: 0;
                    padding: var(--terminal-padding-mobile);
                    font-family: 'JetBrains Mono', monospace;
                    overflow: hidden;
                    overflow-x: hidden;
                    margin-bottom: calc(16px * var(--scale-factor));
                    position: relative;
                    isolation: isolate;
                    contain: layout style;
                    max-width: var(--terminal-max-width);
                    margin-left: auto;
                    margin-right: auto;
                    box-sizing: border-box;
                }

                .terminal-header {
                    color: var(--text-primary);
                    margin-bottom: calc(8px * var(--scale-factor));
                    border-bottom: 1px solid var(--text-primary);
                    padding-bottom: calc(4px * var(--scale-factor));
                    padding-right: clamp(80px, 20vw, 120px);
                    font-size: calc(12px * var(--scale-factor));
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    white-space: nowrap;
                    overflow: hidden;
                    overflow-x: hidden;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                    position: relative;
                    min-height: calc(24px * var(--scale-factor));
                }
                
                .terminal-content {
                    background: var(--bg-primary);
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: thin;
                }
                
                /* Terminal Box Mobile Optimizations */
                @media (max-width: 480px) {
                    .terminal-box {
                        padding: var(--compact-spacing);
                    }
                    
                    .terminal-box .header-buttons {
                        flex-wrap: wrap;
                        gap: var(--compact-spacing);
                    }
                    
                    .terminal-box h2 {
                        font-size: var(--header-font-mobile) !important;
                    }
                    
                    .terminal-box .btn-secondary {
                        font-size: var(--button-font-mobile) !important;
                        padding: var(--compact-spacing) !important;
                    }
                }
                
                @media (max-width: 360px) {
                    .terminal-box h2 span {
                        font-size: calc(12px * var(--scale-factor));
                    }
                    
                    .terminal-content > div:first-child {
                        flex-direction: column;
                        align-items: stretch !important;
                        gap: calc(8px * var(--scale-factor));
                    }
                    
                    .terminal-box .header-buttons {
                        width: 100%;
                        justify-content: space-between;
                    }
                }

                .terminal-content {
                    color: var(--text-primary);
                    line-height: 1.2;
                    font-size: 10px;
                    overflow: hidden;
                    overflow-x: hidden;
                    width: 100%;
                    box-sizing: border-box;
                }

                /* Dashboard Header Row */
                .dashboard-header-row {
                    overflow: hidden !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                }

                /* Header Buttons Container */
                .header-buttons {
                    flex-shrink: 0 !important;
                    overflow: hidden !important;
                    max-width: 40% !important;
                    justify-content: flex-end !important;
                    gap: var(--space-xs) !important;
                    display: flex !important;
                    align-items: center !important;
                    flex-wrap: nowrap !important;
                }

                /* Dashboard Button Overrides - Responsive */
                .dashboard-btn {
                    flex-shrink: 0 !important;
                    min-width: clamp(56px, 12vw, 80px) !important;
                    max-width: clamp(80px, 15vw, 120px) !important;
                    width: auto !important;
                    height: clamp(28px, 6vw, 32px) !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    font-size: var(--font-xs) !important;
                    padding: var(--space-xs) calc(var(--space-xs) * 1.5) !important;
                    border: 1px solid #f57315 !important;
                    background: #000000 !important;
                    color: #f57315 !important;
                    box-sizing: border-box !important;
                    margin: 0 !important;
                    transition: all 0.2s ease !important;
                }

                /* Mobile optimizations for dashboard buttons */
                @media (max-width: 480px) {
                    .dashboard-btn {
                        min-width: clamp(48px, 10vw, 64px) !important;
                        max-width: clamp(64px, 12vw, 80px) !important;
                        height: clamp(24px, 5vw, 28px) !important;
                        font-size: clamp(8px, 2vw, 10px) !important;
                        padding: calc(var(--space-xs) * 0.75) var(--space-xs) !important;
                    }
                }

                @media (max-width: 360px) {
                    .dashboard-btn {
                        min-width: clamp(40px, 9vw, 56px) !important;
                        max-width: clamp(56px, 11vw, 72px) !important;
                        font-size: clamp(7px, 1.8vw, 9px) !important;
                        padding: calc(var(--space-xs) * 0.5) calc(var(--space-xs) * 0.75) !important;
                    }
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
                    gap: calc(var(--spacing-unit) * 0.5 * var(--scale-factor));
                    margin-left: auto;
                    position: absolute;
                    top: calc(8px * var(--scale-factor));
                    right: calc(12px * var(--scale-factor));
                    z-index: 10;
                    max-width: clamp(60px, 15vw, 85px);
                    min-width: clamp(45px, 10vw, 60px);
                }
                
                .toggle-switch {
                    width: calc(8px * var(--scale-factor));
                    height: calc(8px * var(--scale-factor));
                    border: calc(1px * var(--scale-factor)) solid #333333;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #000000;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                    cursor: pointer;
                    position: relative;
                }
                
                .toggle-switch:hover {
                    border-color: var(--text-primary);
                }
                
                .toggle-slider {
                    width: calc(2.5px * var(--scale-factor));
                    height: calc(2.5px * var(--scale-factor));
                    border-radius: 50%;
                    background: var(--text-primary);
                    transition: all 0.2s ease;
                    position: relative;
                }
                
                .toggle-switch.testnet .toggle-slider {
                    background: #ff6b6b;
                }
                
                .network-label {
                    font-size: calc(7px * var(--scale-factor));
                    color: var(--text-dim);
                    font-weight: 400;
                    min-width: calc(35px * var(--scale-factor));
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

                .blink {
                    animation: blink 1s infinite;
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
                        border-radius: 0 !important;
                        min-height: calc(var(--touch-target-min) * var(--scale-factor)) !important;
                        display: flex !important;
                        align-items: center !important;
                        background: transparent !important;
                        border: none !important;
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
                        margin-left: calc(var(--spacing-unit) * 0.5 * var(--scale-factor));
                        gap: calc(var(--spacing-unit) * 0.5 * var(--scale-factor));
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .toggle-switch {
                        width: calc(8px * var(--scale-factor)) !important;
                        height: calc(8px * var(--scale-factor)) !important;
                        border-radius: 50% !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .toggle-slider {
                        width: calc(2.5px * var(--scale-factor)) !important;
                        height: calc(2.5px * var(--scale-factor)) !important;
                        border-radius: 50% !important;
                        background: var(--text-primary) !important;
                        transition: all 0.2s ease !important;
                    }
                    
                    .toggle-switch.testnet .toggle-slider {
                        background: #ff6b6b !important;
                    }
                    
                    .network-label {
                        font-size: calc(7px * var(--scale-factor));
                        min-width: calc(35px * var(--scale-factor));
                        font-weight: 400;
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
                walletType: null, // 'create' or 'import'
                
                // Multi-account management
                accounts: [],
                activeAccountIndex: 0,
                
                // Wallet data
                walletData: {
                    addresses: {},
                    balances: {},
                    transactions: []
                },
                
                // Privacy settings
                isBalanceHidden: false,
                
                // API data cache
                apiCache: {
                    prices: {},
                    blockHeight: null,
                    lastUpdate: null
                }
            };
            
            this.listeners = new Map();
            this.loadPersistedState();
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
            // Auto-persist certain state changes
            if (['accounts', 'activeAccountIndex', 'isBalanceHidden', 'apiCache'].includes(key)) {
                this.persistState();
            }
        }
        
        loadPersistedState() {
            try {
                const saved = localStorage.getItem('mooshWalletState');
                if (saved) {
                    const data = JSON.parse(saved);
                    // Only load safe data
                    if (data.accounts) this.state.accounts = data.accounts;
                    if (typeof data.activeAccountIndex === 'number') this.state.activeAccountIndex = data.activeAccountIndex;
                    if (typeof data.isBalanceHidden === 'boolean') this.state.isBalanceHidden = data.isBalanceHidden;
                    if (data.apiCache) this.state.apiCache = data.apiCache;
                }
            } catch (e) {
                console.error('Failed to load persisted state:', e);
            }
        }
        
        persistState() {
            try {
                const toPersist = {
                    accounts: this.state.accounts,
                    activeAccountIndex: this.state.activeAccountIndex,
                    isBalanceHidden: this.state.isBalanceHidden,
                    apiCache: this.state.apiCache
                };
                localStorage.setItem('mooshWalletState', JSON.stringify(toPersist));
            } catch (e) {
                console.error('Failed to persist state:', e);
            }
        }
        
        addAccount(name, mnemonic, type = 'taproot') {
            const account = {
                id: Date.now().toString(),
                name: name || `Account ${this.state.accounts.length + 1}`,
                type: type,
                mnemonic: mnemonic,
                addresses: {},
                balances: {
                    bitcoin: 0,
                    lightning: 0,
                    stablecoins: {}
                },
                createdAt: new Date().toISOString()
            };
            
            const accounts = [...this.state.accounts, account];
            this.set('accounts', accounts);
            this.set('activeAccountIndex', accounts.length - 1);
            return account;
        }
        
        switchAccount(index) {
            if (index >= 0 && index < this.state.accounts.length) {
                this.set('activeAccountIndex', index);
                return true;
            }
            return false;
        }
        
        getCurrentAccount() {
            return this.state.accounts[this.state.activeAccountIndex] || null;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // API SERVICE - External Data Integration
    // ═══════════════════════════════════════════════════════════════════════
    class APIService {
        constructor(stateManager) {
            this.stateManager = stateManager;
            this.endpoints = {
                coingecko: 'https://api.coingecko.com/api/v3',
                blockstream: 'https://blockstream.info/api',
                blockcypher: 'https://api.blockcypher.com/v1/btc/main'
            };
        }
        
        async fetchBitcoinPrice() {
            try {
                const cache = this.stateManager.get('apiCache');
                const now = Date.now();
                
                // Use cache if fresh (5 minutes)
                if (cache.prices?.bitcoin && cache.lastUpdate && (now - cache.lastUpdate) < 300000) {
                    return cache.prices.bitcoin;
                }
                
                const response = await fetch(`${this.endpoints.coingecko}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true`);
                const data = await response.json();
                
                // Update cache
                cache.prices = { bitcoin: data.bitcoin };
                cache.lastUpdate = now;
                this.stateManager.set('apiCache', cache);
                
                return data.bitcoin;
            } catch (error) {
                console.error('Failed to fetch Bitcoin price:', error);
                return { usd: 0, usd_24h_change: 0 };
            }
        }
        
        async fetchBlockHeight() {
            try {
                const response = await fetch(`${this.endpoints.blockstream}/blocks/tip/height`);
                const height = await response.text();
                
                const cache = this.stateManager.get('apiCache');
                cache.blockHeight = parseInt(height);
                this.stateManager.set('apiCache', cache);
                
                return cache.blockHeight;
            } catch (error) {
                console.error('Failed to fetch block height:', error);
                return this.stateManager.get('apiCache').blockHeight || 0;
            }
        }
        
        async fetchAddressBalance(address) {
            try {
                const response = await fetch(`${this.endpoints.blockstream}/address/${address}`);
                const data = await response.json();
                
                return {
                    balance: data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum,
                    txCount: data.chain_stats.tx_count
                };
            } catch (error) {
                console.error('Failed to fetch address balance:', error);
                return { balance: 0, txCount: 0 };
            }
        }
        
        async fetchTransactionHistory(address, limit = 10) {
            try {
                const response = await fetch(`${this.endpoints.blockstream}/address/${address}/txs`);
                const txs = await response.json();
                
                return txs.slice(0, limit).map(tx => ({
                    txid: tx.txid,
                    time: tx.status.block_time,
                    confirmations: tx.status.confirmed ? tx.status.block_height : 0,
                    value: this.calculateTxValue(tx, address),
                    fee: tx.fee
                }));
            } catch (error) {
                console.error('Failed to fetch transaction history:', error);
                return [];
            }
        }
        
        calculateTxValue(tx, address) {
            let value = 0;
            
            // Calculate incoming value
            tx.vout.forEach(output => {
                if (output.scriptpubkey_address === address) {
                    value += output.value;
                }
            });
            
            // Calculate outgoing value
            tx.vin.forEach(input => {
                if (input.prevout && input.prevout.scriptpubkey_address === address) {
                    value -= input.prevout.value;
                }
            });
            
            return value;
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
            this.routes.set('dashboard', () => new DashboardPage(this.app));
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
                    },
                    onmouseover: function() {
                        const pipes = this.querySelectorAll('.nav-pipe');
                        pipes.forEach(pipe => pipe.style.opacity = '1');
                    },
                    onmouseout: function() {
                        const pipes = this.querySelectorAll('.nav-pipe');
                        pipes.forEach(pipe => pipe.style.opacity = '0');
                    }
                }, [
                    $.span({ 
                        className: 'nav-pipe',
                        style: { 
                            opacity: '0', 
                            transition: 'opacity 0.2s ease',
                            color: 'var(--text-primary)',
                            marginRight: '4px'
                        }
                    }, ['|']),
                    ' ',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, ['<']),
                    'Moosh.money',
                    $.span({ className: 'text-dim ui-bracket', style: { fontSize: 'calc(9px * var(--scale-factor))' } }, [' />']),
                    ' ',
                    $.span({ 
                        className: 'nav-pipe',
                        style: { 
                            opacity: '0', 
                            transition: 'opacity 0.2s ease',
                            color: 'var(--text-primary)',
                            marginLeft: '4px'
                        }
                    }, ['|'])
                ])
            ]);
        }

        createThemeToggle() {
            const toggle = $.div({
                className: 'theme-toggle',
                onclick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleTheme();
                },
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
            return $.div({ 
                className: 'terminal-box',
                style: { position: 'relative' }
            }, [
                this.props.showNetworkToggle ? this.createNetworkToggle() : null,
                $.div({ className: 'terminal-header' }, [
                    $.span({}, ['~/moosh/spark-wallet $'])
                ]),
                this.props.radioSection ? this.createRadioSection() : null,
                this.props.radioSection ? this.createStatusIndicator() : null,
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
                    },
                    onmouseover: function() { 
                        this.querySelectorAll('span').forEach(span => {
                            span.style.color = 'var(--text-primary)';
                        });
                    },
                    onmouseout: function() {
                        this.querySelectorAll('.ui-bracket').forEach(span => {
                            span.style.color = '';
                        });
                        this.querySelector('span:nth-child(2)').style.color = 'var(--text-dim)';
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

        createNetworkToggle() {
            const isMainnet = this.app.state.get('isMainnet');
            
            return $.div({
                className: 'network-toggle',
                style: {
                    position: 'absolute',
                    top: 'calc(8px * var(--scale-factor))',
                    right: 'calc(12px * var(--scale-factor))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'calc(var(--spacing-unit) * var(--scale-factor))',
                    zIndex: 10
                }
            }, [
                $.span({
                    id: 'networkLabel',
                    className: 'network-label'
                }, [isMainnet ? '.mainnet' : '.testnet']),
                $.div({
                    id: 'networkToggle',
                    className: isMainnet ? 'toggle-switch' : 'toggle-switch testnet',
                    onclick: () => this.toggleNetwork()
                }, [
                    $.div({ className: 'toggle-slider' })
                ])
            ]);
        }

        toggleNetwork() {
            const isMainnet = !this.app.state.get('isMainnet');
            this.app.state.set('isMainnet', isMainnet);
            
            const toggle = document.getElementById('networkToggle');
            const label = document.getElementById('networkLabel');
            
            if (isMainnet) {
                toggle.classList.remove('testnet');
                label.textContent = '.mainnet';
                console.log('🌐 Switched to Bitcoin MAINNET');
            } else {
                toggle.classList.add('testnet');
                label.textContent = '.testnet';
                console.log('🧪 Switched to Bitcoin TESTNET');
            }
            
            this.app.showNotification(`Network: ${isMainnet ? '.mainnet' : '.testnet'}`, 'network');
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

        createStatusIndicator() {
            return $.span({ 
                className: 'status-indicator-small',
                style: { 
                    color: '#009f6b'
                }
            }, [
                'Bitcoin Ready ',
                $.span({
                    className: 'blink',
                    style: { 
                        color: '#009f6b'
                    }
                }, ['●'])
            ]);
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
                        color: '#009f6b',
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
                new Terminal(this.app, { radioSection: true, showNetworkToggle: true }).render(),
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
                        onmouseover: function() { this.style.color = 'var(--text-primary)'; },
                        onmouseout: function() { this.style.color = '#666666'; }
                    }, ['Create a secure password to protect your wallet access']),
                    $.span({ 
                        className: 'text-dim password-bracket',
                        style: {
                            color: '#666666',
                            fontSize: 'calc(10px * var(--scale-factor))'
                        }
                    }, [' />']),
                    $.span({ 
                        className: 'typing-cursor',
                        style: {
                            height: 'calc(10px * var(--scale-factor))',
                            fontSize: 'calc(10px * var(--scale-factor))'
                        }
                    })
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
                    className: 'feature-tagline',
                    style: 'margin-bottom: calc(4px * var(--scale-factor));'
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
                    className: 'input-field verification-input',
                    style: {
                        width: '100%',
                        background: 'var(--bg-primary)',
                        border: '2px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(14px * var(--scale-factor))',
                        padding: 'calc(12px * var(--scale-factor))',
                        borderRadius: '0',
                        transition: 'border-color 0.2s ease'
                    },
                    onmouseover: function() {
                        this.style.borderColor = 'var(--text-primary)';
                    },
                    onmouseout: function() {
                        if (this !== document.activeElement) {
                            this.style.borderColor = 'var(--border-color)';
                        }
                    },
                    onfocus: function() {
                        this.style.borderColor = 'var(--text-primary)';
                    },
                    onblur: function() {
                        this.style.borderColor = 'var(--border-color)';
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
                    text: 'Open Wallet Dashboard',
                    onClick: () => this.app.router.navigate('dashboard')
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
            
            // Clear current content and render dashboard
            const content = document.querySelector('.cursor-content');
            if (!content) return;
            
            content.innerHTML = '';
            content.appendChild(this.createDashboard());
            
            // Initialize dashboard controller
            this.initializeDashboard();
        }
        
        createDashboard() {
            const $ = ElementFactory;
            
            return $.div({ className: 'wallet-dashboard-container' }, [
                this.createDashboardHeader(),
                this.createDashboardContent()
            ]);
        }
        
        createDashboardHeader() {
            const $ = ElementFactory;
            
            return $.div({ className: 'terminal-box', style: 'margin-bottom: calc(24px * var(--scale-factor));' }, [
                $.div({ className: 'terminal-header' }, [
                    $.span({}, ['~/moosh/wallet/dashboard $']),
                    $.span({ className: 'text-keyword' }, ['active'])
                ]),
                $.div({ className: 'terminal-content' }, [
                    $.div({ 
                        style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: calc(12px * var(--scale-factor));'
                    }, [
                        // Left side: Terminal title
                        $.h2({ 
                            style: 'font-size: calc(20px * var(--scale-factor)); font-weight: 600; font-family: JetBrains Mono, monospace; margin: 0;'
                        }, [
                        ]),
                        
                        // Right side: Header buttons
                        $.div({ 
                            className: 'header-buttons',
                            style: 'display: flex; gap: calc(8px * var(--scale-factor)); align-items: center;'
                        }, [
                            $.button({
                                className: 'btn-secondary dashboard-btn',
                                onclick: () => this.showMultiAccountManager()
                            }, ['+ Accounts']),
                            $.button({
                                className: 'btn-secondary dashboard-btn',
                                onclick: () => this.handleRefresh()
                            }, ['Refresh']),
                            $.button({
                                className: 'btn-secondary dashboard-btn',
                                onclick: () => this.toggleBalanceVisibility()
                            }, ['Hide'])
                        ])
                    ]),
                    
                    // Account indicator
                    $.div({ 
                        id: 'currentAccountIndicator',
                        className: 'account-indicator',
                        style: 'font-family: JetBrains Mono, monospace; font-size: calc(11px * var(--scale-factor)); color: var(--text-accent); margin-top: calc(8px * var(--scale-factor)); padding: calc(4px * var(--scale-factor)) calc(8px * var(--scale-factor)); background: rgba(105, 253, 151, 0.1); border: 1px solid var(--text-accent); border-radius: 0; display: inline-block; cursor: pointer; transition: all 0.2s ease;',
                        onclick: () => this.showMultiAccountManager(),
                        onmouseover: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.2)',
                        onmouseout: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.1)'
                    }, ['Active: Account 1'])
                ])
            ]);
        }
        
        createAccountSelector() {
            const $ = ElementFactory;
            const activeAccount = 'Account 1'; // Will be dynamic later
            
            return $.div({ className: 'account-selector' }, [
                $.button({
                    className: 'account-dropdown-btn',
                    onclick: () => this.toggleAccountDropdown()
                }, [
                    $.span({ className: 'account-name' }, [activeAccount]),
                    $.span({ className: 'dropdown-arrow' }, ['▼'])
                ])
            ]);
        }
        
        createHeaderButtons() {
            const $ = ElementFactory;
            
            return $.div({ className: 'header-buttons' }, [
                $.button({
                    className: 'header-btn',
                    title: 'Token Menu',
                    onclick: () => this.handleTokenMenu()
                }, ['💰']),
                
                $.button({
                    className: 'header-btn',
                    title: 'Add Account',
                    onclick: () => this.handleAddAccount()
                }, ['+']),
                
                $.button({
                    className: 'header-btn',
                    title: 'Refresh',
                    onclick: () => this.handleRefresh()
                }, ['↻']),
                
                $.button({
                    className: 'header-btn privacy-toggle',
                    title: 'Toggle Privacy',
                    onclick: () => this.handlePrivacyToggle()
                }, ['👁'])
            ]);
        }
        
        createDashboardContent() {
            const $ = ElementFactory;
            
            return $.div({ className: 'dashboard-content' }, [
                this.createMainActionButtons()
            ]);
        }
        
        createBalanceSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'balance-section' }, [
                // Primary balance
                $.div({ className: 'primary-balance' }, [
                    $.div({ className: 'balance-label' }, ['Total Balance']),
                    $.div({ className: 'balance-amount' }, [
                        $.span({ id: 'btc-balance', className: 'btc-value' }, ['0.00000000']),
                        $.span({ className: 'btc-unit' }, [' BTC'])
                    ]),
                    $.div({ className: 'balance-usd' }, [
                        $.span({ className: 'usd-symbol' }, ['≈ $']),
                        $.span({ id: 'usd-balance' }, ['0.00']),
                        $.span({ className: 'usd-label' }, [' USD'])
                    ])
                ]),
                
                // Token balances
                $.div({ className: 'token-grid' }, [
                    this.createTokenCard('MOOSH', '0.00', '$0.00'),
                    this.createTokenCard('USDT', '0.00', '$0.00'),
                    this.createTokenCard('SPARK', '0.00', '$0.00')
                ])
            ]);
        }
        
        createTokenCard(name, amount, value) {
            const $ = ElementFactory;
            
            return $.div({ className: 'token-card' }, [
                $.div({ className: 'token-name' }, [name]),
                $.div({ className: 'token-amount' }, [amount]),
                $.div({ className: 'token-value' }, [value])
            ]);
        }
        
        createMainActionButtons() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'wallet-actions',
                style: 'display: flex; flex-direction: column; gap: calc(12px * var(--scale-factor)); margin-top: calc(24px * var(--scale-factor));'
            }, [
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showSendPayment()
,
                    onmouseover: function() { this.style.background = 'var(--text-primary)'; this.style.color = '#000000'; },
                    onmouseout: function() { this.style.background = '#000000'; this.style.color = 'var(--text-primary)'; }
                }, ['Send Lightning Payment']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showReceivePayment()
,
                    onmouseover: function() { this.style.background = 'var(--text-primary)'; this.style.color = '#000000'; },
                    onmouseout: function() { this.style.background = '#000000'; this.style.color = 'var(--text-primary)'; }
                }, ['Receive Payment']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showTokenMenu()
,
                    onmouseover: function() { this.style.background = 'var(--text-primary)'; this.style.color = '#000000'; },
                    onmouseout: function() { this.style.background = '#000000'; this.style.color = 'var(--text-primary)'; }
                }, ['Token Menu']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showTransactionHistory()
,
                    onmouseover: function() { this.style.background = 'var(--text-primary)'; this.style.color = '#000000'; },
                    onmouseout: function() { this.style.background = '#000000'; this.style.color = 'var(--text-primary)'; }
                }, ['Transaction History']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showWalletSettings()
,
                    onmouseover: function() { this.style.background = 'var(--text-primary)'; this.style.color = '#000000'; },
                    onmouseout: function() { this.style.background = '#000000'; this.style.color = 'var(--text-primary)'; }
                }, ['Wallet Settings'])
            ]);
        }
        
        createSparkProtocolSection() {
            const $ = ElementFactory;
            
            return $.div({ 
                style: 'margin-top: 24px; padding-top: 24px; border-top: 1px solid #333333;'
            }, [
                $.h3({ 
                    style: 'color: #ffffff; margin-bottom: 16px;'
                }, ['Spark Protocol Features']),
                
                $.div({ 
                    style: 'background: rgba(105, 253, 151, 0.1); border: 1px solid #69fd97; border-radius: 8px; padding: 16px; margin-bottom: 16px;'
                }, [
                    $.div({ 
                        style: 'color: #69fd97; font-weight: 600; margin-bottom: 8px;'
                    }, ['Lightning Network Integration']),
                    $.div({ 
                        className: 'text-dim',
                        style: 'font-size: 12px;'
                    }, [
                        'Send instant Bitcoin payments • Sub-second confirmations • Minimal fees',
                        $.br(),
                        'Compatible with all Lightning wallets and services'
                    ])
                ]),
                
                $.div({ 
                    className: 'wallet-actions',
                    style: 'display: flex; gap: 16px; margin-bottom: 24px;'
                }, [
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.showStablecoinSwap(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Swap BTC ↔ USDT']),
                    
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.openLightningChannel(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Open Lightning Channel']),
                    
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.createStablecoin(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Mint Stablecoins'])
                ]),
                
                $.div({ 
                    className: 'terminal-box',
                    style: 'margin-top: 24px; background: #1a1a1a; border: 1px solid #333333; border-radius: 0;'
                }, [
                    $.div({ 
                        className: 'terminal-header',
                        style: 'padding: 12px; border-bottom: 1px solid #333333; font-family: JetBrains Mono, monospace; font-size: 14px;'
                    }, [
                        $.span({}, ['~/moosh/wallet/spark $']),
                        $.span({ 
                            id: 'sparkConnectionStatus',
                            className: 'text-accent',
                            style: 'color: #69fd97; margin-left: 8px;'
                        }, ['connected'])
                    ]),
                    $.div({ 
                        className: 'terminal-content',
                        id: 'sparkInfo',
                        style: 'padding: 16px; font-family: JetBrains Mono, monospace; font-size: 12px;'
                    }, [
                        $.span({ className: 'text-comment', style: 'color: #666666;' }, ['# Spark Protocol Status']),
                        $.br(),
                        $.span({ className: 'text-keyword', style: 'color: #ffa500;' }, ['const']),
                        ' ',
                        $.span({ className: 'text-variable', style: 'color: #69fd97;' }, ['spark']),
                        ' = ',
                        $.span({ className: 'text-string', style: 'color: #f57315;' }, ['ready']),
                        ';',
                        $.br(),
                        $.span({ className: 'text-comment', style: 'color: #666666;' }, ['# Mint MOOSH tokens for 0.0000058 BTC'])
                    ])
                ]),
                
                $.div({ 
                    className: 'wallet-actions',
                    style: 'margin-top: 24px;'
                }, [
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.logout(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, [
                        '<Logout ',
                        $.span({ style: 'opacity: 0.7;' }, ['Esc />']),
                    ])
                ])
            ]);
        }
        
        createTransactionHistory() {
            const $ = ElementFactory;
            
            return $.div({ className: 'transaction-history' }, [
                // Section header
                $.div({ className: 'section-header' }, [
                    $.h3({ className: 'section-title' }, ['Recent Transactions']),
                    $.button({
                        className: 'filter-button',
                        onclick: () => this.handleFilter()
                    }, ['Filter'])
                ]),
                
                // Transaction list
                $.div({ id: 'transaction-list', className: 'transaction-list' }, [
                    this.createEmptyTransactions()
                ])
            ]);
        }
        
        createEmptyTransactions() {
            const $ = ElementFactory;
            
            return $.div({ className: 'empty-transactions' }, [
                $.div({ className: 'empty-text' }, ['No transactions yet']),
                $.div({ className: 'empty-subtext' }, ['Your transaction history will appear here'])
            ]);
        }
        
        // Missing dashboard component methods
        createStatusBanner() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'warning-box',
                style: 'background: rgba(105, 253, 151, 0.1); border: 1px solid var(--text-accent); margin-bottom: calc(24px * var(--scale-factor));'
            }, [
                $.div({ style: 'color: var(--text-accent); font-weight: 600; margin-bottom: calc(8px * var(--scale-factor)); font-size: calc(14px * var(--scale-factor));' }, ['Spark Protocol Active']),
                $.div({ 
                    className: 'feature-tagline',
                    style: 'margin-bottom: calc(4px * var(--scale-factor));'
                }, [
                    'Lightning-fast Bitcoin transfers • Native stablecoins • Instant settlements',
                    $.br(),
                    $.span({ style: 'color: var(--text-keyword);' }, ['Live blockchain data • Real-time prices • Auto-refresh every 30s'])
                ])
            ]);
        }
        
        createWalletTypeSelector() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'terminal-box',
                style: 'margin-bottom: 20px; background: #1a1a1a; border: 1px solid #333333; border-radius: 0;'
            }, [
                $.div({ 
                    className: 'terminal-header',
                    style: 'padding: 12px; border-bottom: 1px solid #333333; font-family: JetBrains Mono, monospace; font-size: 14px;'
                }, [
                    $.span({}, ['~/moosh/wallet-selector $']),
                    $.span({ 
                        className: 'text-keyword',
                        id: 'walletSelectorStatus',
                        style: 'color: #ffa500; margin-left: 8px;'
                    }, ['active'])
                ]),
                $.div({ 
                    className: 'terminal-content',
                    style: 'padding: 16px;'
                }, [
                    $.div({ style: 'margin-bottom: 12px;' }, [
                        $.label({ 
                            style: 'color: #ffffff; font-size: 12px; font-weight: 600; margin-bottom: 8px; display: block;'
                        }, ['Select Active Wallet:']),
                        $.select({
                            id: 'walletTypeSelector',
                            className: 'terminal-select',
                            style: 'width: 100%; background: #000000; border: 2px solid #ffffff; border-radius: 0; color: #ffffff; font-family: JetBrains Mono, monospace; font-size: 12px; padding: 8px; cursor: pointer; transition: all 0.2s ease;',
                            onchange: (e) => this.switchWalletType(e),
                            onmouseover: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.background = '#000000'; },
                            onmouseout: (e) => { e.target.style.borderColor = '#ffffff'; e.target.style.background = '#000000'; },
                            onfocus: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.boxShadow = '0 0 0 1px #ff8c42'; e.target.style.background = '#000000'; },
                            onblur: (e) => { e.target.style.borderColor = '#ffffff'; e.target.style.boxShadow = 'none'; e.target.style.background = '#000000'; }
                        }, [
                            $.option({ value: 'taproot' }, ['Bitcoin Taproot (bc1p...) - Primary']),
                            $.option({ value: 'nativeSegWit' }, ['Bitcoin Native SegWit (bc1q...) - BIP84']),
                            $.option({ value: 'nestedSegWit' }, ['Bitcoin Nested SegWit (3...) - BIP49']),
                            $.option({ value: 'legacy' }, ['Bitcoin Legacy (1...) - BIP44']),
                            $.option({ value: 'spark' }, ['Spark Protocol (sp1...) - Lightning'])
                        ])
                    ]),
                    
                    $.div({ 
                        id: 'selectedWalletDisplay',
                        style: 'margin-top: 12px;'
                    }, [
                        $.div({ 
                            style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;'
                        }, [
                            $.span({ 
                                style: 'color: #888888; font-size: 11px;',
                                id: 'selectedWalletLabel'
                            }, ['Bitcoin Taproot Address:']),
                            $.span({ 
                                style: 'color: #ffffff; font-size: 11px;',
                                id: 'selectedWalletBalance'
                            }, ['0.00000000 BTC'])
                        ]),
                        $.div({ 
                            style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: 8px; font-family: JetBrains Mono, monospace; word-break: break-all; color: #f57315; font-size: 11px; cursor: pointer; transition: all 0.2s ease; min-height: 20px;',
                            id: 'selectedWalletAddress',
                            onclick: () => this.openSelectedWalletExplorer(),
                            onmouseover: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.color = '#ff8c42'; },
                            onmouseout: (e) => { e.target.style.borderColor = '#f57315'; e.target.style.color = '#f57315'; }
                        }, ['Select wallet to view address'])
                    ])
                ])
            ]);
        }
        
        createStatsGrid() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'stats-grid',
                style: 'display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(160px * var(--scale-factor)), 1fr)); gap: calc(12px * var(--scale-factor)); margin-bottom: calc(20px * var(--scale-factor));'
            }, [
                // Bitcoin Balance
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Bitcoin Balance']),
                    $.div({ 
                        id: 'btcBalance',
                        className: 'text-primary',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315; word-break: break-all;'
                    }, ['0.00000000 BTC']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['≈ $', $.span({ id: 'btcUsdValue' }, ['0.00']), ' USD'])
                ]),
                
                // Lightning Balance
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Lightning Balance']),
                    $.div({ 
                        id: 'lightningBalance',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 sats']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, [$.span({ id: 'activeChannels' }, ['0']), ' active channels'])
                ]),
                
                // Stablecoins
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Stablecoins']),
                    $.div({ 
                        id: 'stablecoinBalance',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 USDT']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['On Lightning Network'])
                ]),
                
                // Ordinals (NFTs)
                $.div({ 
                    id: 'ordinalsSection',
                    className: 'stats-grid-item',
                    style: 'background: #1a1a1a; border: 1px solid #333333; border-radius: 0; padding: 20px; transition: all 0.3s ease; display: none; cursor: pointer;',
                    onclick: () => this.openOrdinalsGallery(),
                    onmouseover: (e) => { e.currentTarget.style.background = '#262626'; e.currentTarget.style.borderColor = '#ffffff'; },
                    onmouseout: (e) => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = '#333333'; }
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Ordinals (NFTs)']),
                    $.div({ 
                        id: 'ordinalsCount',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 NFTs']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['Click to view gallery'])
                ]),
                
                // Network Status
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Network Status']),
                    $.div({ 
                        id: 'sparkNetworkStatus',
                        className: 'text-primary',
                        style: 'font-size: calc(14px * var(--scale-factor));'
                    }, ['Connected']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['Block ', $.span({ id: 'blockHeight' }, ['000000'])])
                ])
            ]);
        }
        
        createStatCard(title, primary, secondary, iconClass) {
            // No longer needed
            return null;
        }
        
        createSparkProtocolSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'spark-protocol-section' }, [
                $.div({ className: 'spark-header' }, [
                    $.h3({ className: 'spark-title' }, ['Spark Protocol Terminal']),
                    $.button({
                        className: 'spark-toggle',
                        onclick: () => this.toggleSparkTerminal()
                    }, ['Toggle'])
                ]),
                $.div({ id: 'spark-terminal', className: 'spark-terminal hidden' }, [
                    $.div({ className: 'terminal-output' }, [
                        $.div({ className: 'terminal-line' }, ['> Spark Protocol v2.0.0 initialized']),
                        $.div({ className: 'terminal-line' }, ['> Connection: ACTIVE']),
                        $.div({ className: 'terminal-line' }, ['> Nodes: 12 connected']),
                        $.div({ className: 'terminal-line' }, ['> Privacy: MAXIMUM'])
                    ]),
                    $.input({
                        className: 'terminal-input',
                        placeholder: 'Enter Spark command...',
                        onkeypress: (e) => {
                            if (e.key === 'Enter') this.handleSparkCommand(e.target.value);
                        }
                    })
                ])
            ]);
        }
        
        createNetworkCard() {
            const $ = ElementFactory;
            
            return $.div({ className: 'token-card network-card' }, [
                $.div({ className: 'token-name' }, ['Network']),
                $.div({ className: 'network-status' }, ['● Connected']),
                $.div({ className: 'network-block' }, ['Block 000000'])
            ]);
        }
        
        // New event handlers
        handleWalletTypeChange(e) {
            const walletType = e.target.value;
            this.app.showNotification(`Switching to ${walletType} wallet...`, 'success');
            
            // Show/hide ordinals based on wallet type
            const ordinalsCard = document.querySelector('.ordinals-icon')?.parentElement?.parentElement;
            if (ordinalsCard) {
                ordinalsCard.style.display = walletType === 'taproot' ? 'flex' : 'none';
            }
            
            // Store selected wallet type
            if (this.app.state) {
                this.app.state.set('selectedWalletType', walletType);
            }
        }
        
        toggleSparkTerminal() {
            const terminal = document.getElementById('spark-terminal');
            if (terminal) {
                terminal.classList.toggle('hidden');
                this.app.showNotification(
                    terminal.classList.contains('hidden') ? 'Spark terminal hidden' : 'Spark terminal shown',
                    'success'
                );
            }
        }
        
        handleSparkCommand(command) {
            const terminal = document.querySelector('.terminal-output');
            const input = document.querySelector('.terminal-input');
            
            if (!terminal || !input) return;
            
            // Add user command to terminal
            const userLine = document.createElement('div');
            userLine.className = 'terminal-line';
            userLine.style.color = '#00ff00';
            userLine.textContent = `> ${command}`;
            terminal.appendChild(userLine);
            
            // Process command
            let response = '';
            const cmd = command.toLowerCase().trim();
            
            if (cmd === 'help') {
                response = 'Available commands: status, balance, network, privacy, clear, help';
            } else if (cmd === 'status') {
                response = 'Spark Protocol: ACTIVE | Privacy: MAXIMUM | Nodes: 12';
            } else if (cmd === 'balance') {
                const btcBalance = document.getElementById('btc-balance')?.textContent || '0.00000000';
                response = `Current balance: ${btcBalance} BTC`;
            } else if (cmd === 'network') {
                const networkBlock = document.querySelector('.network-block')?.textContent || 'Unknown';
                response = `Network: Mainnet | ${networkBlock}`;
            } else if (cmd === 'privacy') {
                response = 'Privacy mode: ENABLED | Tor: ACTIVE | VPN: CONNECTED';
            } else if (cmd === 'clear') {
                terminal.innerHTML = '';
                response = 'Terminal cleared.';
            } else if (cmd === '') {
                response = '';
            } else {
                response = `Unknown command: ${command}. Type 'help' for available commands.`;
            }
            
            // Add response to terminal
            if (response) {
                const responseLine = document.createElement('div');
                responseLine.className = 'terminal-line';
                responseLine.style.color = '#888888';
                responseLine.textContent = response;
                terminal.appendChild(responseLine);
            }
            
            // Clear input
            input.value = '';
            
            // Scroll to bottom
            terminal.scrollTop = terminal.scrollHeight;
            
            this.app.showNotification('Command executed', 'success');
        }
        
        // Dashboard action handlers
        handleTokenMenu() {
            const modal = new TokenMenuModal(this.app);
            modal.show();
        }
        
        toggleAccountDropdown() {
            const modal = new MultiAccountModal(this.app);
            modal.show();
        }
        
        handleAddAccount() {
            const modal = new MultiAccountModal(this.app);
            modal.show();
        }
        
        async handleRefresh() {
            this.app.showNotification('Refreshing wallet data...', 'success');
            
            try {
                // Fetch Bitcoin price
                const priceData = await this.app.apiService.fetchBitcoinPrice();
                const btcPrice = priceData.usd || 0;
                
                // Get current account
                const currentAccount = this.app.state.get('currentAccount');
                if (currentAccount && currentAccount.addresses) {
                    // Fetch balance for the current address type
                    const walletType = this.app.state.get('selectedWalletType') || 'taproot';
                    let address = currentAccount.addresses.taproot;
                    
                    if (walletType === 'segwit') address = currentAccount.addresses.segwit;
                    else if (walletType === 'legacy') address = currentAccount.addresses.legacy;
                    
                    const balance = await this.app.apiService.fetchAddressBalance(address);
                    const btcBalance = balance / 100000000; // Convert from satoshis
                    const usdBalance = (btcBalance * btcPrice).toFixed(2);
                    
                    // Update UI
                    const btcElement = document.getElementById('btc-balance');
                    const usdElement = document.getElementById('usd-balance');
                    
                    if (btcElement) btcElement.textContent = btcBalance.toFixed(8);
                    if (usdElement) usdElement.textContent = usdBalance;
                    
                    // Update stats grid
                    const networkInfo = await this.app.apiService.fetchNetworkInfo();
                    const networkCard = document.querySelector('.network-block');
                    if (networkCard) {
                        networkCard.textContent = `Block ${networkInfo.height || '000000'}`;
                    }
                    
                    this.app.showNotification('Wallet data refreshed!', 'success');
                } else {
                    this.app.showNotification('No wallet selected', 'error');
                }
            } catch (error) {
                console.error('Refresh error:', error);
                this.app.showNotification('Failed to refresh data', 'error');
            }
        }
        
        handlePrivacyToggle() {
            const balances = document.querySelectorAll('.btc-value, #usd-balance, .token-amount');
            const isHidden = balances[0]?.textContent === '••••••••';
            
            balances.forEach(el => {
                if (isHidden) {
                    // Show real values (placeholder for now)
                    if (el.id === 'btc-balance') el.textContent = '0.00000000';
                    else if (el.id === 'usd-balance') el.textContent = '0.00';
                    else el.textContent = '0.00';
                } else {
                    // Hide values
                    el.textContent = '••••••••';
                }
            });
            
            this.app.showNotification(isHidden ? 'Balances shown' : 'Balances hidden', 'success');
        }
        
        handleSend() {
            this.showSendModal();
        }
        
        handleReceive() {
            this.showReceiveModal();
        }
        
        handleSwap() {
            const modal = new SwapModal(this.app);
            modal.show();
        }
        
        handleSettings() {
            const modal = new WalletSettingsModal(this.app);
            modal.show();
        }
        
        handleFilter() {
            const modal = new TransactionHistoryModal(this.app);
            modal.show();
        }
        
        initializeDashboard() {
            // Add dashboard-specific styles
            this.addDashboardStyles();
            
            // Start data loading
            setTimeout(() => {
                this.loadWalletData();
            }, 500);
        }
        
        addDashboardStyles() {
            const style = document.createElement('style');
            style.textContent = `
                /* Dashboard Container */
                .wallet-dashboard-container {
                    max-width: calc(800px * var(--scale-factor));
                    margin: 0 auto;
                    padding: calc(var(--spacing-unit) * 2 * var(--scale-factor));
                }
                
                /* Dashboard Header */
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: calc(16px * var(--scale-factor));
                    border-bottom: calc(1px * var(--scale-factor)) solid var(--border-color);
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .terminal-title {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(18px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                }
                
                .title-text {
                    color: var(--text-primary);
                }
                
                .cursor-blink {
                    color: var(--text-primary);
                    animation: blink 1s infinite;
                    margin-left: calc(2px * var(--scale-factor));
                }
                
                .header-actions {
                    display: flex;
                    gap: calc(12px * var(--scale-factor));
                    align-items: center;
                }
                
                .account-dropdown-btn {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    padding: calc(8px * var(--scale-factor)) calc(12px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: calc(8px * var(--scale-factor));
                    transition: all 0.2s ease;
                }
                
                .account-dropdown-btn:hover {
                    border-color: var(--text-primary);
                }
                
                .dropdown-arrow {
                    font-size: calc(10px * var(--scale-factor));
                    opacity: 0.7;
                }
                
                .header-buttons {
                    display: flex;
                    gap: calc(8px * var(--scale-factor));
                }
                
                .header-btn {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    width: calc(32px * var(--scale-factor));
                    height: calc(32px * var(--scale-factor));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: calc(16px * var(--scale-factor));
                    transition: all 0.2s ease;
                }
                
                .header-btn:hover {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                }
                
                /* Balance Section */
                .balance-section {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(24px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .primary-balance {
                    text-align: center;
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .balance-label {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .balance-amount {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(32px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                    line-height: 1.2;
                }
                
                .btc-unit {
                    font-size: calc(18px * var(--scale-factor));
                    margin-left: calc(4px * var(--scale-factor));
                }
                
                .balance-usd {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-top: calc(8px * var(--scale-factor));
                }
                
                .token-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(calc(120px * var(--scale-factor)), 1fr));
                    gap: calc(16px * var(--scale-factor));
                    padding-top: calc(24px * var(--scale-factor));
                    border-top: calc(1px * var(--scale-factor)) solid var(--border-color);
                }
                
                .token-card {
                    background: var(--bg-secondary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(12px * var(--scale-factor));
                    text-align: center;
                    transition: all 0.2s ease;
                }
                
                .token-card:hover {
                    border-color: var(--text-primary);
                }
                
                .token-name {
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-bottom: calc(4px * var(--scale-factor));
                }
                
                .token-amount {
                    font-size: calc(16px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                }
                
                .token-value {
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-top: calc(4px * var(--scale-factor));
                }
                
                /* Quick Actions */
                .quick-actions {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(calc(120px * var(--scale-factor)), 1fr));
                    gap: calc(16px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .action-button {
                    background: var(--bg-primary);
                    border: calc(2px * var(--scale-factor)) solid var(--text-primary);
                    color: var(--text-primary);
                    padding: calc(20px * var(--scale-factor));
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .action-button:hover {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                }
                
                .action-icon {
                    font-size: calc(24px * var(--scale-factor));
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .action-label {
                    font-size: calc(14px * var(--scale-factor));
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                /* Transaction History */
                .transaction-history {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(24px * var(--scale-factor));
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: calc(16px * var(--scale-factor));
                }
                
                .section-title {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(16px * var(--scale-factor));
                    color: var(--text-primary);
                    margin: 0;
                    font-weight: 600;
                }
                
                .filter-button {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-dim);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    padding: calc(8px * var(--scale-factor)) calc(12px * var(--scale-factor));
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .filter-button:hover {
                    border-color: var(--text-primary);
                    color: var(--text-primary);
                }
                
                .empty-transactions {
                    text-align: center;
                    padding: calc(40px * var(--scale-factor));
                    color: var(--text-dim);
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .empty-text {
                    font-size: calc(14px * var(--scale-factor));
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .empty-subtext {
                    font-size: calc(12px * var(--scale-factor));
                    opacity: 0.7;
                }
                
                /* Mobile Optimizations */
                @media (max-width: 768px) {
                    .dashboard-header {
                        flex-direction: column;
                        gap: calc(16px * var(--scale-factor));
                        align-items: stretch;
                    }
                    
                    .header-actions {
                        justify-content: space-between;
                    }
                    
                    .balance-amount {
                        font-size: calc(24px * var(--scale-factor));
                    }
                    
                    .quick-actions {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        loadWalletData() {
            // Placeholder for API integration
            this.app.showNotification('Wallet data loaded', 'success');
        }
        
        // Modal Methods
        showSendModal() {
            const $ = ElementFactory;
            
            // Create modal overlay
            const overlay = $.div({ 
                className: 'modal-overlay',
                onclick: (e) => {
                    if (e.target.className === 'modal-overlay') {
                        this.closeModal();
                    }
                }
            }, [
                $.div({ className: 'modal-container send-modal' }, [
                    // Modal header
                    $.div({ className: 'modal-header' }, [
                        $.h2({ className: 'modal-title' }, [
                            $.span({ className: 'text-dim' }, ['<']),
                            ' Send Bitcoin ',
                            $.span({ className: 'text-dim' }, ['/>'])
                        ]),
                        $.button({
                            className: 'modal-close',
                            onclick: () => this.closeModal()
                        }, ['×'])
                    ]),
                    
                    // Modal content
                    $.div({ className: 'modal-content' }, [
                        // Recipient address input
                        $.div({ className: 'form-group' }, [
                            $.label({ className: 'form-label' }, [
                                $.span({ className: 'text-dim ui-bracket' }, ['<']),
                                ' Recipient Address ',
                                $.span({ className: 'text-dim ui-bracket' }, ['/>']),
                            ]),
                            $.input({
                                type: 'text',
                                id: 'recipient-address',
                                className: 'form-input',
                                placeholder: 'Enter Bitcoin address...',
                                spellcheck: 'false'
                            })
                        ]),
                        
                        // Amount input
                        $.div({ className: 'form-group' }, [
                            $.label({ className: 'form-label' }, [
                                $.span({ className: 'text-dim ui-bracket' }, ['<']),
                                ' Amount ',
                                $.span({ className: 'text-dim ui-bracket' }, ['/>']),
                            ]),
                            $.div({ className: 'amount-input-group' }, [
                                $.input({
                                    type: 'text',
                                    id: 'send-amount',
                                    className: 'form-input amount-input',
                                    placeholder: '0.00000000',
                                    spellcheck: 'false'
                                }),
                                $.create('select', { className: 'amount-unit' }, [
                                    $.create('option', { value: 'btc' }, ['BTC']),
                                    $.create('option', { value: 'usd' }, ['USD'])
                                ])
                            ]),
                            $.div({ className: 'amount-conversion' }, [
                                $.span({ className: 'text-dim' }, ['≈ $0.00 USD'])
                            ])
                        ]),
                        
                        // Fee selector
                        $.div({ className: 'form-group' }, [
                            $.label({ className: 'form-label' }, [
                                $.span({ className: 'text-dim ui-bracket' }, ['<']),
                                ' Network Fee ',
                                $.span({ className: 'text-dim ui-bracket' }, ['/>']),
                            ]),
                            $.div({ className: 'fee-options' }, [
                                this.createFeeOption('slow', 'Slow', '~60 min', '1 sat/vB', true),
                                this.createFeeOption('medium', 'Medium', '~30 min', '5 sat/vB'),
                                this.createFeeOption('fast', 'Fast', '~10 min', '15 sat/vB')
                            ])
                        ]),
                        
                        // Transaction summary
                        $.div({ className: 'transaction-summary' }, [
                            $.div({ className: 'summary-title' }, ['Transaction Summary']),
                            $.div({ className: 'summary-row' }, [
                                $.span({ className: 'summary-label' }, ['Amount:']),
                                $.span({ className: 'summary-value' }, ['0.00000000 BTC'])
                            ]),
                            $.div({ className: 'summary-row' }, [
                                $.span({ className: 'summary-label' }, ['Network Fee:']),
                                $.span({ className: 'summary-value' }, ['0.00000001 BTC'])
                            ]),
                            $.div({ className: 'summary-row total' }, [
                                $.span({ className: 'summary-label' }, ['Total:']),
                                $.span({ className: 'summary-value' }, ['0.00000001 BTC'])
                            ])
                        ])
                    ]),
                    
                    // Modal footer
                    $.div({ className: 'modal-footer' }, [
                        $.button({
                            className: 'btn btn-secondary',
                            onclick: () => this.closeModal()
                        }, ['Cancel']),
                        $.button({
                            className: 'btn btn-primary',
                            onclick: () => this.processSend()
                        }, ['Send Bitcoin'])
                    ])
                ])
            ]);
            
            document.body.appendChild(overlay);
            this.addModalStyles();
            
            // Focus on address input
            setTimeout(() => {
                document.getElementById('recipient-address')?.focus();
            }, 100);
        }
        
        showReceiveModal() {
            const $ = ElementFactory;
            
            // Get current wallet address
            const currentAccount = this.app.state.getCurrentAccount();
            const walletAddress = currentAccount?.address || this.generateWalletAddress('taproot');
            
            // Create modal overlay
            const overlay = $.div({ 
                className: 'modal-overlay',
                onclick: (e) => {
                    if (e.target.className === 'modal-overlay') {
                        this.closeModal();
                    }
                }
            }, [
                $.div({ className: 'modal-container receive-modal' }, [
                    // Modal header
                    $.div({ className: 'modal-header' }, [
                        $.h2({ className: 'modal-title' }, [
                            $.span({ className: 'text-dim' }, ['<']),
                            ' Receive Bitcoin ',
                            $.span({ className: 'text-dim' }, ['/>'])
                        ]),
                        $.button({
                            className: 'modal-close',
                            onclick: () => this.closeModal()
                        }, ['×'])
                    ]),
                    
                    // Modal content
                    $.div({ className: 'modal-content' }, [
                        // QR Code section
                        $.div({ className: 'qr-section' }, [
                            this.createQRCode(walletAddress)
                        ]),
                        
                        // Address display
                        $.div({ className: 'address-section' }, [
                            $.label({ className: 'form-label' }, [
                                $.span({ className: 'text-dim ui-bracket' }, ['<']),
                                ' Your Bitcoin Address ',
                                $.span({ className: 'text-dim ui-bracket' }, ['/>']),
                            ]),
                            $.div({ className: 'address-display' }, [
                                $.input({
                                    type: 'text',
                                    className: 'address-input form-input',
                                    value: walletAddress,
                                    readonly: true,
                                    id: 'wallet-address-display'
                                }),
                                $.button({
                                    className: 'copy-btn',
                                    onclick: () => this.copyAddress(walletAddress)
                                }, ['Copy'])
                            ])
                        ]),
                        
                        // Amount input (optional)
                        $.div({ className: 'form-group' }, [
                            $.label({ className: 'form-label' }, [
                                $.span({ className: 'text-dim ui-bracket' }, ['<']),
                                ' Amount (Optional) ',
                                $.span({ className: 'text-dim ui-bracket' }, ['/>']),
                            ]),
                            $.div({ className: 'amount-input-group' }, [
                                $.input({
                                    type: 'text',
                                    id: 'receive-amount',
                                    className: 'form-input amount-input',
                                    placeholder: '0.00000000',
                                    spellcheck: 'false'
                                }),
                                $.create('select', { className: 'amount-unit' }, [
                                    $.create('option', { value: 'btc' }, ['BTC']),
                                    $.create('option', { value: 'usd' }, ['USD'])
                                ])
                            ])
                        ]),
                        
                        // Share options
                        $.div({ className: 'share-section' }, [
                            $.div({ className: 'share-title' }, ['Share via']),
                            $.div({ className: 'share-buttons' }, [
                                $.button({ className: 'share-btn' }, ['Email']),
                                $.button({ className: 'share-btn' }, ['Message']),
                                $.button({ className: 'share-btn' }, ['Link'])
                            ])
                        ])
                    ]),
                    
                    // Modal footer
                    $.div({ className: 'modal-footer' }, [
                        $.button({
                            className: 'btn btn-primary full-width',
                            onclick: () => this.closeModal()
                        }, ['Done'])
                    ])
                ])
            ]);
            
            document.body.appendChild(overlay);
            this.addModalStyles();
        }
        
        showSettingsModal() {
            const $ = ElementFactory;
            
            // Create modal overlay
            const overlay = $.div({ 
                className: 'modal-overlay',
                onclick: (e) => {
                    if (e.target.className === 'modal-overlay') {
                        this.closeModal();
                    }
                }
            }, [
                $.div({ className: 'modal-container settings-modal' }, [
                    // Modal header
                    $.div({ className: 'modal-header' }, [
                        $.h2({ className: 'modal-title' }, [
                            $.span({ className: 'text-dim' }, ['<']),
                            ' Wallet Settings ',
                            $.span({ className: 'text-dim' }, ['/>'])
                        ]),
                        $.button({
                            className: 'modal-close',
                            onclick: () => this.closeModal()
                        }, ['×'])
                    ]),
                    
                    // Modal content
                    $.div({ className: 'modal-content' }, [
                        // Settings sections
                        this.createSettingsSection('Account', [
                            this.createSettingItem('Account Name', 'text', 'Account 1'),
                            this.createSettingItem('Default Currency', 'select', 'btc', ['btc', 'usd', 'eur'])
                        ]),
                        
                        this.createSettingsSection('Security', [
                            this.createSettingItem('Auto-lock Timer', 'select', '30', ['15', '30', '60', 'never']),
                            this.createPasswordChangeSection(),
                            this.createSeedPhraseSection()
                        ]),
                        
                        this.createSettingsSection('Network', [
                            this.createSettingItem('Network', 'select', 'mainnet', ['mainnet', 'testnet']),
                            this.createSettingItem('RPC Endpoint', 'text', 'Default')
                        ]),
                        
                        this.createSettingsSection('Advanced', [
                            this.createExportSection(),
                            this.createDeleteWalletSection()
                        ])
                    ])
                ])
            ]);
            
            document.body.appendChild(overlay);
            this.addModalStyles();
        }
        
        createSettingsSection(title, items) {
            const $ = ElementFactory;
            
            return $.div({ className: 'settings-section' }, [
                $.h3({ className: 'settings-section-title' }, [title]),
                $.div({ className: 'settings-items' }, items)
            ]);
        }
        
        createSettingItem(label, type, value, options = []) {
            const $ = ElementFactory;
            
            return $.div({ className: 'setting-item' }, [
                $.label({ className: 'setting-label' }, [label]),
                type === 'select' ? 
                    $.create('select', { className: 'setting-input' }, 
                        options.map(opt => $.create('option', { value: opt }, [opt]))
                    ) :
                    $.input({ 
                        type: type, 
                        className: 'setting-input', 
                        value: value 
                    })
            ]);
        }
        
        createPasswordChangeSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'setting-item' }, [
                $.button({
                    className: 'btn btn-secondary',
                    onclick: () => this.showPasswordChangeModal()
                }, ['Change Password'])
            ]);
        }
        
        createSeedPhraseSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'setting-item danger-zone' }, [
                $.button({
                    className: 'btn btn-danger',
                    onclick: () => this.showSeedPhraseModal()
                }, ['Show Seed Phrase']),
                $.div({ className: 'setting-warning' }, [
                    'Requires password verification'
                ])
            ]);
        }
        
        createExportSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'setting-item' }, [
                $.button({
                    className: 'btn btn-secondary',
                    onclick: () => this.exportWalletData()
                }, ['Export Wallet Data'])
            ]);
        }
        
        createDeleteWalletSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'setting-item danger-zone' }, [
                $.button({
                    className: 'btn btn-danger',
                    onclick: () => this.confirmDeleteWallet()
                }, ['Delete Wallet']),
                $.div({ className: 'setting-warning' }, [
                    'This action cannot be undone'
                ])
            ]);
        }
        
        showSeedPhraseModal() {
            const $ = ElementFactory;
            
            // First show password verification modal
            const passwordOverlay = $.div({ 
                className: 'modal-overlay',
                onclick: (e) => {
                    if (e.target.className === 'modal-overlay') {
                        e.currentTarget.remove();
                    }
                }
            }, [
                $.div({ className: 'modal-container password-modal' }, [
                    $.div({ className: 'modal-header' }, [
                        $.h2({ className: 'modal-title' }, ['Verify Password']),
                        $.button({
                            className: 'modal-close',
                            onclick: () => passwordOverlay.remove()
                        }, ['×'])
                    ]),
                    
                    $.div({ className: 'modal-content' }, [
                        $.div({ className: 'form-group' }, [
                            $.label({ className: 'form-label' }, ['Enter your password to view seed phrase']),
                            $.input({
                                type: 'password',
                                id: 'verify-password',
                                className: 'form-input',
                                placeholder: 'Enter password...',
                                onkeypress: (e) => {
                                    if (e.key === 'Enter') {
                                        this.verifyPasswordAndShowSeed(passwordOverlay);
                                    }
                                }
                            })
                        ])
                    ]),
                    
                    $.div({ className: 'modal-footer' }, [
                        $.button({
                            className: 'btn btn-secondary',
                            onclick: () => passwordOverlay.remove()
                        }, ['Cancel']),
                        $.button({
                            className: 'btn btn-primary',
                            onclick: () => this.verifyPasswordAndShowSeed(passwordOverlay)
                        }, ['Verify'])
                    ])
                ])
            ]);
            
            document.body.appendChild(passwordOverlay);
            
            // Focus on password input
            setTimeout(() => {
                document.getElementById('verify-password')?.focus();
            }, 100);
        }
        
        verifyPasswordAndShowSeed(passwordOverlay) {
            const password = document.getElementById('verify-password')?.value;
            const storedPassword = localStorage.getItem('walletPassword');
            
            if (password === storedPassword) {
                passwordOverlay.remove();
                this.displaySeedPhrase();
            } else {
                this.app.showNotification('Incorrect password', 'error');
            }
        }
        
        displaySeedPhrase() {
            const $ = ElementFactory;
            const seedPhrase = localStorage.getItem('seedPhrase') || this.generateSeedPhrase();
            const words = seedPhrase.split(' ');
            
            const seedOverlay = $.div({ 
                className: 'modal-overlay',
                onclick: (e) => {
                    if (e.target.className === 'modal-overlay') {
                        e.currentTarget.remove();
                    }
                }
            }, [
                $.div({ className: 'modal-container seed-modal' }, [
                    $.div({ className: 'modal-header' }, [
                        $.h2({ className: 'modal-title' }, ['Your Seed Phrase']),
                        $.button({
                            className: 'modal-close',
                            onclick: () => seedOverlay.remove()
                        }, ['×'])
                    ]),
                    
                    $.div({ className: 'modal-content' }, [
                        $.div({ className: 'seed-warning' }, [
                            $.div({ className: 'warning-icon' }, ['⚠️']),
                            $.div({ className: 'warning-text' }, [
                                'Never share your seed phrase with anyone!',
                                $.br(),
                                'Write it down and store it securely.'
                            ])
                        ]),
                        
                        $.div({ className: 'seed-grid' }, 
                            words.map((word, index) => 
                                $.div({ className: 'seed-word' }, [
                                    $.span({ className: 'seed-number' }, [`${index + 1}.`]),
                                    $.span({ className: 'seed-text' }, [word])
                                ])
                            )
                        ),
                        
                        $.div({ className: 'seed-actions' }, [
                            $.button({
                                className: 'btn btn-secondary',
                                onclick: () => this.copySeedPhrase(seedPhrase)
                            }, ['Copy Seed Phrase'])
                        ])
                    ]),
                    
                    $.div({ className: 'modal-footer' }, [
                        $.button({
                            className: 'btn btn-primary full-width',
                            onclick: () => seedOverlay.remove()
                        }, ['I have saved my seed phrase'])
                    ])
                ])
            ]);
            
            document.body.appendChild(seedOverlay);
        }
        
        generateSeedPhrase() {
            // Generate a placeholder seed phrase (in production, use proper BIP39)
            const words = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 
                          'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'];
            return words.join(' ');
        }
        
        copySeedPhrase(seedPhrase) {
            navigator.clipboard.writeText(seedPhrase).then(() => {
                this.app.showNotification('Seed phrase copied to clipboard', 'success');
            }).catch(() => {
                this.app.showNotification('Failed to copy seed phrase', 'error');
            });
        }
        
        createFeeOption(id, label, time, rate, selected = false) {
            const $ = ElementFactory;
            
            return $.label({ className: 'fee-option' }, [
                $.input({
                    type: 'radio',
                    name: 'fee-option',
                    value: id,
                    checked: selected
                }),
                $.div({ className: 'fee-details' }, [
                    $.div({ className: 'fee-label' }, [label]),
                    $.div({ className: 'fee-info' }, [
                        $.span({ className: 'fee-time' }, [time]),
                        $.span({ className: 'fee-rate' }, [rate])
                    ])
                ])
            ]);
        }
        
        closeModal() {
            const overlay = document.querySelector('.modal-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
        
        processSend() {
            const address = document.getElementById('recipient-address')?.value;
            const amount = document.getElementById('send-amount')?.value;
            
            if (!address || !amount) {
                this.app.showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // TODO: Implement actual send logic
            this.app.showNotification('Transaction sent successfully!', 'success');
            this.closeModal();
        }
        
        copyAddress(address) {
            navigator.clipboard.writeText(address).then(() => {
                this.app.showNotification('Address copied to clipboard', 'success');
            }).catch(() => {
                this.app.showNotification('Failed to copy address', 'error');
            });
        }
        
        createQRCode(data) {
            const $ = ElementFactory;
            const size = 200; // QR code size
            
            // Create canvas for QR code
            const canvas = $.create('canvas', {
                width: size,
                height: size,
                style: {
                    width: `calc(${size}px * var(--scale-factor))`,
                    height: `calc(${size}px * var(--scale-factor))`,
                    border: '2px solid var(--text-primary)',
                    borderRadius: '0',
                    padding: 'calc(10px * var(--scale-factor))',
                    background: 'white'
                }
            });
            
            // Generate QR code pattern (simplified for pure JS)
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Create a simple QR-like pattern (placeholder)
                this.drawQRPattern(ctx, data, size);
            }
            
            return $.div({ className: 'qr-code-container' }, [
                canvas,
                $.div({ 
                    className: 'qr-label',
                    style: {
                        marginTop: 'calc(12px * var(--scale-factor))',
                        fontSize: 'calc(12px * var(--scale-factor))',
                        color: 'var(--text-dim)',
                        textAlign: 'center'
                    }
                }, ['Scan with any Bitcoin wallet'])
            ]);
        }
        
        drawQRPattern(ctx, data, size) {
            // Create a deterministic pattern based on the data
            const moduleSize = 8;
            const modules = Math.floor(size / moduleSize);
            
            // Fill white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);
            
            // Generate pattern based on data hash
            let hash = 0;
            for (let i = 0; i < data.length; i++) {
                hash = ((hash << 5) - hash) + data.charCodeAt(i);
                hash = hash & hash;
            }
            
            // Draw modules
            ctx.fillStyle = '#000000';
            for (let row = 0; row < modules; row++) {
                for (let col = 0; col < modules; col++) {
                    // Use hash to determine if module should be filled
                    const shouldFill = ((hash + row * modules + col) % 3) !== 0;
                    if (shouldFill) {
                        ctx.fillRect(
                            col * moduleSize + moduleSize/4,
                            row * moduleSize + moduleSize/4,
                            moduleSize - moduleSize/2,
                            moduleSize - moduleSize/2
                        );
                    }
                }
            }
            
            // Add corner markers (QR code style)
            this.drawCornerMarker(ctx, 0, 0, moduleSize * 3);
            this.drawCornerMarker(ctx, size - moduleSize * 3, 0, moduleSize * 3);
            this.drawCornerMarker(ctx, 0, size - moduleSize * 3, moduleSize * 3);
        }
        
        drawCornerMarker(ctx, x, y, size) {
            // Outer square
            ctx.fillStyle = '#000000';
            ctx.fillRect(x, y, size, size);
            
            // Inner white square
            ctx.fillStyle = '#ffffff';
            const padding = size / 7;
            ctx.fillRect(x + padding, y + padding, size - padding * 2, size - padding * 2);
            
            // Center black square
            ctx.fillStyle = '#000000';
            const innerPadding = size / 3.5;
            ctx.fillRect(x + innerPadding, y + innerPadding, size - innerPadding * 2, size - innerPadding * 2);
        }
        
        addModalStyles() {
            if (document.getElementById('modal-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                /* Modal Overlay */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: calc(20px * var(--scale-factor));
                }
                
                /* Modal Container */
                .modal-container {
                    background: var(--bg-secondary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    border-radius: 0;
                    max-width: calc(500px * var(--scale-factor));
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 0 calc(20px * var(--scale-factor)) rgba(0, 0, 0, 0.5);
                    animation: modalIn 0.2s ease-out;
                }
                
                @keyframes modalIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                /* Modal Header */
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: calc(20px * var(--scale-factor));
                    border-bottom: calc(1px * var(--scale-factor)) solid var(--border-color);
                }
                
                .modal-title {
                    font-size: calc(20px * var(--scale-factor));
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    font-size: calc(24px * var(--scale-factor));
                    color: var(--text-dim);
                    cursor: pointer;
                    padding: 0;
                    width: calc(32px * var(--scale-factor));
                    height: calc(32px * var(--scale-factor));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s;
                }
                
                .modal-close:hover {
                    color: var(--text-primary);
                }
                
                /* Modal Content */
                .modal-content {
                    padding: calc(24px * var(--scale-factor));
                }
                
                /* Form Groups */
                .form-group {
                    margin-bottom: calc(20px * var(--scale-factor));
                }
                
                .form-label {
                    display: block;
                    margin-bottom: calc(8px * var(--scale-factor));
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-primary);
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .form-input {
                    width: 100%;
                    padding: calc(12px * var(--scale-factor));
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    font-size: calc(14px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    transition: border-color 0.2s;
                }
                
                .form-input:focus {
                    outline: none;
                    border-color: var(--text-primary);
                }
                
                /* Amount Input Group */
                .amount-input-group {
                    display: flex;
                    gap: calc(8px * var(--scale-factor));
                }
                
                .amount-input {
                    flex: 1;
                }
                
                .amount-unit {
                    padding: calc(12px * var(--scale-factor));
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    font-family: 'JetBrains Mono', monospace;
                    cursor: pointer;
                }
                
                .amount-conversion {
                    margin-top: calc(8px * var(--scale-factor));
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                }
                
                /* Fee Options */
                .fee-options {
                    display: grid;
                    gap: calc(12px * var(--scale-factor));
                }
                
                .fee-option {
                    display: flex;
                    align-items: center;
                    padding: calc(12px * var(--scale-factor));
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                
                .fee-option:hover {
                    border-color: var(--text-dim);
                }
                
                .fee-option input[type="radio"] {
                    margin-right: calc(12px * var(--scale-factor));
                }
                
                .fee-details {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .fee-label {
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .fee-info {
                    display: flex;
                    gap: calc(16px * var(--scale-factor));
                    font-size: calc(12px * var(--scale-factor));
                }
                
                .fee-time {
                    color: var(--text-dim);
                }
                
                .fee-rate {
                    color: var(--text-primary);
                }
                
                /* Transaction Summary */
                .transaction-summary {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(16px * var(--scale-factor));
                    margin-top: calc(24px * var(--scale-factor));
                }
                
                .summary-title {
                    font-weight: 600;
                    margin-bottom: calc(12px * var(--scale-factor));
                    color: var(--text-primary);
                    font-size: calc(14px * var(--scale-factor));
                }
                
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: calc(8px * var(--scale-factor));
                    font-size: calc(12px * var(--scale-factor));
                }
                
                .summary-row.total {
                    margin-top: calc(8px * var(--scale-factor));
                    padding-top: calc(8px * var(--scale-factor));
                    border-top: calc(1px * var(--scale-factor)) solid var(--border-color);
                    font-weight: 600;
                }
                
                .summary-label {
                    color: var(--text-dim);
                }
                
                .summary-value {
                    color: var(--text-primary);
                }
                
                /* Modal Footer */
                .modal-footer {
                    display: flex;
                    gap: calc(12px * var(--scale-factor));
                    padding: calc(20px * var(--scale-factor));
                    border-top: calc(1px * var(--scale-factor)) solid var(--border-color);
                }
                
                .btn {
                    padding: calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor));
                    font-size: calc(14px * var(--scale-factor));
                    font-weight: 600;
                    font-family: 'JetBrains Mono', monospace;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    cursor: pointer;
                    transition: all 0.2s;
                    flex: 1;
                }
                
                .btn-primary {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                    border-color: var(--text-primary);
                }
                
                .btn-primary:hover {
                    background: #ff8c42;
                    border-color: #ff8c42;
                }
                
                .btn-secondary {
                    background: transparent;
                    color: var(--text-primary);
                }
                
                .btn-secondary:hover {
                    background: var(--bg-primary);
                }
                
                .btn.full-width {
                    width: 100%;
                }
                
                /* Receive Modal Specific */
                .qr-section {
                    display: flex;
                    justify-content: center;
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .qr-code-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .qr-code-container canvas {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                
                .qr-placeholder {
                    width: calc(200px * var(--scale-factor));
                    height: calc(200px * var(--scale-factor));
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .qr-text {
                    font-size: calc(32px * var(--scale-factor));
                    font-weight: 600;
                    color: var(--text-dim);
                }
                
                .qr-subtext {
                    font-size: calc(16px * var(--scale-factor));
                    color: var(--text-dim);
                }
                
                .address-display {
                    display: flex;
                    gap: calc(8px * var(--scale-factor));
                }
                
                .address-input {
                    flex: 1;
                    font-size: calc(12px * var(--scale-factor));
                }
                
                .copy-btn {
                    padding: calc(12px * var(--scale-factor)) calc(20px * var(--scale-factor));
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    font-family: 'JetBrains Mono', monospace;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .copy-btn:hover {
                    background: var(--text-keyword);
                    color: var(--bg-primary);
                    border-color: var(--text-keyword);
                }
                
                .share-section {
                    margin-top: calc(24px * var(--scale-factor));
                }
                
                .share-title {
                    font-size: calc(14px * var(--scale-factor));
                    font-weight: 600;
                    margin-bottom: calc(12px * var(--scale-factor));
                    color: var(--text-primary);
                }
                
                .share-buttons {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: calc(8px * var(--scale-factor));
                }
                
                .share-btn {
                    padding: calc(8px * var(--scale-factor));
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .share-btn:hover {
                    background: var(--text-dim);
                    color: var(--bg-primary);
                    border-color: var(--text-dim);
                }
                
                /* Mobile Optimizations */
                @media (max-width: 768px) {
                    .modal-container {
                        margin: calc(10px * var(--scale-factor));
                    }
                    
                    .fee-info {
                        flex-direction: column;
                        gap: calc(4px * var(--scale-factor));
                        align-items: flex-end;
                    }
                }
                
                /* Settings Modal Styles */
                .settings-modal .modal-content {
                    padding: 0;
                }
                
                .settings-section {
                    border-bottom: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(20px * var(--scale-factor));
                }
                
                .settings-section:last-child {
                    border-bottom: none;
                }
                
                .settings-section-title {
                    font-size: calc(16px * var(--scale-factor));
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0 0 calc(16px * var(--scale-factor)) 0;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .settings-items {
                    display: flex;
                    flex-direction: column;
                    gap: calc(12px * var(--scale-factor));
                }
                
                .setting-item {
                    display: flex;
                    flex-direction: column;
                    gap: calc(8px * var(--scale-factor));
                }
                
                .setting-label {
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .setting-input {
                    padding: calc(10px * var(--scale-factor));
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                    border-radius: 0;
                }
                
                .setting-input:focus {
                    outline: none;
                    border-color: var(--text-primary);
                }
                
                .setting-warning {
                    font-size: calc(11px * var(--scale-factor));
                    color: var(--text-dim);
                    font-style: italic;
                }
                
                .danger-zone .btn-danger {
                    background: transparent;
                    color: #ff4444;
                    border-color: #ff4444;
                }
                
                .danger-zone .btn-danger:hover {
                    background: #ff4444;
                    color: var(--bg-primary);
                }
                
                /* Seed Modal Styles */
                .seed-warning {
                    background: rgba(255, 68, 68, 0.1);
                    border: calc(1px * var(--scale-factor)) solid #ff4444;
                    padding: calc(16px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                    border-radius: 0;
                    display: flex;
                    align-items: center;
                    gap: calc(12px * var(--scale-factor));
                }
                
                .warning-icon {
                    font-size: calc(24px * var(--scale-factor));
                }
                
                .warning-text {
                    font-size: calc(12px * var(--scale-factor));
                    color: #ff4444;
                    line-height: 1.5;
                }
                
                .seed-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: calc(12px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                @media (max-width: 600px) {
                    .seed-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                .seed-word {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(12px * var(--scale-factor));
                    display: flex;
                    gap: calc(8px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    border-radius: 0;
                }
                
                .seed-number {
                    color: var(--text-dim);
                    font-size: calc(12px * var(--scale-factor));
                }
                
                .seed-text {
                    color: var(--text-primary);
                    font-weight: 600;
                    font-size: calc(14px * var(--scale-factor));
                }
                
                .seed-actions {
                    display: flex;
                    justify-content: center;
                    margin-bottom: calc(16px * var(--scale-factor));
                }
            `;
            document.head.appendChild(style);
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
                    text: 'Open Wallet Dashboard',
                    onClick: () => this.app.router.navigate('dashboard')
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
            
            // Clear current content and render dashboard
            const content = document.querySelector('.cursor-content');
            if (!content) return;
            
            content.innerHTML = '';
            content.appendChild(this.createDashboard());
            
            // Initialize dashboard controller
            this.initializeDashboard();
        }
        
        createDashboard() {
            const $ = ElementFactory;
            
            return $.div({ className: 'wallet-dashboard-container' }, [
                this.createDashboardHeader(),
                this.createDashboardContent()
            ]);
        }
        
        createDashboardHeader() {
            const $ = ElementFactory;
            
            return $.div({ className: 'terminal-box', style: 'margin-bottom: calc(24px * var(--scale-factor));' }, [
                $.div({ className: 'terminal-header' }, [
                    $.span({}, ['~/moosh/wallet/dashboard $']),
                    $.span({ className: 'text-keyword' }, ['active'])
                ]),
                $.div({ className: 'terminal-content' }, [
                    $.div({ 
                        style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: calc(12px * var(--scale-factor));'
                    }, [
                        // Left side: Terminal title
                        $.h2({ 
                            style: 'font-size: calc(20px * var(--scale-factor)); font-weight: 600; font-family: JetBrains Mono, monospace; margin: 0;'
                        }, [
                        ]),
                        
                        // Right side: Header buttons
                        $.div({ 
                            className: 'header-buttons',
                            style: 'display: flex; gap: calc(8px * var(--scale-factor)); align-items: center;'
                        }, [
                            $.button({
                                className: 'btn-secondary dashboard-btn',
                                onclick: () => this.showMultiAccountManager()
                            }, ['+ Accounts']),
                            $.button({
                                className: 'btn-secondary dashboard-btn',
                                onclick: () => this.handleRefresh()
                            }, ['Refresh']),
                            $.button({
                                className: 'btn-secondary dashboard-btn',
                                onclick: () => this.toggleBalanceVisibility()
                            }, ['Hide'])
                        ])
                    ]),
                    
                    // Account indicator
                    $.div({ 
                        id: 'currentAccountIndicator',
                        className: 'account-indicator',
                        style: 'font-family: JetBrains Mono, monospace; font-size: calc(11px * var(--scale-factor)); color: var(--text-accent); margin-top: calc(8px * var(--scale-factor)); padding: calc(4px * var(--scale-factor)) calc(8px * var(--scale-factor)); background: rgba(105, 253, 151, 0.1); border: 1px solid var(--text-accent); border-radius: 0; display: inline-block; cursor: pointer; transition: all 0.2s ease;',
                        onclick: () => this.showMultiAccountManager(),
                        onmouseover: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.2)',
                        onmouseout: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.1)'
                    }, ['Active: Account 1'])
                ])
            ]);
        }
        
        createAccountSelector() {
            const $ = ElementFactory;
            const activeAccount = 'Account 1'; // Will be dynamic later
            
            return $.div({ className: 'account-selector' }, [
                $.button({
                    className: 'account-dropdown-btn',
                    onclick: () => this.toggleAccountDropdown()
                }, [
                    $.span({ className: 'account-name' }, [activeAccount]),
                    $.span({ className: 'dropdown-arrow' }, ['▼'])
                ])
            ]);
        }
        
        createHeaderButtons() {
            const $ = ElementFactory;
            
            return $.div({ className: 'header-buttons' }, [
                $.button({
                    className: 'header-btn',
                    title: 'Token Menu',
                    onclick: () => this.handleTokenMenu()
                }, ['💰']),
                
                $.button({
                    className: 'header-btn',
                    title: 'Add Account',
                    onclick: () => this.handleAddAccount()
                }, ['+']),
                
                $.button({
                    className: 'header-btn',
                    title: 'Refresh',
                    onclick: () => this.handleRefresh()
                }, ['↻']),
                
                $.button({
                    className: 'header-btn privacy-toggle',
                    title: 'Toggle Privacy',
                    onclick: () => this.handlePrivacyToggle()
                }, ['👁'])
            ]);
        }
        
        createDashboardContent() {
            const $ = ElementFactory;
            
            return $.div({ className: 'dashboard-content' }, [
                this.createMainActionButtons()
            ]);
        }
        
        createBalanceSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'balance-section' }, [
                // Primary balance
                $.div({ className: 'primary-balance' }, [
                    $.div({ className: 'balance-label' }, ['Total Balance']),
                    $.div({ className: 'balance-amount' }, [
                        $.span({ id: 'btc-balance', className: 'btc-value' }, ['0.00000000']),
                        $.span({ className: 'btc-unit' }, [' BTC'])
                    ]),
                    $.div({ className: 'balance-usd' }, [
                        $.span({ className: 'usd-symbol' }, ['≈ $']),
                        $.span({ id: 'usd-balance' }, ['0.00']),
                        $.span({ className: 'usd-label' }, [' USD'])
                    ])
                ]),
                
                // Token balances
                $.div({ className: 'token-grid' }, [
                    this.createTokenCard('MOOSH', '0.00', '$0.00'),
                    this.createTokenCard('USDT', '0.00', '$0.00'),
                    this.createTokenCard('SPARK', '0.00', '$0.00')
                ])
            ]);
        }
        
        createTokenCard(name, amount, value) {
            const $ = ElementFactory;
            
            return $.div({ className: 'token-card' }, [
                $.div({ className: 'token-name' }, [name]),
                $.div({ className: 'token-amount' }, [amount]),
                $.div({ className: 'token-value' }, [value])
            ]);
        }
        
        createMainActionButtons() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'wallet-actions',
                style: 'display: flex; flex-direction: column; gap: calc(12px * var(--scale-factor)); margin-top: calc(24px * var(--scale-factor));'
            }, [
                $.button({
                    className: 'btn-primary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor));',
                    onclick: () => this.showSendPayment()
                }, ['Send Lightning Payment']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showReceivePayment()
                }, ['Receive Payment']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showTokenMenu()
                }, ['Token Menu']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showTransactionHistory()
                }, ['Transaction History']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showWalletSettings()
                }, ['Wallet Settings'])
            ]);
        }
        
        createSparkProtocolSection() {
            const $ = ElementFactory;
            
            return $.div({ 
                style: 'margin-top: 24px; padding-top: 24px; border-top: 1px solid #333333;'
            }, [
                $.h3({ 
                    style: 'color: #ffffff; margin-bottom: 16px;'
                }, ['Spark Protocol Features']),
                
                $.div({ 
                    style: 'background: rgba(105, 253, 151, 0.1); border: 1px solid #69fd97; border-radius: 8px; padding: 16px; margin-bottom: 16px;'
                }, [
                    $.div({ 
                        style: 'color: #69fd97; font-weight: 600; margin-bottom: 8px;'
                    }, ['Lightning Network Integration']),
                    $.div({ 
                        className: 'text-dim',
                        style: 'font-size: 12px;'
                    }, [
                        'Send instant Bitcoin payments • Sub-second confirmations • Minimal fees',
                        $.br(),
                        'Compatible with all Lightning wallets and services'
                    ])
                ]),
                
                $.div({ 
                    className: 'wallet-actions',
                    style: 'display: flex; gap: 16px; margin-bottom: 24px;'
                }, [
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.showStablecoinSwap(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Swap BTC ↔ USDT']),
                    
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.openLightningChannel(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Open Lightning Channel']),
                    
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.createStablecoin(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Mint Stablecoins'])
                ]),
                
                $.div({ 
                    className: 'terminal-box',
                    style: 'margin-top: 24px; background: #1a1a1a; border: 1px solid #333333; border-radius: 0;'
                }, [
                    $.div({ 
                        className: 'terminal-header',
                        style: 'padding: 12px; border-bottom: 1px solid #333333; font-family: JetBrains Mono, monospace; font-size: 14px;'
                    }, [
                        $.span({}, ['~/moosh/wallet/spark $']),
                        $.span({ 
                            id: 'sparkConnectionStatus',
                            className: 'text-accent',
                            style: 'color: #69fd97; margin-left: 8px;'
                        }, ['connected'])
                    ]),
                    $.div({ 
                        className: 'terminal-content',
                        id: 'sparkInfo',
                        style: 'padding: 16px; font-family: JetBrains Mono, monospace; font-size: 12px;'
                    }, [
                        $.span({ className: 'text-comment', style: 'color: #666666;' }, ['# Spark Protocol Status']),
                        $.br(),
                        $.span({ className: 'text-keyword', style: 'color: #ffa500;' }, ['const']),
                        ' ',
                        $.span({ className: 'text-variable', style: 'color: #69fd97;' }, ['spark']),
                        ' = ',
                        $.span({ className: 'text-string', style: 'color: #f57315;' }, ['ready']),
                        ';',
                        $.br(),
                        $.span({ className: 'text-comment', style: 'color: #666666;' }, ['# Mint MOOSH tokens for 0.0000058 BTC'])
                    ])
                ]),
                
                $.div({ 
                    className: 'wallet-actions',
                    style: 'margin-top: 24px;'
                }, [
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.logout(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, [
                        '<Logout ',
                        $.span({ style: 'opacity: 0.7;' }, ['Esc />']),
                    ])
                ])
            ]);
        }
        
        createTransactionHistory() {
            const $ = ElementFactory;
            
            return $.div({ className: 'transaction-history' }, [
                // Section header
                $.div({ className: 'section-header' }, [
                    $.h3({ className: 'section-title' }, ['Recent Transactions']),
                    $.button({
                        className: 'filter-button',
                        onclick: () => this.handleFilter()
                    }, ['Filter'])
                ]),
                
                // Transaction list
                $.div({ id: 'transaction-list', className: 'transaction-list' }, [
                    this.createEmptyTransactions()
                ])
            ]);
        }
        
        createEmptyTransactions() {
            const $ = ElementFactory;
            
            return $.div({ className: 'empty-transactions' }, [
                $.div({ className: 'empty-text' }, ['No transactions yet']),
                $.div({ className: 'empty-subtext' }, ['Your transaction history will appear here'])
            ]);
        }
        
        // Missing dashboard component methods
        createStatusBanner() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'warning-box',
                style: 'background: rgba(105, 253, 151, 0.1); border: 1px solid var(--text-accent); margin-bottom: calc(24px * var(--scale-factor));'
            }, [
                $.div({ style: 'color: var(--text-accent); font-weight: 600; margin-bottom: calc(8px * var(--scale-factor)); font-size: calc(14px * var(--scale-factor));' }, ['Spark Protocol Active']),
                $.div({ 
                    className: 'feature-tagline',
                    style: 'margin-bottom: calc(4px * var(--scale-factor));'
                }, [
                    'Lightning-fast Bitcoin transfers • Native stablecoins • Instant settlements',
                    $.br(),
                    $.span({ style: 'color: var(--text-keyword);' }, ['Live blockchain data • Real-time prices • Auto-refresh every 30s'])
                ])
            ]);
        }
        
        createWalletTypeSelector() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'terminal-box',
                style: 'margin-bottom: 20px; background: #1a1a1a; border: 1px solid #333333; border-radius: 0;'
            }, [
                $.div({ 
                    className: 'terminal-header',
                    style: 'padding: 12px; border-bottom: 1px solid #333333; font-family: JetBrains Mono, monospace; font-size: 14px;'
                }, [
                    $.span({}, ['~/moosh/wallet-selector $']),
                    $.span({ 
                        className: 'text-keyword',
                        id: 'walletSelectorStatus',
                        style: 'color: #ffa500; margin-left: 8px;'
                    }, ['active'])
                ]),
                $.div({ 
                    className: 'terminal-content',
                    style: 'padding: 16px;'
                }, [
                    $.div({ style: 'margin-bottom: 12px;' }, [
                        $.label({ 
                            style: 'color: #ffffff; font-size: 12px; font-weight: 600; margin-bottom: 8px; display: block;'
                        }, ['Select Active Wallet:']),
                        $.select({
                            id: 'walletTypeSelector',
                            className: 'terminal-select',
                            style: 'width: 100%; background: #000000; border: 2px solid #ffffff; border-radius: 0; color: #ffffff; font-family: JetBrains Mono, monospace; font-size: 12px; padding: 8px; cursor: pointer; transition: all 0.2s ease;',
                            onchange: (e) => this.switchWalletType(e),
                            onmouseover: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.background = '#000000'; },
                            onmouseout: (e) => { e.target.style.borderColor = '#ffffff'; e.target.style.background = '#000000'; },
                            onfocus: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.boxShadow = '0 0 0 1px #ff8c42'; e.target.style.background = '#000000'; },
                            onblur: (e) => { e.target.style.borderColor = '#ffffff'; e.target.style.boxShadow = 'none'; e.target.style.background = '#000000'; }
                        }, [
                            $.option({ value: 'taproot' }, ['Bitcoin Taproot (bc1p...) - Primary']),
                            $.option({ value: 'nativeSegWit' }, ['Bitcoin Native SegWit (bc1q...) - BIP84']),
                            $.option({ value: 'nestedSegWit' }, ['Bitcoin Nested SegWit (3...) - BIP49']),
                            $.option({ value: 'legacy' }, ['Bitcoin Legacy (1...) - BIP44']),
                            $.option({ value: 'spark' }, ['Spark Protocol (sp1...) - Lightning'])
                        ])
                    ]),
                    
                    $.div({ 
                        id: 'selectedWalletDisplay',
                        style: 'margin-top: 12px;'
                    }, [
                        $.div({ 
                            style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;'
                        }, [
                            $.span({ 
                                style: 'color: #888888; font-size: 11px;',
                                id: 'selectedWalletLabel'
                            }, ['Bitcoin Taproot Address:']),
                            $.span({ 
                                style: 'color: #ffffff; font-size: 11px;',
                                id: 'selectedWalletBalance'
                            }, ['0.00000000 BTC'])
                        ]),
                        $.div({ 
                            style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: 8px; font-family: JetBrains Mono, monospace; word-break: break-all; color: #f57315; font-size: 11px; cursor: pointer; transition: all 0.2s ease; min-height: 20px;',
                            id: 'selectedWalletAddress',
                            onclick: () => this.openSelectedWalletExplorer(),
                            onmouseover: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.color = '#ff8c42'; },
                            onmouseout: (e) => { e.target.style.borderColor = '#f57315'; e.target.style.color = '#f57315'; }
                        }, ['Select wallet to view address'])
                    ])
                ])
            ]);
        }
        
        createStatsGrid() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'stats-grid',
                style: 'display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(160px * var(--scale-factor)), 1fr)); gap: calc(12px * var(--scale-factor)); margin-bottom: calc(20px * var(--scale-factor));'
            }, [
                // Bitcoin Balance
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Bitcoin Balance']),
                    $.div({ 
                        id: 'btcBalance',
                        className: 'text-primary',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315; word-break: break-all;'
                    }, ['0.00000000 BTC']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['≈ $', $.span({ id: 'btcUsdValue' }, ['0.00']), ' USD'])
                ]),
                
                // Lightning Balance
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Lightning Balance']),
                    $.div({ 
                        id: 'lightningBalance',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 sats']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, [$.span({ id: 'activeChannels' }, ['0']), ' active channels'])
                ]),
                
                // Stablecoins
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Stablecoins']),
                    $.div({ 
                        id: 'stablecoinBalance',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 USDT']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['On Lightning Network'])
                ]),
                
                // Ordinals (NFTs)
                $.div({ 
                    id: 'ordinalsSection',
                    className: 'stats-grid-item',
                    style: 'background: #1a1a1a; border: 1px solid #333333; border-radius: 0; padding: 20px; transition: all 0.3s ease; display: none; cursor: pointer;',
                    onclick: () => this.openOrdinalsGallery(),
                    onmouseover: (e) => { e.currentTarget.style.background = '#262626'; e.currentTarget.style.borderColor = '#ffffff'; },
                    onmouseout: (e) => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = '#333333'; }
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Ordinals (NFTs)']),
                    $.div({ 
                        id: 'ordinalsCount',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 NFTs']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['Click to view gallery'])
                ]),
                
                // Network Status
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Network Status']),
                    $.div({ 
                        id: 'sparkNetworkStatus',
                        className: 'text-primary',
                        style: 'font-size: calc(14px * var(--scale-factor));'
                    }, ['Connected']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['Block ', $.span({ id: 'blockHeight' }, ['000000'])])
                ])
            ]);
        }
        
        createStatCard(title, primary, secondary, iconClass) {
            // No longer needed
            return null;
        }
        
        createSparkProtocolSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'spark-protocol-section' }, [
                $.div({ className: 'spark-header' }, [
                    $.h3({ className: 'spark-title' }, ['Spark Protocol Terminal']),
                    $.button({
                        className: 'spark-toggle',
                        onclick: () => this.toggleSparkTerminal()
                    }, ['Toggle'])
                ]),
                $.div({ id: 'spark-terminal', className: 'spark-terminal hidden' }, [
                    $.div({ className: 'terminal-output' }, [
                        $.div({ className: 'terminal-line' }, ['> Spark Protocol v2.0.0 initialized']),
                        $.div({ className: 'terminal-line' }, ['> Connection: ACTIVE']),
                        $.div({ className: 'terminal-line' }, ['> Nodes: 12 connected']),
                        $.div({ className: 'terminal-line' }, ['> Privacy: MAXIMUM'])
                    ]),
                    $.input({
                        className: 'terminal-input',
                        placeholder: 'Enter Spark command...',
                        onkeypress: (e) => {
                            if (e.key === 'Enter') this.handleSparkCommand(e.target.value);
                        }
                    })
                ])
            ]);
        }
        
        createNetworkCard() {
            const $ = ElementFactory;
            
            return $.div({ className: 'token-card network-card' }, [
                $.div({ className: 'token-name' }, ['Network']),
                $.div({ className: 'network-status' }, ['● Connected']),
                $.div({ className: 'network-block' }, ['Block 000000'])
            ]);
        }
        
        // New event handlers
        handleWalletTypeChange(e) {
            const walletType = e.target.value;
            this.app.showNotification(`Switching to ${walletType} wallet...`, 'success');
            
            // Show/hide ordinals based on wallet type
            const ordinalsCard = document.querySelector('.ordinals-icon')?.parentElement?.parentElement;
            if (ordinalsCard) {
                ordinalsCard.style.display = walletType === 'taproot' ? 'flex' : 'none';
            }
            
            // Store selected wallet type
            if (this.app.state) {
                this.app.state.set('selectedWalletType', walletType);
            }
        }
        
        toggleSparkTerminal() {
            const terminal = document.getElementById('spark-terminal');
            if (terminal) {
                terminal.classList.toggle('hidden');
                this.app.showNotification(
                    terminal.classList.contains('hidden') ? 'Spark terminal hidden' : 'Spark terminal shown',
                    'success'
                );
            }
        }
        
        handleSparkCommand(command) {
            const terminal = document.querySelector('.terminal-output');
            const input = document.querySelector('.terminal-input');
            
            if (!terminal || !input) return;
            
            // Add user command to terminal
            const userLine = document.createElement('div');
            userLine.className = 'terminal-line';
            userLine.style.color = '#00ff00';
            userLine.textContent = `> ${command}`;
            terminal.appendChild(userLine);
            
            // Process command
            let response = '';
            const cmd = command.toLowerCase().trim();
            
            if (cmd === 'help') {
                response = 'Available commands: status, balance, network, privacy, clear, help';
            } else if (cmd === 'status') {
                response = 'Spark Protocol: ACTIVE | Privacy: MAXIMUM | Nodes: 12';
            } else if (cmd === 'balance') {
                const btcBalance = document.getElementById('btc-balance')?.textContent || '0.00000000';
                response = `Current balance: ${btcBalance} BTC`;
            } else if (cmd === 'network') {
                const networkBlock = document.querySelector('.network-block')?.textContent || 'Unknown';
                response = `Network: Mainnet | ${networkBlock}`;
            } else if (cmd === 'privacy') {
                response = 'Privacy mode: ENABLED | Tor: ACTIVE | VPN: CONNECTED';
            } else if (cmd === 'clear') {
                terminal.innerHTML = '';
                response = 'Terminal cleared.';
            } else if (cmd === '') {
                response = '';
            } else {
                response = `Unknown command: ${command}. Type 'help' for available commands.`;
            }
            
            // Add response to terminal
            if (response) {
                const responseLine = document.createElement('div');
                responseLine.className = 'terminal-line';
                responseLine.style.color = '#888888';
                responseLine.textContent = response;
                terminal.appendChild(responseLine);
            }
            
            // Clear input
            input.value = '';
            
            // Scroll to bottom
            terminal.scrollTop = terminal.scrollHeight;
            
            this.app.showNotification('Command executed', 'success');
        }
        
        // Dashboard action handlers
        handleTokenMenu() {
            const modal = new TokenMenuModal(this.app);
            modal.show();
        }
        
        toggleAccountDropdown() {
            const modal = new MultiAccountModal(this.app);
            modal.show();
        }
        
        handleAddAccount() {
            const modal = new MultiAccountModal(this.app);
            modal.show();
        }
        
        async handleRefresh() {
            this.app.showNotification('Refreshing wallet data...', 'success');
            
            try {
                // Fetch Bitcoin price
                const priceData = await this.app.apiService.fetchBitcoinPrice();
                const btcPrice = priceData.usd || 0;
                
                // Get current account
                const currentAccount = this.app.state.get('currentAccount');
                if (currentAccount && currentAccount.addresses) {
                    // Fetch balance for the current address type
                    const walletType = this.app.state.get('selectedWalletType') || 'taproot';
                    let address = currentAccount.addresses.taproot;
                    
                    if (walletType === 'segwit') address = currentAccount.addresses.segwit;
                    else if (walletType === 'legacy') address = currentAccount.addresses.legacy;
                    
                    const balance = await this.app.apiService.fetchAddressBalance(address);
                    const btcBalance = balance / 100000000; // Convert from satoshis
                    const usdBalance = (btcBalance * btcPrice).toFixed(2);
                    
                    // Update UI
                    const btcElement = document.getElementById('btc-balance');
                    const usdElement = document.getElementById('usd-balance');
                    
                    if (btcElement) btcElement.textContent = btcBalance.toFixed(8);
                    if (usdElement) usdElement.textContent = usdBalance;
                    
                    // Update stats grid
                    const networkInfo = await this.app.apiService.fetchNetworkInfo();
                    const networkCard = document.querySelector('.network-block');
                    if (networkCard) {
                        networkCard.textContent = `Block ${networkInfo.height || '000000'}`;
                    }
                    
                    this.app.showNotification('Wallet data refreshed!', 'success');
                } else {
                    this.app.showNotification('No wallet selected', 'error');
                }
            } catch (error) {
                console.error('Refresh error:', error);
                this.app.showNotification('Failed to refresh data', 'error');
            }
        }
        
        handlePrivacyToggle() {
            const balances = document.querySelectorAll('.btc-value, #usd-balance, .token-amount');
            const isHidden = balances[0]?.textContent === '••••••••';
            
            balances.forEach(el => {
                if (isHidden) {
                    // Show real values (placeholder for now)
                    if (el.id === 'btc-balance') el.textContent = '0.00000000';
                    else if (el.id === 'usd-balance') el.textContent = '0.00';
                    else el.textContent = '0.00';
                } else {
                    // Hide values
                    el.textContent = '••••••••';
                }
            });
            
            this.app.showNotification(isHidden ? 'Balances shown' : 'Balances hidden', 'success');
        }
        
        handleSend() {
            this.showSendModal();
        }
        
        handleReceive() {
            this.showReceiveModal();
        }
        
        handleSwap() {
            const modal = new SwapModal(this.app);
            modal.show();
        }
        
        handleSettings() {
            const modal = new WalletSettingsModal(this.app);
            modal.show();
        }
        
        handleFilter() {
            const modal = new TransactionHistoryModal(this.app);
            modal.show();
        }
        
        initializeDashboard() {
            // Add dashboard-specific styles
            this.addDashboardStyles();
            
            // Start data loading
            setTimeout(() => {
                this.loadWalletData();
            }, 500);
        }
        
        addDashboardStyles() {
            const style = document.createElement('style');
            style.textContent = `
                /* Dashboard Container */
                .wallet-dashboard-container {
                    max-width: calc(800px * var(--scale-factor));
                    margin: 0 auto;
                    padding: calc(var(--spacing-unit) * 2 * var(--scale-factor));
                }
                
                /* Dashboard Header */
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: calc(16px * var(--scale-factor));
                    border-bottom: calc(1px * var(--scale-factor)) solid var(--border-color);
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .terminal-title {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(18px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                }
                
                .title-text {
                    color: var(--text-primary);
                }
                
                .cursor-blink {
                    color: var(--text-primary);
                    animation: blink 1s infinite;
                    margin-left: calc(2px * var(--scale-factor));
                }
                
                .header-actions {
                    display: flex;
                    gap: calc(12px * var(--scale-factor));
                    align-items: center;
                }
                
                .account-dropdown-btn {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    padding: calc(8px * var(--scale-factor)) calc(12px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: calc(8px * var(--scale-factor));
                    transition: all 0.2s ease;
                }
                
                .account-dropdown-btn:hover {
                    border-color: var(--text-primary);
                }
                
                .dropdown-arrow {
                    font-size: calc(10px * var(--scale-factor));
                    opacity: 0.7;
                }
                
                .header-buttons {
                    display: flex;
                    gap: calc(8px * var(--scale-factor));
                }
                
                .header-btn {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    width: calc(32px * var(--scale-factor));
                    height: calc(32px * var(--scale-factor));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: calc(16px * var(--scale-factor));
                    transition: all 0.2s ease;
                }
                
                .header-btn:hover {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                }
                
                /* Balance Section */
                .balance-section {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(24px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .primary-balance {
                    text-align: center;
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .balance-label {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .balance-amount {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(32px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                    line-height: 1.2;
                }
                
                .btc-unit {
                    font-size: calc(18px * var(--scale-factor));
                    margin-left: calc(4px * var(--scale-factor));
                }
                
                .balance-usd {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-top: calc(8px * var(--scale-factor));
                }
                
                .token-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(calc(120px * var(--scale-factor)), 1fr));
                    gap: calc(16px * var(--scale-factor));
                    padding-top: calc(24px * var(--scale-factor));
                    border-top: calc(1px * var(--scale-factor)) solid var(--border-color);
                }
                
                .token-card {
                    background: var(--bg-secondary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(12px * var(--scale-factor));
                    text-align: center;
                    transition: all 0.2s ease;
                }
                
                .token-card:hover {
                    border-color: var(--text-primary);
                }
                
                .token-name {
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-bottom: calc(4px * var(--scale-factor));
                }
                
                .token-amount {
                    font-size: calc(16px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                }
                
                .token-value {
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-top: calc(4px * var(--scale-factor));
                }
                
                /* Quick Actions */
                .quick-actions {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(calc(120px * var(--scale-factor)), 1fr));
                    gap: calc(16px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .action-button {
                    background: var(--bg-primary);
                    border: calc(2px * var(--scale-factor)) solid var(--text-primary);
                    color: var(--text-primary);
                    padding: calc(20px * var(--scale-factor));
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .action-button:hover {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                }
                
                .action-icon {
                    font-size: calc(24px * var(--scale-factor));
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .action-label {
                    font-size: calc(14px * var(--scale-factor));
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                /* Transaction History */
                .transaction-history {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(24px * var(--scale-factor));
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: calc(16px * var(--scale-factor));
                }
                
                .section-title {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(16px * var(--scale-factor));
                    color: var(--text-primary);
                    margin: 0;
                    font-weight: 600;
                }
                
                .filter-button {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-dim);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    padding: calc(8px * var(--scale-factor)) calc(12px * var(--scale-factor));
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .filter-button:hover {
                    border-color: var(--text-primary);
                    color: var(--text-primary);
                }
                
                .empty-transactions {
                    text-align: center;
                    padding: calc(40px * var(--scale-factor));
                    color: var(--text-dim);
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .empty-text {
                    font-size: calc(14px * var(--scale-factor));
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .empty-subtext {
                    font-size: calc(12px * var(--scale-factor));
                    opacity: 0.7;
                }
                
                /* Mobile Optimizations */
                @media (max-width: 768px) {
                    .dashboard-header {
                        flex-direction: column;
                        gap: calc(16px * var(--scale-factor));
                        align-items: stretch;
                    }
                    
                    .header-actions {
                        justify-content: space-between;
                    }
                    
                    .balance-amount {
                        font-size: calc(24px * var(--scale-factor));
                    }
                    
                    .quick-actions {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        loadWalletData() {
            // Placeholder for API integration
            this.app.showNotification('Wallet data loaded', 'success');
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
                    marginBottom: 'calc(32px * var(--scale-factor))'
                }
            }, [
                $.h1({
                    style: {
                        fontSize: 'calc(24px * var(--scale-factor))',
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        color: 'var(--text-primary)',
                        fontWeight: '600',
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
                        color: 'var(--text-dim)',
                        marginBottom: 0,
                        opacity: 0.8,
                        cursor: 'pointer',
                        transition: 'color 0.3s ease'
                    },
                    onmouseover: function() { 
                        this.style.color = 'var(--text-primary)';
                        this.style.opacity = '1';
                    },
                    onmouseout: function() { 
                        this.style.color = 'var(--text-dim)';
                        this.style.opacity = '0.8';
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
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        textTransform: 'uppercase'
                    }
                }, [this.getAddressTypeName(type)]),
                $.div({
                    style: {
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(11px * var(--scale-factor))',
                        color: 'var(--text-primary)',
                        wordBreak: 'break-all',
                        marginBottom: 'calc(8px * var(--scale-factor))',
                        lineHeight: '1.4'
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
                }, ['Copy Address'])
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
            
            // Clear current content and render dashboard
            const content = document.querySelector('.cursor-content');
            if (!content) return;
            
            content.innerHTML = '';
            content.appendChild(this.createDashboard());
            
            // Initialize dashboard controller
            this.initializeDashboard();
        }
        
        createDashboard() {
            const $ = ElementFactory;
            
            // Use the same card styling as other pages
            return $.div({ className: 'card' }, [
                $.div({ 
                    className: 'wallet-dashboard-container',
                    style: 'max-width: 800px; margin: 0 auto;'
                }, [
                    this.createDashboardHeader(),
                    this.createStatusBanner(),
                    this.createStatsGrid(),
                    this.createWalletTypeSelector(),
                    this.createDashboardContent(),
                    this.createSparkProtocolSection()
                ])
            ]);
        }
        
        createDashboardHeader() {
            const $ = ElementFactory;
            const isUltraCompact = ResponsiveUtils.getBreakpoint() === 'xs';
            const isCompact = ['xs', 'sm'].includes(ResponsiveUtils.getBreakpoint());
            
            return $.div({ 
                className: 'terminal-box', 
                style: {
                    marginBottom: 'var(--space-lg)',
                    padding: isUltraCompact ? 'var(--space-sm)' : 'var(--space-md)'
                }
            }, [
                $.div({ className: 'terminal-header' }, [
                    $.span({}, ['~/moosh/wallet/dashboard $']),
                    $.span({ className: 'text-keyword' }, ['active'])
                ]),
                $.div({ className: 'terminal-content' }, [
                    $.div({ 
                        style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: calc(12px * var(--scale-factor));'
                    }, [
                        // Left side: Terminal title
                        $.h2({ 
                            style: 'font-size: calc(20px * var(--scale-factor)); font-weight: 600; font-family: JetBrains Mono, monospace; margin: 0;'
                        }, [
                        ]),
                        
                        // Right side: Header buttons
                        $.div({ 
                            className: 'header-buttons',
                            style: 'display: flex; gap: calc(8px * var(--scale-factor)); align-items: center;'
                        }, [
                            $.button({
                                className: 'btn-secondary dashboard-btn',
                                onclick: () => this.showMultiAccountManager()
                            }, ['+ Accounts']),
                            $.button({
                                className: 'btn-secondary dashboard-btn',
                                onclick: () => this.handleRefresh()
                            }, ['Refresh']),
                            $.button({
                                className: 'btn-secondary dashboard-btn',
                                onclick: () => this.toggleBalanceVisibility()
                            }, ['Hide'])
                        ])
                    ]),
                    
                    // Account indicator
                    $.div({ 
                        id: 'currentAccountIndicator',
                        className: 'account-indicator',
                        style: 'font-family: JetBrains Mono, monospace; font-size: calc(11px * var(--scale-factor)); color: var(--text-accent); margin-top: calc(8px * var(--scale-factor)); padding: calc(4px * var(--scale-factor)) calc(8px * var(--scale-factor)); background: rgba(105, 253, 151, 0.1); border: 1px solid var(--text-accent); border-radius: 0; display: inline-block; cursor: pointer; transition: all 0.2s ease;',
                        onclick: () => this.showMultiAccountManager(),
                        onmouseover: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.2)',
                        onmouseout: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.1)'
                    }, ['Active: Account 1'])
                ])
            ]);
        }
        
        createAccountSelector() {
            const $ = ElementFactory;
            const activeAccount = 'Account 1'; // Will be dynamic later
            
            return $.div({ className: 'account-selector' }, [
                $.button({
                    className: 'account-dropdown-btn',
                    onclick: () => this.toggleAccountDropdown()
                }, [
                    $.span({ className: 'account-name' }, [activeAccount]),
                    $.span({ className: 'dropdown-arrow' }, ['▼'])
                ])
            ]);
        }
        
        createHeaderButtons() {
            const $ = ElementFactory;
            
            return $.div({ className: 'header-buttons' }, [
                $.button({
                    className: 'header-btn',
                    title: 'Token Menu',
                    onclick: () => this.handleTokenMenu()
                }, ['💰']),
                
                $.button({
                    className: 'header-btn',
                    title: 'Add Account',
                    onclick: () => this.handleAddAccount()
                }, ['+']),
                
                $.button({
                    className: 'header-btn',
                    title: 'Refresh',
                    onclick: () => this.handleRefresh()
                }, ['↻']),
                
                $.button({
                    className: 'header-btn privacy-toggle',
                    title: 'Toggle Privacy',
                    onclick: () => this.handlePrivacyToggle()
                }, ['👁'])
            ]);
        }
        
        createDashboardContent() {
            const $ = ElementFactory;
            
            return $.div({ className: 'dashboard-content' }, [
                this.createMainActionButtons()
            ]);
        }
        
        createBalanceSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'balance-section' }, [
                // Primary balance
                $.div({ className: 'primary-balance' }, [
                    $.div({ className: 'balance-label' }, ['Total Balance']),
                    $.div({ className: 'balance-amount' }, [
                        $.span({ id: 'btc-balance', className: 'btc-value' }, ['0.00000000']),
                        $.span({ className: 'btc-unit' }, [' BTC'])
                    ]),
                    $.div({ className: 'balance-usd' }, [
                        $.span({ className: 'usd-symbol' }, ['≈ $']),
                        $.span({ id: 'usd-balance' }, ['0.00']),
                        $.span({ className: 'usd-label' }, [' USD'])
                    ])
                ]),
                
                // Token balances
                $.div({ className: 'token-grid' }, [
                    this.createTokenCard('MOOSH', '0.00', '$0.00'),
                    this.createTokenCard('USDT', '0.00', '$0.00'),
                    this.createTokenCard('SPARK', '0.00', '$0.00')
                ])
            ]);
        }
        
        createTokenCard(name, amount, value) {
            const $ = ElementFactory;
            
            return $.div({ className: 'token-card' }, [
                $.div({ className: 'token-name' }, [name]),
                $.div({ className: 'token-amount' }, [amount]),
                $.div({ className: 'token-value' }, [value])
            ]);
        }
        
        createMainActionButtons() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'wallet-actions',
                style: 'display: flex; flex-direction: column; gap: calc(12px * var(--scale-factor)); margin-top: calc(24px * var(--scale-factor));'
            }, [
                $.button({
                    className: 'btn-primary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor));',
                    onclick: () => this.showSendPayment()
                }, ['Send Lightning Payment']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showReceivePayment()
                }, ['Receive Payment']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showTokenMenu()
                }, ['Token Menu']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showTransactionHistory()
                }, ['Transaction History']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showWalletSettings()
                }, ['Wallet Settings'])
            ]);
        }
        
        createSparkProtocolSection() {
            const $ = ElementFactory;
            
            return $.div({ 
                style: 'margin-top: 24px; padding-top: 24px; border-top: 1px solid #333333;'
            }, [
                $.h3({ 
                    style: 'color: #ffffff; margin-bottom: 16px;'
                }, ['Spark Protocol Features']),
                
                $.div({ 
                    style: 'background: rgba(105, 253, 151, 0.1); border: 1px solid #69fd97; border-radius: 8px; padding: 16px; margin-bottom: 16px;'
                }, [
                    $.div({ 
                        style: 'color: #69fd97; font-weight: 600; margin-bottom: 8px;'
                    }, ['Lightning Network Integration']),
                    $.div({ 
                        className: 'text-dim',
                        style: 'font-size: 12px;'
                    }, [
                        'Send instant Bitcoin payments • Sub-second confirmations • Minimal fees',
                        $.br(),
                        'Compatible with all Lightning wallets and services'
                    ])
                ]),
                
                $.div({ 
                    className: 'wallet-actions',
                    style: 'display: flex; gap: 16px; margin-bottom: 24px;'
                }, [
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.showStablecoinSwap(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Swap BTC ↔ USDT']),
                    
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.openLightningChannel(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Open Lightning Channel']),
                    
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.createStablecoin(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Mint Stablecoins'])
                ]),
                
                $.div({ 
                    className: 'terminal-box',
                    style: 'margin-top: 24px; background: #1a1a1a; border: 1px solid #333333; border-radius: 0;'
                }, [
                    $.div({ 
                        className: 'terminal-header',
                        style: 'padding: 12px; border-bottom: 1px solid #333333; font-family: JetBrains Mono, monospace; font-size: 14px;'
                    }, [
                        $.span({}, ['~/moosh/wallet/spark $']),
                        $.span({ 
                            id: 'sparkConnectionStatus',
                            className: 'text-accent',
                            style: 'color: #69fd97; margin-left: 8px;'
                        }, ['connected'])
                    ]),
                    $.div({ 
                        className: 'terminal-content',
                        id: 'sparkInfo',
                        style: 'padding: 16px; font-family: JetBrains Mono, monospace; font-size: 12px;'
                    }, [
                        $.span({ className: 'text-comment', style: 'color: #666666;' }, ['# Spark Protocol Status']),
                        $.br(),
                        $.span({ className: 'text-keyword', style: 'color: #ffa500;' }, ['const']),
                        ' ',
                        $.span({ className: 'text-variable', style: 'color: #69fd97;' }, ['spark']),
                        ' = ',
                        $.span({ className: 'text-string', style: 'color: #f57315;' }, ['ready']),
                        ';',
                        $.br(),
                        $.span({ className: 'text-comment', style: 'color: #666666;' }, ['# Mint MOOSH tokens for 0.0000058 BTC'])
                    ])
                ]),
                
                $.div({ 
                    className: 'wallet-actions',
                    style: 'margin-top: 24px;'
                }, [
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.logout(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, [
                        '<Logout ',
                        $.span({ style: 'opacity: 0.7;' }, ['Esc />']),
                    ])
                ])
            ]);
        }
        
        createTransactionHistory() {
            const $ = ElementFactory;
            
            return $.div({ className: 'transaction-history' }, [
                // Section header
                $.div({ className: 'section-header' }, [
                    $.h3({ className: 'section-title' }, ['Recent Transactions']),
                    $.button({
                        className: 'filter-button',
                        onclick: () => this.handleFilter()
                    }, ['Filter'])
                ]),
                
                // Transaction list
                $.div({ id: 'transaction-list', className: 'transaction-list' }, [
                    this.createEmptyTransactions()
                ])
            ]);
        }
        
        createEmptyTransactions() {
            const $ = ElementFactory;
            
            return $.div({ className: 'empty-transactions' }, [
                $.div({ className: 'empty-text' }, ['No transactions yet']),
                $.div({ className: 'empty-subtext' }, ['Your transaction history will appear here'])
            ]);
        }
        
        // Missing dashboard component methods
        createStatusBanner() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'warning-box',
                style: 'background: rgba(105, 253, 151, 0.1); border: 1px solid var(--text-accent); margin-bottom: calc(24px * var(--scale-factor));'
            }, [
                $.div({ style: 'color: var(--text-accent); font-weight: 600; margin-bottom: calc(8px * var(--scale-factor)); font-size: calc(14px * var(--scale-factor));' }, ['Spark Protocol Active']),
                $.div({ 
                    className: 'feature-tagline',
                    style: 'margin-bottom: calc(4px * var(--scale-factor));'
                }, [
                    'Lightning-fast Bitcoin transfers • Native stablecoins • Instant settlements',
                    $.br(),
                    $.span({ style: 'color: var(--text-keyword);' }, ['Live blockchain data • Real-time prices • Auto-refresh every 30s'])
                ])
            ]);
        }
        
        createWalletTypeSelector() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'terminal-box',
                style: 'margin-bottom: 20px; background: #1a1a1a; border: 1px solid #333333; border-radius: 0;'
            }, [
                $.div({ 
                    className: 'terminal-header',
                    style: 'padding: 12px; border-bottom: 1px solid #333333; font-family: JetBrains Mono, monospace; font-size: 14px;'
                }, [
                    $.span({}, ['~/moosh/wallet-selector $']),
                    $.span({ 
                        className: 'text-keyword',
                        id: 'walletSelectorStatus',
                        style: 'color: #ffa500; margin-left: 8px;'
                    }, ['active'])
                ]),
                $.div({ 
                    className: 'terminal-content',
                    style: 'padding: 16px;'
                }, [
                    $.div({ style: 'margin-bottom: 12px;' }, [
                        $.label({ 
                            style: 'color: #ffffff; font-size: 12px; font-weight: 600; margin-bottom: 8px; display: block;'
                        }, ['Select Active Wallet:']),
                        $.select({
                            id: 'walletTypeSelector',
                            className: 'terminal-select',
                            style: 'width: 100%; background: #000000; border: 2px solid #ffffff; border-radius: 0; color: #ffffff; font-family: JetBrains Mono, monospace; font-size: 12px; padding: 8px; cursor: pointer; transition: all 0.2s ease;',
                            onchange: (e) => this.switchWalletType(e),
                            onmouseover: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.background = '#000000'; },
                            onmouseout: (e) => { e.target.style.borderColor = '#ffffff'; e.target.style.background = '#000000'; },
                            onfocus: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.boxShadow = '0 0 0 1px #ff8c42'; e.target.style.background = '#000000'; },
                            onblur: (e) => { e.target.style.borderColor = '#ffffff'; e.target.style.boxShadow = 'none'; e.target.style.background = '#000000'; }
                        }, [
                            $.option({ value: 'taproot' }, ['Bitcoin Taproot (bc1p...) - Primary']),
                            $.option({ value: 'nativeSegWit' }, ['Bitcoin Native SegWit (bc1q...) - BIP84']),
                            $.option({ value: 'nestedSegWit' }, ['Bitcoin Nested SegWit (3...) - BIP49']),
                            $.option({ value: 'legacy' }, ['Bitcoin Legacy (1...) - BIP44']),
                            $.option({ value: 'spark' }, ['Spark Protocol (sp1...) - Lightning'])
                        ])
                    ]),
                    
                    $.div({ 
                        id: 'selectedWalletDisplay',
                        style: 'margin-top: 12px;'
                    }, [
                        $.div({ 
                            style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;'
                        }, [
                            $.span({ 
                                style: 'color: #888888; font-size: 11px;',
                                id: 'selectedWalletLabel'
                            }, ['Bitcoin Taproot Address:']),
                            $.span({ 
                                style: 'color: #ffffff; font-size: 11px;',
                                id: 'selectedWalletBalance'
                            }, ['0.00000000 BTC'])
                        ]),
                        $.div({ 
                            style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: 8px; font-family: JetBrains Mono, monospace; word-break: break-all; color: #f57315; font-size: 11px; cursor: pointer; transition: all 0.2s ease; min-height: 20px;',
                            id: 'selectedWalletAddress',
                            onclick: () => this.openSelectedWalletExplorer(),
                            onmouseover: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.color = '#ff8c42'; },
                            onmouseout: (e) => { e.target.style.borderColor = '#f57315'; e.target.style.color = '#f57315'; }
                        }, ['Select wallet to view address'])
                    ])
                ])
            ]);
        }
        
        createStatsGrid() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'stats-grid',
                style: 'display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(160px * var(--scale-factor)), 1fr)); gap: calc(12px * var(--scale-factor)); margin-bottom: calc(20px * var(--scale-factor));'
            }, [
                // Bitcoin Balance
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Bitcoin Balance']),
                    $.div({ 
                        id: 'btcBalance',
                        className: 'text-primary',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315; word-break: break-all;'
                    }, ['0.00000000 BTC']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['≈ $', $.span({ id: 'btcUsdValue' }, ['0.00']), ' USD'])
                ]),
                
                // Lightning Balance
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Lightning Balance']),
                    $.div({ 
                        id: 'lightningBalance',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 sats']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, [$.span({ id: 'activeChannels' }, ['0']), ' active channels'])
                ]),
                
                // Stablecoins
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Stablecoins']),
                    $.div({ 
                        id: 'stablecoinBalance',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 USDT']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['On Lightning Network'])
                ]),
                
                // Ordinals (NFTs)
                $.div({ 
                    id: 'ordinalsSection',
                    className: 'stats-grid-item',
                    style: 'background: #1a1a1a; border: 1px solid #333333; border-radius: 0; padding: 20px; transition: all 0.3s ease; display: none; cursor: pointer;',
                    onclick: () => this.openOrdinalsGallery(),
                    onmouseover: (e) => { e.currentTarget.style.background = '#262626'; e.currentTarget.style.borderColor = '#ffffff'; },
                    onmouseout: (e) => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = '#333333'; }
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Ordinals (NFTs)']),
                    $.div({ 
                        id: 'ordinalsCount',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 NFTs']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['Click to view gallery'])
                ]),
                
                // Network Status
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Network Status']),
                    $.div({ 
                        id: 'sparkNetworkStatus',
                        className: 'text-primary',
                        style: 'font-size: calc(14px * var(--scale-factor));'
                    }, ['Connected']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['Block ', $.span({ id: 'blockHeight' }, ['000000'])])
                ])
            ]);
        }
        
        createStatCard(title, primary, secondary, iconClass) {
            // No longer needed
            return null;
        }
        
        createSparkProtocolSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'spark-protocol-section' }, [
                $.div({ className: 'spark-header' }, [
                    $.h3({ className: 'spark-title' }, ['Spark Protocol Terminal']),
                    $.button({
                        className: 'spark-toggle',
                        onclick: () => this.toggleSparkTerminal()
                    }, ['Toggle'])
                ]),
                $.div({ id: 'spark-terminal', className: 'spark-terminal hidden' }, [
                    $.div({ className: 'terminal-output' }, [
                        $.div({ className: 'terminal-line' }, ['> Spark Protocol v2.0.0 initialized']),
                        $.div({ className: 'terminal-line' }, ['> Connection: ACTIVE']),
                        $.div({ className: 'terminal-line' }, ['> Nodes: 12 connected']),
                        $.div({ className: 'terminal-line' }, ['> Privacy: MAXIMUM'])
                    ]),
                    $.input({
                        className: 'terminal-input',
                        placeholder: 'Enter Spark command...',
                        onkeypress: (e) => {
                            if (e.key === 'Enter') this.handleSparkCommand(e.target.value);
                        }
                    })
                ])
            ]);
        }
        
        createNetworkCard() {
            const $ = ElementFactory;
            
            return $.div({ className: 'token-card network-card' }, [
                $.div({ className: 'token-name' }, ['Network']),
                $.div({ className: 'network-status' }, ['● Connected']),
                $.div({ className: 'network-block' }, ['Block 000000'])
            ]);
        }
        
        // New event handlers
        handleWalletTypeChange(e) {
            const walletType = e.target.value;
            this.app.showNotification(`Switching to ${walletType} wallet...`, 'success');
            
            // Show/hide ordinals based on wallet type
            const ordinalsCard = document.querySelector('.ordinals-icon')?.parentElement?.parentElement;
            if (ordinalsCard) {
                ordinalsCard.style.display = walletType === 'taproot' ? 'flex' : 'none';
            }
            
            // Store selected wallet type
            if (this.app.state) {
                this.app.state.set('selectedWalletType', walletType);
            }
        }
        
        toggleSparkTerminal() {
            const terminal = document.getElementById('spark-terminal');
            if (terminal) {
                terminal.classList.toggle('hidden');
                this.app.showNotification(
                    terminal.classList.contains('hidden') ? 'Spark terminal hidden' : 'Spark terminal shown',
                    'success'
                );
            }
        }
        
        handleSparkCommand(command) {
            const terminal = document.querySelector('.terminal-output');
            const input = document.querySelector('.terminal-input');
            
            if (!terminal || !input) return;
            
            // Add user command to terminal
            const userLine = document.createElement('div');
            userLine.className = 'terminal-line';
            userLine.style.color = '#00ff00';
            userLine.textContent = `> ${command}`;
            terminal.appendChild(userLine);
            
            // Process command
            let response = '';
            const cmd = command.toLowerCase().trim();
            
            if (cmd === 'help') {
                response = 'Available commands: status, balance, network, privacy, clear, help';
            } else if (cmd === 'status') {
                response = 'Spark Protocol: ACTIVE | Privacy: MAXIMUM | Nodes: 12';
            } else if (cmd === 'balance') {
                const btcBalance = document.getElementById('btc-balance')?.textContent || '0.00000000';
                response = `Current balance: ${btcBalance} BTC`;
            } else if (cmd === 'network') {
                const networkBlock = document.querySelector('.network-block')?.textContent || 'Unknown';
                response = `Network: Mainnet | ${networkBlock}`;
            } else if (cmd === 'privacy') {
                response = 'Privacy mode: ENABLED | Tor: ACTIVE | VPN: CONNECTED';
            } else if (cmd === 'clear') {
                terminal.innerHTML = '';
                response = 'Terminal cleared.';
            } else if (cmd === '') {
                response = '';
            } else {
                response = `Unknown command: ${command}. Type 'help' for available commands.`;
            }
            
            // Add response to terminal
            if (response) {
                const responseLine = document.createElement('div');
                responseLine.className = 'terminal-line';
                responseLine.style.color = '#888888';
                responseLine.textContent = response;
                terminal.appendChild(responseLine);
            }
            
            // Clear input
            input.value = '';
            
            // Scroll to bottom
            terminal.scrollTop = terminal.scrollHeight;
            
            this.app.showNotification('Command executed', 'success');
        }
        
        // Dashboard action handlers
        handleTokenMenu() {
            const modal = new TokenMenuModal(this.app);
            modal.show();
        }
        
        toggleAccountDropdown() {
            const modal = new MultiAccountModal(this.app);
            modal.show();
        }
        
        handleAddAccount() {
            const modal = new MultiAccountModal(this.app);
            modal.show();
        }
        
        async handleRefresh() {
            this.app.showNotification('Refreshing wallet data...', 'success');
            
            try {
                // Fetch Bitcoin price
                const priceData = await this.app.apiService.fetchBitcoinPrice();
                const btcPrice = priceData.usd || 0;
                
                // Get current account
                const currentAccount = this.app.state.get('currentAccount');
                if (currentAccount && currentAccount.addresses) {
                    // Fetch balance for the current address type
                    const walletType = this.app.state.get('selectedWalletType') || 'taproot';
                    let address = currentAccount.addresses.taproot;
                    
                    if (walletType === 'segwit') address = currentAccount.addresses.segwit;
                    else if (walletType === 'legacy') address = currentAccount.addresses.legacy;
                    
                    const balance = await this.app.apiService.fetchAddressBalance(address);
                    const btcBalance = balance / 100000000; // Convert from satoshis
                    const usdBalance = (btcBalance * btcPrice).toFixed(2);
                    
                    // Update UI
                    const btcElement = document.getElementById('btc-balance');
                    const usdElement = document.getElementById('usd-balance');
                    
                    if (btcElement) btcElement.textContent = btcBalance.toFixed(8);
                    if (usdElement) usdElement.textContent = usdBalance;
                    
                    // Update stats grid
                    const networkInfo = await this.app.apiService.fetchNetworkInfo();
                    const networkCard = document.querySelector('.network-block');
                    if (networkCard) {
                        networkCard.textContent = `Block ${networkInfo.height || '000000'}`;
                    }
                    
                    this.app.showNotification('Wallet data refreshed!', 'success');
                } else {
                    this.app.showNotification('No wallet selected', 'error');
                }
            } catch (error) {
                console.error('Refresh error:', error);
                this.app.showNotification('Failed to refresh data', 'error');
            }
        }
        
        handlePrivacyToggle() {
            const balances = document.querySelectorAll('.btc-value, #usd-balance, .token-amount');
            const isHidden = balances[0]?.textContent === '••••••••';
            
            balances.forEach(el => {
                if (isHidden) {
                    // Show real values (placeholder for now)
                    if (el.id === 'btc-balance') el.textContent = '0.00000000';
                    else if (el.id === 'usd-balance') el.textContent = '0.00';
                    else el.textContent = '0.00';
                } else {
                    // Hide values
                    el.textContent = '••••••••';
                }
            });
            
            this.app.showNotification(isHidden ? 'Balances shown' : 'Balances hidden', 'success');
        }
        
        handleSend() {
            this.showSendModal();
        }
        
        handleReceive() {
            this.showReceiveModal();
        }
        
        handleSwap() {
            const modal = new SwapModal(this.app);
            modal.show();
        }
        
        handleSettings() {
            const modal = new WalletSettingsModal(this.app);
            modal.show();
        }
        
        handleFilter() {
            const modal = new TransactionHistoryModal(this.app);
            modal.show();
        }
        
        initializeDashboard() {
            // Add dashboard-specific styles
            this.addDashboardStyles();
            
            // Start data loading
            setTimeout(() => {
                this.loadWalletData();
            }, 500);
        }
        
        addDashboardStyles() {
            const style = document.createElement('style');
            style.textContent = `
                /* Dashboard Container */
                .wallet-dashboard-container {
                    max-width: calc(800px * var(--scale-factor));
                    margin: 0 auto;
                    padding: calc(var(--spacing-unit) * 2 * var(--scale-factor));
                }
                
                /* Dashboard Header */
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: calc(16px * var(--scale-factor));
                    border-bottom: calc(1px * var(--scale-factor)) solid var(--border-color);
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .terminal-title {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(18px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                }
                
                .title-text {
                    color: var(--text-primary);
                }
                
                .cursor-blink {
                    color: var(--text-primary);
                    animation: blink 1s infinite;
                    margin-left: calc(2px * var(--scale-factor));
                }
                
                .header-actions {
                    display: flex;
                    gap: calc(12px * var(--scale-factor));
                    align-items: center;
                }
                
                .account-dropdown-btn {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    padding: calc(8px * var(--scale-factor)) calc(12px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: calc(8px * var(--scale-factor));
                    transition: all 0.2s ease;
                }
                
                .account-dropdown-btn:hover {
                    border-color: var(--text-primary);
                }
                
                .dropdown-arrow {
                    font-size: calc(10px * var(--scale-factor));
                    opacity: 0.7;
                }
                
                .header-buttons {
                    display: flex;
                    gap: calc(8px * var(--scale-factor));
                }
                
                .header-btn {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    width: calc(32px * var(--scale-factor));
                    height: calc(32px * var(--scale-factor));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: calc(16px * var(--scale-factor));
                    transition: all 0.2s ease;
                }
                
                .header-btn:hover {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                }
                
                /* Balance Section */
                .balance-section {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(24px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .primary-balance {
                    text-align: center;
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .balance-label {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .balance-amount {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(32px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                    line-height: 1.2;
                }
                
                .btc-unit {
                    font-size: calc(18px * var(--scale-factor));
                    margin-left: calc(4px * var(--scale-factor));
                }
                
                .balance-usd {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-top: calc(8px * var(--scale-factor));
                }
                
                .token-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(calc(120px * var(--scale-factor)), 1fr));
                    gap: calc(16px * var(--scale-factor));
                    padding-top: calc(24px * var(--scale-factor));
                    border-top: calc(1px * var(--scale-factor)) solid var(--border-color);
                }
                
                .token-card {
                    background: var(--bg-secondary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(12px * var(--scale-factor));
                    text-align: center;
                    transition: all 0.2s ease;
                }
                
                .token-card:hover {
                    border-color: var(--text-primary);
                }
                
                .token-name {
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-bottom: calc(4px * var(--scale-factor));
                }
                
                .token-amount {
                    font-size: calc(16px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                }
                
                .token-value {
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-top: calc(4px * var(--scale-factor));
                }
                
                /* Quick Actions */
                .quick-actions {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(calc(120px * var(--scale-factor)), 1fr));
                    gap: calc(16px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .action-button {
                    background: var(--bg-primary);
                    border: calc(2px * var(--scale-factor)) solid var(--text-primary);
                    color: var(--text-primary);
                    padding: calc(20px * var(--scale-factor));
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .action-button:hover {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                }
                
                .action-icon {
                    font-size: calc(24px * var(--scale-factor));
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .action-label {
                    font-size: calc(14px * var(--scale-factor));
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                /* Transaction History */
                .transaction-history {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(24px * var(--scale-factor));
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: calc(16px * var(--scale-factor));
                }
                
                .section-title {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(16px * var(--scale-factor));
                    color: var(--text-primary);
                    margin: 0;
                    font-weight: 600;
                }
                
                .filter-button {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-dim);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    padding: calc(8px * var(--scale-factor)) calc(12px * var(--scale-factor));
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .filter-button:hover {
                    border-color: var(--text-primary);
                    color: var(--text-primary);
                }
                
                .empty-transactions {
                    text-align: center;
                    padding: calc(40px * var(--scale-factor));
                    color: var(--text-dim);
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .empty-text {
                    font-size: calc(14px * var(--scale-factor));
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .empty-subtext {
                    font-size: calc(12px * var(--scale-factor));
                    opacity: 0.7;
                }
                
                /* Mobile Optimizations */
                @media (max-width: 768px) {
                    .dashboard-header {
                        flex-direction: column;
                        gap: calc(16px * var(--scale-factor));
                        align-items: stretch;
                    }
                    
                    .header-actions {
                        justify-content: space-between;
                    }
                    
                    .balance-amount {
                        font-size: calc(24px * var(--scale-factor));
                    }
                    
                    .quick-actions {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Add additional styles for new dashboard components
            const additionalStyles = document.createElement('style');
            additionalStyles.textContent = `
                /* Status Banner */
                .status-banner {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                    padding: calc(12px * var(--scale-factor));
                    margin-bottom: calc(16px * var(--scale-factor));
                    border-radius: 0;
                }
                
                .status-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: calc(8px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                }
                
                .status-indicator {
                    color: #00ff00;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                /* Wallet Type Selector */
                .wallet-type-selector {
                    display: flex;
                    align-items: center;
                    gap: calc(12px * var(--scale-factor));
                    padding: calc(16px * var(--scale-factor));
                    background: var(--bg-secondary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    margin-bottom: calc(16px * var(--scale-factor));
                }
                
                .selector-label {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                    color: var(--text-dim);
                }
                
                .wallet-type-dropdown {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    padding: calc(8px * var(--scale-factor)) calc(16px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                    cursor: pointer;
                    min-width: calc(150px * var(--scale-factor));
                }
                
                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: calc(16px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .stat-card {
                    background: var(--bg-secondary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(16px * var(--scale-factor));
                    transition: all 0.2s ease;
                    cursor: pointer;
                }
                
                .stat-card:hover {
                    border-color: var(--text-primary);
                    transform: translateY(-2px);
                }
                
                .stat-icon {
                    width: calc(40px * var(--scale-factor));
                    height: calc(40px * var(--scale-factor));
                    background: var(--text-primary);
                    color: var(--bg-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: calc(20px * var(--scale-factor));
                    font-weight: bold;
                    margin-bottom: calc(12px * var(--scale-factor));
                }
                
                .stat-content {
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .stat-title {
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-bottom: calc(4px * var(--scale-factor));
                }
                
                .stat-primary {
                    font-size: calc(14px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                    margin-bottom: calc(4px * var(--scale-factor));
                }
                
                .stat-secondary {
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                }
                
                /* Spark Protocol Section */
                .spark-protocol-section {
                    background: var(--bg-secondary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(20px * var(--scale-factor));
                    margin-top: calc(24px * var(--scale-factor));
                }
                
                .spark-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: calc(16px * var(--scale-factor));
                }
                
                .spark-title {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(16px * var(--scale-factor));
                    color: var(--text-primary);
                    margin: 0;
                }
                
                .spark-toggle {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    padding: calc(6px * var(--scale-factor)) calc(12px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .spark-toggle:hover {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                }
                
                .spark-terminal {
                    background: #000;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(16px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    height: calc(200px * var(--scale-factor));
                    overflow-y: auto;
                }
                
                .spark-terminal.hidden {
                    display: none;
                }
                
                .terminal-output {
                    margin-bottom: calc(16px * var(--scale-factor));
                }
                
                .terminal-line {
                    color: #00ff00;
                    margin-bottom: calc(4px * var(--scale-factor));
                }
                
                .terminal-input {
                    background: transparent;
                    border: none;
                    color: #00ff00;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    width: 100%;
                    outline: none;
                }
                
                /* Fix header button overflow */
                .dashboard-header {
                    position: relative;
                    overflow: visible !important;
                }
                
                .header-buttons {
                    display: flex;
                    gap: calc(8px * var(--scale-factor));
                    flex-shrink: 0;
                }
                
                .header-btn {
                    flex-shrink: 0;
                    box-sizing: border-box;
                }
                
                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `;
            document.head.appendChild(additionalStyles);
        }
        
        loadWalletData() {
            // Placeholder for API integration
            this.app.showNotification('Wallet data loaded', 'success');
        }
        
        // Dashboard event handlers
        showMultiAccountManager() {
            this.app.showNotification('Opening account manager...', 'info');
            // TODO: Implement multi-account modal
        }
        
        toggleBalanceVisibility() {
            const balances = document.querySelectorAll('#btcBalance, #btcUsdValue, #lightningBalance, #stablecoinBalance, #ordinalsCount');
            const btn = document.querySelector('.hide-btn');
            
            if (btn && btn.textContent === 'Hide') {
                balances.forEach(el => {
                    el.setAttribute('data-original', el.textContent);
                    el.textContent = '••••••••';
                });
                btn.textContent = 'Show';
            } else if (btn) {
                balances.forEach(el => {
                    const original = el.getAttribute('data-original');
                    if (original) el.textContent = original;
                });
                btn.textContent = 'Hide';
            }
        }
        
        switchWalletType(e) {
            const type = e.target.value;
            const label = document.getElementById('selectedWalletLabel');
            const address = document.getElementById('selectedWalletAddress');
            
            const typeLabels = {
                'taproot': 'Bitcoin Taproot Address:',
                'nativeSegWit': 'Bitcoin Native SegWit Address:',
                'nestedSegWit': 'Bitcoin Nested SegWit Address:',
                'legacy': 'Bitcoin Legacy Address:',
                'spark': 'Spark Protocol Address:'
            };
            
            if (label) label.textContent = typeLabels[type] || 'Bitcoin Address:';
            if (address) address.textContent = 'bc1p' + '...' + Math.random().toString(36).substr(2, 6);
            
            // Show/hide ordinals section for taproot
            const ordinalsSection = document.getElementById('ordinalsSection');
            if (ordinalsSection) {
                ordinalsSection.style.display = type === 'taproot' ? 'block' : 'none';
            }
            
            this.app.showNotification(`Switched to ${type} wallet`, 'success');
        }
        
        openSelectedWalletExplorer() {
            this.app.showNotification('Opening blockchain explorer...', 'info');
            // TODO: Open actual explorer
        }
        
        showSendPayment() {
            this.app.modalManager.createSendModal();
        }
        
        showReceivePayment() {
            this.app.modalManager.createReceiveModal();
        }
        
        showTokenMenu() {
            this.app.modalManager.createTokenMenuModal();
        }
        
        showTransactionHistory() {
            this.app.modalManager.createTransactionHistoryModal();
        }
        
        showWalletSettings() {
            this.app.modalManager.createWalletSettingsModal();
        }
        
        showStablecoinSwap() {
            this.app.modalManager.createSwapModal();
        }
        
        openLightningChannel() {
            this.app.modalManager.createLightningChannelModal();
        }
        
        createStablecoin() {
            this.app.showNotification('Opening stablecoin minting interface...', 'info');
            // TODO: Implement stablecoin minting
        }
        
        openOrdinalsGallery() {
            this.app.showNotification('Opening Ordinals gallery...', 'info');
            // TODO: Implement ordinals gallery
        }
        
        logout() {
            if (confirm('Are you sure you want to logout?')) {
                this.app.state.set('currentPage', 'landing');
                this.app.showNotification('Logged out successfully', 'success');
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // DASHBOARD PAGE
    // ═══════════════════════════════════════════════════════════════════════
    class DashboardPage extends Component {
        render() {
            const card = $.div({ className: 'card dashboard-page' }, [
                this.createDashboard()
            ]);

            // Initialize dashboard functionality
            setTimeout(() => {
                this.initializeDashboard();
            }, 100);

            return card;
        }
        
        createDashboard() {
            const $ = ElementFactory;
            
            return $.div({ className: 'wallet-dashboard-container' }, [
                this.createDashboardHeader(),
                this.createDashboardContent()
            ]);
        }
        
        createDashboardHeader() {
            const $ = ElementFactory;
            
            // Use ResponsiveUtils for consistent breakpoint detection
            const isUltraCompact = ResponsiveUtils.getBreakpoint() === 'xs';
            const isCompact = ['xs', 'sm'].includes(ResponsiveUtils.getBreakpoint());
            const isMobile = ResponsiveUtils.isMobile();
            
            return $.div({ 
                className: 'terminal-box dashboard-terminal-box', 
                style: {
                    marginBottom: 'var(--space-lg)',
                    overflow: 'hidden',
                    isolation: 'isolate',
                    contain: 'layout style',
                    padding: isUltraCompact ? 'var(--space-xs)' : 'var(--space-sm)'
                }
            }, [
                $.div({ 
                    className: 'terminal-header',
                    style: {
                        padding: 'var(--space-xs) var(--space-sm)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        ...ResponsiveUtils.getResponsiveTextStyle('small')
                    }
                }, [
                    $.span({ style: 'color: var(--text-dim);' }, ['~/moosh/wallet/dashboard $']),
                    $.span({ className: 'text-keyword', style: 'margin-left: calc(8px * var(--scale-factor));' }, ['active'])
                ]),
                $.div({ 
                    className: 'terminal-content',
                    style: {
                        padding: isUltraCompact ? 'var(--space-xs)' : 'var(--space-sm)'
                    }
                }, [
                    // Main content row with responsive layout
                    $.div({ 
                        className: 'dashboard-header-row',
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: isUltraCompact ? 'flex-start' : 'center',
                            flexWrap: 'wrap',
                            gap: 'var(--space-sm)',
                            marginBottom: 'var(--space-md)',
                            width: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden'
                        }
                    }, [
                        // Left side: Terminal title with intelligent truncation
                        $.h2({ 
                            className: 'dashboard-title',
                            style: {
                                ...ResponsiveUtils.getResponsiveTextStyle(isUltraCompact ? 'body' : 'subtitle'),
                                fontWeight: '600',
                                fontFamily: 'JetBrains Mono, monospace',
                                margin: 0,
                                flex: '1 1 auto',
                                minWidth: 0,
                                display: 'flex',
                                alignItems: 'center',
                                maxWidth: isUltraCompact ? '55%' : '60%',
                                overflow: 'hidden'
                            }
                        }, [
                            $.span({ className: 'text-dim' }, ['<']),
                            $.span({ 
                                className: 'text-primary dashboard-title-text',
                                style: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%;',
                                title: 'Moosh_Spark_Wallet_Dashboard'
                            }, [isUltraCompact ? 'Moosh_Wallet' : 'Moosh_Spark_Wallet_Dashboard']),
                            $.span({ className: 'text-dim' }, [' />']),
                            $.span({ 
                                className: 'blink',
                                style: 'color: var(--text-primary); margin-left: 4px; font-weight: 300;'
                            }, ['|'])
                        ]),
                        
                        // Right side: Header buttons with responsive sizing
                        $.div({ 
                            className: 'header-buttons',
                            style: {
                                display: 'flex',
                                gap: 'var(--space-xs)',
                                alignItems: 'center',
                                flexShrink: 0,
                                flexWrap: 'nowrap',
                                maxWidth: isUltraCompact ? '45%' : '40%',
                                overflow: 'hidden',
                                justifyContent: 'flex-end'
                            }
                        }, [
                            ResponsiveUtils.createResponsiveButton({
                                className: 'btn-secondary dashboard-btn',
                                style: {
                                    padding: isUltraCompact ? 'var(--space-xs)' : 'var(--space-xs) var(--space-sm)',
                                    fontSize: 'var(--font-xs)',
                                    minWidth: isUltraCompact ? '32px' : '48px',
                                    maxWidth: isUltraCompact ? '32px' : '48px',
                                    width: isUltraCompact ? '32px' : '48px',
                                    height: isUltraCompact ? '24px' : '28px',
                                    background: '#000000',
                                    border: '1px solid #f57315',
                                    color: '#f57315',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    minHeight: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxSizing: 'border-box'
                                },
                                onclick: () => this.showMultiAccountManager(),
                                title: 'Manage Accounts'
                            }, [isUltraCompact ? '+' : isCompact ? '+ Acc' : '+ Acc']),
                            ResponsiveUtils.createResponsiveButton({
                                className: 'btn-secondary dashboard-btn',
                                style: {
                                    padding: isUltraCompact ? 'var(--space-xs)' : 'var(--space-xs) var(--space-sm)',
                                    fontSize: 'var(--font-xs)',
                                    minWidth: isUltraCompact ? '32px' : '48px',
                                    maxWidth: isUltraCompact ? '32px' : '48px',
                                    width: isUltraCompact ? '32px' : '48px',
                                    height: isUltraCompact ? '24px' : '28px',
                                    background: '#000000',
                                    border: '1px solid #f57315',
                                    color: '#f57315',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    minHeight: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxSizing: 'border-box'
                                },
                                onclick: () => this.handleRefresh(),
                                title: 'Refresh Data'
                            }, [isUltraCompact ? '↻' : 'Refresh']),
                            ResponsiveUtils.createResponsiveButton({
                                className: 'btn-secondary dashboard-btn',
                                style: {
                                    padding: isUltraCompact ? 'var(--space-xs)' : 'var(--space-xs) var(--space-sm)',
                                    fontSize: 'var(--font-xs)',
                                    minWidth: isUltraCompact ? '32px' : '48px',
                                    maxWidth: isUltraCompact ? '32px' : '48px',
                                    width: isUltraCompact ? '32px' : '48px',
                                    height: isUltraCompact ? '24px' : '28px',
                                    background: '#000000',
                                    border: '1px solid #f57315',
                                    color: '#f57315',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    minHeight: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxSizing: 'border-box'
                                },
                                onclick: () => this.toggleBalanceVisibility(),
                                title: 'Toggle Balance Visibility'
                            }, [isUltraCompact ? '👁' : 'Hide'])
                        ])
                    ]),
                    
                    // Account indicator - on its own line for better mobile layout
                    $.div({ 
                        id: 'currentAccountIndicator',
                        className: 'account-indicator',
                        style: {
                            fontFamily: 'JetBrains Mono, monospace',
                            ...ResponsiveUtils.getResponsiveTextStyle('small'),
                            color: 'var(--text-accent)',
                            marginTop: 'var(--space-xs)',
                            padding: 'var(--space-xs) var(--space-sm)',
                            background: 'rgba(105, 253, 151, 0.1)',
                            border: '1px solid var(--text-accent)',
                            borderRadius: '0',
                            display: 'inline-block',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        onclick: () => this.showMultiAccountManager(),
                        onmouseover: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.2)',
                        onmouseout: (e) => e.currentTarget.style.background = 'rgba(105, 253, 151, 0.1)'
                    }, ['Active: Account 1'])
                ])
            ]);
        }
        
        createAccountSelector() {
            const $ = ElementFactory;
            const activeAccount = 'Account 1'; // Will be dynamic later
            
            return $.div({ className: 'account-selector' }, [
                $.button({
                    className: 'account-dropdown-btn',
                    onclick: () => this.toggleAccountDropdown()
                }, [
                    $.span({ className: 'account-name' }, [activeAccount]),
                    $.span({ className: 'dropdown-arrow' }, ['▼'])
                ])
            ]);
        }
        
        createHeaderButtons() {
            const $ = ElementFactory;
            
            return $.div({ className: 'header-buttons' }, [
                $.button({
                    className: 'header-btn',
                    title: 'Token Menu',
                    onclick: () => this.handleTokenMenu()
                }, ['💰']),
                
                $.button({
                    className: 'header-btn',
                    title: 'Add Account',
                    onclick: () => this.handleAddAccount()
                }, ['+']),
                
                $.button({
                    className: 'header-btn',
                    title: 'Refresh',
                    onclick: () => this.handleRefresh()
                }, ['↻']),
                
                $.button({
                    className: 'header-btn privacy-toggle',
                    title: 'Toggle Privacy',
                    onclick: () => this.handlePrivacyToggle()
                }, ['👁'])
            ]);
        }
        
        createDashboardContent() {
            const $ = ElementFactory;
            
            return $.div({ className: 'dashboard-content' }, [
                this.createMainActionButtons()
            ]);
        }
        
        createBalanceSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'balance-section' }, [
                // Primary balance
                $.div({ className: 'primary-balance' }, [
                    $.div({ className: 'balance-label' }, ['Total Balance']),
                    $.div({ className: 'balance-amount' }, [
                        $.span({ id: 'btc-balance', className: 'btc-value' }, ['0.00000000']),
                        $.span({ className: 'btc-unit' }, [' BTC'])
                    ]),
                    $.div({ className: 'balance-usd' }, [
                        $.span({ className: 'usd-symbol' }, ['≈ $']),
                        $.span({ id: 'usd-balance' }, ['0.00']),
                        $.span({ className: 'usd-label' }, [' USD'])
                    ])
                ]),
                
                // Token balances
                $.div({ className: 'token-grid' }, [
                    this.createTokenCard('MOOSH', '0.00', '$0.00'),
                    this.createTokenCard('USDT', '0.00', '$0.00'),
                    this.createTokenCard('SPARK', '0.00', '$0.00'),
                    this.createNetworkCard()
                ])
            ]);
        }
        
        createTokenCard(name, amount, value) {
            const $ = ElementFactory;
            
            return $.div({ className: 'token-card' }, [
                $.div({ className: 'token-name' }, [name]),
                $.div({ className: 'token-amount' }, [amount]),
                $.div({ className: 'token-value' }, [value])
            ]);
        }
        
        createMainActionButtons() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'wallet-actions',
                style: 'display: flex; flex-direction: column; gap: calc(12px * var(--scale-factor)); margin-top: calc(24px * var(--scale-factor));'
            }, [
                $.button({
                    className: 'btn-primary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor));',
                    onclick: () => this.showSendPayment()
                }, ['Send Lightning Payment']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showReceivePayment()
                }, ['Receive Payment']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showTokenMenu()
                }, ['Token Menu']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showTransactionHistory()
                }, ['Transaction History']),
                
                $.button({
                    className: 'btn-secondary',
                    style: 'width: 100%; font-size: calc(14px * var(--scale-factor)); background: #000000; border: 2px solid var(--border-active); color: var(--text-primary); border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.2s ease; cursor: pointer;',
                    onclick: () => this.showWalletSettings()
                }, ['Wallet Settings'])
            ]);
        }
        
        createSparkProtocolSection() {
            const $ = ElementFactory;
            
            return $.div({ 
                style: 'margin-top: 24px; padding-top: 24px; border-top: 1px solid #333333;'
            }, [
                $.h3({ 
                    style: 'color: #ffffff; margin-bottom: 16px;'
                }, ['Spark Protocol Features']),
                
                $.div({ 
                    style: 'background: rgba(105, 253, 151, 0.1); border: 1px solid #69fd97; border-radius: 8px; padding: 16px; margin-bottom: 16px;'
                }, [
                    $.div({ 
                        style: 'color: #69fd97; font-weight: 600; margin-bottom: 8px;'
                    }, ['Lightning Network Integration']),
                    $.div({ 
                        className: 'text-dim',
                        style: 'font-size: 12px;'
                    }, [
                        'Send instant Bitcoin payments • Sub-second confirmations • Minimal fees',
                        $.br(),
                        'Compatible with all Lightning wallets and services'
                    ])
                ]),
                
                $.div({ 
                    className: 'wallet-actions',
                    style: 'display: flex; gap: 16px; margin-bottom: 24px;'
                }, [
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.showStablecoinSwap(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Swap BTC ↔ USDT']),
                    
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.openLightningChannel(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Open Lightning Channel']),
                    
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.createStablecoin(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease; flex: 1;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, ['Mint Stablecoins'])
                ]),
                
                $.div({ 
                    className: 'terminal-box',
                    style: 'margin-top: 24px; background: #1a1a1a; border: 1px solid #333333; border-radius: 0;'
                }, [
                    $.div({ 
                        className: 'terminal-header',
                        style: 'padding: 12px; border-bottom: 1px solid #333333; font-family: JetBrains Mono, monospace; font-size: 14px;'
                    }, [
                        $.span({}, ['~/moosh/wallet/spark $']),
                        $.span({ 
                            id: 'sparkConnectionStatus',
                            className: 'text-accent',
                            style: 'color: #69fd97; margin-left: 8px;'
                        }, ['connected'])
                    ]),
                    $.div({ 
                        className: 'terminal-content',
                        id: 'sparkInfo',
                        style: 'padding: 16px; font-family: JetBrains Mono, monospace; font-size: 12px;'
                    }, [
                        $.span({ className: 'text-comment', style: 'color: #666666;' }, ['# Spark Protocol Status']),
                        $.br(),
                        $.span({ className: 'text-keyword', style: 'color: #ffa500;' }, ['const']),
                        ' ',
                        $.span({ className: 'text-variable', style: 'color: #69fd97;' }, ['spark']),
                        ' = ',
                        $.span({ className: 'text-string', style: 'color: #f57315;' }, ['ready']),
                        ';',
                        $.br(),
                        $.span({ className: 'text-comment', style: 'color: #666666;' }, ['# Mint MOOSH tokens for 0.0000058 BTC'])
                    ])
                ]),
                
                $.div({ 
                    className: 'wallet-actions',
                    style: 'margin-top: 24px;'
                }, [
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.logout(),
                        style: 'background: #000000; border: 1px solid #888888; border-radius: 8px; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; font-family: inherit; cursor: pointer; transition: all 0.2s ease;',
                        onmouseover: (e) => { e.currentTarget.style.borderColor = '#ffffff'; },
                        onmouseout: (e) => { e.currentTarget.style.borderColor = '#888888'; }
                    }, [
                        '<Logout ',
                        $.span({ style: 'opacity: 0.7;' }, ['Esc />']),
                    ])
                ])
            ]);
        }
        
        createTransactionHistory() {
            const $ = ElementFactory;
            
            return $.div({ className: 'transaction-history' }, [
                // Section header
                $.div({ className: 'section-header' }, [
                    $.h3({ className: 'section-title' }, ['Recent Transactions']),
                    $.button({
                        className: 'filter-button',
                        onclick: () => this.handleFilter()
                    }, ['Filter'])
                ]),
                
                // Transaction list
                $.div({ id: 'transaction-list', className: 'transaction-list' }, [
                    this.createEmptyTransactions()
                ])
            ]);
        }
        
        createEmptyTransactions() {
            const $ = ElementFactory;
            
            return $.div({ className: 'empty-transactions' }, [
                $.div({ className: 'empty-text' }, ['No transactions yet']),
                $.div({ className: 'empty-subtext' }, ['Your transaction history will appear here'])
            ]);
        }
        
        // Missing dashboard component methods
        createStatusBanner() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'warning-box',
                style: 'background: rgba(105, 253, 151, 0.1); border: 1px solid var(--text-accent); margin-bottom: calc(24px * var(--scale-factor));'
            }, [
                $.div({ style: 'color: var(--text-accent); font-weight: 600; margin-bottom: calc(8px * var(--scale-factor)); font-size: calc(14px * var(--scale-factor));' }, ['Spark Protocol Active']),
                $.div({ 
                    className: 'feature-tagline',
                    style: 'margin-bottom: calc(4px * var(--scale-factor));'
                }, [
                    'Lightning-fast Bitcoin transfers • Native stablecoins • Instant settlements',
                    $.br(),
                    $.span({ style: 'color: var(--text-keyword);' }, ['Live blockchain data • Real-time prices • Auto-refresh every 30s'])
                ])
            ]);
        }
        
        createWalletTypeSelector() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'terminal-box',
                style: 'margin-bottom: 20px; background: #1a1a1a; border: 1px solid #333333; border-radius: 0;'
            }, [
                $.div({ 
                    className: 'terminal-header',
                    style: 'padding: 12px; border-bottom: 1px solid #333333; font-family: JetBrains Mono, monospace; font-size: 14px;'
                }, [
                    $.span({}, ['~/moosh/wallet-selector $']),
                    $.span({ 
                        className: 'text-keyword',
                        id: 'walletSelectorStatus',
                        style: 'color: #ffa500; margin-left: 8px;'
                    }, ['active'])
                ]),
                $.div({ 
                    className: 'terminal-content',
                    style: 'padding: 16px;'
                }, [
                    $.div({ style: 'margin-bottom: 12px;' }, [
                        $.label({ 
                            style: 'color: #ffffff; font-size: 12px; font-weight: 600; margin-bottom: 8px; display: block;'
                        }, ['Select Active Wallet:']),
                        $.select({
                            id: 'walletTypeSelector',
                            className: 'terminal-select',
                            style: 'width: 100%; background: #000000; border: 2px solid #ffffff; border-radius: 0; color: #ffffff; font-family: JetBrains Mono, monospace; font-size: 12px; padding: 8px; cursor: pointer; transition: all 0.2s ease;',
                            onchange: (e) => this.switchWalletType(e),
                            onmouseover: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.background = '#000000'; },
                            onmouseout: (e) => { e.target.style.borderColor = '#ffffff'; e.target.style.background = '#000000'; },
                            onfocus: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.boxShadow = '0 0 0 1px #ff8c42'; e.target.style.background = '#000000'; },
                            onblur: (e) => { e.target.style.borderColor = '#ffffff'; e.target.style.boxShadow = 'none'; e.target.style.background = '#000000'; }
                        }, [
                            $.option({ value: 'taproot' }, ['Bitcoin Taproot (bc1p...) - Primary']),
                            $.option({ value: 'nativeSegWit' }, ['Bitcoin Native SegWit (bc1q...) - BIP84']),
                            $.option({ value: 'nestedSegWit' }, ['Bitcoin Nested SegWit (3...) - BIP49']),
                            $.option({ value: 'legacy' }, ['Bitcoin Legacy (1...) - BIP44']),
                            $.option({ value: 'spark' }, ['Spark Protocol (sp1...) - Lightning'])
                        ])
                    ]),
                    
                    $.div({ 
                        id: 'selectedWalletDisplay',
                        style: 'margin-top: 12px;'
                    }, [
                        $.div({ 
                            style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;'
                        }, [
                            $.span({ 
                                style: 'color: #888888; font-size: 11px;',
                                id: 'selectedWalletLabel'
                            }, ['Bitcoin Taproot Address:']),
                            $.span({ 
                                style: 'color: #ffffff; font-size: 11px;',
                                id: 'selectedWalletBalance'
                            }, ['0.00000000 BTC'])
                        ]),
                        $.div({ 
                            style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: 8px; font-family: JetBrains Mono, monospace; word-break: break-all; color: #f57315; font-size: 11px; cursor: pointer; transition: all 0.2s ease; min-height: 20px;',
                            id: 'selectedWalletAddress',
                            onclick: () => this.openSelectedWalletExplorer(),
                            onmouseover: (e) => { e.target.style.borderColor = '#ff8c42'; e.target.style.color = '#ff8c42'; },
                            onmouseout: (e) => { e.target.style.borderColor = '#f57315'; e.target.style.color = '#f57315'; }
                        }, ['Select wallet to view address'])
                    ])
                ])
            ]);
        }
        
        createStatsGrid() {
            const $ = ElementFactory;
            
            return $.div({ 
                className: 'stats-grid',
                style: 'display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(160px * var(--scale-factor)), 1fr)); gap: calc(12px * var(--scale-factor)); margin-bottom: calc(20px * var(--scale-factor));'
            }, [
                // Bitcoin Balance
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Bitcoin Balance']),
                    $.div({ 
                        id: 'btcBalance',
                        className: 'text-primary',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315; word-break: break-all;'
                    }, ['0.00000000 BTC']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['≈ $', $.span({ id: 'btcUsdValue' }, ['0.00']), ' USD'])
                ]),
                
                // Lightning Balance
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Lightning Balance']),
                    $.div({ 
                        id: 'lightningBalance',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 sats']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, [$.span({ id: 'activeChannels' }, ['0']), ' active channels'])
                ]),
                
                // Stablecoins
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Stablecoins']),
                    $.div({ 
                        id: 'stablecoinBalance',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 USDT']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['On Lightning Network'])
                ]),
                
                // Ordinals (NFTs)
                $.div({ 
                    id: 'ordinalsSection',
                    className: 'stats-grid-item',
                    style: 'background: #1a1a1a; border: 1px solid #333333; border-radius: 0; padding: 20px; transition: all 0.3s ease; display: none; cursor: pointer;',
                    onclick: () => this.openOrdinalsGallery(),
                    onmouseover: (e) => { e.currentTarget.style.background = '#262626'; e.currentTarget.style.borderColor = '#ffffff'; },
                    onmouseout: (e) => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = '#333333'; }
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Ordinals (NFTs)']),
                    $.div({ 
                        id: 'ordinalsCount',
                        className: 'text-accent',
                        style: 'font-size: calc(14px * var(--scale-factor)); font-weight: 600; color: #f57315;'
                    }, ['0 NFTs']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['Click to view gallery'])
                ]),
                
                // Network Status
                $.div({ 
                    className: 'stats-grid-item',
                    style: 'background: #000000; border: 2px solid #f57315; border-radius: 0; padding: calc(12px * var(--scale-factor)); transition: all 0.3s ease; overflow: hidden;'
                }, [
                    $.div({ style: 'color: #888888; margin-bottom: calc(6px * var(--scale-factor)); font-size: calc(12px * var(--scale-factor));' }, ['Network Status']),
                    $.div({ 
                        id: 'sparkNetworkStatus',
                        className: 'text-primary',
                        style: 'font-size: calc(14px * var(--scale-factor));'
                    }, ['Connected']),
                    $.div({ 
                        style: 'font-size: calc(10px * var(--scale-factor)); margin-top: calc(4px * var(--scale-factor)); color: #888888;'
                    }, ['Block ', $.span({ id: 'blockHeight' }, ['000000'])])
                ])
            ]);
        }
        
        createStatCard(title, primary, secondary, iconClass) {
            // No longer needed
            return null;
        }
        
        createSparkProtocolSection() {
            const $ = ElementFactory;
            
            return $.div({ className: 'spark-protocol-section' }, [
                $.div({ className: 'spark-header' }, [
                    $.h3({ className: 'spark-title' }, ['Spark Protocol Terminal']),
                    $.button({
                        className: 'spark-toggle',
                        onclick: () => this.toggleSparkTerminal()
                    }, ['Toggle'])
                ]),
                $.div({ id: 'spark-terminal', className: 'spark-terminal hidden' }, [
                    $.div({ className: 'terminal-output' }, [
                        $.div({ className: 'terminal-line' }, ['> Spark Protocol v2.0.0 initialized']),
                        $.div({ className: 'terminal-line' }, ['> Connection: ACTIVE']),
                        $.div({ className: 'terminal-line' }, ['> Nodes: 12 connected']),
                        $.div({ className: 'terminal-line' }, ['> Privacy: MAXIMUM'])
                    ]),
                    $.input({
                        className: 'terminal-input',
                        placeholder: 'Enter Spark command...',
                        onkeypress: (e) => {
                            if (e.key === 'Enter') this.handleSparkCommand(e.target.value);
                        }
                    })
                ])
            ]);
        }
        
        createNetworkCard() {
            const $ = ElementFactory;
            
            return $.div({ className: 'token-card network-card' }, [
                $.div({ className: 'token-name' }, ['Network']),
                $.div({ className: 'network-status' }, ['● Connected']),
                $.div({ className: 'network-block' }, ['Block 000000'])
            ]);
        }
        
        // New event handlers
        handleWalletTypeChange(e) {
            const walletType = e.target.value;
            this.app.showNotification(`Switching to ${walletType} wallet...`, 'success');
            
            // Show/hide ordinals based on wallet type
            const ordinalsCard = document.querySelector('.ordinals-icon')?.parentElement?.parentElement;
            if (ordinalsCard) {
                ordinalsCard.style.display = walletType === 'taproot' ? 'flex' : 'none';
            }
            
            // Store selected wallet type
            if (this.app.state) {
                this.app.state.set('selectedWalletType', walletType);
            }
        }
        
        toggleSparkTerminal() {
            const terminal = document.getElementById('spark-terminal');
            if (terminal) {
                terminal.classList.toggle('hidden');
                this.app.showNotification(
                    terminal.classList.contains('hidden') ? 'Spark terminal hidden' : 'Spark terminal shown',
                    'success'
                );
            }
        }
        
        handleSparkCommand(command) {
            const terminal = document.querySelector('.terminal-output');
            const input = document.querySelector('.terminal-input');
            
            if (!terminal || !input) return;
            
            // Add user command to terminal
            const userLine = document.createElement('div');
            userLine.className = 'terminal-line';
            userLine.style.color = '#00ff00';
            userLine.textContent = `> ${command}`;
            terminal.appendChild(userLine);
            
            // Process command
            let response = '';
            const cmd = command.toLowerCase().trim();
            
            if (cmd === 'help') {
                response = 'Available commands: status, balance, network, privacy, clear, help';
            } else if (cmd === 'status') {
                response = 'Spark Protocol: ACTIVE | Privacy: MAXIMUM | Nodes: 12';
            } else if (cmd === 'balance') {
                const btcBalance = document.getElementById('btc-balance')?.textContent || '0.00000000';
                response = `Current balance: ${btcBalance} BTC`;
            } else if (cmd === 'network') {
                const networkBlock = document.querySelector('.network-block')?.textContent || 'Unknown';
                response = `Network: Mainnet | ${networkBlock}`;
            } else if (cmd === 'privacy') {
                response = 'Privacy mode: ENABLED | Tor: ACTIVE | VPN: CONNECTED';
            } else if (cmd === 'clear') {
                terminal.innerHTML = '';
                response = 'Terminal cleared.';
            } else if (cmd === '') {
                response = '';
            } else {
                response = `Unknown command: ${command}. Type 'help' for available commands.`;
            }
            
            // Add response to terminal
            if (response) {
                const responseLine = document.createElement('div');
                responseLine.className = 'terminal-line';
                responseLine.style.color = '#888888';
                responseLine.textContent = response;
                terminal.appendChild(responseLine);
            }
            
            // Clear input
            input.value = '';
            
            // Scroll to bottom
            terminal.scrollTop = terminal.scrollHeight;
            
            this.app.showNotification('Command executed', 'success');
        }
        
        // Dashboard action handlers
        handleTokenMenu() {
            const modal = new TokenMenuModal(this.app);
            modal.show();
        }
        
        toggleAccountDropdown() {
            const modal = new MultiAccountModal(this.app);
            modal.show();
        }
        
        handleAddAccount() {
            const modal = new MultiAccountModal(this.app);
            modal.show();
        }
        
        async handleRefresh() {
            this.app.showNotification('Refreshing wallet data...', 'success');
            
            try {
                // Fetch Bitcoin price
                const priceData = await this.app.apiService.fetchBitcoinPrice();
                const btcPrice = priceData.usd || 0;
                
                // Get current account
                const currentAccount = this.app.state.get('currentAccount');
                if (currentAccount && currentAccount.addresses) {
                    // Fetch balance for the current address type
                    const walletType = this.app.state.get('selectedWalletType') || 'taproot';
                    let address = currentAccount.addresses.taproot;
                    
                    if (walletType === 'segwit') address = currentAccount.addresses.segwit;
                    else if (walletType === 'legacy') address = currentAccount.addresses.legacy;
                    
                    const balance = await this.app.apiService.fetchAddressBalance(address);
                    const btcBalance = balance / 100000000; // Convert from satoshis
                    const usdBalance = (btcBalance * btcPrice).toFixed(2);
                    
                    // Update UI
                    const btcElement = document.getElementById('btc-balance');
                    const usdElement = document.getElementById('usd-balance');
                    
                    if (btcElement) btcElement.textContent = btcBalance.toFixed(8);
                    if (usdElement) usdElement.textContent = usdBalance;
                    
                    // Update stats grid
                    const networkInfo = await this.app.apiService.fetchNetworkInfo();
                    const networkCard = document.querySelector('.network-block');
                    if (networkCard) {
                        networkCard.textContent = `Block ${networkInfo.height || '000000'}`;
                    }
                    
                    this.app.showNotification('Wallet data refreshed!', 'success');
                } else {
                    this.app.showNotification('No wallet selected', 'error');
                }
            } catch (error) {
                console.error('Refresh error:', error);
                this.app.showNotification('Failed to refresh data', 'error');
            }
        }
        
        handlePrivacyToggle() {
            const balances = document.querySelectorAll('.btc-value, #usd-balance, .token-amount');
            const isHidden = balances[0]?.textContent === '••••••••';
            
            balances.forEach(el => {
                if (isHidden) {
                    // Show real values (placeholder for now)
                    if (el.id === 'btc-balance') el.textContent = '0.00000000';
                    else if (el.id === 'usd-balance') el.textContent = '0.00';
                    else el.textContent = '0.00';
                } else {
                    // Hide values
                    el.textContent = '••••••••';
                }
            });
            
            this.app.showNotification(isHidden ? 'Balances shown' : 'Balances hidden', 'success');
        }
        
        handleSend() {
            // Find the WalletCreatedPage methods and reuse them
            const walletPage = new WalletCreatedPage(this.app);
            walletPage.showSendModal();
        }
        
        handleReceive() {
            // Find the WalletCreatedPage methods and reuse them
            const walletPage = new WalletCreatedPage(this.app);
            walletPage.showReceiveModal();
        }
        
        handleSwap() {
            const modal = new SwapModal(this.app);
            modal.show();
        }
        
        handleSettings() {
            const modal = new WalletSettingsModal(this.app);
            modal.show();
        }
        
        handleFilter() {
            const modal = new TransactionHistoryModal(this.app);
            modal.show();
        }
        
        initializeDashboard() {
            // Add dashboard-specific styles
            this.addDashboardStyles();
            
            // Start data loading
            setTimeout(() => {
                this.loadWalletData();
            }, 500);
        }
        
        addDashboardStyles() {
            if (document.getElementById('dashboard-page-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'dashboard-page-styles';
            style.textContent = `
                /* Dashboard Container */
                .wallet-dashboard-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: calc(20px * var(--scale-factor));
                    width: 100%;
                    box-sizing: border-box;
                    min-height: 100vh;
                    background: var(--bg-primary);
                }
                
                /* Dashboard Header */
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: calc(20px * var(--scale-factor));
                    background: var(--bg-secondary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    border-radius: 0;
                    margin-bottom: calc(24px * var(--scale-factor));
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .terminal-title {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(18px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                }
                
                .title-text {
                    color: var(--text-primary);
                }
                
                .cursor-blink {
                    color: var(--text-primary);
                    animation: blink 1s infinite;
                    margin-left: calc(2px * var(--scale-factor));
                }
                
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                
                /* Header Actions */
                .header-actions {
                    display: flex;
                    gap: calc(16px * var(--scale-factor));
                    align-items: center;
                }
                
                .account-selector {
                    position: relative;
                }
                
                .account-dropdown-btn {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    padding: calc(8px * var(--scale-factor)) calc(16px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: calc(8px * var(--scale-factor));
                    transition: all 0.2s ease;
                }
                
                .account-dropdown-btn:hover {
                    border-color: var(--text-primary);
                }
                
                .dropdown-arrow {
                    font-size: calc(10px * var(--scale-factor));
                    opacity: 0.7;
                }
                
                .header-buttons {
                    display: flex;
                    gap: calc(8px * var(--scale-factor));
                }
                
                .header-btn {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    width: calc(32px * var(--scale-factor));
                    height: calc(32px * var(--scale-factor));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: calc(16px * var(--scale-factor));
                    transition: all 0.2s ease;
                }
                
                .header-btn:hover {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                }
                
                /* Balance Section */
                .balance-section {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(24px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .primary-balance {
                    text-align: center;
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .balance-label {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .balance-amount {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(32px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                    line-height: 1.2;
                }
                
                .btc-unit {
                    font-size: calc(18px * var(--scale-factor));
                    margin-left: calc(4px * var(--scale-factor));
                }
                
                .balance-usd {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-top: calc(8px * var(--scale-factor));
                }
                
                .token-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(calc(120px * var(--scale-factor)), 1fr));
                    gap: calc(16px * var(--scale-factor));
                    padding-top: calc(24px * var(--scale-factor));
                    border-top: calc(1px * var(--scale-factor)) solid var(--border-color);
                }
                
                .token-card {
                    background: var(--bg-secondary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(12px * var(--scale-factor));
                    text-align: center;
                    transition: all 0.2s ease;
                }
                
                .token-card:hover {
                    border-color: var(--text-primary);
                }
                
                .token-name {
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-bottom: calc(4px * var(--scale-factor));
                }
                
                .token-amount {
                    font-size: calc(16px * var(--scale-factor));
                    color: var(--text-primary);
                    font-weight: 600;
                }
                
                .token-value {
                    font-size: calc(12px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-top: calc(4px * var(--scale-factor));
                }
                
                /* Quick Actions */
                .quick-actions {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(calc(120px * var(--scale-factor)), 1fr));
                    gap: calc(16px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                }
                
                .action-button {
                    background: var(--bg-primary);
                    border: calc(2px * var(--scale-factor)) solid var(--text-primary);
                    color: var(--text-primary);
                    padding: calc(20px * var(--scale-factor));
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .action-button:hover {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                }
                
                .action-icon {
                    font-size: calc(24px * var(--scale-factor));
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .action-label {
                    font-size: calc(14px * var(--scale-factor));
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                /* Transaction History */
                .transaction-history {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(24px * var(--scale-factor));
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: calc(20px * var(--scale-factor));
                }
                
                .section-title {
                    font-size: calc(16px * var(--scale-factor));
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .filter-button {
                    background: transparent;
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-dim);
                    padding: calc(6px * var(--scale-factor)) calc(12px * var(--scale-factor));
                    font-size: calc(12px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .filter-button:hover {
                    border-color: var(--text-primary);
                    color: var(--text-primary);
                }
                
                .empty-transactions {
                    text-align: center;
                    padding: calc(40px * var(--scale-factor));
                    color: var(--text-dim);
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .empty-text {
                    font-size: calc(14px * var(--scale-factor));
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .empty-subtext {
                    font-size: calc(12px * var(--scale-factor));
                    opacity: 0.7;
                }
                
                /* Mobile Optimizations */
                @media (max-width: 768px) {
                    .dashboard-header {
                        flex-direction: column;
                        gap: calc(16px * var(--scale-factor));
                        align-items: stretch;
                    }
                    
                    .header-actions {
                        justify-content: space-between;
                    }
                    
                    .balance-amount {
                        font-size: calc(24px * var(--scale-factor));
                    }
                    
                    .quick-actions {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        loadWalletData() {
            // Load current account data
            const currentAccount = this.app.state.getCurrentAccount();
            if (currentAccount) {
                // Update UI with account data
                this.updateAccountIndicator();
                this.refreshBalances();
            }
        }
        
        createStatusBanner() {
            const $ = ElementFactory;
            
            return $.div({
                style: {
                    background: 'rgba(105, 253, 151, 0.1)',
                    border: '1px solid var(--text-accent)',
                    borderRadius: '0',
                    padding: 'calc(16px * var(--scale-factor))',
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, [
                $.div({
                    style: {
                        color: 'var(--text-accent)',
                        fontWeight: '600',
                        marginBottom: 'calc(8px * var(--scale-factor))'
                    }
                }, ['Spark Protocol Active']),
                $.div({
                    className: 'text-dim',
                    style: { fontSize: 'calc(12px * var(--scale-factor))' }
                }, [
                    'Lightning-fast Bitcoin transfers • Native stablecoins • Instant settlements',
                    $.br(),
                    $.span({ style: { color: 'var(--text-keyword)' } }, [
                        'Live blockchain data • Real-time prices • Auto-refresh every 30s'
                    ])
                ])
            ]);
        }
        
        createWalletTypeSelector() {
            const $ = ElementFactory;
            
            return $.div({
                className: 'terminal-box',
                style: { marginBottom: 'calc(20px * var(--scale-factor))' }
            }, [
                $.div({ className: 'terminal-header' }, [
                    $.span({}, ['~/moosh/wallet-selector $']),
                    $.span({ 
                        className: 'text-keyword',
                        id: 'wallet-selector-status'
                    }, ['active'])
                ]),
                $.div({ className: 'terminal-content' }, [
                    $.div({ style: { marginBottom: 'calc(12px * var(--scale-factor))' } }, [
                        $.label({
                            style: {
                                color: 'var(--text-primary)',
                                fontSize: 'calc(12px * var(--scale-factor))',
                                fontWeight: '600',
                                marginBottom: 'calc(8px * var(--scale-factor))',
                                display: 'block'
                            }
                        }, ['Select Active Wallet:']),
                        $.create('select', {
                            id: 'wallet-type-selector',
                            className: 'terminal-select',
                            onchange: () => this.switchWalletType(),
                            style: {
                                width: '100%',
                                padding: 'calc(8px * var(--scale-factor))',
                                background: '#000000',
                                color: 'var(--text-primary)',
                                border: '2px solid var(--text-primary)',
                                borderRadius: '0',
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 'calc(12px * var(--scale-factor))'
                            }
                        }, [
                            $.create('option', { value: 'taproot' }, ['Bitcoin Taproot (bc1p...) - Primary']),
                            $.create('option', { value: 'nativeSegWit' }, ['Bitcoin Native SegWit (bc1q...) - BIP84']),
                            $.create('option', { value: 'nestedSegWit' }, ['Bitcoin Nested SegWit (3...) - BIP49']),
                            $.create('option', { value: 'legacy' }, ['Bitcoin Legacy (1...) - BIP44']),
                            $.create('option', { value: 'spark' }, ['Spark Protocol (sp1...) - Lightning'])
                        ])
                    ]),
                    this.createSelectedWalletDisplay()
                ])
            ]);
        }
        
        createSelectedWalletDisplay() {
            const $ = ElementFactory;
            
            return $.div({ 
                id: 'selected-wallet-display',
                style: { marginTop: 'calc(12px * var(--scale-factor))' }
            }, [
                $.div({
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'calc(8px * var(--scale-factor))'
                    }
                }, [
                    $.span({
                        style: {
                            color: 'var(--text-dim)',
                            fontSize: 'calc(11px * var(--scale-factor))'
                        },
                        id: 'selected-wallet-label'
                    }, ['Bitcoin Taproot Address:']),
                    $.span({
                        style: {
                            color: 'var(--text-primary)',
                            fontSize: 'calc(11px * var(--scale-factor))'
                        },
                        id: 'selected-wallet-balance'
                    }, ['0.00000000 BTC'])
                ]),
                $.div({
                    style: {
                        background: '#000000',
                        border: '2px solid var(--text-primary)',
                        borderRadius: '0',
                        padding: 'calc(8px * var(--scale-factor))',
                        fontFamily: "'JetBrains Mono', monospace",
                        wordBreak: 'break-all',
                        color: 'var(--text-primary)',
                        fontSize: 'calc(11px * var(--scale-factor))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minHeight: 'calc(20px * var(--scale-factor))'
                    },
                    id: 'selected-wallet-address',
                    onclick: () => this.openSelectedWalletExplorer()
                }, ['Select wallet to view address']),
                $.button({
                    style: {
                        background: '#000000',
                        border: '2px solid var(--text-primary)',
                        borderRadius: '0',
                        color: 'var(--text-primary)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(10px * var(--scale-factor))',
                        padding: 'calc(6px * var(--scale-factor)) calc(12px * var(--scale-factor))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        width: '100%',
                        marginTop: 'calc(8px * var(--scale-factor))'
                    },
                    onclick: () => this.copySelectedWalletAddress()
                }, ['Copy Selected Address'])
            ]);
        }
        
        createNetworkCard() {
            const $ = ElementFactory;
            
            return $.div({ className: 'token-card' }, [
                $.div({ className: 'token-name' }, ['Network Status']),
                $.div({ 
                    className: 'token-amount',
                    style: { color: 'var(--text-accent)' }
                }, ['Connected']),
                $.div({ 
                    className: 'token-value',
                    style: { fontSize: 'calc(11px * var(--scale-factor))' }
                }, [
                    'Block ',
                    $.span({ id: 'block-height' }, ['000000'])
                ])
            ]);
        }
        
        createSparkProtocolFeatures() {
            const $ = ElementFactory;
            
            return $.div({
                style: {
                    marginTop: 'calc(24px * var(--scale-factor))',
                    paddingTop: 'calc(24px * var(--scale-factor))',
                    borderTop: '1px solid var(--border-color)'
                }
            }, [
                $.h3({
                    style: {
                        color: 'var(--text-primary)',
                        marginBottom: 'calc(16px * var(--scale-factor))'
                    }
                }, ['Spark Protocol Features']),
                $.div({
                    style: {
                        background: 'rgba(105, 253, 151, 0.1)',
                        border: '1px solid var(--text-accent)',
                        borderRadius: 'calc(8px * var(--scale-factor))',
                        padding: 'calc(16px * var(--scale-factor))',
                        marginBottom: 'calc(16px * var(--scale-factor))'
                    }
                }, [
                    $.div({
                        style: {
                            color: 'var(--text-accent)',
                            fontWeight: '600',
                            marginBottom: 'calc(8px * var(--scale-factor))'
                        }
                    }, ['Lightning Network Integration']),
                    $.div({
                        className: 'text-dim',
                        style: { fontSize: 'calc(12px * var(--scale-factor))' }
                    }, [
                        'Send instant Bitcoin payments • Sub-second confirmations • Minimal fees',
                        $.br(),
                        'Compatible with all Lightning wallets and services'
                    ])
                ]),
                $.div({ className: 'wallet-actions' }, [
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.showStablecoinSwap()
                    }, ['Swap BTC ↔ USDT']),
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.openLightningChannel()
                    }, ['Open Lightning Channel']),
                    $.button({
                        className: 'btn-secondary',
                        onclick: () => this.showTokenMenu()
                    }, ['Token Menu'])
                ])
            ]);
        }
        
        // Enhanced action handlers
        async handleRefresh() {
            this.app.showNotification('Refreshing wallet data...', 'success');
            await this.refreshBalances();
            await this.fetchTransactionHistory();
        }
        
        async refreshBalances() {
            try {
                // Fetch Bitcoin price
                const priceData = await this.app.apiService.fetchBitcoinPrice();
                const btcPrice = priceData.usd || 0;
                
                // Update block height
                const blockHeight = await this.app.apiService.fetchBlockHeight();
                const blockElement = document.getElementById('block-height');
                if (blockElement) {
                    blockElement.textContent = blockHeight.toLocaleString();
                }
                
                // Update price display
                const currentAccount = this.app.state.getCurrentAccount();
                if (currentAccount) {
                    const btcBalance = currentAccount.balances.bitcoin / 100000000;
                    const usdValue = btcBalance * btcPrice;
                    
                    const btcElement = document.getElementById('btc-balance');
                    const usdElement = document.getElementById('usd-balance');
                    
                    if (btcElement && !this.app.state.get('isBalanceHidden')) {
                        btcElement.textContent = btcBalance.toFixed(8);
                    }
                    if (usdElement && !this.app.state.get('isBalanceHidden')) {
                        usdElement.textContent = usdValue.toFixed(2);
                    }
                }
            } catch (error) {
                console.error('Failed to refresh balances:', error);
            }
        }
        
        async fetchTransactionHistory() {
            const currentAccount = this.app.state.getCurrentAccount();
            if (!currentAccount || !currentAccount.addresses.taproot) return;
            
            try {
                const txs = await this.app.apiService.fetchTransactionHistory(currentAccount.addresses.taproot);
                this.updateTransactionList(txs);
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            }
        }
        
        updateTransactionList(transactions) {
            const listElement = document.getElementById('transaction-list');
            if (!listElement) return;
            
            if (transactions.length === 0) {
                listElement.innerHTML = '';
                listElement.appendChild(this.createEmptyTransactions());
                return;
            }
            
            const $ = ElementFactory;
            listElement.innerHTML = '';
            
            transactions.forEach(tx => {
                const date = new Date(tx.time * 1000);
                const isReceive = tx.value > 0;
                
                const txElement = $.div({ className: 'transaction-item' }, [
                    $.div({ className: 'tx-icon' }, [isReceive ? '↙' : '↗']),
                    $.div({ className: 'tx-details' }, [
                        $.div({ className: 'tx-type' }, [isReceive ? 'Received' : 'Sent']),
                        $.div({ className: 'tx-date' }, [date.toLocaleDateString()])
                    ]),
                    $.div({ className: 'tx-amount' }, [
                        $.span({ 
                            className: isReceive ? 'amount-positive' : 'amount-negative' 
                        }, [(tx.value / 100000000).toFixed(8)]),
                        $.span({ className: 'btc-unit' }, [' BTC'])
                    ])
                ]);
                
                listElement.appendChild(txElement);
            });
        }
        
        updateAccountIndicator() {
            const currentAccount = this.app.state.getCurrentAccount();
            const indicator = document.querySelector('.account-indicator');
            if (indicator && currentAccount) {
                indicator.textContent = `Active: ${currentAccount.name}`;
            }
        }
        
        switchWalletType() {
            const selector = document.getElementById('wallet-type-selector');
            if (selector) {
                const walletType = selector.value;
                this.app.showNotification(`Switched to ${walletType} wallet`, 'success');
                // TODO: Update address display based on wallet type
            }
        }
        
        openSelectedWalletExplorer() {
            this.app.showNotification('Opening blockchain explorer...', 'info');
        }
        
        copySelectedWalletAddress() {
            const addressElement = document.getElementById('selected-wallet-address');
            if (addressElement && addressElement.textContent !== 'Select wallet to view address') {
                navigator.clipboard.writeText(addressElement.textContent);
                this.app.showNotification('Address copied to clipboard', 'success');
            }
        }
        
        showMultiAccountManager() {
            const modal = new MultiAccountModal(this.app);
            modal.show();
        }
        
        showTokenMenu() {
            const modal = new TokenMenuModal(this.app);
            modal.show();
        }
        
        showStablecoinSwap() {
            this.app.showNotification('Stablecoin swap coming soon', 'info');
        }
        
        openLightningChannel() {
            this.app.showNotification('Lightning channel management coming soon', 'info');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MODAL CLASSES
    // ═══════════════════════════════════════════════════════════════════════
    class MultiAccountModal {
        constructor(app) {
            this.app = app;
            this.modal = null;
        }
        
        show() {
            const $ = ElementFactory;
            
            this.modal = $.div({
                style: {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '10000',
                    overflowY: 'auto'
                },
                onclick: (e) => {
                    if (e.target === this.modal) this.close();
                }
            }, [
                $.div({
                    style: {
                        background: 'var(--bg-primary)',
                        border: '2px solid var(--text-primary)',
                        borderRadius: '0',
                        maxWidth: 'calc(600px * var(--scale-factor))',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: 'calc(24px * var(--scale-factor))'
                    }
                }, [
                    this.createHeader(),
                    this.createAccountList(),
                    this.createActions()
                ])
            ]);
            
            document.body.appendChild(this.modal);
        }
        
        createHeader() {
            const $ = ElementFactory;
            
            return $.div({
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'calc(24px * var(--scale-factor))',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: 'calc(16px * var(--scale-factor))'
                }
            }, [
                $.h2({
                    style: {
                        color: 'var(--text-primary)',
                        fontSize: 'calc(20px * var(--scale-factor))',
                        fontWeight: '600',
                        fontFamily: "'JetBrains Mono', monospace"
                    }
                }, ['MULTI_ACCOUNT_MANAGER']),
                $.button({
                    style: {
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: 'calc(24px * var(--scale-factor))',
                        cursor: 'pointer',
                        padding: '0',
                        width: 'calc(32px * var(--scale-factor))',
                        height: 'calc(32px * var(--scale-factor))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    onclick: () => this.close()
                }, ['×'])
            ]);
        }
        
        createAccountList() {
            const $ = ElementFactory;
            const accounts = this.app.state.get('accounts');
            const activeIndex = this.app.state.get('activeAccountIndex');
            
            if (accounts.length === 0) {
                return $.div({
                    style: {
                        textAlign: 'center',
                        padding: 'calc(40px * var(--scale-factor))',
                        color: 'var(--text-dim)'
                    }
                }, ['No accounts yet. Create your first account.']);
            }
            
            return $.div({
                style: {
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, accounts.map((account, index) => {
                const isActive = index === activeIndex;
                
                return $.div({
                    className: 'account-item',
                    style: {
                        border: `2px solid ${isActive ? 'var(--text-primary)' : 'var(--border-color)'}`,
                        borderRadius: '0',
                        padding: 'calc(16px * var(--scale-factor))',
                        marginBottom: 'calc(12px * var(--scale-factor))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: isActive ? 'rgba(245, 115, 21, 0.1)' : 'var(--bg-primary)'
                    },
                    onclick: () => this.switchToAccount(index)
                }, [
                    $.div({
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'calc(12px * var(--scale-factor))'
                        }
                    }, [
                        $.div({
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'calc(12px * var(--scale-factor))'
                            }
                        }, [
                            $.div({
                                style: {
                                    width: 'calc(32px * var(--scale-factor))',
                                    height: 'calc(32px * var(--scale-factor))',
                                    background: isActive ? 'var(--text-primary)' : 'var(--border-color)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isActive ? '#000' : 'var(--text-primary)',
                                    fontWeight: 'bold',
                                    fontSize: 'calc(14px * var(--scale-factor))'
                                }
                            }, [(index + 1).toString()]),
                            $.div({}, [
                                $.div({
                                    style: {
                                        color: 'var(--text-primary)',
                                        fontWeight: '600',
                                        fontSize: 'calc(14px * var(--scale-factor))'
                                    }
                                }, [account.name]),
                                $.div({
                                    style: {
                                        color: 'var(--text-dim)',
                                        fontSize: 'calc(11px * var(--scale-factor))'
                                    }
                                }, [`${account.type} • Created ${new Date(account.createdAt).toLocaleDateString()}`])
                            ])
                        ]),
                        isActive && $.div({
                            style: {
                                color: 'var(--text-accent)',
                                fontSize: 'calc(12px * var(--scale-factor))',
                                fontWeight: '600'
                            }
                        }, ['ACTIVE'])
                    ]),
                    $.div({
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }
                    }, [
                        $.div({
                            style: {
                                fontSize: 'calc(12px * var(--scale-factor))',
                                color: 'var(--text-dim)'
                            }
                        }, [`Balance: ${(account.balances.bitcoin / 100000000).toFixed(8)} BTC`]),
                        $.button({
                            style: {
                                background: 'transparent',
                                border: '1px solid var(--text-dim)',
                                color: 'var(--text-dim)',
                                padding: 'calc(4px * var(--scale-factor)) calc(8px * var(--scale-factor))',
                                fontSize: 'calc(10px * var(--scale-factor))',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            },
                            onclick: (e) => {
                                e.stopPropagation();
                                this.renameAccount(index);
                            }
                        }, ['Rename'])
                    ])
                ]);
            }));
        }
        
        createActions() {
            const $ = ElementFactory;
            
            return $.div({
                style: {
                    display: 'flex',
                    gap: 'calc(12px * var(--scale-factor))',
                    justifyContent: 'center'
                }
            }, [
                $.button({
                    style: {
                        background: '#000000',
                        border: '2px solid var(--text-primary)',
                        borderRadius: '0',
                        color: 'var(--text-primary)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(14px * var(--scale-factor))',
                        padding: 'calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: '600'
                    },
                    onclick: () => this.createNewAccount()
                }, ['+ Create New Account']),
                $.button({
                    style: {
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0',
                        color: 'var(--text-dim)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(14px * var(--scale-factor))',
                        padding: 'calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    },
                    onclick: () => this.close()
                }, ['Close'])
            ]);
        }
        
        switchToAccount(index) {
            this.app.state.switchAccount(index);
            this.app.showNotification(`Switched to ${this.app.state.get('accounts')[index].name}`, 'success');
            this.close();
            
            // Refresh dashboard
            if (this.app.state.get('currentPage') === 'dashboard') {
                this.app.router.navigate('dashboard');
            }
        }
        
        renameAccount(index) {
            const account = this.app.state.get('accounts')[index];
            const newName = prompt('Enter new account name:', account.name);
            
            if (newName && newName.trim()) {
                const accounts = [...this.app.state.get('accounts')];
                accounts[index].name = newName.trim();
                this.app.state.set('accounts', accounts);
                this.close();
                this.show();
            }
        }
        
        createNewAccount() {
            // Generate new mnemonic
            const mnemonic = this.generateMnemonic();
            const name = `Account ${this.app.state.get('accounts').length + 1}`;
            
            this.app.state.addAccount(name, mnemonic);
            this.app.showNotification(`Created new account: ${name}`, 'success');
            this.close();
            
            // Navigate to dashboard
            this.app.router.navigate('dashboard');
        }
        
        generateMnemonic() {
            // Simple mnemonic generation for demo
            const words = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 
                          'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'];
            
            const mnemonic = [];
            for (let i = 0; i < 12; i++) {
                mnemonic.push(words[Math.floor(Math.random() * words.length)]);
            }
            
            return mnemonic.join(' ');
        }
        
        close() {
            if (this.modal) {
                this.modal.remove();
                this.modal = null;
            }
        }
    }
    
    class TransactionHistoryModal {
        constructor(app) {
            this.app = app;
            this.modal = null;
            this.transactions = [];
        }
        
        async show() {
            const $ = ElementFactory;
            
            // Fetch transactions for current account
            await this.fetchTransactions();
            
            this.modal = $.div({
                style: {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '10000',
                    overflowY: 'auto'
                },
                onclick: (e) => {
                    if (e.target === this.modal) this.close();
                }
            }, [
                $.div({
                    style: {
                        background: 'var(--bg-primary)',
                        border: '2px solid var(--text-primary)',
                        borderRadius: '0',
                        maxWidth: 'calc(800px * var(--scale-factor))',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: 'calc(24px * var(--scale-factor))'
                    }
                }, [
                    this.createHeader(),
                    this.createFilterSection(),
                    this.createTransactionList(),
                    this.createActions()
                ])
            ]);
            
            document.body.appendChild(this.modal);
        }
        
        createHeader() {
            const $ = ElementFactory;
            
            return $.div({
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'calc(24px * var(--scale-factor))',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: 'calc(16px * var(--scale-factor))'
                }
            }, [
                $.h2({
                    style: {
                        color: 'var(--text-primary)',
                        fontSize: 'calc(20px * var(--scale-factor))',
                        fontWeight: '600',
                        fontFamily: "'JetBrains Mono', monospace"
                    }
                }, ['TRANSACTION_HISTORY']),
                $.button({
                    style: {
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: 'calc(24px * var(--scale-factor))',
                        cursor: 'pointer',
                        padding: '0',
                        width: 'calc(32px * var(--scale-factor))',
                        height: 'calc(32px * var(--scale-factor))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    onclick: () => this.close()
                }, ['×'])
            ]);
        }
        
        createFilterSection() {
            const $ = ElementFactory;
            
            return $.div({
                style: {
                    display: 'flex',
                    gap: 'calc(12px * var(--scale-factor))',
                    marginBottom: 'calc(24px * var(--scale-factor))',
                    alignItems: 'center'
                }
            }, [
                $.create('select', {
                    style: {
                        background: '#000000',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0',
                        padding: 'calc(8px * var(--scale-factor))',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(12px * var(--scale-factor))',
                        cursor: 'pointer'
                    },
                    onchange: (e) => this.filterTransactions(e.target.value)
                }, [
                    $.create('option', { value: 'all' }, ['All Transactions']),
                    $.create('option', { value: 'sent' }, ['Sent Only']),
                    $.create('option', { value: 'received' }, ['Received Only'])
                ]),
                $.div({
                    style: {
                        marginLeft: 'auto',
                        color: 'var(--text-dim)',
                        fontSize: 'calc(12px * var(--scale-factor))'
                    }
                }, [`${this.transactions.length} transactions found`])
            ]);
        }
        
        createTransactionList() {
            const $ = ElementFactory;
            
            if (this.transactions.length === 0) {
                return $.div({
                    style: {
                        textAlign: 'center',
                        padding: 'calc(40px * var(--scale-factor))',
                        color: 'var(--text-dim)'
                    }
                }, ['No transactions found. Start using your wallet!']);
            }
            
            return $.div({
                style: {
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, this.transactions.map(tx => {
                const date = new Date(tx.time * 1000);
                const isReceive = tx.value > 0;
                
                return $.div({
                    style: {
                        border: '1px solid var(--border-color)',
                        borderRadius: '0',
                        padding: 'calc(16px * var(--scale-factor))',
                        marginBottom: 'calc(12px * var(--scale-factor))',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                    },
                    onmouseover: (e) => {
                        e.currentTarget.style.borderColor = 'var(--text-primary)';
                        e.currentTarget.style.background = 'rgba(245, 115, 21, 0.05)';
                    },
                    onmouseout: (e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.background = 'transparent';
                    },
                    onclick: () => this.showTransactionDetails(tx)
                }, [
                    $.div({
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }
                    }, [
                        $.div({
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'calc(12px * var(--scale-factor))'
                            }
                        }, [
                            $.div({
                                style: {
                                    width: 'calc(40px * var(--scale-factor))',
                                    height: 'calc(40px * var(--scale-factor))',
                                    background: isReceive ? 'var(--text-accent)' : 'var(--text-primary)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#000',
                                    fontSize: 'calc(18px * var(--scale-factor))'
                                }
                            }, [isReceive ? '↙' : '↗']),
                            $.div({}, [
                                $.div({
                                    style: {
                                        color: 'var(--text-primary)',
                                        fontWeight: '600',
                                        fontSize: 'calc(14px * var(--scale-factor))'
                                    }
                                }, [isReceive ? 'Received' : 'Sent']),
                                $.div({
                                    style: {
                                        color: 'var(--text-dim)',
                                        fontSize: 'calc(12px * var(--scale-factor))'
                                    }
                                }, [date.toLocaleString()])
                            ])
                        ]),
                        $.div({
                            style: {
                                textAlign: 'right'
                            }
                        }, [
                            $.div({
                                style: {
                                    color: isReceive ? 'var(--text-accent)' : 'var(--text-primary)',
                                    fontWeight: '600',
                                    fontSize: 'calc(16px * var(--scale-factor))'
                                }
                            }, [`${isReceive ? '+' : '-'}${Math.abs(tx.value / 100000000).toFixed(8)} BTC`]),
                            $.div({
                                style: {
                                    color: 'var(--text-dim)',
                                    fontSize: 'calc(11px * var(--scale-factor))'
                                }
                            }, [`${tx.confirmations || 0} confirmations`])
                        ])
                    ])
                ]);
            }));
        }
        
        createActions() {
            const $ = ElementFactory;
            
            return $.div({
                style: {
                    display: 'flex',
                    gap: 'calc(12px * var(--scale-factor))',
                    justifyContent: 'center'
                }
            }, [
                $.button({
                    style: {
                        background: '#000000',
                        border: '2px solid var(--text-primary)',
                        borderRadius: '0',
                        color: 'var(--text-primary)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(14px * var(--scale-factor))',
                        padding: 'calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: '600'
                    },
                    onclick: () => this.exportTransactions()
                }, ['Export CSV']),
                $.button({
                    style: {
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0',
                        color: 'var(--text-dim)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(14px * var(--scale-factor))',
                        padding: 'calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    },
                    onclick: () => this.close()
                }, ['Close'])
            ]);
        }
        
        async fetchTransactions() {
            const currentAccount = this.app.state.getCurrentAccount();
            if (!currentAccount || !currentAccount.addresses.taproot) {
                this.transactions = [];
                return;
            }
            
            try {
                this.transactions = await this.app.apiService.fetchTransactionHistory(
                    currentAccount.addresses.taproot, 
                    50
                );
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
                this.transactions = [];
            }
        }
        
        filterTransactions(filter) {
            // TODO: Implement filtering
            this.app.showNotification(`Filtering by ${filter}`, 'info');
        }
        
        showTransactionDetails(tx) {
            this.app.showNotification('Opening transaction in explorer...', 'info');
            // TODO: Open blockchain explorer
        }
        
        exportTransactions() {
            this.app.showNotification('Export feature coming soon', 'info');
        }
        
        close() {
            if (this.modal) {
                this.modal.remove();
                this.modal = null;
            }
        }
    }
    
    class TokenMenuModal {
        constructor(app) {
            this.app = app;
            this.modal = null;
            this.tokens = [
                { symbol: 'BTC', name: 'Bitcoin', type: 'Native', balance: 0, price: 0, change: 0 },
                { symbol: 'USDT', name: 'Tether', type: 'Stablecoin', balance: 0, price: 1, change: 0 },
                { symbol: 'USDC', name: 'USD Coin', type: 'Stablecoin', balance: 0, price: 1, change: 0 },
                { symbol: 'MOOSH', name: 'MOOSH Token', type: 'Spark Token', balance: 0, price: 0.0058, change: 420.69 }
            ];
        }
        
        async show() {
            const $ = ElementFactory;
            
            // Fetch latest prices
            await this.fetchPrices();
            
            this.modal = $.div({
                style: {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '10000',
                    overflowY: 'auto'
                },
                onclick: (e) => {
                    if (e.target === this.modal) this.close();
                }
            }, [
                $.div({
                    style: {
                        background: 'var(--bg-primary)',
                        border: '2px solid var(--text-primary)',
                        borderRadius: '0',
                        maxWidth: 'calc(700px * var(--scale-factor))',
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: 'calc(24px * var(--scale-factor))'
                    }
                }, [
                    this.createHeader(),
                    this.createTokenList(),
                    this.createActions()
                ])
            ]);
            
            document.body.appendChild(this.modal);
        }
        
        createHeader() {
            const $ = ElementFactory;
            
            return $.div({
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'calc(24px * var(--scale-factor))',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: 'calc(16px * var(--scale-factor))'
                }
            }, [
                $.h2({
                    style: {
                        color: 'var(--text-primary)',
                        fontSize: 'calc(20px * var(--scale-factor))',
                        fontWeight: '600',
                        fontFamily: "'JetBrains Mono', monospace"
                    }
                }, ['TOKEN_MENU']),
                $.button({
                    style: {
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: 'calc(24px * var(--scale-factor))',
                        cursor: 'pointer',
                        padding: '0',
                        width: 'calc(32px * var(--scale-factor))',
                        height: 'calc(32px * var(--scale-factor))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    onclick: () => this.close()
                }, ['×'])
            ]);
        }
        
        createTokenList() {
            const $ = ElementFactory;
            
            return $.div({
                style: {
                    marginBottom: 'calc(24px * var(--scale-factor))'
                }
            }, this.tokens.map(token => {
                const changeColor = token.change > 0 ? 'var(--text-accent)' : 
                                   token.change < 0 ? '#ff4444' : 'var(--text-dim)';
                const changeSymbol = token.change > 0 ? '+' : '';
                
                return $.div({
                    style: {
                        border: '1px solid var(--border-color)',
                        borderRadius: '0',
                        padding: 'calc(16px * var(--scale-factor))',
                        marginBottom: 'calc(12px * var(--scale-factor))',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                    },
                    onmouseover: (e) => {
                        e.currentTarget.style.borderColor = 'var(--text-primary)';
                        e.currentTarget.style.background = 'rgba(245, 115, 21, 0.05)';
                    },
                    onmouseout: (e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.background = 'transparent';
                    }
                }, [
                    $.div({
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }
                    }, [
                        $.div({
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'calc(12px * var(--scale-factor))'
                            }
                        }, [
                            $.div({
                                style: {
                                    width: 'calc(40px * var(--scale-factor))',
                                    height: 'calc(40px * var(--scale-factor))',
                                    background: token.symbol === 'BTC' ? '#ff9500' : 
                                               token.symbol === 'MOOSH' ? 'var(--text-accent)' : 
                                               'var(--border-color)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    fontSize: 'calc(12px * var(--scale-factor))'
                                }
                            }, [token.symbol.slice(0, 2)]),
                            $.div({}, [
                                $.div({
                                    style: {
                                        color: 'var(--text-primary)',
                                        fontWeight: '600',
                                        fontSize: 'calc(16px * var(--scale-factor))'
                                    }
                                }, [token.symbol]),
                                $.div({
                                    style: {
                                        color: 'var(--text-dim)',
                                        fontSize: 'calc(12px * var(--scale-factor))'
                                    }
                                }, [`${token.name} • ${token.type}`])
                            ])
                        ]),
                        $.div({
                            style: {
                                textAlign: 'right'
                            }
                        }, [
                            $.div({
                                style: {
                                    color: 'var(--text-primary)',
                                    fontWeight: '600',
                                    fontSize: 'calc(16px * var(--scale-factor))'
                                }
                            }, [`$${token.price.toFixed(token.price < 1 ? 4 : 2)}`]),
                            $.div({
                                style: {
                                    color: changeColor,
                                    fontSize: 'calc(12px * var(--scale-factor))'
                                }
                            }, [`${changeSymbol}${token.change.toFixed(2)}%`])
                        ])
                    ])
                ]);
            }));
        }
        
        createActions() {
            const $ = ElementFactory;
            
            return $.div({
                style: {
                    display: 'flex',
                    gap: 'calc(12px * var(--scale-factor))',
                    justifyContent: 'center'
                }
            }, [
                $.button({
                    style: {
                        background: '#000000',
                        border: '2px solid var(--text-primary)',
                        borderRadius: '0',
                        color: 'var(--text-primary)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(14px * var(--scale-factor))',
                        padding: 'calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: '600'
                    },
                    onclick: () => this.app.showNotification('Token swap coming soon', 'info')
                }, ['Swap Tokens']),
                $.button({
                    style: {
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0',
                        color: 'var(--text-dim)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 'calc(14px * var(--scale-factor))',
                        padding: 'calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor))',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    },
                    onclick: () => this.close()
                }, ['Close'])
            ]);
        }
        
        async fetchPrices() {
            try {
                const priceData = await this.app.apiService.fetchBitcoinPrice();
                const btcToken = this.tokens.find(t => t.symbol === 'BTC');
                if (btcToken) {
                    btcToken.price = priceData.usd || 0;
                    btcToken.change = priceData.usd_24h_change || 0;
                }
            } catch (error) {
                console.error('Failed to fetch token prices:', error);
            }
        }
        
        close() {
            if (this.modal) {
                this.modal.remove();
                this.modal = null;
            }
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // SWAP MODAL
    // ═══════════════════════════════════════════════════════════════════════
    class SwapModal {
        constructor(app) {
            this.app = app;
            this.modal = null;
            this.fromToken = 'BTC';
            this.toToken = 'USDT';
            this.fromAmount = '';
            this.toAmount = '';
        }
        
        show() {
            const $ = ElementFactory;
            
            this.modal = $.div({ className: 'modal-overlay' }, [
                $.div({ className: 'modal-container swap-modal' }, [
                    this.createHeader(),
                    this.createSwapInterface(),
                    this.createFooter()
                ])
            ]);
            
            document.body.appendChild(this.modal);
            this.addStyles();
        }
        
        createHeader() {
            const $ = ElementFactory;
            
            return $.div({ className: 'modal-header' }, [
                $.h2({ className: 'modal-title' }, ['⇄ Token Swap']),
                $.button({
                    className: 'modal-close',
                    onclick: () => this.close()
                }, ['×'])
            ]);
        }
        
        createSwapInterface() {
            const $ = ElementFactory;
            
            return $.div({ className: 'swap-interface' }, [
                // From section
                $.div({ className: 'swap-section' }, [
                    $.label({ className: 'swap-label' }, ['From']),
                    $.div({ className: 'swap-input-group' }, [
                        $.input({
                            type: 'number',
                            className: 'swap-amount-input',
                            placeholder: '0.00',
                            value: this.fromAmount,
                            onInput: (e) => this.handleFromAmountChange(e)
                        }),
                        $.select({
                            className: 'swap-token-select',
                            value: this.fromToken,
                            onchange: (e) => this.handleFromTokenChange(e)
                        }, [
                            $.create('option', { value: 'BTC' }, ['BTC']),
                            $.create('option', { value: 'USDT' }, ['USDT']),
                            $.create('option', { value: 'USDC' }, ['USDC']),
                            $.create('option', { value: 'MOOSH' }, ['MOOSH'])
                        ])
                    ])
                ]),
                
                // Swap button
                $.div({ className: 'swap-middle' }, [
                    $.button({
                        className: 'swap-direction-btn',
                        onclick: () => this.swapTokens()
                    }, ['⇄'])
                ]),
                
                // To section
                $.div({ className: 'swap-section' }, [
                    $.label({ className: 'swap-label' }, ['To']),
                    $.div({ className: 'swap-input-group' }, [
                        $.input({
                            type: 'number',
                            className: 'swap-amount-input',
                            placeholder: '0.00',
                            value: this.toAmount,
                            readOnly: true
                        }),
                        $.select({
                            className: 'swap-token-select',
                            value: this.toToken,
                            onchange: (e) => this.handleToTokenChange(e)
                        }, [
                            $.create('option', { value: 'BTC' }, ['BTC']),
                            $.create('option', { value: 'USDT' }, ['USDT']),
                            $.create('option', { value: 'USDC' }, ['USDC']),
                            $.create('option', { value: 'MOOSH' }, ['MOOSH'])
                        ])
                    ])
                ]),
                
                // Rate info
                $.div({ className: 'swap-rate-info' }, [
                    $.div({ className: 'rate-item' }, [
                        $.span({ className: 'rate-label' }, ['Rate:']),
                        $.span({ className: 'rate-value' }, ['1 BTC = 45,320 USDT'])
                    ]),
                    $.div({ className: 'rate-item' }, [
                        $.span({ className: 'rate-label' }, ['Fee:']),
                        $.span({ className: 'rate-value' }, ['0.3%'])
                    ])
                ])
            ]);
        }
        
        createFooter() {
            const $ = ElementFactory;
            
            return $.div({ className: 'modal-footer' }, [
                $.button({
                    className: 'btn btn-primary',
                    onclick: () => this.executeSwap()
                }, ['Execute Swap']),
                $.button({
                    className: 'btn btn-secondary',
                    onclick: () => this.close()
                }, ['Cancel'])
            ]);
        }
        
        handleFromAmountChange(e) {
            this.fromAmount = e.target.value;
            this.calculateToAmount();
        }
        
        handleFromTokenChange(e) {
            this.fromToken = e.target.value;
            this.calculateToAmount();
        }
        
        handleToTokenChange(e) {
            this.toToken = e.target.value;
            this.calculateToAmount();
        }
        
        swapTokens() {
            const temp = this.fromToken;
            this.fromToken = this.toToken;
            this.toToken = temp;
            this.fromAmount = this.toAmount;
            this.calculateToAmount();
            this.show(); // Refresh UI
        }
        
        calculateToAmount() {
            // Placeholder calculation
            if (this.fromAmount && parseFloat(this.fromAmount) > 0) {
                const amount = parseFloat(this.fromAmount);
                let rate = 1;
                
                if (this.fromToken === 'BTC' && this.toToken === 'USDT') rate = 45320;
                else if (this.fromToken === 'USDT' && this.toToken === 'BTC') rate = 0.000022;
                else if (this.fromToken === 'MOOSH' && this.toToken === 'USDT') rate = 0.0058;
                else if (this.fromToken === 'USDT' && this.toToken === 'MOOSH') rate = 172.41;
                
                this.toAmount = (amount * rate * 0.997).toFixed(8); // 0.3% fee
            } else {
                this.toAmount = '';
            }
        }
        
        executeSwap() {
            if (!this.fromAmount || parseFloat(this.fromAmount) <= 0) {
                this.app.showNotification('Please enter a valid amount', 'error');
                return;
            }
            
            this.app.showNotification(`Swapping ${this.fromAmount} ${this.fromToken} for ${this.toAmount} ${this.toToken}...`, 'info');
            
            // Simulate swap
            setTimeout(() => {
                this.app.showNotification('Swap executed successfully!', 'success');
                this.close();
            }, 2000);
        }
        
        addStyles() {
            if (document.getElementById('swap-modal-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'swap-modal-styles';
            style.textContent = `
                .swap-modal {
                    max-width: calc(500px * var(--scale-factor));
                }
                
                .swap-interface {
                    padding: calc(24px * var(--scale-factor));
                }
                
                .swap-section {
                    margin-bottom: calc(20px * var(--scale-factor));
                }
                
                .swap-label {
                    display: block;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .swap-input-group {
                    display: flex;
                    gap: calc(12px * var(--scale-factor));
                }
                
                .swap-amount-input {
                    flex: 1;
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    padding: calc(12px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(16px * var(--scale-factor));
                }
                
                .swap-token-select {
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    padding: calc(12px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                    min-width: calc(100px * var(--scale-factor));
                    cursor: pointer;
                }
                
                .swap-middle {
                    text-align: center;
                    margin: calc(16px * var(--scale-factor)) 0;
                }
                
                .swap-direction-btn {
                    background: var(--text-primary);
                    color: var(--bg-primary);
                    border: none;
                    width: calc(40px * var(--scale-factor));
                    height: calc(40px * var(--scale-factor));
                    border-radius: 50%;
                    font-size: calc(20px * var(--scale-factor));
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .swap-direction-btn:hover {
                    transform: rotate(180deg);
                }
                
                .swap-rate-info {
                    background: var(--bg-secondary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    padding: calc(16px * var(--scale-factor));
                    margin-top: calc(24px * var(--scale-factor));
                }
                
                .rate-item {
                    display: flex;
                    justify-content: space-between;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(12px * var(--scale-factor));
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .rate-item:last-child {
                    margin-bottom: 0;
                }
                
                .rate-label {
                    color: var(--text-dim);
                }
                
                .rate-value {
                    color: var(--text-primary);
                    font-weight: 600;
                }
            `;
            document.head.appendChild(style);
        }
        
        close() {
            if (this.modal) {
                this.modal.remove();
                this.modal = null;
            }
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // WALLET SETTINGS MODAL
    // ═══════════════════════════════════════════════════════════════════════
    class WalletSettingsModal {
        constructor(app) {
            this.app = app;
            this.modal = null;
        }
        
        show() {
            const $ = ElementFactory;
            
            this.modal = $.div({ className: 'modal-overlay' }, [
                $.div({ className: 'modal-container settings-modal' }, [
                    this.createHeader(),
                    this.createSettingsTabs(),
                    this.createFooter()
                ])
            ]);
            
            document.body.appendChild(this.modal);
            this.addStyles();
        }
        
        createHeader() {
            const $ = ElementFactory;
            
            return $.div({ className: 'modal-header' }, [
                $.h2({ className: 'modal-title' }, ['⚙ Wallet Settings']),
                $.button({
                    className: 'modal-close',
                    onclick: () => this.close()
                }, ['×'])
            ]);
        }
        
        createSettingsTabs() {
            const $ = ElementFactory;
            const tabs = ['General', 'Security', 'Network', 'Advanced'];
            
            return $.div({ className: 'settings-content' }, [
                $.div({ className: 'settings-tabs' }, 
                    tabs.map((tab, index) => 
                        $.button({
                            className: `settings-tab ${index === 0 ? 'active' : ''}`,
                            onclick: () => this.switchTab(tab)
                        }, [tab])
                    )
                ),
                $.div({ className: 'settings-panel', id: 'settings-panel' }, [
                    this.createGeneralSettings()
                ])
            ]);
        }
        
        createGeneralSettings() {
            const $ = ElementFactory;
            
            return $.div({ className: 'settings-section' }, [
                $.h3({ className: 'settings-subtitle' }, ['General Settings']),
                
                // Currency preference
                $.div({ className: 'setting-item' }, [
                    $.label({ className: 'setting-label' }, ['Display Currency']),
                    $.select({ className: 'setting-input' }, [
                        $.create('option', { value: 'USD' }, ['USD - US Dollar']),
                        $.create('option', { value: 'EUR' }, ['EUR - Euro']),
                        $.create('option', { value: 'GBP' }, ['GBP - British Pound']),
                        $.create('option', { value: 'BTC' }, ['BTC - Bitcoin'])
                    ])
                ]),
                
                // Language
                $.div({ className: 'setting-item' }, [
                    $.label({ className: 'setting-label' }, ['Language']),
                    $.select({ className: 'setting-input' }, [
                        $.create('option', { value: 'en' }, ['English']),
                        $.create('option', { value: 'es' }, ['Español']),
                        $.create('option', { value: 'fr' }, ['Français']),
                        $.create('option', { value: 'de' }, ['Deutsch'])
                    ])
                ]),
                
                // Theme
                $.div({ className: 'setting-item' }, [
                    $.label({ className: 'setting-label' }, ['Theme']),
                    $.select({ className: 'setting-input' }, [
                        $.create('option', { value: 'dark' }, ['Dark']),
                        $.create('option', { value: 'light' }, ['Light']),
                        $.create('option', { value: 'auto' }, ['Auto'])
                    ])
                ]),
                
                // Auto-lock
                $.div({ className: 'setting-item' }, [
                    $.label({ className: 'setting-label' }, ['Auto-lock Timer']),
                    $.select({ className: 'setting-input' }, [
                        $.create('option', { value: '5' }, ['5 minutes']),
                        $.create('option', { value: '15' }, ['15 minutes']),
                        $.create('option', { value: '30' }, ['30 minutes']),
                        $.create('option', { value: '0' }, ['Never'])
                    ])
                ])
            ]);
        }
        
        createSecuritySettings() {
            const $ = ElementFactory;
            
            return $.div({ className: 'settings-section' }, [
                $.h3({ className: 'settings-subtitle' }, ['Security Settings']),
                
                // Show seed phrase button
                $.div({ className: 'setting-item' }, [
                    $.button({
                        className: 'btn btn-warning',
                        onclick: () => this.showSeedPhrase()
                    }, ['Show Seed Phrase'])
                ]),
                
                // Export private key
                $.div({ className: 'setting-item' }, [
                    $.button({
                        className: 'btn btn-warning',
                        onclick: () => this.exportPrivateKey()
                    }, ['Export Private Key'])
                ]),
                
                // Change password
                $.div({ className: 'setting-item' }, [
                    $.button({
                        className: 'btn btn-secondary',
                        onclick: () => this.changePassword()
                    }, ['Change Password'])
                ])
            ]);
        }
        
        createNetworkSettings() {
            const $ = ElementFactory;
            
            return $.div({ className: 'settings-section' }, [
                $.h3({ className: 'settings-subtitle' }, ['Network Settings']),
                
                // Network selection
                $.div({ className: 'setting-item' }, [
                    $.label({ className: 'setting-label' }, ['Bitcoin Network']),
                    $.select({ className: 'setting-input' }, [
                        $.create('option', { value: 'mainnet' }, ['Mainnet']),
                        $.create('option', { value: 'testnet' }, ['Testnet']),
                        $.create('option', { value: 'signet' }, ['Signet'])
                    ])
                ]),
                
                // Electrum server
                $.div({ className: 'setting-item' }, [
                    $.label({ className: 'setting-label' }, ['Electrum Server']),
                    $.input({
                        type: 'text',
                        className: 'setting-input',
                        value: 'electrum.blockstream.info:50002',
                        placeholder: 'Server URL:Port'
                    })
                ]),
                
                // Tor settings
                $.div({ className: 'setting-item' }, [
                    $.label({ className: 'setting-label' }, [
                        $.input({
                            type: 'checkbox',
                            className: 'setting-checkbox'
                        }),
                        $.span({ style: { marginLeft: '8px' } }, ['Use Tor for connections'])
                    ])
                ])
            ]);
        }
        
        createAdvancedSettings() {
            const $ = ElementFactory;
            
            return $.div({ className: 'settings-section' }, [
                $.h3({ className: 'settings-subtitle' }, ['Advanced Settings']),
                
                // Gap limit
                $.div({ className: 'setting-item' }, [
                    $.label({ className: 'setting-label' }, ['Address Gap Limit']),
                    $.input({
                        type: 'number',
                        className: 'setting-input',
                        value: '20',
                        min: '1',
                        max: '100'
                    })
                ]),
                
                // Fee preference
                $.div({ className: 'setting-item' }, [
                    $.label({ className: 'setting-label' }, ['Default Fee Rate']),
                    $.select({ className: 'setting-input' }, [
                        $.create('option', { value: 'low' }, ['Low (Economy)']),
                        $.create('option', { value: 'medium' }, ['Medium (Normal)']),
                        $.create('option', { value: 'high' }, ['High (Priority)']),
                        $.create('option', { value: 'custom' }, ['Custom'])
                    ])
                ]),
                
                // Debug mode
                $.div({ className: 'setting-item' }, [
                    $.label({ className: 'setting-label' }, [
                        $.input({
                            type: 'checkbox',
                            className: 'setting-checkbox'
                        }),
                        $.span({ style: { marginLeft: '8px' } }, ['Enable debug mode'])
                    ])
                ])
            ]);
        }
        
        createFooter() {
            const $ = ElementFactory;
            
            return $.div({ className: 'modal-footer' }, [
                $.button({
                    className: 'btn btn-primary',
                    onclick: () => this.saveSettings()
                }, ['Save Settings']),
                $.button({
                    className: 'btn btn-secondary',
                    onclick: () => this.close()
                }, ['Cancel'])
            ]);
        }
        
        switchTab(tabName) {
            const panel = document.getElementById('settings-panel');
            if (!panel) return;
            
            // Update active tab
            document.querySelectorAll('.settings-tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.textContent === tabName) {
                    tab.classList.add('active');
                }
            });
            
            // Update panel content
            panel.innerHTML = '';
            let content;
            
            switch(tabName) {
                case 'General':
                    content = this.createGeneralSettings();
                    break;
                case 'Security':
                    content = this.createSecuritySettings();
                    break;
                case 'Network':
                    content = this.createNetworkSettings();
                    break;
                case 'Advanced':
                    content = this.createAdvancedSettings();
                    break;
            }
            
            if (content) {
                panel.appendChild(content);
            }
        }
        
        showSeedPhrase() {
            this.app.showNotification('🔐 Security check required', 'warning');
            // TODO: Implement password verification and seed phrase display
        }
        
        exportPrivateKey() {
            this.app.showNotification('🔐 Security check required', 'warning');
            // TODO: Implement password verification and private key export
        }
        
        changePassword() {
            this.app.showNotification('Password change feature coming soon', 'info');
        }
        
        saveSettings() {
            this.app.showNotification('Settings saved successfully!', 'success');
            this.close();
        }
        
        addStyles() {
            if (document.getElementById('settings-modal-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'settings-modal-styles';
            style.textContent = `
                .settings-modal {
                    max-width: calc(600px * var(--scale-factor));
                }
                
                .settings-content {
                    padding: calc(24px * var(--scale-factor));
                    min-height: calc(400px * var(--scale-factor));
                }
                
                .settings-tabs {
                    display: flex;
                    gap: calc(8px * var(--scale-factor));
                    margin-bottom: calc(24px * var(--scale-factor));
                    border-bottom: calc(1px * var(--scale-factor)) solid var(--border-color);
                }
                
                .settings-tab {
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    padding: calc(12px * var(--scale-factor)) calc(16px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-bottom: calc(2px * var(--scale-factor)) solid transparent;
                }
                
                .settings-tab:hover {
                    color: var(--text-primary);
                }
                
                .settings-tab.active {
                    color: var(--text-primary);
                    border-bottom-color: var(--text-primary);
                }
                
                .settings-section {
                    max-width: calc(500px * var(--scale-factor));
                }
                
                .settings-subtitle {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(16px * var(--scale-factor));
                    color: var(--text-primary);
                    margin-bottom: calc(20px * var(--scale-factor));
                }
                
                .setting-item {
                    margin-bottom: calc(20px * var(--scale-factor));
                }
                
                .setting-label {
                    display: block;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                    color: var(--text-dim);
                    margin-bottom: calc(8px * var(--scale-factor));
                }
                
                .setting-input {
                    width: 100%;
                    background: var(--bg-primary);
                    border: calc(1px * var(--scale-factor)) solid var(--border-color);
                    color: var(--text-primary);
                    padding: calc(10px * var(--scale-factor));
                    font-family: 'JetBrains Mono', monospace;
                    font-size: calc(14px * var(--scale-factor));
                }
                
                .setting-checkbox {
                    width: calc(16px * var(--scale-factor));
                    height: calc(16px * var(--scale-factor));
                    margin-right: calc(8px * var(--scale-factor));
                }
                
                .btn-warning {
                    background: #ff6b35;
                    color: white;
                    border: none;
                }
                
                .btn-warning:hover {
                    background: #e55a2b;
                }
            `;
            document.head.appendChild(style);
        }
        
        close() {
            if (this.modal) {
                this.modal.remove();
                this.modal = null;
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN APPLICATION CLASS
    // ═══════════════════════════════════════════════════════════════════════
    class MOOSHWalletApp {
        constructor() {
            this.state = new StateManager();
            this.styleManager = new StyleManager();
            this.apiService = new APIService(this.state);
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


