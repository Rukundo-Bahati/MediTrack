import { useRouter } from 'expo-router';
import { CheckCircle, FileText } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
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
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInDown.delay(100)}
        style={styles.header}
      >
        <View>
          <Text style={styles.greeting}>{isAdmin ? 'Dashboard' : 'Regulatory Dashboard'}</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200)}
        style={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{isAdmin ? '15' : '23'}</Text>
          <Text style={styles.statLabel}>{isAdmin ? 'Pending Approvals' : 'Reports This Week'}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{isAdmin ? '8' : '95.3%'}</Text>
          <Text style={styles.statLabel}>{isAdmin ? 'Active Reports' : 'Compliance Rate'}</Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300)}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Key Actions</Text>
        <View style={styles.actionsGrid}>
          {primaryActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <AnimatedTouchableOpacity
                key={action.id}
                entering={FadeInRight.delay(400 + index * 100)}
                style={[styles.actionCard, { borderLeftColor: action.color }]}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Icon size={24} color={action.color} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </View>
              </AnimatedTouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(600)}
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
              entering={FadeInRight.delay(700 + index * 100)}
              style={styles.itemCard}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemId}>{item.id}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
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
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  userName: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600' as const,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemId: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  itemName: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 2,
  },
  itemDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
});