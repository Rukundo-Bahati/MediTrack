import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingScreen() {
  const nav = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>MediTrack</Text>
        <Text style={styles.title}>Fight counterfeit medicines</Text>
        <Text style={styles.body}>Scan a QR code on any medicine to verify authenticity using blockchain-backed provenance.</Text>

        <View style={styles.cards}>
          <View style={styles.slide}>
            <Text style={styles.slideTitle}>Problem</Text>
            <Text style={styles.slideBody}>Fake drugs cause hundreds of thousands of deaths yearly.</Text>
          </View>
          <View style={styles.slide}>
            <Text style={styles.slideTitle}>Solution</Text>
            <Text style={styles.slideBody}>Tamper-proof batch registration + QR scanning for instant verification.</Text>
          </View>
          <View style={styles.slide}>
            <Text style={styles.slideTitle}>Get Started</Text>
            <Text style={styles.slideBody}>Choose your role and start scanning.</Text>
          </View>
        </View>

        <Button mode="contained" onPress={() => nav.navigate('Login' as never)} style={styles.button} accessibilityLabel="Get started">
          Get Started
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FA' },
  content: { padding: 20, flex: 1, justifyContent: 'center' },
  header: { fontSize: 28, fontWeight: '700', color: '#007BFF', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  body: { fontSize: 14, color: '#6C757D', marginBottom: 20 },
  cards: { marginVertical: 12 },
  slide: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, elevation: 1 },
  slideTitle: { fontSize: 16, fontWeight: '600' },
  slideBody: { color: '#6C757D', marginTop: 8 },
  button: { marginTop: 12, paddingVertical: 6, borderRadius: 8 },
});