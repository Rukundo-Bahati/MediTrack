import { useRouter } from 'expo-router';
import { AlertTriangle, Package, ScanLine, Shield, TrendingUp } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  BounceIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FlipInEasyX,
  runOnJS,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, RoleColors } from '../../../constants/colors';
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
    <View style={styles.container}>
      <Animated.View 
        entering={SlideInDown.delay(100).springify()}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <Animated.View entering={FadeInLeft.delay(200)}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </Animated.View>
        <Animated.View 
          entering={FadeInRight.delay(300).springify()}
          style={[styles.roleBadge, { backgroundColor: RoleColors[user?.role || 'consumer'] + '20' }]}
        >
          <Text style={[styles.roleText, { color: RoleColors[user?.role || 'consumer'] }]}>
            {user?.role?.toUpperCase()}
          </Text>
        </Animated.View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={ZoomIn.delay(400).springify()}
          style={styles.heroSection}
        >
          <AnimatedTouchableOpacity
            style={[styles.scanCard, animatedScanCardStyle]}
            {...createPressHandler(scanCardScale, handleScan)}
          >
            <Animated.View 
              entering={BounceIn.delay(600)}
              style={styles.scanIconContainer}
            >
              <ScanLine size={48} color={Colors.white} strokeWidth={2} />
            </Animated.View>
            <Animated.View 
              entering={FadeInRight.delay(700)}
              style={styles.scanContent}
            >
              <Text style={styles.scanTitle}>Scan QR Code</Text>
              <Text style={styles.scanDescription}>Verify medicine authenticity instantly</Text>
            </Animated.View>
          </AnimatedTouchableOpacity>
        </Animated.View>



        <Animated.View 
          entering={FadeInUp.delay(800).springify()}
          style={styles.statsSection}
        >
          <Animated.View 
            entering={FadeInLeft.delay(900)}
            style={styles.statsGrid}
          >
            <Animated.View 
              entering={FlipInEasyX.delay(1000)}
              style={styles.statCard}
            >
              <Animated.View 
                entering={BounceIn.delay(1100)}
                style={[styles.statIcon, { backgroundColor: Colors.primary + '15' }]}
              >
                <Shield size={24} color={Colors.primary} />
              </Animated.View>
              <Text style={styles.statValue}>2,451</Text>
              <Text style={styles.statLabel}>Verified Batches</Text>
            </Animated.View>

            <Animated.View 
              entering={FlipInEasyX.delay(1100)}
              style={styles.statCard}
            >
              <Animated.View 
                entering={BounceIn.delay(1200)}
                style={[styles.statIcon, { backgroundColor: Colors.accent + '15' }]}
              >
                <AlertTriangle size={24} color={Colors.accent} />
              </Animated.View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Reports Filed</Text>
            </Animated.View>

            <Animated.View 
              entering={FlipInEasyX.delay(1200)}
              style={styles.statCard}
            >
              <Animated.View 
                entering={BounceIn.delay(1300)}
                style={[styles.statIcon, { backgroundColor: Colors.primary + '15' }]}
              >
                <Package size={24} color={Colors.primary} />
              </Animated.View>
              <Text style={styles.statValue}>98.5%</Text>
              <Text style={styles.statLabel}>Authentic Rate</Text>
            </Animated.View>

            <Animated.View 
              entering={FlipInEasyX.delay(1300)}
              style={styles.statCard}
            >
              <Animated.View 
                entering={BounceIn.delay(1400)}
                style={[styles.statIcon, { backgroundColor: Colors.accent + '15' }]}
              >
                <TrendingUp size={24} color={Colors.accent} />
              </Animated.View>
              <Text style={styles.statValue}>+15%</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </Animated.View>
          </Animated.View>
        </Animated.View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>How It Works</Text>
          </View>
          
          <View style={styles.stepsContainer}>
            <View style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: Colors.primary }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Scan QR Code</Text>
                <Text style={styles.stepDescription}>Find the QR code on medicine packaging and scan it</Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: Colors.accent }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Blockchain Verification</Text>
                <Text style={styles.stepDescription}>System checks batch authenticity on Ethereum blockchain</Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: Colors.primary }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get Results</Text>
                <Text style={styles.stepDescription}>Instant verification with full supply chain history</Text>
              </View>
            </View>
          </View>
        </View>

        <Animated.View 
          entering={FadeInUp.delay(1800).springify()}
          style={styles.quickActions}
        >
          <AnimatedTouchableOpacity
            entering={ZoomIn.delay(1900).springify()}
            style={[styles.quickActionCard, { borderColor: Colors.accent + '40' }, animatedQuickAction1Style]}
            {...createPressHandler(quickAction1Scale, handleReportIssue)}
          >
            <Animated.View 
              entering={BounceIn.delay(2000)}
              style={[styles.quickActionIcon, { backgroundColor: Colors.accent + '15' }]}
            >
              <AlertTriangle size={24} color={Colors.accent} />
            </Animated.View>
            <Text style={[styles.quickActionText, { color: Colors.accent }]}>Report Suspicious</Text>
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity
            entering={ZoomIn.delay(2000).springify()}
            style={[styles.quickActionCard, { borderColor: Colors.primary + '40' }, animatedQuickAction2Style]}
            {...createPressHandler(quickAction2Scale, handleViewAlerts)}
          >
            <Animated.View 
              entering={BounceIn.delay(2100)}
              style={[styles.quickActionIcon, { backgroundColor: Colors.primary + '15' }]}
            >
              <Package size={24} color={Colors.primary} />
            </Animated.View>
            <Text style={[styles.quickActionText, { color: Colors.primary }]}>View Alerts</Text>
          </AnimatedTouchableOpacity>
        </Animated.View>

        <View style={styles.infoCard}>
          <Shield size={32} color={Colors.primary} />
          <Text style={styles.infoTitle}>Fighting Counterfeit Drugs</Text>
          <Text style={styles.infoDescription}>
            500,000 deaths annually from fake medicines. Every scan helps protect lives.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  greeting: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    flexShrink: 1,
    maxWidth: '80%',
  },
  roleText: {
    fontSize: 9,
    fontWeight: '700' as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
  },
  heroSection: {
    marginBottom: 24,
  },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  scanIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scanContent: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  scanDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsSection: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
    textAlign: 'center',
  },
  stepsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '20',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 80,
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
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
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
});