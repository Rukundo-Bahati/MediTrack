import { ModernNavbar } from '@/components/ui';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  History as HistoryIcon,
  Package,
  ScanLine
} from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModernCard } from '../../../components/ui/modern-card';
import { ScreenLayout } from '../../../components/ui/modern-layout';
import { Colors } from '../../../constants/colors';
import { Shadows } from '../../../constants/shadows';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../context/AuthContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function PharmacistHome() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const primaryActions = [
    {
      id: 'scan-validate',
      title: 'Scan & Validate',
      description: 'Verify medicine authenticity and check expiry',
      icon: ScanLine,
      color: Colors.primary,
      route: '/scan',
    },
    {
      id: 'verification-history',
      title: 'Verification History',
      description: 'View past scans and verification records',
      icon: HistoryIcon,
      color: Colors.accent,
      route: '/verification-history',
    },
  ];

  const inventoryItems = [
    { id: 'I001', name: 'Paracetamol 500mg', stock: 150, status: 'In Stock', expiry: '2025-06-15' },
    { id: 'I002', name: 'Amoxicillin 250mg', stock: 45, status: 'Low Stock', expiry: '2025-03-20' },
    { id: 'I003', name: 'Ibuprofen 400mg', stock: 89, status: 'In Stock', expiry: '2025-08-10' },
  ];

  return (
    <View style={styles.container}>
      <ModernNavbar title="Pharmacy Dashboard" />
      <ScreenLayout scrollable style={styles.scrollContainer}>

      {/* Stats */}
      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.statsContainer}
      >
        <Animated.View entering={SlideInRight.delay(300)}>
          <ModernCard variant="elevated" style={styles.statCard}>
            <Package size={24} color={Colors.primary} />
            <Text style={styles.statNumber}>284</Text>
            <Text style={styles.statLabel}>Medicines Verified</Text>
          </ModernCard>
        </Animated.View>
        <Animated.View entering={SlideInRight.delay(400)}>
          <ModernCard variant="elevated" style={styles.statCard}>
            <AlertTriangle size={24} color={Colors.warning} />
            <Text style={[styles.statNumber, { color: Colors.warning }]}>12</Text>
            <Text style={styles.statLabel}>Suspicious Found</Text>
          </ModernCard>
        </Animated.View>
      </Animated.View>

      {/* Key Actions */}
      <Animated.View 
        entering={FadeInDown.delay(500)}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Key Actions</Text>
        <View style={styles.actionsGrid}>
          {primaryActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Animated.View
                key={action.id}
                entering={SlideInRight.delay(600 + index * 100)}
              >
                <TouchableOpacity
                  onPress={() => router.push(action.route as any)}
                  activeOpacity={0.7}
                >
                  <ModernCard variant="elevated" style={styles.actionCard}>
                    <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                      <Icon size={28} color={action.color} strokeWidth={2} />
                    </View>
                    <View style={styles.actionContent}>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionDescription}>{action.description}</Text>
                    </View>
                  </ModernCard>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>

      {/* Recent Verifications */}
      <Animated.View 
        entering={FadeInDown.delay(800)}
        style={styles.section}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Verifications</Text>
          <TouchableOpacity onPress={() => router.push('/verification-history' as any)}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.verificationsList}>
          {inventoryItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={SlideInRight.delay(900 + index * 100)}
            >
              <ModernCard variant="elevated" style={styles.verificationCard}>
                <View style={styles.verificationHeader}>
                  <View style={styles.verificationIcon}>
                    <Package size={20} color={Colors.accent} />
                  </View>
                  <View style={styles.verificationInfo}>
                    <Text style={styles.verificationName}>{item.name}</Text>
                    <Text style={styles.verificationId}>BATCH-{item.id}</Text>
                    <Text style={styles.verificationTime}>2 hours ago</Text>
                  </View>
                  <View style={[
                    styles.resultBadge,
                    { backgroundColor: Colors.accent + '20' }
                  ]}>
                    <Text style={[
                      styles.resultText,
                      { color: Colors.accent }
                    ]}>
                      AUTHENTIC
                    </Text>
                  </View>
                </View>
              </ModernCard>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
      </ScreenLayout>
    </View>
  );
}

function getStockStatusColor(status: string) {
  switch (status) {
    case 'In Stock': return Colors.success;
    case 'Low Stock': return Colors.warning;
    case 'Out of Stock': return Colors.error;
    default: return Colors.textSecondary;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: Spacing.lg,
  },

  // Header Styles
  header: {
    paddingHorizontal: Spacing.layout.container,
    paddingVertical: Spacing.xl,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  userName: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Section Styles
  section: {
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  seeAllText: {
    ...Typography.bodySmall,
    color: Colors.accent,
    fontWeight: '600',
  },

  // Actions Styles
  actionsGrid: {
    gap: Spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  actionDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Verifications Styles
  verificationsList: {
    gap: Spacing.md,
  },
  verificationCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  verificationId: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    marginBottom: Spacing.xs,
  },
  verificationTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  resultBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  resultText: {
    ...Typography.caption,
    fontWeight: '600',
  },
});