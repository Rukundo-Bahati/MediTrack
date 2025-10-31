import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function ActionsScreen() {
  const nav = useNavigation();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Actions</Text>
        <Button mode="contained" onPress={() => nav.navigate('Scan' as never)} style={styles.button}>Scan QR</Button>

        {user?.role === 'manufacturer' && (
          <Button mode="outlined" onPress={() => nav.navigate('RegisterBatch' as never)} style={styles.button}>Register Batch</Button>
        )}

        <Button mode="text" onPress={() => nav.navigate('History' as never)} style={styles.link}>View History</Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FA' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  button: { marginVertical: 8, paddingVertical: 10, borderRadius: 10 },
  link: { marginTop: 12 },
});