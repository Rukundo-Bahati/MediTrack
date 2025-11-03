import { useRouter } from 'expo-router';
import { AlertCircle, ArrowLeft, Home, Search } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

export default function NotFoundScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation for content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [bounceAnim, fadeAnim]);

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSearch = () => {
    // Navigate to search or actions screen
    router.push('/actions' as any);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Animated Icon */}
        <Animated.View 
          style={[
            styles.iconContainer,
            { transform: [{ translateY: bounceAnim }] }
          ]}
        >
          <AlertCircle size={80} color={Colors.primary} strokeWidth={2} />
        </Animated.View>

        {/* Error Code */}
        <View style={styles.errorCodeContainer}>
          <Text style={styles.errorCode}>404</Text>
          <View style={styles.errorCodeUnderline} />
        </View>

        {/* Main Message */}
        <Text style={styles.title}>Oops! Page Not Found</Text>
        <Text style={styles.description}>
          The page you're looking for seems to have wandered off. 
          Don't worry, even the best medicines sometimes get misplaced!
        </Text>

        {/* Helpful Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>What you can do:</Text>
          
          <View style={styles.suggestionItem}>
            <View style={styles.suggestionBullet} />
            <Text style={styles.suggestionText}>Check the URL for typos</Text>
          </View>
          
          <View style={styles.suggestionItem}>
            <View style={styles.suggestionBullet} />
            <Text style={styles.suggestionText}>Go back to the previous page</Text>
          </View>
          
          <View style={styles.suggestionItem}>
            <View style={styles.suggestionBullet} />
            <Text style={styles.suggestionText}>Return to the home screen</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoHome}
            activeOpacity={0.8}
          >
            <Home size={20} color={Colors.white} />
            <Text style={styles.primaryButtonText}>Go Home</Text>
          </TouchableOpacity>

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <ArrowLeft size={20} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>Go Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSearch}
              activeOpacity={0.8}
            >
              <Search size={20} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fun Medical Fact */}
        <View style={styles.factContainer}>
          <Text style={styles.factTitle}>💡 Did you know?</Text>
          <Text style={styles.factText}>
            Blockchain technology helps prevent counterfeit medicines by creating 
            an immutable record of each drug's journey from manufacturer to patient.
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  errorCodeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  errorCode: {
    fontSize: 72,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -2,
  },
  errorCodeUnderline: {
    width: 80,
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  suggestionsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  actionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 6,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  factContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  factTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  factText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});