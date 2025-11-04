import { useRouter } from 'expo-router';
import { CheckCircle, Clock, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { ModernButton } from '../../../components/ui/modern-button';
import { ModernCard } from '../../../components/ui/modern-card';
import { ScreenLayout } from '../../../components/ui/modern-layout';
import { ModernNavbar } from '../../../components/ui/modern-navbar';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

interface PendingAccount {
  id: string;
  name: string;
  email: string;
  role: 'manufacturer' | 'distributor' | 'pharmacist' | 'regulator';
  organization: string;
  submittedAt: string;
  documents: string[];
}

const MOCK_PENDING_ACCOUNTS: PendingAccount[] = [
  {
    id: 'acc_001',
    name: 'John Smith',
    email: 'john.smith@pharmacorp.com',
    role: 'manufacturer',
    organization: 'PharmaCorp Ltd.',
    submittedAt: '2025-01-15T10:30:00Z',
    documents: ['Business License', 'Manufacturing Certificate', 'Quality Assurance Certificate']
  },
  {
    id: 'acc_002',
    name: 'Sarah Johnson',
    email: 'sarah.j@medidistrib.com',
    role: 'distributor',
    organization: 'MediDistrib Inc.',
    submittedAt: '2025-01-14T14:20:00Z',
    documents: ['Distribution License', 'Storage Facility Certificate']
  },
  {
    id: 'acc_003',
    name: 'Dr. Michael Chen',
    email: 'dr.chen@citypharmacy.com',
    role: 'pharmacist',
    organization: 'City Pharmacy',
    submittedAt: '2025-01-13T09:15:00Z',
    documents: ['Pharmacy License', 'Pharmacist Certificate']
  }
];

export default function ApproveAccountsScreen() {
  const router = useRouter();
  const [pendingAccounts, setPendingAccounts] = useState<PendingAccount[]>(MOCK_PENDING_ACCOUNTS);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (accountId: string) => {
    setProcessingId(accountId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPendingAccounts(prev => prev.filter(acc => acc.id !== accountId));
      Alert.alert('Success', 'Account has been approved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to approve account. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (accountId: string) => {
    Alert.alert(
      'Reject Account',
      'Are you sure you want to reject this account application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setProcessingId(accountId);
            
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              setPendingAccounts(prev => prev.filter(acc => acc.id !== accountId));
              Alert.alert('Account Rejected', 'The account application has been rejected');
            } catch (error) {
              Alert.alert('Error', 'Failed to reject account. Please try again.');
            } finally {
              setProcessingId(null);
            }
          }
        }
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manufacturer': return Colors.primary;
      case 'distributor': return Colors.accent;
      case 'pharmacist': return Colors.info;
      case 'regulator': return Colors.warning;
      default: return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <ModernNavbar 
        title="Approve Accounts" 
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
            <Clock size={24} color={Colors.warning} />
            <Text style={[styles.statNumber, { color: Colors.warning }]}>{pendingAccounts.length}</Text>
            <Text style={styles.statLabel}>Pending Approvals</Text>
          </ModernCard>
        </Animated.View>

        {/* Pending Accounts List */}
        <View style={styles.listContainer}>
          {pendingAccounts.length === 0 ? (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.emptyContainer}>
              <CheckCircle size={64} color={Colors.success} />
              <Text style={styles.emptyTitle}>All Caught Up!</Text>
              <Text style={styles.emptySubtitle}>
                No pending account approvals at this time
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.accountsList}>
              {pendingAccounts.map((account, index) => (
                <Animated.View
                  key={account.id}
                  entering={SlideInRight.delay(200 + index * 100)}
                >
                  <ModernCard variant="elevated" style={styles.accountCard}>
                    <View style={styles.accountHeader}>
                      <View style={styles.accountIcon}>
                        <User size={20} color={getRoleColor(account.role)} />
                      </View>
                      <View style={styles.accountInfo}>
                        <Text style={styles.accountName}>{account.name}</Text>
                        <Text style={styles.accountEmail}>{account.email}</Text>
                        <Text style={styles.accountOrg}>{account.organization}</Text>
                      </View>
                      <View style={[
                        styles.roleBadge,
                        { backgroundColor: getRoleColor(account.role) + '20' }
                      ]}>
                        <Text style={[
                          styles.roleText,
                          { color: getRoleColor(account.role) }
                        ]}>
                          {account.role.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.documentsContainer}>
                      <Text style={styles.documentsLabel}>Submitted Documents:</Text>
                      {account.documents.map((doc, docIndex) => (
                        <Text key={docIndex} style={styles.documentItem}>
                          • {doc}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.accountFooter}>
                      <Text style={styles.submittedDate}>
                        Submitted: {new Date(account.submittedAt).toLocaleDateString()}
                      </Text>
                      
                      <View style={styles.actionButtons}>
                        <ModernButton
                          title="Reject"
                          onPress={() => handleReject(account.id)}
                          variant="secondary"
                          size="small"
                          disabled={processingId === account.id}
                          style={[styles.actionButton, styles.rejectButton] as any}
                        />
                        <ModernButton
                          title={processingId === account.id ? 'Processing...' : 'Approve'}
                          onPress={() => handleApprove(account.id)}
                          variant="primary"
                          size="small"
                          disabled={processingId === account.id}
                          style={styles.actionButton}
                        />
                      </View>
                    </View>
                  </ModernCard>
                </Animated.View>
              ))}
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
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.lg,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // List Styles
  listContainer: {
    paddingHorizontal: Spacing.layout.container,
    paddingBottom: Spacing.xl,
  },
  accountsList: {
    gap: Spacing.md,
  },

  // Account Card Styles
  accountCard: {
    marginBottom: 0,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  accountEmail: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  accountOrg: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  roleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  roleText: {
    ...Typography.caption,
    fontWeight: '600',
  },

  // Documents Styles
  documentsContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  documentsLabel: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  documentItem: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 2,
  },

  // Footer Styles
  accountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submittedDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    minWidth: 80,
  },
  rejectButton: {
    borderColor: Colors.danger,
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