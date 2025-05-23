import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  weight?: number;
  height?: number;
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, weight?: number, height?: number) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base URL for API calls
const API_BASE_URL = __DEV__ 
  ? 'http://10.96.23.68:3000/api'  // Development
  : 'https://api.pesao.com/api';   // Production

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user data on mount
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        weight: data.user.weight,
        height: data.user.height,
      };

      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', data.token);
    } catch (error: any) {
      console.error('Sign in error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string, weight?: number, height?: number) => {
    try {
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          weight,
          height
        }),
      });

      const data = await response.json();
      console.log('Register response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        weight: data.weight,
        height: data.height,
      };

      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', data.token);
    } catch (error: any) {
      console.error('Sign up error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear all auth data
      await AsyncStorage.multiRemove(['user', 'token']);
      // Clear the user state
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
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