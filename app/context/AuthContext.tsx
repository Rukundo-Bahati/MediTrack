import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from './WalletContext';

export type UserRole = 'consumer' | 'manufacturer' | 'distributor' | 'pharmacist' | 'regulator';

type UserProfile = {
  role: UserRole;
  walletAddress?: string;
  isOnboardingComplete: boolean;
  preferences: {
    preferredNetwork?: string;
    notifications?: boolean;
    language?: string;
  };
};

type AuthContextValue = {
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  setUserRole: (role: UserRole) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  completeInitialOnboarding: () => Promise<void>;
  logout: () => Promise<void>;
  requiresWallet: (role: UserRole) => boolean;
};

const AuthContext = createContext<AuthContextValue>({
  userProfile: null,
  loading: false,
  isAuthenticated: false,
  hasSeenOnboarding: false,
  setUserRole: async () => {},
  completeOnboarding: async () => {},
  completeInitialOnboarding: async () => {},
  logout: async () => {},
  requiresWallet: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { walletState } = useWallet();

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    // Update wallet address when wallet connects/disconnects
    if (userProfile && walletState.address !== userProfile.walletAddress) {
      updateUserProfile({
        ...userProfile,
        walletAddress: walletState.address || undefined,
      });
    }
  }, [walletState.address]);

  const loadUserProfile = async () => {
    try {
      const [storedProfile, storedOnboarding] = await Promise.all([
        AsyncStorage.getItem('user_profile'),
        AsyncStorage.getItem('has_seen_onboarding')
      ]);
      
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setUserProfile(profile);
      }
      
      if (storedOnboarding) {
        setHasSeenOnboarding(JSON.parse(storedOnboarding));
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  };

  const setUserRole = async (role: UserRole) => {
    const newProfile: UserProfile = {
      role,
      walletAddress: walletState.address || undefined,
      isOnboardingComplete: false,
      preferences: {
        preferredNetwork: 'mumbai',
        notifications: true,
        language: 'en',
      },
    };
    
    await updateUserProfile(newProfile);
  };

  const completeOnboarding = async () => {
    if (userProfile) {
      await updateUserProfile({
        ...userProfile,
        isOnboardingComplete: true,
      });
    }
  };

  const completeInitialOnboarding = async () => {
    try {
      await AsyncStorage.setItem('has_seen_onboarding', JSON.stringify(true));
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Failed to save onboarding completion:', error);
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('user_profile'),
        AsyncStorage.removeItem('has_seen_onboarding')
      ]);
      setUserProfile(null);
      setHasSeenOnboarding(false);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const requiresWallet = (role: UserRole): boolean => {
    return role !== 'consumer';
  };

  const isAuthenticated = (() => {
    if (!userProfile) return false;
    
    // Consumer role doesn't require wallet
    if (userProfile.role === 'consumer') {
      return userProfile.isOnboardingComplete;
    }
    
    // Other roles require wallet connection
    return userProfile.isOnboardingComplete && walletState.isConnected;
  })();

  return (
    <AuthContext.Provider value={{
      userProfile,
      loading,
      isAuthenticated,
      hasSeenOnboarding,
      setUserRole,
      completeOnboarding,
      completeInitialOnboarding,
      logout,
      requiresWallet,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}