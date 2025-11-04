import { useRouter } from 'expo-router';
import { AlertTriangle, ArrowLeft, Eye, Info, MapPin, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { ModernButton } from '../../../components/ui/modern-button';
import { ModernCard } from '../../../components/ui/modern-card';
import { ScreenLayout } from '../../../components/ui/modern-layout';
import { Colors } from '../../../constants/colors';
import { Shadows } from '../../../constants/shadows';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

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
  const router = useRouter();
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
    <ScreenLayout scrollable style={styles.container}>
      {/* Back Button */}
      <Animated.View
        entering={FadeInDown.delay(100)}
        style={styles.backButtonContainer}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)');
            }
          }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.text} strokeWidth={2} />
        </TouchableOpacity>
      </Animated.View>

      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(200)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <AlertTriangle size={32} color={Colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Incident Reports</Text>
          <Text style={styles.subtitle}>
            {filteredIncidents.length} incident(s) requiring attention
          </Text>
        </View>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View
        entering={FadeInUp.delay(300)}
        style={styles.filterContainer}
      >
        <View style={styles.filterTabs}>
          {['all', 'pending', 'investigating', 'resolved'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                filter === status && styles.filterTabActive,
                filter === status && { backgroundColor: getStatusColor(status) + '15' }
              ]}
              onPress={() => setFilter(status)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterTabText,
                filter === status && styles.filterTabTextActive,
                filter === status && { color: getStatusColor(status) }
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
              {status !== 'all' && (
                <View style={[
                  styles.filterCount,
                  { backgroundColor: getStatusColor(status) }
                ]}>
                  <Text style={styles.filterCountText}>
                    {incidents.filter(i => i.status === status).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Incidents List */}
      <View style={styles.listContainer}>
        {filteredIncidents.length === 0 ? (
          <Animated.View entering={FadeInUp.delay(400)} style={styles.emptyContainer}>
            <AlertTriangle size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>No incidents found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all' 
                ? 'No incidents have been reported yet'
                : `No ${filter} incidents at this time`
              }
            </Text>
          </Animated.View>
        ) : (
          <View style={styles.incidentsList}>
            {filteredIncidents.map((incident, index) => (
              <Animated.View
                key={incident.id}
                entering={SlideInRight.delay(400 + index * 100)}
              >
                <TouchableOpacity
                  onPress={() => openIncidentDetails(incident)}
                  activeOpacity={0.7}
                >
                  <ModernCard variant="elevated" style={styles.incidentCard}>
                    <View style={styles.incidentHeader}>
                      <View style={styles.severityIcon}>
                        <AlertTriangle 
                          size={20} 
                          color={getSeverityColor(incident.severity)} 
                        />
                      </View>
                      <View style={styles.incidentTitleSection}>
                        <Text style={styles.drugName}>{incident.drugName}</Text>
                        <Text style={styles.batchId}>{incident.batchId}</Text>
                      </View>
                      <View style={styles.incidentBadges}>
                        <View style={[
                          styles.severityBadge,
                          { backgroundColor: getSeverityColor(incident.severity) + '20' }
                        ]}>
                          <Text style={[
                            styles.badgeText,
                            { color: getSeverityColor(incident.severity) }
                          ]}>
                            {incident.severity.toUpperCase()}
                          </Text>
                        </View>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(incident.status) + '20' }
                        ]}>
                          <Text style={[
                            styles.badgeText,
                            { color: getStatusColor(incident.status) }
                          ]}>
                            {incident.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.incidentBody}>
                      <View style={styles.incidentRow}>
                        <User size={16} color={Colors.textSecondary} />
                        <Text style={styles.incidentRowText}>
                          {incident.reportedBy}
                        </Text>
                      </View>
                      <View style={styles.incidentRow}>
                        <MapPin size={16} color={Colors.textSecondary} />
                        <Text style={styles.incidentRowText}>
                          {incident.location}
                        </Text>
                      </View>
                      <View style={styles.incidentRow}>
                        <Info size={16} color={Colors.textSecondary} />
                        <Text style={styles.incidentRowText}>
                          {incident.reason}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.incidentFooter}>
                      <View style={styles.timestampContainer}>
                        <Eye size={14} color={Colors.textSecondary} />
                        <Text style={styles.timestamp}>
                          {new Date(incident.timestamp).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </ModernCard>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </View>

      {/* Incident Details Modal */}
      {dialogVisible && selectedIncident && (
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={FadeInUp}
            style={styles.modalContainer}
          >
            <ModernCard variant="elevated" style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Incident Details</Text>
                <TouchableOpacity
                  onPress={() => setDialogVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Batch ID</Text>
                  <Text style={styles.detailValue}>{selectedIncident.batchId}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Drug Name</Text>
                  <Text style={styles.detailValue}>{selectedIncident.drugName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Reported By</Text>
                  <Text style={styles.detailValue}>{selectedIncident.reportedBy}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Reason</Text>
                  <Text style={styles.detailValue}>{selectedIncident.reason}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{selectedIncident.location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={[styles.detailValue, { color: getStatusColor(selectedIncident.status) }]}>
                    {selectedIncident.status.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Severity</Text>
                  <Text style={[styles.detailValue, { color: getSeverityColor(selectedIncident.severity) }]}>
                    {selectedIncident.severity.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.modalActions}>
                <ModernButton
                  title="Close"
                  onPress={() => setDialogVisible(false)}
                  variant="secondary"
                  size="medium"
                  style={styles.modalButton}
                />
              </View>
            </ModernCard>
          </Animated.View>
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Back Button Styles
  backButtonContainer: {
    paddingHorizontal: Spacing.layout.container,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.subtle,
  },

  // Header Styles
  header: {
    paddingHorizontal: Spacing.layout.container,
    paddingVertical: Spacing.lg,
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
    marginBottom: Spacing.md,
    ...Shadows.subtle,
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
  },

  // Filter Styles
  filterContainer: {
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  filterTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTab: {
    flex: 1,
    minWidth: '22%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 4,
  },
  filterTabActive: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    ...Shadows.soft,
  },
  filterTabText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 11,
  },
  filterTabTextActive: {
    fontWeight: '600',
  },
  filterCount: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterCountText: {
    ...Typography.caption,
    color: Colors.white,
    fontSize: 9,
    fontWeight: '600',
  },

  // List Styles
  listContainer: {
    paddingHorizontal: Spacing.layout.container,
    paddingBottom: Spacing.xl,
  },
  incidentsList: {
    gap: Spacing.md,
  },

  // Incident Card Styles
  incidentCard: {
    marginBottom: 0,
  },
  incidentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  severityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  incidentTitleSection: {
    flex: 1,
  },
  drugName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  batchId: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  incidentBadges: {
    gap: Spacing.xs,
  },
  severityBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 10,
  },

  // Incident Body Styles
  incidentBody: {
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  incidentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  incidentRowText: {
    ...Typography.bodySmall,
    color: Colors.text,
    flex: 1,
  },

  // Incident Footer Styles
  incidentFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timestamp: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  // Empty State Styles
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalCard: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    ...Typography.h2,
    color: Colors.textSecondary,
  },
  modalContent: {
    marginBottom: Spacing.lg,
  },
  detailItem: {
    marginBottom: Spacing.md,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
  },
  modalActions: {
    alignItems: 'center',
  },
  modalButton: {
    minWidth: 120,
  },
});