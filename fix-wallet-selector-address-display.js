/**
 * Fix for wallet selector showing wrong address type
 * This fixes the issue where selecting Taproot shows a Spark address
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixWalletSelectorAddressDisplay() {
    console.log('🔧 Fixing wallet selector address display issue...');
    
    const walletPath = path.join(__dirname, 'public/js/moosh-wallet.js');
    
    try {
        let content = await fs.readFile(walletPath, 'utf-8');
        
        // Fix 1: Update the address mapping in createAccount to ensure all addresses are properly mapped
        console.log('📝 Fixing address mapping in createAccount...');
        
        // Find the createAccount function and its addresses mapping
        const addressMappingPattern = /addresses: \{[\s\S]*?spark:[^,]+,[\s\S]*?nestedSegWit:[^}]+\}/;
        const match = content.match(addressMappingPattern);
        
        if (match) {
            const newAddressMapping = `addresses: {
                        spark: addresses.spark || result.data.spark?.address || result.data.addresses?.spark || '',
                        bitcoin: addresses.bitcoin || bitcoin.address || bitcoin.segwit || result.data.addresses?.bitcoin || result.data.bitcoinAddresses?.segwit || '',
                        segwit: addresses.segwit || bitcoin.segwit || addresses.bitcoin || result.data.bitcoinAddresses?.segwit || result.data.addresses?.bitcoin || '',
                        taproot: addresses.taproot || bitcoin.taproot || result.data.bitcoinAddresses?.taproot || '',
                        legacy: addresses.legacy || bitcoin.legacy || result.data.bitcoinAddresses?.legacy || '',
                        nestedSegWit: addresses.nestedSegWit || bitcoin.nestedSegWit || result.data.bitcoinAddresses?.nestedSegwit || ''
                    }`;
            
            content = content.replace(match[0], newAddressMapping);
            console.log('✅ Fixed address mapping in createAccount');
        }
        
        // Fix 2: Remove the problematic fallback that prioritizes spark address
        console.log('📝 Fixing getCurrentWalletAddress fallback logic...');
        
        // Find the fallback address logic
        const fallbackPattern = /const fallbackAddress = currentAccount\.addresses\.spark \|\|[\s\S]*?currentAccount\.addresses\.legacy;/;
        const fallbackMatch = content.match(fallbackPattern);
        
        if (fallbackMatch) {
            // Remove the fallback entirely - if the selected type doesn't have an address, return 'No address found'
            const replacementCode = `// Removed problematic fallback - return clear message instead
                const fallbackAddress = null;`;
            
            content = content.replace(fallbackMatch[0], replacementCode);
            console.log('✅ Fixed fallback logic in getCurrentWalletAddress');
        }
        
        // Fix 3: Update the switchWalletType method to ensure it properly updates the display
        console.log('📝 Enhancing switchWalletType method...');
        
        // Find all switchWalletType methods and ensure they call updateAddressDisplay
        const switchWalletTypePattern = /switchWalletType\(e?\) \{[\s\S]*?this\.app\.showNotification[^}]+\}/g;
        const switchMatches = content.match(switchWalletTypePattern);
        
        if (switchMatches) {
            switchMatches.forEach((match) => {
                // Check if it already calls updateAddressDisplay
                if (!match.includes('updateAddressDisplay')) {
                    // Add the call before the notification
                    const updatedMatch = match.replace(
                        /this\.app\.showNotification\(/,
                        `// Update the address display immediately
            this.updateAddressDisplay();
            
            this.app.showNotification(`
                    );
                    content = content.replace(match, updatedMatch);
                }
            });
            console.log('✅ Enhanced switchWalletType methods');
        }
        
        // Fix 4: Ensure handleWalletTypeChange also updates the address display
        console.log('📝 Fixing handleWalletTypeChange methods...');
        
        const handleWalletTypeChangePattern = /handleWalletTypeChange\(e\) \{[\s\S]*?\n        \}/g;
        const handleMatches = content.match(handleWalletTypeChangePattern);
        
        if (handleMatches) {
            handleMatches.forEach((match) => {
                // Check if it updates the address
                if (!match.includes('updateAddressDisplay') && !match.includes('switchWalletType')) {
                    // Add the call to update address display
                    const updatedMatch = match.replace(
                        /\}\s*$/,
                        `
            // Update the address display for the selected type
            if (this.updateAddressDisplay) {
                this.updateAddressDisplay();
            }
        }`
                    );
                    content = content.replace(match, updatedMatch);
                }
            });
            console.log('✅ Fixed handleWalletTypeChange methods');
        }
        
        // Backup the original file
        const backupPath = walletPath + '.backup.' + Date.now();
        await fs.copyFile(walletPath, backupPath);
        console.log(`✅ Backup created: ${backupPath}`);
        
        // Write the fixed content
        await fs.writeFile(walletPath, content);
        console.log('✅ moosh-wallet.js fixed successfully!');
        
        console.log('\n📝 Summary of changes:');
        console.log('1. Improved address mapping in createAccount to handle all API response formats');
        console.log('2. Removed problematic fallback that prioritized spark address over selected type');
        console.log('3. Enhanced switchWalletType to ensure address display updates');
        console.log('4. Fixed handleWalletTypeChange to update address display');
        
        console.log('\n⚡ Next steps:');
        console.log('1. Restart the web server (if running)');
        console.log('2. Clear browser cache and refresh the wallet UI');
        console.log('3. Test wallet type switching to ensure correct addresses are displayed');
        
    } catch (error) {
        console.error('❌ Error fixing moosh-wallet.js:', error);
    }
}

// Run the fix
fixWalletSelectorAddressDisplay();