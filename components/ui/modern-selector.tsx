import { Colors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import React from 'react';
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface SelectorOption {
  value: string;
  label: string;
  description?: string;
  color?: string;
}

interface ModernSelectorProps {
  options: SelectorOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  variant?: 'grid' | 'list' | 'chips';
  columns?: number;
  style?: ViewStyle;
}

export const ModernSelector: React.FC<ModernSelectorProps> = ({
  options,
  selectedValue,
  onSelect,
  variant = 'grid',
  columns = 2,
  style,
}) => {
  const renderOption = (option: SelectorOption) => {
    const isSelected = selectedValue === option.value;
    
    const getOptionStyle = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        borderRadius: variant === 'chips' ? 20 : 12,
        borderWidth: 1.5,
        borderColor: isSelected 
          ? (option.color || Colors.primary)
          : Colors.border,
        backgroundColor: isSelected 
          ? (option.color || Colors.primary) + '08'
          : Colors.white,
        ...(isSelected && variant !== 'chips' && Shadows.subtle),
      };

      switch (variant) {
        case 'grid':
          return {
            ...baseStyle,
            flex: 1,
            minWidth: `${100 / columns - 2}%`,
            padding: Spacing.component.padding,
            alignItems: 'center',
            margin: Spacing.xs / 2,
          };
        case 'list':
          return {
            ...baseStyle,
            padding: Spacing.component.padding,
            marginVertical: Spacing.xs,
            flexDirection: 'row',
            alignItems: 'center',
          };
        case 'chips':
          return {
            ...baseStyle,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            marginRight: Spacing.sm,
            marginBottom: Spacing.sm,
          };
        default:
          return baseStyle;
      }
    };

    const getLabelStyle = (): TextStyle => ({
      ...Typography.label,
      color: isSelected 
        ? (option.color || Colors.primary)
        : Colors.text,
      fontWeight: isSelected ? '700' : '600',
    });

    const getDescriptionStyle = (): TextStyle => ({
      ...Typography.caption,
      color: Colors.textSecondary,
      marginTop: variant === 'grid' ? Spacing.xs : 0,
      marginLeft: variant === 'list' ? Spacing.sm : 0,
    });

    return (
      <TouchableOpacity
        key={option.value}
        style={getOptionStyle()}
        onPress={() => onSelect(option.value)}
        activeOpacity={0.7}
      >
        {/* Color indicator for options with custom colors */}
        {option.color && variant !== 'chips' && (
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: option.color,
              marginBottom: variant === 'grid' ? Spacing.xs : 0,
              marginRight: variant === 'list' ? Spacing.sm : 0,
            }}
          />
        )}
        
        <View style={variant === 'list' ? { flex: 1 } : {}}>
          <Text style={getLabelStyle()}>{option.label}</Text>
          {option.description && (
            <Text style={getDescriptionStyle()}>{option.description}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'grid':
        return {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        };
      case 'list':
        return {};
      case 'chips':
        return {
          flexDirection: 'row',
          flexWrap: 'wrap',
        };
      default:
        return {};
    }
  };

  return (
    <View style={[getContainerStyle(), style]}>
      {options.map(renderOption)}
    </View>
  );
};