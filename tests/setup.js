// Jest test setup for MOOSH Wallet

// Mock DOM environment
global.document = {
    getElementById: jest.fn(),
    createElement: jest.fn(() => ({
        style: {},
        addEventListener: jest.fn(),
        appendChild: jest.fn(),
        setAttribute: jest.fn()
    })),
    body: {
        appendChild: jest.fn(),
        className: ''
    }
};

global.window = {
    localStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn()
    },
    addEventListener: jest.fn(),
    innerWidth: 1024,
    innerHeight: 768
};

// Mock console to reduce noise in tests
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};