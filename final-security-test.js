#!/usr/bin/env node

/**
 * Final security test - checks for actual sensitive data exposure
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Final Security Test\n');
console.log('═══════════════════════════\n');

const mooshWalletPath = path.join(__dirname, 'public/js/moosh-wallet.js');
const content = fs.readFileSync(mooshWalletPath, 'utf8');

let issues = 0;
let passed = 0;

// Check for actual seed phrase logging (not just the words "seed phrase")
console.log('🔍 Checking for actual sensitive data:\n');

// Pattern for actual mnemonic phrases (12-24 words)
const actualMnemonicPattern = /console\.log.*['"][a-z]+ [a-z]+ [a-z]+ [a-z]+ [a-z]+.*['"]/gi;
const mnemonicMatches = content.match(actualMnemonicPattern);
if (!mnemonicMatches) {
    console.log('✅ No actual mnemonic phrases in logs');
    passed++;
} else {
    console.log('❌ Found potential mnemonic phrases in logs');
    issues++;
}

// Check for actual private key logging (hex format)
const privateKeyPattern = /console\.log.*['"]\w{64}['"]/gi;
const keyMatches = content.match(privateKeyPattern);
if (!keyMatches) {
    console.log('✅ No actual private keys in logs');
    passed++;
} else {
    console.log('❌ Found potential private keys in logs');
    issues++;
}

// Check for hardcoded passwords (actual values, not references)
const hardcodedPasswordPattern = /(?:password|pass|pwd)\s*[:=]\s*["'](?!password|confirmPassword|\$\{)[^"']+["']/gi;
const passwordMatches = content.match(hardcodedPasswordPattern);
if (!passwordMatches) {
    console.log('✅ No hardcoded passwords found');
    passed++;
} else {
    console.log('❌ Found hardcoded passwords');
    console.log('   Matches:', passwordMatches);
    issues++;
}

// Check for console.log with actual seed/mnemonic variables
const seedVarPattern = /console\.log\([^)]*(?:mnemonic|seed|generatedSeed)\s*[),]/gi;
const seedVarMatches = content.match(seedVarPattern);
if (!seedVarMatches) {
    console.log('✅ No seed variables in console.log');
    passed++;
} else {
    console.log('❌ Found seed variables in console.log');
    console.log(`   Found ${seedVarMatches.length} instances`);
    issues++;
}

// Check for private key variables in console.log
const keyVarPattern = /console\.log\([^)]*(?:privateKey|privKey|secretKey)\s*[),]/gi;
const keyVarMatches = content.match(keyVarPattern);
if (!keyVarMatches) {
    console.log('✅ No private key variables in console.log');
    passed++;
} else {
    console.log('❌ Found private key variables in console.log');
    console.log(`   Found ${keyVarMatches.length} instances`);
    issues++;
}

console.log('\n═══════════════════════════\n');
console.log(`📊 Security Test Results:`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Issues: ${issues}`);
console.log(`   📈 Score: ${Math.round((passed / (passed + issues)) * 100)}%`);

if (issues === 0) {
    console.log('\n🎉 All security tests passed!');
    process.exit(0);
} else {
    console.log('\n⚠️  Security issues remain');
    process.exit(1);
}