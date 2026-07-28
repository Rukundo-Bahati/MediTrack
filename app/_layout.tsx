import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MediTrackLoader from './components/MediTrackLoader';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { AppThemeProvider } from './lib/theme';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <MediTrackLoader />;
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <PaperProvider>
          <WalletProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </WalletProvider>
        </PaperProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

export const unstable_settings = {
  initialRouteName: 'index',
};
