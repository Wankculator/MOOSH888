# 🎯 DYNAMIC SCALING PLAN v5.0
*Professional Mobile-First Development Standards for MOOSH Wallet*

## 🛡️ MANDATORY RULES - NEVER VIOLATE

### **Core Principles**
1. **MOBILE-FIRST ALWAYS** - Design for mobile, enhance for desktop
2. **DYNAMIC SCALING ONLY** - Use `calc(size * var(--scale-factor))` everywhere
3. **TOUCH-FRIENDLY MINIMUM** - 44px minimum touch targets
4. **CONSISTENT VARIABLES** - Use CSS custom properties for all sizing
5. **PROFESSIONAL QUALITY** - Pixel-perfect scaling across all devices

---

## 📱 RESPONSIVE BREAKPOINT SYSTEM

### **Breakpoint Architecture**
```css
/* MOBILE FIRST - BASE STYLES */
:root {
    --scale-factor: 0.8;        /* Extra small mobile */
    --font-base: 13px;
    --container-padding: 14px;
    --spacing-unit: 6px;
    --touch-target-min: 44px;
    --mobile-line-height: 1.4;
}

/* SMALL MOBILE */
@media (max-width: 480px) {
    :root {
        --scale-factor: 0.8;
        --font-base: 13px;
        --container-padding: 14px;
        --spacing-unit: 6px;
    }
}

/* LARGE MOBILE */
@media (min-width: 481px) and (max-width: 768px) {
    :root {
        --scale-factor: 0.85;
        --font-base: 14px;
        --container-padding: 16px;
        --spacing-unit: 7px;
    }
}

/* TABLET */
@media (min-width: 769px) and (max-width: 1024px) {
    :root {
        --scale-factor: 0.9;
        --font-base: 15px;
        --container-padding: 20px;
        --spacing-unit: 8px;
    }
}

/* DESKTOP */
@media (min-width: 1025px) {
    :root {
        --scale-factor: 1.0;
        --font-base: 16px;
        --container-padding: 24px;
        --spacing-unit: 8px;
    }
}
```

---

## 🎨 COMPONENT SCALING STANDARDS

### **Typography Scaling**
```css
/* MANDATORY FORMULA FOR ALL TEXT */
font-size: calc([base-size]px * var(--scale-factor));
line-height: var(--mobile-line-height);

/* EXAMPLES */
.title { font-size: calc(32px * var(--scale-factor)); }
.subtitle { font-size: calc(18px * var(--scale-factor)); }
.body-text { font-size: calc(var(--font-base) * var(--scale-factor)); }
.small-text { font-size: calc(12px * var(--scale-factor)); }
.micro-text { font-size: calc(10px * var(--scale-factor)); }
```

### **Spacing System**
```css
/* MANDATORY SPACING FORMULA */
margin/padding: calc(var(--spacing-unit) * [multiplier] * var(--scale-factor));

/* SPACING SCALE */
--spacing-xs: calc(var(--spacing-unit) * 0.5 * var(--scale-factor));    /* 3px mobile */
--spacing-sm: calc(var(--spacing-unit) * 1 * var(--scale-factor));      /* 6px mobile */
--spacing-md: calc(var(--spacing-unit) * 1.5 * var(--scale-factor));    /* 9px mobile */
--spacing-lg: calc(var(--spacing-unit) * 2 * var(--scale-factor));      /* 12px mobile */
--spacing-xl: calc(var(--spacing-unit) * 3 * var(--scale-factor));      /* 18px mobile */
```

### **Touch Target Standards**
```css
/* MANDATORY MINIMUM SIZES */
button, .clickable {
    min-height: calc(var(--touch-target-min) * var(--scale-factor));
    min-width: calc(var(--touch-target-min) * var(--scale-factor));
    padding: calc(var(--spacing-unit) * 1.5 * var(--scale-factor));
}

/* RADIO BUTTONS & CHECKBOXES */
.radio, .checkbox {
    width: calc(12px * var(--scale-factor));
    height: calc(12px * var(--scale-factor));
    min-width: calc(var(--touch-target-min) * 0.3 * var(--scale-factor));
    min-height: calc(var(--touch-target-min) * 0.3 * var(--scale-factor));
}
```

---

## 🏗️ IMPLEMENTATION RULES

### **CSS Custom Properties - MANDATORY**
```css
/* ALWAYS USE THESE VARIABLES */
:root {
    /* SCALING SYSTEM */
    --scale-factor: 0.8;              /* Dynamic scaling multiplier */
    --font-base: 13px;                /* Base font size */
    --container-padding: 14px;        /* Container padding */
    --spacing-unit: 6px;              /* Base spacing unit */
    --touch-target-min: 44px;         /* Minimum touch target */
    --mobile-line-height: 1.4;       /* Mobile line height */
    
    /* MOOSH COLORS - NEVER CHANGE */
    --text-primary: #f57315;          /* Orange */
    --text-dim: #888888;              /* Medium grey */
    --text-keyword: #69fd97bd;        /* Green */
    --border-color: #333333;          /* Dark grey */
    --background: #000000;            /* Black */
}
```

### **Component Creation Rules**
1. **Start with mobile design** (480px and below)
2. **Use dynamic scaling formulas** for all sizes
3. **Test on multiple devices** before implementation
4. **Maintain 44px minimum touch targets**
5. **Use consistent color palette** (orange, black, dark grey)

---

## 📋 DEVELOPMENT CHECKLIST

### **Before Creating Any Component:**
- [ ] Define mobile-first base styles
- [ ] Use `calc(size * var(--scale-factor))` for all dimensions
- [ ] Implement proper touch targets (44px minimum)
- [ ] Test on mobile devices first
- [ ] Ensure consistent spacing using `--spacing-unit`
- [ ] Verify color scheme compliance (orange/black/grey)
- [ ] Add proper line-height for readability

### **Component Testing Requirements:**
- [ ] iPhone SE (375px) - Smallest mobile
- [ ] iPhone 12 (390px) - Standard mobile
- [ ] iPad Mini (768px) - Tablet
- [ ] Desktop (1024px+) - Desktop

---

## 🎯 COMPONENT TEMPLATES

### **Button Template**
```css
.moosh-button {
    /* MANDATORY SCALING */
    font-size: calc(15px * var(--scale-factor));
    padding: calc(var(--spacing-unit) * 2 * var(--scale-factor)) calc(var(--spacing-unit) * 3 * var(--scale-factor));
    height: calc(var(--touch-target-min) * 1.2 * var(--scale-factor));
    min-height: calc(var(--touch-target-min) * var(--scale-factor));
    border-width: calc(2px * var(--scale-factor));
    line-height: var(--mobile-line-height);
    
    /* MOOSH STYLING */
    background: #000000;
    border: calc(2px * var(--scale-factor)) solid var(--text-primary);
    color: var(--text-primary);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    
    /* MOBILE OPTIMIZATION */
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
}
```

### **Input Template**
```css
.moosh-input {
    /* MANDATORY SCALING */
    font-size: calc(var(--font-base) * var(--scale-factor));
    padding: calc(var(--spacing-unit) * 1.5 * var(--scale-factor)) calc(var(--spacing-unit) * 2 * var(--scale-factor));
    height: calc(var(--touch-target-min) * var(--scale-factor));
    border-width: calc(1px * var(--scale-factor));
    line-height: var(--mobile-line-height);
    
    /* MOOSH STYLING */
    background: #000000;
    border: calc(1px * var(--scale-factor)) solid var(--border-color);
    color: var(--text-primary);
    font-family: 'JetBrains Mono', monospace;
    
    /* MOBILE OPTIMIZATION */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    touch-action: manipulation;
    box-sizing: border-box;
}
```

### **Text Template**
```css
.moosh-text {
    /* MANDATORY SCALING */
    font-size: calc([base-size]px * var(--scale-factor));
    line-height: var(--mobile-line-height);
    margin-bottom: calc(var(--spacing-unit) * [multiplier] * var(--scale-factor));
    
    /* MOOSH STYLING */
    font-family: 'JetBrains Mono', monospace;
    color: var(--text-primary);
}
```

---

## 🚨 VIOLATION PREVENTION

### **Common Mistakes to AVOID:**
❌ **Fixed pixel values** (e.g., `font-size: 16px`)
❌ **Hardcoded spacing** (e.g., `margin: 20px`)
❌ **Small touch targets** (less than 44px)
❌ **Desktop-first design** (starting with large screens)
❌ **Inconsistent breakpoints** (random media queries)
❌ **Missing line-height** (poor mobile readability)
❌ **Wrong color usage** (colors outside approved palette)

### **Correct Approach:**
✅ **Dynamic scaling** (e.g., `font-size: calc(16px * var(--scale-factor))`)
✅ **Variable-based spacing** (e.g., `margin: calc(var(--spacing-unit) * 2 * var(--scale-factor))`)
✅ **Touch-friendly targets** (minimum 44px scaled)
✅ **Mobile-first workflow** (design for 375px first)
✅ **Consistent breakpoints** (using defined system)
✅ **Proper line-height** (using `var(--mobile-line-height)`)
✅ **Approved colors only** (orange, black, dark grey)

---

## 🔧 IMPLEMENTATION WORKFLOW

### **Step-by-Step Process:**
1. **Design Mobile First** (375px viewport)
2. **Define Base Sizes** (without scaling)
3. **Apply Scaling Formula** (`calc(size * var(--scale-factor))`)
4. **Test on Real Devices** (iPhone, Android)
5. **Verify Touch Targets** (minimum 44px)
6. **Check Color Compliance** (orange/black/grey only)
7. **Test All Breakpoints** (480px, 768px, 1024px+)
8. **Validate Accessibility** (contrast, focus states)

### **Quality Assurance:**
- **Visual Testing:** Component looks perfect on all devices
- **Interaction Testing:** All elements are easily tappable
- **Performance Testing:** Smooth animations and transitions
- **Accessibility Testing:** Proper focus states and contrast

---

## 📊 SUCCESS METRICS

### **Component Quality Standards:**
- ✅ **100% Dynamic Scaling** - No fixed pixel values
- ✅ **44px+ Touch Targets** - All interactive elements
- ✅ **Consistent Spacing** - Using spacing system
- ✅ **Perfect Mobile UX** - Optimized for touch
- ✅ **Professional Appearance** - Terminal aesthetic maintained
- ✅ **Color Compliance** - Orange/black/grey only
- ✅ **Cross-Device Compatibility** - Works on all screen sizes

### **Development Speed Targets:**
- **Component Creation:** 15 minutes maximum
- **Mobile Testing:** 5 minutes per breakpoint
- **Quality Validation:** 10 minutes comprehensive check
- **Total Implementation:** 30 minutes per component

---

## 🎯 FUTURE DEVELOPMENT

### **When Adding New Features:**
1. **Follow this plan exactly** - No exceptions
2. **Start with mobile design** - Always mobile-first
3. **Use established patterns** - Reference existing components
4. **Test thoroughly** - All devices and breakpoints
5. **Document changes** - Update this plan if needed

### **Plan Updates:**
- **Version Control:** Track all changes to scaling system
- **Backward Compatibility:** Ensure existing components still work
- **Performance Monitoring:** Watch for scaling impact on performance
- **User Feedback:** Incorporate mobile usability feedback

---

## 🚀 CONCLUSION

This Dynamic Scaling Plan v5.0 ensures **consistent, professional, mobile-first development** for MOOSH Wallet. Every component must follow these standards to maintain the high-quality terminal aesthetic while providing excellent mobile user experience.

**Remember:** Mobile users are our primary audience. Every design decision should prioritize mobile usability while maintaining the professional developer tool aesthetic that makes MOOSH Wallet unique.

---

*Dynamic Scaling Plan v5.0 - Implemented: 2025-01-02*
*Next Review: When adding major new features*
*Status: ACTIVE - Mandatory for all development* 