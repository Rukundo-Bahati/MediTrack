import { Colors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface EnhancedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'primary' | 'accent';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function EnhancedCard({
  children,
  variant = 'default',
  padding = 'medium',
  style,
}: EnhancedCardProps) {
  const getCardStyle = () => {
    const baseStyle = [styles.card, styles[padding]];
    
    switch (variant) {
      case 'elevated':
        baseStyle.push(styles.elevated);
        break;
      case 'outlined':
        baseStyle.push(styles.outlined);
        break;
      case 'primary':
        baseStyle.push(styles.primary);
        break;
      case 'accent':
        baseStyle.push(styles.accent);
        break;
      default:
        baseStyle.push(styles.default);
    }
    
    return baseStyle;
  };

  return (
    <View style={[...getCardStyle(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
  },
  
  // Padding variants
  none: {
    padding: 0,
  },
  small: {
    padding: 12,
  },
  medium: {
    padding: 16,
  },
  large: {
    padding: 20,
  },
  
  // Style variants
  default: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  elevated: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  outlined: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  primary: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  accent: {
    backgroundColor: Colors.accent + '10',
    borderWidth: 1,
    borderColor: Colors.accent + '20',
  },
});