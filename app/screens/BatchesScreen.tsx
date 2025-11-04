import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Calendar,
    Hash,
    Layers,
    Package
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    BounceIn,
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
import { useAuth } from '../context/AuthContext';

interface Batch {
  id: string;
  drugName: string;
  lot: string;
  expiry: string;
  txHash: string;
  createdAt: number;
}

export default function BatchesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    filterBatches();
  }, [batches, searchQuery]);

  const loadBatches = async () => {
    try {
      const raw = await AsyncStorage.getItem('medi_batches');
      const batchesData = raw ? JSON.parse(raw) : [];
      setBatches(batchesData);
    } catch (error) {
      console.error('Error loading batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBatches = () => {
    if (!searchQuery.trim()) {
      setFilteredBatches(batches);
      return;
    }
    
    const filtered = batches.filter(batch =>
      batch.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.lot.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBatches(filtered);
  };

  const handleDownloadQR = (batchId: string) => {
    Alert.alert('Success', `QR code for ${batchId} ready to download`);
  };

  const handleShareQR = (batchId: string) => {
    Alert.alert('Success', `QR code shared for ${batchId}`);
  };

  const renderBatchCard = (batch: Batch, index: number) => (
    <Animated.View
      key={batch.id}
      entering={SlideInRight.delay(index * 100)}
    >
      <ModernCard variant="elevated" style={styles.batchCard}>
        <View style={styles.batchHeader}>
          <View style={styles.batchIcon}>
            <Package size={24} color={Colors.primary} />
          </View>
          <View style={styles.batchInfo}>
            <Text style={styles.batchName}>{batch.drugName}</Text>
            <Text style={styles.batchId}>{batch.id}</Text>
            <Text style={styles.batchDate}>
              {new Date(batch.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>
        </View>

        <View style={styles.batchDetails}>
          <View style={styles.detailRow}>
            <Hash size={16} color={Colors.textSecondary} />
            <Text style={styles.detailLabel}>Lot Number:</Text>
            <Text style={styles.detailValue}>{batch.lot}</Text>
          </View>
          <View style={styles.detailRow}>
            <Calendar size={16} color={Colors.textSecondary} />
            <Text style={styles.detailLabel}>Expiry Date:</Text>
            <Text style={styles.detailValue}>{batch.expiry}</Text>
          </View>
          <View style={styles.detailRow}>
            <Layers size={16} color={Colors.textSecondary} />
            <Text style={styles.detailLabel}>Blockchain:</Text>
            <Text style={styles.detailValueMono}>{batch.txHash.slice(0, 16)}...</Text>
          </View>
        </View>

        <View style={styles.batchActions}>
          <ModernButton
            title="Download QR"
            onPress={() => handleDownloadQR(batch.id)}
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
          <ModernButton
            title="Share QR"
            onPress={() => handleShareQR(batch.id)}
            variant="ghost"
            size="small"
            style={styles.actionButton}
          />
        </View>
      </ModernCard>
    </Animated.View>
  );

  return (
    <ScreenLayout style={styles.container}>
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
            <Package size={32} color={Colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.title}>My Batches</Text>
          <Text style={styles.subtitle}>
            Manage and track your registered medicine batches
          </Text>
        </View>

        {user?.role === 'manufacturer' && (
          <Animated.View entering={BounceIn.delay(400)}>
            <ModernButton
              title="Register New Batch"
              onPress={() => router.push('/register-batch')}
              variant="primary"
              size="medium"
              style={styles.addButton}
            />
          </Animated.View>
        )}
      </Animated.View>

      {/* Search Bar */}
      <Animated.View 
        entering={FadeInUp.delay(300)}
        style={styles.searchContainer}
      >
        <ModernInput
          placeholder="Search batches by name, ID, or lot number..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </Animated.View>

      {/* Stats */}
      <Animated.View 
        entering={FadeInUp.delay(400)}
        style={styles.statsContainer}
      >
        <ModernCard variant="filled" style={styles.statCard}>
          <Text style={styles.statNumber}>{batches.length}</Text>
          <Text style={styles.statLabel}>Total Batches</Text>
        </ModernCard>
        <ModernCard variant="filled" style={styles.statCard}>
          <Text style={styles.statNumber}>{filteredBatches.length}</Text>
          <Text style={styles.statLabel}>Showing</Text>
        </ModernCard>
      </Animated.View>

      {/* Batches List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Animated.View entering={FadeInUp.delay(500)} style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading batches...</Text>
          </Animated.View>
        ) : filteredBatches.length === 0 ? (
          <Animated.View entering={FadeInUp.delay(500)} style={styles.emptyContainer}>
            <Package size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No batches found' : 'No batches registered yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Register your first batch to get started'
              }
            </Text>
            {!searchQuery && user?.role === 'manufacturer' && (
              <ModernButton
                title="Register First Batch"
                onPress={() => router.push('/register-batch')}
                variant="primary"
                size="medium"
                style={styles.emptyButton}
              />
            )}
          </Animated.View>
        ) : (
          <View style={styles.batchesList}>
            {filteredBatches.map((batch, index) => renderBatchCard(batch, index))}
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
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
    marginBottom: Spacing.lg,
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
  addButton: {
    alignSelf: 'center',
  },

  // Search Styles
  searchContainer: {
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  searchInput: {
    marginBottom: 0,
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
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

  // Scroll Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.layout.container,
    paddingBottom: Spacing.xl,
  },

  // Batch Card Styles
  batchesList: {
    gap: Spacing.md,
  },
  batchCard: {
    marginBottom: 0,
  },
  batchHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  batchIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  batchInfo: {
    flex: 1,
  },
  batchName: {
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
  batchDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '600',
  },

  // Detail Styles
  batchDetails: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    minWidth: 80,
  },
  detailValue: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },
  detailValueMono: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '500',
    fontFamily: 'monospace',
    flex: 1,
  },

  // Action Styles
  batchActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
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