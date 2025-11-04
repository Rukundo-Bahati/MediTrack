import { useRouter } from 'expo-router';
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle, Package, Search, XCircle } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { ModernButton } from '../../../components/ui/modern-button';
import { ModernCard } from '../../../components/ui/modern-card';
import { ModernInput } from '../../../components/ui/modern-input';
import { ScreenLayout } from '../../../components/ui/modern-layout';
import { Colors } from '../../../constants/colors';
import { Shadows } from '../../../constants/shadows';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

interface BatchEvent {
  id: string;
  eventName: string;
  block: number;
  txHash: string;
  timestamp: string;
  formattedTime: string;
  data: any;
}

export default function BatchAuditScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<BatchEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a batch ID');
      return;
    }

    try {
      setLoading(true);
      
      // Mock batch events data
      const mockEvents: BatchEvent[] = [
        {
          id: '1',
          eventName: 'BatchRegistered',
          block: 18234567,
          txHash: '0x1234567890abcdef1234567890abcdef12345678',
          timestamp: '2025-01-15T10:30:00Z',
          formattedTime: '2025-01-15 10:30:00 UTC',
          data: { manufacturer: 'PharmaCorp Ltd.', drugName: 'Paracetamol 500mg' }
        },
        {
          id: '2',
          eventName: 'BatchTransferred',
          block: 18234890,
          txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
          timestamp: '2025-01-16T14:15:00Z',
          formattedTime: '2025-01-16 14:15:00 UTC',
          data: { from: 'PharmaCorp Ltd.', to: 'MediDistrib Inc.' }
        },
        {
          id: '3',
          eventName: 'BatchVerified',
          block: 18235123,
          txHash: '0x567890abcdef1234567890abcdef1234567890ab',
          timestamp: '2025-01-17T09:45:00Z',
          formattedTime: '2025-01-17 09:45:00 UTC',
          data: { verifier: 'City Pharmacy', status: 'authentic' }
        }
      ];
      
      setEvents(mockEvents);
      setSearched(true);
    } catch (err) {
      console.warn('Search error', err);
      Alert.alert('Error', 'Failed to fetch batch events');
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventName: string) => {
    switch (eventName) {
      case 'BatchRegistered':
        return Package;
      case 'BatchTransferred':
        return AlertTriangle;
      case 'BatchVerified':
        return CheckCircle;
      default:
        return Calendar;
    }
  };

  const getEventColor = (eventName: string) => {
    switch (eventName) {
      case 'BatchRegistered':
        return Colors.primary;
      case 'BatchTransferred':
        return Colors.warning;
      case 'BatchVerified':
        return Colors.accent;
      default:
        return Colors.textSecondary;
    }
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
            <Search size={32} color={Colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Batch Audit</Text>
          <Text style={styles.subtitle}>
            Search and audit blockchain batch events
          </Text>
        </View>
      </Animated.View>

      {/* Search Section */}
      <Animated.View
        entering={FadeInUp.delay(300)}
        style={styles.searchSection}
      >
        <ModernInput
          placeholder="Enter batch ID to audit..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
        
        <ModernButton
          title={loading ? 'Searching...' : 'Search Blockchain'}
          onPress={handleSearch}
          disabled={loading}
          variant="primary"
          size="large"
          style={styles.searchButton}
        />
      </Animated.View>

      {/* Results Section */}
      {searched && (
        <Animated.View
          entering={FadeInUp.delay(400)}
          style={styles.resultsSection}
        >
          <Text style={styles.resultsTitle}>
            Blockchain Events for: {searchQuery}
          </Text>
          
          {events.length === 0 ? (
            <Animated.View entering={FadeInUp.delay(500)} style={styles.emptyState}>
              <XCircle size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>No events found</Text>
              <Text style={styles.emptySubtext}>
                This batch ID may not exist on the blockchain
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.eventsContainer}>
              {events.map((event, index) => {
                const IconComponent = getEventIcon(event.eventName);
                const eventColor = getEventColor(event.eventName);
                
                return (
                  <Animated.View
                    key={event.id}
                    entering={SlideInRight.delay(500 + index * 100)}
                  >
                    <ModernCard variant="elevated" style={styles.eventCard}>
                      <View style={styles.eventLine}>
                        <View style={[styles.eventDot, { backgroundColor: eventColor }]}>
                          <IconComponent size={16} color={Colors.white} />
                        </View>
                        {index < events.length - 1 && (
                          <View style={styles.eventConnector} />
                        )}
                      </View>
                      
                      <View style={styles.eventContent}>
                        <View style={styles.eventHeader}>
                          <Text style={[styles.eventName, { color: eventColor }]}>
                            {event.eventName}
                          </Text>
                          <Text style={styles.eventTime}>
                            {event.formattedTime}
                          </Text>
                        </View>
                        
                        <View style={styles.eventDetails}>
                          <Text style={styles.eventBlock}>
                            Block #{event.block}
                          </Text>
                          <Text style={styles.eventTx} numberOfLines={1}>
                            Tx: {event.txHash}
                          </Text>
                        </View>
                        
                        {event.data && (
                          <View style={styles.eventData}>
                            {Object.entries(event.data).map(([key, value]) => (
                              <Text key={key} style={styles.eventDataItem}>
                                {key}: {String(value)}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>
                    </ModernCard>
                  </Animated.View>
                );
              })}
            </View>
          )}
        </Animated.View>
      )}

      {!searched && (
        <Animated.View entering={FadeInUp.delay(400)} style={styles.instructionContainer}>
          <ModernCard variant="filled" style={styles.instructionCard}>
            <Package size={48} color={Colors.primary} />
            <Text style={styles.instructionTitle}>Blockchain Audit Tool</Text>
            <Text style={styles.instructionText}>
              Enter a batch ID to view its complete blockchain history including registration, transfers, and verifications.
            </Text>
          </ModernCard>
        </Animated.View>
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

  // Search Styles
  searchSection: {
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  searchButton: {
    width: '100%',
  },

  // Results Styles
  resultsSection: {
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.xl,
  },
  resultsTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },

  // Events Styles
  eventsContainer: {
    gap: Spacing.lg,
  },
  eventCard: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  eventLine: {
    alignItems: 'center',
    marginRight: Spacing.md,
    width: 32,
  },
  eventDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    ...Shadows.subtle,
  },
  eventConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginTop: Spacing.xs,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  eventName: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  eventTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  eventDetails: {
    marginBottom: Spacing.sm,
  },
  eventBlock: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  eventTx: {
    ...Typography.caption,
    fontFamily: 'monospace',
    color: Colors.textSecondary,
  },
  eventData: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  eventDataItem: {
    ...Typography.bodySmall,
    color: Colors.text,
  },

  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Instruction Styles
  instructionContainer: {
    paddingHorizontal: Spacing.layout.container,
  },
  instructionCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  instructionTitle: {
    ...Typography.h3,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  instructionText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});