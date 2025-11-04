import { useRouter } from 'expo-router';
import { ArrowLeft, Building2, Package, Truck, Users } from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, RoleColors } from '../../constants/colors';
import { useAuth, UserRole } from '../context/AuthContext';

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

export default function RegisterScreen() {
  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, 'consumer'>>('manufacturer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Role-specific fields
    companyName: '',
    licenseNumber: '',
    location: '',
    businessId: '',
    region: '',
    facilityName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      return 'Please fill in all required fields';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    
    // Role-specific validation
    if (selectedRole === 'manufacturer' && (!formData.companyName || !formData.licenseNumber)) {
      return 'Company name and license number are required';
    }
    if (selectedRole === 'distributor' && (!formData.businessId || !formData.region)) {
      return 'Business ID and region are required';
    }
    if (selectedRole === 'pharmacist' && (!formData.facilityName || !formData.licenseNumber)) {
      return 'Facility name and license number are required';
    }
    
    return null;
  };

  const handleRegister = async () => {
    const validationError = validateForm();
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
      await login(selectedRole, { 
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
    switch (selectedRole) {
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
                placeholder="Enter license number"
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
                placeholder="Enter location"
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
                placeholder="Enter business ID"
                placeholderTextColor={Colors.textSecondary}
                value={formData.businessId}
                onChangeText={(value) => updateFormData('businessId', value)}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Region *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter operating region"
                placeholderTextColor={Colors.textSecondary}
                value={formData.region}
                onChangeText={(value) => updateFormData('region', value)}
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
                placeholder="Enter facility name"
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
                placeholder="Enter license number"
                placeholderTextColor={Colors.textSecondary}
                value={formData.licenseNumber}
                onChangeText={(value) => updateFormData('licenseNumber', value)}
                editable={!isLoading}
              />
            </View>
          </>
        );
      default:
        return null;
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Package size={32} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Join the MediTrack network</Text>
        </View>

        <View style={styles.form}>
          {/* Role Selection */}
          <Text style={styles.sectionLabel}>Select Role</Text>
          <View style={styles.roleGrid}>
            {BUSINESS_ROLES.map((role) => {
              const IconComponent = role.icon;
              return (
                <TouchableOpacity
                  key={role.value}
                  style={[
                    styles.roleCard,
                    selectedRole === role.value && styles.roleCardSelected,
                    { 
                      borderColor: selectedRole === role.value 
                        ? RoleColors[role.value] 
                        : Colors.border 
                    },
                  ]}
                  onPress={() => setSelectedRole(role.value)}
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
                      selectedRole === role.value && styles.roleLabelSelected
                    ]}
                  >
                    {role.label}
                  </Text>
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Common Fields */}
          <Text style={styles.sectionLabel}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textSecondary}
              value={formData.fullName}
              onChangeText={(value) => updateFormData('fullName', value)}
              editable={!isLoading}
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
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor={Colors.textSecondary}
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry
              editable={!isLoading}
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
              editable={!isLoading}
            />
          </View>

          {/* Role-specific Fields */}
          <Text style={styles.sectionLabel}>
            {selectedRole === 'manufacturer' ? 'Company Information' :
             selectedRole === 'distributor' ? 'Business Information' :
             selectedRole === 'pharmacist' ? 'Facility Information' :
             'Organization Information'}
          </Text>
          
          {renderRoleSpecificFields()}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button, 
              styles.primaryButton, 
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login' as any)}>
              <Text style={styles.linkText}>Login</Text>
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
    backgroundColor: Colors.background,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
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
    marginBottom: 12,
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
  buttonDisabled: {
    opacity: 0.6,
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