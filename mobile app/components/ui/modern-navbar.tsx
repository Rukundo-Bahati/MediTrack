import { ArrowLeft, Menu } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Shadows } from '../../constants/shadows';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface ModernNavbarProps {
  title?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  rightComponent?: React.ReactNode;
  variant?: 'default' | 'transparent';
}

export const ModernNavbar: React.FC<ModernNavbarProps> = ({
  title,
  showBackButton = false,
  showMenuButton = false,
  onBackPress,
  onMenuPress,
  rightComponent,
  variant = 'default',
}) => {
  const insets = useSafeAreaInsets();

  const getNavbarStyle = () => {
    const baseStyle = {
      paddingTop: insets.top + Spacing.md,
      paddingBottom: Spacing.lg,
      paddingHorizontal: Spacing.layout.container,
      marginBottom: Spacing.md,
    };

    switch (variant) {
      case 'transparent':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: Colors.white,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          ...Shadows.soft,
        };
    }
  };

  return (
    <View style={getNavbarStyle()}>
      <View style={styles.navbarContent}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={Colors.text} strokeWidth={2} />
            </TouchableOpacity>
          )}
          
          {showMenuButton && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onMenuPress}
              activeOpacity={0.7}
            >
              <Menu size={24} color={Colors.text} strokeWidth={2} />
            </TouchableOpacity>
          )}
          
          <View style={styles.appBranding}>
            <Text style={styles.appName}>MediTrack</Text>
            {title && <Text style={styles.screenTitle}>{title}</Text>}
          </View>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.subtle,
  },
  appBranding: {
    flex: 1,
  },
  appName: {
    ...Typography.h2,
    color: Colors.primary,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  screenTitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});