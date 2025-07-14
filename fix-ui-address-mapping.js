/**
 * Fix for UI address mapping in moosh-wallet.js
 * This ensures proper mapping of all address types from API response
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixAddressMapping() {
    console.log('🔧 Fixing UI address mapping in moosh-wallet.js...');
    
    const walletPath = path.join(__dirname, 'public/js/moosh-wallet.js');
    
    try {
        let content = await fs.readFile(walletPath, 'utf-8');
        
        // Find the createAccount function
        const createAccountStart = content.indexOf('async createAccount(name, mnemonic, isImport = false) {');
        if (createAccountStart === -1) {
            throw new Error('Could not find createAccount function');
        }
        
        // Find the addresses mapping section
        const addressMappingStart = content.indexOf('addresses: {', createAccountStart);
        const addressMappingEnd = content.indexOf('},', addressMappingStart) + 2;
        
        if (addressMappingStart === -1) {
            throw new Error('Could not find addresses mapping in createAccount');
        }
        
        // Create the improved address mapping
        const newAddressMapping = `addresses: {
                        spark: addresses.spark || result.data.spark?.address || result.data.addresses?.spark || '',
                        bitcoin: addresses.bitcoin || bitcoin.address || bitcoin.segwit || result.data.addresses?.bitcoin || '',
                        segwit: addresses.segwit || bitcoin.segwit || addresses.bitcoin || result.data.bitcoinAddresses?.segwit || result.data.addresses?.bitcoin || '',
                        taproot: addresses.taproot || bitcoin.taproot || result.data.bitcoinAddresses?.taproot || '',
                        legacy: addresses.legacy || bitcoin.legacy || result.data.bitcoinAddresses?.legacy || '',
                        nestedSegWit: addresses.nestedSegWit || bitcoin.nestedSegWit || result.data.bitcoinAddresses?.nestedSegwit || ''
                    },`;
        
        // Replace the old mapping with the new one
        const beforeMapping = content.substring(0, addressMappingStart);
        const afterMapping = content.substring(addressMappingEnd);
        content = beforeMapping + newAddressMapping + afterMapping;
        
        // Backup the original file
        const backupPath = walletPath + '.backup.' + Date.now();
        await fs.copyFile(walletPath, backupPath);
        console.log(`✅ Backup created: ${backupPath}`);
        
        // Write the fixed content
        await fs.writeFile(walletPath, content);
        console.log('✅ moosh-wallet.js fixed successfully!');
        
        console.log('\n📝 Summary of changes:');
        console.log('- Improved address mapping to handle all API response formats');
        console.log('- Added fallbacks for bitcoinAddresses object');
        console.log('- Fixed nestedSegWit mapping (was nestedSegWit, should check nestedSegwit)');
        
        console.log('\n⚡ Next steps:');
        console.log('1. Restart the API server to pick up the endpoint fix');
        console.log('2. Refresh the wallet UI');
        console.log('3. Test wallet creation and import flows');
        
    } catch (error) {
        console.error('❌ Error fixing moosh-wallet.js:', error);
    }
}

// Run the fix
fixAddressMapping();