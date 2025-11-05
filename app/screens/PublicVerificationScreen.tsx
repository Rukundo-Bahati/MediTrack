import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  Info,
  Search,
  Shield,
  WifiOff,
  XCircle
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  BounceIn,
  FadeIn,
  FadeInDown,
  SlideInUp
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModernButton } from '../../components/ui/modern-button';
import { ModernCard } from '../../components/ui/modern-card';
import { ModernInput } from '../../components/ui/modern-input';
import { Colors } from '../../constants/colors';
import { Shadows } from '../../constants/shadows';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

const { width } = Dimensions.get('window');

// Helper functions for medicine information
const getMedicineDescription = (drugName: string): string => {
  if (drugName.toLowerCase().includes('paracetamol')) {
    return 'Pain relief and fever reduction medication. Take as directed by healthcare professional.';
  } else if (drugName.toLowerCase().includes('amoxicillin')) {
    return 'Antibiotic medication used to treat bacterial infections. Complete the full course as prescribed.';
  } else if (drugName.toLowerCase().includes('ibuprofen')) {
    return 'Anti-inflammatory pain reliever. Take with food to reduce stomach irritation.';
  }
  return 'Prescription medication. Follow healthcare provider instructions carefully.';
};

const getMedicineWarnings = (drugName: string): string[] => {
  const commonWarnings = [
    'Do not exceed recommended dosage',
    'Consult doctor if symptoms persist',
    'Keep out of reach of children'
  ];

  if (drugName.toLowerCase().includes('amoxicillin')) {
    return [...commonWarnings, 'Complete full course even if feeling better', 'Inform doctor of any allergies'];
  } else if (drugName.toLowerCase().includes('ibuprofen')) {
    return [...commonWarnings, 'Take with food', 'Avoid alcohol consumption'];
  }

  return commonWarnings;
};

const getMedicineSideEffects = (drugName: string): string[] => {
  if (drugName.toLowerCase().includes('paracetamol')) {
    return ['Nausea (rare)', 'Allergic reactions (very rare)', 'Liver damage with overdose'];
  } else if (drugName.toLowerCase().includes('amoxicillin')) {
    return ['Nausea', 'Diarrhea', 'Allergic reactions', 'Skin rash'];
  } else if (drugName.toLowerCase().includes('ibuprofen')) {
    return ['Stomach upset', 'Nausea', 'Dizziness', 'Headache'];
  }
  return ['Consult healthcare provider for side effect information'];
};

interface MedicineInfo {
  id: string;
  name: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  isAuthentic: boolean;
  verificationStatus: 'verified' | 'counterfeit' | 'expired' | 'recalled';
  manufacturingDate: string;
  activeIngredient: string;
  dosage: string;
  description: string;
  warnings: string[];
  sideEffects: string[];
  isOffline?: boolean;
  supplyChain?: any[];
}

export default function PublicVerificationScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (permission?.granted) {
      setShowCamera(true);
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setShowCamera(false);
    verifyMedicine(data);
  };

  const verifyMedicine = async (code: string) => {
    setLoading(true);
    try {
      // Use blockchain service for verification
      const { blockchainService } = await import('../services/blockchain');
      const result = await blockchainService.verifyBatch(code);

      if (!result.isValid || !result.batchData) {
        // Handle invalid/counterfeit medicine
        const invalidMedicine: MedicineInfo = {
          id: code,
          name: 'Unknown Medicine',
          manufacturer: 'Unknown',
          batchNumber: code,
          expiryDate: 'Unknown',
          manufacturingDate: 'Unknown',
          isAuthentic: false,
          verificationStatus: 'counterfeit',
          activeIngredient: 'Unknown',
          dosage: 'Unknown',
          description: 'This medicine could not be verified on the blockchain.',
          warnings: ['Do not use this medicine', 'Report to authorities'],
          sideEffects: ['Unknown - potentially dangerous'],
          isOffline: result.isOffline
        };
        setMedicineInfo(invalidMedicine);
        return;
      }

      // Convert blockchain data to MedicineInfo format
      const batchData = result.batchData;
      const currentTime = Math.floor(Date.now() / 1000);

      let verificationStatus: 'verified' | 'counterfeit' | 'expired' | 'recalled' = 'verified';
      if (currentTime > batchData.expiryDate) {
        verificationStatus = 'expired';
      } else if (batchData.status === 3) { // RECALLED
        verificationStatus = 'recalled';
      }

      const medicine: MedicineInfo = {
        id: batchData.batchId,
        name: batchData.drugName,
        manufacturer: `Manufacturer: ${batchData.manufacturer.substring(0, 10)}...`,
        batchNumber: batchData.batchId,
        expiryDate: new Date(batchData.expiryDate * 1000).toLocaleDateString(),
        manufacturingDate: new Date(batchData.manufacturingDate * 1000).toLocaleDateString(),
        isAuthentic: verificationStatus === 'verified',
        verificationStatus,
        activeIngredient: batchData.activeIngredient,
        dosage: batchData.dosage,
        description: getMedicineDescription(batchData.drugName),
        warnings: getMedicineWarnings(batchData.drugName),
        sideEffects: getMedicineSideEffects(batchData.drugName),
        isOffline: result.isOffline,
        supplyChain: result.supplyChain
      };

      setMedicineInfo(medicine);
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'Failed to verify medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const handleManualVerification = () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Please enter a batch code');
      return;
    }
    verifyMedicine(manualCode);
  };

  const resetScanner = () => {
    setScanned(false);
    setMedicineInfo(null);
    setManualCode('');
    setShowCamera(true);
  };

  const requestCameraPermission = async () => {
    const result = await requestPermission();
    if (result.granted) {
      setShowCamera(true);
    } else {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access to scan QR codes for medicine verification.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => { } }
        ]
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return Colors.success;
      case 'counterfeit': return Colors.danger;
      case 'expired': return Colors.warning;
      case 'recalled': return Colors.danger;
      default: return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'counterfeit': return XCircle;
      case 'expired': return XCircle;
      case 'recalled': return XCircle;
      default: return Info;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified on Blockchain ✓';
      case 'counterfeit': return 'COUNTERFEIT - Do Not Use';
      case 'expired': return 'EXPIRED - Do Not Use';
      case 'recalled': return 'RECALLED - Do Not Use';
      default: return 'Unknown Status';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Animated.View entering={FadeIn} style={styles.loadingContainer}>
          <Shield size={64} color={Colors.primary} />
          <Text style={styles.loadingTitle}>Verifying Medicine...</Text>
          <Text style={styles.loadingSubtitle}>Checking blockchain records</Text>
        </Animated.View>
      </View>
    );
  }

  if (medicineInfo) {
    const StatusIcon = getStatusIcon(medicineInfo.verificationStatus);
    const statusColor = getStatusColor(medicineInfo.verificationStatus);

    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Medicine Verification</Text>
          </Animated.View>

          {/* Verification Status */}
          <Animated.View entering={BounceIn.delay(200)}>
            <ModernCard variant="elevated" style={StyleSheet.flatten([styles.statusCard, { borderColor: statusColor }])}>
              <View style={styles.statusHeader}>
                <View style={[styles.statusIcon, { backgroundColor: statusColor + '20' }]}>
                  <StatusIcon size={32} color={statusColor} />
                </View>
                <View style={styles.statusInfo}>
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {getStatusText(medicineInfo.verificationStatus)}
                  </Text>
                  <Text style={styles.medicineName}>{medicineInfo.name}</Text>
                  {medicineInfo.isOffline && (
                    <View style={styles.offlineIndicator}>
                      <WifiOff size={16} color={Colors.warning} />
                      <Text style={styles.offlineText}>Verified from cached data</Text>
                    </View>
                  )}
                </View>
              </View>
            </ModernCard>
          </Animated.View>

          {/* Medicine Details */}
          <Animated.View entering={SlideInUp.delay(300)}>
            <ModernCard variant="elevated" style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Medicine Information</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Manufacturer:</Text>
                <Text style={styles.detailValue}>{medicineInfo.manufacturer}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Batch Number:</Text>
                <Text style={styles.detailValue}>{medicineInfo.batchNumber}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Active Ingredient:</Text>
                <Text style={styles.detailValue}>{medicineInfo.activeIngredient}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dosage:</Text>
                <Text style={styles.detailValue}>{medicineInfo.dosage}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Manufacturing Date:</Text>
                <Text style={styles.detailValue}>{medicineInfo.manufacturingDate}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Expiry Date:</Text>
                <Text style={styles.detailValue}>{medicineInfo.expiryDate}</Text>
              </View>
            </ModernCard>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={SlideInUp.delay(400)}>
            <ModernCard variant="elevated" style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{medicineInfo.description}</Text>
            </ModernCard>
          </Animated.View>

          {/* Warnings */}
          <Animated.View entering={SlideInUp.delay(500)}>
            <ModernCard variant="elevated" style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Important Warnings</Text>
              {medicineInfo.warnings.map((warning, index) => (
                <View key={index} style={styles.warningItem}>
                  <Text style={styles.warningBullet}>•</Text>
                  <Text style={styles.warningText}>{warning}</Text>
                </View>
              ))}
            </ModernCard>
          </Animated.View>

          {/* Side Effects */}
          <Animated.View entering={SlideInUp.delay(600)}>
            <ModernCard variant="elevated" style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Possible Side Effects</Text>
              {medicineInfo.sideEffects.map((effect, index) => (
                <View key={index} style={styles.sideEffectItem}>
                  <Text style={styles.sideEffectBullet}>•</Text>
                  <Text style={styles.sideEffectText}>{effect}</Text>
                </View>
              ))}
            </ModernCard>
          </Animated.View>

          {/* Actions */}
          <Animated.View entering={SlideInUp.delay(700)} style={styles.actionsContainer}>
            <ModernButton
              title="Scan Another Medicine"
              onPress={resetScanner}
              variant="primary"
              size="large"
              style={styles.actionButton}
            />
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  if (showCamera && permission?.granted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown} style={styles.cameraHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.cameraTitle}>Scan Medicine QR Code</Text>
          </Animated.View>

          {/* Scanning Frame */}
          <Animated.View entering={BounceIn.delay(300)} style={styles.scanningFrame}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanInstructions}>
              Point your camera at the QR code on the medicine package
            </Text>
          </Animated.View>

          {/* Manual Entry Option */}
          <Animated.View entering={SlideInUp.delay(500)} style={styles.manualEntryContainer}>
            <TouchableOpacity
              style={styles.manualEntryButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.manualEntryText}>Enter Code Manually</Text>
            </TouchableOpacity>
          </Animated.View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify Medicine</Text>
        </Animated.View>

        {/* Primary Action - Batch Code Entry */}
        <Animated.View entering={SlideInUp.delay(200)}>
          <ModernCard variant="filled" style={styles.primaryForm}>
            <View style={styles.primaryHeader}>
              <Shield size={32} color={Colors.primary} />
              <Text style={styles.primaryTitle}>Verify Medicine</Text>
            </View>
            <Text style={styles.primaryDescription}>
              Enter batch code to verify authenticity
            </Text>
            <ModernInput
              placeholder="Enter batch code (e.g.,PARA001)"
              value={manualCode}
              onChangeText={setManualCode}
              containerStyle={styles.primaryInput}
            />
            <ModernButton
              title="Verify Medicine"
              onPress={handleManualVerification}
              variant="primary"
              size="large"
              disabled={!manualCode.trim()}
              style={styles.primaryButton}
            />
          </ModernCard>
        </Animated.View>

        {/* Divider */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </Animated.View>

        {/* Scan Option */}
        <Animated.View entering={SlideInUp.delay(400)}>
          <ModernCard variant="elevated" style={styles.scanOptionCard}>
            <View style={styles.scanOptionHeader}>
              <View style={styles.scanOptionIcon}>
                <Camera size={40} color={Colors.primary} />
              </View>
              <View style={styles.scanOptionContent}>
                <Text style={styles.scanOptionTitle}>Scan QR Code</Text>
                <Text style={styles.scanOptionDescription}>
                  Use your camera to scan the QR code on the medicine package
                </Text>
              </View>
            </View>
            <ModernButton
              title={permission?.granted ? "Start Scanning" : "Enable Camera"}
              onPress={permission?.granted ? () => setShowCamera(true) : requestCameraPermission}
              variant="secondary"
              size="large"
              style={styles.scanButton}
            />
          </ModernCard>
        </Animated.View>

        {/* Manual Entry Option */}
        <Animated.View entering={SlideInUp.delay(500)}>
          <ModernCard variant="elevated" style={styles.manualOptionCard}>
            <View style={styles.manualOptionHeader}>
              <View style={styles.manualOptionIcon}>
                <Search size={40} color={Colors.accent} />
              </View>
              <View style={styles.manualOptionContent}>
                <Text style={styles.manualOptionTitle}>Manual Verification</Text>
                <Text style={styles.manualOptionDescription}>
                  Enter the batch code manually if you can't scan the QR code
                </Text>
              </View>
            </View>
          </ModernCard>
        </Animated.View>

        {/* Info Section */}
        <Animated.View entering={SlideInUp.delay(600)}>
          <ModernCard variant="filled" style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Info size={24} color={Colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>How It Works</Text>
              <Text style={styles.infoText}>
                Our system uses blockchain technology to verify medicine authenticity.
                Each genuine medicine has a unique QR code that links to immutable blockchain records.
              </Text>
            </View>
          </ModernCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.layout.container,
    paddingVertical: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.subtle,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text,
    flex: 1,
  },

  // Camera Styles
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.layout.container,
    paddingVertical: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cameraTitle: {
    ...Typography.h3,
    color: Colors.white,
    marginLeft: Spacing.md,
  },
  scanningFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.layout.container,
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scanInstructions: {
    ...Typography.body,
    color: Colors.white,
    textAlign: 'center',
    marginTop: Spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  manualEntryContainer: {
    paddingHorizontal: Spacing.layout.container,
    paddingBottom: Spacing.xl,
  },
  manualEntryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  manualEntryText: {
    ...Typography.bodyMedium,
    color: Colors.white,
  },

  // Welcome Styles
  welcomeSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.layout.container,
    paddingVertical: Spacing.xl,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  welcomeSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Scan Option Card Styles
  scanOptionCard: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  scanOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  scanOptionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  scanOptionContent: {
    flex: 1,
  },
  scanOptionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  scanOptionDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  scanButton: {
    width: '100%',
  },

  // Manual Option Card Styles
  manualOptionCard: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  manualOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manualOptionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  manualOptionContent: {
    flex: 1,
  },
  manualOptionTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  manualOptionDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Primary Form Styles (Top Priority)
  primaryForm: {
    marginHorizontal: Spacing.layout.container,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  primaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  primaryTitle: {
    ...Typography.h2,
    color: Colors.primary,
    fontWeight: '700',
  },
  primaryDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  primaryInput: {
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
  },

  // Divider Styles
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.layout.container,
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
  },

  // Info Card Styles
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.layout.container,
    marginVertical: Spacing.lg,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.layout.container,
  },
  loadingTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  loadingSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Status Card Styles
  statusCard: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
    borderWidth: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    ...Typography.h3,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  medicineName: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  offlineText: {
    ...Typography.caption,
    color: Colors.warning,
    fontStyle: 'italic',
  },

  // Details Card Styles
  detailsCard: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  descriptionText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
  },

  // Warning Styles
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  warningBullet: {
    ...Typography.bodyMedium,
    color: Colors.warning,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  warningText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },

  // Side Effect Styles
  sideEffectItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  sideEffectBullet: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  sideEffectText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },

  // Actions Styles
  actionsContainer: {
    paddingHorizontal: Spacing.layout.container,
    paddingVertical: Spacing.xl,
  },
  actionButton: {
    marginBottom: Spacing.md,
  },
});