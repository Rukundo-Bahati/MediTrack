import { useNavigation, useRoute } from '@react-navigation/native';
import { Truck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';
import { Colors } from '../../../constants/colors';

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

  useEffect(() => {
    // Mock transport logs
    const mockLogs: TransportLog[] = [
      {
        id: '1',
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
        location: shipment.origin,
        status: 'Dispatched',
        notes: 'Package prepared and dispatched from origin'
      },
      {
        id: '2',
        timestamp: Date.now() - 1000 * 60 * 60 * 12,
        location: 'Transit Hub',
        status: 'In Transit',
        notes: 'Package in transit through distribution center'
      },
      {
        id: '3',
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
        location: shipment.lastLocation,
        status: shipment.status === 'delivered' ? 'Delivered' : 'In Transit',
        notes: shipment.status === 'delivered' ? 'Package delivered successfully' : 'Package at current location'
      }
    ];
    setLogs(mockLogs);
  }, [shipment]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return Colors.accent;
      case 'in transit':
        return Colors.info;
      case 'dispatched':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Shipment Header */}
        <Card style={[styles.headerCard, { backgroundColor: Colors.white }]}>
          <Card.Content>
            <View style={styles.headerContent}>
              <Truck size={32} color={Colors.primary} />
              <View style={styles.headerInfo}>
                <Text variant="titleLarge" style={{ fontWeight: '700', color: Colors.text }}>
                  {shipment.drugName}
                </Text>
                <Text variant="bodyMedium" style={{ color: Colors.textSecondary, marginTop: 4 }}>
                  Batch: {shipment.batchId}
                </Text>
              </View>
              <Chip 
                style={{ backgroundColor: getStatusColor(shipment.status) + '20' }}
                textStyle={{ color: getStatusColor(shipment.status), fontWeight: '600' }}
              >
                {shipment.status.toUpperCase()}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Shipment Details */}
        <Card style={[styles.detailsCard, { backgroundColor: Colors.white }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: '600', marginBottom: 16, color: Colors.text }}>
              Shipment Details
            </Text>
            
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>Quantity</Text>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>{shipment.quantity} units</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>Origin</Text>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>{shipment.origin}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>Destination</Text>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>{shipment.destination}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>Last Location</Text>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>{shipment.lastLocation}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Transport Timeline */}
        <Card style={[styles.timelineCard, { backgroundColor: Colors.white }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: '600', marginBottom: 16, color: Colors.text }}>
              Transport Timeline
            </Text>
            
            {logs.map((log, index) => (
              <View key={log.id} style={styles.timelineItem}>
                <View style={styles.timelineDot}>
                  <View style={[styles.dot, { backgroundColor: getStatusColor(log.status) }]} />
                  {index < logs.length - 1 && <View style={styles.timelineLine} />}
                </View>
                
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text variant="bodyMedium" style={{ fontWeight: '600', color: Colors.text }}>
                      {log.location}
                    </Text>
                    <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </Text>
                  </View>
                  
                  <Chip 
                    style={{ 
                      backgroundColor: getStatusColor(log.status) + '20',
                      alignSelf: 'flex-start',
                      marginVertical: 4
                    }}
                    textStyle={{ color: getStatusColor(log.status), fontSize: 12 }}
                  >
                    {log.status}
                  </Chip>
                  
                  {log.notes && (
                    <Text variant="bodySmall" style={{ color: Colors.textSecondary, marginTop: 4 }}>
                      {log.notes}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => nav.goBack()}
            style={[styles.actionButton, { backgroundColor: Colors.primary }]}
            contentStyle={styles.actionButtonContent}
          >
            Back to Shipments
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  content: { 
    padding: 16,
    paddingBottom: 32
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  detailsCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  timelineCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    alignItems: 'center',
    marginRight: 12,
    width: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
});