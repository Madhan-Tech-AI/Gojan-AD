import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const { user, isLoading } = useAuth();

  const handleRoleSelection = async (role: 'admin' | 'student') => {
    try {
      console.log('Welcome screen - Role selected:', role);
      // Store the selected role temporarily
      await AsyncStorage.setItem('selectedRole', role);
      console.log('Welcome screen - Role stored in AsyncStorage');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error storing role:', error);
    }
  };

  const styles = createStyles(colors);

  useEffect(() => {
    if (isLoading) return;
    if (user?.role === 'admin') {
      router.replace('/admin/dashboard');
    } else if (user?.role === 'student') {
      router.replace('/(tabs)');
    }
  }, [user, isLoading]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/favicon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.collegeName}>Gojan School of Business and Technology</Text>
      </View>

      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>
          "Education is the most powerful weapon which you can use to change the world."
        </Text>
        <Text style={styles.quoteAuthor}>- Nelson Mandela</Text>
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.roleTitle}>Select Your Role</Text>
        
        <TouchableOpacity 
          style={[styles.roleButton, styles.adminButton]} 
          onPress={() => handleRoleSelection('admin')}
        >
          <Text style={styles.adminButtonText}>Admin</Text>
          <Text style={styles.roleDescription}>College administration and management</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleButton, styles.studentButton]} 
          onPress={() => handleRoleSelection('student')}
        >
          <Text style={styles.studentButtonText}>Student</Text>
          <Text style={styles.roleDescription}>Student services and applications</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  collegeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  quoteContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  quote: {
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  roleContainer: {
    marginBottom: 40,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
  },
  roleButton: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  adminButton: {
    backgroundColor: colors.primary,
  },
  studentButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  adminButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  studentButtonText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});