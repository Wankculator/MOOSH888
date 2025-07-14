/**
 * Fix for the /api/spark/generate-wallet endpoint
 * This patch ensures the endpoint handles both new generation and mnemonic import
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixGenerateEndpoint() {
    console.log('🔧 Fixing /api/spark/generate-wallet endpoint...');
    
    const apiServerPath = path.join(__dirname, 'src/server/api-server.js');
    
    try {
        let content = await fs.readFile(apiServerPath, 'utf-8');
        
        // Find the generate-wallet endpoint
        const endpointStart = content.indexOf('app.post(\'/api/spark/generate-wallet\'');
        const endpointEnd = content.indexOf('});', endpointStart) + 3;
        
        if (endpointStart === -1) {
            throw new Error('Could not find generate-wallet endpoint');
        }
        
        // Replace the endpoint with the fixed version
        const newEndpoint = `app.post('/api/spark/generate-wallet', async (req, res) => {
    try {
        const { mnemonic, strength = 256 } = req.body;
        
        // If mnemonic is provided, import it instead of generating new
        if (mnemonic) {
            const mnemonicString = Array.isArray(mnemonic) ? mnemonic.join(' ') : mnemonic;
            const wallet = await importSparkCompatibleWallet(mnemonicString);
            res.json(wallet);
        } else {
            // Generate new wallet
            const wallet = await generateSparkCompatibleWallet(strength);
            res.json(wallet);
        }
    } catch (error) {
        console.error('Spark wallet generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});`;
        
        content = content.substring(0, endpointStart) + newEndpoint + content.substring(endpointEnd);
        
        // Backup the original file
        const backupPath = apiServerPath + '.backup.' + Date.now();
        await fs.copyFile(apiServerPath, backupPath);
        console.log(`✅ Backup created: ${backupPath}`);
        
        // Write the fixed content
        await fs.writeFile(apiServerPath, content);
        console.log('✅ API server fixed successfully!');
        
        console.log('\n📝 Summary of changes:');
        console.log('- Added mnemonic parameter check');
        console.log('- If mnemonic is provided, import wallet instead of generating new');
        console.log('- Handles both array and string mnemonic formats');
        
        console.log('\n⚡ Next steps:');
        console.log('1. Restart the API server (Ctrl+C and run again)');
        console.log('2. Test wallet creation and import flows');
        
    } catch (error) {
        console.error('❌ Error fixing API server:', error);
    }
}

// Run the fix
fixGenerateEndpoint();