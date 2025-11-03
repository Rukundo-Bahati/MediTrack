import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Dialog, Portal, Text } from 'react-native-paper';
import { Colors } from '../../../constants/colors';

interface Incident {
  id: string;
  batchId: string;
  drugName: string;
  reportedBy: string;
  reason: string;
  timestamp: number;
  status: 'pending' | 'investigating' | 'resolved';
  severity: 'low' | 'medium' | 'high';
  location: string;
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc_001',
    batchId: 'batch:fake123',
    drugName: 'Amoxicillin 500mg',
    reportedBy: 'Pharmacist - Lagos',
    reason: 'Package damaged, batch not found on blockchain',
    timestamp: Date.now() - 1000 * 60 * 30,
    status: 'pending',
    severity: 'high',
    location: 'Lagos, Nigeria',
  },
  {
    id: 'inc_002',
    batchId: 'batch:suspicious456',
    drugName: 'Paracetamol 500mg',
    reportedBy: 'Consumer - Abuja',
    reason: 'QR code verification failed multiple times',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    status: 'investigating',
    severity: 'medium',
    location: 'Abuja, Nigeria',
  },
  {
    id: 'inc_003',
    batchId: 'batch:resolved789',
    drugName: 'Vitamin C 250mg',
    reportedBy: 'Distributor - Kano',
    reason: 'Counterfeit packaging detected during inspection',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    status: 'resolved',
    severity: 'high',
    location: 'Kano, Nigeria',
  },
];

export default function IncidentsScreen() {
  const nav = useNavigation();
  const [incidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [filter, setFilter] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const filteredIncidents = filter === 'all' 
    ? incidents 
    : incidents.filter(inc => inc.status === filter);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return Colors.danger;
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#2196F3';
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'investigating':
        return '#FFA500';
      case 'resolved':
        return Colors.accent;
      default:
        return Colors.textSecondary;
    }
  };

  const openIncidentDetails = (incident: Incident) => {
    setSelectedIncident(incident);
    setDialogVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Incident Reports
          </Text>
          <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>
            {filteredIncidents.length} incident(s)
          </Text>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterSection}>
          {['all', 'pending', 'investigating', 'resolved'].map((status) => (
            <Chip
              key={status}
              selected={filter === status}
              onPress={() => setFilter(status)}
              style={[
                styles.filterChip,
                { backgroundColor: filter === status ? Colors.primary : '#e0e0e0' },
              ]}
              textStyle={{ color: filter === status ? '#fff' : Colors.text }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Chip>
          ))}
        </View>

        {/* Incidents List */}
        <View style={styles.incidentsList}>
          {filteredIncidents.map((incident) => (
            <Card
              key={incident.id}
              style={styles.incidentCard}
              onPress={() => openIncidentDetails(incident)}
            >
              <Card.Content>
                <View style={styles.incidentHeader}>
                  <View style={styles.incidentTitleSection}>
                    <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                      {incident.drugName}
                    </Text>
                    <Text variant="bodySmall" style={{ color: Colors.textSecondary }}>
                      {incident.batchId}
                    </Text>
                  </View>
                  <View style={styles.incidentBadges}>
                    <Chip
                      style={{ backgroundColor: getSeverityColor(incident.severity) + '20' }}
                      textStyle={{ color: getSeverityColor(incident.severity), fontSize: 10 }}
                    >
                      {incident.severity.toUpperCase()}
                    </Chip>
                    <Chip
                      style={{ backgroundColor: getStatusColor(incident.status) + '20' }}
                      textStyle={{ color: getStatusColor(incident.status), fontSize: 10 }}
                    >
                      {incident.status.toUpperCase()}
                    </Chip>
                  </View>
                </View>

                <View style={styles.incidentBody}>
                  <View style={styles.incidentRow}>
                    <User size={16} color={Colors.textSecondary} />
                    <Text variant="bodySmall" style={{ flex: 1, marginLeft: 8 }}>
                      {incident.reportedBy}
                    </Text>
                  </View>
                  <View style={styles.incidentRow}>
                    <MapPin size={16} color={Colors.textSecondary} />
                    <Text variant="bodySmall" style={{ flex: 1, marginLeft: 8 }}>
                      {incident.location}
                    </Text>
                  </View>
                  <View style={styles.incidentRow}>
                    <Info size={16} color={Colors.textSecondary} />
                    <Text variant="bodySmall" style={{ flex: 1, marginLeft: 8 }}>
                      {incident.reason}
                    </Text>
                  </View>
                </View>

                <View style={styles.incidentFooter}>
                  <Text variant="labelSmall" style={{ color: Colors.textSecondary }}>
                    {new Date(incident.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Incident Details Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Incident Details</Dialog.Title>
          {selectedIncident && (
            <Dialog.Content>
              <View style={styles.detailItem}>
                <Text variant="labelSmall" style={{ color: Colors.textSecondary }}>Batch ID</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{selectedIncident.batchId}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="labelSmall" style={{ color: Colors.textSecondary }}>Drug Name</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{selectedIncident.drugName}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="labelSmall" style={{ color: Colors.textSecondary }}>Reported By</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{selectedIncident.reportedBy}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="labelSmall" style={{ color: Colors.textSecondary }}>Reason</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{selectedIncident.reason}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="labelSmall" style={{ color: Colors.textSecondary }}>Location</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{selectedIncident.location}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="labelSmall" style={{ color: Colors.textSecondary }}>Status</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{selectedIncident.status}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="labelSmall" style={{ color: Colors.textSecondary }}>Severity</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{selectedIncident.severity}</Text>
              </View>
            </Dialog.Content>
          )}
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, padding: 16 },
  header: { marginBottom: 24 },
  title: { fontWeight: '600', marginBottom: 8 },
  filterSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  filterChip: { borderRadius: 12 },
  incidentsList: { gap: 16 },
  incidentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  incidentTitleSection: { flex: 1 },
  incidentBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  incidentBody: { marginBottom: 12 },
  incidentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  incidentFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 12,
  },
  detailItem: {
    marginBottom: 16,
  },
});