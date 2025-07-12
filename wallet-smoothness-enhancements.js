// MOOSH WALLET SMOOTHNESS ENHANCEMENTS
// Performance optimizations and UI smoothness improvements

(function() {
    'use strict';

    // Performance monitoring
    const performanceMonitor = {
        metrics: {
            renderTimes: [],
            interactionDelays: [],
            animationFrames: []
        },
        
        start(operation) {
            return performance.now();
        },
        
        end(operation, startTime) {
            const duration = performance.now() - startTime;
            console.log(`[Performance] ${operation}: ${duration.toFixed(2)}ms`);
            return duration;
        }
    };

    // Smooth animations using requestAnimationFrame
    const smoothAnimations = {
        fadeIn(element, duration = 300) {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ease-out`;
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                });
            });
        },
        
        slideIn(element, from = 'bottom', duration = 300) {
            const transforms = {
                bottom: 'translateY(20px)',
                top: 'translateY(-20px)',
                left: 'translateX(-20px)',
                right: 'translateX(20px)'
            };
            
            element.style.transform = transforms[from];
            element.style.opacity = '0';
            element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}ms ease-out`;
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    element.style.transform = 'translate(0)';
                    element.style.opacity = '1';
                });
            });
        },
        
        smoothScroll(target, duration = 300) {
            const start = window.pageYOffset;
            const distance = target - start;
            const startTime = performance.now();
            
            function animation(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeInOutCubic = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                window.scrollTo(0, start + distance * easeInOutCubic);
                
                if (progress < 1) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        }
    };

    // Debouncing and throttling utilities
    const utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Smooth value transitions
        animateValue(start, end, duration, callback) {
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = start + (end - start) * easeOutQuart;
                
                callback(currentValue);
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }
    };

    // UI Enhancement patches
    const uiEnhancements = {
        // Smooth modal transitions
        enhanceModals() {
            const originalShow = window.MultiAccountModal?.prototype?.show;
            if (originalShow) {
                window.MultiAccountModal.prototype.show = function() {
                    const result = originalShow.call(this);
                    if (this.modal) {
                        smoothAnimations.fadeIn(this.modal);
                        const content = this.modal.querySelector('.terminal-box, .modal-container');
                        if (content) {
                            smoothAnimations.slideIn(content, 'bottom');
                        }
                    }
                    return result;
                };
            }
        },
        
        // Smooth button interactions
        enhanceButtons() {
            document.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    e.target.style.transform = 'scale(0.98)';
                    e.target.style.transition = 'transform 0.1s ease';
                }
            });
            
            document.addEventListener('mouseup', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    e.target.style.transform = 'scale(1)';
                }
            });
            
            // Add ripple effect to buttons
            document.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('no-ripple')) {
                    const button = e.target;
                    const ripple = document.createElement('span');
                    const rect = button.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                        position: absolute;
                        width: ${size}px;
                        height: ${size}px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.5);
                        transform: scale(0);
                        animation: ripple 0.6s ease-out;
                        left: ${x}px;
                        top: ${y}px;
                        pointer-events: none;
                    `;
                    
                    button.style.position = 'relative';
                    button.style.overflow = 'hidden';
                    button.appendChild(ripple);
                    
                    setTimeout(() => ripple.remove(), 600);
                }
            });
        },
        
        // Smooth balance updates
        enhanceBalanceDisplay() {
            if (window.MooshWallet?.ui?.dashboard?.updateBalance) {
                const originalUpdate = window.MooshWallet.ui.dashboard.updateBalance;
                
                window.MooshWallet.ui.dashboard.updateBalance = function(newBalance) {
                    const balanceElement = document.querySelector('.balance-amount');
                    if (balanceElement) {
                        const currentBalance = parseFloat(balanceElement.textContent) || 0;
                        const targetBalance = parseFloat(newBalance) || 0;
                        
                        if (currentBalance !== targetBalance) {
                            utils.animateValue(currentBalance, targetBalance, 1000, (value) => {
                                balanceElement.textContent = value.toFixed(8);
                            });
                        }
                    } else {
                        originalUpdate.call(this, newBalance);
                    }
                };
            }
        },
        
        // Smooth loading states
        enhanceLoadingStates() {
            const style = document.createElement('style');
            style.textContent = `
                /* Smooth transitions for all interactive elements */
                button, input, textarea, select {
                    transition: all 0.2s ease;
                }
                
                /* Smooth hover effects */
                button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(245, 115, 21, 0.3);
                }
                
                /* Smooth focus states */
                input:focus, textarea:focus, select:focus {
                    outline: none;
                    border-color: #f57315;
                    box-shadow: 0 0 0 2px rgba(245, 115, 21, 0.2);
                }
                
                /* Loading animation */
                .loading {
                    position: relative;
                    overflow: hidden;
                }
                
                .loading::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(245, 115, 21, 0.2),
                        transparent
                    );
                    animation: loading-shimmer 1.5s infinite;
                }
                
                @keyframes loading-shimmer {
                    to {
                        left: 100%;
                    }
                }
                
                /* Ripple effect */
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                /* Smooth modal animations */
                .modal-overlay {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .terminal-box, .modal-container {
                    animation: slideUp 0.3s ease-out;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                /* Smooth scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #111;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 4px;
                    transition: background 0.2s;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #f57315;
                }
                
                /* Prevent layout shifts */
                .balance-display, .address-display {
                    min-height: 1.5em;
                }
                
                /* Smooth notifications */
                .notification {
                    animation: notificationSlide 0.3s ease-out;
                }
                
                @keyframes notificationSlide {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                
                /* Performance optimizations */
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                
                /* GPU acceleration for animations */
                .modal-overlay, .terminal-box, .modal-container {
                    will-change: transform, opacity;
                }
                
                /* Reduce repaints */
                .balance-amount, .address-display {
                    transform: translateZ(0);
                }
            `;
            document.head.appendChild(style);
        },
        
        // Optimize resize handling
        optimizeResize() {
            const resizeHandler = utils.throttle(() => {
                if (window.MooshWallet?.ui?.dashboard?.handleResize) {
                    window.MooshWallet.ui.dashboard.handleResize();
                }
            }, 150);
            
            window.addEventListener('resize', resizeHandler);
        },
        
        // Optimize scroll performance
        optimizeScroll() {
            let ticking = false;
            
            function updateScroll() {
                // Add scroll-based optimizations here
                ticking = false;
            }
            
            document.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateScroll);
                    ticking = true;
                }
            }, { passive: true });
        },
        
        // Preload critical resources
        preloadResources() {
            // Preload fonts
            const fontLink = document.createElement('link');
            fontLink.rel = 'preload';
            fontLink.as = 'font';
            fontLink.type = 'font/woff2';
            fontLink.href = 'https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOV.woff2';
            fontLink.crossOrigin = 'anonymous';
            document.head.appendChild(fontLink);
        },
        
        // Initialize all enhancements
        init() {
            console.log('[SmoothEnhancements] Initializing performance optimizations...');
            
            this.enhanceLoadingStates();
            this.enhanceButtons();
            this.enhanceModals();
            this.enhanceBalanceDisplay();
            this.optimizeResize();
            this.optimizeScroll();
            this.preloadResources();
            
            // Monitor performance
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'largest-contentful-paint') {
                            console.log(`[Performance] LCP: ${entry.startTime.toFixed(2)}ms`);
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            }
            
            console.log('[SmoothEnhancements] All enhancements applied successfully');
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            uiEnhancements.init();
        });
    } else {
        uiEnhancements.init();
    }

    // Export for debugging
    window.MooshPerformance = {
        monitor: performanceMonitor,
        animations: smoothAnimations,
        utils: utils,
        enhancements: uiEnhancements
    };

})();