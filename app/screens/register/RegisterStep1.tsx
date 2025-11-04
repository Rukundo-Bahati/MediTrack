import { Building2, Truck, Users } from 'lucide-react-native';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, RoleColors } from '../../../constants/colors';
import { UserRole } from '../../context/AuthContext';
import { RegistrationData } from '../RegisterScreen';

const BUSINESS_ROLES: { 
  value: Exclude<UserRole, 'consumer'>; 
  label: string; 
  description: string;
  icon: any;
}[] = [
  { 
    value: 'manufacturer', 
    label: 'Manufacturer', 
    description: 'Register batches & track production',
    icon: Building2
  },
  { 
    value: 'distributor', 
    label: 'Distributor', 
    description: 'Track shipments & logistics',
    icon: Truck
  },
  { 
    value: 'pharmacist', 
    label: 'Pharmacy/Hospital', 
    description: 'Manage inventory & verify stock',
    icon: Building2
  },
  { 
    value: 'regulator', 
    label: 'Regulator', 
    description: 'Audit trails & compliance',
    icon: Users
  },
];

interface RegisterStep1Props {
  formData: RegistrationData;
  updateFormData: (field: keyof RegistrationData, value: string) => void;
  onNext: () => void;
}

export default function RegisterStep1({ formData, updateFormData, onNext }: RegisterStep1Props) {
  const [error, setError] = useState('');

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      return 'Please enter your full name';
    }
    if (!formData.email.trim()) {
      return 'Please enter your email address';
    }
    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (!formData.password) {
      return 'Please create a password';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    onNext();
  };

  return (
    <View style={styles.container}>
      {/* Role Selection */}
      <Text style={styles.sectionLabel}>Select Your Role</Text>
      <View style={styles.roleGrid}>
        {BUSINESS_ROLES.map((role) => {
          const IconComponent = role.icon;
          return (
            <TouchableOpacity
              key={role.value}
              style={[
                styles.roleCard,
                formData.selectedRole === role.value && styles.roleCardSelected,
                { 
                  borderColor: formData.selectedRole === role.value 
                    ? RoleColors[role.value] 
                    : Colors.border 
                },
              ]}
              onPress={() => updateFormData('selectedRole', role.value)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.roleIconContainer,
                  { backgroundColor: RoleColors[role.value] + '20' },
                ]}
              >
                <IconComponent 
                  size={20} 
                  color={RoleColors[role.value]} 
                  strokeWidth={2}
                />
              </View>
              <Text 
                style={[
                  styles.roleLabel, 
                  formData.selectedRole === role.value && styles.roleLabelSelected
                ]}
              >
                {role.label}
              </Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Personal Information */}
      <Text style={styles.sectionLabel}>Personal Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor={Colors.textSecondary}
          value={formData.fullName}
          onChangeText={(value) => updateFormData('fullName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          placeholderTextColor={Colors.textSecondary}
          value={formData.email}
          onChangeText={(value) => updateFormData('email', value)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password (min. 6 characters)"
          placeholderTextColor={Colors.textSecondary}
          value={formData.password}
          onChangeText={(value) => updateFormData('password', value)}
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor={Colors.textSecondary}
          value={formData.confirmPassword}
          onChangeText={(value) => updateFormData('confirmPassword', value)}
          secureTextEntry
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  roleCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 12,
    alignItems: 'center',
  },
  roleCardSelected: {
    backgroundColor: Colors.white,
    borderWidth: 2,
  },
  roleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  roleLabelSelected: {
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  roleDescription: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  button: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});