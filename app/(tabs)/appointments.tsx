import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar, Clock, MapPin, User, Phone, Mail } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function AppointmentsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { appointments, updateAppointmentStatus, refreshData } = useData();
  const [userAppointments, setUserAppointments] = useState<any[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (user && appointments) {
      const filtered = appointments.filter(apt => apt.userId === user.id);
      setUserAppointments(filtered);
    }
  }, [user, appointments]);

  const handleCancel = async (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateAppointmentStatus(appointmentId, 'cancelled');
              Alert.alert('Success', 'Appointment cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <Text style={styles.subtitle}>Track your counselling appointments</Text>
      </View>

      {userAppointments.length === 0 ? (
        <View style={styles.emptyState}>
          <Calendar size={64} color={colors.textSecondary} />
          <Text style={styles.emptyStateTitle}>No Appointments</Text>
          <Text style={styles.emptyStateText}>
            You haven't booked any appointments yet. Book your first appointment from the home screen.
          </Text>
        </View>
      ) : (
        <View style={styles.appointmentsList}>
          {userAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.cardHeader}>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(appointment.status) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(appointment.status) },
                    ]}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Text>
                </View>
                {appointment.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancel(appointment.id)}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.error }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.appointmentInfo}>
                <View style={styles.infoRow}>
                  <User size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{appointment.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Mail size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{appointment.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Phone size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{appointment.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{appointment.department}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Calendar size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    Preferred: {formatDate(appointment.preferredDate)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    Booked: {formatDate(appointment.timestamp)}
                  </Text>
                </View>
                {appointment.remarks && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoText}>
                      <Text style={styles.label}>Remarks: </Text>
                      {appointment.remarks}
                    </Text>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentInfo: {
    gap: 8,
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

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
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
  errorBackground: {
    backgroundColor: colors.error + '20',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textSecondary + '10',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.error + '10',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  label: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  appointmentInfo: {
    gap: 8,
  },
});