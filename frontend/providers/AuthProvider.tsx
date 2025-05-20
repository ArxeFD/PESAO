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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    // This is where you'd typically make an API call to authenticate
    await fetch('http://192.168.1.76:3000/api/health')
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch(error => console.log(error));
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser({
        id: '1',
        name: 'Admin',
        email: ADMIN_EMAIL,
      });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    // This is where you'd typically make an API call to register
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