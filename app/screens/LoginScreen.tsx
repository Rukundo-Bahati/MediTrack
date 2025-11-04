import { ModernButton, ModernInput, ModernSelector } from '@/components/ui';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, RoleColors } from '../../constants/colors';
import { useAuth, UserRole } from '../context/AuthContext';

const BUSINESS_ROLES: { value: Exclude<UserRole, 'consumer' | 'admin'>; label: string; description: string; color: string }[] = [
  { value: 'manufacturer', label: 'Manufacturer', description: 'Register batches & track', color: RoleColors.manufacturer },
  { value: 'distributor', label: 'Distributor', description: 'Track shipments & logistics', color: RoleColors.distributor },
  { value: 'pharmacist', label: 'Pharmacist', description: 'Manage inventory & verify stock', color: RoleColors.pharmacist },
  { value: 'regulator', label: 'Regulator', description: 'Audit trails & compliance', color: RoleColors.regulator },
];

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, 'consumer' | 'admin'>>('manufacturer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // For demo purposes, accept any email/password
      await login(selectedRole, { name: email.split('@')[0] || 'Demo User', email });
      router.replace('/(tabs)');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Package size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>MediTrack</Text>
          <Text style={styles.subtitle}>Business Login</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Select Your Role</Text>
          <ModernSelector
            options={BUSINESS_ROLES}
            selectedValue={selectedRole}
            onSelect={(value) => setSelectedRole(value as Exclude<UserRole, 'consumer' | 'admin'>)}
            variant="grid"
            columns={2}
            style={styles.roleSelector}
          />

          <ModernInput
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
            containerStyle={styles.inputGroup}
          />

          <ModernInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
            containerStyle={styles.inputGroup}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <ModernButton
            title="Login"
            onPress={handleLogin}
            variant="primary"
            size="large"
            disabled={isLoading}
            loading={isLoading}
            style={styles.loginButton}
          />
          {/* 
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleGuestLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Continue as Guest
            </Text>
          </TouchableOpacity> */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register' as any)}>
              <Text style={styles.linkText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  label: {
    ...Typography.label,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  roleSelector: {
    marginBottom: Spacing.lg,
  },

  inputGroup: {
    marginBottom: Spacing.component.margin,
  },
  loginButton: {
    marginTop: Spacing.lg,
  },

  errorText: {
    ...Typography.bodySmall,
    color: Colors.danger,
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  linkText: {
    ...Typography.bodySmall,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});