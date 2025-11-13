# 24Toolkit Brand Assets

This directory contains all brand identity and visual assets for the 24Toolkit application.

## Files

### Logo (`logo.svg`)
The main 24Toolkit logo featuring:
- A glowing circular ring with the number "24" inside
- Gradient colors from violet (#6D28D9) to sky blue (#38BDF8)
- "Toolkit" text in bold geometric sans-serif font
- Subtle glow effects for a modern, futuristic appearance
- Transparent background for flexible use

**Usage:**
```tsx
import logo from '@/assets/logo.svg'
// or use the Logo component
import Logo from '@/components/Logo'
```

### Favicon (`favicon.svg`)
A simplified version of the logo optimized for browser tabs:
- 32x32px square with dark background
- Centered "24" in gradient colors
- Glowing circular ring
- High contrast for visibility in small sizes

**Usage:**
The favicon is automatically loaded via the `index.html` file:
```html
<link rel="icon" type="image/svg+xml" href="/src/assets/favicon.svg" />
```

### OG Image (`og-image.svg`)
Social media preview image (1200x630px) featuring:
- Dark gradient background with motion wave effects
- Large 24Toolkit branding
- Subtitle: "80+ free online tools powered by AI"
- Category highlights (Text Tools, Image Tools, Dev Tools, AI Tools, Security, Calculators)
- Neon border with gradient glow
- Optimized for Twitter, Facebook, LinkedIn previews

**Usage:**
Automatically set in `index.html` meta tags:
```html
<meta property="og:image" content="/src/assets/og-image.svg">
<meta name="twitter:image" content="/src/assets/og-image.svg">
```

## Brand Colors

### Primary Gradient
- **Start:** Violet `#6D28D9` (oklch: 0.48 0.22 285)
- **End:** Sky Blue `#38BDF8` (oklch: 0.68 0.18 220)

### Usage in Code
```css
/* CSS */
background: linear-gradient(135deg, #6D28D9 0%, #38BDF8 100%);

/* Tailwind */
className="bg-gradient-to-r from-purple-600 to-sky-500"
```

### Theme Colors
The app supports three theme modes:
1. **Dark** (default) - Professional dark mode with purple/blue accents
2. **Cyber** - Neon green/pink cyberpunk aesthetic
3. **Minimal** - Clean light mode with subtle accents

## Typography

**Primary Font:** Inter (Google Fonts)
- Weights: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold), 800 (Extra-bold)
- Used throughout the application for UI elements and body text
- Loaded via Google Fonts in `index.html`

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

## Design Guidelines

### Logo Usage
- **Minimum size:** 120px width for web
- **Clear space:** Maintain at least 20px of clear space around the logo
- **Do not:** Distort, rotate, or change colors of the logo
- **Background:** Works best on dark backgrounds; ensure sufficient contrast on light backgrounds

### Gradients
All gradients should use the primary brand colors (violet to sky blue) unless specifically themed for a different mode (Cyber, Minimal).

### Effects
- **Glow:** Used sparingly for emphasis and interactivity
- **Glass morphism:** Frosted glass effect with backdrop blur
- **Neon:** Subtle neon glows on hover states and active elements

### Accessibility
- All text maintains WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Interactive elements have clear focus states
- Icons are paired with descriptive labels

## File Management

### Adding New Assets
1. Place image files in appropriate subdirectories:
   - `/src/assets/images/` - General images
   - `/src/assets/icons/` - Icon files (if needed)
   - Root `/src/assets/` - Brand assets (logo, favicon, og-image)

2. Import assets explicitly in code:
```tsx
import myImage from '@/assets/images/my-image.png'
<img src={myImage} alt="Description" />
```

### Optimization
- SVG files are preferred for logos and icons (scalable, small file size)
- PNG/JPG images should be optimized before adding
- Use appropriate formats: SVG for graphics, PNG for images with transparency, JPG for photos

## Legal

All brand assets are proprietary to 24Toolkit. Usage of the logo, name, and brand identity requires written permission. See [Terms of Service](/terms-of-service) for details.

---

**Last Updated:** January 2025
**Version:** 1.0.0
