import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DataProvider } from '@/contexts/DataContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
            <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="booking/appointment" options={{ headerShown: false }} />
            <Stack.Screen name="booking/admission" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}