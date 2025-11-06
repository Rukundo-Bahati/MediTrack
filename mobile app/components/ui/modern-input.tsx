import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';

interface ModernInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const ModernInput: React.FC<ModernInputProps> = ({
  label,
  error,
  hint,
  variant = 'outlined',
  size = 'medium',
  containerStyle,
  inputStyle,
  labelStyle,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      paddingHorizontal: size === 'small' ? 12 : size === 'large' ? 20 : 16,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1.5,
          borderColor: error 
            ? Colors.danger 
            : isFocused 
              ? Colors.primary 
              : Colors.border,
          backgroundColor: Colors.white,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: error 
            ? Colors.danger + '10' 
            : isFocused 
              ? Colors.primary + '08' 
              : Colors.backgroundSecondary,
          borderWidth: 0,
        };
      case 'underlined':
        return {
          ...baseStyle,
          borderRadius: 0,
          borderBottomWidth: 2,
          borderBottomColor: error 
            ? Colors.danger 
            : isFocused 
              ? Colors.primary 
              : Colors.border,
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getInputTextStyle = (): TextStyle => {
    return {
      ...Typography.body,
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      color: Colors.text,
      flex: 1,
      // Remove default TextInput styling
      borderWidth: 0,
      outline: 'none' as any, // For web
      outlineWidth: 0 as any, // For web
    };
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[
          Typography.label,
          { 
            marginBottom: Spacing.xs,
            color: error ? Colors.danger : Colors.text,
          },
          labelStyle
        ]}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        <TextInput
          {...textInputProps}
          style={[getInputTextStyle(), inputStyle]}
          placeholderTextColor={Colors.textSecondary}
          underlineColorAndroid="transparent"
          selectionColor={Colors.primary}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
        />
      </View>
      
      {(error || hint) && (
        <Text style={[
          Typography.caption,
          { 
            marginTop: Spacing.xs,
            color: error ? Colors.danger : Colors.textSecondary,
          }
        ]}>
          {error || hint}
        </Text>
      )}
    </View>
  );
};