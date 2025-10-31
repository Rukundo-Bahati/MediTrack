import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Button, Text, Chip, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DESIGN } from '../../lib/theme';
import { getCachedTransportLogs } from '../../utils/syncQueue';

interface TransportLog {
  id: string;
  timestamp: number;
  location: string;
  status: string;
  notes?: string;
}

interface Shipment {
  id: string;
  batchId: string;
  drugName: string;
  quantity: number;
  status: 'pending' | 'in_transit' | 'delivered';
  origin: string;
  destination: string;
  lastLocation: string;
  timestamp: number;
}

export default function ShipmentDetailsScreen() {
  const route = useRoute<any>();
  const nav = useNavigation();
  const { shipment } = route.params as { shipment: Shipment };
  const [logs, setLogs] = useState<TransportLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [shipment.batchId, shipment.timestamp, shipment.origin, shipment.lastLocation]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const cached = await getCachedTransportLogs(shipment.batchId);
      if (cached) {
        setLogs(cached);
      } else {
        // Mock default logs for demo
        const mockLogs: TransportLog[] = [
          {
            id: 'log_1',
            timestamp: shipment.timestamp,
            location: shipment.origin,
            status: 'Dispatched',
            notes: 'Batch packed and ready for shipment',
          },
          {
            id: 'log_2',
            timestamp: shipment.timestamp + 1000 * 60 * 60 * 12,
            location: shipment.lastLocation,
            status: 'In Transit',
            notes: 'Passed security checkpoint',
          },
        ];
        setLogs(mockLogs);
      }
    } catch (e) {
      console.warn('loadLogs error', e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Dispatched':
        return '#2196F3';
      case 'In Transit':
        return '#FF9800';
      case 'Delivered':
        return DESIGN.colors.accent;
      default:
        return DESIGN.colors.muted;
    }
  };

  const handleAppendLog = () => {
    nav.navigate('AppendTransport' as never, { batchId: shipment.batchId, shipment } as never);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: DESIGN.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <Button icon="arrow-left" onPress={() => nav.goBack()} compact>
            Back
          </Button>
        </View>

        {/* Shipment Overview Card */}
        <Card style={styles.overviewCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.drugName}>
              {shipment.drugName}
            </Text>
            <Text variant="bodySmall" style={{ color: DESIGN.colors.muted, marginBottom: DESIGN.spacing.md }}>
              {shipment.batchId}
            </Text>

            <View style={styles.overviewGrid}>
              <View style={styles.overviewItem}>
                <Text variant="labelSmall" style={{ color: DESIGN.colors.muted }}>
                  Quantity
                </Text>
                <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                  {shipment.quantity}
                </Text>
              </View>
              <View style={styles.overviewItem}>
                <Text variant="labelSmall" style={{ color: DESIGN.colors.muted }}>
                  Status
                </Text>
                <Chip
                  label={shipment.status.toUpperCase()}
                  style={{
                    backgroundColor:
                      shipment.status === 'pending'
                        ? '#FFC107'
                        : shipment.status === 'in_transit'
                          ? '#2196F3'
                          : DESIGN.colors.accent,
                  }}
                  textStyle={{ color: '#fff', fontSize: 10 }}
                />
              </View>
              <View style={styles.overviewItem}>
                <Text variant="labelSmall" style={{ color: DESIGN.colors.muted }}>
                  Origin
                </Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                  {shipment.origin}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Transport Timeline */}
        <View style={styles.timelineSection}>
          <Text variant="titleMedium" style={styles.timelineSectionTitle}>
            Transport Timeline
          </Text>

          {logs.map((log, idx) => (
            <View key={log.id} style={styles.timelineItem}>
              {/* Timeline dot and line */}
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: getStatusColor(log.status),
                      borderColor: '#fff',
                      borderWidth: 3,
                    },
                  ]}
                />
                {idx < logs.length - 1 && <View style={styles.timelineLine} />}
              </View>

              {/* Timeline content */}
              <Card style={styles.timelineCard}>
                <Card.Content>
                  <View style={styles.timelineCardHeader}>
                    <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                      {log.status}
                    </Text>
                    <Text variant="labelSmall" style={{ color: DESIGN.colors.muted }}>
                      {formatTime(log.timestamp)}
                    </Text>
                  </View>
                  <Text variant="bodySmall" style={styles.timelineLocation}>
                    📍 {log.location}
                  </Text>
                  {log.notes && (
                    <Text variant="bodySmall" style={{ marginTop: DESIGN.spacing.sm, color: DESIGN.colors.muted }}>
                      {log.notes}
                    </Text>
                  )}
                </Card.Content>
              </Card>
            </View>
          ))}
        </View>

        {/* Route Info */}
        <Card style={styles.routeCard}>
          <Card.Content>
            <Text variant="titleSmall" style={{ fontWeight: '600', marginBottom: DESIGN.spacing.md }}>
              Route
            </Text>
            <View style={styles.routeRow}>
              <View style={styles.routeEnd}>
                <MaterialIcons name="location-on" size={20} color={DESIGN.colors.primary} />
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                  From
                </Text>
                <Text variant="labelSmall" style={{ color: DESIGN.colors.muted }}>
                  {shipment.origin}
                </Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routeEnd}>
                <MaterialIcons name="location-on" size={20} color={DESIGN.colors.accent} />
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                  To
                </Text>
                <Text variant="labelSmall" style={{ color: DESIGN.colors.muted }}>
                  {shipment.destination}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Append Transport Log Button */}
        <Button
          mode="contained-tonal"
          icon="plus"
          onPress={handleAppendLog}
          style={styles.appendButton}
          contentStyle={styles.appendButtonContent}
        >
          Append Transport Log
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, padding: DESIGN.spacing.md },
  header: { marginBottom: DESIGN.spacing.md },
  overviewCard: { marginBottom: DESIGN.spacing.lg, backgroundColor: DESIGN.colors.surface },
  drugName: { fontWeight: '600', marginBottom: 4 },
  overviewGrid: { gap: DESIGN.spacing.md },
  overviewItem: { gap: 4 },
  timelineSection: { marginBottom: DESIGN.spacing.lg },
  timelineSectionTitle: { fontWeight: '600', marginBottom: DESIGN.spacing.md },
  timelineItem: { flexDirection: 'row', marginBottom: DESIGN.spacing.md },
  timelineLeft: { alignItems: 'center', marginRight: DESIGN.spacing.md },
  timelineDot: { width: 16, height: 16, borderRadius: 8 },
  timelineLine: { width: 3, height: 60, backgroundColor: '#e0e0e0', marginTop: 6 },
  timelineCard: { flex: 1, backgroundColor: DESIGN.colors.surface },
  timelineCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: DESIGN.spacing.sm },
  timelineLocation: { fontWeight: '500', color: DESIGN.colors.text },
  routeCard: { marginBottom: DESIGN.spacing.lg, backgroundColor: DESIGN.colors.surface },
  routeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  routeEnd: { alignItems: 'center', gap: 4 },
  routeLine: { flex: 1, height: 2, backgroundColor: '#e0e0e0', marginHorizontal: DESIGN.spacing.md },
  appendButton: { marginBottom: DESIGN.spacing.xl, backgroundColor: DESIGN.colors.primary },
  appendButtonContent: { paddingVertical: 8 },
});