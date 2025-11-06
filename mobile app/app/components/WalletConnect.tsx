import {
    AlertCircle,
    CheckCircle,
    ExternalLink,
    Wallet
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    BounceIn,
    FadeIn,
    SlideInRight
} from 'react-native-reanimated';
import { ModernButton } from '../../components/ui/modern-button';
import { ModernCard } from '../../components/ui/modern-card';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useWallet } from '../context/WalletContext';

interface WalletConnectProps {
  onConnected?: () => void;
  showBalance?: boolean;
  compact?: boolean;
}

export default function WalletConnect({ 
  onConnected, 
  showBalance = true, 
  compact = false 
}: WalletConnectProps) {
  const {
    walletState,
    isConnecting,
    connect,
    disconnect,
    switchNetwork,
    isMetaMaskAvailable,
  } = useWallet();

  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  const handleConnect = async () => {
    try {
      if (!isMetaMaskAvailable) {
        Alert.alert(
          'MetaMask Required',
          'Please install MetaMask mobile app to connect your wallet.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Install MetaMask', 
              onPress: () => Linking.openURL('https://metamask.io/download/') 
            }
          ]
        );
        return;
      }

      await connect();
      onConnected?.();
    } catch (error: any) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disconnect', 
          style: 'destructive',
          onPress: async () => {
            try {
              await disconnect();
            } catch (error) {
              console.error('Disconnect failed:', error);
            }
          }
        }
      ]
    );
  };

  const handleSwitchNetwork = async (network: string) => {
    try {
      await switchNetwork(network);
      setShowNetworkSelector(false);
    } catch (error: any) {
      console.error('Network switch failed:', error);
    }
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkColor = (chainId: string | null): string => {
    const colors: { [key: string]: string } = {
      '0x1': Colors.primary,      // Ethereum
      '0xaa36a7': Colors.accent,  // Sepolia
      '0x13881': Colors.success,  // Mumbai
      '0x61': Colors.warning,     // BSC Testnet
    };
    return colors[chainId || ''] || Colors.textSecondary;
  };

  if (compact && walletState.isConnected) {
    return (
      <Animated.View entering={FadeIn} style={styles.compactContainer}>
        <TouchableOpacity 
          style={styles.compactWallet}
          onPress={() => setShowNetworkSelector(!showNetworkSelector)}
        >
          <View style={[styles.networkDot, { backgroundColor: getNetworkColor(walletState.chainId) }]} />
          <Text style={styles.compactAddress}>
            {formatAddress(walletState.address || '')}
          </Text>
          <Wallet size={16} color={Colors.primary} />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (!walletState.isConnected) {
    return (
      <Animated.View entering={SlideInRight.delay(200)}>
        <ModernCard variant="elevated" style={styles.connectCard}>
          <View style={styles.connectHeader}>
            <View style={styles.walletIcon}>
              <Wallet size={32} color={Colors.primary} />
            </View>
            <View style={styles.connectContent}>
              <Text style={styles.connectTitle}>Connect Wallet</Text>
              <Text style={styles.connectDescription}>
                {isMetaMaskAvailable 
                  ? 'Connect your MetaMask wallet to interact with blockchain'
                  : 'MetaMask required for blockchain interactions'
                }
              </Text>
            </View>
          </View>

          {!isMetaMaskAvailable && (
            <Animated.View entering={BounceIn.delay(300)} style={styles.warningContainer}>
              <AlertCircle size={20} color={Colors.warning} />
              <Text style={styles.warningText}>
                MetaMask mobile app is required for wallet functionality
              </Text>
            </Animated.View>
          )}

          <ModernButton
            title={isConnecting ? 'Connecting...' : isMetaMaskAvailable ? 'Connect MetaMask' : 'Install MetaMask'}
            onPress={handleConnect}
            variant="primary"
            size="large"
            disabled={isConnecting}
            loading={isConnecting}
            style={styles.connectButton}
          />

          {!isMetaMaskAvailable && (
            <TouchableOpacity 
              style={styles.learnMore}
              onPress={() => Linking.openURL('https://metamask.io/download/')}
            >
              <Text style={styles.learnMoreText}>Learn more about MetaMask</Text>
              <ExternalLink size={16} color={Colors.accent} />
            </TouchableOpacity>
          )}
        </ModernCard>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn}>
      <ModernCard variant="elevated" style={styles.walletCard}>
        {/* Wallet Header */}
        <View style={styles.walletHeader}>
          <View style={styles.walletInfo}>
            <View style={styles.walletIconConnected}>
              <CheckCircle size={24} color={Colors.success} />
            </View>
            <View style={styles.walletDetails}>
              <Text style={styles.walletAddress}>
                {formatAddress(walletState.address || '')}
              </Text>
              <View style={styles.networkInfo}>
                <View style={[styles.networkDot, { backgroundColor: getNetworkColor(walletState.chainId) }]} />
                <Text style={styles.networkName}>
                  {walletState.networkName || 'Unknown Network'}
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.disconnectButton}
            onPress={handleDisconnect}
          >
            <Text style={styles.disconnectText}>Disconnect</Text>
          </TouchableOpacity>
        </View>

        {/* Balance */}
        {showBalance && walletState.balance && (
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balanceValue}>
              {walletState.balance} {walletState.networkName?.includes('Polygon') ? 'MATIC' : 'ETH'}
            </Text>
          </View>
        )}

        {/* Network Selector */}
        {showNetworkSelector && (
          <Animated.View entering={SlideInRight} style={styles.networkSelector}>
            <Text style={styles.networkSelectorTitle}>Switch Network</Text>
            <View style={styles.networkList}>
              {[
                { key: 'sepolia', name: 'Sepolia Testnet', chainId: '0xaa36a7' },
                { key: 'mumbai', name: 'Polygon Mumbai', chainId: '0x13881' },
                { key: 'bscTestnet', name: 'BSC Testnet', chainId: '0x61' },
              ].map((network) => (
                <TouchableOpacity
                  key={network.key}
                  style={[
                    styles.networkOption,
                    walletState.chainId === network.chainId && styles.networkOptionActive
                  ]}
                  onPress={() => handleSwitchNetwork(network.key)}
                >
                  <View style={[styles.networkDot, { backgroundColor: getNetworkColor(network.chainId) }]} />
                  <Text style={[
                    styles.networkOptionText,
                    walletState.chainId === network.chainId && styles.networkOptionTextActive
                  ]}>
                    {network.name}
                  </Text>
                  {walletState.chainId === network.chainId && (
                    <CheckCircle size={16} color={Colors.success} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Actions */}
        <View style={styles.walletActions}>
          <ModernButton
            title={showNetworkSelector ? 'Hide Networks' : 'Switch Network'}
            onPress={() => setShowNetworkSelector(!showNetworkSelector)}
            variant="outline"
            size="medium"
          />
        </View>
      </ModernCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Compact styles
  compactContainer: {
    alignItems: 'flex-end',
  },
  compactWallet: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    gap: Spacing.sm,
  },
  compactAddress: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: '600',
  },

  // Connect card styles
  connectCard: {
    marginBottom: Spacing.lg,
  },
  connectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  walletIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  connectContent: {
    flex: 1,
  },
  connectTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  connectDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  warningText: {
    ...Typography.bodySmall,
    color: Colors.warning,
    flex: 1,
  },
  connectButton: {
    marginBottom: Spacing.md,
  },
  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  learnMoreText: {
    ...Typography.bodySmall,
    color: Colors.accent,
  },

  // Connected wallet styles
  walletCard: {
    marginBottom: Spacing.lg,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  walletIconConnected: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  walletDetails: {
    flex: 1,
  },
  walletAddress: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  networkName: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  disconnectButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  disconnectText: {
    ...Typography.bodySmall,
    color: Colors.danger,
    fontWeight: '600',
  },

  // Balance styles
  balanceContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  balanceLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  balanceValue: {
    ...Typography.h3,
    color: Colors.text,
    fontWeight: '600',
  },

  // Network selector styles
  networkSelector: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  networkSelectorTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  networkList: {
    gap: Spacing.sm,
  },
  networkOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 8,
    backgroundColor: Colors.white,
    gap: Spacing.md,
  },
  networkOptionActive: {
    backgroundColor: Colors.primary + '15',
  },
  networkOptionText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  networkOptionTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // Actions styles
  walletActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});