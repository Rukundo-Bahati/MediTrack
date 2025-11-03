import { Package, Plus } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useAuth } from '../context/AuthContext';
import { getAllBatches } from '../services/blockchainService';

export default function BatchesScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const batches = getAllBatches();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>My Batches</Text>
        {user?.role === 'manufacturer' && (
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {batches.map((batch) => (
          <View key={batch.batchId} style={styles.batchCard}>
            <View style={styles.batchHeader}>
              <View style={styles.batchIcon}>
                <Package size={24} color={Colors.primary} />
              </View>
              <View style={styles.batchInfo}>
                <Text style={styles.batchName}>{batch.drugName}</Text>
                <Text style={styles.batchId}>{batch.batchId}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: batch.status === 'active' ? Colors.accent + '20' : Colors.danger + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: batch.status === 'active' ? Colors.accent : Colors.danger }
                ]}>
                  {batch.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.batchDetails}>
              <Text style={styles.detailText}>Lot: {batch.lotNumber}</Text>
              <Text style={styles.detailText}>Qty: {batch.quantity.toLocaleString()}</Text>
              <Text style={styles.detailText}>Expires: {new Date(batch.expiryDate).toLocaleDateString()}</Text>
            </View>
          </View>
        ))}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  batchCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  batchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  batchIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  batchInfo: {
    flex: 1,
  },
  batchName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  batchId: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
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
  batchDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});