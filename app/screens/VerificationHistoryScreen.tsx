import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Eye,
  History,
  Package,
  XCircle
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight
} from 'react-native-reanimated';
import { ModernButton } from '../../components/ui/modern-button';
import { ModernCard } from '../../components/ui/modern-card';
import { ModernInput } from '../../components/ui/modern-input';
import { ScreenLayout } from '../../components/ui/modern-layout';
import { Colors } from '../../constants/colors';
import { Shadows } from '../../constants/shadows';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface VerificationRecord {
  id: string;
  batchId: string;
  drugName: string;
  result: 'authentic' | 'suspicious' | 'expired';
  timestamp: string;
  scannedBy: string;
  notes?: string;
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All', description: 'Show all verifications', color: Colors.text },
  { value: 'authentic', label: 'Authentic', description: 'Verified genuine medicines', color: Colors.accent },
  { value: 'suspicious', label: 'Suspicious', description: 'Potentially counterfeit', color: Colors.danger },
  { value: 'expired', label: 'Expired', description: 'Past expiry date', color: Colors.warning },
];

export default function VerificationHistoryScreen() {
  const router = useRouter();
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<VerificationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerificationHistory();
  }, []);

  useEffect(() => {
    filterVerifications();
  }, [verifications, searchQuery, filterType]);

  const loadVerificationHistory = async () => {
    try {
      // Simulate loading verification history
      const mockVerifications: VerificationRecord[] = [
        {
          id: 'V001',
          batchId: 'BATCH-2025-001',
          drugName: 'Paracetamol 500mg',
          result: 'authentic',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          scannedBy: 'Pharmacist',
          notes: 'Customer verification'
        },
        {
          id: 'V002',
          batchId: 'BATCH-2025-002',
          drugName: 'Amoxicillin 250mg',
          result: 'suspicious',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          scannedBy: 'Pharmacist',
          notes: 'QR code appeared tampered'
        },
        {
          id: 'V003',
          batchId: 'BATCH-2024-089',
          drugName: 'Ibuprofen 400mg',
          result: 'expired',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          scannedBy: 'Pharmacist',
          notes: 'Expired 2 months ago'
        },
        {
          id: 'V004',
          batchId: 'BATCH-2025-003',
          drugName: 'Aspirin 100mg',
          result: 'authentic',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          scannedBy: 'Pharmacist'
        },
        {
          id: 'V005',
          batchId: 'BATCH-2025-004',
          drugName: 'Metformin 500mg',
          result: 'authentic',
          timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          scannedBy: 'Pharmacist',
          notes: 'Bulk verification'
        }
      ];

      setVerifications(mockVerifications);
    } catch (error) {
      console.error('Error loading verification history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVerifications = () => {
    let filtered = verifications;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(v => v.result === filterType);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(v =>
        v.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredVerifications(filtered);
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'authentic':
        return <CheckCircle size={20} color={Colors.accent} />;
      case 'suspicious':
        return <XCircle size={20} color={Colors.danger} />;
      case 'expired':
        return <AlertTriangle size={20} color={Colors.warning} />;
      default:
        return <Package size={20} color={Colors.textSecondary} />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'authentic':
        return Colors.accent;
      case 'suspicious':
        return Colors.danger;
      case 'expired':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const getStats = () => {
    const total = verifications.length;
    const authentic = verifications.filter(v => v.result === 'authentic').length;
    const suspicious = verifications.filter(v => v.result === 'suspicious').length;
    const expired = verifications.filter(v => v.result === 'expired').length;

    return { total, authentic, suspicious, expired };
  };

  const stats = getStats();

  const renderVerificationCard = (verification: VerificationRecord, index: number) => (
    <Animated.View
      key={verification.id}
      entering={SlideInRight.delay(index * 100)}
    >
      <ModernCard variant="elevated" style={styles.verificationCard}>
        <View style={styles.verificationHeader}>
          <View style={styles.resultIcon}>
            {getResultIcon(verification.result)}
          </View>
          <View style={styles.verificationInfo}>
            <Text style={styles.drugName}>{verification.drugName}</Text>
            <Text style={styles.batchId}>{verification.batchId}</Text>
            <Text style={styles.timestamp}>
              {new Date(verification.timestamp).toLocaleString()}
            </Text>
          </View>
          <View style={[
            styles.resultBadge,
            { backgroundColor: getResultColor(verification.result) + '20' }
          ]}>
            <Text style={[
              styles.resultText,
              { color: getResultColor(verification.result) }
            ]}>
              {verification.result.toUpperCase()}
            </Text>
          </View>
        </View>

        {verification.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{verification.notes}</Text>
          </View>
        )}

        <View style={styles.verificationFooter}>
          <View style={styles.scannedBy}>
            <Eye size={14} color={Colors.textSecondary} />
            <Text style={styles.scannedByText}>Scanned by {verification.scannedBy}</Text>
          </View>
        </View>
      </ModernCard>
    </Animated.View>
  );

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
            <History size={32} color={Colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Verification History</Text>
          <Text style={styles.subtitle}>
            Review past medicine scans and verification results
          </Text>
        </View>
      </Animated.View>

      {/* Stats */}
      <Animated.View
        entering={FadeInUp.delay(300)}
        style={styles.statsContainer}
      >
        <ModernCard variant="filled" style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </ModernCard>
        <ModernCard variant="filled" style={styles.statCard}>
          <Text style={[styles.statNumber, { color: Colors.accent }]}>{stats.authentic}</Text>
          <Text style={styles.statLabel}>Authentic</Text>
        </ModernCard>
        <ModernCard variant="filled" style={styles.statCard}>
          <Text style={[styles.statNumber, { color: Colors.danger }]}>{stats.suspicious}</Text>
          <Text style={styles.statLabel}>Suspicious</Text>
        </ModernCard>
      </Animated.View>

      {/* Search */}
      <Animated.View
        entering={FadeInUp.delay(400)}
        style={styles.searchContainer}
      >
        <ModernInput
          placeholder="Search by medicine name, batch ID, or notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View
        entering={FadeInUp.delay(500)}
        style={styles.filterContainer}
      >
        <View style={styles.filterTabs}>
          {FILTER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterTab,
                filterType === option.value && styles.filterTabActive,
                filterType === option.value && { backgroundColor: option.color + '15' }
              ]}
              onPress={() => setFilterType(option.value)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterTabText,
                filterType === option.value && styles.filterTabTextActive,
                filterType === option.value && { color: option.color }
              ]}>
                {option.label}
              </Text>
              {option.value !== 'all' && (
                <View style={[
                  styles.filterCount,
                  { backgroundColor: option.color }
                ]}>
                  <Text style={styles.filterCountText}>
                    {verifications.filter(v => v.result === option.value).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Verification List */}
      <View style={styles.listContainer}>
        {loading ? (
          <Animated.View entering={FadeInUp.delay(500)} style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading verification history...</Text>
          </Animated.View>
        ) : filteredVerifications.length === 0 ? (
          <Animated.View entering={FadeInUp.delay(500)} style={styles.emptyContainer}>
            <History size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>
              {searchQuery || filterType !== 'all' ? 'No verifications found' : 'No verification history yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || filterType !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Start scanning medicines to build your verification history'
              }
            </Text>
            {!searchQuery && filterType === 'all' && (
              <ModernButton
                title="Start Scanning"
                onPress={() => router.push('/scan')}
                variant="primary"
                size="medium"
                style={styles.emptyButton}
              />
            )}
          </Animated.View>
        ) : (
          <View style={styles.verificationsList}>
            {filteredVerifications.map((verification, index) =>
              renderVerificationCard(verification, index)
            )}
          </View>
        )}
      </View>
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
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
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
    gap: 8,
  },
  filterTab: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
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
  },
  filterTabTextActive: {
    fontWeight: '600',
  },
  filterCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  filterCountText: {
    ...Typography.caption,
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
  },

  // List Styles
  listContainer: {
    paddingHorizontal: Spacing.layout.container,
    paddingBottom: Spacing.xl,
  },

  // Verification Card Styles
  verificationsList: {
    gap: Spacing.md,
  },
  verificationCard: {
    marginBottom: 0,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  verificationInfo: {
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
    marginBottom: Spacing.xs,
  },
  timestamp: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  resultBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  resultText: {
    ...Typography.caption,
    fontWeight: '600',
  },

  // Notes Styles
  notesContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  notesLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  notesText: {
    ...Typography.bodySmall,
    color: Colors.text,
  },

  // Footer Styles
  verificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scannedBy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  scannedByText: {
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
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    minWidth: 200,
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