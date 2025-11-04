import { useRouter } from 'expo-router';
import { ArrowLeft, Package } from 'lucide-react-native';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { UserRole } from '../context/AuthContext';
import RegisterStep1 from './register/RegisterStep1';
import RegisterStep2 from './register/RegisterStep2';

export interface RegistrationData {
  // Personal Information
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  selectedRole: Exclude<UserRole, 'consumer'>;
  
  // Role-specific fields
  companyName: string;
  licenseNumber: string;
  location: string;
  businessId: string;
  region: string;
  facilityName: string;
}

export default function RegisterScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedRole: 'manufacturer',
    // Role-specific fields
    companyName: '',
    licenseNumber: '',
    location: '',
    businessId: '',
    region: '',
    facilityName: '',
  });
  
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const updateFormData = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep(1);
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
          <ArrowLeft 
            size={24} 
            color={Colors.primary} 
            style={styles.backButton}
            onPress={handleBack}
          />
          <View style={styles.logoContainer}>
            <Package size={32} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Step {currentStep} of 2 - {currentStep === 1 ? 'Personal Information' : 'Business Information'}
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(currentStep / 2) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{currentStep}/2</Text>
        </View>

        {/* Step Content */}
        <View style={styles.form}>
          {currentStep === 1 ? (
            <RegisterStep1
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          ) : (
            <RegisterStep2
              formData={formData}
              updateFormData={updateFormData}
              onBack={() => setCurrentStep(1)}
            />
          )}
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
    marginBottom: 24,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  form: {
    flex: 1,
  },
});