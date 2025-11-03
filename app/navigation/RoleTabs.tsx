import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Colors } from '../../constants/colors';
import { useAuth } from '../context/AuthContext';
import ActionsScreen from '../screens/ActionScreen';
import BatchesScreen from '../screens/BatchesScreen';
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
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
        },
    };

    // Pharmacist tabs
    if (role === 'pharmacist') {
        return (
            <Tab.Navigator screenOptions={tabScreenOptions}>
                <Tab.Screen
                    name="HomeTab"
                    component={PharmacistHome}
                    options={{
                        tabBarLabel: 'Pharmacy',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="local-pharmacy" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Batches"
                    component={BatchesScreen}
                    options={{
                        tabBarLabel: 'Inventory',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="inventory" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{
                        tabBarLabel: 'History',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="history" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />
                    }}
                />
            </Tab.Navigator>
        );
    }

    // Manufacturer tabs
    if (role === 'manufacturer') {
        return (
            <Tab.Navigator screenOptions={tabScreenOptions}>
                <Tab.Screen
                    name="HomeTab"
                    component={ManufacturerHome}
                    options={{
                        tabBarLabel: 'Production',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="factory" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Batches"
                    component={BatchesScreen}
                    options={{
                        tabBarLabel: 'Batches',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="inventory" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Reports"
                    component={ReportsScreen}
                    options={{
                        tabBarLabel: 'Reports',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="report" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />
                    }}
                />
            </Tab.Navigator>
        );
    }

    // Distributor tabs
    if (role === 'distributor') {
        return (
            <Tab.Navigator screenOptions={tabScreenOptions}>
                <Tab.Screen
                    name="HomeTab"
                    component={DistributorHome}
                    options={{
                        tabBarLabel: 'Shipments',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="local-shipping" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Actions"
                    component={ActionsScreen}
                    options={{
                        tabBarLabel: 'Actions',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="qr-code-scanner" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{
                        tabBarLabel: 'History',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="history" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />
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
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="analytics" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Batches"
                    component={BatchesScreen}
                    options={{
                        tabBarLabel: 'Batches',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="inventory" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Reports"
                    component={ReportsScreen}
                    options={{
                        tabBarLabel: 'Reports',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="report" color={color} size={size} />
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />
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
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Actions"
                component={ActionsScreen}
                options={{
                    tabBarLabel: 'Actions',
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="qr-code-scanner" color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarLabel: 'History',
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="history" color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
}