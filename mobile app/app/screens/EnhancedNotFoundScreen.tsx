import { useRouter } from 'expo-router';
import { AlertCircle, ArrowLeft, Home, Package, Scan, Shield } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

const quickActions = [
  { icon: Scan, label: 'Scan Medicine', route: '/scan', color: Colors.primary },
  { icon: Package, label: 'View Batches', route: '/batches', color: Colors.accent },
  { icon: Shield, label: 'Safety Info', route: '/safety', color: Colors.primary },
];

export default function EnhancedNotFoundScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  
  // Animation refs
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const medicalFacts = [
    "Blockchain technology helps prevent counterfeit medicines by creating an immutable record.",
    "Over 1 million people die annually from counterfeit drugs worldwide.",
    "QR codes on medicine packages can store complete supply chain information.",
    "Smart contracts automatically verify medicine authenticity in real-time.",
  ];

  useEffect(() => {
    // Bounce animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in and slide up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotate facts every 4 seconds
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % medicalFacts.length);
    }, 4000);

    return () => clearInterval(factInterval);
  }, [bounceAnim, fadeAnim, slideAnim]);

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

  const handleQuickAction = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Animated Icon with Pulse Effect */}
          <Animated.View 
            style={[
              styles.iconContainer,
              { transform: [{ translateY: bounceAnim }] }
            ]}
          >
            <View style={styles.iconPulse} />
            <AlertCircle size={80} color={Colors.primary} strokeWidth={2} />
          </Animated.View>

          {/* Error Code with Gradient Effect */}
          <View style={styles.errorSection}>
            <View style={styles.errorCodeContainer}>
              <Text style={styles.errorCode}>4</Text>
              <View style={styles.errorCodeMiddle}>
                <Package size={40} color={Colors.accent} />
              </View>
              <Text style={styles.errorCode}>4</Text>
            </View>
            <Text style={styles.errorSubtext}>Page Not Found</Text>
          </View>

          {/* Main Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.title}>Lost in the Supply Chain?</Text>
            <Text style={styles.description}>
              Looks like this page took a detour! Just like we track medicines 
              through the blockchain, let's get you back on the right path.
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.quickActionCard, { borderColor: action.color + '30' }]}
                    onPress={() => handleQuickAction(action.route)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                      <IconComponent size={24} color={action.color} />
                    </View>
                    <Text style={[styles.quickActionText, { color: action.color }]}>
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGoHome}
              activeOpacity={0.8}
            >
              <Home size={20} color={Colors.white} />
              <Text style={styles.primaryButtonText}>Return Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <ArrowLeft size={20} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>

          {/* Rotating Medical Facts */}
          <View style={styles.factContainer}>
            <View style={styles.factHeader}>
              <Shield size={20} color={Colors.primary} />
              <Text style={styles.factTitle}>MediTrack Insight</Text>
            </View>
            <Text style={styles.factText} key={currentFactIndex}>
              {medicalFacts[currentFactIndex]}
            </Text>
            <View style={styles.factIndicators}>
              {medicalFacts.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.factIndicator,
                    currentFactIndex === index && styles.factIndicatorActive
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Help Section */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              If you're experiencing technical issues, try refreshing the app or 
              contact our support team for assistance.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  iconPulse: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary + '10',
    borderWidth: 2,
    borderColor: Colors.primary + '20',
  },
  errorSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  errorCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorCode: {
    fontSize: 80,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -4,
  },
  errorCodeMiddle: {
    marginHorizontal: 16,
    padding: 8,
    backgroundColor: Colors.accent + '15',
    borderRadius: 12,
  },
  errorSubtext: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.accent,
    letterSpacing: 1,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
    paddingHorizontal: 8,
  },
  quickActionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  navigationContainer: {
    width: '100%',
    gap: 12,
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
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  factContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  factTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  factText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  factIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  factIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  factIndicatorActive: {
    backgroundColor: Colors.accent,
    width: 24,
  },
  helpContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});