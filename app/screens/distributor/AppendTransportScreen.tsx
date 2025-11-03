import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, TextInput } from 'react-native-paper';
import { Colors } from '../../../constants/colors';

const TRANSPORT_STATUSES = ['Pending', 'In Transit', 'At Hub', 'Delayed', 'Delivered'];

// Mock appendTransport function
const appendTransport = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

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

      await appendTransport({ batchId, log });
      setSuccess(true);
      
      setTimeout(() => {
        nav.goBack();
      }, 2000);
    } catch (err) {
      Alert.alert('Error', 'Failed to save transport log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Add Transport Log
          </Text>
          <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>
            {shipment?.drugName || 'Batch'} • {batchId}
          </Text>
        </View>

        {/* Success Message */}
        {success && (
          <Card style={[styles.successCard, { backgroundColor: Colors.accent }]}>
            <Card.Content>
              <Text style={{ color: '#fff', fontWeight: '600', textAlign: 'center' }}>
                ✓ Transport log saved successfully!
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Form */}
        <Card style={styles.formCard}>
          <Card.Content>
            {/* Location Input */}
            <View style={styles.formGroup}>
              <Text variant="labelSmall" style={{ marginBottom: 8 }}>
                Current Location
              </Text>
              <TextInput
                label="Enter current location"
                value={location}
                onChangeText={setLocation}
                mode="outlined"
                editable={!loading}
              />
              <Text variant="bodySmall" style={{ color: Colors.textSecondary, marginTop: 6 }}>
                Include city/region for clarity
              </Text>
            </View>

            {/* Status Selector */}
            <View style={styles.formGroup}>
              <Text variant="labelSmall" style={{ marginBottom: 8 }}>
                Transport Status
              </Text>
              <View style={styles.statusChips}>
                {TRANSPORT_STATUSES.map((s) => (
                  <Chip
                    key={s}
                    selected={status === s}
                    onPress={() => setStatus(s)}
                    style={[
                      styles.statusChip,
                      { backgroundColor: status === s ? Colors.primary : '#e0e0e0' },
                    ]}
                    textStyle={{
                      color: status === s ? '#fff' : Colors.text,
                      fontWeight: '600',
                      fontSize: 12,
                    }}
                  >
                    {s}
                  </Chip>
                ))}
              </View>
            </View>

            {/* Notes Input */}
            <View style={styles.formGroup}>
              <Text variant="labelSmall" style={{ marginBottom: 8 }}>
                Additional Notes (Optional)
              </Text>
              <TextInput
                label="Add any relevant notes"
                value={notes}
                onChangeText={setNotes}
                mode="outlined"
                multiline
                numberOfLines={3}
                editable={!loading}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleSmall" style={{ fontWeight: '600', marginBottom: 16 }}>
              Summary
            </Text>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>Batch ID:</Text>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>{batchId}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>Location:</Text>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>{location || '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>Status:</Text>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>{status}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Actions */}
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
            disabled={loading || success}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
          >
            Save Log
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, padding: 16 },
  header: { marginBottom: 24 },
  title: { fontWeight: '600', marginTop: 16, marginBottom: 4 },
  successCard: { marginBottom: 24, borderRadius: 12 },
  formCard: { marginBottom: 24, backgroundColor: Colors.white },
  formGroup: { marginBottom: 24 },
  statusChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusChip: { borderRadius: 12 },
  summaryCard: { marginBottom: 24, backgroundColor: Colors.white },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  buttonGroup: { gap: 16, marginBottom: 32 },
  cancelButton: { borderColor: Colors.textSecondary },
  saveButton: { backgroundColor: Colors.primary },
  saveButtonContent: { paddingVertical: 8 },
});