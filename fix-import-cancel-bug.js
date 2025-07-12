// MOOSH WALLET - FIX IMPORT/CANCEL MODAL BUG
// This fixes the issue where close buttons stop working after Import -> Cancel

(function() {
    'use strict';

    console.log('[ImportCancelFix] Initializing fix for Import -> Cancel bug...');

    // Wait for wallet to be ready
    function waitForWallet() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (window.MooshWallet && window.MultiAccountModal) {
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

    // Enhanced close method that ensures proper cleanup
    function enhancedClose() {
        console.log('[ImportCancelFix] Enhanced close called');
        
        // Remove all modal overlays
        const overlays = document.querySelectorAll('.modal-overlay');
        overlays.forEach(overlay => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        });
        
        // Reset modal states
        if (this) {
            this.modal = null;
            this.isCreating = false;
            this.isImporting = false;
        }
        
        // Navigate to dashboard after cleanup
        if (window.MooshWallet && window.MooshWallet.router) {
            setTimeout(() => {
                const currentPage = window.MooshWallet.router.currentPage;
                if (currentPage !== 'dashboard') {
                    window.MooshWallet.router.navigate('dashboard');
                }
            }, 350);
        }
    }

    // Patch MultiAccountModal
    async function patchMultiAccountModal() {
        await waitForWallet();
        
        console.log('[ImportCancelFix] Patching MultiAccountModal...');
        
        if (window.MultiAccountModal) {
            const ModalClass = window.MultiAccountModal;
            
            // Store original methods
            const originalShow = ModalClass.prototype.show;
            const originalClose = ModalClass.prototype.close;
            const originalCreateImportForm = ModalClass.prototype.createImportForm;
            
            // Enhanced show method that ensures proper modal creation
            ModalClass.prototype.show = function() {
                console.log('[ImportCancelFix] Show called, states:', {
                    isCreating: this.isCreating,
                    isImporting: this.isImporting,
                    hasModal: !!this.modal
                });
                
                // Clean up any existing modal first
                if (this.modal && this.modal.parentNode) {
                    this.modal.parentNode.removeChild(this.modal);
                    this.modal = null;
                }
                
                // Remove any orphaned overlays
                const existingOverlays = document.querySelectorAll('.modal-overlay');
                existingOverlays.forEach(overlay => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                });
                
                // Call original show
                const result = originalShow.call(this);
                
                // Ensure close functionality on all elements
                setTimeout(() => {
                    enhanceModalCloseButtons.call(this);
                }, 100);
                
                return result;
            };
            
            // Enhanced close method
            ModalClass.prototype.close = function() {
                console.log('[ImportCancelFix] Close called');
                
                // Use enhanced close
                enhancedClose.call(this);
                
                // Call original if it exists and does something different
                if (originalClose && originalClose !== enhancedClose) {
                    try {
                        originalClose.call(this);
                    } catch (e) {
                        console.warn('[ImportCancelFix] Original close error:', e);
                    }
                }
            };
            
            // Patch the import form creation to fix cancel button
            ModalClass.prototype.createImportForm = function() {
                const $ = window.ElementFactory || ElementFactory;
                
                return $.div({}, [
                    $.h3({ style: 'margin-bottom: 20px; color: var(--text-primary);' }, ['Import Account']),
                    $.div({ style: 'margin-bottom: 20px;' }, [
                        $.label({ style: 'display: block; margin-bottom: 5px; color: #666;' }, ['Account Name']),
                        $.input({
                            id: 'importAccountName',
                            type: 'text',
                            placeholder: 'Enter account name',
                            style: 'width: 100%; padding: 10px; background: #000; border: 1px solid #333; color: #fff; margin-bottom: 15px;',
                            value: `Imported ${(this.app.state.get('accounts') || []).length + 1}`
                        }),
                        $.label({ style: 'display: block; margin-bottom: 5px; color: #666;' }, ['Seed Phrase']),
                        $.textarea({
                            id: 'importSeedPhrase',
                            placeholder: 'Enter your 12 or 24 word seed phrase',
                            style: 'width: 100%; height: 80px; padding: 10px; background: #000; border: 1px solid #333; color: #fff; resize: none;'
                        })
                    ]),
                    $.div({ style: 'display: flex; gap: 10px; justify-content: center;' }, [
                        $.button({
                            style: 'background: #000; border: 2px solid #f57315; color: #f57315; padding: 10px 20px; cursor: pointer;',
                            onclick: () => this.handleImportAccount()
                        }, ['Import Account']),
                        $.button({
                            style: 'background: #000; border: 2px solid #666; color: #666; padding: 10px 20px; cursor: pointer;',
                            onclick: () => {
                                console.log('[ImportCancelFix] Cancel clicked in import form');
                                // Reset states
                                this.isImporting = false;
                                this.isCreating = false;
                                // Close current modal
                                this.close();
                                // Show main modal after a brief delay
                                setTimeout(() => {
                                    this.show();
                                }, 100);
                            }
                        }, ['Cancel'])
                    ])
                ]);
            };
            
            // Also patch the create form cancel button
            const originalCreateNewAccountForm = ModalClass.prototype.createNewAccountForm;
            if (originalCreateNewAccountForm) {
                ModalClass.prototype.createNewAccountForm = function() {
                    const form = originalCreateNewAccountForm.call(this);
                    
                    // Find and enhance the cancel button
                    setTimeout(() => {
                        const cancelButtons = document.querySelectorAll('button');
                        cancelButtons.forEach(btn => {
                            if (btn.textContent === 'Cancel' && !btn.dataset.enhanced) {
                                btn.dataset.enhanced = 'true';
                                const originalOnclick = btn.onclick;
                                btn.onclick = () => {
                                    console.log('[ImportCancelFix] Cancel clicked in create form');
                                    this.isCreating = false;
                                    this.isImporting = false;
                                    if (originalOnclick) originalOnclick();
                                };
                            }
                        });
                    }, 50);
                    
                    return form;
                };
            }
        }
        
        console.log('[ImportCancelFix] MultiAccountModal patched');
    }

    // Enhance close buttons in the current modal
    function enhanceModalCloseButtons() {
        const modal = this.modal || document.querySelector('.modal-overlay');
        if (!modal) return;
        
        // Enhance overlay click
        if (!modal.dataset.enhancedClose) {
            modal.dataset.enhancedClose = 'true';
            
            const originalOnclick = modal.onclick;
            modal.onclick = (e) => {
                if (e.target === modal || e.target.className === 'modal-overlay') {
                    console.log('[ImportCancelFix] Overlay clicked');
                    this.close();
                }
            };
        }
        
        // Enhance all close buttons
        const closeButtons = modal.querySelectorAll('.modal-close, button[onclick*="close"]');
        closeButtons.forEach(button => {
            if (!button.dataset.enhancedClose) {
                button.dataset.enhancedClose = 'true';
                
                const originalOnclick = button.onclick;
                button.onclick = (e) => {
                    console.log('[ImportCancelFix] Close button clicked');
                    this.close();
                };
            }
        });
        
        // Enhance Close text buttons
        const textButtons = modal.querySelectorAll('button');
        textButtons.forEach(button => {
            if (button.textContent === 'Close' && !button.dataset.enhancedClose) {
                button.dataset.enhancedClose = 'true';
                
                const originalOnclick = button.onclick;
                button.onclick = (e) => {
                    console.log('[ImportCancelFix] Close text button clicked');
                    this.close();
                };
            }
        });
    }

    // Monitor for modal creation
    function setupModalMonitor() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList && node.classList.contains('modal-overlay')) {
                        console.log('[ImportCancelFix] New modal detected');
                        
                        // Find the modal instance
                        setTimeout(() => {
                            if (window.MooshWallet) {
                                // Try to find which modal this is
                                const modalTypes = ['MultiAccountModal', 'SendModal', 'ReceiveModal', 'SettingsModal'];
                                modalTypes.forEach(type => {
                                    if (window[type]) {
                                        const instances = [];
                                        // Check if any instance has this modal
                                        // This is a bit hacky but necessary without instance tracking
                                        enhanceModalCloseButtons.call({ modal: node, close: enhancedClose });
                                    }
                                });
                            }
                        }, 100);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[ImportCancelFix] DOM monitor active');
    }

    // Initialize the fix
    async function init() {
        try {
            await waitForWallet();
            await patchMultiAccountModal();
            setupModalMonitor();
            
            console.log('[ImportCancelFix] All fixes applied successfully');
            
            // Test the fix is working
            window.testImportCancelFix = () => {
                console.log('[ImportCancelFix] Testing fix...');
                const modal = new MultiAccountModal(window.MooshWallet);
                modal.show();
                setTimeout(() => {
                    console.log('[ImportCancelFix] Simulating Import click...');
                    const importBtn = Array.from(document.querySelectorAll('button'))
                        .find(btn => btn.textContent === 'Import Account');
                    if (importBtn) {
                        importBtn.click();
                        setTimeout(() => {
                            console.log('[ImportCancelFix] Simulating Cancel click...');
                            const cancelBtn = Array.from(document.querySelectorAll('button'))
                                .find(btn => btn.textContent === 'Cancel');
                            if (cancelBtn) {
                                cancelBtn.click();
                            }
                        }, 1000);
                    }
                }, 1000);
            };
            
        } catch (error) {
            console.error('[ImportCancelFix] Error during initialization:', error);
        }
    }

    // Run the fix
    init();

})();