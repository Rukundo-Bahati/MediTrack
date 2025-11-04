import { Colors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Typography } from '@/constants/typography';
import React from 'react';
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: size === 'small' ? 18 : size === 'large' ? 28 : 22,
      paddingHorizontal: size === 'small' ? 16 : size === 'large' ? 32 : 24,
      paddingVertical: size === 'small' ? 10 : size === 'large' ? 16 : 13,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.borderLight : Colors.primary,
          ...(!disabled && Shadows.primary),
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.borderLight : Colors.accent,
          ...(!disabled && Shadows.accent),
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: disabled ? Colors.borderLight : Colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: disabled ? 'transparent' : Colors.primary + '10',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = size === 'small' ? Typography.buttonSmall : Typography.button;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          ...baseTextStyle,
          color: disabled ? Colors.textSecondary : Colors.white,
        };
      case 'outline':
      case 'ghost':
        return {
          ...baseTextStyle,
          color: disabled ? Colors.textSecondary : Colors.primary,
        };
      default:
        return baseTextStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? Colors.white : Colors.primary} 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};