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
  ? 'http://192.168.1.77:3000/api'  // Development
  : 'https://api.pesao.com/api';   // Production

console.log('🔧 AuthProvider loaded, API_BASE_URL:', API_BASE_URL);

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
      console.log('🚀 === AGGRESSIVE DEBUG START ===');
      console.log('📱 Device Network Info:');
      console.log('   - API_BASE_URL:', API_BASE_URL);
      console.log('   - Target Endpoint:', `${API_BASE_URL}/auth/login`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      console.log('⚡ Initiating fetch request...');
      const startTime = Date.now();

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const endTime = Date.now();
      console.log(`✅ Fetch completed in ${endTime - startTime}ms`);
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Headers:', JSON.stringify(response.headers, null, 2));

      const text = await response.text();
      console.log('📄 Raw Response Body:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('❌ Failed to parse JSON response');
        throw new Error('Invalid JSON response from server');
      }

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
      console.log('🎉 Login successful!');
    } catch (error: any) {
      console.error('💥 FATAL ERROR IN SIGNIN:');
      if (error.name === 'AbortError') {
        console.error('⏰ Request timed out after 10s');
      } else {
        console.error('🔴 Error Name:', error.name);
        console.error('🔴 Error Message:', error.message);
        console.error('🔴 Stack:', error.stack);
      }
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string, weight?: number, height?: number) => {
    try {
      console.log('📝 === SIGN UP DEBUG START ===');
      console.log('📍 API_BASE_URL:', API_BASE_URL);
      console.log('🌐 Full URL:', `${API_BASE_URL}/auth/register`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      console.log('⚡ Initiating fetch request...');
      const startTime = Date.now();

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          weight,
          height
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const endTime = Date.now();
      console.log(`✅ Fetch completed in ${endTime - startTime}ms`);
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Headers:', JSON.stringify(response.headers, null, 2));

      const text = await response.text();
      console.log('📄 Raw Response Body:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('❌ Failed to parse JSON response');
        throw new Error('Invalid JSON response from server');
      }

      console.log('Register response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
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
      console.log('🎉 === SIGN UP SUCCESS ===');
    } catch (error: any) {
      console.error('❌ === SIGN UP ERROR ===');
      if (error.name === 'AbortError') {
        console.error('⏰ Request timed out after 10s');
      } else {
        console.error('🔴 Error type:', error.name);
        console.error('💬 Error message:', error.message);
        console.error('📄 Full error:', error);
      }
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