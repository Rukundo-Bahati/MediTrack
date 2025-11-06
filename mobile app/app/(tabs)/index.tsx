import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RoleTabs from '../navigation/RoleTabs';
import OnboardingScreen from '../screens/OnboardingScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

export default function HomeScreen() {
  const { userProfile, loading, isAuthenticated, hasSeenOnboarding } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!hasSeenOnboarding) {
        // Show onboarding slides first
        return;
      }
      
      if (!userProfile) {
        // No user profile, show welcome screen
        return;
      }
      
      if (!userProfile.isOnboardingComplete) {
        // User has started onboarding but not completed
        if (userProfile.role === 'consumer') {
          router.replace('/verify-medicine' as any);
        } else {
          router.replace('/onboarding/wallet-setup' as any);
        }
      }
    }
  }, [loading, userProfile, hasSeenOnboarding, router]);

  if (loading) {
    return null; // Loading handled by MediTrackLoader in _layout
  }

  // Show onboarding slides first if user hasn't seen them
  if (!hasSeenOnboarding) {
    return <OnboardingScreen />;
  }

  if (!userProfile || !isAuthenticated) {
    return <WelcomeScreen />;
  }

  return <RoleTabs />;
}