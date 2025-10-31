import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerBatch } from '../utils/mockApi';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DESIGN } from '../lib/theme';
import { MaterialIcons } from '@expo/vector-icons';

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
      <SafeAreaView style={[styles.container, { backgroundColor: DESIGN.colors.background }]}>
        <ScrollView contentContainerStyle={styles.successContent} showsVerticalScrollIndicator={false}>
          {/* Success Banner */}
          <Card style={[styles.successBanner, { backgroundColor: DESIGN.colors.accentContainer }]}>
            <Card.Content>
              <View style={styles.successContent}>
                <MaterialIcons name="check-circle" size={56} color={DESIGN.colors.accent} />
                <Text variant="titleLarge" style={[styles.successTitle, { color: DESIGN.colors.accent, marginTop: DESIGN.spacing.md }]}>
                  Batch Registered
                </Text>
                <Text variant="bodyMedium" style={[styles.successSubtitle, { color: DESIGN.colors.accent }]}>
                  Your batch is now on the blockchain
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Batch Info Card */}
          <Card style={[styles.batchCard, { backgroundColor: DESIGN.colors.surface }]}>
            <Card.Content>
              <Text variant="titleSmall" style={{ fontWeight: '600', marginBottom: DESIGN.spacing.md, color: DESIGN.colors.muted }}>
                Batch Information
              </Text>
              <View style={styles.infoRow}>
                <Text variant="bodySmall" style={{ color: DESIGN.colors.muted }}>Drug</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{created.drugName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodySmall" style={{ color: DESIGN.colors.muted }}>Batch ID</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: 11 }}>
                  {created.batchId}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodySmall" style={{ color: DESIGN.colors.muted }}>Transaction Hash</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: 10 }}>
                  {created.txHash?.slice(0, 16)}...
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodySmall" style={{ color: DESIGN.colors.muted }}>Status</Text>
                <View style={[styles.statusChip, { backgroundColor: DESIGN.colors.accentContainer }]}>
                  <Text variant="labelSmall" style={{ color: DESIGN.colors.accent, fontWeight: '600' }}>
                    ✓ Confirmed
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* QR Code Section */}
          <Card style={[styles.qrCard, { backgroundColor: DESIGN.colors.surface }]}>
            <Card.Content>
              <Text variant="titleSmall" style={{ fontWeight: '600', marginBottom: DESIGN.spacing.md, color: DESIGN.colors.text }}>
                Scan Code
              </Text>
              <View style={styles.qrContainer}>
                <QRCode value={created.batchId} size={180} />
              </View>
              <Text variant="bodySmall" style={{ textAlign: 'center', color: DESIGN.colors.muted, marginTop: DESIGN.spacing.md }}>
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
              style={[styles.actionButton, { backgroundColor: DESIGN.colors.primary }]}
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
    <SafeAreaView style={[styles.container, { backgroundColor: DESIGN.colors.background }]}>
      <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.title, { color: DESIGN.colors.primary }]}>
            Register Batch
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: DESIGN.colors.muted }]}>
            Create a new batch record on the blockchain
          </Text>
        </View>

        {/* Form Card */}
        <Card style={[styles.formCard, { backgroundColor: DESIGN.colors.surface }]}>
          <Card.Content>
            {/* Drug Name */}
            <Text variant="labelMedium" style={{ fontWeight: '600', marginBottom: DESIGN.spacing.sm, color: DESIGN.colors.text }}>
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
            <Text variant="labelMedium" style={{ fontWeight: '600', marginBottom: DESIGN.spacing.sm, marginTop: DESIGN.spacing.lg, color: DESIGN.colors.text }}>
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
            <Text variant="labelMedium" style={{ fontWeight: '600', marginBottom: DESIGN.spacing.sm, marginTop: DESIGN.spacing.lg, color: DESIGN.colors.text }}>
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
            <Text variant="labelMedium" style={{ fontWeight: '600', marginBottom: DESIGN.spacing.sm, marginTop: DESIGN.spacing.lg, color: DESIGN.colors.text }}>
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
              style={[styles.submitButton, { backgroundColor: DESIGN.colors.primary }]}
              contentStyle={styles.submitButtonContent}
              labelStyle={styles.submitButtonLabel}
            >
              {loading ? 'Registering...' : 'Register on Blockchain'}
            </Button>
          </Card.Content>
        </Card>

        {/* Info Banner */}
        <Card style={[styles.infoBanner, { backgroundColor: DESIGN.colors.primaryContainer }]}>
          <Card.Content>
            <View style={{ flexDirection: 'row', gap: DESIGN.spacing.md }}>
              <MaterialIcons name="info" size={24} color={DESIGN.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall" style={[{ fontWeight: '600', color: DESIGN.colors.primary }]}>
                  Blockchain Registration
                </Text>
                <Text variant="bodySmall" style={[{ color: DESIGN.colors.primary, marginTop: DESIGN.spacing.sm }]}>
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
  formContent: { paddingBottom: DESIGN.spacing.xl },
  successContent: { paddingHorizontal: DESIGN.spacing.md, paddingVertical: DESIGN.spacing.lg, paddingBottom: DESIGN.spacing.xl },
  header: {
    paddingHorizontal: DESIGN.spacing.md,
    paddingVertical: DESIGN.spacing.lg,
  },
  title: {
    fontWeight: '700',
    marginBottom: DESIGN.spacing.sm,
  },
  subtitle: { },
  formCard: {
    marginHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
    borderRadius: DESIGN.radii.lg,
  },
  input: {
    marginBottom: DESIGN.spacing.md,
    backgroundColor: DESIGN.colors.surfaceVariant,
  },
  submitButton: {
    marginTop: DESIGN.spacing.lg,
    borderRadius: DESIGN.radii.lg,
  },
  submitButtonContent: {
    paddingVertical: 10,
  },
  submitButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoBanner: {
    marginHorizontal: DESIGN.spacing.md,
    borderRadius: DESIGN.radii.lg,
  },
  successBanner: {
    marginHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
    borderRadius: DESIGN.radii.lg,
  },
  successTitle: {
    fontWeight: '700',
    textAlign: 'center',
  },
  successSubtitle: {
    marginTop: DESIGN.spacing.sm,
    textAlign: 'center',
  },
  batchCard: {
    marginHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
    borderRadius: DESIGN.radii.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN.spacing.md,
    paddingBottom: DESIGN.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.outline,
  },
  statusChip: {
    paddingHorizontal: DESIGN.spacing.md,
    paddingVertical: DESIGN.spacing.sm,
    borderRadius: DESIGN.radii.md,
  },
  qrCard: {
    marginHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
    borderRadius: DESIGN.radii.lg,
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: DESIGN.spacing.lg,
  },
  actions: {
    paddingHorizontal: DESIGN.spacing.md,
    gap: DESIGN.spacing.md,
  },
  actionButton: {
    borderRadius: DESIGN.radii.lg,
    marginBottom: DESIGN.spacing.sm,
  },
  actionButtonContent: {
    paddingVertical: 10,
  },
});