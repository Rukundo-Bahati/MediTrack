import { useRouter } from 'expo-router';
import { Activity, AlertTriangle, CheckCircle, Clock, Eye, FileText, Package } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { ModernCard } from '../../../components/ui/modern-card';
import { ScreenLayout } from '../../../components/ui/modern-layout';
import { ModernNavbar } from '../../../components/ui/modern-navbar';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

interface ActivityItem {
  id: string;
  type: 'batch_registered' | 'batch_transferred' | 'report_filed' | 'batch_verified' | 'compliance_check';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  batchId?: string;
  status: 'completed' | 'pending' | 'flagged';
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'batch_registered',
    title: 'New Batch Registered',
    description: 'PharmaCorp Ltd. registered batch BATCH-2025-001 (Paracetamol 500mg)',
    timestamp: '2025-01-16T14:30:00Z',
    actor: 'PharmaCorp Ltd.',
    batchId: 'BATCH-2025-001',
    status: 'completed'
  },
  {
    id: 'act_002',
    type: 'report_filed',
    title: 'Suspicious Activity Report',
    description: 'City Pharmacy reported suspicious packaging for batch BATCH-2025-002',
    timestamp: '2025-01-16T12:15:00Z',
    actor: 'City Pharmacy',
    batchId: 'BATCH-2025-002',
    status: 'flagged'
  },
  {
    id: 'act_003',
    type: 'batch_transferred',
    title: 'Batch Transfer Recorded',
    description: 'MediDistrib Inc. transferred batch to Regional Pharmacy Network',
    timestamp: '2025-01-16T10:45:00Z',
    actor: 'MediDistrib Inc.',
    batchId: 'BATCH-2025-003',
    status: 'completed'
  },
  {
    id: 'act_004',
    type: 'compliance_check',
    title: 'Compliance Review Initiated',
    description: 'Routine compliance check started for HealthCorp Solutions',
    timestamp: '2025-01-16T09:20:00Z',
    actor: 'Regulatory Authority',
    status: 'pending'
  },
  {
    id: 'act_005',
    type: 'batch_verified',
    title: 'Batch Verification',
    description: 'Metro Pharmacy verified authenticity of batch BATCH-2025-004',
    timestamp: '2025-01-15T16:30:00Z',
    actor: 'Metro Pharmacy',
    batchId: 'BATCH-2025-004',
    status: 'completed'
  }
];

const ACTIVITY_FILTERS = [
  { value: 'all', label: 'All Activity', color: Colors.text },
  { value: 'batch_registered', label: 'Registrations', color: Colors.primary },
  { value: 'batch_transferred', label: 'Transfers', color: Colors.accent },
  { value: 'report_filed', label: 'Reports', color: Colors.danger },
  { value: 'batch_verified', label: 'Verifications', color: Colors.success },
];

export default function ActivityScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);
  const [filterType, setFilterType] = useState('all');

  React.useEffect(() => {
    filterActivities();
  }, [activities, filterType]);

  const filterActivities = () => {
    let filtered = activities;

    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType);
    }

    setFilteredActivities(filtered);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'batch_registered': return Package;
      case 'batch_transferred': return Activity;
      case 'report_filed': return AlertTriangle;
      case 'batch_verified': return CheckCircle;
      case 'compliance_check': return FileText;
      default: return Eye;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'batch_registered': return Colors.primary;
      case 'batch_transferred': return Colors.accent;
      case 'report_filed': return Colors.danger;
      case 'batch_verified': return Colors.success;
      case 'compliance_check': return Colors.warning;
      default: return Colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'pending': return Colors.warning;
      case 'flagged': return Colors.danger;
      default: return Colors.textSecondary;
    }
  };

  const getStats = () => {
    const total = activities.length;
    const today = activities.filter(a => {
      const activityDate = new Date(a.timestamp).toDateString();
      const todayDate = new Date().toDateString();
      return activityDate === todayDate;
    }).length;
    const flagged = activities.filter(a => a.status === 'flagged').length;

    return { total, today, flagged };
  };

  const stats = getStats();

  return (
    <View style={styles.container}>
      <ModernNavbar 
        title="Recent Activity" 
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
        {/* Stats */}
        <Animated.View 
          entering={FadeInDown.delay(100)}
          style={styles.statsContainer}
        >
          <ModernCard variant="filled" style={styles.statCard}>
            <Activity size={20} color={Colors.primary} />
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Activities</Text>
          </ModernCard>
          <ModernCard variant="filled" style={styles.statCard}>
            <Clock size={20} color={Colors.accent} />
            <Text style={[styles.statNumber, { color: Colors.accent }]}>{stats.today}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </ModernCard>
          <ModernCard variant="filled" style={styles.statCard}>
            <AlertTriangle size={20} color={Colors.danger} />
            <Text style={[styles.statNumber, { color: Colors.danger }]}>{stats.flagged}</Text>
            <Text style={styles.statLabel}>Flagged</Text>
          </ModernCard>
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View
          entering={FadeInDown.delay(200)}
          style={styles.filterContainer}
        >
          <View style={styles.filterTabs}>
            {ACTIVITY_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterTab,
                  filterType === filter.value && styles.filterTabActive,
                  filterType === filter.value && { backgroundColor: filter.color + '15' }
                ]}
                onPress={() => setFilterType(filter.value)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterTabText,
                  filterType === filter.value && styles.filterTabTextActive,
                  filterType === filter.value && { color: filter.color }
                ]}>
                  {filter.label}
                </Text>
                {filter.value !== 'all' && (
                  <View style={[
                    styles.filterCount,
                    { backgroundColor: filter.color }
                  ]}>
                    <Text style={styles.filterCountText}>
                      {activities.filter(a => a.type === filter.value).length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Activities List */}
        <View style={styles.listContainer}>
          {filteredActivities.length === 0 ? (
            <Animated.View entering={FadeInDown.delay(300)} style={styles.emptyContainer}>
              <Activity size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>No activities found</Text>
              <Text style={styles.emptySubtitle}>
                No activities match the selected filter
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.activitiesList}>
              {filteredActivities.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                const activityColor = getActivityColor(activity.type);
                const statusColor = getStatusColor(activity.status);
                
                return (
                  <Animated.View
                    key={activity.id}
                    entering={SlideInRight.delay(300 + index * 100)}
                  >
                    <ModernCard variant="elevated" style={styles.activityCard}>
                      <View style={styles.activityHeader}>
                        <View style={[
                          styles.activityIcon,
                          { backgroundColor: activityColor + '20' }
                        ]}>
                          <IconComponent size={20} color={activityColor} />
                        </View>
                        <View style={styles.activityInfo}>
                          <Text style={styles.activityTitle}>{activity.title}</Text>
                          <Text style={styles.activityDescription}>{activity.description}</Text>
                          <Text style={styles.activityActor}>by {activity.actor}</Text>
                        </View>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: statusColor + '20' }
                        ]}>
                          <Text style={[
                            styles.statusText,
                            { color: statusColor }
                          ]}>
                            {activity.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.activityFooter}>
                        <Text style={styles.activityTime}>
                          {new Date(activity.timestamp).toLocaleString()}
                        </Text>
                        {activity.batchId && (
                          <Text style={styles.batchId}>
                            {activity.batchId}
                          </Text>
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
    minWidth: 90,
  },
  filterTabActive: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
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
  activitiesList: {
    gap: Spacing.md,
  },

  // Activity Card Styles
  activityCard: {
    marginBottom: 0,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  activityDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  activityActor: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 10,
  },

  // Footer Styles
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
  },
  activityTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  batchId: {
    ...Typography.caption,
    color: Colors.accent,
    fontFamily: 'monospace',
    fontWeight: '600',
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
});