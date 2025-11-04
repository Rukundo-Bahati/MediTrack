import { AlertTriangle, Calendar, CheckCircle, Package, Search, XCircle } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, RoleColors } from '../../../constants/colors';

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
  const insets = useSafeAreaInsets();
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
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.title}>Batch Audit</Text>
        <Text style={styles.subtitle}>Search and audit blockchain batch events</Text>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              onChangeText={setSearchQuery}
              placeholder="Enter batch ID to audit"
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: RoleColors.regulator }]}
            onPress={handleSearch}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.searchButtonText}>
              {loading ? 'Searching...' : 'Search'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {searched && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              Blockchain Events for: {searchQuery}
            </Text>
            
            {events.length === 0 ? (
              <View style={styles.emptyState}>
                <XCircle size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>No events found</Text>
                <Text style={styles.emptySubtext}>
                  This batch ID may not exist on the blockchain
                </Text>
              </View>
            ) : (
              <View style={styles.eventsContainer}>
                {events.map((event, index) => {
                  const IconComponent = getEventIcon(event.eventName);
                  const eventColor = getEventColor(event.eventName);
                  
                  return (
                    <View key={event.id} style={styles.eventCard}>
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
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {!searched && (
          <View style={styles.instructionCard}>
            <Package size={32} color={RoleColors.regulator} />
            <Text style={styles.instructionTitle}>Blockchain Audit Tool</Text>
            <Text style={styles.instructionText}>
              Enter a batch ID to view its complete blockchain history including registration, transfers, and verifications.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  searchButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  resultsSection: {
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  eventsContainer: {
    gap: 16,
  },
  eventCard: {
    flexDirection: 'row',
  },
  eventLine: {
    alignItems: 'center',
    marginRight: 16,
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
  },
  eventConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginTop: 4,
  },
  eventContent: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  eventTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  eventDetails: {
    marginBottom: 8,
  },
  eventBlock: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  eventTx: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: Colors.textSecondary,
  },
  eventData: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  eventDataItem: {
    fontSize: 13,
    color: Colors.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  instructionCard: {
    backgroundColor: RoleColors.regulator + '10',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: RoleColors.regulator + '20',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});