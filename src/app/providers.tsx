'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

/**
 * ThemeProvider component that wraps the application with theme management capabilities.
 * 
 * This component uses next-themes to provide:
 * - Theme state management (light, dark, system)
 * - localStorage persistence
 * - System preference detection
 * - Prevention of flash of unstyled content (FOUC)
 * 
 * @param children - React children to be wrapped with theme context
 * @param props - Additional ThemeProvider configuration options
 * 
 * @example
 * ```tsx
 * <ThemeProvider
 *   attribute="class"
 *   defaultTheme="system"
 *   enableSystem
 * >
 *   {children}
 * </ThemeProvider>
 * ```
 * 
 * **Validates: Requirements 7.3**
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
