/**
 * Theme Configuration
 * Centralized color scheme for consistent styling
 */

export const theme = {
  colors: {
    primary: '#00b4ff',
    primaryDark: '#0066cc',
    bgPrimary: '#040d1a',
    bgSecondary: '#0d1f2d',
    bgCard: '#0a1f3d',
    textPrimary: '#e8f4ff',
    textSecondary: '#a8c5dd',
    border: '#1a3a52',
    success: '#4caf50',
    warning: '#ff9800',
    danger: '#f44336',
    error: '#ff4060',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  typography: {
    h1: { fontSize: 28, fontWeight: '700' as const },
    h2: { fontSize: 24, fontWeight: '700' as const },
    h3: { fontSize: 20, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    bodySmall: { fontSize: 14, fontWeight: '400' as const },
    label: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase' as const },
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export type Theme = typeof theme;
