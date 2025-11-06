import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import ScanScreen from '../screens/ScanScreen';
import VerifyResultScreen from '../screens/VerifyResultScreen';
import AppendTransportScreen from '../screens/distributor/AppendTransportScreen';
import ShipmentDetailsScreen from '../screens/distributor/ShipmentDetailsScreen';
import BatchAuditScreen from '../screens/regulator/BatchAuditScreen';
import IncidentsScreen from '../screens/regulator/IncidentsScreen';
import RoleTabs from './RoleTabs';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { userProfile, loading } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* On first install show onboarding */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
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