import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CheckCircle,
  Hash,
  Info,
  Layers,
  Package,
  Shield,
  Sparkles
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
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
import { Colors } from '../../constants/colors';
import { Shadows } from '../../constants/shadows';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

// Mock registerBatch function
const registerBatch = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
  return {
    batchId: `BATCH-${Date.now()}`,
    txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
    drugName: data.drugName,
  };
};

export default function RegisterBatch() {
  const [drugName, setDrugName] = useState('Amoxicillin 500mg');
  const [lot, setLot] = useState('LOT-12345');
  const [expiry, setExpiry] = useState('2026-12-31');
  const [quantity, setQuantity] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<any | null>(null);

  const onRegister = async () => {
    if (!drugName.trim() || !lot.trim() || !expiry.trim() || !quantity.trim()) {
      Alert.alert('Validation', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await registerBatch({ drugName, lot, expiry, quantity });
      setCreated(res);
      // save to local batches
      const raw = await AsyncStorage.getItem('medi_batches');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift({ id: res.batchId, drugName, lot, expiry, txHash: res.txHash, createdAt: Date.now() });
      await AsyncStorage.setItem('medi_batches', JSON.stringify(arr));
    } catch (error) {
      Alert.alert('Error', 'Failed to register batch');
    } finally {
      setLoading(false);
    }
  };

  const onDownloadQR = () => {
    Alert.alert('Success', `QR code for ${created.batchId} ready to download`);
  };

  const onShareQR = () => {
    Alert.alert('Success', `QR code shared for ${created.batchId}`);
  };

  const onReset = () => {
    setCreated(null);
    setDrugName('Amoxicillin 500mg');
    setLot('LOT-12345');
    setExpiry('2026-12-31');
    setQuantity('1000');
  };

  if (created) {
    return (
      <ScreenLayout scrollable style={styles.container}>
        {/* Success Hero Section */}
        <Animated.View
          entering={ZoomIn.delay(200)}
          style={styles.successHero}
        >
          <View style={styles.successIconContainer}>
            <Animated.View entering={BounceIn.delay(400)}>
              <CheckCircle size={64} color={Colors.white} strokeWidth={2} />
            </Animated.View>
            <View style={styles.sparkleContainer}>
              <Sparkles size={20} color={Colors.white} style={styles.sparkle1} />
              <Sparkles size={16} color={Colors.white} style={styles.sparkle2} />
              <Sparkles size={18} color={Colors.white} style={styles.sparkle3} />
            </View>
          </View>
          <Animated.Text
            entering={FadeInUp.delay(600)}
            style={styles.successTitle}
          >
            Batch Successfully Registered!
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(800)}
            style={styles.successSubtitle}
          >
            Your medicine batch is now secured on the blockchain
          </Animated.Text>
        </Animated.View>

        {/* Batch Details Card */}
        <Animated.View entering={SlideInRight.delay(1000)}>
          <ModernCard variant="elevated" style={styles.detailsCard}>
            <View style={styles.cardHeader}>
              <Shield size={24} color={Colors.primary} />
              <Text style={styles.cardTitle}>Batch Information</Text>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Package size={18} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Drug Name</Text>
                  <Text style={styles.detailValue}>{created.drugName}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Hash size={18} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Batch ID</Text>
                  <Text style={styles.detailValueMono}>{created.batchId}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Layers size={18} color={Colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Transaction</Text>
                  <Text style={styles.detailValueMono}>{created.txHash?.slice(0, 20)}...</Text>
                </View>
              </View>

              <View style={styles.statusContainer}>
                <View style={styles.statusBadge}>
                  <CheckCircle size={16} color={Colors.accent} />
                  <Text style={styles.statusText}>Blockchain Confirmed</Text>
                </View>
              </View>
            </View>
          </ModernCard>
        </Animated.View>

        {/* QR Code Card */}
        <Animated.View entering={FadeInUp.delay(1200)}>
          <ModernCard variant="elevated" style={styles.qrCard}>
            <Text style={styles.qrTitle}>Tracking QR Code</Text>
            <Text style={styles.qrSubtitle}>
              Share this code with distributors and pharmacists for supply chain tracking
            </Text>

            <View style={styles.qrContainer}>
              <View style={styles.qrCodeWrapper}>
                <QRCode
                  value={created.batchId}
                  size={160}
                  backgroundColor={Colors.white}
                  color={Colors.text}
                />
              </View>
            </View>

            <View style={styles.qrActions}>
              <ModernButton
                title="Download"
                onPress={onDownloadQR}
                variant="primary"
                size="medium"
                style={styles.qrActionButton}
              />
              <ModernButton
                title="Share"
                onPress={onShareQR}
                variant="outline"
                size="medium"
                style={styles.qrActionButton}
              />
            </View>
          </ModernCard>
        </Animated.View>

        {/* Register Another Button */}
        <Animated.View entering={FadeInUp.delay(1400)}>
          <ModernButton
            title="Register Another Batch"
            onPress={onReset}
            variant="ghost"
            size="large"
            style={styles.registerAnotherButton}
          />
        </Animated.View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout scrollable style={styles.container}>
      {/* Header Section */}
      <Animated.View
        entering={FadeInDown.delay(200)}
        style={styles.header}
      >
        <View style={styles.headerIcon}>
          <Package size={32} color={Colors.primary} strokeWidth={2} />
        </View>
        <Text style={styles.title}>Register New Batch</Text>
        <Text style={styles.subtitle}>
          Secure your medicine batch on the blockchain for complete traceability
        </Text>
      </Animated.View>

      {/* Form Card */}
      <Animated.View entering={SlideInRight.delay(400)}>
        <ModernCard variant="elevated" style={styles.formCard}>
          <View style={styles.formHeader}>
            <Shield size={20} color={Colors.primary} />
            <Text style={styles.formTitle}>Batch Details</Text>
          </View>

          <View style={styles.formGrid}>
            {/* Drug Name */}
            <Animated.View entering={FadeInUp.delay(600)}>
              <ModernInput
                label="Drug Name"
                placeholder="e.g., Amoxicillin 500mg"
                value={drugName}
                onChangeText={setDrugName}
                editable={!loading}
                containerStyle={styles.inputContainer}
                hint="Include dosage and form"
              />
            </Animated.View>

            {/* Lot Number */}
            <Animated.View entering={FadeInUp.delay(700)}>
              <ModernInput
                label="Lot Number"
                placeholder="e.g., LOT-12345"
                value={lot}
                onChangeText={setLot}
                editable={!loading}
                containerStyle={styles.inputContainer}
                hint="Unique manufacturing lot identifier"
              />
            </Animated.View>

            {/* Expiry Date */}
            <Animated.View entering={FadeInUp.delay(800)}>
              <ModernInput
                label="Expiry Date"
                placeholder="YYYY-MM-DD"
                value={expiry}
                onChangeText={setExpiry}
                editable={!loading}
                containerStyle={styles.inputContainer}
                hint="Format: 2026-12-31"
              />
            </Animated.View>

            {/* Quantity */}
            <Animated.View entering={FadeInUp.delay(900)}>
              <ModernInput
                label="Quantity (Units)"
                placeholder="e.g., 1000"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                editable={!loading}
                containerStyle={styles.inputContainer}
                hint="Total number of units in this batch"
              />
            </Animated.View>
          </View>

          {/* Submit Button */}
          <Animated.View entering={BounceIn.delay(1000)}>
            <ModernButton
              title={loading ? "Registering on Blockchain..." : "Register on Blockchain"}
              onPress={onRegister}
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            />
          </Animated.View>
        </ModernCard>
      </Animated.View>

      {/* Info Banner */}
      <Animated.View entering={FadeInUp.delay(1200)}>
        <ModernCard variant="subtle" style={styles.infoBanner}>
          <View style={styles.infoContent}>
            <View style={styles.infoIcon}>
              <Info size={24} color={Colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Blockchain Security</Text>
              <Text style={styles.infoDescription}>
                Your batch will be permanently recorded on Ethereum Sepolia testnet.
                Once registered, the data becomes immutable and traceable throughout the supply chain.
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
    ...Shadows.soft,
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

  // Form Styles
  formCard: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  formTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  formGrid: {
    gap: Spacing.component.margin,
  },
  inputContainer: {
    marginBottom: 0,
  },
  submitButton: {
    marginTop: Spacing.xl,
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
    marginBottom: Spacing.lg,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
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
    position: 'relative',
  },
  sparkleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle1: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 20,
    left: 10,
  },
  sparkle3: {
    position: 'absolute',
    top: 30,
    left: 20,
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
    ...Typography.bodyMedium,
    color: Colors.text,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  statusContainer: {
    alignItems: 'flex-start',
    paddingTop: Spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    gap: Spacing.xs,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '600',
  },

  // QR Code Styles
  qrCard: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  qrTitle: {
    ...Typography.h3,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  qrSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  qrCodeWrapper: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: 16,
    ...Shadows.medium,
  },
  qrActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  qrActionButton: {
    flex: 1,
  },

  // Register Another Button
  registerAnotherButton: {
    marginHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
});