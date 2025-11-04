import { useRouter } from 'expo-router';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle,
    Clock,
    MapPin,
    Package,
    ScanLine,
    Truck,
    User
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    BounceIn,
    FadeInDown,
    FadeInUp,
    SlideInRight,
    ZoomIn
} from 'react-native-reanimated';
import { ModernButton } from '../../components/ui/modern-button';
import { ModernCard } from '../../components/ui/modern-card';
import { ModernInput } from '../../components/ui/modern-input';
import { ScreenLayout } from '../../components/ui/modern-layout';
import { ModernSelector } from '../../components/ui/modern-selector';
import { Colors } from '../../constants/colors';
import { Shadows } from '../../constants/shadows';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface TransitRecord {
  batchId: string;
  drugName: string;
  fromLocation: string;
  toLocation: string;
  recipientType: string;
  recipientName: string;
  timestamp: string;
  txHash: string;
}

const RECIPIENT_TYPES = [
  { value: 'pharmacy', label: 'Pharmacy', description: 'Local pharmacy or hospital', color: Colors.primary },
  { value: 'distributor', label: 'Distributor', description: 'Another distribution center', color: Colors.accent },
  { value: 'hospital', label: 'Hospital', description: 'Medical facility', color: Colors.info },
];

export default function RecordTransitScreen() {
  const router = useRouter();
  const [scannedBatch, setScannedBatch] = useState<any>(null);
  const [recipientType, setRecipientType] = useState('pharmacy');
  const [recipientName, setRecipientName] = useState('');
  const [recipientLocation, setRecipientLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transitRecorded, setTransitRecorded] = useState<TransitRecord | null>(null);

  const handleScanBatch = () => {
    // Simulate scanning a batch
    const mockBatch = {
      batchId: `BATCH-${Date.now()}`,
      drugName: 'Paracetamol 500mg',
      lotNumber: 'LOT-12345',
      manufacturer: 'PharmaCorp Ltd.',
      currentLocation: 'Distribution Center A',
      status: 'verified'
    };
    setScannedBatch(mockBatch);
  };

  const handleRecordTransit = async () => {
    if (!scannedBatch) {
      Alert.alert('Error', 'Please scan a batch first');
      return;
    }
    if (!recipientName.trim() || !recipientLocation.trim()) {
      Alert.alert('Error', 'Please fill in recipient details');
      return;
    }

    setIsRecording(true);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const transitRecord: TransitRecord = {
        batchId: scannedBatch.batchId,
        drugName: scannedBatch.drugName,
        fromLocation: scannedBatch.currentLocation,
        toLocation: recipientLocation,
        recipientType,
        recipientName,
        timestamp: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substring(2, 42)}`
      };
      
      setTransitRecorded(transitRecord);
    } catch (error) {
      Alert.alert('Error', 'Failed to record transit on blockchain');
    } finally {
      setIsRecording(false);
    }
  };

  const handleReset = () => {
    setScannedBatch(null);
    setTransitRecorded(null);
    setRecipientName('');
    setRecipientLocation('');
    setNotes('');
    setRecipientType('pharmacy');
  };

  if (transitRecorded) {
    return (
      <ScreenLayout scrollable style={styles.container}>
        {/* Back Button */}
        <Animated.View 
          entering={FadeInDown.delay(100)}
          style={styles.backButtonContainer}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setTransitRecorded(null)}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={Colors.text} strokeWidth={2} />
          </TouchableOpacity>
        </Animated.View>

        {/* Success Hero */}
        <Animated.View 
          entering={ZoomIn.delay(200)}
          style={styles.successHero}
        >
          <View style={styles.successIconContainer}>
            <Animated.View entering={BounceIn.delay(400)}>
              <CheckCircle size={64} color={Colors.white} strokeWidth={2} />
            </Animated.View>
          </View>
          <Animated.Text 
            entering={FadeInUp.delay(600)}
            style={styles.successTitle}
          >
            Transit Recorded Successfully!
          </Animated.Text>
          <Animated.Text 
            entering={FadeInUp.delay(800)}
            style={styles.successSubtitle}
          >
            Batch shipment has been recorded on the blockchain
          </Animated.Text>
        </Animated.View>

        {/* Transit Details */}
        <Animated.View entering={SlideInRight.delay(1000)}>
          <ModernCard variant="elevated" style={styles.detailsCard}>
            <View style={styles.cardHeader}>
              <Truck size={24} color={Colors.primary} />
              <Text style={styles.cardTitle}>Transit Information</Text>
            </View>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Package size={18} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Batch</Text>
                  <Text style={styles.detailValue}>{transitRecorded.drugName}</Text>
                  <Text style={styles.detailValueMono}>{transitRecorded.batchId}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <MapPin size={18} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Route</Text>
                  <Text style={styles.detailValue}>{transitRecorded.fromLocation}</Text>
                  <Text style={styles.routeArrow}>↓</Text>
                  <Text style={styles.detailValue}>{transitRecorded.toLocation}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <User size={18} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Recipient</Text>
                  <Text style={styles.detailValue}>{transitRecorded.recipientName}</Text>
                  <Text style={styles.detailSubvalue}>({transitRecorded.recipientType})</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <Clock size={18} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Timestamp</Text>
                  <Text style={styles.detailValue}>
                    {new Date(transitRecorded.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.blockchainInfo}>
              <Text style={styles.blockchainTitle}>Blockchain Transaction</Text>
              <Text style={styles.blockchainHash}>{transitRecorded.txHash}</Text>
            </View>
          </ModernCard>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInUp.delay(1200)}>
          <ModernButton
            title="Record Another Transit"
            onPress={handleReset}
            variant="ghost"
            size="large"
            style={styles.resetButton}
          />
        </Animated.View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout scrollable style={styles.container}>
      {/* Back Button */}
      <Animated.View 
        entering={FadeInDown.delay(100)}
        style={styles.backButtonContainer}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)');
            }
          }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.text} strokeWidth={2} />
        </TouchableOpacity>
      </Animated.View>

      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.header}
      >
        <View style={styles.headerIcon}>
          <Truck size={32} color={Colors.primary} strokeWidth={2} />
        </View>
        <Text style={styles.title}>Record Transit</Text>
        <Text style={styles.subtitle}>
          Scan batch and record shipment to next handler on blockchain
        </Text>
      </Animated.View>

      {/* Scan Section */}
      <Animated.View entering={SlideInRight.delay(400)}>
        <ModernCard variant="elevated" style={styles.scanCard}>
          <View style={styles.scanHeader}>
            <ScanLine size={20} color={Colors.primary} />
            <Text style={styles.scanTitle}>Step 1: Scan Batch</Text>
          </View>
          
          {!scannedBatch ? (
            <View style={styles.scanPrompt}>
              <View style={styles.scanIcon}>
                <ScanLine size={48} color={Colors.textSecondary} />
              </View>
              <Text style={styles.scanPromptText}>
                Scan the QR code on the batch to verify and prepare for transit
              </Text>
              <ModernButton
                title="Scan Batch QR Code"
                onPress={handleScanBatch}
                variant="primary"
                size="medium"
                style={styles.scanButton}
              />
            </View>
          ) : (
            <Animated.View entering={FadeInUp.delay(300)}>
              <View style={styles.scannedBatch}>
                <View style={styles.batchIcon}>
                  <Package size={24} color={Colors.accent} />
                </View>
                <View style={styles.batchInfo}>
                  <Text style={styles.batchName}>{scannedBatch.drugName}</Text>
                  <Text style={styles.batchId}>{scannedBatch.batchId}</Text>
                  <Text style={styles.batchLocation}>From: {scannedBatch.currentLocation}</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <CheckCircle size={16} color={Colors.accent} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </Animated.View>
          )}
        </ModernCard>
      </Animated.View>

      {/* Recipient Details */}
      {scannedBatch && (
        <Animated.View entering={FadeInUp.delay(600)}>
          <ModernCard variant="elevated" style={styles.recipientCard}>
            <View style={styles.recipientHeader}>
              <User size={20} color={Colors.primary} />
              <Text style={styles.recipientTitle}>Step 2: Recipient Details</Text>
            </View>

            <View style={styles.recipientForm}>
              <Text style={styles.fieldLabel}>Recipient Type</Text>
              <ModernSelector
                options={RECIPIENT_TYPES}
                selectedValue={recipientType}
                onSelect={setRecipientType}
                variant="chips"
                style={styles.typeSelector}
              />

              <ModernInput
                label="Recipient Name"
                placeholder="Enter pharmacy/hospital name"
                value={recipientName}
                onChangeText={setRecipientName}
                containerStyle={styles.inputContainer}
              />

              <ModernInput
                label="Destination Location"
                placeholder="Enter full address"
                value={recipientLocation}
                onChangeText={setRecipientLocation}
                containerStyle={styles.inputContainer}
              />

              <ModernInput
                label="Notes (Optional)"
                placeholder="Add any special instructions"
                value={notes}
                onChangeText={setNotes}
                multiline
                containerStyle={styles.inputContainer}
              />
            </View>
          </ModernCard>
        </Animated.View>
      )}

      {/* Record Button */}
      {scannedBatch && (
        <Animated.View entering={BounceIn.delay(800)}>
          <ModernButton
            title={isRecording ? "Recording on Blockchain..." : "Record Transit on Blockchain"}
            onPress={handleRecordTransit}
            variant="primary"
            size="large"
            loading={isRecording}
            disabled={isRecording}
            style={styles.recordButton}
          />
        </Animated.View>
      )}

      {/* Info Banner */}
      <Animated.View entering={FadeInUp.delay(1000)}>
        <ModernCard variant="subtle" style={styles.infoBanner}>
          <View style={styles.infoContent}>
            <View style={styles.infoIcon}>
              <AlertTriangle size={24} color={Colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Blockchain Recording</Text>
              <Text style={styles.infoDescription}>
                Transit records are permanently stored on the blockchain for complete supply chain traceability. 
                Ensure all details are accurate before recording.
              </Text>
            </View>
          </View>
        </ModernCard>
      </Animated.View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Back Button Styles
  backButtonContainer: {
    paddingHorizontal: Spacing.layout.container,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.subtle,
  },

  // Header Styles
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.layout.container,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Scan Card Styles
  scanCard: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  scanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  scanTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  scanPrompt: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  scanIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  scanPromptText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  scanButton: {
    minWidth: 200,
  },

  // Scanned Batch Styles
  scannedBatch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '10',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  batchIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  batchInfo: {
    flex: 1,
  },
  batchName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  batchId: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    marginBottom: Spacing.xs,
  },
  batchLocation: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  verifiedText: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '600',
  },

  // Recipient Card Styles
  recipientCard: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  recipientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  recipientTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  recipientForm: {
    gap: Spacing.md,
  },
  fieldLabel: {
    ...Typography.label,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  typeSelector: {
    marginBottom: Spacing.md,
  },
  inputContainer: {
    marginBottom: 0,
  },

  // Record Button
  recordButton: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },

  // Info Banner Styles
  infoBanner: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  infoContent: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  infoDescription: {
    ...Typography.bodySmall,
    color: Colors.primary,
    lineHeight: 20,
  },

  // Success Screen Styles
  successHero: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.layout.container,
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.layout.container,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
    borderRadius: 24,
    ...Shadows.strong,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '40',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: {
    ...Typography.h2,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  successSubtitle: {
    ...Typography.body,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },

  // Details Card Styles
  detailsCard: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  detailsGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  detailValueMono: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    marginTop: Spacing.xs,
  },
  detailSubvalue: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  routeArrow: {
    ...Typography.body,
    color: Colors.primary,
    textAlign: 'center',
    marginVertical: Spacing.xs,
  },

  // Blockchain Info
  blockchainInfo: {
    backgroundColor: Colors.primary + '10',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  blockchainTitle: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  blockchainHash: {
    ...Typography.caption,
    color: Colors.primary,
    fontFamily: 'monospace',
  },

  // Reset Button
  resetButton: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
});