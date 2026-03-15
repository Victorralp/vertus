# Vertex Credit Union - Brand Guidelines

## Brand Identity

### Logo
**Primary Logo**: `/public/vertex-logo.png`

**Usage Rules**:
- Minimum size: 120px width
- Clear space: Maintain 20px padding around logo
- Do not stretch or distort
- Do not add effects or filters (except dark mode inversion)

### Color Palette

#### Primary Colors
```css
/* Emerald Green - Primary Brand Color */
--emerald-50: #ecfdf5
--emerald-100: #d1fae5
--emerald-500: #10b981
--emerald-600: #059669
--emerald-700: #047857

/* Teal - Secondary Brand Color */
--teal-50: #f0fdfa
--teal-500: #14b8a6
--teal-600: #0d9488
--teal-700: #0f766e
```

#### Neutral Colors
```css
/* Light Mode */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-500: #6b7280
--gray-900: #111827

/* Dark Mode */
--gray-800: #1f2937
--gray-900: #111827
--gray-950: #030712
```

#### Accent Colors
```css
/* Success */
--green-500: #22c55e

/* Warning */
--amber-500: #f59e0b

/* Error */
--red-500: #ef4444

/* Info */
--blue-500: #3b82f6
--blue-600: #2563eb
--cyan-500: #06b6d4
```

### Typography

#### Font Families
```css
/* Primary Font - Geist Sans */
font-family: var(--font-geist-sans), system-ui, -apple-system, sans-serif;

/* Monospace Font - Geist Mono */
font-family: var(--font-geist-mono), 'Courier New', monospace;
```

#### Font Sizes
```css
/* Headings */
--text-4xl: 2.25rem (36px)
--text-3xl: 1.875rem (30px)
--text-2xl: 1.5rem (24px)
--text-xl: 1.25rem (20px)

/* Body */
--text-lg: 1.125rem (18px)
--text-base: 1rem (16px)
--text-sm: 0.875rem (14px)
--text-xs: 0.75rem (12px)
```

#### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Gradients

#### Primary Gradient
```css
background: linear-gradient(to right, #10b981, #14b8a6);
/* from-emerald-500 to-teal-600 */
```

#### Hero Gradient
```css
background: linear-gradient(to bottom right, #ecfdf5, #f0fdfa, #cffafe);
/* from-emerald-50 via-teal-50 to-cyan-50 */
```

#### Dark Gradient
```css
background: linear-gradient(to bottom right, #030712, #111827, #030712);
/* from-gray-950 via-gray-900 to-gray-950 */
```

### Spacing

#### Standard Spacing Scale
```css
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-12: 3rem (48px)
--space-16: 4rem (64px)
```

### Border Radius

```css
--radius-sm: 0.375rem (6px)
--radius-md: 0.5rem (8px)
--radius-lg: 0.75rem (12px)
--radius-xl: 1rem (16px)
--radius-2xl: 1.5rem (24px)
--radius-full: 9999px
```

### Shadows

```css
/* Light Mode */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)

/* Dark Mode */
--shadow-dark: 0 10px 15px -3px rgb(0 0 0 / 0.5)
```

## Component Styles

### Buttons

#### Primary Button
```css
background: linear-gradient(to right, #10b981, #14b8a6);
color: white;
padding: 0.5rem 1rem;
border-radius: 0.5rem;
font-weight: 500;
```

#### Secondary Button
```css
background: transparent;
border: 1px solid #d1d5db;
color: #374151;
padding: 0.5rem 1rem;
border-radius: 0.5rem;
```

### Cards
```css
background: white;
border: 1px solid #e5e7eb;
border-radius: 1rem;
padding: 1.5rem;
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
```

### Inputs
```css
background: white;
border: 1px solid #d1d5db;
border-radius: 0.5rem;
padding: 0.5rem 0.75rem;
font-size: 0.875rem;
```

## Dark Mode

### Background Colors
```css
--bg-primary: #0a0e13
--bg-secondary: #0f1419
--bg-tertiary: #1f2937
```

### Text Colors
```css
--text-primary: #ffffff
--text-secondary: #d1d5db
--text-tertiary: #9ca3af
```

### Border Colors
```css
--border-primary: #374151
--border-secondary: #1f2937
```

## Accessibility

### Contrast Ratios
- Normal text: Minimum 4.5:1
- Large text: Minimum 3:1
- UI components: Minimum 3:1

### Focus States
```css
outline: 2px solid #10b981;
outline-offset: 2px;
```

### Interactive Elements
- Minimum touch target: 44×44px
- Visible focus indicators
- Keyboard navigation support

## Animation

### Transitions
```css
/* Standard */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth */
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Animations
```css
/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Bounce */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25%); }
}
```

## Iconography

### Icon Library
**Lucide React** - Consistent, modern icon set

### Icon Sizes
```css
--icon-xs: 1rem (16px)
--icon-sm: 1.25rem (20px)
--icon-md: 1.5rem (24px)
--icon-lg: 2rem (32px)
--icon-xl: 2.5rem (40px)
```

### Icon Colors
- Primary actions: Emerald-600
- Secondary actions: Gray-500
- Danger actions: Red-500
- Success states: Green-500

## Responsive Breakpoints

```css
/* Mobile First */
--screen-sm: 640px
--screen-md: 768px
--screen-lg: 1024px
--screen-xl: 1280px
--screen-2xl: 1536px
```

## Voice & Tone

### Brand Voice
- **Professional** yet approachable
- **Confident** but not arrogant
- **Clear** and concise
- **Helpful** and supportive
- **Modern** and forward-thinking

### Writing Guidelines
- Use active voice
- Keep sentences short and clear
- Avoid jargon when possible
- Be direct and honest
- Show empathy for user needs

### Example Phrases
✅ "Your account is secure"
✅ "Transfer completed successfully"
✅ "We're here to help"
✅ "Get started in minutes"

❌ "Your account has been secured by our system"
❌ "The transfer process has been completed"
❌ "Our support team is available"
❌ "The onboarding process is quick"

## Contact Information

### Official Channels
- **Website**: https://vertexcu.com
- **Support**: support@vertexcu.com
- **Legal**: legal@vertexcu.com
- **Privacy**: privacy@vertexcu.com
- **Accessibility**: accessibility@vertexcu.com
- **Phone**: 1-800-VERTEX-0

### Social Media
- Use consistent branding across all platforms
- Profile picture: Vertex logo on white background
- Cover images: Use brand gradients and colors

## File Naming Conventions

### Images
```
vertex-logo.png
vertex-logo-white.png
vertex-icon-192.png
vertex-icon-512.png
```

### Components
```
PascalCase for React components
kebab-case for CSS files
camelCase for JavaScript/TypeScript
```

## Version History

- **v1.0** - January 29, 2026 - Initial brand guidelines
  - Logo implementation
  - Color palette definition
  - Typography standards
  - Component styles
  - Accessibility requirements

---

*These guidelines ensure consistent brand representation across all Vertex Credit Union digital properties.*
