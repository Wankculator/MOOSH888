# 🛠️ TECHNICAL BUILD STANDARDS v1.0
## Complete Development Standards for MOOSH Wallet

---

## 🚨 **CRITICAL BUILD RULES - NEVER VIOLATE**

### **1. ASK_FIRST_PROTOCOL**
- **NEVER** modify, delete, or move files without explicit permission
- **ALWAYS** ask before creating new files or changing structure
- **STOP** and request clarification if requirements are unclear

### **2. PROFESSIONAL_STRUCTURE**
- **ONLY** use numbered folder system (01_COMPANY/, 02_PRODUCT/, etc.)
- **NEVER** create unnumbered folders (ASSETS/, DEVELOPMENT/, etc.)
- **ROOT LEVEL ONLY:** server.js, index.html, README.md, package.json, .cursorrules

### **3. STEP_BY_STEP_ONLY**
- **BUILD INCREMENTALLY** from current foundation
- **TEST** after each small change
- **NEVER** replace entire working systems
- **PRESERVE** existing perfect wallet flows

### **4. SECURITY_PARANOID**
- **CLIENT-SIDE ONLY** - never expose private keys
- **NO** server-side key storage
- **NO** localStorage for sensitive data
- **PROFESSIONAL** security practices only

### **5. MOBILE_FIRST_OBSESSED**
- **320px MINIMUM** width requirement
- **EVERY** feature must be mobile-optimized BEFORE desktop
- **TOUCH TARGETS** minimum 44px
- **DYNAMIC SCALING** for all elements

### **6. PERFORMANCE_OBSESSED**
- **<3 SECONDS** load time requirement
- **<100ms** interaction response time
- **60fps** smooth animations
- **NO** performance-degrading effects

---

## 🎨 **MOOSH DESIGN SYSTEM**

### **Color Palette (STRICT COMPLIANCE)**
```css
/* MOOSH Brand Colors - NEVER DEVIATE */
--text-primary: #f57315;       /* MOOSH Orange - primary actions */
--text-secondary: #ffffff;     /* White text */
--text-accent: #69fd97bd;      /* Light green accent */
--text-string: #9bffac;        /* String green */
--text-keyword: #6fedbfc2;     /* Keyword cyan-green */
--text-comment: #c8fff2;       /* Comment light cyan */
--text-dim: #71767b;          /* Grey for secondary text */
--bg-primary: #000000;         /* Black background */
--bg-secondary: #000000;       /* Black secondary */
--bg-hover: #1a1a1a;          /* Dark grey hover */
--border-color: #2f3336;       /* Border grey */
```

### **Typography Standards**
```css
/* MANDATORY Font Family */
font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Roboto Mono', 'Consolas', monospace;

/* Dynamic Font Sizing */
font-size: calc(var(--font-base) * var(--scale-factor));
```

### **Dynamic Scaling System (MANDATORY)**
```css
/* ALL sizes MUST use dynamic scaling */
width: calc(20px * var(--scale-factor));
height: calc(20px * var(--scale-factor));
padding: calc(var(--spacing-unit) * var(--scale-factor));
margin: calc(var(--spacing-unit) * 2 * var(--scale-factor));

/* FORBIDDEN - Fixed pixels */
width: 20px; /* ❌ NEVER DO THIS */
```

---

## 📱 **MOBILE-FIRST RESPONSIVE DESIGN**

### **Breakpoint System**
```css
/* Mobile First - Default (320px+) */
:root { --scale-factor: 0.8; }

/* Small Mobile (481px+) */
@media (min-width: 481px) { --scale-factor: 0.85; }

/* Tablet (769px+) */
@media (min-width: 769px) { --scale-factor: 0.9; }

/* Desktop (1025px+) */
@media (min-width: 1025px) { --scale-factor: 0.95; }

/* Large Desktop (1201px+) */
@media (min-width: 1201px) { --scale-factor: 1.0; }
```

### **Touch Target Requirements**
```css
/* Minimum touch area for mobile */
.interactive-element {
    min-height: calc(44px * var(--scale-factor));
    min-width: calc(44px * var(--scale-factor));
    padding: calc(var(--spacing-unit) * var(--scale-factor));
}
```

---

## 🏗️ **COMPONENT DEVELOPMENT STANDARDS**

### **Button System**
```css
.btn-primary {
    background: var(--text-primary);
    color: #000000;
    border: calc(2px * var(--scale-factor)) solid var(--text-primary);
    border-radius: 0; /* NO rounded corners */
    font-family: 'JetBrains Mono', monospace;
    font-size: calc(14px * var(--scale-factor));
    padding: calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor));
    transition: all 0.3s ease;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.btn-primary:hover {
    background: #000000;
    color: var(--text-primary);
}
```

### **Input Field System**
```css
.input-field {
    background: var(--bg-primary);
    border: calc(1px * var(--scale-factor)) solid var(--border-color);
    border-radius: 0; /* NO rounded corners */
    color: var(--text-primary);
    font-family: 'JetBrains Mono', monospace;
    font-size: calc(12px * var(--scale-factor));
    padding: calc(12px * var(--scale-factor));
    transition: all 0.2s ease;
    width: 100%;
}

.input-field:focus {
    border-color: var(--text-primary);
    outline: none;
}
```

### **Card System**
```css
.card {
    background: var(--bg-secondary);
    border: calc(1px * var(--scale-factor)) solid var(--border-color);
    border-radius: 0; /* NO rounded corners */
    padding: calc(24px * var(--scale-factor));
    transition: all 0.2s ease;
}

.card:hover {
    border-color: var(--text-primary);
}
```

---

## 🔧 **JAVASCRIPT TEMPLATE LITERAL STANDARDS**

### **Function Structure Pattern**
```javascript
function generateDashboardHTML() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <!-- Meta tags, fonts, CSS -->
        </head>
        <body>
            <!-- Professional dashboard content -->
        </body>
        </html>
    `;
}
```

### **CSS Integration Pattern**
```javascript
// ALWAYS include complete CSS within template literals
const dashboardHTML = `
    <style>
        /* MOOSH CSS Variables */
        :root {
            --text-primary: #f57315;
            --scale-factor: 0.8;
            /* Complete variable system */
        }
        
        /* Component styles with dynamic scaling */
        .dashboard-header {
            font-size: calc(16px * var(--scale-factor));
            padding: calc(20px * var(--scale-factor));
        }
    </style>
    
    <div class="dashboard-container">
        <!-- Dashboard content -->
    </div>
`;
```

---

## 🎯 **DASHBOARD-SPECIFIC REQUIREMENTS**

### **Professional Header Standards**
```html
<!-- Terminal-style header with blinking cursor -->
<div class="dashboard-header">
    <div class="terminal-prompt">
        <span class="text-dim">~/moosh/wallet $</span>
        <span class="text-primary">dashboard --professional</span>
        <span class="blinking-cursor">|</span>
    </div>
</div>
```

### **Conditional Ordinals Logic**
```javascript
// Ordinals only available for Taproot wallets
function generateBalanceCards(walletType) {
    const baseCards = ['Bitcoin', 'Lightning', 'Stablecoins', 'Network'];
    const cards = walletType === 'Taproot' 
        ? [...baseCards.slice(0, 3), 'Ordinals', baseCards[3]]
        : baseCards;
    
    return cards.map(card => generateCardHTML(card)).join('');
}
```

### **Wallet Selector Requirements**
```javascript
// 5 Address Types: Taproot, SegWit, Legacy, Spark, Multi-Sig
const walletTypes = [
    { id: 'taproot', name: 'Taproot', prefix: 'bc1p...', ordinals: true },
    { id: 'segwit', name: 'SegWit', prefix: 'bc1q...', ordinals: false },
    { id: 'legacy', name: 'Legacy', prefix: '1...', ordinals: false },
    { id: 'spark', name: 'Spark', prefix: 'sp1...', ordinals: false },
    { id: 'multisig', name: 'Multi-Sig', prefix: '3...', ordinals: false }
];
```

---

## 🚨 **FORBIDDEN PRACTICES**

### **❌ NEVER DO:**
- Fixed pixel values (except in root variables)
- Hardcoded colors outside theme system
- Rounded corners (border-radius > 0)
- Glow effects or shadows
- Replace entire working systems
- Modify existing perfect wallet flows
- Create files without permission
- Use fonts other than JetBrains Mono
- Break mobile responsiveness

### **✅ ALWAYS DO:**
- Ask permission before file operations
- Use dynamic scaling for all sizes
- Test mobile-first (320px minimum)
- Follow step-by-step approach
- Preserve existing functionality
- Use professional terminal aesthetic
- Implement conditional Ordinals logic
- Follow Enhanced Build Rules v5.0

---

## 🧪 **TESTING REQUIREMENTS**

### **Mandatory Testing Checklist**
- [ ] Mobile responsive (320px minimum width)
- [ ] Dynamic scaling works across all breakpoints
- [ ] Touch targets adequate (44px minimum)
- [ ] MOOSH color compliance
- [ ] JetBrains Mono font loading
- [ ] Smooth transitions (0.2s-0.3s)
- [ ] Professional hover effects
- [ ] Conditional Ordinals logic
- [ ] Server.js syntax validation
- [ ] No performance degradation

### **Browser Testing**
```bash
# Test all major browsers
Chrome (mobile + desktop)
Firefox (mobile + desktop)
Safari (mobile + desktop)
Edge (desktop)

# Test all screen sizes
Mobile: 320px, 480px, 768px
Desktop: 1024px, 1200px, 1600px
```

---

## 📋 **DEVELOPMENT WORKFLOW**

### **Step-by-Step Process**
1. **ASK PERMISSION** for any file modifications
2. **ANALYZE** current implementation
3. **DESIGN** mobile-first (320px)
4. **IMPLEMENT** incrementally
5. **TEST** after each change
6. **VALIDATE** against standards
7. **DOCUMENT** changes made

### **Code Review Standards**
- Enhanced Build Rules v5.0 compliance
- Mobile-First UI Development Guide compliance
- MOOSH design system adherence
- Professional terminal aesthetic
- Dynamic scaling implementation
- Security best practices
- Performance optimization

---

## 🎯 **SUCCESS METRICS**

### **Performance Targets**
- **Load Time:** <3 seconds
- **Interaction Response:** <100ms
- **Animation Frame Rate:** 60fps
- **Mobile Score:** 100% responsive

### **Quality Targets**
- **Design Compliance:** 100% MOOSH standards
- **Mobile Optimization:** Perfect 320px+ experience
- **Professional Aesthetic:** Terminal-style perfection
- **Security Standards:** Client-side only cryptography

---

**TECHNICAL BUILD STANDARDS v1.0**  
*Complete Development Standards for MOOSH Wallet*  
*Created: January 4, 2025* 
 
## Complete Development Standards for MOOSH Wallet

---

## 🚨 **CRITICAL BUILD RULES - NEVER VIOLATE**

### **1. ASK_FIRST_PROTOCOL**
- **NEVER** modify, delete, or move files without explicit permission
- **ALWAYS** ask before creating new files or changing structure
- **STOP** and request clarification if requirements are unclear

### **2. PROFESSIONAL_STRUCTURE**
- **ONLY** use numbered folder system (01_COMPANY/, 02_PRODUCT/, etc.)
- **NEVER** create unnumbered folders (ASSETS/, DEVELOPMENT/, etc.)
- **ROOT LEVEL ONLY:** server.js, index.html, README.md, package.json, .cursorrules

### **3. STEP_BY_STEP_ONLY**
- **BUILD INCREMENTALLY** from current foundation
- **TEST** after each small change
- **NEVER** replace entire working systems
- **PRESERVE** existing perfect wallet flows

### **4. SECURITY_PARANOID**
- **CLIENT-SIDE ONLY** - never expose private keys
- **NO** server-side key storage
- **NO** localStorage for sensitive data
- **PROFESSIONAL** security practices only

### **5. MOBILE_FIRST_OBSESSED**
- **320px MINIMUM** width requirement
- **EVERY** feature must be mobile-optimized BEFORE desktop
- **TOUCH TARGETS** minimum 44px
- **DYNAMIC SCALING** for all elements

### **6. PERFORMANCE_OBSESSED**
- **<3 SECONDS** load time requirement
- **<100ms** interaction response time
- **60fps** smooth animations
- **NO** performance-degrading effects

---

## 🎨 **MOOSH DESIGN SYSTEM**

### **Color Palette (STRICT COMPLIANCE)**
```css
/* MOOSH Brand Colors - NEVER DEVIATE */
--text-primary: #f57315;       /* MOOSH Orange - primary actions */
--text-secondary: #ffffff;     /* White text */
--text-accent: #69fd97bd;      /* Light green accent */
--text-string: #9bffac;        /* String green */
--text-keyword: #6fedbfc2;     /* Keyword cyan-green */
--text-comment: #c8fff2;       /* Comment light cyan */
--text-dim: #71767b;          /* Grey for secondary text */
--bg-primary: #000000;         /* Black background */
--bg-secondary: #000000;       /* Black secondary */
--bg-hover: #1a1a1a;          /* Dark grey hover */
--border-color: #2f3336;       /* Border grey */
```

### **Typography Standards**
```css
/* MANDATORY Font Family */
font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Roboto Mono', 'Consolas', monospace;

/* Dynamic Font Sizing */
font-size: calc(var(--font-base) * var(--scale-factor));
```

### **Dynamic Scaling System (MANDATORY)**
```css
/* ALL sizes MUST use dynamic scaling */
width: calc(20px * var(--scale-factor));
height: calc(20px * var(--scale-factor));
padding: calc(var(--spacing-unit) * var(--scale-factor));
margin: calc(var(--spacing-unit) * 2 * var(--scale-factor));

/* FORBIDDEN - Fixed pixels */
width: 20px; /* ❌ NEVER DO THIS */
```

---

## 📱 **MOBILE-FIRST RESPONSIVE DESIGN**

### **Breakpoint System**
```css
/* Mobile First - Default (320px+) */
:root { --scale-factor: 0.8; }

/* Small Mobile (481px+) */
@media (min-width: 481px) { --scale-factor: 0.85; }

/* Tablet (769px+) */
@media (min-width: 769px) { --scale-factor: 0.9; }

/* Desktop (1025px+) */
@media (min-width: 1025px) { --scale-factor: 0.95; }

/* Large Desktop (1201px+) */
@media (min-width: 1201px) { --scale-factor: 1.0; }
```

### **Touch Target Requirements**
```css
/* Minimum touch area for mobile */
.interactive-element {
    min-height: calc(44px * var(--scale-factor));
    min-width: calc(44px * var(--scale-factor));
    padding: calc(var(--spacing-unit) * var(--scale-factor));
}
```

---

## 🏗️ **COMPONENT DEVELOPMENT STANDARDS**

### **Button System**
```css
.btn-primary {
    background: var(--text-primary);
    color: #000000;
    border: calc(2px * var(--scale-factor)) solid var(--text-primary);
    border-radius: 0; /* NO rounded corners */
    font-family: 'JetBrains Mono', monospace;
    font-size: calc(14px * var(--scale-factor));
    padding: calc(12px * var(--scale-factor)) calc(24px * var(--scale-factor));
    transition: all 0.3s ease;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.btn-primary:hover {
    background: #000000;
    color: var(--text-primary);
}
```

### **Input Field System**
```css
.input-field {
    background: var(--bg-primary);
    border: calc(1px * var(--scale-factor)) solid var(--border-color);
    border-radius: 0; /* NO rounded corners */
    color: var(--text-primary);
    font-family: 'JetBrains Mono', monospace;
    font-size: calc(12px * var(--scale-factor));
    padding: calc(12px * var(--scale-factor));
    transition: all 0.2s ease;
    width: 100%;
}

.input-field:focus {
    border-color: var(--text-primary);
    outline: none;
}
```

### **Card System**
```css
.card {
    background: var(--bg-secondary);
    border: calc(1px * var(--scale-factor)) solid var(--border-color);
    border-radius: 0; /* NO rounded corners */
    padding: calc(24px * var(--scale-factor));
    transition: all 0.2s ease;
}

.card:hover {
    border-color: var(--text-primary);
}
```

---

## 🔧 **JAVASCRIPT TEMPLATE LITERAL STANDARDS**

### **Function Structure Pattern**
```javascript
function generateDashboardHTML() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <!-- Meta tags, fonts, CSS -->
        </head>
        <body>
            <!-- Professional dashboard content -->
        </body>
        </html>
    `;
}
```

### **CSS Integration Pattern**
```javascript
// ALWAYS include complete CSS within template literals
const dashboardHTML = `
    <style>
        /* MOOSH CSS Variables */
        :root {
            --text-primary: #f57315;
            --scale-factor: 0.8;
            /* Complete variable system */
        }
        
        /* Component styles with dynamic scaling */
        .dashboard-header {
            font-size: calc(16px * var(--scale-factor));
            padding: calc(20px * var(--scale-factor));
        }
    </style>
    
    <div class="dashboard-container">
        <!-- Dashboard content -->
    </div>
`;
```

---

## 🎯 **DASHBOARD-SPECIFIC REQUIREMENTS**

### **Professional Header Standards**
```html
<!-- Terminal-style header with blinking cursor -->
<div class="dashboard-header">
    <div class="terminal-prompt">
        <span class="text-dim">~/moosh/wallet $</span>
        <span class="text-primary">dashboard --professional</span>
        <span class="blinking-cursor">|</span>
    </div>
</div>
```

### **Conditional Ordinals Logic**
```javascript
// Ordinals only available for Taproot wallets
function generateBalanceCards(walletType) {
    const baseCards = ['Bitcoin', 'Lightning', 'Stablecoins', 'Network'];
    const cards = walletType === 'Taproot' 
        ? [...baseCards.slice(0, 3), 'Ordinals', baseCards[3]]
        : baseCards;
    
    return cards.map(card => generateCardHTML(card)).join('');
}
```

### **Wallet Selector Requirements**
```javascript
// 5 Address Types: Taproot, SegWit, Legacy, Spark, Multi-Sig
const walletTypes = [
    { id: 'taproot', name: 'Taproot', prefix: 'bc1p...', ordinals: true },
    { id: 'segwit', name: 'SegWit', prefix: 'bc1q...', ordinals: false },
    { id: 'legacy', name: 'Legacy', prefix: '1...', ordinals: false },
    { id: 'spark', name: 'Spark', prefix: 'sp1...', ordinals: false },
    { id: 'multisig', name: 'Multi-Sig', prefix: '3...', ordinals: false }
];
```

---

## 🚨 **FORBIDDEN PRACTICES**

### **❌ NEVER DO:**
- Fixed pixel values (except in root variables)
- Hardcoded colors outside theme system
- Rounded corners (border-radius > 0)
- Glow effects or shadows
- Replace entire working systems
- Modify existing perfect wallet flows
- Create files without permission
- Use fonts other than JetBrains Mono
- Break mobile responsiveness

### **✅ ALWAYS DO:**
- Ask permission before file operations
- Use dynamic scaling for all sizes
- Test mobile-first (320px minimum)
- Follow step-by-step approach
- Preserve existing functionality
- Use professional terminal aesthetic
- Implement conditional Ordinals logic
- Follow Enhanced Build Rules v5.0

---

## 🧪 **TESTING REQUIREMENTS**

### **Mandatory Testing Checklist**
- [ ] Mobile responsive (320px minimum width)
- [ ] Dynamic scaling works across all breakpoints
- [ ] Touch targets adequate (44px minimum)
- [ ] MOOSH color compliance
- [ ] JetBrains Mono font loading
- [ ] Smooth transitions (0.2s-0.3s)
- [ ] Professional hover effects
- [ ] Conditional Ordinals logic
- [ ] Server.js syntax validation
- [ ] No performance degradation

### **Browser Testing**
```bash
# Test all major browsers
Chrome (mobile + desktop)
Firefox (mobile + desktop)
Safari (mobile + desktop)
Edge (desktop)

# Test all screen sizes
Mobile: 320px, 480px, 768px
Desktop: 1024px, 1200px, 1600px
```

---

## 📋 **DEVELOPMENT WORKFLOW**

### **Step-by-Step Process**
1. **ASK PERMISSION** for any file modifications
2. **ANALYZE** current implementation
3. **DESIGN** mobile-first (320px)
4. **IMPLEMENT** incrementally
5. **TEST** after each change
6. **VALIDATE** against standards
7. **DOCUMENT** changes made

### **Code Review Standards**
- Enhanced Build Rules v5.0 compliance
- Mobile-First UI Development Guide compliance
- MOOSH design system adherence
- Professional terminal aesthetic
- Dynamic scaling implementation
- Security best practices
- Performance optimization

---

## 🎯 **SUCCESS METRICS**

### **Performance Targets**
- **Load Time:** <3 seconds
- **Interaction Response:** <100ms
- **Animation Frame Rate:** 60fps
- **Mobile Score:** 100% responsive

### **Quality Targets**
- **Design Compliance:** 100% MOOSH standards
- **Mobile Optimization:** Perfect 320px+ experience
- **Professional Aesthetic:** Terminal-style perfection
- **Security Standards:** Client-side only cryptography

---

**TECHNICAL BUILD STANDARDS v1.0**  
*Complete Development Standards for MOOSH Wallet*  
*Created: January 4, 2025* 
 
 
 
 