import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { RegistrationData } from '../RegisterScreen';

interface RegisterStep2Props {
  formData: RegistrationData;
  updateFormData: (field: keyof RegistrationData, value: string) => void;
  onBack: () => void;
}

export default function RegisterStep2({ formData, updateFormData, onBack }: RegisterStep2Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const validateStep2 = () => {
    // Role-specific validation
    if (formData.selectedRole === 'manufacturer') {
      if (!formData.companyName.trim()) {
        return 'Company name is required';
      }
      if (!formData.licenseNumber.trim()) {
        return 'License number is required';
      }
    }
    
    if (formData.selectedRole === 'distributor') {
      if (!formData.businessId.trim()) {
        return 'Business ID is required';
      }
      if (!formData.region.trim()) {
        return 'Operating region is required';
      }
    }
    
    if (formData.selectedRole === 'pharmacist') {
      if (!formData.facilityName.trim()) {
        return 'Facility name is required';
      }
      if (!formData.licenseNumber.trim()) {
        return 'License number is required';
      }
    }
    
    return null;
  };

  const handleCreateAccount = async () => {
    const validationError = validateStep2();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate registration API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Auto-login after successful registration
      await login(formData.selectedRole, { 
        name: formData.fullName, 
        email: formData.email,
        companyName: formData.companyName,
        licenseNumber: formData.licenseNumber,
      });
      
      router.replace('/(tabs)');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.selectedRole) {
      case 'manufacturer':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter company name"
                placeholderTextColor={Colors.textSecondary}
                value={formData.companyName}
                onChangeText={(value) => updateFormData('companyName', value)}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>License Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter manufacturing license number"
                placeholderTextColor={Colors.textSecondary}
                value={formData.licenseNumber}
                onChangeText={(value) => updateFormData('licenseNumber', value)}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter facility location"
                placeholderTextColor={Colors.textSecondary}
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
                editable={!isLoading}
              />
            </View>
          </>
        );
      case 'distributor':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business ID *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter business registration ID"
                placeholderTextColor={Colors.textSecondary}
                value={formData.businessId}
                onChangeText={(value) => updateFormData('businessId', value)}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Operating Region *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your operating region"
                placeholderTextColor={Colors.textSecondary}
                value={formData.region}
                onChangeText={(value) => updateFormData('region', value)}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter warehouse/office location"
                placeholderTextColor={Colors.textSecondary}
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
                editable={!isLoading}
              />
            </View>
          </>
        );
      case 'pharmacist':
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Facility Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter pharmacy/hospital name"
                placeholderTextColor={Colors.textSecondary}
                value={formData.facilityName}
                onChangeText={(value) => updateFormData('facilityName', value)}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>License Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter pharmacy license number"
                placeholderTextColor={Colors.textSecondary}
                value={formData.licenseNumber}
                onChangeText={(value) => updateFormData('licenseNumber', value)}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter facility address"
                placeholderTextColor={Colors.textSecondary}
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
                editable={!isLoading}
              />
            </View>
          </>
        );
      case 'regulator':
        return (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Regulatory Account</Text>
            <Text style={styles.infoText}>
              Regulatory accounts require manual approval. You'll receive an email notification once your account is reviewed and approved by our team.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    switch (formData.selectedRole) {
      case 'manufacturer':
        return 'Company Information';
      case 'distributor':
        return 'Business Information';
      case 'pharmacist':
        return 'Facility Information';
      case 'regulator':
        return 'Regulatory Information';
      default:
        return 'Organization Information';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>{getSectionTitle()}</Text>
      
      {renderRoleSpecificFields()}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onBack}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button, 
            styles.primaryButton, 
            isLoading && styles.buttonDisabled
          ]}
          onPress={handleCreateAccount}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login' as any)}>
          <Text style={styles.linkText}>Login</Text>
        </TouchableOpacity>
      </View>
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
  infoBox: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});