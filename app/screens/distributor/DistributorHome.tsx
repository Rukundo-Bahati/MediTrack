import { useRouter } from 'expo-router';
import {
    CheckCircle,
    Clock,
    MapPin,
    ScanLine,
    Truck
} from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModernCard } from '../../../components/ui/modern-card';
import { ScreenLayout } from '../../../components/ui/modern-layout';
import { ModernNavbar } from '../../../components/ui/modern-navbar';
import { Colors } from '../../../constants/colors';
import { Shadows } from '../../../constants/shadows';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../context/AuthContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function DistributorHome() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const primaryActions = [
    {
      id: 'scan-verify',
      title: 'Scan & Verify',
      description: 'Verify batch authenticity and confirm receipt',
      icon: ScanLine,
      color: Colors.primary,
      route: '/scan',
    },
    {
      id: 'record-transit',
      title: 'Record Transit',
      description: 'Scan to record shipment to next handler',
      icon: Truck,
      color: Colors.accent,
      route: '/record-transit',
    },
  ];

  const recentTransfers = [
    { id: 'T001', batch: 'B001 - Paracetamol', status: 'Verified', date: '2024-01-15' },
    { id: 'T002', batch: 'B002 - Amoxicillin', status: 'In Transit', date: '2024-01-14' },
    { id: 'T003', batch: 'B003 - Ibuprofen', status: 'Delivered', date: '2024-01-13' },
  ];

  return (
    <View style={styles.container}>
      <ModernNavbar title="Distribution Dashboard" />
      <ScreenLayout scrollable style={styles.scrollContainer}>

      {/* Stats */}
      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.statsContainer}
      >
        <Animated.View entering={SlideInRight.delay(300)}>
          <ModernCard variant="elevated" style={styles.statCard}>
            <CheckCircle size={24} color={Colors.primary} />
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Verified Today</Text>
          </ModernCard>
        </Animated.View>
        <Animated.View entering={SlideInRight.delay(400)}>
          <ModernCard variant="elevated" style={styles.statCard}>
            <Clock size={24} color={Colors.warning} />
            <Text style={[styles.statNumber, { color: Colors.warning }]}>18</Text>
            <Text style={styles.statLabel}>In Transit</Text>
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

      {/* Recent Transfers */}
      <Animated.View 
        entering={FadeInDown.delay(800)}
        style={styles.section}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transfers</Text>
          <TouchableOpacity onPress={() => router.push('/transfers' as any)}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transfersList}>
          {recentTransfers.map((transfer, index) => (
            <Animated.View
              key={transfer.id}
              entering={SlideInRight.delay(900 + index * 100)}
            >
              <ModernCard variant="elevated" style={styles.transferCard}>
                <View style={styles.transferHeader}>
                  <View style={styles.transferIcon}>
                    <MapPin size={20} color={Colors.accent} />
                  </View>
                  <View style={styles.transferInfo}>
                    <Text style={styles.transferBatch}>{transfer.batch}</Text>
                    <Text style={styles.transferId}>Transfer {transfer.id}</Text>
                    <Text style={styles.transferDate}>{transfer.date}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(transfer.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(transfer.status) }
                    ]}>
                      {transfer.status.toUpperCase()}
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

function getStatusColor(status: string) {
  switch (status) {
    case 'Verified': return Colors.success;
    case 'In Transit': return Colors.warning;
    case 'Delivered': return Colors.info;
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

  // Transfers Styles
  transfersList: {
    gap: Spacing.md,
  },
  transferCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  transferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transferIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transferInfo: {
    flex: 1,
  },
  transferBatch: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  transferId: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    marginBottom: Spacing.xs,
  },
  transferDate: {
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