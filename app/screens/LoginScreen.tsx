import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput, Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, UserRole } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { DESIGN } from '../lib/theme';
import { MaterialIcons } from '@expo/vector-icons';

const ROLES: { value: UserRole; label: string; icon: string; description: string }[] = [
  { value: 'consumer', label: 'Consumer', icon: 'person', description: 'Scan & verify medicines' },
  { value: 'pharmacist', label: 'Pharmacist', icon: 'local-pharmacy', description: 'Manage inventory & sales' },
  { value: 'distributor', label: 'Distributor', icon: 'local-shipping', description: 'Track shipments' },
  { value: 'manufacturer', label: 'Manufacturer', icon: 'factory', description: 'Register batches' },
  { value: 'regulator', label: 'Regulator', icon: 'assessment', description: 'Monitor compliance' },
];

export default function LoginScreen() {
  const { login } = useAuth();
  const nav = useNavigation();
  const [role, setRole] = useState<UserRole>('consumer');
  const [name, setName] = useState('Demo User');
  const [email, setEmail] = useState('demo@medi-track.app');

  const doLogin = async () => {
    await login(role, { name: name || undefined, email: email || undefined });
    nav.navigate('Main' as never);
  };

  const selectedRoleObj = ROLES.find(r => r.value === role);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: DESIGN.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="verified-user" size={48} color={DESIGN.colors.primary} />
          </View>
          <Text variant="displaySmall" style={[styles.title, { color: DESIGN.colors.primary }]}>
            MediTrack
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: DESIGN.colors.muted }]}>
            Medicine authentication & supply chain tracking
          </Text>
        </View>

        {/* Role Selection */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={[styles.sectionTitle, { color: DESIGN.colors.text }]}>
            Select Your Role
          </Text>
          <Text variant="bodySmall" style={[styles.sectionDescription, { color: DESIGN.colors.muted }]}>
            Choose how you'll use MediTrack
          </Text>

          {ROLES.map((r) => (
            <Card
              key={r.value}
              style={[
                styles.roleCard,
                {
                  backgroundColor: role === r.value ? DESIGN.colors.primaryContainer : DESIGN.colors.surface,
                  borderWidth: role === r.value ? 2 : 1,
                  borderColor: role === r.value ? DESIGN.colors.primary : DESIGN.colors.outline,
                },
              ]}
              onPress={() => setRole(r.value)}
            >
              <Card.Content>
                <View style={styles.roleContent}>
                  <View style={[
                    styles.roleIcon,
                    { backgroundColor: role === r.value ? DESIGN.colors.primary : DESIGN.colors.surfaceVariant }
                  ]}>
                    <MaterialIcons
                      name={r.icon as any}
                      size={24}
                      color={role === r.value ? '#fff' : DESIGN.colors.primary}
                    />
                  </View>
                  <View style={styles.roleInfo}>
                    <Text variant="titleSmall" style={{ fontWeight: '600', color: DESIGN.colors.text }}>
                      {r.label}
                    </Text>
                    <Text variant="bodySmall" numberOfLines={1} style={{ color: DESIGN.colors.muted, marginTop: 4 }}>
                      {r.description}
                    </Text>
                  </View>
                  {role === r.value && (
                    <MaterialIcons name="check-circle" size={24} color={DESIGN.colors.primary} />
                  )}
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Form Fields */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: DESIGN.colors.text }]}>
            Account Info
          </Text>
          <Text variant="bodySmall" style={[{ color: DESIGN.colors.muted, marginBottom: DESIGN.spacing.md }]}>
            (Optional for demo)
          </Text>

          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            placeholder="Enter your name"
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
            placeholder="your@email.com"
          />
        </View>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <Button
            mode="contained"
            onPress={doLogin}
            style={[styles.button, { backgroundColor: DESIGN.colors.primary }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="arrow-right"
          >
            Continue as {selectedRoleObj?.label}
          </Button>
          <Text variant="bodySmall" style={[styles.disclaimer, { color: DESIGN.colors.muted }]}>
            This is a demo app. No data is stored.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: DESIGN.spacing.xl },
  header: {
    paddingHorizontal: DESIGN.spacing.md,
    paddingVertical: DESIGN.spacing.lg,
    alignItems: 'center',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: DESIGN.radii.lg,
    backgroundColor: DESIGN.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DESIGN.spacing.md,
  },
  title: {
    fontWeight: '700',
    marginBottom: DESIGN.spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: DESIGN.spacing.sm,
    color: DESIGN.colors.text,
  },
  sectionDescription: {
    marginBottom: DESIGN.spacing.md,
  },
  roleCard: {
    marginBottom: DESIGN.spacing.md,
    borderRadius: DESIGN.radii.lg,
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN.spacing.md,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: DESIGN.radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleInfo: {
    flex: 1,
  },
  input: {
    marginBottom: DESIGN.spacing.md,
    backgroundColor: DESIGN.colors.surfaceVariant,
  },
  actionSection: {
    paddingHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.xl,
  },
  button: {
    borderRadius: DESIGN.radii.lg,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: DESIGN.spacing.md,
  },
});