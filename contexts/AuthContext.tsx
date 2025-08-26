import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Simple validation - in a real app, this would be server-side
    const storedUsers = await AsyncStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const userWithoutPassword = { ...foundUser };
    delete userWithoutPassword.password;
    
    setUser(userWithoutPassword);
    await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const signup = async (name: string, email: string, password: string) => {
    const storedUsers = await AsyncStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, this should be hashed
    };

    users.push(newUser);
    await AsyncStorage.setItem('users', JSON.stringify(users));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    
    setUser(userWithoutPassword);
    await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

    // Update in users list too
    const storedUsers = await AsyncStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data };
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isLoading,
      }}
    >
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