import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MediTrackLoader from './components/MediTrackLoader';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppThemeProvider } from './lib/theme';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <MediTrackLoader />;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="scan" />
        <Stack.Screen name="verify-result" />
        <Stack.Screen name="register-batch" />
        <Stack.Screen name="shipment-details" />
        <Stack.Screen name="append-transport" />
        <Stack.Screen name="incidents" />
        <Stack.Screen name="batch-audit" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <PaperProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </PaperProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
