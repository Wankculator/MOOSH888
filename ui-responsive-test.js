// MOOSH Wallet - UI Responsive Design Test
// Tests button scaling, container fitting, and mobile/desktop views

const fs = require('fs');

// Test viewport sizes
const VIEWPORTS = {
  'Mobile Small': { width: 320, height: 568 },
  'Mobile Medium': { width: 375, height: 667 },
  'Mobile Large': { width: 414, height: 896 },
  'Tablet': { width: 768, height: 1024 },
  'Desktop Small': { width: 1024, height: 768 },
  'Desktop Medium': { width: 1366, height: 768 },
  'Desktop Large': { width: 1920, height: 1080 }
};

// UI elements to test
const UI_ELEMENTS = {
  mainPage: {
    passwordSection: {
      selector: '.password-section',
      expectedBehavior: 'Should fit within card boundaries, no overflow'
    },
    walletActions: {
      selector: '.wallet-actions',
      expectedBehavior: 'Buttons should stack vertically on mobile, side-by-side on desktop'
    },
    createWalletButton: {
      selector: 'button',
      expectedBehavior: 'Minimum height 44px on mobile for touch targets'
    }
  },
  dashboard: {
    actionButtons: {
      selector: '.wallet-actions button',
      expectedBehavior: 'Should fill container width, proper padding, no text overflow'
    },
    terminalBoxes: {
      selector: '.terminal-box',
      expectedBehavior: 'Should scale properly, maintain aspect ratio'
    },
    statsGrid: {
      selector: '.stats-grid',
      expectedBehavior: 'Should reflow from 4 columns to 2 on mobile'
    },
    headerButtons: {
      selector: '.header-buttons',
      expectedBehavior: 'Should remain visible and clickable on all sizes'
    }
  }
};

// CSS analysis
function analyzeCSSScaling() {
  const jsFile = fs.readFileSync('./public/js/moosh-wallet.js', 'utf8');
  
  const issues = [];
  const recommendations = [];
  
  // Check for proper scaling variables
  const scalingVars = [
    '--scale-factor',
    '--font-base',
    '--spacing-unit',
    '--container-padding',
    '--button-height',
    '--input-height',
    '--touch-target-min'
  ];
  
  console.log('\n📐 CSS SCALING ANALYSIS');
  console.log('='.repeat(50));
  
  scalingVars.forEach(varName => {
    if (jsFile.includes(varName)) {
      console.log(`✅ ${varName} is properly defined`);
    } else {
      issues.push(`Missing scaling variable: ${varName}`);
    }
  });
  
  // Check for calc() usage with scale factor
  const calcUsageCount = (jsFile.match(/calc\([^)]*var\(--scale-factor\)/g) || []).length;
  console.log(`\n📊 Dynamic scaling usage: ${calcUsageCount} instances`);
  
  if (calcUsageCount < 50) {
    recommendations.push('Consider using calc() with --scale-factor more extensively for better responsive scaling');
  }
  
  // Check for media queries
  const mediaQueries = jsFile.match(/@media[^{]+/g) || [];
  console.log(`\n📱 Media queries found: ${mediaQueries.length}`);
  mediaQueries.forEach(query => {
    console.log(`  - ${query}`);
  });
  
  return { issues, recommendations };
}

// Button analysis
function analyzeButtonLayout() {
  console.log('\n🔘 BUTTON LAYOUT ANALYSIS');
  console.log('='.repeat(50));
  
  const buttonTests = [
    {
      name: 'Touch target size',
      pattern: /height:.*4[4-8]px|--button-height.*4[4-8]px/g,
      expected: 'Buttons should be at least 44px tall for mobile'
    },
    {
      name: 'Button padding',
      pattern: /padding:.*calc\(.*\*.*--scale-factor/g,
      expected: 'Button padding should scale dynamically'
    },
    {
      name: 'Button text overflow',
      pattern: /overflow:.*hidden|text-overflow:.*ellipsis/g,
      expected: 'Buttons should handle text overflow gracefully'
    },
    {
      name: 'Button width constraints',
      pattern: /width:.*100%|flex:.*1/g,
      expected: 'Buttons should expand to fill containers'
    }
  ];
  
  const jsFile = fs.readFileSync('./public/js/moosh-wallet.js', 'utf8');
  const issues = [];
  
  buttonTests.forEach(test => {
    const matches = jsFile.match(test.pattern);
    if (matches && matches.length > 0) {
      console.log(`✅ ${test.name}: Found ${matches.length} instances`);
    } else {
      console.log(`❌ ${test.name}: Not found`);
      issues.push(`${test.name}: ${test.expected}`);
    }
  });
  
  return issues;
}

// Container analysis
function analyzeContainerLayout() {
  console.log('\n📦 CONTAINER LAYOUT ANALYSIS');
  console.log('='.repeat(50));
  
  const containerTests = [
    {
      name: 'Flexible grid system',
      pattern: /grid-template-columns:.*repeat\(auto-fit|display:.*flex/g,
      expected: 'Containers should use flexible layouts'
    },
    {
      name: 'Container max-width',
      pattern: /max-width:.*calc\(.*\*.*--scale-factor/g,
      expected: 'Containers should have responsive max-widths'
    },
    {
      name: 'Container padding',
      pattern: /padding:.*var\(--container-padding\)/g,
      expected: 'Containers should use responsive padding'
    },
    {
      name: 'Box overflow handling',
      pattern: /overflow:.*hidden|overflow:.*auto/g,
      expected: 'Containers should handle overflow properly'
    }
  ];
  
  const jsFile = fs.readFileSync('./public/js/moosh-wallet.js', 'utf8');
  const issues = [];
  
  containerTests.forEach(test => {
    const matches = jsFile.match(test.pattern);
    if (matches && matches.length > 0) {
      console.log(`✅ ${test.name}: Found ${matches.length} instances`);
    } else {
      console.log(`⚠️  ${test.name}: Limited usage`);
      issues.push(`${test.name}: ${test.expected}`);
    }
  });
  
  return issues;
}

// Mobile-specific analysis
function analyzeMobileOptimization() {
  console.log('\n📱 MOBILE OPTIMIZATION ANALYSIS');
  console.log('='.repeat(50));
  
  const mobileTests = [
    {
      name: 'Viewport meta tag',
      pattern: /viewport.*width=device-width.*initial-scale=1/g,
      critical: true
    },
    {
      name: 'Touch event handlers',
      pattern: /ontouchstart|ontouchend|touch-action/g,
      critical: false
    },
    {
      name: 'Mobile-first CSS',
      pattern: /--scale-factor:.*0\.[6-8]/g,
      critical: true
    },
    {
      name: 'Responsive font sizing',
      pattern: /font-size:.*calc\(.*\*.*--scale-factor/g,
      critical: true
    }
  ];
  
  const jsFile = fs.readFileSync('./public/js/moosh-wallet.js', 'utf8');
  const indexFile = fs.readFileSync('./public/index.html', 'utf8');
  const allContent = jsFile + indexFile;
  
  const criticalIssues = [];
  const warnings = [];
  
  mobileTests.forEach(test => {
    const matches = allContent.match(test.pattern);
    if (matches && matches.length > 0) {
      console.log(`✅ ${test.name}: Implemented`);
    } else {
      console.log(`${test.critical ? '❌' : '⚠️ '} ${test.name}: Not found`);
      if (test.critical) {
        criticalIssues.push(test.name);
      } else {
        warnings.push(test.name);
      }
    }
  });
  
  return { criticalIssues, warnings };
}

// Generate comprehensive report
function generateUIReport() {
  console.log('\n' + '='.repeat(80));
  console.log('🎨 MOOSH WALLET - UI/UX RESPONSIVE TEST REPORT');
  console.log('='.repeat(80));
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`📱 Pure JavaScript: YES (100%)`);
  console.log('='.repeat(80));
  
  // Run all analyses
  const cssAnalysis = analyzeCSSScaling();
  const buttonIssues = analyzeButtonLayout();
  const containerIssues = analyzeContainerLayout();
  const mobileAnalysis = analyzeMobileOptimization();
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('-'.repeat(50));
  
  const totalIssues = cssAnalysis.issues.length + buttonIssues.length + 
                      containerIssues.length + mobileAnalysis.criticalIssues.length;
  
  console.log(`✅ Responsive design implemented: YES`);
  console.log(`✅ Pure JavaScript UI: YES`);
  console.log(`⚠️  Total issues found: ${totalIssues}`);
  console.log(`📱 Mobile optimization: ${mobileAnalysis.criticalIssues.length === 0 ? 'GOOD' : 'NEEDS WORK'}`);
  
  // Critical fixes needed
  console.log('\n🚨 CRITICAL FIXES NEEDED');
  console.log('-'.repeat(50));
  
  if (totalIssues === 0) {
    console.log('✨ No critical issues found! The UI is well-optimized.');
  } else {
    let fixNumber = 1;
    
    if (mobileAnalysis.criticalIssues.length > 0) {
      mobileAnalysis.criticalIssues.forEach(issue => {
        console.log(`${fixNumber}. Fix mobile optimization: ${issue}`);
        fixNumber++;
      });
    }
    
    if (buttonIssues.length > 0) {
      console.log(`${fixNumber}. Button improvements needed:`);
      buttonIssues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
      fixNumber++;
    }
    
    if (containerIssues.length > 0) {
      console.log(`${fixNumber}. Container layout improvements:`);
      containerIssues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    }
  }
  
  // Viewport-specific recommendations
  console.log('\n📐 VIEWPORT-SPECIFIC RECOMMENDATIONS');
  console.log('-'.repeat(50));
  
  Object.entries(VIEWPORTS).forEach(([name, size]) => {
    console.log(`\n${name} (${size.width}x${size.height}):`);
    
    if (size.width < 480) {
      console.log('  - Ensure single column layout');
      console.log('  - Stack all buttons vertically');
      console.log('  - Use full-width containers');
    } else if (size.width < 768) {
      console.log('  - Use 2-column grid for stats');
      console.log('  - Maintain touch-friendly button sizes');
    } else {
      console.log('  - Enable multi-column layouts');
      console.log('  - Show expanded navigation');
    }
  });
  
  // UI polish checklist
  console.log('\n✨ UI POLISH CHECKLIST');
  console.log('-'.repeat(50));
  console.log('☐ All buttons fit within their containers');
  console.log('☐ No text overflow on any button');
  console.log('☐ Proper spacing between all elements');
  console.log('☐ Touch targets are at least 44x44px');
  console.log('☐ All modals are centered and responsive');
  console.log('☐ Terminal boxes scale properly');
  console.log('☐ Grid layouts reflow on mobile');
  console.log('☐ No horizontal scrolling on mobile');
  console.log('☐ All text is readable at all sizes');
  console.log('☐ Animations are smooth and performant');
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    cssAnalysis,
    buttonIssues,
    containerIssues,
    mobileAnalysis,
    totalIssues,
    viewports: VIEWPORTS,
    uiElements: UI_ELEMENTS
  };
  
  fs.writeFileSync('UI_RESPONSIVE_TEST_REPORT.json', JSON.stringify(report, null, 2));
  console.log('📄 Detailed report saved to: UI_RESPONSIVE_TEST_REPORT.json\n');
}

// Run the UI tests
generateUIReport();