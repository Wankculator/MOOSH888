// MOOSH WALLET - Button Component
// Professional reusable button with proper styling and interactions

import { $ } from '../utils/ElementFactory.js';

export class Button {
    constructor(props = {}) {
        this.props = {
            text: '',
            variant: 'primary', // primary, secondary, danger, ghost
            size: 'medium', // small, medium, large
            fullWidth: false,
            disabled: false,
            loading: false,
            icon: null,
            onClick: () => {},
            className: '',
            ...props
        };
        
        this.element = this.render();
    }
    
    render() {
        const baseClasses = [
            'moosh-button',
            `moosh-button--${this.props.variant}`,
            `moosh-button--${this.props.size}`,
            this.props.fullWidth ? 'moosh-button--full-width' : '',
            this.props.disabled ? 'moosh-button--disabled' : '',
            this.props.loading ? 'moosh-button--loading' : '',
            this.props.className
        ].filter(Boolean).join(' ');
        
        const button = $.button({
            className: baseClasses,
            disabled: this.props.disabled || this.props.loading,
            onclick: this.props.onClick,
            type: 'button',
            style: this.getStyles()
        }, [
            this.props.loading ? this.createSpinner() : null,
            this.props.icon && !this.props.loading ? this.props.icon : null,
            $.span({ 
                className: 'moosh-button__text',
                style: { visibility: this.props.loading ? 'hidden' : 'visible' }
            }, [this.props.text])
        ].filter(Boolean));
        
        return button;
    }
    
    getStyles() {
        const styles = {
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'calc(8px * var(--scale-factor))',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: '500',
            cursor: this.props.disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            border: 'none',
            borderRadius: '0',
            outline: 'none',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent'
        };
        
        // Size styles
        const sizeStyles = {
            small: {
                height: 'calc(36px * var(--scale-factor))',
                padding: '0 calc(16px * var(--scale-factor))',
                fontSize: 'calc(12px * var(--scale-factor))'
            },
            medium: {
                height: 'calc(48px * var(--scale-factor))',
                padding: '0 calc(24px * var(--scale-factor))',
                fontSize: 'calc(14px * var(--scale-factor))'
            },
            large: {
                height: 'calc(56px * var(--scale-factor))',
                padding: '0 calc(32px * var(--scale-factor))',
                fontSize: 'calc(16px * var(--scale-factor))'
            }
        };
        
        // Variant styles
        const variantStyles = {
            primary: {
                background: '#007bff',
                color: '#ffffff',
                border: '2px solid #007bff'
            },
            secondary: {
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '2px solid var(--border-color)'
            },
            danger: {
                background: '#dc3545',
                color: '#ffffff',
                border: '2px solid #dc3545'
            },
            ghost: {
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '2px solid transparent'
            }
        };
        
        // Apply size and variant styles
        Object.assign(styles, sizeStyles[this.props.size]);
        Object.assign(styles, variantStyles[this.props.variant]);
        
        // Full width
        if (this.props.fullWidth) {
            styles.width = '100%';
        }
        
        // Disabled state
        if (this.props.disabled) {
            styles.opacity = '0.5';
        }
        
        return styles;
    }
    
    createSpinner() {
        return $.div({
            className: 'moosh-button__spinner',
            style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'calc(16px * var(--scale-factor))',
                height: 'calc(16px * var(--scale-factor))',
                border: '2px solid currentColor',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }
        });
    }
    
    // Public methods
    setLoading(loading) {
        this.props.loading = loading;
        this.updateElement();
    }
    
    setDisabled(disabled) {
        this.props.disabled = disabled;
        this.updateElement();
    }
    
    setText(text) {
        this.props.text = text;
        this.updateElement();
    }
    
    updateElement() {
        const newElement = this.render();
        this.element.replaceWith(newElement);
        this.element = newElement;
    }
    
    getElement() {
        return this.element;
    }
}

// CSS for button animations
export const buttonStyles = `
    @keyframes spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    .moosh-button:not(.moosh-button--disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .moosh-button:not(.moosh-button--disabled):active {
        transform: translateY(0);
        box-shadow: none;
    }
    
    .moosh-button--primary:not(.moosh-button--disabled):hover {
        background: #0056b3;
        border-color: #0056b3;
    }
    
    .moosh-button--secondary:not(.moosh-button--disabled):hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: var(--text-primary);
    }
    
    .moosh-button--danger:not(.moosh-button--disabled):hover {
        background: #c82333;
        border-color: #c82333;
    }
    
    .moosh-button--ghost:not(.moosh-button--disabled):hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: var(--text-dim);
    }
    
    /* Touch feedback */
    .moosh-button:not(.moosh-button--disabled):active,
    .moosh-button.touch-active {
        transform: scale(0.98);
    }
    
    /* Focus styles for accessibility */
    .moosh-button:focus-visible {
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }
`;

// Factory function for quick button creation
export function createButton(props) {
    return new Button(props).getElement();
}