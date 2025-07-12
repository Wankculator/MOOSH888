// MOOSH WALLET ACCOUNTS FIX
// This file contains fixes for the + Accounts button functionality

(function() {
    'use strict';

    // Enhanced MultiAccountModal with debugging
    class EnhancedMultiAccountModal {
        constructor(app) {
            this.app = app;
            this.modal = null;
            this.isCreating = false;
            this.isImporting = false;
            console.log('[EnhancedMultiAccountModal] Initialized');
        }
        
        show() {
            console.log('[EnhancedMultiAccountModal] Show method called');
            
            try {
                const $ = window.ElementFactory || ElementFactory;
                const accounts = this.app.state.get('accounts') || [];
                const currentAccountId = this.app.state.get('currentAccountId');
                
                console.log('[EnhancedMultiAccountModal] Current accounts:', accounts);
                console.log('[EnhancedMultiAccountModal] Current account ID:', currentAccountId);
                
                // Remove any existing modal first
                const existingModal = document.querySelector('.modal-overlay');
                if (existingModal) {
                    console.log('[EnhancedMultiAccountModal] Removing existing modal');
                    existingModal.remove();
                }
                
                this.modal = $.div({
                    className: 'modal-overlay accounts-modal-overlay',
                    style: {
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: '999999',
                        opacity: '0',
                        transition: 'opacity 0.3s ease'
                    },
                    onclick: (e) => {
                        if (e.target === this.modal) this.close();
                    }
                }, [
                    $.div({
                        className: 'terminal-box accounts-terminal-box',
                        style: {
                            background: '#000000',
                            border: '2px solid #f57315',
                            borderRadius: '0',
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '90vh',
                            overflow: 'hidden',
                            boxShadow: '0 0 20px rgba(245, 115, 21, 0.5)',
                            transform: 'scale(0.9)',
                            transition: 'transform 0.3s ease'
                        }
                    }, [
                        $.div({ 
                            className: 'terminal-header',
                            style: {
                                background: '#1a1a1a',
                                padding: '10px',
                                borderBottom: '1px solid #f57315',
                                color: '#f57315',
                                fontFamily: 'JetBrains Mono, monospace'
                            }
                        }, [
                            $.span({}, ['~/moosh/accounts $ ']),
                            $.button({
                                style: {
                                    float: 'right',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#f57315',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                },
                                onclick: () => this.close()
                            }, ['×'])
                        ]),
                        $.div({ 
                            className: 'terminal-content', 
                            style: {
                                padding: '20px',
                                overflowY: 'auto',
                                maxHeight: 'calc(90vh - 60px)'
                            }
                        }, [
                            this.isCreating ? this.createNewAccountForm() :
                            this.isImporting ? this.createImportForm() :
                            $.div({}, [
                                this.createAccountList(accounts, currentAccountId),
                                this.createActions()
                            ])
                        ])
                    ])
                ]);
                
                // Add to DOM
                document.body.appendChild(this.modal);
                console.log('[EnhancedMultiAccountModal] Modal added to DOM');
                
                // Force reflow to ensure transition works
                this.modal.offsetHeight;
                
                // Animate in
                requestAnimationFrame(() => {
                    this.modal.style.opacity = '1';
                    const terminalBox = this.modal.querySelector('.accounts-terminal-box');
                    if (terminalBox) {
                        terminalBox.style.transform = 'scale(1)';
                    }
                });
                
                // Add escape key handler
                this.escapeHandler = (e) => {
                    if (e.key === 'Escape') this.close();
                };
                document.addEventListener('keydown', this.escapeHandler);
                
            } catch (error) {
                console.error('[EnhancedMultiAccountModal] Error showing modal:', error);
                this.app.showNotification('Error opening accounts modal', 'error');
            }
        }
        
        createAccountList(accounts, currentAccountId) {
            const $ = window.ElementFactory || ElementFactory;
            
            if (accounts.length === 0) {
                return $.div({ 
                    style: {
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666'
                    }
                }, [
                    $.p({}, ['No accounts found. Create your first account!']),
                    $.button({
                        className: 'btn-primary',
                        style: {
                            marginTop: '20px',
                            background: '#000',
                            border: '2px solid #f57315',
                            color: '#f57315',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            fontFamily: 'JetBrains Mono, monospace'
                        },
                        onclick: () => {
                            this.isCreating = true;
                            this.refresh();
                        }
                    }, ['Create First Account'])
                ]);
            }
            
            return $.div({ style: { marginBottom: '20px' } }, [
                $.h3({ 
                    style: {
                        marginBottom: '15px',
                        color: '#f57315',
                        fontFamily: 'JetBrains Mono, monospace'
                    }
                }, ['Your Accounts']),
                ...accounts.map(account => this.createAccountItem(account, account.id === currentAccountId))
            ]);
        }
        
        createAccountItem(account, isActive) {
            const $ = window.ElementFactory || ElementFactory;
            
            return $.div({
                className: 'account-item',
                style: {
                    padding: '15px',
                    margin: '10px 0',
                    background: isActive ? 'rgba(245, 115, 21, 0.1)' : '#111',
                    border: `1px solid ${isActive ? '#f57315' : '#333'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                onclick: () => {
                    if (!isActive) {
                        this.app.state.switchAccount(account.id);
                        this.app.showNotification(`Switched to ${account.name}`, 'success');
                        this.refresh();
                    }
                }
            }, [
                $.div({}, [
                    $.div({ 
                        style: {
                            fontWeight: '600',
                            color: isActive ? '#f57315' : '#fff',
                            marginBottom: '5px'
                        }
                    }, [account.name]),
                    $.div({ 
                        style: {
                            fontSize: '12px',
                            color: '#666',
                            fontFamily: 'monospace'
                        }
                    }, [
                        account.addresses?.spark ? 
                        `${account.addresses.spark.slice(0, 16)}...${account.addresses.spark.slice(-8)}` :
                        'No address'
                    ])
                ]),
                $.div({ 
                    style: {
                        display: 'flex',
                        gap: '10px'
                    }
                }, [
                    $.button({
                        style: {
                            background: 'transparent',
                            border: '1px solid #666',
                            color: '#666',
                            padding: '5px 10px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        },
                        onclick: (e) => {
                            e.stopPropagation();
                            this.renameAccount(account);
                        }
                    }, ['Rename']),
                    accounts.length > 1 ? $.button({
                        style: {
                            background: 'transparent',
                            border: '1px solid #ff4444',
                            color: '#ff4444',
                            padding: '5px 10px',
                            fontSize: '12px',
                            cursor: 'pointer'
                        },
                        onclick: (e) => {
                            e.stopPropagation();
                            this.deleteAccount(account.id);
                        }
                    }, ['Delete']) : null
                ])
            ]);
        }
        
        createActions() {
            const $ = window.ElementFactory || ElementFactory;
            
            return $.div({ 
                style: {
                    marginTop: '30px',
                    display: 'flex',
                    gap: '10px'
                }
            }, [
                $.button({
                    className: 'btn-primary',
                    style: {
                        flex: '1',
                        background: '#000',
                        border: '2px solid #f57315',
                        color: '#f57315',
                        padding: '12px',
                        cursor: 'pointer',
                        fontFamily: 'JetBrains Mono, monospace',
                        transition: 'all 0.2s'
                    },
                    onclick: () => {
                        this.isCreating = true;
                        this.refresh();
                    },
                    onmouseover: (e) => {
                        e.target.style.background = '#f57315';
                        e.target.style.color = '#000';
                    },
                    onmouseout: (e) => {
                        e.target.style.background = '#000';
                        e.target.style.color = '#f57315';
                    }
                }, ['+ Create Account']),
                $.button({
                    className: 'btn-secondary',
                    style: {
                        flex: '1',
                        background: '#000',
                        border: '2px solid #666',
                        color: '#666',
                        padding: '12px',
                        cursor: 'pointer',
                        fontFamily: 'JetBrains Mono, monospace',
                        transition: 'all 0.2s'
                    },
                    onclick: () => {
                        this.isImporting = true;
                        this.refresh();
                    },
                    onmouseover: (e) => {
                        e.target.style.borderColor = '#f57315';
                        e.target.style.color = '#f57315';
                    },
                    onmouseout: (e) => {
                        e.target.style.borderColor = '#666';
                        e.target.style.color = '#666';
                    }
                }, ['Import Account'])
            ]);
        }
        
        createNewAccountForm() {
            const $ = window.ElementFactory || ElementFactory;
            
            return $.div({}, [
                $.h3({ 
                    style: {
                        marginBottom: '20px',
                        color: '#f57315'
                    }
                }, ['Create New Account']),
                $.div({ style: { marginBottom: '15px' } }, [
                    $.label({ 
                        style: {
                            display: 'block',
                            marginBottom: '5px',
                            color: '#666'
                        }
                    }, ['Account Name']),
                    $.input({
                        type: 'text',
                        id: 'new-account-name',
                        placeholder: 'Enter account name',
                        style: {
                            width: '100%',
                            padding: '10px',
                            background: '#000',
                            border: '1px solid #333',
                            color: '#fff',
                            fontFamily: 'JetBrains Mono, monospace'
                        },
                        value: `Account ${(this.app.state.get('accounts') || []).length + 1}`
                    })
                ]),
                $.div({ 
                    style: {
                        display: 'flex',
                        gap: '10px',
                        marginTop: '20px'
                    }
                }, [
                    $.button({
                        style: {
                            flex: '1',
                            background: '#000',
                            border: '2px solid #f57315',
                            color: '#f57315',
                            padding: '10px',
                            cursor: 'pointer'
                        },
                        onclick: () => this.handleCreateAccount()
                    }, ['Create']),
                    $.button({
                        style: {
                            flex: '1',
                            background: '#000',
                            border: '2px solid #666',
                            color: '#666',
                            padding: '10px',
                            cursor: 'pointer'
                        },
                        onclick: () => {
                            this.isCreating = false;
                            this.refresh();
                        }
                    }, ['Cancel'])
                ])
            ]);
        }
        
        async handleCreateAccount() {
            const nameInput = document.getElementById('new-account-name');
            const name = nameInput?.value.trim() || `Account ${(this.app.state.get('accounts') || []).length + 1}`;
            
            try {
                console.log('[EnhancedMultiAccountModal] Creating account:', name);
                await this.app.state.createAccount(name);
                this.app.showNotification(`Account "${name}" created successfully`, 'success');
                this.isCreating = false;
                this.refresh();
            } catch (error) {
                console.error('[EnhancedMultiAccountModal] Error creating account:', error);
                this.app.showNotification('Failed to create account', 'error');
            }
        }
        
        refresh() {
            if (this.modal) {
                this.modal.remove();
            }
            this.show();
        }
        
        close() {
            console.log('[EnhancedMultiAccountModal] Closing modal');
            
            if (this.escapeHandler) {
                document.removeEventListener('keydown', this.escapeHandler);
            }
            
            if (this.modal) {
                this.modal.style.opacity = '0';
                const terminalBox = this.modal.querySelector('.accounts-terminal-box');
                if (terminalBox) {
                    terminalBox.style.transform = 'scale(0.9)';
                }
                
                setTimeout(() => {
                    if (this.modal && this.modal.parentNode) {
                        this.modal.remove();
                    }
                }, 300);
            }
        }
        
        deleteAccount(accountId) {
            const account = this.app.state.getAccountById(accountId);
            if (!account) return;
            
            if (confirm(`Are you sure you want to delete "${account.name}"?`)) {
                try {
                    this.app.state.deleteAccount(accountId);
                    this.app.showNotification(`Account "${account.name}" deleted`, 'success');
                    this.refresh();
                } catch (error) {
                    this.app.showNotification(error.message, 'error');
                }
            }
        }
        
        renameAccount(account) {
            const newName = prompt('Enter new account name:', account.name);
            if (newName && newName.trim() !== account.name) {
                this.app.state.renameAccount(account.id, newName.trim());
                this.app.showNotification(`Account renamed to "${newName.trim()}"`, 'success');
                this.refresh();
            }
        }
        
        createImportForm() {
            const $ = window.ElementFactory || ElementFactory;
            
            return $.div({}, [
                $.h3({ 
                    style: {
                        marginBottom: '20px',
                        color: '#f57315'
                    }
                }, ['Import Account']),
                $.div({ style: { marginBottom: '15px' } }, [
                    $.label({ 
                        style: {
                            display: 'block',
                            marginBottom: '5px',
                            color: '#666'
                        }
                    }, ['Account Name']),
                    $.input({
                        type: 'text',
                        id: 'import-account-name',
                        placeholder: 'Enter account name',
                        style: {
                            width: '100%',
                            padding: '10px',
                            background: '#000',
                            border: '1px solid #333',
                            color: '#fff',
                            marginBottom: '15px',
                            fontFamily: 'JetBrains Mono, monospace'
                        },
                        value: `Imported ${(this.app.state.get('accounts') || []).length + 1}`
                    }),
                    $.label({ 
                        style: {
                            display: 'block',
                            marginBottom: '5px',
                            color: '#666'
                        }
                    }, ['Seed Phrase']),
                    $.textarea({
                        id: 'import-seed-phrase',
                        placeholder: 'Enter your 12 or 24 word seed phrase',
                        style: {
                            width: '100%',
                            height: '80px',
                            padding: '10px',
                            background: '#000',
                            border: '1px solid #333',
                            color: '#fff',
                            fontFamily: 'JetBrains Mono, monospace',
                            resize: 'vertical'
                        }
                    })
                ]),
                $.div({ 
                    style: {
                        display: 'flex',
                        gap: '10px',
                        marginTop: '20px'
                    }
                }, [
                    $.button({
                        style: {
                            flex: '1',
                            background: '#000',
                            border: '2px solid #f57315',
                            color: '#f57315',
                            padding: '10px',
                            cursor: 'pointer'
                        },
                        onclick: () => this.handleImportAccount()
                    }, ['Import']),
                    $.button({
                        style: {
                            flex: '1',
                            background: '#000',
                            border: '2px solid #666',
                            color: '#666',
                            padding: '10px',
                            cursor: 'pointer'
                        },
                        onclick: () => {
                            this.isImporting = false;
                            this.refresh();
                        }
                    }, ['Cancel'])
                ])
            ]);
        }
        
        async handleImportAccount() {
            const nameInput = document.getElementById('import-account-name');
            const seedInput = document.getElementById('import-seed-phrase');
            
            const name = nameInput?.value.trim() || `Imported ${(this.app.state.get('accounts') || []).length + 1}`;
            const seed = seedInput?.value.trim();
            
            if (!seed) {
                this.app.showNotification('Please enter a seed phrase', 'error');
                return;
            }
            
            try {
                console.log('[EnhancedMultiAccountModal] Importing account:', name);
                // TODO: Implement actual import with seed validation
                this.app.showNotification('Import functionality coming soon', 'info');
                this.isImporting = false;
                this.refresh();
            } catch (error) {
                console.error('[EnhancedMultiAccountModal] Error importing account:', error);
                this.app.showNotification('Failed to import account', 'error');
            }
        }
    }

    // Export for use
    window.EnhancedMultiAccountModal = EnhancedMultiAccountModal;
    
    // Patch the existing showMultiAccountManager method if wallet is loaded
    if (window.MooshWallet && window.MooshWallet.ui && window.MooshWallet.ui.dashboard) {
        const originalMethod = window.MooshWallet.ui.dashboard.showMultiAccountManager;
        
        window.MooshWallet.ui.dashboard.showMultiAccountManager = function() {
            console.log('[AccountsFix] Intercepted showMultiAccountManager call');
            try {
                const modal = new EnhancedMultiAccountModal(window.MooshWallet);
                modal.show();
            } catch (error) {
                console.error('[AccountsFix] Error showing enhanced modal:', error);
                // Fall back to original method
                if (originalMethod) {
                    originalMethod.call(this);
                }
            }
        };
        
        console.log('[AccountsFix] Successfully patched showMultiAccountManager');
    } else {
        console.log('[AccountsFix] Waiting for wallet to load...');
        
        // Set up observer to patch when wallet loads
        const observer = new MutationObserver(() => {
            if (window.MooshWallet && window.MooshWallet.ui && window.MooshWallet.ui.dashboard) {
                console.log('[AccountsFix] Wallet loaded, patching now');
                
                const originalMethod = window.MooshWallet.ui.dashboard.showMultiAccountManager;
                
                window.MooshWallet.ui.dashboard.showMultiAccountManager = function() {
                    console.log('[AccountsFix] Intercepted showMultiAccountManager call');
                    try {
                        const modal = new EnhancedMultiAccountModal(window.MooshWallet);
                        modal.show();
                    } catch (error) {
                        console.error('[AccountsFix] Error showing enhanced modal:', error);
                        if (originalMethod) {
                            originalMethod.call(this);
                        }
                    }
                };
                
                observer.disconnect();
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
})();