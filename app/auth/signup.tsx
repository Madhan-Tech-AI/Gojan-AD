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

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionCode, setInstitutionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    institutionName?: string;
    institutionCode?: string;
  }>({});
  const [selectedRole, setSelectedRole] = useState<'admin' | 'student' | null>(null);
  
  const { signup } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    loadSelectedRole();
  }, []);

  const loadSelectedRole = async () => {
    try {
      const role = await AsyncStorage.getItem('selectedRole');
      console.log('Loaded role from storage:', role);
      if (role === 'admin' || role === 'student') {
        setSelectedRole(role);
        console.log('Role set to:', role);
      } else {
        console.log('No valid role found, redirecting to welcome screen');
        router.replace('/');
      }
    } catch (error) {
      console.error('Error loading role:', error);
    }
  };

  const handleSignup = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role first');
      return;
    }

    setLoading(true);
    setErrors({});

    // Validation
    const newErrors: any = {};
    
    if (selectedRole === 'admin') {
      if (institutionName.trim().length < 2) {
        newErrors.institutionName = 'Institution name must be at least 2 characters';
      }
      if (institutionCode.trim().length < 2) {
        newErrors.institutionCode = 'Institution code must be at least 2 characters';
      }
      if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid admin email address';
      }
    } else {
      if (name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
      if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // For admin, use institution name as the name field
      const displayName = selectedRole === 'admin' ? institutionName : name;
      await signup(
        displayName, 
        email, 
        password, 
        selectedRole,
        selectedRole === 'admin' ? institutionName : undefined,
        selectedRole === 'admin' ? institutionCode : undefined
      );
      Alert.alert('Success', 'Account created successfully!', [
        { 
          text: 'OK', 
          onPress: async () => {
            // Route based on selected role
            if (selectedRole === 'admin') {
              router.replace('/admin/dashboard');
            } else {
              router.replace('/(tabs)');
            }
            // Clear the selected role from storage
            await AsyncStorage.removeItem('selectedRole');
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Signup Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join Gojan School of Business and Technology today {selectedRole && `as ${selectedRole}`}
        </Text>
      </View>

      <View style={styles.form}>
        {selectedRole === 'admin' ? (
          // Admin signup fields
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Institution Name</Text>
              <TextInput
                style={[styles.input, errors.institutionName && styles.inputError]}
                value={institutionName}
                onChangeText={setInstitutionName}
                placeholder="Enter institution name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoComplete="organization"
              />
              {errors.institutionName && <Text style={styles.errorText}>{errors.institutionName}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Institution Code</Text>
              <TextInput
                style={[styles.input, errors.institutionCode && styles.inputError]}
                value={institutionCode}
                onChangeText={setInstitutionCode}
                placeholder="Enter institution code"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="characters"
                autoComplete="off"
              />
              {errors.institutionCode && <Text style={styles.errorText}>{errors.institutionCode}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Admin Mail ID</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter admin email address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
          </>
        ) : (
          // Student signup fields
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoComplete="name"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoComplete="new-password"
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoComplete="new-password"
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>

        <TouchableOpacity 
          style={[styles.signupButton, loading && styles.buttonDisabled]} 
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.signupButtonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? </Text>
          <Link href="/auth/login" asChild>
            <TouchableOpacity>
              <Text style={[styles.linkText, styles.linkHighlight]}>Login</Text>
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
  signupButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
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