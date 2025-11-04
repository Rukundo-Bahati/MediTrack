import { useRouter } from 'expo-router';
import { AlertTriangle, CheckCircle, FileText, TrendingUp } from 'lucide-react-native';
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

export default function RegulatorDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Check if user is admin to show admin-specific content
  const isAdmin = user?.role === 'admin';

  const primaryActions = isAdmin ? [
    {
      id: 'approve-accounts',
      title: 'Approve Accounts',
      description: 'Review and approve pending user registrations',
      icon: CheckCircle,
      color: Colors.primary,
      route: '/approve-accounts',
    },
    {
      id: 'review-reports',
      title: 'Review Reports',
      description: 'Investigate suspicious activity reports',
      icon: FileText,
      color: Colors.accent,
      route: '/reports',
    },
  ] : [
    {
      id: 'audit-batches',
      title: 'Audit Batches',
      description: 'Review batch compliance and authenticity',
      icon: CheckCircle,
      color: Colors.primary,
      route: '/audit-batches',
    },
    {
      id: 'review-reports',
      title: 'Review Reports',
      description: 'Investigate counterfeit medicine reports',
      icon: FileText,
      color: Colors.accent,
      route: '/reports',
    },
  ];

  const pendingItems = isAdmin ? [
    { id: 'P001', type: 'Account', name: 'PharmaCorp Ltd.', status: 'Pending', date: '2024-01-15' },
    { id: 'P002', type: 'Report', name: 'Suspicious Batch B123', status: 'Under Review', date: '2024-01-14' },
    { id: 'P003', type: 'Account', name: 'MediDistrib Inc.', status: 'Pending', date: '2024-01-13' },
  ] : [
    { id: 'A001', type: 'Audit', name: 'Batch B001 - Paracetamol', status: 'Pending', date: '2024-01-15' },
    { id: 'R002', type: 'Report', name: 'Counterfeit Alert #456', status: 'Investigating', date: '2024-01-14' },
    { id: 'A003', type: 'Audit', name: 'Batch B003 - Ibuprofen', status: 'Pending', date: '2024-01-13' },
  ];

  return (
    <View style={styles.container}>
      <ModernNavbar title={isAdmin ? 'Admin Dashboard' : 'Regulatory Dashboard'} />
      <ScreenLayout scrollable style={styles.scrollContainer}>

        {/* Stats */}
        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.statsContainer}
        >
          <Animated.View entering={SlideInRight.delay(300)}>
            <ModernCard variant="elevated" style={styles.statCard}>
              <AlertTriangle size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>{isAdmin ? '15' : '23'}</Text>
              <Text style={styles.statLabel}>{isAdmin ? 'Pending Approvals' : 'Reports This Week'}</Text>
            </ModernCard>
          </Animated.View>
          <Animated.View entering={SlideInRight.delay(400)}>
            <ModernCard variant="elevated" style={styles.statCard}>
              <TrendingUp size={24} color={Colors.accent} />
              <Text style={[styles.statNumber, { color: Colors.accent }]}>{isAdmin ? '8' : '95.3%'}</Text>
              <Text style={styles.statLabel}>{isAdmin ? 'Active Reports' : 'Compliance Rate'}</Text>
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

        {/* Recent Activity */}
        <Animated.View
          entering={FadeInDown.delay(800)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{isAdmin ? 'Pending Items' : 'Recent Activity'}</Text>
            <TouchableOpacity onPress={() => router.push(isAdmin ? '/admin-queue' : '/activity' as any)}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itemsList}>
            {pendingItems.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={SlideInRight.delay(900 + index * 100)}
              >
                <ModernCard variant="elevated" style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemIcon}>
                      <FileText size={20} color={Colors.accent} />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemId}>{item.id}</Text>
                      <Text style={styles.itemDate}>{item.type} • {item.date}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getItemStatusColor(item.status) + '20' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getItemStatusColor(item.status) }
                      ]}>
                        {item.status}
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

function getItemStatusColor(status: string) {
  switch (status) {
    case 'Pending': return Colors.warning;
    case 'Under Review': return Colors.info;
    case 'Investigating': return Colors.accent;
    case 'Approved': return Colors.success;
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

  // Items Styles
  itemsList: {
    gap: Spacing.md,
  },
  itemCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  itemId: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    marginBottom: Spacing.xs,
  },
  itemDate: {
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