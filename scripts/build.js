#!/usr/bin/env node

/**
 * MOOSH Wallet Build Script
 * Bundles modular JavaScript files for production
 */

const fs = require('fs');
const path = require('path');

const BUILD_CONFIG = {
    entry: path.join(__dirname, '../public/js/src/app.js'),
    output: path.join(__dirname, '../public/js/moosh-wallet-bundle.js'),
    modules: [
        'utils/ElementFactory.js',
        'utils/ResponsiveUtils.js',
        'services/BitcoinService.js',
        'core/EventBus.js',
        'components/Button.js',
        'app.js'
    ]
};

console.log('🔨 Building MOOSH Wallet...');

try {
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(BUILD_CONFIG.output);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read and bundle all modules
    let bundleContent = `
// MOOSH Wallet Bundle - Built on ${new Date().toISOString()}
// This file is auto-generated. Do not edit directly.

(function() {
    'use strict';
    
    // Module system
    const modules = {};
    const exports = {};
    
`;

    // Add each module
    BUILD_CONFIG.modules.forEach(modulePath => {
        const fullPath = path.join(__dirname, '../public/js/src', modulePath);
        if (fs.existsSync(fullPath)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const moduleName = modulePath.replace('.js', '');
            
            bundleContent += `
    // Module: ${moduleName}
    modules['${moduleName}'] = function() {
        ${content.replace(/export\s+/g, 'exports.')}
        return exports;
    };
`;
        }
    });

    // Add initialization
    bundleContent += `
    // Initialize app
    const app = modules['app']();
    
})();
`;

    // Write bundle
    fs.writeFileSync(BUILD_CONFIG.output, bundleContent);
    
    // Get file size
    const stats = fs.statSync(BUILD_CONFIG.output);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    
    console.log(`✅ Build complete!`);
    console.log(`📦 Bundle created: ${BUILD_CONFIG.output}`);
    console.log(`📏 Bundle size: ${fileSizeInKB} KB`);
    
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}