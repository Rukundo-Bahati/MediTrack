import { Colors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Shield,
  Smartphone,
  Wallet
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  BounceIn,
  FadeInDown,
  SlideInRight,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WalletConnect from '../../components/WalletConnect';
import { useWallet } from '../../context/WalletContext';
import { StakeholderRole } from './RoleSelectionScreen';

const ROLE_DESCRIPTIONS = {
  manufacturer: 'As a manufacturer, you\'ll register new medicine batches and track production quality.',
  distributor: 'As a distributor, you\'ll manage shipments and update location data throughout transport.',
  pharmacist: 'As a pharmacist, you\'ll verify medicine authenticity and manage pharmacy inventory.',
  regulator: 'As a regulator, you\'ll monitor compliance and investigate quality issues across the supply chain.',
};

export default function WalletSetupScreen() {
  const { role } = useLocalSearchParams<{ role: StakeholderRole }>();
  const [setupStep, setSetupStep] = useState<'intro' | 'connecting' | 'connected'>('intro');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { walletState, isMetaMaskAvailable } = useWallet();

  useEffect(() => {
    if (walletState.isConnected) {
      setSetupStep('connected');
    }
  }, [walletState.isConnected]);

  const handleBack = () => {
    console.log('Back button pressed');
    try {
      router.back();
    } catch (error) {
      console.error('Error navigating back:', error);
      // Fallback navigation
      router.push('/onboarding/role-selection' as any);
    }
  };

  const handleStartSetup = () => {
    setSetupStep('connecting');
  };

  const handleWalletConnected = () => {
    setSetupStep('connected');
  };

  const handleComplete = () => {
    // Save role and navigate to main app
    router.replace(`/(tabs)?role=${role}` as any);
  };

  const handleInstallMetaMask = () => {
    Linking.openURL('https://metamask.io/download/');
  };

  const renderIntroStep = () => (
    <>
      <Animated.View
        entering={FadeInDown.delay(200)}
        style={styles.introContent}
      >
        <View style={styles.walletIcon}>
          <Wallet size={48} color={Colors.primary} />
        </View>
        <Text style={styles.introTitle}>MetaMask Wallet Required</Text>
        <Text style={styles.introDescription}>
          {ROLE_DESCRIPTIONS[role as StakeholderRole]}
        </Text>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Why MetaMask?</Text>
          <View style={styles.benefits}>
            <Animated.View
              entering={SlideInRight.delay(400)}
              style={styles.benefit}
            >
              <Shield size={20} color={Colors.success} />
              <Text style={styles.benefitText}>Secure blockchain authentication</Text>
            </Animated.View>
            <Animated.View
              entering={SlideInRight.delay(500)}
              style={styles.benefit}
            >
              <CheckCircle size={20} color={Colors.success} />
              <Text style={styles.benefitText}>Cryptographic transaction signing</Text>
            </Animated.View>
            <Animated.View
              entering={SlideInRight.delay(600)}
              style={styles.benefit}
            >
              <Wallet size={20} color={Colors.success} />
              <Text style={styles.benefitText}>Decentralized identity management</Text>
            </Animated.View>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={BounceIn.delay(700)}
        style={styles.actionContainer}
      >
        {isMetaMaskAvailable ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartSetup}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Connect MetaMask</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleInstallMetaMask}
              activeOpacity={0.8}
            >
              <Smartphone size={20} color={Colors.white} />
              <Text style={styles.primaryButtonText}>Install MetaMask</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL('https://metamask.io/download/')}
            >
              <Text style={styles.linkText}>Learn more about MetaMask</Text>
              <ExternalLink size={16} color={Colors.primary} />
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </>
  );

  const renderConnectingStep = () => (
    <Animated.View
      entering={FadeInDown}
      style={styles.connectingContent}
    >
      <Text style={styles.connectingTitle}>Connect Your Wallet</Text>
      <Text style={styles.connectingDescription}>
        Follow the prompts in MetaMask to connect your wallet
      </Text>

      <WalletConnect
        onConnected={handleWalletConnected}
        showBalance={false}
      />
    </Animated.View>
  );

  const renderConnectedStep = () => (
    <Animated.View
      entering={BounceIn}
      style={styles.connectedContent}
    >
      <View style={styles.successIcon}>
        <CheckCircle size={48} color={Colors.success} />
      </View>
      <Text style={styles.connectedTitle}>Wallet Connected!</Text>
      <Text style={styles.connectedDescription}>
        Your MetaMask wallet is now connected and ready for blockchain transactions.
      </Text>

      <View style={styles.walletInfo}>
        <Text style={styles.walletLabel}>Connected Address:</Text>
        <Text style={styles.walletAddress}>
          {walletState.address?.substring(0, 10)}...{walletState.address?.substring(38)}
        </Text>
        <Text style={styles.networkInfo}>
          Network: {walletState.networkName}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleComplete}
        activeOpacity={0.8}
      >
        <Text style={styles.completeButtonText}>
          Continue as {role}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Animated.View entering={FadeInDown.delay(100)}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200)} style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Wallet Setup</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300)}>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 2 of 2</Text>
          </View>
        </Animated.View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {setupStep === 'intro' && renderIntroStep()}
        {setupStep === 'connecting' && renderConnectingStep()}
        {setupStep === 'connected' && renderConnectedStep()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.layout.container,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 5,
    ...Shadows.subtle,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  stepIndicator: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
  },
  stepText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },

  // Intro Step
  introContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  walletIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  introTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  introDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  benefitsContainer: {
    alignSelf: 'stretch',
    marginBottom: Spacing.xl,
  },
  benefitsTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  benefits: {
    gap: Spacing.md,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  benefitText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
  },
  actionContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.primary,
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
  linkButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  linkText: {
    ...Typography.bodyMedium,
    color: Colors.primary,
  },

  // Connecting Step
  connectingContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  connectingTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  connectingDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },

  // Connected Step
  connectedContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  connectedTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  connectedDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  walletInfo: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.lg,
    borderRadius: 12,
    alignSelf: 'stretch',
    marginBottom: Spacing.xl,
  },
  walletLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  walletAddress: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontFamily: 'monospace',
    marginBottom: Spacing.sm,
  },
  networkInfo: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  completeButton: {
    height: 56,
    backgroundColor: Colors.success,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    ...Shadows.success,
  },
  completeButtonText: {
    ...Typography.button,
    color: Colors.white,
    textTransform: 'capitalize',
  },
});