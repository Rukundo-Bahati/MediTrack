import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RoleTabs from './RoleTabs';
import ScanScreen from '../screens/ScanScreen';
import VerifyResultScreen from '../screens/VerifyResultScreen';
import ShipmentDetailsScreen from '../screens/distributor/ShipmentDetailsScreen';
import AppendTransportScreen from '../screens/distributor/AppendTransportScreen';
import IncidentsScreen from '../screens/regulator/IncidentsScreen';
import BatchAuditScreen from '../screens/regulator/BatchAuditScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* On first install show onboarding */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={RoleTabs} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="VerifyResult" component={VerifyResultScreen} />
      {/* Distributor screens */}
      <Stack.Screen name="ShipmentDetails" component={ShipmentDetailsScreen} />
      <Stack.Screen name="AppendTransport" component={AppendTransportScreen} />
      {/* Regulator screens */}
      <Stack.Screen name="Incidents" component={IncidentsScreen} />
      <Stack.Screen name="BatchAudit" component={BatchAuditScreen} />
    </Stack.Navigator>
  );
}