# 📱 MOBILE-FIRST UI RULES v1.0
**MANDATORY for ALL MOOSH Wallet Development**

## 🚨 CRITICAL PRINCIPLES

### 1. MOBILE-FIRST ALWAYS
- **Design for mobile FIRST, then scale up**
- **Test on mobile before desktop**
- **Never break desktop when optimizing mobile**

### 2. DYNAMIC SCALING SYSTEM
```css
/* ALWAYS use this pattern */
font-size: calc(base-size * var(--scale-factor));
padding: calc(base-padding * var(--scale-factor));
margin: calc(base-margin * var(--scale-factor));
```

### 3. MEDIA QUERY STRUCTURE
```css
/* Mobile-only styles */
@media (max-width: 768px) {
    /* Styles ONLY affect mobile */
    .element {
        font-size: 8px !important; /* Fixed px for mobile */
    }
}
```

## 🎯 BRACKET & SYMBOL SCALING RULES

### Desktop Sizes (Perfect - Never Change)
- **Navigation brackets**: `<Moosh.money />` - Natural CSS size
- **Address types**: `< Spark Protocol • Taproot • etc />` - Natural CSS size  
- **Password section**: `<Create a secure password.../>` - Natural CSS size
- **Radio section**: `< Select Security Seed />` - Natural CSS size

### Mobile Sizes (Inside @media only)
- **Navigation brackets**: `8px`
- **Address types**: `8px`
- **Password section**: `10px`
- **Radio section**: `8px`
- **Buttons**: `calc(12px * var(--scale-factor))`

## 📐 SIZING STANDARDS

### Font Sizes
```css
/* Desktop (default) */
--text-small: 10px;
--text-normal: 12px;
--text-medium: 14px;
--text-large: 16px;

/* Mobile (inside @media) */
--text-small: 8px;
--text-normal: 9px;
--text-medium: 10px;
--text-large: 12px;
```

### Touch Targets
```css
--touch-target-min: 44px; /* Minimum for mobile */
button, .clickable {
    min-height: calc(var(--touch-target-min) * var(--scale-factor));
    min-width: calc(var(--touch-target-min) * var(--scale-factor));
}
```

## 🛡️ PROTECTION RULES

### 1. Never Use Inline Font Sizes
❌ **WRONG:**
```html
<span style="font-size: calc(4px * var(--scale-factor));">Text</span>
```

✅ **CORRECT:**
```html
<span class="text-dim">Text</span>
```

### 2. CSS Classes Over Inline Styles
❌ **WRONG:**
```html
<div style="font-size: 6px;">Content</div>
```

✅ **CORRECT:**
```css
.bracket-text {
    font-size: 12px; /* Desktop */
}

@media (max-width: 768px) {
    .bracket-text {
        font-size: 8px; /* Mobile only */
    }
}
```

### 3. Test Both Desktop and Mobile
- **Desktop**: Must remain readable and properly sized
- **Mobile**: Must be smaller but still readable
- **Never sacrifice desktop for mobile**

## 🚀 IMPLEMENTATION CHECKLIST

### Before Adding Any UI Element:
- [ ] Define desktop size first
- [ ] Create CSS class (no inline styles)
- [ ] Add mobile-only media query
- [ ] Test on both desktop and mobile
- [ ] Verify brackets/symbols scale properly

### For Brackets and Symbols:
- [ ] Use semantic CSS classes
- [ ] Desktop: Natural readable size
- [ ] Mobile: 8-10px fixed sizes
- [ ] Test readability on small screens

### For Interactive Elements:
- [ ] Minimum 44px touch targets on mobile
- [ ] Proper spacing between elements
- [ ] Hover states for desktop
- [ ] Touch states for mobile

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile First */
@media (max-width: 768px) {
    /* Phone styles */
}

@media (min-width: 769px) and (max-width: 1024px) {
    /* Tablet styles */
}

@media (min-width: 1025px) {
    /* Desktop styles */
}
```

## ⚡ PERFORMANCE RULES

### CSS Optimization
- Use `transform` over changing layout properties
- Minimize repaints with `will-change`
- Use CSS custom properties for theming

### Animation Guidelines
```css
/* Smooth 60fps animations */
.element {
    transition: transform 0.2s ease;
    will-change: transform;
}
```

## 🔧 DEBUGGING TOOLS

### Mobile Testing Commands
```javascript
// Test mobile viewport
document.documentElement.style.fontSize = '16px';
window.innerWidth; // Check viewport width

// Test scaling
getComputedStyle(document.documentElement).getPropertyValue('--scale-factor');
```

### Browser DevTools
1. **Chrome DevTools**: Toggle device toolbar (Ctrl+Shift+M)
2. **Test multiple devices**: iPhone, Android, iPad
3. **Check font sizes**: Inspect computed styles

## 🚨 EMERGENCY FIXES

### If Mobile Breaks Desktop:
1. **Remove all inline font-size styles**
2. **Move sizing to CSS classes**
3. **Wrap mobile styles in @media queries**
4. **Test desktop first, then mobile**

### If Desktop Breaks Mobile:
1. **Add mobile-specific @media query**
2. **Use fixed px values for mobile**
3. **Keep desktop styles as default**

## 📋 CODE REVIEW CHECKLIST

Before merging any UI changes:
- [ ] Desktop appearance unchanged
- [ ] Mobile properly scaled
- [ ] No inline font-size styles
- [ ] CSS classes used consistently
- [ ] Media queries properly scoped
- [ ] Touch targets meet 44px minimum
- [ ] Text remains readable on all devices

## 🎯 SUCCESS METRICS

### Desktop
- Brackets readable and properly sized
- Professional appearance maintained
- No visual regressions

### Mobile  
- Brackets 8-10px (readable but compact)
- Touch targets minimum 44px
- Smooth scrolling and interactions
- Fast load times (<3s)

---

**Remember: Mobile-first means designing for mobile, not breaking desktop!**

*Last updated: 2025-07-02*
*Version: 1.0* 