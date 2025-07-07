// MOOSH WALLET - Responsive Utilities
// Professional mobile/desktop optimization patterns

export class ResponsiveUtils {
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
            }, 100);
        }, { passive: true });
        
        element.addEventListener('touchcancel', () => {
            element.classList.remove('touch-active');
            clearTimeout(touchTimeout);
        }, { passive: true });
    }

    static getScaleFactor() {
        const breakpoint = this.getBreakpoint();
        const scaleFactors = {
            xs: 0.75,
            sm: 0.8,
            md: 0.85,
            lg: 0.9,
            xl: 0.95,
            xxl: 1,
            xxxl: 1.1
        };
        return scaleFactors[breakpoint];
    }

    static setupViewportHandler() {
        let resizeTimer;
        
        const handleViewportChange = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.documentElement.style.setProperty('--current-breakpoint', this.getBreakpoint());
                document.documentElement.style.setProperty('--scale-factor', this.getScaleFactor());
                
                // Dispatch custom event for components to react
                window.dispatchEvent(new CustomEvent('viewportchange', {
                    detail: {
                        breakpoint: this.getBreakpoint(),
                        width: window.innerWidth,
                        height: window.innerHeight,
                        isMobile: this.isMobile(),
                        isTablet: this.isTablet(),
                        isDesktop: this.isDesktop()
                    }
                }));
            }, 250);
        };
        
        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('orientationchange', handleViewportChange);
        
        // Initial setup
        handleViewportChange();
    }

    static getOptimalImageSize(baseSize) {
        const dpr = window.devicePixelRatio || 1;
        const breakpoint = this.getBreakpoint();
        
        const multipliers = {
            xs: 0.5,
            sm: 0.75,
            md: 1,
            lg: 1.5,
            xl: 2,
            xxl: 2.5,
            xxxl: 3
        };
        
        return Math.round(baseSize * multipliers[breakpoint] * dpr);
    }

    static isTouchDevice() {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }

    static getOrientation() {
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }

    static matchesBreakpoint(query) {
        const breakpoint = this.getBreakpoint();
        const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'];
        const currentIndex = breakpointOrder.indexOf(breakpoint);
        
        // Parse query like ">=md" or "<lg"
        const match = query.match(/^(>=?|<=?|=)(\w+)$/);
        if (!match) return false;
        
        const [, operator, targetBreakpoint] = match;
        const targetIndex = breakpointOrder.indexOf(targetBreakpoint);
        
        if (targetIndex === -1) return false;
        
        switch (operator) {
            case '=': return currentIndex === targetIndex;
            case '>': return currentIndex > targetIndex;
            case '>=': return currentIndex >= targetIndex;
            case '<': return currentIndex < targetIndex;
            case '<=': return currentIndex <= targetIndex;
            default: return false;
        }
    }

    static createMediaQueryList() {
        const queries = {};
        Object.entries(this.BREAKPOINTS).forEach(([name, width]) => {
            queries[`min-${name}`] = window.matchMedia(`(min-width: ${width}px)`);
            queries[`max-${name}`] = window.matchMedia(`(max-width: ${width - 1}px)`);
        });
        return queries;
    }

    static observeElement(element, callback) {
        if (!window.ResizeObserver) return;
        
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                callback({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                    element: entry.target
                });
            }
        });
        
        observer.observe(element);
        return () => observer.disconnect();
    }
}

// Initialize on load
if (typeof window !== 'undefined') {
    ResponsiveUtils.setupViewportHandler();
}