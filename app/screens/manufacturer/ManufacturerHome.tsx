import { ModernNavbar } from '@/components/ui';
import { useRouter } from 'expo-router';
import {
    Package,
    Plus,
    TrendingUp
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
import WalletConnect from '../../components/WalletConnect';
import { useAuth } from '../../context/AuthContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ManufacturerHome() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const primaryActions = [
    {
      id: 'register-batch',
      title: 'Register New Batch',
      description: 'Create and register a new medicine batch',
      icon: Plus,
      color: Colors.primary,
      route: '/register-batch',
    },
    {
      id: 'web3-register-batch',
      title: 'Web3 Batch Registration',
      description: 'Register batch with MetaMask wallet',
      icon: Plus,
      color: Colors.success,
      route: '/web3-register-batch',
    },
    {
      id: 'view-batches',
      title: 'View All Batches',
      description: 'Manage and track your registered batches',
      icon: Package,
      color: Colors.accent,
      route: '/batches',
    },
  ];

  const recentBatches = [
    { id: 'B001', name: 'Paracetamol 500mg', status: 'Active', date: '2024-01-15' },
    { id: 'B002', name: 'Amoxicillin 250mg', status: 'Shipped', date: '2024-01-14' },
    { id: 'B003', name: 'Ibuprofen 400mg', status: 'Active', date: '2024-01-13' },
  ];

  return (
    <View style={styles.container}>
      <ModernNavbar title="Manufacturing Dashboard" />
      <ScreenLayout scrollable style={styles.scrollContainer}>

        {/* Wallet Connection */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <WalletConnect showBalance={false} />
        </Animated.View>

        {/* Stats */}
        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.statsContainer}
        >
          <Animated.View entering={SlideInRight.delay(300)}>
            <ModernCard variant="elevated" style={styles.statCard}>
              <TrendingUp size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Active Batches</Text>
            </ModernCard>
          </Animated.View>
          <Animated.View entering={SlideInRight.delay(400)}>
            <ModernCard variant="elevated" style={styles.statCard}>
              <Package size={24} color={Colors.accent} />
              <Text style={[styles.statNumber, { color: Colors.accent }]}>156</Text>
              <Text style={styles.statLabel}>Total Produced</Text>
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

        {/* Recent Batches */}
        <Animated.View
          entering={FadeInDown.delay(800)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Batches</Text>
            <TouchableOpacity onPress={() => router.push('/batches' as any)}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.batchesList}>
            {recentBatches.map((batch, index) => (
              <Animated.View
                key={batch.id}
                entering={SlideInRight.delay(900 + index * 100)}
              >
                <ModernCard variant="elevated" style={styles.batchCard}>
                  <View style={styles.batchHeader}>
                    <View style={styles.batchIcon}>
                      <Package size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.batchInfo}>
                      <Text style={styles.batchName}>{batch.name}</Text>
                      <Text style={styles.batchId}>Batch {batch.id}</Text>
                      <Text style={styles.batchDate}>{batch.date}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: batch.status === 'Active' ? Colors.accent + '20' : Colors.warning + '20' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: batch.status === 'Active' ? Colors.accent : Colors.warning }
                      ]}>
                        {batch.status.toUpperCase()}
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

  // Batches Styles
  batchesList: {
    gap: Spacing.md,
  },
  batchCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  batchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  batchInfo: {
    flex: 1,
  },
  batchName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  batchId: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  batchDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
  },
});