import React, { createContext, useContext, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated admin credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

// Base URL for API calls
const API_BASE_URL = __DEV__ 
  ? 'http://10.97.38.49:3000/api'  // Development
  : 'https://api.pesao.com/api';   // Production

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      // Check if backend is accessible
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      const healthData = await healthResponse.json();
      console.log('Backend connection status:', healthData.message);

      // Use hardcoded credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setUser({
          id: '1',
          name: 'Admin',
          email: ADMIN_EMAIL,
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error('Could not connect to backend or invalid credentials');
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    // For now, just simulate registration
    setUser({
      id: Date.now().toString(),
      name,
      email,
    });
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}