import { useRouter } from 'expo-router';
import { AlertTriangle, BarChart3, Factory, Package, QrCode, TrendingUp } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    BounceIn,
    FadeInDown,
    FadeInLeft,
    FadeInRight,
    FadeInUp,
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

export default function ManufacturerHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  // Animation values for interactive elements
  const cardScale1 = useSharedValue(1);
  const cardScale2 = useSharedValue(1);
  const cardScale3 = useSharedValue(1);
  const cardScale4 = useSharedValue(1);

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

  const handleRegisterBatch = () => {
    router.push('/register-batch' as any);
  };

  const handleGenerateQR = () => {
    router.push('/generate-qr' as any);
  };

  const handleProductionAnalytics = () => {
    router.push('/analytics' as any);
  };

  const handleTrackDistribution = () => {
    router.push('/track-distribution' as any);
  };

  // Animated styles for cards
  const animatedCardStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale1.value }]
  }));

  const animatedCardStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale2.value }]
  }));

  const animatedCardStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale3.value }]
  }));

  const animatedCardStyle4 = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale4.value }]
  }));

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeInDown.delay(100).springify()}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <Animated.View entering={FadeInLeft.delay(200)}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </Animated.View>
        <Animated.View 
          entering={FadeInRight.delay(300).springify()}
          style={[styles.roleBadge, { backgroundColor: RoleColors.manufacturer + '20' }]}
        >
          <Text style={[styles.roleText, { color: RoleColors.manufacturer }]}>
            MANUFACTURER
          </Text>
        </Animated.View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInUp.delay(400).springify()}
          style={styles.actionsGrid}
        >
          <AnimatedTouchableOpacity
            entering={ZoomIn.delay(500).springify()}
            style={[styles.actionCard, { backgroundColor: RoleColors.manufacturer }, animatedCardStyle1]}
            {...createPressHandler(cardScale1, handleRegisterBatch)}
          >
            <Package size={32} color={Colors.white} strokeWidth={2} />
            <Text style={styles.actionTitle}>Register Batch</Text>
            <Text style={styles.actionDescription}>Add new production batch</Text>
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity
            entering={ZoomIn.delay(600).springify()}
            style={[styles.actionCard, { 
              backgroundColor: Colors.white, 
              borderWidth: 2, 
              borderColor: Colors.orange 
            }, animatedCardStyle2]}
            {...createPressHandler(cardScale2, handleGenerateQR)}
          >
            <QrCode size={32} color={Colors.black} strokeWidth={2} />
            <Text style={[styles.actionTitle, { color: Colors.black }]}>Generate QR</Text>
            <Text style={[styles.actionDescription, { color: Colors.textSecondary }]}>Create batch QR codes</Text>
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity
            entering={ZoomIn.delay(700).springify()}
            style={[styles.actionCard, { backgroundColor: Colors.info }, animatedCardStyle3]}
            {...createPressHandler(cardScale3, handleProductionAnalytics)}
          >
            <BarChart3 size={32} color={Colors.white} strokeWidth={2} />
            <Text style={styles.actionTitle}>Analytics</Text>
            <Text style={styles.actionDescription}>Production insights</Text>
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity
            entering={ZoomIn.delay(800).springify()}
            style={[styles.actionCard, { 
              backgroundColor: Colors.white, 
              borderWidth: 2, 
              borderColor: Colors.orange 
            }, animatedCardStyle4]}
            {...createPressHandler(cardScale4, handleTrackDistribution)}
          >
            <Factory size={32} color={Colors.black} strokeWidth={2} />
            <Text style={[styles.actionTitle, { color: Colors.black }]}>Track Distribution</Text>
            <Text style={[styles.actionDescription, { color: Colors.textSecondary }]}>Monitor batch flow</Text>
          </AnimatedTouchableOpacity>
        </Animated.View>

        <Animated.View 
          entering={FadeInLeft.delay(900).springify()}
          style={styles.statsGrid}
        >
          <Animated.View 
            entering={SlideInDown.delay(1000).springify()}
            style={[styles.statCard, { backgroundColor: RoleColors.manufacturer + '15' }]}
          >
            <Animated.View 
              entering={BounceIn.delay(1100)}
              style={[styles.statIcon, { backgroundColor: RoleColors.manufacturer + '25' }]}
            >
              <Package size={24} color={RoleColors.manufacturer} />
            </Animated.View>
            <Text style={styles.statValue}>847</Text>
            <Text style={styles.statLabel}>Batches Registered</Text>
          </Animated.View>

          <Animated.View 
            entering={SlideInDown.delay(1100).springify()}
            style={[styles.statCard, { backgroundColor: Colors.warning + '15' }]}
          >
            <Animated.View 
              entering={BounceIn.delay(1200)}
              style={[styles.statIcon, { backgroundColor: Colors.warning + '25' }]}
            >
              <AlertTriangle size={24} color={Colors.warning} />
            </Animated.View>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Quality Alerts</Text>
          </Animated.View>

          <Animated.View 
            entering={SlideInDown.delay(1200).springify()}
            style={[styles.statCard, { backgroundColor: Colors.success + '15' }]}
          >
            <Animated.View 
              entering={BounceIn.delay(1300)}
              style={[styles.statIcon, { backgroundColor: Colors.success + '25' }]}
            >
              <Factory size={24} color={Colors.success} />
            </Animated.View>
            <Text style={styles.statValue}>99.8%</Text>
            <Text style={styles.statLabel}>Quality Rate</Text>
          </Animated.View>

          <Animated.View 
            entering={SlideInDown.delay(1300).springify()}
            style={[styles.statCard, { backgroundColor: Colors.info + '15' }]}
          >
            <Animated.View 
              entering={BounceIn.delay(1400)}
              style={[styles.statIcon, { backgroundColor: Colors.info + '25' }]}
            >
              <TrendingUp size={24} color={Colors.info} />
            </Animated.View>
            <Text style={styles.statValue}>+8%</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </Animated.View>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(1400).springify()}
          style={styles.section}
        >
          <Animated.Text 
            entering={FadeInLeft.delay(1500)}
            style={styles.sectionTitle}
          >
            Production Process
          </Animated.Text>

          <Animated.View 
            entering={FadeInRight.delay(1600).springify()}
            style={styles.stepCard}
          >
            <Animated.View 
              entering={ZoomIn.delay(1700)}
              style={[styles.stepNumber, { backgroundColor: RoleColors.manufacturer }]}
            >
              <Text style={styles.stepNumberText}>1</Text>
            </Animated.View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Register Batch</Text>
              <Text style={styles.stepDescription}>Record production details on blockchain</Text>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInRight.delay(1700).springify()}
            style={styles.stepCard}
          >
            <Animated.View 
              entering={ZoomIn.delay(1800)}
              style={[styles.stepNumber, { backgroundColor: Colors.warning }]}
            >
              <Text style={styles.stepNumberText}>2</Text>
            </Animated.View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Generate QR Codes</Text>
              <Text style={styles.stepDescription}>Create unique identifiers for each batch</Text>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInRight.delay(1800).springify()}
            style={styles.stepCard}
          >
            <Animated.View 
              entering={ZoomIn.delay(1900)}
              style={[styles.stepNumber, { backgroundColor: Colors.success }]}
            >
              <Text style={styles.stepNumberText}>3</Text>
            </Animated.View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Quality Control</Text>
              <Text style={styles.stepDescription}>Verify batch meets safety standards</Text>
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(1900).springify()}
          style={styles.infoCard}
        >
          <Animated.View entering={BounceIn.delay(2000)}>
            <Factory size={32} color={RoleColors.manufacturer} />
          </Animated.View>
          <Animated.Text 
            entering={FadeInDown.delay(2100)}
            style={styles.infoTitle}
          >
            Manufacturing Excellence
          </Animated.Text>
          <Animated.Text 
            entering={FadeInDown.delay(2200)}
            style={styles.infoDescription}
          >
            Maintain highest quality standards and ensure full traceability for every batch produced.
          </Animated.Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 100,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    minWidth: '30%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: 16,
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
    color: Colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: RoleColors.manufacturer + '10',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: RoleColors.manufacturer + '20',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
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
});