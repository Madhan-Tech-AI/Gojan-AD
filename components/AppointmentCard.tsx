import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock, Phone, Mail } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface AppointmentCardProps {
  appointment: {
    id: string;
    department: string;
    preferredDate: string;
    status: string;
    name: string;
    email: string;
    phone: string;
    remarks?: string;
  };
  onReschedule: () => void;
  onCancel: () => void;
  onReminder: () => void;
}

export default function AppointmentCard({
  appointment,
  onReschedule,
  onCancel,
  onReminder,
}: AppointmentCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const isPastDate = new Date(appointment.preferredDate) < new Date();
  const isCancelled = appointment.status === 'Cancelled';

  return (
    <View style={[styles.card, isCancelled && styles.cancelledCard]}>
      <View style={styles.header}>
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

      <View style={styles.content}>
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

        {isPastDate && appointment.status === 'Pending' && (
          <TouchableOpacity style={styles.reminderButton} onPress={onReminder}>
            <Mail size={16} color="#FFFFFF" />
            <Text style={styles.reminderButtonText}>Send Reminder</Text>
          </TouchableOpacity>
        )}

        {!isCancelled && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={onReschedule}>
              <Clock size={16} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                Reschedule
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={onCancel}>
              <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cancelledCard: {
    opacity: 0.7,
  },
  header: {
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
  content: {
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
  reminderButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  reminderButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
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