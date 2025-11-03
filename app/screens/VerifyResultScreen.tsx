import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertTriangle, CheckCircle2, Clock, MapPin, Package, X, XCircle } from 'lucide-react-native';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

interface VerificationResult {
  authentic: boolean;
  message: string;
  scannedAt: string;
  batch?: {
    drugName: string;
    batchId: string;
    lotNumber: string;
    manufacturerName: string;
    quantity: number;
    expiryDate: string;
    status: string;
    batchHash: string;
    txHash: string;
    metadataURI: string;
  };
  provenance?: Array<{
    id: string;
    location: string;
    timestamp: string;
    handler: string;
    status: string;
    notes?: string;
  }>;
}

export default function VerificationScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const result: VerificationResult = params.resultData 
    ? JSON.parse(params.resultData as string)
    : null;

  if (!result) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.errorText}>No verification data available</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isAuthentic = result.authentic;
  const batch = result.batch;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.statusCard,
          { backgroundColor: isAuthentic ? Colors.accent + '15' : Colors.danger + '15' }
        ]}>
          {isAuthentic ? (
            <CheckCircle2 size={64} color={Colors.accent} strokeWidth={2} />
          ) : (
            <XCircle size={64} color={Colors.danger} strokeWidth={2} />
          )}
          <Text style={[
            styles.statusTitle,
            { color: isAuthentic ? Colors.accent : Colors.danger }
          ]}>
            {isAuthentic ? 'Verified Authentic' : 'Warning: Not Verified'}
          </Text>
          <Text style={styles.statusMessage}>{result.message}</Text>
        </View>

        {batch && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Medicine Details</Text>
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Drug Name</Text>
                  <Text style={styles.detailValue}>{batch.drugName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Batch ID</Text>
                  <Text style={[styles.detailValue, styles.monospace]}>{batch.batchId}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Lot Number</Text>
                  <Text style={[styles.detailValue, styles.monospace]}>{batch.lotNumber}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Manufacturer</Text>
                  <Text style={styles.detailValue}>{batch.manufacturerName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantity</Text>
                  <Text style={styles.detailValue}>{batch.quantity.toLocaleString()} units</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Expiry Date</Text>
                  <Text style={[
                    styles.detailValue,
                    new Date(batch.expiryDate) < new Date() && styles.expiredText
                  ]}>
                    {new Date(batch.expiryDate).toLocaleDateString()}
                    {new Date(batch.expiryDate) < new Date() && ' (EXPIRED)'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: batch.status === 'active' ? Colors.accent + '20' : Colors.danger + '20' }
                  ]}>
                    <Text style={[
                      styles.statusBadgeText,
                      { color: batch.status === 'active' ? Colors.accent : Colors.danger }
                    ]}>
                      {batch.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Package size={20} color={Colors.primary} />
                <Text style={[styles.sectionTitle, { marginBottom: 0, marginLeft: 8 }]}>
                  Blockchain Info
                </Text>
              </View>
              <View style={styles.blockchainCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Batch Hash</Text>
                  <Text style={[styles.detailValue, styles.monospace, styles.hashText]} numberOfLines={1}>
                    {batch.batchHash}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transaction Hash</Text>
                  <Text style={[styles.detailValue, styles.monospace, styles.hashText]} numberOfLines={1}>
                    {batch.txHash}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Metadata URI</Text>
                  <Text style={[styles.detailValue, styles.monospace, styles.hashText]} numberOfLines={1}>
                    {batch.metadataURI}
                  </Text>
                </View>
              </View>
            </View>

            {result.provenance && result.provenance.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MapPin size={20} color={Colors.primary} />
                  <Text style={[styles.sectionTitle, { marginBottom: 0, marginLeft: 8 }]}>
                    Supply Chain Journey
                  </Text>
                </View>
                {result.provenance.map((log, index) => (
                  <View key={log.id} style={styles.logCard}>
                    <View style={styles.logLine}>
                      <View style={[
                        styles.logDot,
                        { backgroundColor: log.status === 'received' ? Colors.accent : Colors.primary }
                      ]} />
                      {index < result.provenance.length - 1 && (
                        <View style={styles.logConnector} />
                      )}
                    </View>
                    <View style={styles.logContent}>
                      <View style={styles.logHeader}>
                        <MapPin size={16} color={Colors.primary} />
                        <Text style={styles.logLocation}>{log.location}</Text>
                      </View>
                      <View style={styles.logDetails}>
                        <View style={styles.logDetail}>
                          <Clock size={14} color={Colors.textSecondary} />
                          <Text style={styles.logDetailText}>
                            {new Date(log.timestamp).toLocaleString()}
                          </Text>
                        </View>
                        <Text style={styles.logHandler}>Handler: {log.handler}</Text>
                        {log.notes && (
                          <Text style={styles.logNotes}>{log.notes}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {!isAuthentic && (
          <View style={styles.warningCard}>
            <AlertTriangle size={32} color={Colors.danger} />
            <Text style={styles.warningTitle}>Report This Medicine</Text>
            <Text style={styles.warningText}>
              If you suspect counterfeit medicine, please report it immediately to help protect others.
            </Text>
            <TouchableOpacity style={styles.reportButton}>
              <Text style={styles.reportButtonText}>Report Fake Medicine</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.timestampCard}>
          <Clock size={16} color={Colors.textSecondary} />
          <Text style={styles.timestampText}>
            Scanned at {new Date(result.scannedAt).toLocaleString()}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/(tabs)' as any)}
        >
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  statusCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  statusMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  monospace: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  expiredText: {
    color: Colors.danger,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  blockchainCard: {
    backgroundColor: Colors.primary + '08',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  hashText: {
    fontSize: 11,
  },
  logCard: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  logLine: {
    alignItems: 'center',
    marginRight: 16,
  },
  logDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  logConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginTop: 4,
  },
  logContent: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logLocation: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginLeft: 6,
    flex: 1,
  },
  logDetails: {
    gap: 6,
  },
  logDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logDetailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  logHandler: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  logNotes: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  warningCard: {
    backgroundColor: Colors.danger + '10',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.danger + '30',
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  reportButton: {
    backgroundColor: Colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  reportButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  timestampCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  timestampText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  errorText: {
    fontSize: 16,
    color: Colors.danger,
    textAlign: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 26,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
});