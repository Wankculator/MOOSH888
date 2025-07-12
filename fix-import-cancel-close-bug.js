// MOOSH WALLET - FIX IMPORT/CANCEL/CLOSE BUG
// This fixes the issue where Close button shows Import form instead of closing

(function() {
    'use strict';

    console.log('[ImportCancelCloseFix] Initializing fix for Import -> Cancel -> Close bug...');

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

    // Patch MultiAccountModal to fix the Close button behavior
    async function patchMultiAccountModal() {
        await waitForWallet();
        
        console.log('[ImportCancelCloseFix] Patching MultiAccountModal...');
        
        if (window.MultiAccountModal) {
            const ModalClass = window.MultiAccountModal;
            
            // Store original show method
            const originalShow = ModalClass.prototype.show;
            
            // Override show method to fix button handlers
            ModalClass.prototype.show = function() {
                console.log('[ImportCancelCloseFix] Show called, states:', {
                    isCreating: this.isCreating,
                    isImporting: this.isImporting
                });
                
                // Reset states when showing main modal
                if (!this.isCreating && !this.isImporting) {
                    console.log('[ImportCancelCloseFix] Showing main accounts modal');
                }
                
                // Call original show
                const result = originalShow.call(this);
                
                // Fix button handlers after modal is shown
                setTimeout(() => {
                    fixModalButtons.call(this);
                }, 100);
                
                return result;
            };
            
            // Override createButtonRow to ensure Close button works correctly
            const originalCreateButtonRow = ModalClass.prototype.createButtonRow;
            if (originalCreateButtonRow) {
                ModalClass.prototype.createButtonRow = function() {
                    const $ = window.ElementFactory || ElementFactory;
                    
                    return $.div({ style: 'display: flex; gap: 10px; margin-top: 20px; justify-content: center;' }, [
                        $.button({
                            style: 'background: #000; border: 2px solid #f57315; color: #f57315; padding: 10px 20px; cursor: pointer; transition: all 0.2s;',
                            onmouseover: (e) => { e.target.style.borderColor = '#ff8533'; e.target.style.color = '#ff8533'; },
                            onmouseout: (e) => { e.target.style.borderColor = '#f57315'; e.target.style.color = '#f57315'; },
                            onclick: () => { 
                                console.log('[ImportCancelCloseFix] Create New clicked');
                                this.isCreating = true; 
                                this.isImporting = false;
                                if (this.modal) {
                                    this.modal.remove();
                                }
                                this.show(); 
                            }
                        }, ['Create New']),
                        $.button({
                            style: 'background: #000; border: 2px solid #666; color: #666; padding: 10px 20px; cursor: pointer; transition: all 0.2s;',
                            onmouseover: (e) => { e.target.style.borderColor = '#999'; e.target.style.color = '#999'; },
                            onmouseout: (e) => { e.target.style.borderColor = '#666'; e.target.style.color = '#666'; },
                            onclick: () => { 
                                console.log('[ImportCancelCloseFix] Import Account clicked');
                                this.isImporting = true; 
                                this.isCreating = false;
                                if (this.modal) {
                                    this.modal.remove();
                                }
                                this.show(); 
                            }
                        }, ['Import Account']),
                        $.button({
                            id: 'modal-close-button',  // Add ID for easy identification
                            style: 'background: #000; border: 2px solid #666; color: #666; padding: 10px 20px; cursor: pointer; transition: all 0.2s;',
                            onmouseover: (e) => { e.target.style.borderColor = '#999'; e.target.style.color = '#999'; },
                            onmouseout: (e) => { e.target.style.borderColor = '#666'; e.target.style.color = '#666'; },
                            onclick: () => {
                                console.log('[ImportCancelCloseFix] Close clicked - properly closing modal');
                                this.close();
                            }
                        }, ['Close'])
                    ]);
                };
            }
            
            // Override close method to ensure proper cleanup
            const originalClose = ModalClass.prototype.close;
            ModalClass.prototype.close = function() {
                console.log('[ImportCancelCloseFix] Close called - cleaning up');
                
                // Reset all states
                this.isCreating = false;
                this.isImporting = false;
                
                // Remove modal
                if (this.modal && this.modal.parentNode) {
                    this.modal.style.opacity = '0';
                    setTimeout(() => {
                        if (this.modal && this.modal.parentNode) {
                            this.modal.parentNode.removeChild(this.modal);
                        }
                        this.modal = null;
                    }, 300);
                } else if (this.modal) {
                    this.modal = null;
                }
                
                // Navigate to dashboard
                if (window.MooshWallet && window.MooshWallet.router) {
                    const currentPage = window.MooshWallet.router.currentPage;
                    if (currentPage !== 'dashboard') {
                        window.MooshWallet.router.navigate('dashboard');
                    }
                }
                
                // Call original close if different
                if (originalClose && originalClose.toString() !== this.close.toString()) {
                    try {
                        originalClose.call(this);
                    } catch (e) {
                        console.warn('[ImportCancelCloseFix] Original close error:', e);
                    }
                }
            };
            
            // Patch createImportForm to fix Cancel button
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
                                console.log('[ImportCancelCloseFix] Cancel clicked - going back to main modal');
                                // Reset import state
                                this.isImporting = false;
                                this.isCreating = false;
                                // Remove current modal
                                if (this.modal) {
                                    this.modal.remove();
                                    this.modal = null;
                                }
                                // Show main modal
                                setTimeout(() => {
                                    this.show();
                                }, 50);
                            }
                        }, ['Cancel'])
                    ])
                ]);
            };
        }
        
        console.log('[ImportCancelCloseFix] MultiAccountModal patched');
    }

    // Fix modal buttons after they're rendered
    function fixModalButtons() {
        console.log('[ImportCancelCloseFix] Fixing modal buttons...');
        
        // Ensure Close button has correct handler
        const closeButton = document.getElementById('modal-close-button');
        if (closeButton && !closeButton.dataset.fixed) {
            closeButton.dataset.fixed = 'true';
            closeButton.onclick = () => {
                console.log('[ImportCancelCloseFix] Close button clicked (fixed handler)');
                this.close();
            };
        }
        
        // Also fix any button with text "Close"
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent === 'Close' && !button.dataset.fixed && button !== closeButton) {
                button.dataset.fixed = 'true';
                const modalInstance = this;
                button.onclick = () => {
                    console.log('[ImportCancelCloseFix] Close button clicked (text match)');
                    modalInstance.close();
                };
            }
        });
        
        // Fix overlay click
        const overlay = this.modal || document.querySelector('.modal-overlay');
        if (overlay && !overlay.dataset.fixed) {
            overlay.dataset.fixed = 'true';
            const modalInstance = this;
            overlay.onclick = (e) => {
                if (e.target === overlay || e.target.className === 'modal-overlay') {
                    console.log('[ImportCancelCloseFix] Overlay clicked');
                    modalInstance.close();
                }
            };
        }
    }

    // Monitor DOM for modal changes
    function setupModalMonitor() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.classList && node.classList.contains('modal-overlay')) {
                        console.log('[ImportCancelCloseFix] New modal detected');
                        
                        // Give it time to render, then fix buttons
                        setTimeout(() => {
                            const buttons = node.querySelectorAll('button');
                            buttons.forEach(button => {
                                if (button.textContent === 'Close' && !button.dataset.fixed) {
                                    console.log('[ImportCancelCloseFix] Fixing newly added Close button');
                                    button.dataset.fixed = 'true';
                                    button.onclick = () => {
                                        console.log('[ImportCancelCloseFix] Dynamically fixed Close button clicked');
                                        // Find modal instance and close it
                                        const overlay = button.closest('.modal-overlay');
                                        if (overlay) {
                                            overlay.style.opacity = '0';
                                            setTimeout(() => {
                                                if (overlay.parentNode) {
                                                    overlay.parentNode.removeChild(overlay);
                                                }
                                            }, 300);
                                        }
                                        // Navigate to dashboard
                                        if (window.MooshWallet && window.MooshWallet.router) {
                                            window.MooshWallet.router.navigate('dashboard');
                                        }
                                    };
                                }
                            });
                        }, 100);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[ImportCancelCloseFix] DOM monitor active');
    }

    // Initialize the fix
    async function init() {
        try {
            await waitForWallet();
            await patchMultiAccountModal();
            setupModalMonitor();
            
            console.log('[ImportCancelCloseFix] All fixes applied successfully');
            
            // Add global test function
            window.testImportCancelClose = () => {
                console.log('[ImportCancelCloseFix] Running test...');
                const modal = new MultiAccountModal(window.MooshWallet);
                modal.show();
                
                setTimeout(() => {
                    console.log('[ImportCancelCloseFix] Step 1: Clicking Import...');
                    const importBtn = Array.from(document.querySelectorAll('button'))
                        .find(btn => btn.textContent === 'Import Account');
                    if (importBtn) importBtn.click();
                    
                    setTimeout(() => {
                        console.log('[ImportCancelCloseFix] Step 2: Clicking Cancel...');
                        const cancelBtn = Array.from(document.querySelectorAll('button'))
                            .find(btn => btn.textContent === 'Cancel');
                        if (cancelBtn) cancelBtn.click();
                        
                        setTimeout(() => {
                            console.log('[ImportCancelCloseFix] Step 3: Clicking Close...');
                            const closeBtn = Array.from(document.querySelectorAll('button'))
                                .find(btn => btn.textContent === 'Close');
                            if (closeBtn) {
                                closeBtn.click();
                                console.log('[ImportCancelCloseFix] Test complete - check if modal closed');
                            } else {
                                console.error('[ImportCancelCloseFix] Close button not found!');
                            }
                        }, 1000);
                    }, 1000);
                }, 1000);
            };
            
        } catch (error) {
            console.error('[ImportCancelCloseFix] Error during initialization:', error);
        }
    }

    // Run the fix
    init();

})();