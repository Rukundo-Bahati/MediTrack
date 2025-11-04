import { ModernButton, ScreenLayout } from '@/components/ui';
import { Colors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { Package } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleScanPress = () => {
    router.push('/verify-medicine' as any);
  };

  const handleBusinessLogin = () => {
    router.push('/login' as any);
  };

  const handleBusinessRegister = () => {
    router.push('/register' as any);
  };

  return (
    <ScreenLayout style={styles.container}>
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(200)}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <Package size={40} color={Colors.primary} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>Welcome to MediTrack</Text>
        <Text style={styles.subtitle}>Choose how you'd like to continue</Text>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Consumer Section */}
        <Animated.View
          entering={SlideInLeft.delay(400)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>For Consumers</Text>
          <Text style={styles.sectionDescription}>
            Verify medicine authenticity instantly
          </Text>

          <Animated.View entering={BounceIn.delay(600)}>
            <ModernButton
              title="Scan Medicine"
              onPress={handleScanPress}
              variant="primary"
              size="large"
              style={styles.scanButton}
            />
          </Animated.View>
        </Animated.View>

        {/* Divider */}
        <Animated.View
          entering={FadeInUp.delay(500)}
          style={styles.divider}
        >
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </Animated.View>

        {/* Business Section */}
        <Animated.View
          entering={SlideInRight.delay(700)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>For Businesses</Text>
          <Text style={styles.sectionDescription}>
            Manufacturers, Distributors, Pharmacies & Regulators
          </Text>

          <View style={styles.businessButtons}>
            <Animated.View entering={BounceIn.delay(800)}>
              <ModernButton
                title="Login"
                onPress={handleBusinessLogin}
                variant="outline"
                size="medium"
                style={styles.businessButton}
              />
            </Animated.View>

            <Animated.View entering={BounceIn.delay(900)}>
              <ModernButton
                title="Register"
                onPress={handleBusinessRegister}
                variant="outline"
                size="medium"
                style={styles.businessButton}
              />
            </Animated.View>
          </View>
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View
        entering={FadeInUp.delay(1000)}
        style={styles.footer}
      >
        <Text style={styles.footerText}>
          Protecting lives through blockchain technology
        </Text>
      </Animated.View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingVertical: Spacing.md,
  },
  section: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  sectionDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  scanButton: {
    minWidth: 200,
    backgroundColor: Colors.accent,
    ...Shadows.accent,
  },
  businessButton: {
    minWidth: 120,
  },
  businessButtons: {
    flexDirection: 'row',
    gap: Spacing.component.gap,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  dividerText: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.component.padding,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
});