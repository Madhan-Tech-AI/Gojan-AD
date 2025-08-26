import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { User, CreditCard as Edit3, Calendar, BookOpen, Moon, Sun } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const { colors } = useTheme();
  const { user, updateProfile, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      const [appointmentData, admissionData] = await Promise.all([
        AsyncStorage.getItem('appointments'),
        AsyncStorage.getItem('admissions'),
      ]);
      setAppointments(appointmentData ? JSON.parse(appointmentData) : []);
      setAdmissions(admissionData ? JSON.parse(admissionData) : []);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={40} color={colors.primary} />
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Edit3 size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              style={styles.input}
              value={editData.name}
              onChangeText={(text) => setEditData({ ...editData, name: text })}
              placeholder="Full Name"
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={styles.input}
              value={editData.email}
              onChangeText={(text) => setEditData({ ...editData, email: text })}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={editData.phone}
              onChangeText={(text) => setEditData({ ...editData, phone: text })}
              placeholder="Phone"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Calendar size={24} color={colors.primary} />
              <Text style={styles.statNumber}>{appointments.length}</Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </View>
            <View style={styles.statItem}>
              <BookOpen size={24} color={colors.primary} />
              <Text style={styles.statNumber}>{admissions.length}</Text>
              <Text style={styles.statLabel}>Applications</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.surface,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editForm: {
    width: '100%',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    padding: 20,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});