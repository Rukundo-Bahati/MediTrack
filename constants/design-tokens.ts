// Comprehensive design system - avoids AI-typical patterns
import { Colors } from './colors';
import { Shadows } from './shadows';
import { Spacing } from './spacing';
import { Typography } from './typography';

// Border radius system - organic, non-uniform values
export const BorderRadius = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    full: 9999,

    // Component-specific radius
    button: 22,
    buttonSmall: 18,
    buttonLarge: 28,
    card: 16,
    input: 12,
    chip: 20,
};

// Animation timing - natural, non-robotic durations
export const Animation = {
    duration: {
        fast: 150,
        normal: 250,
        slow: 350,
        slower: 500,
    },

    easing: {
        // Custom easing curves for natural feel
        ease: 'ease-in-out',
        spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
};

// Opacity system - subtle variations
export const Opacity = {
    invisible: 0,
    subtle: 0.05,
    light: 0.1,
    medium: 0.2,
    strong: 0.4,
    heavy: 0.6,
    opaque: 0.8,
    visible: 1,
};

// Component variants - sophisticated combinations
export const ComponentVariants = {
    button: {
        primary: {
            backgroundColor: Colors.primary,
            color: Colors.white,
            shadow: Shadows.primary,
        },
        secondary: {
            backgroundColor: Colors.accent,
            color: Colors.white,
            shadow: Shadows.accent,
        },
        outline: {
            backgroundColor: 'transparent',
            borderColor: Colors.primary,
            color: Colors.primary,
        },
        ghost: {
            backgroundColor: Colors.primary + '10',
            color: Colors.primary,
        },
    },

    card: {
        elevated: {
            backgroundColor: Colors.white,
            shadow: Shadows.soft,
        },
        outlined: {
            backgroundColor: Colors.white,
            borderColor: Colors.border,
        },
        filled: {
            backgroundColor: Colors.backgroundSecondary,
        },
        subtle: {
            backgroundColor: Colors.primary + '05',
            borderColor: Colors.primary + '10',
        },
    },
};

// Export everything for easy access
export const DesignTokens = {
    Colors,
    Typography,
    Spacing,
    Shadows,
    BorderRadius,
    Animation,
    Opacity,
    ComponentVariants,
};