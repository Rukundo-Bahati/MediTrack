import { useRouter } from 'expo-router';
import { Plus, QrCode } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { useAuth } from '../../context/AuthContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ManufacturerHome() {
  const { user } = useAuth();
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
      id: 'generate-qr',
      title: 'Generate QR Codes',
      description: 'Generate QR codes for registered batches',
      icon: QrCode,
      color: Colors.accent,
      route: '/generate-qr',
    },
  ];

  const recentBatches = [
    { id: 'B001', name: 'Paracetamol 500mg', status: 'Active', date: '2024-01-15' },
    { id: 'B002', name: 'Amoxicillin 250mg', status: 'Shipped', date: '2024-01-14' },
    { id: 'B003', name: 'Ibuprofen 400mg', status: 'Active', date: '2024-01-13' },
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
          <Text style={styles.greeting}>My Batches</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Active Batches</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Total Produced</Text>
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
          <Text style={styles.sectionTitle}>Recent Batches</Text>
          <TouchableOpacity onPress={() => router.push('/batches' as any)}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.batchesList}>
          {recentBatches.map((batch, index) => (
            <Animated.View
              key={batch.id}
              entering={FadeInRight.delay(700 + index * 100)}
              style={styles.batchCard}
            >
              <View style={styles.batchInfo}>
                <Text style={styles.batchId}>{batch.id}</Text>
                <Text style={styles.batchName}>{batch.name}</Text>
                <Text style={styles.batchDate}>{batch.date}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: batch.status === 'Active' ? Colors.success + '20' : Colors.warning + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: batch.status === 'Active' ? Colors.success : Colors.warning }
                ]}>
                  {batch.status}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
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
  batchesList: {
    gap: 12,
  },
  batchCard: {
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
  batchInfo: {
    flex: 1,
  },
  batchId: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  batchName: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 2,
  },
  batchDate: {
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