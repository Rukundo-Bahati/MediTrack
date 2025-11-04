import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Colors } from '../../constants/colors';
import { useAuth } from '../context/AuthContext';
import ActionsScreen from '../screens/ActionScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ConsumerHome from '../screens/consumer/ConsumerHome';
import DistributorHome from '../screens/distributor/DistributorHome';
import ManufacturerHome from '../screens/manufacturer/ManufacturerHome';
import PharmacistHome from '../screens/pharmacist/PharmacistHome';
import RegulatorDashboard from '../screens/regulator/RegulatorDashboard';

const Tab = createBottomTabNavigator();

export default function RoleTabs() {
    const { user } = useAuth();
    const role = user?.role;

    const tabScreenOptions = {
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopColor: Colors.borderLight,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
            elevation: 8,
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        tabBarIconStyle: {
            marginBottom: 2,
        },
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500' as const,
            marginBottom: 4,
        },
    };

    // Pharmacist tabs - Inventory focused
    if (role === 'pharmacist') {
        return (
            <Tab.Navigator screenOptions={tabScreenOptions}>
                <Tab.Screen
                    name="HomeTab"
                    component={PharmacistHome}
                    options={{
                        tabBarLabel: 'Inventory',
                        tabBarIcon: ({ color }) => <MaterialIcons name="inventory" color={color} size={24} />
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color }) => <MaterialIcons name="person" color={color} size={24} />
                    }}
                />
            </Tab.Navigator>
        );
    }

    // Manufacturer tabs - My Batches focused
    if (role === 'manufacturer') {
        return (
            <Tab.Navigator screenOptions={tabScreenOptions}>
                <Tab.Screen
                    name="HomeTab"
                    component={ManufacturerHome}
                    options={{
                        tabBarLabel: 'My Batches',
                        tabBarIcon: ({ color }) => <MaterialIcons name="inventory" color={color} size={24} />
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color }) => <MaterialIcons name="person" color={color} size={24} />
                    }}
                />
            </Tab.Navigator>
        );
    }

    // Distributor tabs - Verify & Transfer focused
    if (role === 'distributor') {
        return (
            <Tab.Navigator screenOptions={tabScreenOptions}>
                <Tab.Screen
                    name="HomeTab"
                    component={DistributorHome}
                    options={{
                        tabBarLabel: 'Verify & Transfer',
                        tabBarIcon: ({ color }) => <MaterialIcons name="verified" color={color} size={24} />
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color }) => <MaterialIcons name="person" color={color} size={24} />
                    }}
                />
            </Tab.Navigator>
        );
    }

    // Admin tabs
    if (role === 'admin') {
        return (
            <Tab.Navigator screenOptions={tabScreenOptions}>
                <Tab.Screen
                    name="HomeTab"
                    component={RegulatorDashboard}
                    options={{
                        tabBarLabel: 'Dashboard',
                        tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" color={color} size={24} />
                    }}
                />
                <Tab.Screen
                    name="Reports"
                    component={ReportsScreen}
                    options={{
                        tabBarLabel: 'Reports',
                        tabBarIcon: ({ color }) => <MaterialIcons name="report" color={color} size={24} />
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color }) => <MaterialIcons name="person" color={color} size={24} />
                    }}
                />
            </Tab.Navigator>
        );
    }

    // Regulator tabs
    if (role === 'regulator') {
        return (
            <Tab.Navigator screenOptions={tabScreenOptions}>
                <Tab.Screen
                    name="HomeTab"
                    component={RegulatorDashboard}
                    options={{
                        tabBarLabel: 'Dashboard',
                        tabBarIcon: ({ color }) => <MaterialIcons name="analytics" color={color} size={24} />
                    }}
                />
                <Tab.Screen
                    name="Reports"
                    component={ReportsScreen}
                    options={{
                        tabBarLabel: 'Reports',
                        tabBarIcon: ({ color }) => <MaterialIcons name="report" color={color} size={24} />
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color }) => <MaterialIcons name="person" color={color} size={24} />
                    }}
                />
            </Tab.Navigator>
        );
    }

    // Default consumer tabs
    return (
        <Tab.Navigator screenOptions={tabScreenOptions}>
            <Tab.Screen
                name="HomeTab"
                component={ConsumerHome}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <MaterialIcons name="home" color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Actions"
                component={ActionsScreen}
                options={{
                    tabBarLabel: 'Actions',
                    tabBarIcon: ({ color }) => <MaterialIcons name="qr-code-scanner" color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarLabel: 'History',
                    tabBarIcon: ({ color }) => <MaterialIcons name="history" color={color} size={24} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <MaterialIcons name="person" color={color} size={24} />
                }}
            />
        </Tab.Navigator>
    );
}