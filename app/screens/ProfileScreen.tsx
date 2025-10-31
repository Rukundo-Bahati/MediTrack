import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={{ padding: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>{user?.name || 'Guest'}</Text>
          <Text>{user?.email}</Text>
          <Text style={{ marginTop: 8 }}>Role: {user?.role || 'guest'}</Text>
        </Card>

        <Button mode="contained" onPress={() => logout()} style={{ marginTop: 16 }}>Logout</Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FA' },
  content: { padding: 16 },
});