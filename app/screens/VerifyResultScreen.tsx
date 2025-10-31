import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { DESIGN } from '../lib/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function VerifyResultScreen() {
  const route: any = useRoute();
  const nav = useNavigation();
  const { result } = route.params || {};

  useEffect(() => {
    (async () => {
      if (!result) return;
      const raw = await AsyncStorage.getItem('medi_cache_recent');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift({ id: Date.now().toString(), batchId: result.batchId, name: result.drugName, result });
      await AsyncStorage.setItem('medi_cache_recent', JSON.stringify(arr.slice(0, 20)));
    })();
  }, [result]);

  if (!result) return null;

  const isAuthentic = result.authentic;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: DESIGN.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Result Badge */}
        <View style={[
          styles.resultBanner,
          { backgroundColor: isAuthentic ? DESIGN.colors.accentContainer : DESIGN.colors.dangerContainer }
        ]}>
          <MaterialIcons
            name={isAuthentic ? 'check-circle' : 'cancel'}
            size={72}
            color={isAuthentic ? DESIGN.colors.accent : DESIGN.colors.danger}
          />
          <Text variant="displaySmall" style={[
            styles.resultText,
            { color: isAuthentic ? DESIGN.colors.accent : DESIGN.colors.danger, fontWeight: '700' }
          ]}>
            {isAuthentic ? 'AUTHENTIC' : 'FAKE / REVOKED'}
          </Text>
          <Text variant="bodyLarge" style={[styles.resultSubtext, { color: isAuthentic ? DESIGN.colors.accent : DESIGN.colors.danger }]}>
            {isAuthentic ? '✓ This medicine is verified and safe' : '✗ Do not use this product'}
          </Text>
        </View>

        {/* Drug Information Card */}
        <Card style={[styles.infoCard, { borderLeftWidth: 4, borderLeftColor: isAuthentic ? DESIGN.colors.accent : DESIGN.colors.danger }]}>
          <Card.Content>
            <Text variant="titleLarge" style={{ fontWeight: '700', marginBottom: DESIGN.spacing.sm }}>
              {result.drugName}
            </Text>
            <Text variant="bodyMedium" style={{ color: DESIGN.colors.muted, marginBottom: DESIGN.spacing.md }}>
              {result.manufacturer}
            </Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text variant="labelSmall" style={{ color: DESIGN.colors.muted, marginBottom: 4 }}>Batch ID</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{result.batchId}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text variant="labelSmall" style={{ color: DESIGN.colors.muted, marginBottom: 4 }}>Lot Number</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{result.lot}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text variant="labelSmall" style={{ color: DESIGN.colors.muted, marginBottom: 4 }}>Expiry Date</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600', color: new Date(result.expiry) < new Date() ? DESIGN.colors.danger : DESIGN.colors.text }}>
                  {result.expiry}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text variant="labelSmall" style={{ color: DESIGN.colors.muted, marginBottom: 4 }}>Quantity</Text>
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>{result.quantity} units</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Blockchain Verification Badge */}
        {result.onChain && (
          <Card style={[styles.chainCard, { backgroundColor: DESIGN.colors.accentContainer }]}>
            <Card.Content>
              <View style={styles.chainHeader}>
                <MaterialIcons name="verified" size={24} color={DESIGN.colors.accent} />
                <View style={{ flex: 1, marginLeft: DESIGN.spacing.md }}>
                  <Text variant="titleMedium" style={{ fontWeight: '600', color: DESIGN.colors.accent }}>
                    Verified on Blockchain
                  </Text>
                  <Text variant="bodySmall" style={{ color: DESIGN.colors.accent, marginTop: 4 }}>
                    Batch registered on Ethereum Sepolia
                  </Text>
                </View>
              </View>
              {result.chainEvents && result.chainEvents.length > 0 && (
                <Text variant="labelSmall" style={{ color: DESIGN.colors.accent, marginTop: DESIGN.spacing.sm }}>
                  {result.chainEvents.length} blockchain events
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Supply Chain History */}
        {result.provenance.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: DESIGN.colors.text }]}>
              Supply Chain History
            </Text>
            {result.provenance.map((p: any, idx: number) => (
              <View key={idx} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                {idx < result.provenance.length - 1 && <View style={styles.timelineLine} />}
                <View style={styles.timelineContent}>
                  <Card style={{ backgroundColor: DESIGN.colors.surface }}>
                    <Card.Content>
                      <Text variant="titleSmall" style={{ fontWeight: '600' }}>{p.event}</Text>
                      <Text variant="bodySmall" style={{ color: DESIGN.colors.muted, marginTop: 4 }}>
                        {new Date(p.timestamp).toLocaleString()}
                      </Text>
                      {p.location && (
                        <Text variant="bodySmall" style={{ color: DESIGN.colors.text, marginTop: 6, fontWeight: '500' }}>
                          📍 {p.location}
                        </Text>
                      )}
                    </Card.Content>
                  </Card>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Blockchain Events Timeline */}
        {result.chainEvents && result.chainEvents.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: DESIGN.colors.text }]}>
              Blockchain Events
            </Text>
            {result.chainEvents.map((e: any, idx: number) => (
              <Card key={idx} style={[styles.eventCard, { backgroundColor: DESIGN.colors.surface }]}>
                <Card.Content>
                  <View style={styles.eventHeader}>
                    <View style={{ flex: 1 }}>
                      <Text variant="titleSmall" style={{ fontWeight: '600' }}>{e.eventName}</Text>
                      <Text variant="labelSmall" style={{ color: DESIGN.colors.muted, marginTop: 4 }}>
                        Block #{e.block}
                      </Text>
                    </View>
                    <MaterialIcons name="link" size={20} color={DESIGN.colors.primary} />
                  </View>
                  <Divider style={{ marginVertical: DESIGN.spacing.md }} />
                  <Text variant="bodySmall" style={{ color: DESIGN.colors.muted, marginBottom: 8 }}>
                    {e.formattedTime}
                  </Text>
                  <Text variant="bodySmall" style={{ fontFamily: 'monospace', fontSize: 10, color: DESIGN.colors.textTertiary }}>
                    {e.txHash?.slice(0, 16)}...
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          {!isAuthentic && (
            <Button
              mode="contained"
              icon="flag"
              onPress={() => Alert.alert('Report', 'Report fake product flow (mock)')}
              style={[styles.actionButton, { backgroundColor: DESIGN.colors.danger }]}
              contentStyle={styles.actionButtonContent}
              labelStyle={styles.actionButtonLabel}
            >
              Report Fake
            </Button>
          )}
          <Button
            mode="outlined"
            onPress={() => nav.goBack()}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            labelStyle={styles.actionButtonLabel}
          >
            Done
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: DESIGN.spacing.xl },
  resultBanner: {
    paddingVertical: DESIGN.spacing.xl,
    paddingHorizontal: DESIGN.spacing.md,
    alignItems: 'center',
    borderRadius: DESIGN.radii.lg,
    marginHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
  },
  resultText: {
    marginTop: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.sm,
    letterSpacing: 1,
  },
  resultSubtext: {
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: DESIGN.colors.surface,
    marginHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
    borderRadius: DESIGN.radii.lg,
  },
  infoGrid: {
    display: 'flex',
    gap: DESIGN.spacing.md,
  },
  infoItem: {
    marginBottom: DESIGN.spacing.sm,
  },
  chainCard: {
    marginHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
    borderRadius: DESIGN.radii.lg,
  },
  chainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: DESIGN.spacing.md,
  },
  timelineItem: {
    marginBottom: DESIGN.spacing.lg,
    position: 'relative',
    paddingLeft: DESIGN.spacing.lg,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: DESIGN.colors.primary,
    borderWidth: 3,
    borderColor: DESIGN.colors.background,
  },
  timelineLine: {
    position: 'absolute',
    left: 4.5,
    top: 24,
    width: 2,
    height: 100,
    backgroundColor: DESIGN.colors.outline,
  },
  timelineContent: {
    flex: 1,
  },
  eventCard: {
    marginBottom: DESIGN.spacing.md,
    borderRadius: DESIGN.radii.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsSection: {
    paddingHorizontal: DESIGN.spacing.md,
    gap: DESIGN.spacing.md,
  },
  actionButton: {
    borderRadius: DESIGN.radii.lg,
    marginBottom: DESIGN.spacing.sm,
  },
  actionButtonContent: {
    paddingVertical: 10,
  },
  actionButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});