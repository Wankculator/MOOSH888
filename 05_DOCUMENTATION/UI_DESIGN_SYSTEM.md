# 🎨 MOOSH Wallet UI Design System v1.0
*Professional Bitcoin Wallet Interface Standards*

## 🎯 Design Philosophy
- **Mobile-First**: Every element optimized for mobile before desktop
- **Terminal Aesthetic**: Professional developer-style interface
- **Minimal Color Palette**: Black, orange, grey only
- **Consistent Typography**: JetBrains Mono throughout
- **Professional Spacing**: Calculated scaling factors

---

## 🎨 Color System

### Primary Colors
```css
--text-primary: #f57315     /* Orange - Main accent color */
--text-dim: #888888         /* Medium grey - Secondary text */
--text-keyword: #69fd97bd   /* Green - Code highlights */
--border-color: #333333     /* Dark grey - Borders/dividers */
--background: #000000       /* Pure black - Main background */
```

### Usage Guidelines
- **Orange (#f57315)**: Primary actions, selected states, important text
- **Medium Grey (#888888)**: Secondary text, labels, brackets
- **Dark Grey (#333333)**: Borders, subtle elements, radio button borders
- **Green (#69fd97bd)**: Code syntax highlighting, success states
- **Black (#000000)**: Backgrounds, circle fills

---

## 📝 Typography System

### Font Family
```css
font-family: 'JetBrains Mono', monospace;
```

### Font Sizes & Hierarchy
```css
/* Headers */
h1: calc(32px * var(--scale-factor))      /* Main title */
.subtitle: calc(16px * var(--scale-factor)) /* Subtitle */

/* Body Text */
.body-text: calc(14px * var(--scale-factor))    /* Standard text */
.small-text: calc(12px * var(--scale-factor))   /* Small labels */
.micro-text: calc(9px * var(--scale-factor))    /* Radio buttons, tiny text */

/* Code Elements */
.terminal-header: calc(8px * var(--scale-factor))  /* Terminal headers */
.terminal-content: calc(8px * var(--scale-factor)) /* Code content */
```

### Font Weights
- **400**: Normal text
- **500**: Radio button labels, important text
- **600**: Headers, section titles

---

## 📐 Spacing System

### Scale Factor (Mobile-First)
```css
:root {
  --scale-factor: 1.0;        /* Desktop */
}

@media (max-width: 768px) {
  --scale-factor: 0.85;       /* Mobile scaling */
}
```

### Standard Spacing Units
```css
--spacing-xs: calc(4px * var(--scale-factor))   /* 4px */
--spacing-sm: calc(8px * var(--scale-factor))   /* 8px */
--spacing-md: calc(12px * var(--scale-factor))  /* 12px */
--spacing-lg: calc(16px * var(--scale-factor))  /* 16px */
--spacing-xl: calc(20px * var(--scale-factor))  /* 20px */
--spacing-xxl: calc(24px * var(--scale-factor)) /* 24px */
```

---

## 🔘 Component Standards

### Radio Buttons
```css
/* Container */
position: absolute;
top: 4px;
right: 8px;

/* Circle */
width: 10px;
height: 10px;
border: 1px solid #333333;    /* Always dark grey */
border-radius: 50%;
background: #000000;          /* Always black */

/* Inner Dot (when selected) */
width: 4px;
height: 4px;
background: #f57315;          /* Orange when selected */
background: transparent;      /* Transparent when not selected */

/* Label Text */
font-size: 9px;
font-weight: 500;
color: #f57315;              /* Orange text */
```

### Buttons
```css
/* Primary Buttons */
background: #000000;
border: 2px solid #f57315;
color: #f57315;
font-size: calc(16px * var(--scale-factor));
padding: calc(16px * var(--scale-factor)) calc(32px * var(--scale-factor));
text-transform: uppercase;
letter-spacing: 0.1em;

/* Hover State */
background: #f57315;
color: #000000;
```

### Input Fields
```css
background: #000000;
border: 1px solid #333333;
color: #f57315;
font-size: calc(12px * var(--scale-factor));
padding: calc(10px * var(--scale-factor)) calc(12px * var(--scale-factor));

/* Focus State */
border-color: #f57315;
```

### Terminal Box
```css
background: #000000;
border: 1px solid #f57315;
padding: calc(8px * var(--scale-factor));
font-family: 'JetBrains Mono', monospace;

/* Header */
font-size: calc(8px * var(--scale-factor));
border-bottom: 1px solid #333333;

/* Content */
font-size: calc(8px * var(--scale-factor));
line-height: 1.3;
```

---

## 🔄 Interactive States

### Hover Effects
```css
/* Text Hover */
.text-dim:hover {
  color: #f57315;
  transition: color 0.3s ease;
}

/* Button Hover */
button:hover {
  background: #f57315;
  color: #000000;
  transition: all 0.2s ease;
}
```

### Selection States
- **Radio Buttons**: Orange inner dot, dark grey border maintained
- **Input Focus**: Orange border, orange text
- **Button Active**: Orange background, black text

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 768px) {
  --scale-factor: 0.85;
  /* All elements scale proportionally */
}

/* Desktop */
@media (min-width: 769px) {
  --scale-factor: 1.0;
}
```

### Mobile Optimizations
- Touch-friendly sizing (minimum 44px touch targets)
- Reduced font sizes with scale factor
- Compressed spacing
- Horizontal layouts for headers

---

## 🎯 Layout Principles

### Positioning Guidelines
- **Absolute positioning** for overlays and floating elements
- **Flexbox** for component alignment
- **Right-aligned** secondary controls
- **Centered** primary content

### Visual Hierarchy
1. **Orange elements**: Primary actions, selected states
2. **White/Light grey**: Secondary information
3. **Dark grey**: Subtle borders, inactive states
4. **Black**: Backgrounds, negative space

---

## 🛡️ Accessibility Standards

### Color Contrast
- Orange on black: High contrast ratio
- Grey on black: Sufficient contrast for secondary text
- No color-only information (always paired with icons/text)

### Typography
- Monospace font for consistency
- Minimum 9px font size (scaled)
- Clear visual hierarchy

---

## 🔧 Implementation Guidelines

### CSS Variables Usage
```css
/* Always use CSS variables for colors */
color: var(--text-primary);    /* ✅ Correct */
color: #f57315;                /* ❌ Avoid hardcoding */

/* Always use scale factor for sizing */
font-size: calc(14px * var(--scale-factor));  /* ✅ Correct */
font-size: 14px;                              /* ❌ Not responsive */
```

### Component Structure
```html
<!-- Standard component pattern -->
<div class="component-container">
  <div class="component-header">
    <span class="text-dim">&lt;</span>
    <span class="text-primary">Component Name</span>
    <span class="text-dim">/&gt;</span>
  </div>
  <div class="component-content">
    <!-- Content here -->
  </div>
</div>
```

---

## 📋 Quality Checklist

### Before Adding New Components
- [ ] Uses established color variables
- [ ] Implements responsive scaling
- [ ] Follows typography hierarchy
- [ ] Maintains consistent spacing
- [ ] Includes proper hover states
- [ ] Mobile-optimized sizing
- [ ] Accessible contrast ratios

### Code Review Standards
- [ ] No hardcoded colors
- [ ] No hardcoded sizes without scale factor
- [ ] Consistent naming conventions
- [ ] Proper semantic HTML structure
- [ ] Optimized for touch interactions

---

## 🚀 Future Enhancements

### Planned Additions
- Animation system with consistent timing
- Icon library with SVG standards
- Extended color palette for states
- Component library documentation
- Design tokens for programmatic access

---

*Last Updated: 2025-01-02*
*Version: 1.0*
*Author: MOOSH Wallet Development Team* 