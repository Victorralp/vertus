# Branding Update - Vertex Credit Union

## Changes Made

### 1. Logo Implementation
- Created `/public` directory
- Added Vertex Credit Union logo as `/public/vertex-logo.png`
- Logo is now used across all layouts (marketing, app, auth)

### 2. Loading Screen
- Created new `LoadingScreen` component at `/src/components/shared/loading-screen.tsx`
- Features animated logo with loading dots
- Integrated into app layout for authentication loading state
- Supports both light and dark themes

### 3. Branding Updates
All references to "NexusBank" have been replaced with "Vertex Credit Union" across:

#### Layouts
- Root layout metadata (title and description)
- Marketing layout (header, footer, mobile menu)
- App layout (sidebar logo)
- Auth layout (header and footer)

#### Pages
- Homepage (testimonials, FAQs, hero section)
- About page
- Contact page (email addresses)
- Legal pages (Privacy, Terms, Accessibility)
- Sign-up page
- Support page

#### Contact Information
- Email addresses updated to `@vertexcu.com` domain:
  - support@vertexcu.com
  - legal@vertexcu.com
  - privacy@vertexcu.com
  - accessibility@vertexcu.com
- Phone number updated to: 1-800-VERTEX-0

### 4. Configuration
- Updated `next.config.mjs` to properly handle images

## Testing
To verify the changes:
1. Run `npm run dev` in the `digital-banking-platform` directory
2. Visit the homepage to see the new logo
3. Navigate to different sections to verify branding consistency
4. Test the loading screen by signing in/out

## Files Modified
- `src/app/layout.tsx`
- `src/app/(marketing)/layout.tsx`
- `src/app/app/layout.tsx`
- `src/app/(auth)/layout.tsx`
- `src/app/(marketing)/page.tsx`
- `src/app/(marketing)/about/page.tsx`
- `src/app/(marketing)/contact/page.tsx`
- `src/app/(marketing)/legal/privacy/page.tsx`
- `src/app/(marketing)/legal/terms/page.tsx`
- `src/app/(marketing)/legal/accessibility/page.tsx`
- `src/app/(auth)/sign-up/page.tsx`
- `src/app/app/support/page.tsx`
- `next.config.mjs`

## Files Created
- `public/vertex-logo.png`
- `src/components/shared/loading-screen.tsx`
