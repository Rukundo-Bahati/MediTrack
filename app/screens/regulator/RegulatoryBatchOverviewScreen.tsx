import { useRouter } from 'expo-router';
import { AlertTriangle, CheckCircle, Clock, Flag, Package, Shield, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { ModernButton } from '../../../components/ui/modern-button';
import { ModernCard } from '../../../components/ui/modern-card';
import { ModernInput } from '../../../components/ui/modern-input';
import { ScreenLayout } from '../../../components/ui/modern-layout';
import { ModernNavbar } from '../../../components/ui/modern-navbar';
import { Colors } from '../../../constants/colors';
import { Shadows } from '../../../constants/shadows';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

interface RegulatoryBatch {
  id: string;
  batchId: string;
  drugName: string;
  manufacturer: string;
  currentLocation: string;
  status: 'approved' | 'pending' | 'flagged' | 'recalled';
  complianceStatus: 'compliant' | 'under_review' | 'non_compliant';
  registrationDate: string;
  expiryDate: string;
  quantity: number;
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high';
  alerts: number;
}

const MOCK_REGULATORY_BATCHES: RegulatoryBatch[] = [
  {
    id: 'reg_001',
    batchId: 'BATCH-2025-001',
    drugName: 'Paracetamol 500mg',
    manufacturer: 'PharmaCorp Ltd.',
    currentLocation: 'City Pharmacy Network',
    status: 'approved',
    complianceStatus: 'compliant',
    registrationDate: '2025-01-15T10:30:00Z',
    expiryDate: '2026-01-15',
    quantity: 10000,
    lastActivity: '2025-01-16T14:20:00Z',
    riskLevel: 'low',
    alerts: 0
  },
  {
    id: 'reg_002',
    batchId: 'BATCH-2025-002',
    drugName: 'Amoxicillin 250mg',
    manufacturer: 'MediPharma Inc.',
    currentLocation: 'Regional Distribution Center',
    status: 'flagged',
    complianceStatus: 'under_review',
    registrationDate: '2025-01-14T09:15:00Z',
    expiryDate: '2025-12-20',
    quantity: 5000,
    lastActivity: '2025-01-16T11:45:00Z',
    riskLevel: 'high',
    alerts: 3
  },
  {
    id: 'reg_003',
    batchId: 'BATCH-2025-003',
    drugName: 'Ibuprofen 400mg',
    manufacturer: 'HealthCorp Solutions',
    currentLocation: 'Metro Pharmacy Chain',
    status: 'pending',
    complianceStatus: 'under_review',
    registrationDate: '2025-01-13T16:45:00Z',
    expiryDate: '2026-06-30',
    quantity: 7500,
    lastActivity: '2025-01-15T08:30:00Z',
    riskLevel: 'medium',
    alerts: 1
  },
  {
    id: 'reg_004',
    batchId: 'BATCH-2024-089',
    drugName: 'Aspirin 100mg',
    manufacturer: 'Global Pharma Ltd.',
    currentLocation: 'Hospital Network',
    status: 'recalled',
    complianceStatus: 'non_compliant',
    registrationDate: '2024-12-20T14:20:00Z',
    expiryDate: '2025-12-20',
    quantity: 15000,
    lastActivity: '2025-01-14T16:00:00Z',
    riskLevel: 'high',
    alerts: 8
  }
];

const STATUS_FILTERS = [
  { value: 'all', label: 'All Batches', color: Colors.text },
  { value: 'approved', label: 'Approved', color: Colors.success },
  { value: 'pending', label: 'Pending', color: Colors.warning },
  { value: 'flagged', label: 'Flagged', color: Colors.danger },
  { value: 'recalled', label: 'Recalled', color: Colors.error },
];

export default function RegulatoryBatchOverviewScreen() {
  const router = useRouter();
  const [batches, setBatches] = useState<RegulatoryBatch[]>(MOCK_REGULATORY_BATCHES);
  const [filteredBatches, setFilteredBatches] = useState<RegulatoryBatch[]>(MOCK_REGULATORY_BATCHES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    filterBatches();
  }, [batches, searchQuery, statusFilter]);

  const filterBatches = () => {
    let filtered = batches;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(batch => batch.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(batch =>
        batch.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBatches(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'flagged': return Flag;
      case 'recalled': return XCircle;
      default: return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return Colors.success;
      case 'pending': return Colors.warning;
      case 'flagged': return Colors.danger;
      case 'recalled': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return Colors.success;
      case 'medium': return Colors.warning;
      case 'high': return Colors.danger;
      default: return Colors.textSecondary;
    }
  };

  const handleBatchAction = (batchId: string, action: 'flag' | 'approve' | 'recall') => {
    setBatches(prev => prev.map(batch => {
      if (batch.id === batchId) {
        switch (action) {
          case 'flag':
            return { ...batch, status: 'flagged' as const, riskLevel: 'high' as const };
          case 'approve':
            return { ...batch, status: 'approved' as const, complianceStatus: 'compliant' as const };
          case 'recall':
            return { ...batch, status: 'recalled' as const, complianceStatus: 'non_compliant' as const };
          default:
            return batch;
        }
      }
      return batch;
    }));
  };

  const getStats = () => {
    const total = batches.length;
    const approved = batches.filter(b => b.status === 'approved').length;
    const pending = batches.filter(b => b.status === 'pending').length;
    const flagged = batches.filter(b => b.status === 'flagged').length;
    const recalled = batches.filter(b => b.status === 'recalled').length;
    const highRisk = batches.filter(b => b.riskLevel === 'high').length;

    return { total, approved, pending, flagged, recalled, highRisk };
  };

  const stats = getStats();

  return (
    <View style={styles.container}>
      <ModernNavbar 
        title="Regulatory Batch Overview" 
        showBackButton={true}
        onBackPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)');
          }
        }}
      />
      <ScreenLayout scrollable style={styles.scrollContainer}>
        {/* Stats Overview */}
        <Animated.View 
          entering={FadeInDown.delay(100)}
          style={styles.statsContainer}
        >
          <ModernCard variant="filled" style={styles.statCard}>
            <Shield size={20} color={Colors.primary} />
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Batches</Text>
          </ModernCard>
          <ModernCard variant="filled" style={styles.statCard}>
            <CheckCircle size={20} color={Colors.success} />
            <Text style={[styles.statNumber, { color: Colors.success }]}>{stats.approved}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </ModernCard>
          <ModernCard variant="filled" style={styles.statCard}>
            <AlertTriangle size={20} color={Colors.danger} />
            <Text style={[styles.statNumber, { color: Colors.danger }]}>{stats.highRisk}</Text>
            <Text style={styles.statLabel}>High Risk</Text>
          </ModernCard>
        </Animated.View>

        {/* Search */}
        <Animated.View
          entering={FadeInUp.delay(200)}
          style={styles.searchContainer}
        >
          <ModernInput
            placeholder="Search by batch ID, drug name, or manufacturer..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchInput}
          />
        </Animated.View>

        {/* Status Filter */}
        <Animated.View
          entering={FadeInUp.delay(300)}
          style={styles.filterContainer}
        >
          <View style={styles.filterTabs}>
            {STATUS_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterTab,
                  statusFilter === filter.value && styles.filterTabActive,
                  statusFilter === filter.value && { backgroundColor: filter.color + '15' }
                ]}
                onPress={() => setStatusFilter(filter.value)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterTabText,
                  statusFilter === filter.value && styles.filterTabTextActive,
                  statusFilter === filter.value && { color: filter.color }
                ]}>
                  {filter.label}
                </Text>
                {filter.value !== 'all' && (
                  <View style={[
                    styles.filterCount,
                    { backgroundColor: filter.color }
                  ]}>
                    <Text style={styles.filterCountText}>
                      {batches.filter(b => b.status === filter.value).length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Batches List */}
        <View style={styles.listContainer}>
          {loading ? (
            <Animated.View entering={FadeInUp.delay(400)} style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading regulatory data...</Text>
            </Animated.View>
          ) : filteredBatches.length === 0 ? (
            <Animated.View entering={FadeInUp.delay(400)} style={styles.emptyContainer}>
              <Package size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>No batches found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter'
                  : 'No batches registered in the system yet'
                }
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.batchesList}>
              {filteredBatches.map((batch, index) => {
                const StatusIcon = getStatusIcon(batch.status);
                const statusColor = getStatusColor(batch.status);
                const riskColor = getRiskColor(batch.riskLevel);
                
                return (
                  <Animated.View
                    key={batch.id}
                    entering={SlideInRight.delay(400 + index * 100)}
                  >
                    <ModernCard variant="elevated" style={styles.batchCard}>
                      <View style={styles.batchHeader}>
                        <View style={[
                          styles.statusIcon,
                          { backgroundColor: statusColor + '20' }
                        ]}>
                          <StatusIcon size={20} color={statusColor} />
                        </View>
                        <View style={styles.batchInfo}>
                          <Text style={styles.batchId}>{batch.batchId}</Text>
                          <Text style={styles.drugName}>{batch.drugName}</Text>
                          <Text style={styles.manufacturer}>{batch.manufacturer}</Text>
                        </View>
                        <View style={styles.badges}>
                          <View style={[
                            styles.statusBadge,
                            { backgroundColor: statusColor + '20' }
                          ]}>
                            <Text style={[
                              styles.badgeText,
                              { color: statusColor }
                            ]}>
                              {batch.status.toUpperCase()}
                            </Text>
                          </View>
                          <View style={[
                            styles.riskBadge,
                            { backgroundColor: riskColor + '20' }
                          ]}>
                            <Text style={[
                              styles.badgeText,
                              { color: riskColor }
                            ]}>
                              {batch.riskLevel.toUpperCase()} RISK
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.batchDetails}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Current Location:</Text>
                          <Text style={styles.detailValue}>{batch.currentLocation}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Quantity:</Text>
                          <Text style={styles.detailValue}>{batch.quantity.toLocaleString()} units</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Expiry Date:</Text>
                          <Text style={styles.detailValue}>{new Date(batch.expiryDate).toLocaleDateString()}</Text>
                        </View>
                        {batch.alerts > 0 && (
                          <View style={styles.alertRow}>
                            <AlertTriangle size={16} color={Colors.danger} />
                            <Text style={styles.alertText}>
                              {batch.alerts} active alert{batch.alerts > 1 ? 's' : ''}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.batchActions}>
                        <ModernButton
                          title="View Details"
                          onPress={() => {/* Navigate to detailed view */}}
                          variant="secondary"
                          size="small"
                          style={styles.actionButton}
                        />
                        {batch.status === 'pending' && (
                          <ModernButton
                            title="Approve"
                            onPress={() => handleBatchAction(batch.id, 'approve')}
                            variant="primary"
                            size="small"
                            style={styles.actionButton}
                          />
                        )}
                        {batch.status === 'approved' && (
                          <ModernButton
                            title="Flag"
                            onPress={() => handleBatchAction(batch.id, 'flag')}
                            variant="secondary"
                            size="small"
                            style={[styles.actionButton, { borderColor: Colors.warning }] as any}
                          />
                        )}
                        {(batch.status === 'flagged' || batch.riskLevel === 'high') && (
                          <ModernButton
                            title="Recall"
                            onPress={() => handleBatchAction(batch.id, 'recall')}
                            variant="secondary"
                            size="small"
                            style={[styles.actionButton, { borderColor: Colors.danger }] as any}
                          />
                        )}
                      </View>
                    </ModernCard>
                  </Animated.View>
                );
              })}
            </View>
          )}
        </View>
      </ScreenLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContainer: {
    flex: 1,
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  statNumber: {
    ...Typography.h3,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Search Styles
  searchContainer: {
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },

  // Filter Styles
  filterContainer: {
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  filterTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 4,
    minWidth: 80,
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
  batchesList: {
    gap: Spacing.md,
  },

  // Batch Card Styles
  batchCard: {
    marginBottom: 0,
  },
  batchHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  batchInfo: {
    flex: 1,
  },
  batchId: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontFamily: 'monospace',
    marginBottom: Spacing.xs,
  },
  drugName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  manufacturer: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  badges: {
    gap: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 10,
  },

  // Details Styles
  batchDetails: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  detailValue: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  alertText: {
    ...Typography.bodySmall,
    color: Colors.danger,
    fontWeight: '500',
  },

  // Actions Styles
  batchActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 80,
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

  // Loading Styles
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});