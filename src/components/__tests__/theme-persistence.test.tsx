import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@/app/providers'
import { useTheme } from 'next-themes'
import { act } from 'react'

/**
 * Test Component to access theme state
 */
function ThemeTestComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="resolved-theme">{resolvedTheme}</div>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme('system')} data-testid="set-system">
        Set System
      </button>
    </div>
  )
}

describe('Theme localStorage Persistence - Task 5.1', () => {
  let localStorageData: Record<string, string> = {}

  beforeEach(() => {
    // Reset localStorage mock before each test
    localStorageData = {}
    
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageData[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageData[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageData[key]
      }),
      clear: vi.fn(() => {
        localStorageData = {}
      }),
      length: 0,
      key: vi.fn(),
    } as Storage
  })

  /**
   * **Validates: Requirement 2.1**
   * Test that theme selection writes to localStorage with key "theme"
   */
  it('should write theme selection to localStorage with key "theme"', async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeTestComponent />
      </ThemeProvider>
    )

    // Wait for component to mount
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toBeInTheDocument()
    })

    // Set theme to light
    const lightButton = screen.getByTestId('set-light')
    await act(async () => {
      lightButton.click()
    })

    // Verify localStorage.setItem was called with key "theme"
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light')
    })

    // Verify the value is stored
    expect(localStorageData['theme']).toBe('light')

    // Set theme to dark
    const darkButton = screen.getByTestId('set-dark')
    await act(async () => {
      darkButton.click()
    })

    // Verify localStorage.setItem was called with key "theme" and value "dark"
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
    })

    expect(localStorageData['theme']).toBe('dark')
  })

  /**
   * **Validates: Requirement 2.2**
   * Test that stored theme is retrieved on application load
   */
  it('should retrieve stored theme from localStorage on application load', async () => {
    // Pre-populate localStorage with a theme preference
    localStorageData['theme'] = 'dark'

    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeTestComponent />
      </ThemeProvider>
    )

    // Verify localStorage.getItem was called
    expect(localStorage.getItem).toHaveBeenCalledWith('theme')

    // Wait for theme to be applied
    await waitFor(() => {
      const themeElement = screen.getByTestId('current-theme')
      expect(themeElement.textContent).toBe('dark')
    })
  })

  /**
   * **Validates: Requirement 2.3**
   * Test that stored theme is applied before rendering content
   */
  it('should apply stored theme before rendering content', async () => {
    // Pre-populate localStorage with light theme
    localStorageData['theme'] = 'light'

    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeTestComponent />
      </ThemeProvider>
    )

    // The theme should be retrieved immediately
    expect(localStorage.getItem).toHaveBeenCalledWith('theme')

    // Wait for the theme to be applied
    await waitFor(() => {
      const themeElement = screen.getByTestId('current-theme')
      expect(themeElement.textContent).toBe('light')
    })
  })

  /**
   * **Validates: Requirements 2.1, 2.2**
   * Test that next-themes handles storage automatically for all theme values
   */
  it('should handle storage automatically for light, dark, and system themes', async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeTestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toBeInTheDocument()
    })

    // Test light theme
    await act(async () => {
      screen.getByTestId('set-light').click()
    })

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light')
      expect(localStorageData['theme']).toBe('light')
    })

    // Test dark theme
    await act(async () => {
      screen.getByTestId('set-dark').click()
    })

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
      expect(localStorageData['theme']).toBe('dark')
    })

    // Test system theme
    await act(async () => {
      screen.getByTestId('set-system').click()
    })

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'system')
      expect(localStorageData['theme']).toBe('system')
    })
  })

  /**
   * **Validates: Requirement 2.4**
   * Test that when no stored preference exists, system defaults to system preference
   */
  it('should default to system preference when no stored preference exists', async () => {
    // Ensure localStorage is empty
    localStorageData = {}

    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeTestComponent />
      </ThemeProvider>
    )

    // localStorage.getItem should be called but return null
    expect(localStorage.getItem).toHaveBeenCalledWith('theme')

    // Wait for theme to be set to default
    await waitFor(() => {
      const themeElement = screen.getByTestId('current-theme')
      // Should default to 'system' when no stored preference
      expect(themeElement.textContent).toBe('system')
    })
  })

  /**
   * **Validates: Requirements 2.1, 2.2**
   * Test round-trip: store and retrieve theme preference
   */
  it('should successfully round-trip theme preference through localStorage', async () => {
    // First render: set a theme
    const { unmount } = render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeTestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toBeInTheDocument()
    })

    // Set theme to dark
    await act(async () => {
      screen.getByTestId('set-dark').click()
    })

    await waitFor(() => {
      expect(localStorageData['theme']).toBe('dark')
    })

    // Unmount the component
    unmount()

    // Second render: verify theme is retrieved
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeTestComponent />
      </ThemeProvider>
    )

    // Verify the stored theme is retrieved and applied
    await waitFor(() => {
      const themeElement = screen.getByTestId('current-theme')
      expect(themeElement.textContent).toBe('dark')
    })
  })
})
