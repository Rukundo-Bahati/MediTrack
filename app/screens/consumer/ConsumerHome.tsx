import { useRouter } from 'expo-router';
import { AlertTriangle, Package, ScanLine, Shield } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInDown,
    runOnJS,
    SlideInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModernCard } from '../../../components/ui/modern-card';
import { ScreenLayout } from '../../../components/ui/modern-layout';
import { Colors } from '../../../constants/colors';
import { Shadows } from '../../../constants/shadows';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../context/AuthContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  // Animation values
  const scanCardScale = useSharedValue(1);
  const quickAction1Scale = useSharedValue(1);
  const quickAction2Scale = useSharedValue(1);

  // Animated press handlers
  const createPressHandler = (cardScale: any, handler: () => void) => {
    return {
      onPressIn: () => {
        cardScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      },
      onPressOut: () => {
        cardScale.value = withSpring(1, { damping: 15, stiffness: 300 });
      },
      onPress: () => {
        runOnJS(handler)();
      }
    };
  };

  const handleScan = () => {
    router.push('/scan' as any);
  };

  const handleReportIssue = () => {
    router.push('/report-issue' as any);
  };

  const handleViewAlerts = () => {
    router.push('/alerts' as any);
  };

  // Animated styles
  const animatedScanCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scanCardScale.value }]
  }));

  const animatedQuickAction1Style = useAnimatedStyle(() => ({
    transform: [{ scale: quickAction1Scale.value }]
  }));

  const animatedQuickAction2Style = useAnimatedStyle(() => ({
    transform: [{ scale: quickAction2Scale.value }]
  }));



  return (
    <ScreenLayout scrollable style={styles.container}>
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(100)}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Shield size={32} color={Colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.greeting}>Medicine Verification</Text>
          <Text style={styles.userName}>Welcome back, {user?.name}</Text>
        </View>
      </Animated.View>
      {/* Hero Scan Section */}
      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.heroSection}
      >
        <TouchableOpacity
          onPress={handleScan}
          activeOpacity={0.7}
        >
          <ModernCard variant="primary" style={styles.scanCard}>
            <View style={styles.scanIconContainer}>
              <ScanLine size={48} color={Colors.white} strokeWidth={2} />
            </View>
            <View style={styles.scanContent}>
              <Text style={styles.scanTitle}>Scan QR Code</Text>
              <Text style={styles.scanDescription}>Verify medicine authenticity instantly</Text>
            </View>
          </ModernCard>
        </TouchableOpacity>
      </Animated.View>



      {/* Stats */}
      <Animated.View 
        entering={FadeInDown.delay(300)}
        style={styles.statsContainer}
      >
        <Animated.View entering={SlideInRight.delay(400)}>
          <ModernCard variant="elevated" style={styles.statCard}>
            <Shield size={24} color={Colors.primary} />
            <Text style={styles.statNumber}>2,451</Text>
            <Text style={styles.statLabel}>Verified Batches</Text>
          </ModernCard>
        </Animated.View>
        <Animated.View entering={SlideInRight.delay(500)}>
          <ModernCard variant="elevated" style={styles.statCard}>
            <Package size={24} color={Colors.accent} />
            <Text style={[styles.statNumber, { color: Colors.accent }]}>98.5%</Text>
            <Text style={styles.statLabel}>Authentic Rate</Text>
          </ModernCard>
        </Animated.View>
      </Animated.View>

      {/* How It Works */}
      <Animated.View 
        entering={FadeInDown.delay(600)}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.stepsContainer}>
          {[
            {
              number: '1',
              title: 'Scan QR Code',
              description: 'Find the QR code on medicine packaging and scan it',
              color: Colors.primary
            },
            {
              number: '2',
              title: 'Blockchain Verification',
              description: 'System checks batch authenticity on blockchain',
              color: Colors.accent
            },
            {
              number: '3',
              title: 'Get Results',
              description: 'Instant verification with supply chain history',
              color: Colors.primary
            }
          ].map((step, index) => (
            <Animated.View
              key={step.number}
              entering={SlideInRight.delay(700 + index * 100)}
            >
              <ModernCard variant="elevated" style={styles.stepCard}>
                <View style={[styles.stepNumber, { backgroundColor: step.color }]}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </ModernCard>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View 
        entering={FadeInDown.delay(1000)}
        style={styles.quickActions}
      >
        <Animated.View entering={SlideInRight.delay(1100)}>
          <TouchableOpacity
            onPress={handleReportIssue}
            activeOpacity={0.7}
          >
            <ModernCard variant="outlined" style={[styles.quickActionCard, { borderColor: Colors.accent }] as any}>
              <View style={[styles.quickActionIcon, { backgroundColor: Colors.accent + '15' }]}>
                <AlertTriangle size={24} color={Colors.accent} />
              </View>
              <Text style={[styles.quickActionText, { color: Colors.accent }]}>Report Suspicious</Text>
            </ModernCard>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={SlideInRight.delay(1200)}>
          <TouchableOpacity
            onPress={handleViewAlerts}
            activeOpacity={0.7}
          >
            <ModernCard variant="outlined" style={[styles.quickActionCard, { borderColor: Colors.primary }] as any}>
              <View style={[styles.quickActionIcon, { backgroundColor: Colors.primary + '15' }]}>
                <Package size={24} color={Colors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: Colors.primary }]}>View Alerts</Text>
            </ModernCard>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Info Card */}
      <Animated.View entering={FadeInDown.delay(1300)}>
        <ModernCard variant="filled" style={styles.infoCard}>
          <Shield size={48} color={Colors.primary} />
          <Text style={styles.infoTitle}>Fighting Counterfeit Drugs</Text>
          <Text style={styles.infoDescription}>
            500,000 deaths annually from fake medicines. Every scan helps protect lives.
          </Text>
        </ModernCard>
      </Animated.View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Styles
  header: {
    paddingHorizontal: Spacing.layout.container,
    paddingVertical: Spacing.xl,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  userName: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Hero Section Styles
  heroSection: {
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.xl,
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  scanIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  scanContent: {
    flex: 1,
  },
  scanTitle: {
    ...Typography.h2,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  scanDescription: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Section Styles
  section: {
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // Steps Styles
  stepsContainer: {
    gap: Spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  stepNumberText: {
    ...Typography.h3,
    color: Colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  stepDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Quick Actions Styles
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.layout.container,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    ...Typography.bodySmall,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Info Card Styles
  infoCard: {
    marginHorizontal: Spacing.layout.container,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  infoTitle: {
    ...Typography.h3,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  infoDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});