// MOOSH WALLET - Event Bus
// Professional state management and event system

export class EventBus {
    constructor() {
        this.events = new Map();
        this.state = new Map();
        this.stateListeners = new Map();
    }
    
    // Event handling
    on(event, handler) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        
        this.events.get(event).add(handler);
        
        // Return unsubscribe function
        return () => this.off(event, handler);
    }
    
    once(event, handler) {
        const wrappedHandler = (...args) => {
            handler(...args);
            this.off(event, wrappedHandler);
        };
        
        return this.on(event, wrappedHandler);
    }
    
    off(event, handler) {
        if (!this.events.has(event)) return;
        
        if (handler) {
            this.events.get(event).delete(handler);
        } else {
            this.events.delete(event);
        }
    }
    
    emit(event, data) {
        if (!this.events.has(event)) return;
        
        const handlers = this.events.get(event);
        handlers.forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error(`Error in event handler for ${event}:`, error);
            }
        });
    }
    
    // State management
    setState(key, value) {
        const oldValue = this.state.get(key);
        this.state.set(key, value);
        
        // Notify state listeners
        if (this.stateListeners.has(key)) {
            const listeners = this.stateListeners.get(key);
            listeners.forEach(listener => {
                try {
                    listener(value, oldValue, key);
                } catch (error) {
                    console.error(`Error in state listener for ${key}:`, error);
                }
            });
        }
        
        // Emit state change event
        this.emit('stateChange', { key, value, oldValue });
    }
    
    getState(key, defaultValue = null) {
        return this.state.has(key) ? this.state.get(key) : defaultValue;
    }
    
    hasState(key) {
        return this.state.has(key);
    }
    
    deleteState(key) {
        const value = this.state.get(key);
        this.state.delete(key);
        this.emit('stateChange', { key, value: undefined, oldValue: value });
    }
    
    // Subscribe to state changes
    onStateChange(key, listener) {
        if (!this.stateListeners.has(key)) {
            this.stateListeners.set(key, new Set());
        }
        
        this.stateListeners.get(key).add(listener);
        
        // Return unsubscribe function
        return () => {
            if (this.stateListeners.has(key)) {
                this.stateListeners.get(key).delete(listener);
            }
        };
    }
    
    // Batch state updates
    batchUpdate(updates) {
        const changes = [];
        
        Object.entries(updates).forEach(([key, value]) => {
            const oldValue = this.state.get(key);
            this.state.set(key, value);
            changes.push({ key, value, oldValue });
        });
        
        // Notify listeners after all updates
        changes.forEach(({ key, value, oldValue }) => {
            if (this.stateListeners.has(key)) {
                const listeners = this.stateListeners.get(key);
                listeners.forEach(listener => {
                    try {
                        listener(value, oldValue, key);
                    } catch (error) {
                        console.error(`Error in state listener for ${key}:`, error);
                    }
                });
            }
        });
        
        this.emit('batchStateChange', changes);
    }
    
    // Get all state
    getAllState() {
        return Object.fromEntries(this.state);
    }
    
    // Clear all state
    clearState() {
        const oldState = this.getAllState();
        this.state.clear();
        this.emit('stateClear', oldState);
    }
    
    // Debug helpers
    getEventListeners(event) {
        return this.events.has(event) ? Array.from(this.events.get(event)) : [];
    }
    
    getAllEvents() {
        return Array.from(this.events.keys());
    }
    
    getStateListeners(key) {
        return this.stateListeners.has(key) ? Array.from(this.stateListeners.get(key)) : [];
    }
}

// Create singleton instance
export const eventBus = new EventBus();

// Common events
export const Events = {
    // Wallet events
    WALLET_CREATED: 'wallet:created',
    WALLET_IMPORTED: 'wallet:imported',
    WALLET_LOCKED: 'wallet:locked',
    WALLET_UNLOCKED: 'wallet:unlocked',
    
    // Transaction events
    TRANSACTION_CREATED: 'transaction:created',
    TRANSACTION_SIGNED: 'transaction:signed',
    TRANSACTION_BROADCAST: 'transaction:broadcast',
    TRANSACTION_CONFIRMED: 'transaction:confirmed',
    
    // UI events
    THEME_CHANGED: 'ui:themeChanged',
    MODAL_OPEN: 'ui:modalOpen',
    MODAL_CLOSE: 'ui:modalClose',
    NOTIFICATION_SHOW: 'ui:notificationShow',
    
    // Network events
    NETWORK_CHANGED: 'network:changed',
    NETWORK_CONNECTED: 'network:connected',
    NETWORK_DISCONNECTED: 'network:disconnected',
    
    // App lifecycle
    APP_READY: 'app:ready',
    APP_ERROR: 'app:error',
    APP_UPDATE: 'app:update'
};

// Common state keys
export const StateKeys = {
    // Wallet state
    CURRENT_WALLET: 'currentWallet',
    WALLET_BALANCE: 'walletBalance',
    WALLET_LOCKED: 'walletLocked',
    
    // UI state
    CURRENT_THEME: 'currentTheme',
    ACTIVE_MODAL: 'activeModal',
    LOADING_STATE: 'loadingState',
    
    // Network state
    NETWORK_TYPE: 'networkType',
    NETWORK_STATUS: 'networkStatus',
    
    // User preferences
    USER_PREFERENCES: 'userPreferences',
    RECENT_ADDRESSES: 'recentAddresses'
};