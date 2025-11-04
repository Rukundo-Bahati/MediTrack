import { useRouter } from 'expo-router';
import { Package, ScanLine } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
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
      id: 'manage-inventory',
      title: 'Manage Inventory',
      description: 'Update stock levels and track batches',
      icon: Package,
      color: Colors.accent,
      route: '/inventory',
    },
  ];

  const inventoryItems = [
    { id: 'I001', name: 'Paracetamol 500mg', stock: 150, status: 'In Stock', expiry: '2025-06-15' },
    { id: 'I002', name: 'Amoxicillin 250mg', stock: 45, status: 'Low Stock', expiry: '2025-03-20' },
    { id: 'I003', name: 'Ibuprofen 400mg', stock: 89, status: 'In Stock', expiry: '2025-08-10' },
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
          <Text style={styles.greeting}>Inventory</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>284</Text>
          <Text style={styles.statLabel}>Items in Stock</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
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
          <Text style={styles.sectionTitle}>Current Inventory</Text>
          <TouchableOpacity onPress={() => router.push('/inventory' as any)}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inventoryList}>
          {inventoryItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInRight.delay(700 + index * 100)}
              style={styles.inventoryCard}
            >
              <View style={styles.inventoryInfo}>
                <Text style={styles.inventoryId}>{item.id}</Text>
                <Text style={styles.inventoryName}>{item.name}</Text>
                <Text style={styles.inventoryDetails}>Stock: {item.stock} | Exp: {item.expiry}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStockStatusColor(item.status) + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getStockStatusColor(item.status) }
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
  inventoryList: {
    gap: 12,
  },
  inventoryCard: {
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
  inventoryInfo: {
    flex: 1,
  },
  inventoryId: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  inventoryName: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 2,
  },
  inventoryDetails: {
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