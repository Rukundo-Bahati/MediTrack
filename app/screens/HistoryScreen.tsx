import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {
  const [batches, setBatches] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const b = await AsyncStorage.getItem('medi_batches');
      const r = await AsyncStorage.getItem('medi_cache_recent');
      setBatches(b ? JSON.parse(b) : []);
      setRecent(r ? JSON.parse(r) : []);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Registered Batches</Text>
        <FlatList data={batches} keyExtractor={(i) => i.id} renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <Card.Title title={item.drugName} subtitle={`${item.id} • Expires ${item.expiry}`} />
          </Card>
        )} ListEmptyComponent={<Text>No batches registered</Text>} />

        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Recent Scans</Text>
        <FlatList data={recent} keyExtractor={(i) => i.id} renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <Card.Title title={item.name || item.batchId} subtitle={item.result?.authentic ? 'Authentic' : 'Unknown'} />
          </Card>
        )} ListEmptyComponent={<Text>No recent scans</Text>} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FA' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
});