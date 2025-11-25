# Keyboard Accessibility Guide

## Overview

This document outlines the keyboard navigation features and accessibility improvements implemented in the Products VS platform.

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + S` | Skip to main content |
| `Alt + /` | Focus search bar |
| `Tab` | Navigate forward through interactive elements |
| `Shift + Tab` | Navigate backward through interactive elements |
| `Enter` | Activate buttons and links |
| `Space` | Activate buttons |
| `Escape` | Close modals, clear forms, close mobile menu |

### Form Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Enter` | Submit form | AI Battle comparison form |
| `Escape` | Clear form inputs | AI Battle comparison form |
| `Alt + W` | Swap products | AI Battle comparison form |

### Navigation Shortcuts

| Shortcut | Action |
|----------|--------|
| `Escape` | Close mobile menu |
| `Tab` | Navigate through menu items (focus trap when open) |

## Focus Management

### Focus Indicators

All interactive elements have visible focus indicators:
- **3px solid outline** with 3px offset
- High contrast against all backgrounds
- Smooth transitions for better UX
- Removed for mouse users (`:focus-visible`)

### Focus Trap

Focus is trapped in the following components when open:
- Mobile navigation menu
- Admin preview modals
- Any dialog/modal components

### Focus Restoration

Focus is automatically restored to the triggering element when:
- Closing modals
- Closing mobile menu
- Completing form submissions

## ARIA Labels and Roles

### Navigation

\`\`\`tsx
<nav aria-label="Main navigation">
  <button aria-label="Open navigation menu" aria-expanded="false">
  <form role="search" aria-label="Search products">
  <Link aria-current="page"> // for active page
\`\`\`

### Forms

\`\`\`tsx
<form aria-label="Product comparison form">
  <input aria-label="First product to compare" aria-required="true">
  <button aria-label="Compare products (Enter)">
\`\`\`

### Interactive Elements

\`\`\`tsx
<button aria-label="Share on Twitter">
<Link aria-label="View comparison: iPhone vs Samsung">
<div role="region" aria-label="Share comparison options">
\`\`\`

## Screen Reader Support

### Semantic HTML

- Proper heading hierarchy (h1 → h2 → h3)
- Semantic landmarks (`<nav>`, `<main>`, `<footer>`)
- Descriptive link text
- Form labels associated with inputs

### Hidden Content

Screen reader only text for context:
\`\`\`tsx
<span className="sr-only">Current page</span>
\`\`\`

### Live Regions

Dynamic content updates announced to screen readers:
\`\`\`tsx
<div role="status" aria-live="polite">
  Loading comparison results...
</div>
\`\`\`

## Testing Checklist

### Manual Testing

- [ ] Tab through entire page - all interactive elements reachable
- [ ] Shift+Tab works in reverse order
- [ ] Focus indicators visible on all elements
- [ ] Skip to content link appears on Tab
- [ ] Mobile menu traps focus when open
- [ ] Escape closes mobile menu
- [ ] Forms submit with Enter key
- [ ] All buttons activate with Space and Enter
- [ ] Search bar focuses with Alt+/
- [ ] No keyboard traps (can always escape)

### Screen Reader Testing

- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (Mac/iOS)
- [ ] Test with TalkBack (Android)
- [ ] All images have alt text
- [ ] Form errors announced
- [ ] Dynamic content changes announced
- [ ] Proper heading structure

### Automated Testing

Run accessibility audits:
\`\`\`bash
# Lighthouse accessibility audit
npm run lighthouse

# axe-core testing
npm run test:a11y
\`\`\`

## Browser Support

Keyboard navigation tested and working in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Common Issues and Solutions

### Issue: Focus not visible
**Solution:** Check if `:focus-visible` styles are applied correctly

### Issue: Tab order incorrect
**Solution:** Verify DOM order matches visual order, avoid positive tabindex values

### Issue: Can't escape modal
**Solution:** Ensure Escape key handler is implemented and focus trap is working

### Issue: Screen reader not announcing changes
**Solution:** Add `aria-live` regions for dynamic content

## Implementation Details

### Custom Hooks

#### `useKeyboardNavigation`
Manages keyboard events and focus trapping:
\`\`\`tsx
const { getFocusableElements } = useKeyboardNavigation(containerRef, {
  onEscape: () => closeModal(),
  onEnter: () => submitForm(),
  trapFocus: true,
  autoFocus: true,
})
\`\`\`

#### `useSkipToContent`
Enables Alt+S shortcut to skip to main content:
\`\`\`tsx
useSkipToContent() // Add to layout component
\`\`\`

#### `useFocusRestore`
Restores focus when component unmounts:
\`\`\`tsx
useFocusRestore(isModalOpen)
\`\`\`

## Best Practices

1. **Always provide keyboard alternatives** for mouse-only interactions
2. **Test with keyboard only** - unplug your mouse
3. **Use semantic HTML** before adding ARIA
4. **Keep focus indicators visible** and high contrast
5. **Maintain logical tab order** - DOM order = visual order
6. **Provide skip links** for repetitive content
7. **Trap focus in modals** to prevent confusion
8. **Restore focus** when closing overlays
9. **Use aria-label** for icon-only buttons
10. **Test with real screen readers** not just automated tools

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Reporting Issues

If you discover keyboard accessibility issues:
1. Document the issue with steps to reproduce
2. Include browser and assistive technology details
3. Create an issue in the repository
4. Tag with `accessibility` label
