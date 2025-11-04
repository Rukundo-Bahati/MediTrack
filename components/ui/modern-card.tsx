import { Colors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface ModernCardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled' | 'subtle' | 'primary';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  variant = 'elevated',
  padding = 'medium',
  style,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      overflow: 'hidden',
    };

    // Padding system
    const paddingValue = {
      none: 0,
      small: Spacing.base,
      medium: Spacing.component.padding,
      large: Spacing.lg,
    }[padding];

    const paddingStyle = { padding: paddingValue };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...paddingStyle,
          backgroundColor: Colors.white,
          ...Shadows.soft,
        };
      case 'outlined':
        return {
          ...baseStyle,
          ...paddingStyle,
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.border,
        };
      case 'filled':
        return {
          ...baseStyle,
          ...paddingStyle,
          backgroundColor: Colors.backgroundSecondary,
        };
      case 'subtle':
        return {
          ...baseStyle,
          ...paddingStyle,
          backgroundColor: Colors.primary + '05',
          borderWidth: 1,
          borderColor: Colors.primary + '10',
        };
      case 'primary':
        return {
          ...baseStyle,
          ...paddingStyle,
          backgroundColor: Colors.primary,
          ...Shadows.primary,
        };
      default:
        return { ...baseStyle, ...paddingStyle };
    }
  };

  return <View style={[getCardStyle(), style]}>{children}</View>;
};