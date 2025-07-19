#!/usr/bin/env node

/**
 * TestSprite Integration for MOOSH Wallet
 * 
 * This script runs automated tests using TestSprite MCP
 * It validates code changes against our guidelines and catches errors
 */

import { readFile, mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MOOSHWalletTester {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  async runAllTests() {
    console.log('🧪 Starting MOOSH Wallet validation tests...\n');

    try {
      // 1. Check servers are running
      await this.checkServers();

      // 2. Validate no CORS violations
      await this.validateNoCorsViolations();

      // 3. Check ElementFactory usage
      await this.validateElementFactoryUsage();

      // 4. Test critical endpoints
      await this.testCriticalEndpoints();

      // 5. Check for performance issues
      await this.checkPerformanceIssues();

      // 6. Validate state management
      await this.validateStateManagement();

      // 7. Generate report
      await this.generateReport();

    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      process.exit(1);
    }
  }

  async checkServers() {
    console.log('📡 Checking servers...');
    
    try {
      const uiHealth = await fetch('http://localhost:3333/health');
      const apiHealth = await fetch('http://localhost:3001/health');
      
      if (!uiHealth.ok || !apiHealth.ok) {
        throw new Error('Servers are not running! Start them with npm run dev');
      }
      
      console.log('✅ Both servers are running\n');
    } catch (error) {
      this.errors.push('Servers are not running - start with: npm run dev');
      throw error;
    }
  }

  async validateNoCorsViolations() {
    console.log('🌐 Checking for CORS violations...');
    
    const mooshWalletPath = join(__dirname, '../public/js/moosh-wallet.js');
    const content = await readFile(mooshWalletPath, 'utf-8');
    
    const violations = [];
    
    // Check for direct API calls
    const patterns = [
      /fetch\s*\(\s*['"]https:\/\/api\.coingecko\.com/g,
      /fetch\s*\(\s*['"]https:\/\/blockchain\.info/g,
      /fetch\s*\(\s*['"]https:\/\/api\.blockcypher\.com/g
    ];
    
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        violations.push(`Found direct API call: ${matches[0]}`);
      }
    });
    
    if (violations.length > 0) {
      this.errors.push(...violations);
      console.log('❌ CORS violations found:', violations.length);
      violations.forEach(v => console.log('   -', v));
    } else {
      console.log('✅ No CORS violations found\n');
    }
  }

  async validateElementFactoryUsage() {
    console.log('🏗️ Validating ElementFactory usage...');
    
    const mooshWalletPath = join(__dirname, '../public/js/moosh-wallet.js');
    const content = await readFile(mooshWalletPath, 'utf-8');
    
    const prohibited = ['$.li(', '$.ul(', '$.ol(', '$.nav(', '$.section('];
    const violations = [];
    
    prohibited.forEach(method => {
      if (content.includes(method)) {
        violations.push(`Found prohibited method: ${method}`);
      }
    });
    
    if (violations.length > 0) {
      this.errors.push(...violations);
      console.log('❌ ElementFactory violations:', violations.length);
      violations.forEach(v => console.log('   -', v));
    } else {
      console.log('✅ ElementFactory usage is correct\n');
    }
  }

  async testCriticalEndpoints() {
    console.log('🔧 Testing critical endpoints...');
    
    const tests = [
      {
        name: 'Bitcoin Price',
        url: 'http://localhost:3333/api/proxy/bitcoin-price',
        validate: (data) => data.bitcoin && typeof data.bitcoin.usd === 'number'
      },
      {
        name: 'Health Check (API)',
        url: 'http://localhost:3001/health',
        validate: (data) => data.status === 'ok'
      },
      {
        name: 'Health Check (UI)',
        url: 'http://localhost:3333/health',
        validate: (data) => data.status === 'ok'
      }
    ];
    
    for (const test of tests) {
      try {
        const response = await fetch(test.url);
        const data = await response.json();
        
        if (test.validate(data)) {
          console.log(`✅ ${test.name} endpoint working`);
        } else {
          this.errors.push(`${test.name} endpoint validation failed`);
          console.log(`❌ ${test.name} endpoint validation failed`);
        }
      } catch (error) {
        this.errors.push(`${test.name} endpoint failed: ${error.message}`);
        console.log(`❌ ${test.name} endpoint failed`);
      }
    }
    
    console.log('');
  }

  async checkPerformanceIssues() {
    console.log('⚡ Checking for performance issues...');
    
    const mooshWalletPath = join(__dirname, '../public/js/moosh-wallet.js');
    const content = await readFile(mooshWalletPath, 'utf-8');
    
    // Check for duplicate updateLiveData calls
    const updateLiveDataCalls = (content.match(/this\.updateLiveData\(\)/g) || []).length;
    if (updateLiveDataCalls > 10) {
      this.warnings.push(`Found ${updateLiveDataCalls} updateLiveData calls - check for duplicates`);
    }
    
    // Check for duplicate fetchBitcoinPrice calls
    const fetchPriceCalls = (content.match(/fetchBitcoinPrice\(/g) || []).length;
    if (fetchPriceCalls > 15) {
      this.warnings.push(`Found ${fetchPriceCalls} fetchBitcoinPrice calls - check for duplicates`);
    }
    
    console.log('✅ Performance check complete\n');
  }

  async validateStateManagement() {
    console.log('💾 Validating state management...');
    
    const mooshWalletPath = join(__dirname, '../public/js/moosh-wallet.js');
    const content = await readFile(mooshWalletPath, 'utf-8');
    
    // Check for direct localStorage usage (outside of StateManager)
    const directLocalStorage = content.match(/localStorage\.setItem\s*\(\s*['"][^'"]*['"]/g) || [];
    const stateManagerUsage = content.match(/this\.app\.state\.set|this\.stateManager\.set/g) || [];
    
    if (directLocalStorage.length > 50) {
      this.warnings.push(`High direct localStorage usage: ${directLocalStorage.length} calls`);
    }
    
    console.log(`✅ State management: ${stateManagerUsage.length} StateManager calls\n`);
  }

  async generateReport() {
    console.log('📊 Generating test report...\n');
    
    const report = {
      timestamp: new Date().toISOString(),
      errors: this.errors,
      warnings: this.warnings,
      passed: this.errors.length === 0,
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length
      }
    };
    
    // Save report
    const reportDir = join(__dirname, '../test-results');
    const reportPath = join(reportDir, 'validation-report.json');
    
    await mkdir(reportDir, { recursive: true });
    await writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Display summary
    console.log('═══════════════════════════════════════');
    console.log('VALIDATION RESULTS');
    console.log('═══════════════════════════════════════');
    
    if (this.errors.length === 0) {
      console.log('✅ All tests passed!');
    } else {
      console.log(`❌ ${this.errors.length} errors found:`);
      this.errors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  ${this.warnings.length} warnings:`);
      this.warnings.forEach((warning, i) => {
        console.log(`   ${i + 1}. ${warning}`);
      });
    }
    
    console.log('\n📄 Full report saved to:', reportPath);
    console.log('\n💡 TestSprite MCP integration available for advanced testing');
    console.log('   Install the VSCode/Cursor extension for real-time validation\n');
    
    // Exit with error code if tests failed
    if (this.errors.length > 0) {
      process.exit(1);
    }
  }
}

// Run tests
const tester = new MOOSHWalletTester();
tester.runAllTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});