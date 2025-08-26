import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar, Clock, Phone } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await AsyncStorage.getItem('appointments');
      setAppointments(data ? JSON.parse(data) : []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = appointments.map((apt: any) =>
                apt.id === appointmentId ? { ...apt, status: 'Cancelled' } : apt
              );
              await AsyncStorage.setItem('appointments', JSON.stringify(updated));
              setAppointments(updated);
              Alert.alert('Success', 'Appointment cancelled successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment.');
            }
          }
        }
      ]
    );
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <Text style={styles.subtitle}>Manage your counselling sessions</Text>
      </View>

      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Calendar size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No appointments yet</Text>
          <Text style={styles.emptySubtitle}>
            Book your first counselling appointment from the home screen
          </Text>
        </View>
      ) : (
        <View style={styles.appointmentsList}>
          {appointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.department}>{appointment.department}</Text>
                <View style={[
                  styles.statusBadge,
                  appointment.status === 'Confirmed' && styles.statusConfirmed,
                  appointment.status === 'Pending' && styles.statusPending,
                  appointment.status === 'Cancelled' && styles.statusCancelled,
                ]}>
                  <Text style={styles.statusText}>{appointment.status}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <Calendar size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    {new Date(appointment.preferredDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Phone size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{appointment.phone}</Text>
                </View>

                {appointment.remarks && (
                  <View style={styles.remarksContainer}>
                    <Text style={styles.remarksLabel}>Remarks:</Text>
                    <Text style={styles.remarksText}>{appointment.remarks}</Text>
                  </View>
                )}

                {appointment.status !== 'Cancelled' && (
                  <View style={styles.actions}>
                    <TouchableOpacity 
                      style={styles.actionButton} 
                      onPress={() => Alert.alert('Feature Coming Soon', 'Reschedule functionality will be available soon.')}
                    >
                      <Clock size={16} color={colors.primary} />
                      <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                        Reschedule
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionButton} 
                      onPress={() => handleCancel(appointment.id)}
                    >
                      <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  appointmentsList: {
    padding: 20,
    paddingTop: 0,
  },
  appointmentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  department: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.textSecondary + '20',
  },
  statusConfirmed: {
    backgroundColor: colors.accent + '20',
  },
  statusPending: {
    backgroundColor: colors.secondary + '20',
  },
  statusCancelled: {
    backgroundColor: '#EF4444' + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  remarksContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  remarksLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  remarksText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});