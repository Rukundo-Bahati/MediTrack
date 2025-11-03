import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

// Mock registerBatch function
const registerBatch = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
  return {
    batchId: `BATCH-${Date.now()}`,
    txHash: `0x${Math.random().toString(16).substr(2, 40)}`,
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
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
        <ScrollView contentContainerStyle={styles.successContent} showsVerticalScrollIndicator={false}>
          {/* Success Banner */}
          <Card style={[styles.successBanner, { backgroundColor: Colors.accent + '20' }]}>
            <Card.Content>
              <View style={styles.successContent}>
                <CheckCircle size={56} color={Colors.accent} />
                <Text variant="titleLarge" style={[styles.successTitle, { color: Colors.accent, marginTop: 16 }]}>
                  Batch Registered
                </Text>
                <Text variant="bodyMedium" style={[styles.successSubtitle, { color: Colors.accent }]}>
                  Your batch is now on the blockchain
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Batch Info Card */}
          <Card style={[styles.batchCard, { backgroundColor: Colors.white }]}>
            <Card.Content>
              <Text variant="titleSmall" style={{ fontWeight: '600', marginBottom: 16, color: Colors.textSecondary }}>
                Batch Information
              </Text>
              <View style={styles.infoRow}>
                <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>Drug</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{created.drugName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>Batch ID</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: 11 }}>
                  {created.batchId}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>Transaction Hash</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: 10 }}>
                  {created.txHash?.slice(0, 16)}...
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>Status</Text>
                <View style={[styles.statusChip, { backgroundColor: Colors.accent + '20' }]}>
                  <Text variant="labelSmall" style={{ color: Colors.accent, fontWeight: '600' }}>
                    ✓ Confirmed
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* QR Code Section */}
          <Card style={[styles.qrCard, { backgroundColor: Colors.white }]}>
            <Card.Content>
              <Text variant="titleSmall" style={{ fontWeight: '600', marginBottom: 16, color: Colors.text }}>
                Scan Code
              </Text>
              <View style={styles.qrContainer}>
                <QRCode value={created.batchId} size={180} />
              </View>
              <Text variant="bodySmall" style={{ textAlign: 'center', color: Colors.textSecondary, marginTop: 16 }}>
                Print or share this QR code with distributors and pharmacists
              </Text>
            </Card.Content>
          </Card>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              mode="contained"
              icon="download"
              onPress={onDownloadQR}
              style={[styles.actionButton, { backgroundColor: Colors.primary }]}
              contentStyle={styles.actionButtonContent}
            >
              Download QR
            </Button>
            <Button
              mode="contained-tonal"
              icon="share"
              onPress={onShareQR}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Share QR
            </Button>
            <Button
              mode="outlined"
              icon="plus"
              onPress={onReset}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Register Another
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={[styles.title, { color: Colors.primary }]}>
            Register Batch
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: Colors.textSecondary }]}>
            Create a new batch record on the blockchain
          </Text>
        </View>

        {/* Form Card */}
        <Card style={[styles.formCard, { backgroundColor: Colors.white }]}>
          <Card.Content>
            {/* Drug Name */}
            <Text variant="labelMedium" style={{ fontWeight: '600', marginBottom: 8, color: Colors.text }}>
              Drug Name *
            </Text>
            <TextInput
              label="e.g., Amoxicillin 500mg"
              value={drugName}
              onChangeText={setDrugName}
              style={styles.input}
              mode="outlined"
              placeholder="Enter drug name"
              editable={!loading}
            />

            {/* Lot Number */}
            <Text variant="labelMedium" style={{ fontWeight: '600', marginBottom: 8, marginTop: 24, color: Colors.text }}>
              Lot Number *
            </Text>
            <TextInput
              label="e.g., LOT-12345"
              value={lot}
              onChangeText={setLot}
              style={styles.input}
              mode="outlined"
              placeholder="Enter lot number"
              editable={!loading}
            />

            {/* Expiry Date */}
            <Text variant="labelMedium" style={{ fontWeight: '600', marginBottom: 8, marginTop: 24, color: Colors.text }}>
              Expiry Date *
            </Text>
            <TextInput
              label="YYYY-MM-DD"
              value={expiry}
              onChangeText={setExpiry}
              style={styles.input}
              mode="outlined"
              placeholder="2026-12-31"
              editable={!loading}
            />

            {/* Quantity */}
            <Text variant="labelMedium" style={{ fontWeight: '600', marginBottom: 8, marginTop: 24, color: Colors.text }}>
              Quantity (Units) *
            </Text>
            <TextInput
              label="e.g., 1000"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              placeholder="Enter quantity"
              editable={!loading}
            />

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={onRegister}
              loading={loading}
              disabled={loading}
              style={[styles.submitButton, { backgroundColor: Colors.primary }]}
              contentStyle={styles.submitButtonContent}
              labelStyle={styles.submitButtonLabel}
            >
              {loading ? 'Registering...' : 'Register on Blockchain'}
            </Button>
          </Card.Content>
        </Card>

        {/* Info Banner */}
        <Card style={[styles.infoBanner, { backgroundColor: Colors.primary + '15' }]}>
          <Card.Content>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Info size={24} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall" style={[{ fontWeight: '600', color: Colors.primary }]}>
                  Blockchain Registration
                </Text>
                <Text variant="bodySmall" style={[{ color: Colors.primary, marginTop: 8 }]}>
                  Your batch will be registered on Ethereum Sepolia. A QR code will be generated for tracking.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContent: { paddingBottom: 32 },
  successContent: { paddingHorizontal: 16, paddingVertical: 24, paddingBottom: 32 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 22,
  },
  subtitle: { },
  formCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.backgroundSecondary,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 16,
  },
  submitButtonContent: {
    paddingVertical: 10,
  },
  submitButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoBanner: {
    marginHorizontal: 16,
    borderRadius: 16,
  },
  successBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
  },
  successTitle: {
    fontWeight: '700',
    textAlign: 'center',
  },
  successSubtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  batchCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  qrCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  actions: {
    paddingHorizontal: 16,
    gap: 16,
  },
  actionButton: {
    borderRadius: 16,
    marginBottom: 8,
  },
  actionButtonContent: {
    paddingVertical: 10,
  },
});