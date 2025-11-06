import { useRouter } from 'expo-router';
import { AlertTriangle, Bell, CheckCircle, Info, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { ModernCard } from '../../components/ui/modern-card';
import { ScreenLayout } from '../../components/ui/modern-layout';
import { ModernNavbar } from '../../components/ui/modern-navbar';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface Alert {
    id: string;
    type: 'warning' | 'info' | 'success' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

const MOCK_ALERTS: Alert[] = [
    {
        id: 'alert_001',
        type: 'warning',
        title: 'Suspicious Batch Detected',
        message: 'Batch B-2025-001 has been flagged for potential counterfeiting. Please verify before dispensing.',
        timestamp: '2025-01-15T10:30:00Z',
        read: false
    },
    {
        id: 'alert_002',
        type: 'info',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST.',
        timestamp: '2025-01-14T16:20:00Z',
        read: false
    },
    {
        id: 'alert_003',
        type: 'success',
        title: 'Batch Verification Complete',
        message: 'Batch B-2025-002 has been successfully verified and is safe for distribution.',
        timestamp: '2025-01-14T14:15:00Z',
        read: true
    },
    {
        id: 'alert_004',
        type: 'error',
        title: 'Counterfeit Alert',
        message: 'Multiple reports of counterfeit medicines in your area. Exercise extra caution.',
        timestamp: '2025-01-13T09:45:00Z',
        read: true
    }
];

export default function AlertsScreen() {
    const router = useRouter();
    const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

    const markAsRead = (alertId: string) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId ? { ...alert, read: true } : alert
        ));
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'warning': return AlertTriangle;
            case 'info': return Info;
            case 'success': return CheckCircle;
            case 'error': return XCircle;
            default: return Bell;
        }
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'warning': return Colors.warning;
            case 'info': return Colors.info;
            case 'success': return Colors.success;
            case 'error': return Colors.danger;
            default: return Colors.textSecondary;
        }
    };

    const unreadCount = alerts.filter(alert => !alert.read).length;

    return (
        <View style={styles.container}>
            <ModernNavbar
                title="Alerts"
                showBackButton={true}
                onBackPress={() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/(tabs)');
                    }
                }}
            />
            <ScreenLayout scrollable style={styles.scrollContainer}>
                {/* Stats */}
                <Animated.View
                    entering={FadeInDown.delay(100)}
                    style={styles.statsContainer}
                >
                    <ModernCard variant="filled" style={styles.statCard}>
                        <Bell size={24} color={Colors.primary} />
                        <Text style={styles.statNumber}>{alerts.length}</Text>
                        <Text style={styles.statLabel}>Total Alerts</Text>
                    </ModernCard>
                    <ModernCard variant="filled" style={styles.statCard}>
                        <AlertTriangle size={24} color={Colors.warning} />
                        <Text style={[styles.statNumber, { color: Colors.warning }]}>{unreadCount}</Text>
                        <Text style={styles.statLabel}>Unread</Text>
                    </ModernCard>
                </Animated.View>

                {/* Alerts List */}
                <View style={styles.listContainer}>
                    {alerts.length === 0 ? (
                        <Animated.View entering={FadeInDown.delay(200)} style={styles.emptyContainer}>
                            <Bell size={64} color={Colors.textSecondary} />
                            <Text style={styles.emptyTitle}>No Alerts</Text>
                            <Text style={styles.emptySubtitle}>
                                You're all caught up! No new alerts at this time.
                            </Text>
                        </Animated.View>
                    ) : (
                        <View style={styles.alertsList}>
                            {alerts.map((alert, index) => {
                                const IconComponent = getAlertIcon(alert.type);
                                const alertColor = getAlertColor(alert.type);

                                return (
                                    <Animated.View
                                        key={alert.id}
                                        entering={SlideInRight.delay(200 + index * 100)}
                                    >
                                        <TouchableOpacity
                                            onPress={() => markAsRead(alert.id)}
                                            activeOpacity={0.7}
                                        >
                                            <ModernCard
                                                variant="elevated"
                                                style={[
                                                    styles.alertCard,
                                                    !alert.read && styles.unreadCard
                                                ] as any}
                                            >
                                                <View style={styles.alertHeader}>
                                                    <View style={[
                                                        styles.alertIcon,
                                                        { backgroundColor: alertColor + '20' }
                                                    ]}>
                                                        <IconComponent size={20} color={alertColor} />
                                                    </View>
                                                    <View style={styles.alertInfo}>
                                                        <Text style={[
                                                            styles.alertTitle,
                                                            !alert.read && styles.unreadTitle
                                                        ]}>
                                                            {alert.title}
                                                        </Text>
                                                        <Text style={styles.alertMessage}>
                                                            {alert.message}
                                                        </Text>
                                                        <Text style={styles.alertTime}>
                                                            {new Date(alert.timestamp).toLocaleString()}
                                                        </Text>
                                                    </View>
                                                    {!alert.read && (
                                                        <View style={styles.unreadDot} />
                                                    )}
                                                </View>
                                            </ModernCard>
                                        </TouchableOpacity>
                                    </Animated.View>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScreenLayout>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundSecondary,
    },
    scrollContainer: {
        flex: 1,
    },

    // Stats Styles
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.layout.container,
        marginBottom: Spacing.lg,
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

    // List Styles
    listContainer: {
        paddingHorizontal: Spacing.layout.container,
        paddingBottom: Spacing.xl,
    },
    alertsList: {
        gap: Spacing.md,
    },

    // Alert Card Styles
    alertCard: {
        marginBottom: 0,
    },
    unreadCard: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    alertIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    alertInfo: {
        flex: 1,
    },
    alertTitle: {
        ...Typography.bodyMedium,
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    unreadTitle: {
        fontWeight: '600',
    },
    alertMessage: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        lineHeight: 18,
        marginBottom: Spacing.xs,
    },
    alertTime: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginLeft: Spacing.sm,
        marginTop: 4,
    },

    // Empty State Styles
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: Spacing.xxxl,
        paddingHorizontal: Spacing.lg,
    },
    emptyTitle: {
        ...Typography.h3,
        color: Colors.text,
        textAlign: 'center',
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    emptySubtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
});