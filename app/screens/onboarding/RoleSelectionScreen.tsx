import { Colors, RoleColors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { ArrowLeft, Building, Package, Shield, ShoppingCart } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeInDown,
  SlideInRight,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type StakeholderRole = 'manufacturer' | 'distributor' | 'pharmacist' | 'regulator';

interface RoleOption {
  id: StakeholderRole;
  title: string;
  description: string;
  icon: any;
  color: string;
  responsibilities: string[];
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'manufacturer',
    title: 'Manufacturer',
    description: 'Pharmaceutical companies producing medicines',
    icon: Package,
    color: RoleColors.manufacturer,
    responsibilities: [
      'Register new medicine batches',
      'Quality control and compliance',
      'Supply chain initiation',
    ],
  },
  {
    id: 'distributor',
    title: 'Distributor',
    description: 'Companies handling medicine logistics and transport',
    icon: ShoppingCart,
    color: RoleColors.distributor,
    responsibilities: [
      'Track shipments and inventory',
      'Manage cold chain compliance',
      'Update location and status',
    ],
  },
  {
    id: 'pharmacist',
    title: 'Pharmacist',
    description: 'Pharmacies and healthcare providers',
    icon: Building,
    color: RoleColors.pharmacist,
    responsibilities: [
      'Verify medicine authenticity',
      'Manage pharmacy inventory',
      'Ensure patient safety',
    ],
  },
  {
    id: 'regulator',
    title: 'Regulator',
    description: 'Government agencies and regulatory bodies',
    icon: Shield,
    color: RoleColors.regulator,
    responsibilities: [
      'Monitor market compliance',
      'Investigate quality issues',
      'Execute recalls and alerts',
    ],
  },
];

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<StakeholderRole | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleRoleSelect = (role: StakeholderRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/onboarding/wallet-setup?role=${selectedRole}` as any);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Back Button - Fixed at top */}
      <Animated.View
        entering={FadeInDown.delay(100)}
        style={styles.fixedHeader}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: selectedRole ? 120 : insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {/* Header Content - Now scrollable */}
        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.headerContent}
        >
          <Text style={styles.title}>Select Your Role</Text>
          <Text style={styles.subtitle}>
            Choose your role in the pharmaceutical supply chain
          </Text>
        </Animated.View>
        {/* Role Options */}
        <View style={styles.content}>
          {ROLE_OPTIONS.map((role, index) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <Animated.View
                key={role.id}
                entering={SlideInRight.delay(200 + index * 100)}
              >
                <TouchableOpacity
                  style={[
                    styles.roleCard,
                    isSelected && styles.roleCardSelected,
                    { borderColor: isSelected ? role.color : Colors.border }
                  ]}
                  onPress={() => handleRoleSelect(role.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.roleHeader}>
                    <View style={[styles.roleIcon, { backgroundColor: role.color + '15' }]}>
                      <Icon size={28} color={role.color} />
                    </View>
                    <View style={styles.roleInfo}>
                      <Text style={styles.roleTitle}>{role.title}</Text>
                      <Text style={styles.roleDescription}>{role.description}</Text>
                    </View>
                    {isSelected && (
                      <Animated.View
                        entering={BounceIn}
                        style={[styles.selectedIndicator, { backgroundColor: role.color }]}
                      >
                        <Shield size={16} color={Colors.white} />
                      </Animated.View>
                    )}
                  </View>

                  <View style={styles.responsibilities}>
                    {role.responsibilities.map((responsibility, idx) => (
                      <View key={idx} style={styles.responsibility}>
                        <View style={[styles.bullet, { backgroundColor: role.color }]} />
                        <Text style={styles.responsibilityText}>{responsibility}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

      </ScrollView>

      {/* Fixed Continue Button - Always visible when role selected */}
      {selectedRole && (
        <Animated.View
          entering={BounceIn.delay(600)}
          style={[styles.fixedFooter, { paddingBottom: insets.bottom + 20 }]}
        >
          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: ROLE_OPTIONS.find(r => r.id === selectedRole)?.color }
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue as {selectedRole}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  fixedHeader: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.layout.container,
    paddingVertical: Spacing.md,
    zIndex: 10,
    ...Shadows.subtle,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.subtle,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.layout.container,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.layout.container,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.xl,
  },
  roleCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  roleCardSelected: {
    ...Shadows.primary,
    elevation: 8,
    marginVertical: Spacing.xs,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    ...Typography.h3,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  responsibilities: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  responsibility: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
  },
  responsibilityText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.layout.container,
    paddingTop: Spacing.lg,
    ...Shadows.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  continueButton: {
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.primary,
    elevation: 6,
  },
  continueButtonText: {
    ...Typography.button,
    color: Colors.white,
    textTransform: 'capitalize',
    fontSize: 18,
    fontWeight: '700',
  },
});