import { useRouter } from 'expo-router';
import { BarChart3, CheckCircle, Clock, Package, ScanLine, Truck } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, RoleColors } from '../../../constants/colors';
import { useAuth } from '../../context/AuthContext';

export default function DistributorHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const handleScanVerify = () => {
    router.push('/scan' as any);
  };

  const handleConfirmReceipt = () => {
    router.push('/confirm-receipt' as any);
  };

  const handleDispatchBatch = () => {
    router.push('/dispatch-batch' as any);
  };

  const handleViewChainCustody = () => {
    router.push('/chain-custody' as any);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <View style={[styles.roleBadge, { backgroundColor: RoleColors.distributor + '20' }]}>
          <Text style={[styles.roleText, { color: RoleColors.distributor }]}>
            DISTRIBUTOR
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
            style={[styles.actionCard, { backgroundColor: RoleColors.distributor }]}
            onPress={handleScanVerify}
            activeOpacity={0.9}
          >
            <ScanLine size={32} color={Colors.white} strokeWidth={2} />
            <Text style={styles.actionTitle}>Scan & Verify</Text>
            <Text style={styles.actionDescription}>Verify batch authenticity</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: Colors.accent }]}
            onPress={handleConfirmReceipt}
            activeOpacity={0.9}
          >
            <CheckCircle size={32} color={Colors.white} strokeWidth={2} />
            <Text style={styles.actionTitle}>Confirm Receipt</Text>
            <Text style={styles.actionDescription}>Confirm batch ownership</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: Colors.info }]}
            onPress={handleDispatchBatch}
            activeOpacity={0.9}
          >
            <Truck size={32} color={Colors.white} strokeWidth={2} />
            <Text style={styles.actionTitle}>Dispatch Batch</Text>
            <Text style={styles.actionDescription}>Transfer to next holder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: Colors.warning }]}
            onPress={handleViewChainCustody}
            activeOpacity={0.9}
          >
            <BarChart3 size={32} color={Colors.white} strokeWidth={2} />
            <Text style={styles.actionTitle}>Chain of Custody</Text>
            <Text style={styles.actionDescription}>View batch history</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: RoleColors.distributor + '15' }]}>
            <View style={[styles.statIcon, { backgroundColor: RoleColors.distributor + '25' }]}>
              <Package size={24} color={RoleColors.distributor} />
            </View>
            <Text style={styles.statValue}>324</Text>
            <Text style={styles.statLabel}>Batches Handled</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors.accent + '15' }]}>
            <View style={[styles.statIcon, { backgroundColor: Colors.accent + '25' }]}>
              <CheckCircle size={24} color={Colors.accent} />
            </View>
            <Text style={styles.statValue}>298</Text>
            <Text style={styles.statLabel}>Verified Authentic</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors.info + '15' }]}>
            <View style={[styles.statIcon, { backgroundColor: Colors.info + '25' }]}>
              <Truck size={24} color={Colors.info} />
            </View>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Dispatched</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: Colors.warning + '15' }]}>
            <View style={[styles.statIcon, { backgroundColor: Colors.warning + '25' }]}>
              <Clock size={24} color={Colors.warning} />
            </View>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>In Transit</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribution Process</Text>

          <View style={styles.stepCard}>
            <View style={[styles.stepNumber, { backgroundColor: RoleColors.distributor }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Receive & Verify</Text>
              <Text style={styles.stepDescription}>Scan QR code to verify batch authenticity</Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.accent }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Confirm Receipt</Text>
              <Text style={styles.stepDescription}>Update blockchain with batch ownership</Text>
            </View>
          </View>

          <View style={styles.stepCard}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.info }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Dispatch</Text>
              <Text style={styles.stepDescription}>Transfer batch to pharmacy or hospital</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Truck size={32} color={RoleColors.distributor} />
          <Text style={styles.infoTitle}>Secure Distribution Network</Text>
          <Text style={styles.infoDescription}>
            Ensure only verified medicines reach healthcare providers through blockchain-tracked distribution.
          </Text>
        </View>
      </ScrollView>
    </View>
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
    maxWidth: 100,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: 16,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: RoleColors.distributor + '10',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: RoleColors.distributor + '20',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
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