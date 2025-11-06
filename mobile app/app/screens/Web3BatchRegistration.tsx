import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Package,
    Wallet
} from 'lucide-react-native';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    BounceIn,
    FadeInDown,
    SlideInRight
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModernButton } from '../../components/ui/modern-button';
import { ModernCard } from '../../components/ui/modern-card';
import { ModernInput } from '../../components/ui/modern-input';
import { Colors } from '../../constants/colors';
import { Shadows } from '../../constants/shadows';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import WalletConnect from '../components/WalletConnect';
import { useWallet } from '../context/WalletContext';
import { blockchainService } from '../services/blockchain';

export default function Web3BatchRegistration() {
  const [formData, setFormData] = useState({
    batchId: '',
    drugName: '',
    activeIngredient: '',
    dosage: '',
    expiryDate: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [useWalletTransaction, setUseWalletTransaction] = useState(false);
  
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { walletState } = useWallet();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.batchId || !formData.drugName || !formData.activeIngredient || 
        !formData.dosage || !formData.expiryDate) {
      return 'Please fill in all required fields';
    }
    
    const expiryDate = new Date(formData.expiryDate);
    if (expiryDate <= new Date()) {
      return 'Expiry date must be in the future';
    }
    
    return null;
  };

  const handleRegisterBatch = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    if (useWalletTransaction && !walletState.isConnected) {
      Alert.alert('Wallet Required', 'Please connect your wallet to register batch on blockchain');
      return;
    }

    setIsRegistering(true);

    try {
      const expiryDate = new Date(formData.expiryDate);
      
      const txHash = await blockchainService.registerBatch(
        formData.batchId,
        formData.drugName,
        formData.activeIngredient,
        formData.dosage,
        expiryDate,
        '', // ipfsHash
        useWalletTransaction
      );

      Alert.alert(
        'Batch Registered Successfully!',
        `Batch ${formData.batchId} has been registered on the blockchain.\n\nTransaction Hash: ${txHash.substring(0, 20)}...`,
        [
          {
            text: 'View Batches',
            onPress: () => router.push('/batches' as any)
          },
          {
            text: 'Register Another',
            onPress: () => {
              setFormData({
                batchId: '',
                drugName: '',
                activeIngredient: '',
                dosage: '',
                expiryDate: '',
              });
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Batch registration failed:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'Failed to register batch. Please try again.'
      );
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Package size={32} color={Colors.primary} />
            </View>
            <Text style={styles.headerTitle}>Register Medicine Batch</Text>
            <Text style={styles.headerSubtitle}>
              Register a new medicine batch on the blockchain
            </Text>
          </View>
        </Animated.View>

        {/* Wallet Connection */}
        <Animated.View entering={SlideInRight.delay(200)}>
          <WalletConnect showBalance={true} />
        </Animated.View>

        {/* Transaction Mode Selector */}
        <Animated.View entering={SlideInRight.delay(300)}>
          <ModernCard variant="elevated" style={styles.modeSelector}>
            <Text style={styles.modeSelectorTitle}>Registration Mode</Text>
            <View style={styles.modeOptions}>
              <TouchableOpacity
                style={[
                  styles.modeOption,
                  !useWalletTransaction && styles.modeOptionActive
                ]}
                onPress={() => setUseWalletTransaction(false)}
              >
                <Package size={20} color={!useWalletTransaction ? Colors.primary : Colors.textSecondary} />
                <Text style={[
                  styles.modeOptionText,
                  !useWalletTransaction && styles.modeOptionTextActive
                ]}>
                  Demo Mode
                </Text>
                <Text style={styles.modeOptionDescription}>
                  Simulated blockchain (Free)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeOption,
                  useWalletTransaction && styles.modeOptionActive
                ]}
                onPress={() => setUseWalletTransaction(true)}
              >
                <Wallet size={20} color={useWalletTransaction ? Colors.primary : Colors.textSecondary} />
                <Text style={[
                  styles.modeOptionText,
                  useWalletTransaction && styles.modeOptionTextActive
                ]}>
                  Wallet Mode
                </Text>
                <Text style={styles.modeOptionDescription}>
                  Real blockchain (Requires gas)
                </Text>
              </TouchableOpacity>
            </View>
          </ModernCard>
        </Animated.View>

        {/* Form */}
        <Animated.View entering={SlideInRight.delay(400)}>
          <ModernCard variant="elevated" style={styles.formCard}>
            <Text style={styles.formTitle}>Batch Information</Text>

            <ModernInput
              label="Batch ID"
              placeholder="e.g., PARA001, AMOX002"
              value={formData.batchId}
              onChangeText={(value) => updateFormData('batchId', value)}
              containerStyle={styles.inputContainer}
            />

            <ModernInput
              label="Drug Name"
              placeholder="e.g., Paracetamol 500mg"
              value={formData.drugName}
              onChangeText={(value) => updateFormData('drugName', value)}
              containerStyle={styles.inputContainer}
            />

            <ModernInput
              label="Active Ingredient"
              placeholder="e.g., Paracetamol"
              value={formData.activeIngredient}
              onChangeText={(value) => updateFormData('activeIngredient', value)}
              containerStyle={styles.inputContainer}
            />

            <ModernInput
              label="Dosage"
              placeholder="e.g., 500mg tablets"
              value={formData.dosage}
              onChangeText={(value) => updateFormData('dosage', value)}
              containerStyle={styles.inputContainer}
            />

            <ModernInput
              label="Expiry Date"
              placeholder="YYYY-MM-DD"
              value={formData.expiryDate}
              onChangeText={(value) => updateFormData('expiryDate', value)}
              containerStyle={styles.inputContainer}
            />
          </ModernCard>
        </Animated.View>

        {/* Registration Info */}
        {useWalletTransaction && (
          <Animated.View entering={BounceIn.delay(500)}>
            <ModernCard variant="filled" style={styles.infoCard}>
              <Text style={styles.infoTitle}>Blockchain Transaction</Text>
              <Text style={styles.infoText}>
                {walletState.isConnected 
                  ? `This will create a real blockchain transaction from your wallet (${walletState.address?.substring(0, 10)}...). Gas fees will apply.`
                  : 'Please connect your wallet to register batch on blockchain.'
                }
              </Text>
            </ModernCard>
          </Animated.View>
        )}

        {/* Register Button */}
        <Animated.View entering={SlideInRight.delay(600)} style={styles.buttonContainer}>
          <ModernButton
            title={isRegistering ? 'Registering...' : 'Register Batch'}
            onPress={handleRegisterBatch}
            variant="primary"
            size="large"
            disabled={isRegistering}
            loading={isRegistering}
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Header styles
  header: {
    paddingHorizontal: Spacing.layout.container,
    paddingVertical: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  headerContent: {
    alignItems: 'center',
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
  headerTitle: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Mode selector styles
  modeSelector: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  modeSelectorTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  modeOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modeOption: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  modeOptionActive: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  modeOptionText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  modeOptionTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  modeOptionDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Form styles
  formCard: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  formTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },

  // Info card styles
  infoCard: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  infoTitle: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Button styles
  buttonContainer: {
    paddingHorizontal: Spacing.layout.container,
  },
});