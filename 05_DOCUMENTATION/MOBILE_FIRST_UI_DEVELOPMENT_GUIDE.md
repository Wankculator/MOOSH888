# 📱 MOBILE-FIRST UI DEVELOPMENT GUIDE v1.0
## Complete Technical Standards for MOOSH Wallet

---

## 🎯 **CORE PRINCIPLES**

### **1. Mobile-First Approach**
- Design for mobile screens FIRST (320px minimum)
- Progressive enhancement for larger screens
- Touch targets minimum 44px
- Never break mobile when optimizing desktop

### **2. Dynamic Scaling System**
- ALL sizing uses `calc(size * var(--scale-factor))`
- NO fixed pixel values except in root variables
- Responsive breakpoints handle scale-factor automatically
- Consistent proportions across all screen sizes

### **3. Theme-Aware Design**
- ONLY use approved color variables
- ALL elements must support both themes
- NO hardcoded colors outside theme system
- Test in both Original and MOOSH modes

---

## 🎨 **APPROVED COLOR PALETTE**

### **Original Mode Colors**
```css
--text-primary: #FF6B35        /* Main orange - buttons, highlights */
--text-secondary: #ffffff      /* White text */
--text-accent: #69fd97bd       /* Light green accent */
--text-string: #9bffac         /* String green */
--text-keyword: #6fedbfc2      /* Keyword cyan-green */
--text-comment: #c8fff2        /* Comment light cyan */
--text-dim: #666666            /* Grey for secondary text */
--bg-primary: #000000          /* Black background */
--bg-secondary: #000000        /* Black secondary */
--bg-hover: #1a1a1a           /* Dark grey hover */
--border-color: #2f3336       /* Border grey */
```

### **MOOSH Mode Colors**
```css
--text-primary: #69fd97bd      /* Main green - replaces orange */
--text-secondary: #9bffac      /* Light green text */
--text-accent: #6fedbfc2       /* Cyan-green accent */
--text-string: #9bffac         /* String green */
--text-keyword: #6fedbfc2      /* Keyword cyan-green */
--text-comment: #c8fff2        /* Comment light cyan */
--text-dim: #71767b           /* Slightly different grey */
--bg-primary: #000000          /* Black background */
--bg-secondary: #000000        /* Black secondary */
--bg-hover: #0a1a0f           /* Dark green hover */
--border-color: #69fd97bd     /* Green borders */
```

### **🚨 FORBIDDEN COLORS**
- NO pure white (#ffffff) except for text-secondary
- NO other shades of orange or green
- NO blue, red, yellow, purple variations
- NO custom colors without approval

---

## 📐 **DYNAMIC SCALING SYSTEM**

### **Root Variables Structure**
```css
:root {
    --scale-factor: 0.8;        /* Mobile first */
    --font-base: 14px;          /* Base font size */
    --spacing-unit: 8px;        /* Base spacing */
    --container-padding: 16px;  /* Mobile padding */
    --touch-target-min: 44px;   /* Touch minimum */
}
```

### **Responsive Breakpoints**
```css
/* Mobile First - Default */
@media (max-width: 480px) {
    :root { --scale-factor: 0.8; }
}

/* Small Mobile */
@media (min-width: 481px) and (max-width: 768px) {
    :root { --scale-factor: 0.85; }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
    :root { --scale-factor: 0.9; }
}

/* Desktop */
@media (min-width: 1025px) and (max-width: 1200px) {
    :root { --scale-factor: 0.95; }
}

/* Large Desktop */
@media (min-width: 1201px) {
    :root { --scale-factor: 1.0; }
}
```

### **Mandatory Scaling Pattern**
```css
/* ✅ CORRECT - Dynamic scaling */
.element {
    width: calc(20px * var(--scale-factor));
    height: calc(20px * var(--scale-factor));
    font-size: calc(12px * var(--scale-factor));
    padding: calc(var(--spacing-unit) * var(--scale-factor));
    margin: calc(var(--spacing-unit) * 2 * var(--scale-factor));
}

/* ❌ FORBIDDEN - Fixed pixels */
.element {
    width: 20px;
    height: 20px;
    font-size: 12px;
}
```

---

## 🔘 **CIRCULAR BUTTON STANDARDS**

### **Standard Circle Proportions**
```css
.circle-button {
    width: calc(12px * var(--scale-factor));
    height: calc(12px * var(--scale-factor));
    border: calc(1px * var(--scale-factor)) solid #333333;
    border-radius: 50%;
    background: #000000;
    transition: all 0.2s ease;
}

.circle-inner {
    width: calc(4px * var(--scale-factor));
    height: calc(4px * var(--scale-factor));
    border-radius: 50%;
    background: var(--text-primary);
    transition: all 0.2s ease;
}
```

### **Hover States**
```css
.circle-button:hover {
    border-color: var(--text-primary);
}

/* Theme-specific hover */
.theme-spark .circle-button:hover {
    border-color: #69fd97bd;
}
```

---

## 📱 **MOBILE OPTIMIZATION RULES**

### **Touch Target Requirements**
```css
/* Minimum touch area */
.interactive-element {
    min-height: calc(var(--touch-target-min) * 0.8 * var(--scale-factor));
    padding: calc(var(--spacing-unit) * var(--scale-factor));
    cursor: pointer;
}
```

### **Mobile-Specific Styling**
```css
@media (max-width: 768px) {
    /* Smaller text for mobile only */
    .text-dim {
        font-size: calc(8px * var(--scale-factor)) !important;
    }
    
    /* Mobile-specific spacing */
    .mobile-compact {
        padding: calc(var(--spacing-unit) * 0.5 * var(--scale-factor)) !important;
    }
}
```

### **Typography Scaling**
```css
/* Base typography */
.text-base {
    font-size: calc(var(--font-base) * var(--scale-factor));
    line-height: var(--mobile-line-height);
    font-family: 'JetBrains Mono', monospace;
}

/* Mobile bracket optimization */
@media (max-width: 768px) {
    .bracket-text {
        font-size: calc(8px * var(--scale-factor)) !important;
    }
}
```

---

## 🎨 **THEME SYSTEM IMPLEMENTATION**

### **Theme-Aware Component Pattern**
```css
/* Base styling */
.component {
    color: var(--text-primary);
    border-color: var(--text-primary);
    background: var(--bg-primary);
    transition: all 0.3s ease;
}

/* Theme-specific overrides */
.theme-spark .component {
    color: #69fd97bd !important;
    border-color: #69fd97bd !important;
}

/* Hover states for both themes */
.component:hover {
    color: var(--text-primary);
}

.theme-spark .component:hover {
    color: #6fedbfc2 !important;
}
```

### **Notification System Pattern**
```css
/* Theme-aware notifications */
.notification {
    border: calc(2px * var(--scale-factor)) solid var(--text-primary);
    color: var(--text-primary);
    background: #000000;
    /* NO glow effects */
}

/* JavaScript theme detection */
const isCurrentlyMooshTheme = document.body.classList.contains('theme-spark');
const primaryColor = isCurrentlyMooshTheme ? '#69fd97bd' : '#f57315';
```

---

## 🏗️ **COMPONENT DEVELOPMENT CHECKLIST**

### **Before Adding Any New Element:**
- [ ] Uses dynamic scaling (`calc(size * var(--scale-factor))`)
- [ ] Supports both Original and MOOSH themes
- [ ] Has proper touch targets (44px minimum)
- [ ] Tested on mobile (320px) and desktop (1200px+)
- [ ] Uses only approved colors from palette
- [ ] Follows JetBrains Mono font family
- [ ] Has smooth transitions (0.2s-0.3s ease)
- [ ] No hardcoded pixel values
- [ ] Proper hover states for both themes

### **Testing Requirements:**
```bash
# Test all screen sizes
# Mobile: 320px, 480px, 768px
# Desktop: 1024px, 1200px, 1600px

# Test both themes
# Original Mode: Orange colors
# MOOSH Mode: Green colors

# Test interactions
# Hover effects work
# Touch targets are adequate
# Transitions are smooth
```

---

## 📐 **LAYOUT PATTERNS**

### **Flexbox Standards**
```css
.flex-container {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing-unit) * var(--scale-factor));
    padding: calc(var(--spacing-unit) * var(--scale-factor));
}

/* Mobile adjustments */
@media (max-width: 768px) {
    .flex-container {
        flex-direction: column;
        gap: calc(var(--spacing-unit) * 0.5 * var(--scale-factor));
    }
}
```

### **Grid Systems**
```css
.grid-container {
    display: grid;
    gap: calc(var(--spacing-unit) * var(--scale-factor));
    grid-template-columns: repeat(auto-fit, minmax(calc(200px * var(--scale-factor)), 1fr));
}
```

---

## 🎯 **INTERACTIVE ELEMENT STANDARDS**

### **Button Patterns**
```css
.btn-primary {
    background: var(--text-primary);
    color: #000000;
    border: calc(2px * var(--scale-factor)) solid var(--text-primary);
    padding: calc(var(--spacing-unit) * 2 * var(--scale-factor)) calc(var(--spacing-unit) * 3 * var(--scale-factor));
    font-family: 'JetBrains Mono', monospace;
    font-size: calc(14px * var(--scale-factor));
    transition: all 0.3s ease;
    cursor: pointer;
    min-height: calc(var(--touch-target-min) * var(--scale-factor));
}

.btn-primary:hover {
    background: #000000;
    color: var(--text-primary);
}
```

### **Input Field Patterns**
```css
.input-field {
    background: #000000;
    border: calc(1px * var(--scale-factor)) solid var(--text-primary);
    color: var(--text-primary);
    font-family: 'JetBrains Mono', monospace;
    font-size: calc(12px * var(--scale-factor));
    padding: calc(var(--spacing-unit) * 1.5 * var(--scale-factor));
    min-height: calc(var(--touch-target-min) * var(--scale-factor));
    transition: all 0.2s ease;
}

.input-field:focus {
    outline: none;
    border-color: var(--text-primary);
}
```

---

## 🚨 **COMMON MISTAKES TO AVOID**

### **❌ DON'T DO:**
```css
/* Fixed pixels */
width: 20px;

/* Hardcoded colors */
color: #FF6B35;
border: 1px solid orange;

/* Missing theme support */
.element { color: orange; }

/* No mobile consideration */
font-size: 16px; /* Same on all screens */

/* Glow effects */
box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
```

### **✅ DO THIS:**
```css
/* Dynamic scaling */
width: calc(20px * var(--scale-factor));

/* Theme variables */
color: var(--text-primary);
border: calc(1px * var(--scale-factor)) solid var(--text-primary);

/* Theme support */
.element { color: var(--text-primary); }
.theme-spark .element { color: #69fd97bd !important; }

/* Mobile responsive */
font-size: calc(16px * var(--scale-factor));

/* Clean design */
/* No glow effects */
```

---

## 🔧 **DEVELOPMENT WORKFLOW**

### **1. Component Creation Process**
```bash
# 1. Design mobile-first (320px)
# 2. Add dynamic scaling
# 3. Test both themes
# 4. Test all breakpoints
# 5. Add hover states
# 6. Verify touch targets
# 7. Check color compliance
```

### **2. Testing Checklist**
```javascript
// Test theme switching
toggleTheme(); // Verify colors change correctly

// Test mobile responsive
// Resize browser: 320px → 1600px

// Test interactions
// Hover effects work in both themes
// Touch targets are adequate
// Transitions are smooth
```

### **3. Code Review Standards**
- No hardcoded pixels (except root variables)
- All colors use theme variables
- Mobile-first responsive design
- Both themes supported
- Touch targets adequate
- Smooth transitions
- JetBrains Mono font

---

## 📚 **REFERENCE IMPLEMENTATIONS**

### **Perfect Circle Button Example**
```html
<div class="theme-toggle" onclick="toggleTheme()">
    <span class="theme-toggle-icon">.theme</span>
    <div class="theme-toggle-button">
        <div class="theme-toggle-inner"></div>
    </div>
</div>
```

### **Perfect Hover Effect Example**
```css
.security-seed-header:hover span {
    color: var(--text-primary) !important;
}

.theme-spark .security-seed-header:hover span {
    color: #69fd97bd !important;
}
```

### **Perfect Notification Example**
```javascript
// Theme-aware notification
const isCurrentlyMooshTheme = document.body.classList.contains('theme-spark');
if (type === 'moosh') {
    notification.style.borderColor = '#69fd97bd';
    notification.style.color = '#69fd97bd';
} else if (type === 'original') {
    notification.style.borderColor = '#f57315';
    notification.style.color = '#f57315';
}
```

---

## 🎯 **SUCCESS METRICS**

### **Performance Standards**
- Load time: <3 seconds
- Interaction response: <100ms
- Smooth 60fps animations
- No layout shifts

### **Mobile Standards**
- Touch targets: ≥44px
- Text readable: ≥8px on mobile
- Proper spacing: No cramped elements
- Thumb-friendly navigation

### **Theme Standards**
- Instant theme switching
- No color bleeding between themes
- Consistent hover states
- Perfect color compliance

---

**Version**: 1.0  
**Last Updated**: 2025-07-02  
**Status**: ✅ Production Ready  
**Next Review**: When adding new components 