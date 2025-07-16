// Syntax Validation Test
const fs = require('fs');
const path = require('path');

console.log('=== Syntax Validation Test ===\n');

function validateSyntax(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Basic syntax checks
        let openBraces = 0;
        let openParens = 0;
        let openBrackets = 0;
        let inString = false;
        let stringChar = null;
        let escaped = false;
        let lineNumber = 1;
        
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            const prevChar = i > 0 ? content[i - 1] : '';
            
            if (char === '\n') {
                lineNumber++;
            }
            
            // Handle string literals
            if (!escaped && (char === '"' || char === "'" || char === '`')) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = null;
                }
            }
            
            // Skip if we're in a string
            if (!inString) {
                // Track braces/brackets/parens
                if (char === '{') openBraces++;
                else if (char === '}') openBraces--;
                else if (char === '(') openParens++;
                else if (char === ')') openParens--;
                else if (char === '[') openBrackets++;
                else if (char === ']') openBrackets--;
                
                // Check for unclosed blocks
                if (openBraces < 0 || openParens < 0 || openBrackets < 0) {
                    console.error(`❌ Syntax error near line ${lineNumber}: Unexpected closing ${char}`);
                    return false;
                }
            }
            
            // Handle escape sequences
            escaped = !escaped && char === '\\';
        }
        
        // Check final balance
        if (openBraces !== 0) {
            console.error(`❌ Unmatched braces: ${openBraces > 0 ? openBraces + ' unclosed' : Math.abs(openBraces) + ' extra closing'} braces`);
            return false;
        }
        if (openParens !== 0) {
            console.error(`❌ Unmatched parentheses: ${openParens > 0 ? openParens + ' unclosed' : Math.abs(openParens) + ' extra closing'} parentheses`);
            return false;
        }
        if (openBrackets !== 0) {
            console.error(`❌ Unmatched brackets: ${openBrackets > 0 ? openBrackets + ' unclosed' : Math.abs(openBrackets) + ' extra closing'} brackets`);
            return false;
        }
        
        // Try to actually parse it
        try {
            new Function(content);
            console.log('✅ Syntax validation passed!');
            return true;
        } catch (e) {
            console.error('❌ JavaScript syntax error:', e.message);
            
            // Try to extract line number from error
            const match = e.message.match(/line (\d+)/);
            if (match) {
                const errorLine = parseInt(match[1]);
                const lines = content.split('\n');
                console.log(`\nError context (line ${errorLine}):`);
                for (let i = Math.max(0, errorLine - 3); i < Math.min(lines.length, errorLine + 2); i++) {
                    const prefix = i === errorLine - 1 ? '>>> ' : '    ';
                    console.log(`${prefix}${i + 1}: ${lines[i]}`);
                }
            }
            return false;
        }
        
    } catch (error) {
        console.error('❌ Failed to read file:', error.message);
        return false;
    }
}

// Run validation
const walletFile = path.join(__dirname, 'public', 'js', 'moosh-wallet.js');
console.log('Validating:', walletFile);
console.log('File size:', fs.statSync(walletFile).size, 'bytes\n');

const isValid = validateSyntax(walletFile);

if (isValid) {
    console.log('\n✅ All syntax checks passed!');
    console.log('The file should load without syntax errors.');
} else {
    console.log('\n❌ Syntax validation failed!');
    console.log('Please fix the errors above before running the application.');
}

process.exit(isValid ? 0 : 1);