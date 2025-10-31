import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DESIGN } from '../../lib/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function ConsumerHome() {
  const nav = useNavigation();
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadRecent();
    }, [])
  );

  const loadRecent = async () => {
    setLoading(true);
    const raw = await AsyncStorage.getItem('medi_cache_recent');
    if (raw) setRecent(JSON.parse(raw));
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: DESIGN.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text variant="displaySmall" style={[styles.heroTitle, { color: DESIGN.colors.primary }]}>
            Scan & Verify
          </Text>
          <Text variant="bodyLarge" style={[styles.heroSubtitle, { color: DESIGN.colors.muted }]}>
            Check if your medicine is authentic and safe
          </Text>

          {/* Primary CTA Button */}
          <Button
            mode="contained"
            icon="qr-code-scanner"
            onPress={() => nav.navigate('Scan' as never)}
            style={styles.heroButton}
            contentStyle={styles.heroButtonContent}
            labelStyle={styles.heroButtonLabel}
          >
            Scan Medicine Now
          </Button>

          {/* Icon accent */}
          <View style={styles.heroIcon}>
            <MaterialIcons name="verified-user" size={80} color={DESIGN.colors.accent} opacity={0.1} />
          </View>
        </View>

        {/* Recent Scans Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: DESIGN.colors.text }]}>
              Recent Scans
            </Text>
            {recent.length > 0 && (
              <Text variant="labelSmall" style={{ color: DESIGN.colors.muted }}>
                {recent.length} items
              </Text>
            )}
          </View>

          {recent.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <View style={styles.emptyContent}>
                  <MaterialIcons name="search" size={48} color={DESIGN.colors.muted} />
                  <Text variant="titleMedium" style={[styles.emptyTitle, { color: DESIGN.colors.text }]}>
                    No scans yet
                  </Text>
                  <Text variant="bodySmall" style={[styles.emptyDescription, { color: DESIGN.colors.muted }]}>
                    Start by scanning a medicine QR code to verify its authenticity
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={recent}
              keyExtractor={(item) => item.id || item.batchId || Math.random().toString()}
              renderItem={({ item }) => (
                <Card
                  style={styles.recentCard}
                  onPress={() => nav.navigate('Main' as never)}
                >
                  <Card.Content>
                    <View style={styles.recentCardContent}>
                      <View style={[
                        styles.recentBadge,
                        { backgroundColor: item.result?.authentic ? DESIGN.colors.accentContainer : DESIGN.colors.dangerContainer }
                      ]}>
                        <MaterialIcons
                          name={item.result?.authentic ? 'check-circle' : 'cancel'}
                          size={24}
                          color={item.result?.authentic ? DESIGN.colors.accent : DESIGN.colors.danger}
                        />
                      </View>
                      <View style={styles.recentInfo}>
                        <Text variant="titleSmall" numberOfLines={1} style={{ fontWeight: '600' }}>
                          {item.name || item.batchId || 'Unknown'}
                        </Text>
                        <Text variant="bodySmall" numberOfLines={1} style={{ color: DESIGN.colors.muted, marginTop: 2 }}>
                          {item.result?.authentic ? '✓ Authentic' : '✗ Suspicious'}
                        </Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={24} color={DESIGN.colors.muted} />
                    </View>
                  </Card.Content>
                </Card>
              )}
            />
          )}
        </View>

        {/* Info Banner */}
        <Card style={[styles.infoBanner, { backgroundColor: DESIGN.colors.primaryContainer }]}>
          <Card.Content>
            <View style={styles.infoBannerContent}>
              <MaterialIcons name="info" size={24} color={DESIGN.colors.primary} />
              <View style={{ flex: 1, marginLeft: DESIGN.spacing.md }}>
                <Text variant="titleSmall" style={[{ fontWeight: '600', color: DESIGN.colors.primary }]}>
                  Help & Support
                </Text>
                <Text variant="bodySmall" style={[{ color: DESIGN.colors.primary, marginTop: 4 }]}>
                  Not sure how to verify? Check our guide in Settings.
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: DESIGN.spacing.xl },
  heroSection: {
    paddingHorizontal: DESIGN.spacing.md,
    paddingVertical: DESIGN.spacing.lg,
    marginBottom: DESIGN.spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  heroIcon: {
    position: 'absolute',
    top: -20,
    right: -20,
    opacity: 0.1,
  },
  heroTitle: {
    fontWeight: '700',
    marginBottom: DESIGN.spacing.sm,
  },
  heroSubtitle: {
    marginBottom: DESIGN.spacing.lg,
  },
  heroButton: {
    borderRadius: DESIGN.radii.lg,
    backgroundColor: DESIGN.colors.primary,
  },
  heroButtonContent: {
    paddingVertical: 12,
  },
  heroButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN.spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: DESIGN.colors.surface,
    borderRadius: DESIGN.radii.lg,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: DESIGN.spacing.xl,
  },
  emptyTitle: {
    marginTop: DESIGN.spacing.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyDescription: {
    marginTop: DESIGN.spacing.sm,
    textAlign: 'center',
  },
  recentCard: {
    backgroundColor: DESIGN.colors.surface,
    marginBottom: DESIGN.spacing.sm,
    borderRadius: DESIGN.radii.md,
  },
  recentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN.spacing.md,
  },
  recentBadge: {
    width: 48,
    height: 48,
    borderRadius: DESIGN.radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentInfo: {
    flex: 1,
  },
  infoBanner: {
    marginHorizontal: DESIGN.spacing.md,
    borderRadius: DESIGN.radii.lg,
  },
  infoBannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});