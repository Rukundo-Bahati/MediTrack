import { useRouter } from 'expo-router';
import { AlertTriangle, ArrowLeft, Camera } from 'lucide-react-native';
import { useState } from 'react';
import {
    Alert,
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
import { Colors } from '../../constants/colors';

export default function ReportSuspiciousScreen() {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please describe the suspicious medicine');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Report Submitted',
        'Thank you for reporting. Authorities will investigate this matter.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          <View style={styles.iconContainer}>
            <AlertTriangle size={32} color={Colors.danger} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Report Suspicious Medicine</Text>
          <Text style={styles.subtitle}>Help protect others by reporting counterfeit drugs</Text>
        </View>

        <View style={styles.form}>
          {/* Warning Banner */}
          <View style={styles.warningBanner}>
            <AlertTriangle size={20} color={Colors.danger} />
            <Text style={styles.warningText}>
              If this is a medical emergency, contact emergency services immediately
            </Text>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the suspicious medicine (appearance, packaging, effects, etc.)"
              placeholderTextColor={Colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Where did you get this medicine?</Text>
            <TextInput
              style={styles.input}
              placeholder="Pharmacy name, location, or source"
              placeholderTextColor={Colors.textSecondary}
              value={location}
              onChangeText={setLocation}
              editable={!isSubmitting}
            />
          </View>

          {/* Contact */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Information (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Email or phone for follow-up"
              placeholderTextColor={Colors.textSecondary}
              value={contact}
              onChangeText={setContact}
              editable={!isSubmitting}
            />
          </View>

          {/* Photo Button */}
          <TouchableOpacity
            style={styles.photoButton}
            onPress={() => Alert.alert('Feature Coming Soon', 'Photo upload will be available in the next update')}
            activeOpacity={0.7}
          >
            <Camera size={20} color={Colors.primary} />
            <Text style={styles.photoButtonText}>Add Photo (Optional)</Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Text>
          </TouchableOpacity>

          {/* Info Text */}
          <Text style={styles.infoText}>
            Your report will be sent to relevant authorities. All reports are treated confidentially.
          </Text>
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.danger + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.danger + '15',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: Colors.danger,
    fontWeight: '500' as const,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    gap: 8,
  },
  photoButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  submitButton: {
    backgroundColor: Colors.danger,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});