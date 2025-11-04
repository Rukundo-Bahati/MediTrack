import { useRouter } from 'expo-router';
import { ScanLine, Truck } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
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
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        entering={FadeInDown.delay(100)}
        style={styles.header}
      >
        <View>
          <Text style={styles.greeting}>Verify & Transfer</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Verified Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>In Transit</Text>
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
          <Text style={styles.sectionTitle}>Recent Transfers</Text>
          <TouchableOpacity onPress={() => router.push('/transfers' as any)}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transfersList}>
          {recentTransfers.map((transfer, index) => (
            <Animated.View
              key={transfer.id}
              entering={FadeInRight.delay(700 + index * 100)}
              style={styles.transferCard}
            >
              <View style={styles.transferInfo}>
                <Text style={styles.transferId}>{transfer.id}</Text>
                <Text style={styles.transferBatch}>{transfer.batch}</Text>
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
                  {transfer.status}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
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
  transfersList: {
    gap: 12,
  },
  transferCard: {
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
  transferInfo: {
    flex: 1,
  },
  transferId: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  transferBatch: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 2,
  },
  transferDate: {
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