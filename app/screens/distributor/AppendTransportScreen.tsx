import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Card, Button, Text, TextInput, Chip } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DESIGN } from '../../lib/theme';
import { appendTransport } from '../../utils/mockApi';
import { cacheTransportLogs } from '../../utils/syncQueue';

const TRANSPORT_STATUSES = ['Pending', 'In Transit', 'At Hub', 'Delayed', 'Delivered'];

export default function AppendTransportScreen() {
  const route = useRoute<any>();
  const nav = useNavigation();
  const { batchId, shipment } = route.params;

  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<string>('In Transit');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter location');
      return;
    }

    try {
      setLoading(true);
      const log = {
        location: location.trim(),
        status,
        notes: notes.trim(),
        timestamp: Date.now(),
      };

      // Call mock API to append transport
      const result = await appendTransport(batchId, log);
      setSuccess(true);

      // Reset form
      setTimeout(() => {
        nav.goBack();
      }, 1500);
    } catch (err) {
      console.warn('Save error', err);
      Alert.alert('Error', 'Failed to save transport log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: DESIGN.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Button icon="arrow-left" onPress={() => nav.goBack()} compact>
            Back
          </Button>
          <Text variant="headlineSmall" style={styles.title}>
            Add Transport Log
          </Text>
          <Text variant="bodySmall" style={{ color: DESIGN.colors.muted }}>
            {shipment?.drugName || 'Batch'} • {batchId}
          </Text>
        </View>

        {/* Success Message */}
        {success && (
          <Card style={[styles.successCard, { backgroundColor: DESIGN.colors.accent }]}>
            <Card.Content>
              <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>
                ✓ Transport log saved successfully!
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Form Card */}
        <Card style={styles.formCard}>
          <Card.Content>
            {/* Location Input */}
            <View style={styles.formGroup}>
              <Text variant="labelSmall" style={{ marginBottom: DESIGN.spacing.sm }}>
                Current Location
              </Text>
              <TextInput
                placeholder="e.g., Warehouse A, Lagos"
                value={location}
                onChangeText={setLocation}
                mode="outlined"
                editable={!loading}
              />
              <Text variant="bodySmall" style={{ color: DESIGN.colors.muted, marginTop: 6 }}>
                Include city/region for clarity
              </Text>
            </View>

            {/* Status Selector */}
            <View style={styles.formGroup}>
              <Text variant="labelSmall" style={{ marginBottom: DESIGN.spacing.sm }}>
                Transport Status
              </Text>
              <View style={styles.statusChips}>
                {TRANSPORT_STATUSES.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    selected={status === s}
                    onPress={() => setStatus(s)}
                    style={[
                      styles.statusChip,
                      { backgroundColor: status === s ? DESIGN.colors.primary : '#e0e0e0' },
                    ]}
                    textStyle={{
                      color: status === s ? '#fff' : DESIGN.colors.text,
                      fontSize: 12,
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Notes Input */}
            <View style={styles.formGroup}>
              <Text variant="labelSmall" style={{ marginBottom: DESIGN.spacing.sm }}>
                Additional Notes (Optional)
              </Text>
              <TextInput
                placeholder="e.g., Passed security, minor delay due to traffic"
                value={notes}
                onChangeText={setNotes}
                mode="outlined"
                multiline
                numberOfLines={4}
                editable={!loading}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleSmall" style={{ fontWeight: '600', marginBottom: DESIGN.spacing.md }}>
              Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: DESIGN.colors.muted }}>Batch ID:</Text>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>{batchId}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: DESIGN.colors.muted }}>Location:</Text>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>{location || '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: DESIGN.colors.muted }}>Status:</Text>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>{status}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <Button
            mode="outlined"
            onPress={() => nav.goBack()}
            disabled={loading}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
          >
            {loading ? 'Saving...' : 'Save Transport Log'}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, padding: DESIGN.spacing.md },
  header: { marginBottom: DESIGN.spacing.lg },
  title: { fontWeight: '600', marginTop: DESIGN.spacing.md, marginBottom: 4 },
  successCard: { marginBottom: DESIGN.spacing.lg, borderRadius: DESIGN.radii.md },
  formCard: { marginBottom: DESIGN.spacing.lg, backgroundColor: DESIGN.colors.surface },
  formGroup: { marginBottom: DESIGN.spacing.lg },
  statusChips: { flexDirection: 'row', flexWrap: 'wrap', gap: DESIGN.spacing.sm },
  statusChip: { borderRadius: DESIGN.radii.md },
  summaryCard: { marginBottom: DESIGN.spacing.lg, backgroundColor: DESIGN.colors.surface },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: DESIGN.spacing.md },
  buttonGroup: { gap: DESIGN.spacing.md, marginBottom: DESIGN.spacing.xl },
  cancelButton: { borderColor: DESIGN.colors.muted },
  saveButton: { backgroundColor: DESIGN.colors.primary },
  saveButtonContent: { paddingVertical: 8 },
});