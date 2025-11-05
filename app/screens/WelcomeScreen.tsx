import { Colors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { Package, Scan, Shield, Users } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleConsumerPath = () => {
    router.push('/verify-medicine' as any);
  };

  const handleStakeholderPath = () => {
    router.push('/onboarding/role-selection' as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Package size={48} color={Colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>Welcome to MediTrack</Text>
          <Text style={styles.subtitle}>
            Blockchain-powered medicine verification
          </Text>
        </Animated.View>

        {/* Consumer Path - Primary Action */}
        <Animated.View
          entering={SlideInLeft.delay(400)}
          style={styles.pathContainer}
        >
          <TouchableOpacity
            style={[styles.pathCard, styles.primaryCard]}
            onPress={handleConsumerPath}
            activeOpacity={0.8}
          >
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>Most Popular</Text>
            </View>
            <Animated.View
              entering={BounceIn.delay(600)}
              style={styles.primaryIcon}
            >
              <Scan size={40} color={Colors.white} />
            </Animated.View>
            <Text style={styles.primaryTitle}>Verify Medicine</Text>
            <Text style={styles.primaryDescription}>
              Instantly verify any medicine's authenticity with our blockchain-powered scanner
            </Text>
            <View style={styles.primaryFeatures}>
              <View style={styles.primaryFeature}>
                <Shield size={18} color={Colors.white} />
                <Text style={styles.primaryFeatureText}>No registration needed</Text>
              </View>
              <View style={styles.primaryFeature}>
                <Scan size={18} color={Colors.white} />
                <Text style={styles.primaryFeatureText}>Instant results</Text>
              </View>
            </View>
          </TouchableOpacity>
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

        {/* Stakeholder Path - Secondary Action */}
        <Animated.View
          entering={SlideInRight.delay(700)}
          style={styles.pathContainer}
        >
          <TouchableOpacity
            style={[styles.pathCard, styles.secondaryCard]}
            onPress={handleStakeholderPath}
            activeOpacity={0.8}
          >
            <View style={styles.secondaryHeader}>
              <Animated.View
                entering={BounceIn.delay(800)}
                style={styles.secondaryIcon}
              >
                <Users size={28} color={Colors.primary} />
              </Animated.View>
              <View style={styles.secondaryTitleContainer}>
                <Text style={styles.secondaryTitle}>Industry Professional</Text>
                <Text style={styles.secondarySubtitle}>Manufacturers • Distributors • Pharmacists • Regulators</Text>
              </View>
            </View>
            <View style={styles.secondaryFeatures}>
              <View style={styles.secondaryFeature}>
                <Package size={16} color={Colors.primary} />
                <Text style={styles.secondaryFeatureText}>Register & track medicine batches</Text>
              </View>
              <View style={styles.secondaryFeature}>
                <Shield size={16} color={Colors.primary} />
                <Text style={styles.secondaryFeatureText}>Secure blockchain transactions</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <Animated.View
          entering={FadeInUp.delay(1000)}
          style={styles.footer}
        >
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>
              Protecting lives through blockchain technology
            </Text>
          </View>
          <View style={styles.footerSubtextContainer}>
            <Text style={styles.footerSubtext}>
              Secure • Transparent • Decentralized
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.layout.container,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  pathContainer: {
    marginVertical: Spacing.lg,
  },
  pathCard: {
    borderRadius: 20,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  
  // Primary Card (Consumer) - Hero Style
  primaryCard: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    position: 'relative',
    paddingTop: Spacing.xl + Spacing.md,
  },
  primaryBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    ...Shadows.medium,
  },
  primaryBadgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
  primaryIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  primaryTitle: {
    ...Typography.h2,
    color: Colors.white,
    marginBottom: Spacing.md,
    textAlign: 'center',
    fontWeight: '700',
  },
  primaryDescription: {
    ...Typography.body,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 24,
    opacity: 0.95,
  },
  primaryFeatures: {
    alignSelf: 'stretch',
    gap: Spacing.md,
  },
  primaryFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
  },
  primaryFeatureText: {
    ...Typography.bodyMedium,
    color: Colors.white,
    fontWeight: '600',
  },

  // Secondary Card (Professional) - Compact Style
  secondaryCard: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary + '20',
  },
  secondaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  secondaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  secondaryTitleContainer: {
    flex: 1,
  },
  secondaryTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  secondarySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  secondaryFeatures: {
    gap: Spacing.sm,
  },
  secondaryFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  secondaryFeatureText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    marginTop: Spacing.lg,
  },
  footerTextContainer: {
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  footerSubtextContainer: {
    paddingHorizontal: Spacing.md,
  },
  footerSubtext: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.6,
  },
});