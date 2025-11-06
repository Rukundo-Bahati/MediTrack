import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, CheckCircle, Clock, Package } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile } = useAuth();
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const r = await AsyncStorage.getItem('medi_cache_recent');
      setRecent(r ? JSON.parse(r) : []);
    })();
  }, []);

  // Mock history data based on user role
  const getHistoryData = () => {
    switch (userProfile?.role) {
      case 'manufacturer':
        return [
          { id: '1', type: 'batch_registered', title: 'Paracetamol 500mg', subtitle: 'BATCH-2025-001 registered', time: '2 hours ago', status: 'success' },
          { id: '2', type: 'qr_generated', title: 'QR Codes Generated', subtitle: '1000 codes for BATCH-2025-001', time: '3 hours ago', status: 'success' },
          { id: '3', type: 'batch_transferred', title: 'Batch Transferred', subtitle: 'To MediDistrib Ltd.', time: '1 day ago', status: 'success' },
        ];
      case 'distributor':
        return [
          { id: '1', type: 'batch_received', title: 'Batch Received', subtitle: 'BATCH-2025-001 from PharmaCorp', time: '1 hour ago', status: 'success' },
          { id: '2', type: 'verification', title: 'Batch Verified', subtitle: 'Authenticity confirmed', time: '2 hours ago', status: 'success' },
          { id: '3', type: 'batch_dispatched', title: 'Batch Dispatched', subtitle: 'To City Pharmacy', time: '4 hours ago', status: 'success' },
        ];
      case 'pharmacist':
        return [
          { id: '1', type: 'medicine_verified', title: 'Medicine Verified', subtitle: 'Paracetamol 500mg - Authentic', time: '30 min ago', status: 'success' },
          { id: '2', type: 'stock_updated', title: 'Stock Updated', subtitle: '50 units added to inventory', time: '1 hour ago', status: 'success' },
          { id: '3', type: 'medicine_dispensed', title: 'Medicine Dispensed', subtitle: '10 units sold to customer', time: '2 hours ago', status: 'success' },
        ];
      default: // consumer
        return recent.length > 0 ? recent.map((item, index) => ({
          id: index.toString(),
          type: 'scan',
          title: item.name || item.batchId || 'Medicine Scan',
          subtitle: item.result?.authentic ? 'Verified Authentic' : 'Verification Failed',
          time: 'Recently',
          status: item.result?.authentic ? 'success' : 'error'
        })) : [
          { id: '1', type: 'scan', title: 'Medicine Scan', subtitle: 'No scans yet', time: '', status: 'pending' },
        ];
    }
  };

  const historyData = getHistoryData();

  const getIcon = (type: string) => {
    switch (type) {
      case 'batch_registered':
      case 'batch_received':
        return Package;
      case 'verification':
      case 'medicine_verified':
        return CheckCircle;
      case 'scan':
        return Clock;
      default:
        return Calendar;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return Colors.accent;
      case 'error':
        return Colors.danger;
      case 'pending':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Activity History</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {historyData.map((item, index) => {
          const IconComponent = getIcon(item.type);
          const statusColor = getStatusColor(item.status);

          return (
            <TouchableOpacity key={item.id} style={styles.historyCard} activeOpacity={0.7}>
              <View style={styles.historyLine}>
                <View style={[styles.historyDot, { backgroundColor: statusColor }]}>
                  <IconComponent size={16} color={Colors.white} />
                </View>
                {index < historyData.length - 1 && (
                  <View style={styles.historyConnector} />
                )}
              </View>

              <View style={styles.historyContent}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  {item.time && (
                    <Text style={styles.historyTime}>{item.time}</Text>
                  )}
                </View>
                <Text style={styles.historySubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {historyData.length === 0 && (
          <View style={styles.emptyState}>
            <Clock size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No activity yet</Text>
            <Text style={styles.emptySubtext}>Your recent actions will appear here</Text>
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
  header: {
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
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  historyCard: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  historyLine: {
    alignItems: 'center',
    marginRight: 16,
    width: 32,
  },
  historyDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  historyConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginTop: 4,
  },
  historyContent: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
    flex: 1,
  },
  historyTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  historySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});