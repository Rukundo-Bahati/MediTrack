import { Colors } from '@/constants/colors';
import { Shadows } from '@/constants/shadows';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { useRouter } from 'expo-router';
import { Package, Scan, Shield, Users } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    BounceIn,
    FadeInDown,
    FadeInUp,
    SlideInLeft,
    SlideInRight,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleConsumerPath = () => {
        router.push('/verify-medicine' as any);
    };

    const handleStakeholderPath = () => {
        router.push('/onboarding/role-selection' as any);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Animated.View
                    entering={FadeInDown.delay(200)}
                    style={styles.header}
                >
                    <View style={styles.logoContainer}>
                        <Package size={48} color={Colors.primary} strokeWidth={1.5} />
                    </View>
                    <Text style={styles.title}>Welcome to MediTrack</Text>
                    <Text style={styles.subtitle}>
                        Blockchain-powered medicine verification
                    </Text>
                </Animated.View>

                {/* Consumer Path */}
                <Animated.View
                    entering={SlideInLeft.delay(400)}
                    style={styles.pathContainer}
                >
                    <TouchableOpacity
                        style={[styles.pathCard, styles.consumerCard]}
                        onPress={handleConsumerPath}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardHeader}>
                            <Animated.View
                                entering={BounceIn.delay(600)}
                                style={[styles.pathIcon, { backgroundColor: Colors.accent + '15' }]}
                            >
                                <Scan size={32} color={Colors.accent} />
                            </Animated.View>
                            <View style={styles.cardTitleContainer}>
                                <Text style={styles.pathTitle}>Verify Medicine</Text>
                                <Text style={styles.pathDescription}>
                                    Scan QR codes to verify authenticity
                                </Text>
                            </View>
                        </View>
                        <View style={styles.pathFeatures}>
                            <View style={styles.feature}>
                                <Shield size={16} color={Colors.success} />
                                <Text style={styles.featureText}>No registration required</Text>
                            </View>
                            <View style={styles.feature}>
                                <Scan size={16} color={Colors.success} />
                                <Text style={styles.featureText}>Instant verification</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Divider */}
                <Animated.View
                    entering={FadeInUp.delay(500)}
                    style={styles.divider}
                >
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                </Animated.View>

                {/* Stakeholder Path */}
                <Animated.View
                    entering={SlideInRight.delay(700)}
                    style={styles.pathContainer}
                >
                    <TouchableOpacity
                        style={[styles.pathCard, styles.stakeholderCard]}
                        onPress={handleStakeholderPath}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardHeader}>
                            <Animated.View
                                entering={BounceIn.delay(800)}
                                style={[styles.pathIcon, { backgroundColor: Colors.primary + '15' }]}
                            >
                                <Users size={32} color={Colors.primary} />
                            </Animated.View>
                            <View style={styles.cardTitleContainer}>
                                <Text style={styles.pathTitle}>Healthcare Professional</Text>
                                <Text style={styles.pathDescription}>
                                    For industry stakeholders and regulators
                                </Text>
                            </View>
                        </View>
                        <View style={styles.pathFeatures}>
                            <View style={styles.feature}>
                                <Package size={16} color={Colors.primary} />
                                <Text style={styles.featureText}>Blockchain transactions</Text>
                            </View>
                            <View style={styles.feature}>
                                <Shield size={16} color={Colors.primary} />
                                <Text style={styles.featureText}>MetaMask wallet required</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Footer */}
                <Animated.View
                    entering={FadeInUp.delay(1000)}
                    style={styles.footer}
                >
                    <View style={styles.footerTextContainer}>
                        <Text style={styles.footerText}>
                            Protecting lives through blockchain technology
                        </Text>
                    </View>
                    <View style={styles.footerSubtextContainer}>
                        <Text style={styles.footerSubtext}>
                            Secure • Transparent • Decentralized
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.layout.container,
        minHeight: '100%',
    },
    header: {
        alignItems: 'center',
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.lg,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        ...Shadows.subtle,
    },
    title: {
        ...Typography.h1,
        color: Colors.text,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    pathContainer: {
        marginVertical: Spacing.md,
    },
    pathCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: Spacing.lg,
        ...Shadows.card,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    cardTitleContainer: {
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    consumerCard: {
        borderWidth: 2,
        borderColor: Colors.accent + '20',
    },
    stakeholderCard: {
        borderWidth: 2,
        borderColor: Colors.primary + '20',
    },
    pathIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pathTitle: {
        ...Typography.h4,
        color: Colors.text,
        marginBottom: Spacing.xs,
        textAlign: 'center',
        lineHeight: 24,
    },
    pathDescription: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: Spacing.xs,
    },
    pathFeatures: {
        alignSelf: 'stretch',
        gap: Spacing.sm,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    featureText: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    dividerText: {
        ...Typography.label,
        color: Colors.textSecondary,
        marginHorizontal: Spacing.lg,
        backgroundColor: Colors.backgroundSecondary,
        paddingHorizontal: Spacing.sm,
    },
    footer: {
        alignItems: 'center',
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.xl,
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.xl,
        minHeight: 80,
    },
    footerTextContainer: {
        marginBottom: Spacing.lg,
        paddingHorizontal: Spacing.md,
    },
    footerText: {
        ...Typography.bodyMedium,
        color: Colors.primary,
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 22,
    },
    footerSubtextContainer: {
        paddingHorizontal: Spacing.md,
    },
    footerSubtext: {
        ...Typography.caption,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
    },
});