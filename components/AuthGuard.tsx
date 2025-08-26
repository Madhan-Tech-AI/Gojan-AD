import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'admin' | 'student';
}

export default function AuthGuard({ children, requireAuth = true, requireRole }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (!isLoading && user && requireRole && user.role !== requireRole) {
      // Redirect to appropriate dashboard based on user role
      if (user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [user, isLoading, requireRole]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  if (requireAuth && !user) {
    return <Redirect href="/" />;
  }

  if (requireRole && user && user.role !== requireRole) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
});