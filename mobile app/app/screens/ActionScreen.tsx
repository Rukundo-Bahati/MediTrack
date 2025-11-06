import { useRouter } from 'expo-router';
import { AlertTriangle, BarChart3, CheckCircle, Factory, Package, QrCode, ScanLine, Truck } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModernNavbar } from '../../components/ui/modern-navbar';
import { Colors } from '../../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function ActionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userProfile } = useAuth();

  const getActionsForRole = () => {
    switch (userProfile?.role) {
      case 'manufacturer':
        return [
          { title: 'Register New Batch', description: 'Add batch to blockchain', icon: Package, route: '/register-batch', color: Colors.primary },
          { title: 'Generate QR Codes', description: 'Create batch QR codes', icon: QrCode, route: '/generate-qr', color: Colors.accent },
          { title: 'Track Distribution', description: 'Monitor batch flow', icon: Factory, route: '/track-distribution', color: Colors.primary },
          { title: 'View Analytics', description: 'Production insights', icon: BarChart3, route: '/analytics', color: Colors.accent },
        ];
      
      case 'distributor':
        return [
          { title: 'Scan & Verify', description: 'Verify batch authenticity', icon: ScanLine, route: '/scan', color: Colors.primary },
          { title: 'Confirm Receipt', description: 'Confirm batch ownership', icon: CheckCircle, route: '/confirm-receipt', color: Colors.accent },
          { title: 'Dispatch Batch', description: 'Transfer to next holder', icon: Truck, route: '/dispatch-batch', color: Colors.primary },
          { title: 'Chain of Custody', description: 'View batch history', icon: BarChart3, route: '/chain-custody', color: Colors.accent },
        ];
      
      case 'pharmacist':
        return [
          { title: 'Scan & Verify', description: 'Check authenticity & expiry', icon: ScanLine, route: '/scan', color: Colors.primary },
          { title: 'Update Stock', description: 'Track verified batches', icon: Package, route: '/update-stock', color: Colors.accent },
          { title: 'Record Dispensing', description: 'Mark batches as sold/used', icon: CheckCircle, route: '/dispense', color: Colors.primary },
          { title: 'QR Receipt', description: 'Show QR for customers', icon: QrCode, route: '/qr-receipt', color: Colors.accent },
        ];
      
      case 'regulator':
        return [
          { title: 'Audit Batches', description: 'Review batch compliance', icon: BarChart3, route: '/audit-batches', color: Colors.primary },
          { title: 'View Reports', description: 'Investigate counterfeit reports', icon: AlertTriangle, route: '/reports', color: Colors.warning },
          { title: 'Blockchain Logs', description: 'Track smart contract events', icon: Package, route: '/blockchain-logs', color: Colors.accent },
          { title: 'System Analytics', description: 'Platform health insights', icon: Factory, route: '/system-analytics', color: Colors.primary },
        ];
      
      default: // consumer
        return [
          { title: 'Scan Medicine', description: 'Verify authenticity instantly', icon: ScanLine, route: '/scan', color: Colors.primary },
          { title: 'Report Suspicious', description: 'Report counterfeit products', icon: AlertTriangle, route: '/report-issue', color: Colors.danger },
          { title: 'View Alerts', description: 'Check recall notifications', icon: Package, route: '/alerts', color: Colors.warning },
          { title: 'Scan History', description: 'View previous scans', icon: BarChart3, route: '/history', color: Colors.accent },
        ];
    }
  };

  const actions = getActionsForRole();

  return (
    <View style={styles.container}>
      <ModernNavbar title={`Quick Actions - ${userProfile?.role?.toUpperCase()}`} />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionsGrid}>
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { borderColor: action.color + '30' }]}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                  <IconComponent size={32} color={action.color} strokeWidth={2} />
                </View>
                <Text style={[styles.actionTitle, { color: action.color }]}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoCard}>
          <Package size={24} color={Colors.primary} />
          <Text style={styles.infoTitle}>Blockchain-Powered Security</Text>
          <Text style={styles.infoDescription}>
            All actions are secured by Ethereum blockchain technology for maximum transparency and trust.
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 8,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.primary + '20',
    flexDirection: 'row',
    gap: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
});