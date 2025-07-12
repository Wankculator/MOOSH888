// MOOSH WALLET - FIX MODAL CLOSE TO RETURN TO DASHBOARD
// This ensures all modal close buttons properly navigate back to the dashboard

(function() {
    'use strict';

    console.log('[ModalCloseFix] Initializing modal close navigation fix...');

    // Wait for wallet to be ready
    function waitForWallet() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (window.MooshWallet && window.MooshWallet.router) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 10000);
        });
    }

    // Enhanced close function that ensures dashboard navigation
    function enhancedClose(originalClose, modalInstance) {
        return function() {
            console.log('[ModalCloseFix] Modal closing, navigating to dashboard...');
            
            // Call original close if exists
            if (originalClose) {
                originalClose.call(this);
            }
            
            // Ensure we navigate to dashboard
            if (window.MooshWallet && window.MooshWallet.router) {
                const currentPage = window.MooshWallet.router.currentPage;
                
                // Only navigate if not already on dashboard
                if (currentPage !== 'dashboard') {
                    window.MooshWallet.router.navigate('dashboard');
                }
                
                // Ensure the dashboard is refreshed
                if (window.MooshWallet.ui && window.MooshWallet.ui.dashboard) {
                    setTimeout(() => {
                        if (window.MooshWallet.ui.dashboard.refreshBalances) {
                            window.MooshWallet.ui.dashboard.refreshBalances();
                        }
                    }, 100);
                }
            }
        };
    }

    // Patch all modal classes
    async function patchModalClasses() {
        await waitForWallet();
        
        const modalClasses = [
            'MultiAccountModal',
            'SendModal',
            'ReceiveModal',
            'SettingsModal',
            'WalletSettingsModal',
            'TransactionHistoryModal',
            'TokenMenuModal',
            'SwapModal',
            'SparkSatDashboardModal',
            'SparkSatDepositModal',
            'LightningChannelModal',
            'SendPaymentModal',
            'ReceivePaymentModal'
        ];

        modalClasses.forEach(className => {
            if (window[className]) {
                console.log(`[ModalCloseFix] Patching ${className}...`);
                
                const ModalClass = window[className];
                
                // Patch close method
                if (ModalClass.prototype.close) {
                    const originalClose = ModalClass.prototype.close;
                    ModalClass.prototype.close = enhancedClose(originalClose);
                }
                
                // Patch closeModal method if exists
                if (ModalClass.prototype.closeModal) {
                    const originalCloseModal = ModalClass.prototype.closeModal;
                    ModalClass.prototype.closeModal = enhancedClose(originalCloseModal);
                }
                
                // Also patch the show method to ensure close buttons work
                const originalShow = ModalClass.prototype.show;
                if (originalShow) {
                    ModalClass.prototype.show = function() {
                        // Call original show
                        const result = originalShow.call(this);
                        
                        // After modal is shown, enhance close buttons
                        setTimeout(() => {
                            enhanceCloseButtons();
                        }, 100);
                        
                        return result;
                    };
                }
            }
        });
        
        console.log('[ModalCloseFix] Modal classes patched');
    }

    // Enhance close buttons in the DOM
    function enhanceCloseButtons() {
        // Find all close buttons
        const closeButtons = document.querySelectorAll('.modal-close, button[onclick*="close"], button[onclick*="Close"]');
        
        closeButtons.forEach(button => {
            // Skip if already enhanced
            if (button.dataset.enhancedClose) return;
            
            // Mark as enhanced
            button.dataset.enhancedClose = 'true';
            
            // Store original onclick
            const originalOnclick = button.onclick;
            
            // Create new onclick that ensures dashboard navigation
            button.onclick = function(e) {
                console.log('[ModalCloseFix] Close button clicked');
                
                // Call original onclick if exists
                if (originalOnclick) {
                    originalOnclick.call(this, e);
                }
                
                // Close any open modals
                const modals = document.querySelectorAll('.modal-overlay');
                modals.forEach(modal => {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        if (modal.parentNode) {
                            modal.parentNode.removeChild(modal);
                        }
                    }, 300);
                });
                
                // Navigate to dashboard
                if (window.MooshWallet && window.MooshWallet.router) {
                    setTimeout(() => {
                        window.MooshWallet.router.navigate('dashboard');
                    }, 350);
                }
            };
        });
        
        // Also enhance overlay clicks
        const overlays = document.querySelectorAll('.modal-overlay');
        overlays.forEach(overlay => {
            if (overlay.dataset.enhancedClose) return;
            overlay.dataset.enhancedClose = 'true';
            
            const originalOnclick = overlay.onclick;
            
            overlay.onclick = function(e) {
                // Only close if clicking the overlay itself
                if (e.target === this) {
                    console.log('[ModalCloseFix] Overlay clicked');
                    
                    if (originalOnclick) {
                        originalOnclick.call(this, e);
                    }
                    
                    // Navigate to dashboard after close animation
                    setTimeout(() => {
                        if (window.MooshWallet && window.MooshWallet.router) {
                            window.MooshWallet.router.navigate('dashboard');
                        }
                    }, 350);
                }
            };
        });
    }

    // Monitor DOM for new modals
    function setupModalMonitor() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('modal-overlay')) {
                            console.log('[ModalCloseFix] New modal detected');
                            setTimeout(() => {
                                enhanceCloseButtons();
                            }, 100);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[ModalCloseFix] DOM monitor active');
    }

    // Patch the global showNotification to ensure it doesn't interfere
    function patchNotifications() {
        if (window.MooshWallet && window.MooshWallet.showNotification) {
            const originalShowNotification = window.MooshWallet.showNotification;
            
            window.MooshWallet.showNotification = function(message, type) {
                // Call original
                originalShowNotification.call(this, message, type);
                
                // If it's a success message after modal action, ensure we're on dashboard
                if (type === 'success' && message.includes('success')) {
                    setTimeout(() => {
                        const currentPage = window.MooshWallet.router.currentPage;
                        if (currentPage !== 'dashboard') {
                            window.MooshWallet.router.navigate('dashboard');
                        }
                    }, 500);
                }
            };
        }
    }

    // Initialize the fix
    async function init() {
        try {
            await waitForWallet();
            await patchModalClasses();
            setupModalMonitor();
            patchNotifications();
            
            // Initial enhancement of any existing buttons
            enhanceCloseButtons();
            
            console.log('[ModalCloseFix] All fixes applied successfully');
            
            // Test: Log when modals are opened/closed
            document.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    const text = e.target.textContent;
                    if (text.includes('Send') || text.includes('Receive') || 
                        text.includes('Settings') || text.includes('Accounts')) {
                        console.log(`[ModalCloseFix] Opening modal: ${text}`);
                    }
                }
            });
            
        } catch (error) {
            console.error('[ModalCloseFix] Error during initialization:', error);
        }
    }

    // Run the fix
    init();

})();