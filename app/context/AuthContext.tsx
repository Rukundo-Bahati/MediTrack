import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'consumer' | 'pharmacist' | 'distributor' | 'manufacturer' | 'regulator' | 'guest';

type User = {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  token?: string; // mock JWT
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (role: UserRole, opts?: { name?: string; email?: string }) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
  setRole: () => {},
  completeOnboarding: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // hydrate from storage
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('medi_user');
        if (raw) setUser(JSON.parse(raw));
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (role: UserRole, opts?: { name?: string; email?: string }) => {
    setLoading(true);
    // mock JWT and user id
    const newUser: User = {
      id: `${role}_1`,
      name: opts?.name || `${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: opts?.email,
      role,
      token: 'mock-jwt-token',
    };
    await AsyncStorage.setItem('medi_user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await AsyncStorage.removeItem('medi_user');
    setUser(null);
    setLoading(false);
  };

  const setRole = (role: UserRole) => {
    if (!user) return;
    const u = { ...user, role };
    setUser(u);
    AsyncStorage.setItem('medi_user', JSON.stringify(u));
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboarding_completed', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setRole, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}