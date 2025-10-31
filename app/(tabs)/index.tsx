import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { AppThemeProvider } from './src/lib/theme';
import { AuthProvider } from './src/context/AuthContext';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <PaperProvider>
          <AuthProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" />
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </PaperProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}