import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [selectedRole, setSelectedRole] = useState<'admin' | 'student' | null>(null);
  
  const { login } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    loadSelectedRole();
  }, []);

  const loadSelectedRole = async () => {
    try {
      const role = await AsyncStorage.getItem('selectedRole');
      console.log('Login - Loaded role from storage:', role);
      if (role === 'admin' || role === 'student') {
        setSelectedRole(role);
        console.log('Login - Role set to:', role);
      } else {
        console.log('Login - No valid role found, redirecting to welcome screen');
        router.replace('/');
      }
    } catch (error) {
      console.error('Error loading role:', error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setErrors({});

    // Validation
    const newErrors: {email?: string; password?: string} = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      
      // Route based on selected role
      if (selectedRole === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/(tabs)');
      }
      
      // Clear the selected role from storage
      await AsyncStorage.removeItem('selectedRole');
    } catch (error) {
      Alert.alert('Login Error', 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to Gojan School of Business and Technology {selectedRole && `as ${selectedRole}`}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {selectedRole === 'admin' ? 'Admin Mail' : 'Email'}
          </Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            placeholder={
              selectedRole === 'admin' 
                ? "Enter admin email address" 
                : "Enter your email"
            }
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoComplete="password"
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Signing in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Don't have an account? </Text>
          <Link href="/auth/signup" asChild>
            <TouchableOpacity>
              <Text style={[styles.linkText, styles.linkHighlight]}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  linkHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
});