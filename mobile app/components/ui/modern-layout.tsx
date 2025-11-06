import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import React from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ModernLayoutProps {
  children: React.ReactNode;
  variant?: 'screen' | 'section' | 'container';
  scrollable?: boolean;
  padding?: boolean;
  style?: ViewStyle;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({
  children,
  variant = 'screen',
  scrollable = false,
  padding = true,
  style,
}) => {
  const insets = useSafeAreaInsets();

  const getLayoutStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
    };

    switch (variant) {
      case 'screen':
        return {
          ...baseStyle,
          backgroundColor: Colors.backgroundSecondary,
          paddingBottom: insets.bottom,
          paddingHorizontal: padding ? Spacing.layout.screen : 0,
        };
      case 'section':
        return {
          ...baseStyle,
          paddingVertical: Spacing.layout.section,
          paddingHorizontal: padding ? Spacing.layout.container : 0,
        };
      case 'container':
        return {
          ...baseStyle,
          paddingHorizontal: padding ? Spacing.layout.container : 0,
        };
      default:
        return baseStyle;
    }
  };

  const layoutStyle = [getLayoutStyle(), style];

  if (scrollable) {
    return (
      <ScrollView 
        style={layoutStyle}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={layoutStyle}>{children}</View>;
};

// Specialized layout components
export const ScreenLayout: React.FC<Omit<ModernLayoutProps, 'variant'>> = (props) => (
  <ModernLayout {...props} variant="screen" />
);

export const SectionLayout: React.FC<Omit<ModernLayoutProps, 'variant'>> = (props) => (
  <ModernLayout {...props} variant="section" />
);

export const ContainerLayout: React.FC<Omit<ModernLayoutProps, 'variant'>> = (props) => (
  <ModernLayout {...props} variant="container" />
);