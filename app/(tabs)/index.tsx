import React from 'react';
import { useAuth } from '../context/AuthContext';
import RoleTabs from '../navigation/RoleTabs';
import OnboardingScreen from '../screens/OnboardingScreen';

export default function HomeScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return <OnboardingScreen />;
  }

  return <RoleTabs />;
}