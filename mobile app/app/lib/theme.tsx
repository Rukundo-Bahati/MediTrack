import React from 'react';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const DESIGN = {
  colors: {
    // Trust & safety palette (orange theme)
    primary: '#fc7f03',        // Primary orange
    onPrimary: '#FFFFFF',
    primaryContainer: '#FFF3E0',
    onPrimaryContainer: '#E65100',

    accent: '#f56a20',         // Secondary orange (matches app theme)
    onAccent: '#FFFFFF',
    accentContainer: '#FFF3E0',

    danger: '#DC3545',         // Alert red
    onDanger: '#FFFFFF',
    dangerContainer: '#FFEBEE',

    warning: '#FFC107',        // Warning yellow
    info: '#17A2B8',           // Info cyan

    surface: '#FFFFFF',
    onSurface: '#1A1A1A',
    surfaceVariant: '#F5F5F5',
    onSurfaceVariant: '#666666',

    background: '#FAFBFC',
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    muted: '#999999',

    outline: '#E0E0E0',
    errorOutline: '#DC3545',
    successOutline: '#f56a20',

    scrim: 'rgba(0, 0, 0, 0.5)',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radii: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
    round: 50,
  },

  shadows: {
    sm: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
    },
    md: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
    lg: {
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
    },
  },

  typography: {
    displayLarge: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
    displayMedium: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
    displaySmall: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
    headlineLarge: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
    headlineMedium: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
    headlineSmall: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    titleLarge: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
    titleMedium: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
    titleSmall: { fontSize: 12, fontWeight: '600', lineHeight: 18 },
    bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    bodyMedium: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    bodySmall: { fontSize: 12, fontWeight: '400', lineHeight: 18 },
    labelLarge: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
    labelMedium: { fontSize: 11, fontWeight: '500', lineHeight: 14 },
    labelSmall: { fontSize: 10, fontWeight: '500', lineHeight: 12 },
  },

  transitions: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: DESIGN.colors.primary,
    onPrimary: DESIGN.colors.onPrimary,
    secondary: DESIGN.colors.accent,
    onSecondary: DESIGN.colors.onAccent,
    error: DESIGN.colors.danger,
    onError: DESIGN.colors.onDanger,
    surface: DESIGN.colors.surface,
    onSurface: DESIGN.colors.onSurface,
    background: DESIGN.colors.background,
    outline: DESIGN.colors.outline,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#fc7f03',
    secondary: '#f56a20',
    error: '#FF6B7A',
    surface: '#1E1E1E',
    background: '#121212',
  },
};

export function useThemeContext() {
  return {
    isDark: false,
    theme: lightTheme,
    DESIGN,
  };
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeContext();
  const PaperProvider = require('react-native-paper').PaperProvider;
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}