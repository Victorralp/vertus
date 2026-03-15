# Vertex Credit Union - Logo Usage Guide

## Logo Location
The primary logo file is located at:
```
/public/vertex-logo.png
```

## Logo Implementations

### 1. Marketing Pages (Public Website)
**Location:** Header, Footer, Mobile Menu

**Light Mode:**
```tsx
<img
  src="/vertex-logo.png"
  alt="Vertex Credit Union"
  className="h-full w-full object-contain"
/>
```

**Dark Mode (Footer):**
```tsx
<img
  src="/vertex-logo.png"
  alt="Vertex Credit Union"
  className="h-full w-full object-contain brightness-0 invert"
/>
```

### 2. App Dashboard (Authenticated Area)
**Location:** Sidebar Logo

**Implementation:**
```tsx
<img
  src="/vertex-logo.png"
  alt="Vertex Credit Union"
  className="h-full w-full object-contain brightness-0 invert"
/>
```
- Always displays in white (inverted) for dark sidebar

### 3. Authentication Pages
**Location:** Sign-in, Sign-up, Reset Password, Verify Email

**Implementation:**
```tsx
<img
  src="/vertex-logo.png"
  alt="Vertex Credit Union"
  className="h-full w-full object-contain"
/>
```

### 4. Loading Screen
**Location:** App authentication loading state

**Implementation:**
```tsx
<Image
  src="/vertex-logo.png"
  alt="Vertex Credit Union"
  fill
  className="object-contain"
  priority
/>
```
- Uses Next.js Image component for optimization
- Includes pulse animation
- Priority loading for better UX

## Responsive Sizing

### Desktop
- Header: `h-10 w-40` (40px height, 160px width)
- Footer: `h-10 w-40`
- Sidebar: `h-10 w-40`
- Loading Screen: `w-64 h-32` (256px width, 128px height)

### Mobile
- Same dimensions, responsive container handles scaling

## Dark Mode Handling

The logo automatically adapts to dark mode using:
- `brightness-0 invert` - Converts logo to white for dark backgrounds
- No filter - Original colors for light backgrounds

## Accessibility
- All logo images include proper `alt` text: "Vertex Credit Union"
- Semantic HTML with proper link structure
- Keyboard navigation support

## Performance Optimization
- Logo is served from `/public` directory (static asset)
- Next.js automatically optimizes images
- Loading screen uses `priority` flag for immediate loading
- No external CDN dependencies

## Future Enhancements
Consider adding:
1. SVG version for better scaling
2. Favicon versions (16x16, 32x32, 180x180)
3. Apple touch icon
4. PWA icons (192x192, 512x512)
5. Open Graph image for social sharing
