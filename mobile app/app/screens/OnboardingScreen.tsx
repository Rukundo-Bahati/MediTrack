import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Package, ScanLine, Shield } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const slides = [
  {
    id: 1,
    title: 'Counterfeit Drugs Kill',
    description: '500,000 deaths annually in developing regions from fake medicines. We can stop this.',
    Icon: Package,
    color: Colors.primary,
  },
  {
    id: 2,
    title: 'Blockchain Protection',
    description: 'Every medicine tracked on blockchain. Tamper-proof, transparent, and trustworthy.',
    Icon: Shield,
    color: Colors.accent,
  },
  {
    id: 3,
    title: 'Scan to Verify',
    description: 'Simply scan the QR code to instantly verify authenticity. Safety in seconds.',
    Icon: ScanLine,
    color: Colors.primary,
  },
];

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeInitialOnboarding } = useAuth();

  // Animation values
  const iconScale = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const contentOpacity = useSharedValue(1);

  useEffect(() => {
    // Animate icon entrance
    iconScale.value = withDelay(300, withSpring(1, { damping: 15, stiffness: 300 }));
    iconRotation.value = withDelay(500, withSequence(
      withTiming(360, { duration: 800 }),
      withTiming(0, { duration: 0 })
    ));
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    await completeInitialOnboarding();
    // The app will automatically navigate to welcome screen via the index.tsx logic
  };

  const currentSlide = slides[currentIndex];
  const Icon = currentSlide.Icon;

  // Animated styles
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotation.value}deg` }
    ]
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value
  }));

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Animated.View
        entering={FadeInDown.delay(100)}
        style={styles.header}
      >
        {currentIndex < slides.length - 1 && (
          <AnimatedTouchableOpacity
            entering={FadeInRight.delay(200)}
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip</Text>
          </AnimatedTouchableOpacity>
        )}
      </Animated.View>

      <Animated.View
        style={[styles.content, contentAnimatedStyle]}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            iconAnimatedStyle
          ]}
        >
          <Icon size={80} color={Colors.white} strokeWidth={1.5} />
        </Animated.View>

        <Animated.Text
          entering={FadeInUp.delay(600)}
          style={styles.title}
        >
          {currentSlide.title}
        </Animated.Text>

        <Animated.Text
          entering={FadeInUp.delay(700)}
          style={styles.description}
        >
          {currentSlide.description}
        </Animated.Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(800)}
        style={styles.footer}
      >
        <Animated.View
          entering={ZoomIn.delay(900)}
          style={styles.pagination}
        >
          {slides.map((_, index) => (
            <Animated.View
              key={index}
              entering={BounceIn.delay(1000 + index * 100)}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
                { backgroundColor: currentIndex === index ? Colors.white : 'rgba(255, 255, 255, 0.3)' },
              ]}
            />
          ))}
        </Animated.View>

        <AnimatedTouchableOpacity
          entering={SlideInRight.delay(1100)}
          onPress={handleNext}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          style={[styles.button, buttonAnimatedStyle]}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </AnimatedTouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  skipText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.9,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});