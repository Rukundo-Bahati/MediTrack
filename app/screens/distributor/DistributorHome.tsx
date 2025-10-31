import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Button, Text, Chip, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { DESIGN } from '../../lib/theme';

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

const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'ship_001',
    batchId: 'batch:abc123',
    drugName: 'Amoxicillin 500mg',
    quantity: 500,
    status: 'in_transit',
    origin: 'Manufacturer Lagos',
    destination: 'Distributor Hub Abuja',
    lastLocation: 'Warehouse A, Lagos',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'ship_002',
    batchId: 'batch:def456',
    drugName: 'Paracetamol 500mg',
    quantity: 1000,
    status: 'pending',
    origin: 'Manufacturer Kano',
    destination: 'Distributor Hub Lagos',
    lastLocation: 'In packaging',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'ship_003',
    batchId: 'batch:ghi789',
    drugName: 'Vitamin C 250mg',
    quantity: 2000,
    status: 'delivered',
    origin: 'Manufacturer Cairo',
    destination: 'Our Warehouse',
    lastLocation: 'Distributor Hub Abuja',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
];

export default function DistributorHome() {
  const nav = useNavigation();
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Simulate data refresh on screen focus
      setLoading(true);
      setTimeout(() => setLoading(false), 300);
    }, [])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return DESIGN.colors.warning;
      case 'in_transit':
        return DESIGN.colors.info;
      case 'delivered':
        return DESIGN.colors.accent;
      default:
        return DESIGN.colors.muted;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'schedule';
      case 'in_transit':
        return 'local-shipping';
      case 'delivered':
        return 'check-circle';
      default:
        return 'help';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  const countByStatus = (status: string) => shipments.filter(s => s.status === status).length;

  const handleScanShipment = () => {
    nav.navigate('Scan' as never);
  };

  const handleViewDetails = (shipment: Shipment) => {
    nav.navigate('ShipmentDetails' as never, { shipment } as never);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: DESIGN.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.title, { color: DESIGN.colors.primary }]}>
            Shipments
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: DESIGN.colors.muted }]}>
            Track & manage incoming batches
          </Text>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, { borderTopWidth: 4, borderTopColor: DESIGN.colors.info }]}>
            <Card.Content>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="local-shipping" size={28} color={DESIGN.colors.info} />
              </View>
              <Text variant="labelSmall" style={{ color: DESIGN.colors.muted, marginTop: DESIGN.spacing.sm }}>
                In Transit
              </Text>
              <Text variant="headlineSmall" style={{ fontWeight: '700', color: DESIGN.colors.text, marginTop: 4 }}>
                {countByStatus('in_transit')}
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { borderTopWidth: 4, borderTopColor: DESIGN.colors.warning }]}>
            <Card.Content>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="schedule" size={28} color={DESIGN.colors.warning} />
              </View>
              <Text variant="labelSmall" style={{ color: DESIGN.colors.muted, marginTop: DESIGN.spacing.sm }}>
                Pending
              </Text>
              <Text variant="headlineSmall" style={{ fontWeight: '700', color: DESIGN.colors.text, marginTop: 4 }}>
                {countByStatus('pending')}
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { borderTopWidth: 4, borderTopColor: DESIGN.colors.accent }]}>
            <Card.Content>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="check-circle" size={28} color={DESIGN.colors.accent} />
              </View>
              <Text variant="labelSmall" style={{ color: DESIGN.colors.muted, marginTop: DESIGN.spacing.sm }}>
                Delivered
              </Text>
              <Text variant="headlineSmall" style={{ fontWeight: '700', color: DESIGN.colors.text, marginTop: 4 }}>
                {countByStatus('delivered')}
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Primary CTA */}
        <Button
          mode="contained"
          icon="qr-code-scanner"
          onPress={handleScanShipment}
          style={[styles.scanButton, { backgroundColor: DESIGN.colors.primary }]}
          contentStyle={styles.scanButtonContent}
          labelStyle={styles.scanButtonLabel}
        >
          Scan & Add Transport Log
        </Button>

        {/* Shipments List Header */}
        <View style={styles.listHeader}>
          <Text variant="titleLarge" style={[styles.listTitle, { color: DESIGN.colors.text }]}>
            All Shipments
          </Text>
          <Text variant="labelSmall" style={{ color: DESIGN.colors.muted }}>
            {shipments.length} total
          </Text>
        </View>

        {/* Loading State */}
        {loading && <ActivityIndicator size="large" color={DESIGN.colors.primary} style={{ marginVertical: DESIGN.spacing.lg }} />}

        {/* Shipments List */}
        {!loading && (
          shipments.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <View style={styles.emptyContent}>
                  <MaterialIcons name="inbox" size={48} color={DESIGN.colors.muted} />
                  <Text variant="titleMedium" style={[{ color: DESIGN.colors.text, marginTop: DESIGN.spacing.md }]}>
                    No shipments
                  </Text>
                  <Text variant="bodySmall" style={[{ color: DESIGN.colors.muted, marginTop: DESIGN.spacing.sm, textAlign: 'center' }]}>
                    Incoming shipments will appear here
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ) : (
            shipments.map((shipment) => (
              <Card key={shipment.id} style={styles.shipmentCard}>
                <Card.Content>
                  {/* Card Header with Status */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardLeft}>
                      <View style={[styles.statusIconBg, { backgroundColor: getStatusColor(shipment.status) + '20' }]}>
                        <MaterialIcons
                          name={getStatusIcon(shipment.status)}
                          size={24}
                          color={getStatusColor(shipment.status)}
                        />
                      </View>
                      <View style={styles.cardTitle}>
                        <Text variant="titleSmall" numberOfLines={1} style={{ fontWeight: '600' }}>
                          {shipment.drugName}
                        </Text>
                        <Text variant="bodySmall" numberOfLines={1} style={{ color: DESIGN.colors.muted, marginTop: 2 }}>
                          {shipment.batchId}
                        </Text>
                      </View>
                    </View>
                    <Chip
                      label={getStatusLabel(shipment.status)}
                      style={{ backgroundColor: getStatusColor(shipment.status) }}
                      textStyle={{ color: '#fff', fontSize: 10, fontWeight: '600' }}
                      icon={() => <MaterialIcons name={getStatusIcon(shipment.status)} size={14} color="#fff" />}
                    />
                  </View>

                  {/* Card Details */}
                  <View style={styles.cardDetails}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <Text variant="labelSmall" style={{ color: DESIGN.colors.muted }}>Qty</Text>
                        <Text variant="bodySmall" style={{ fontWeight: '600', marginTop: 4 }}>{shipment.quantity} units</Text>
                      </View>
                      <View style={styles.detailDivider} />
                      <View style={styles.detailItem}>
                        <Text variant="labelSmall" style={{ color: DESIGN.colors.muted }}>Last Location</Text>
                        <Text variant="bodySmall" numberOfLines={1} style={{ fontWeight: '600', marginTop: 4, maxWidth: 140 }}>
                          {shipment.lastLocation}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Card Actions */}
                  <View style={styles.cardFooter}>
                    <Button
                      mode="contained-tonal"
                      size="small"
                      icon="eye"
                      onPress={() => handleViewDetails(shipment)}
                      contentStyle={{ paddingHorizontal: 8 }}
                    >
                      View Details
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: DESIGN.spacing.xl },
  header: {
    paddingHorizontal: DESIGN.spacing.md,
    paddingVertical: DESIGN.spacing.lg,
  },
  title: {
    fontWeight: '700',
    marginBottom: DESIGN.spacing.sm,
  },
  subtitle: { },
  statsGrid: {
    flexDirection: 'row',
    gap: DESIGN.spacing.sm,
    paddingHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: DESIGN.colors.surface,
    borderRadius: DESIGN.radii.md,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: DESIGN.radii.md,
    backgroundColor: DESIGN.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    marginHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
    borderRadius: DESIGN.radii.lg,
  },
  scanButtonContent: {
    paddingVertical: 10,
  },
  scanButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.md,
  },
  listTitle: {
    fontWeight: '600',
  },
  emptyCard: {
    marginHorizontal: DESIGN.spacing.md,
    backgroundColor: DESIGN.colors.surface,
    borderRadius: DESIGN.radii.lg,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: DESIGN.spacing.xl,
  },
  shipmentCard: {
    marginHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.md,
    backgroundColor: DESIGN.colors.surface,
    borderRadius: DESIGN.radii.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN.spacing.md,
  },
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN.spacing.md,
  },
  statusIconBg: {
    width: 48,
    height: 48,
    borderRadius: DESIGN.radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
  },
  cardDetails: {
    marginBottom: DESIGN.spacing.md,
    backgroundColor: DESIGN.colors.surfaceVariant,
    borderRadius: DESIGN.radii.md,
    padding: DESIGN.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailDivider: {
    width: 1,
    height: 30,
    backgroundColor: DESIGN.colors.outline,
    marginHorizontal: DESIGN.spacing.md,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: DESIGN.colors.outline,
    paddingTop: DESIGN.spacing.md,
  },
});