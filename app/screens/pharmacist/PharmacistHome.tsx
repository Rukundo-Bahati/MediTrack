import { useRouter } from 'expo-router';
import { AlertTriangle, Package, Pill, ScanLine, TrendingUp, Users } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, RoleColors } from '../../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function PharmacistHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const handleScan = () => {
    router.push('/scan' as any);
  };

  const handleInventory = () => {
    router.push('/inventory' as any);
  };

  const handleDispense = () => {
    router.push('/dispense' as any);
  };

  const handleUpdateStock = () => {
    router.push('/update-stock' as any);
  };

  const handleShowQRReceipt = () => {
    router.push('/qr-receipt' as any);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: RoleColors.pharmacist + '20' }]}>
          <Text style={[styles.roleText, { color: RoleColors.pharmacist }]}>
            PHARMACIST
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: Colors.primary }]}
            onPress={handleScan}
            activeOpacity={0.9}
          >
            <ScanLine size={32} color={Colors.white} strokeWidth={2} />
            <Text style={styles.actionTitle}>Scan & Verify</Text>
            <Text style={styles.actionDescription}>Check authenticity & expiry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: Colors.accent }]}
            onPress={handleUpdateStock}
            activeOpacity={0.9}
          >
            <Package size={32} color={Colors.white} strokeWidth={2} />
            <Text style={styles.actionTitle}>Update Stock</Text>
            <Text style={styles.actionDescription}>Track verified batches</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: Colors.primary }]}
            onPress={handleDispense}
            activeOpacity={0.9}
          >
            <Pill size={32} color={Colors.white} strokeWidth={2} />
            <Text style={styles.actionTitle}>Record Sale/Use</Text>
            <Text style={styles.actionDescription}>Mark batches as dispensed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: Colors.accent }]}
            onPress={handleShowQRReceipt}
            activeOpacity={0.9}
          >
            <Package size={32} color={Colors.white} strokeWidth={2} />
            <Text style={styles.actionTitle}>QR Receipt</Text>
            <Text style={styles.actionDescription}>Show QR for customers</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primary + '15' }]}>
              <Package size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>1,247</Text>
            <Text style={styles.statLabel}>Medicines Verified</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.accent + '15' }]}>
              <AlertTriangle size={24} color={Colors.accent} />
            </View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Suspicious Items</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primary + '15' }]}>
              <Users size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>89</Text>
            <Text style={styles.statLabel}>Patients Served</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.accent + '15' }]}>
              <TrendingUp size={24} color={Colors.accent} />
            </View>
            <Text style={styles.statValue}>+12%</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Package size={32} color={Colors.primary} />
          <Text style={styles.infoTitle}>Pharmacy Safety Standards</Text>
          <Text style={styles.infoDescription}>
            Always verify medicine authenticity before dispensing to ensure patient safety and regulatory compliance.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  greeting: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    flexShrink: 1,
    maxWidth: '80%',
  },
  roleText: {
    fontSize: 9,
    fontWeight: '700' as const,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 90,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  actionsGrid: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionCard: {
    flex: 1,
    minWidth: '30%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  statsGrid: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '20',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});