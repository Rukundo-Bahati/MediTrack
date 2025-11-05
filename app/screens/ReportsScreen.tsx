import { useRouter } from 'expo-router';
import { AlertTriangle, FileText } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModernNavbar } from '../../components/ui/modern-navbar';
import { Colors } from '../../constants/colors';
// Mock reports data since blockchainService was removed
const getAllReports = () => [
  {
    id: '1',
    title: 'Counterfeit Batch Detected',
    description: 'Suspicious batch FAKE001 reported by pharmacy',
    severity: 'high',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2', 
    title: 'Supply Chain Anomaly',
    description: 'Unusual shipping pattern detected',
    severity: 'medium',
    timestamp: new Date().toISOString(),
  }
];

export default function ReportsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reports = getAllReports();

  return (
    <View style={styles.container}>
      <ModernNavbar 
        title="Reports" 
        showBackButton={true}
        onBackPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)');
          }
        }}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {reports.map((report: any) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View style={[styles.reportIcon, { backgroundColor: Colors.warning + '20' }]}>
                <AlertTriangle size={24} color={Colors.warning} />
              </View>
              <View style={styles.reportInfo}>
                <Text style={styles.reportBatch}>{report.batchId}</Text>
                <Text style={styles.reportDate}>{new Date(report.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: report.status === 'pending' ? Colors.warning + '20' : Colors.primary + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: report.status === 'pending' ? Colors.warning : Colors.primary }
                ]}>
                  {report.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.reportReason}>{report.reason}</Text>
            {report.location && (
              <Text style={styles.reportLocation}>Location: {report.location}</Text>
            )}
          </View>
        ))}

        {reports.length === 0 && (
          <View style={styles.emptyState}>
            <FileText size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No reports filed yet</Text>
          </View>
        )}
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
  },
  reportCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportBatch: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  reportReason: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  reportLocation: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
});