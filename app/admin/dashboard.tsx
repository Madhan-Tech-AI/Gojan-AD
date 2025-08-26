import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { router } from 'expo-router';
import AuthGuard from '@/components/AuthGuard';

export default function AdminDashboard() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { appointments, admissions, updateAppointmentStatus, updateAdmissionStatus, refreshData, deleteAppointment, deleteAdmission } = useData();
  const [activeTab, setActiveTab] = useState<'appointments' | 'admissions'>('appointments');
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'confirmed' | 'cancelled' | 'attended' | 'missed'>('all');
  const [admissionFilter, setAdmissionFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAppointmentAction = async (id: string, action: 'approve' | 'reject' | 'confirm' | 'cancel' | 'attended' | 'missed') => {
    try {
      const status = action as any;
      const assignedDate = action === 'confirm' ? new Date().toISOString() : undefined;
      await updateAppointmentStatus(id, status, assignedDate);
      Alert.alert('Success', `Appointment ${action}ed successfully`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update appointment status');
    }
  };

  const handleAdmissionAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      await updateAdmissionStatus(id, status);
      Alert.alert('Success', `Admission ${action}ed successfully`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update admission status');
    }
  };

  const handleDeleteAppointment = (id: string) => {
    Alert.alert(
      'Delete Appointment',
      'Are you sure you want to permanently delete this appointment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAppointment(id);
              Alert.alert('Deleted', 'Appointment deleted successfully');
            } catch {
              Alert.alert('Error', 'Failed to delete appointment');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAdmission = (id: string) => {
    Alert.alert(
      'Delete Admission',
      'Are you sure you want to permanently delete this admission application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAdmission(id);
              Alert.alert('Deleted', 'Admission application deleted successfully');
            } catch {
              Alert.alert('Error', 'Failed to delete admission');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const styles = createStyles(colors);

  return (
    <AuthGuard requireRole="admin">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, {user?.name}</Text>
          {user?.institutionCode && (
            <Text style={styles.institutionCode}>Code: {user.institutionCode}</Text>
          )}
          <View style={{ marginTop: 12 }}>
            <Text style={{ color: '#FFFFFF', opacity: 0.9 }}>
              Appointments: {appointments.length} | Admissions: {admissions.length}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'appointments' && styles.activeTab]} 
            onPress={() => setActiveTab('appointments')}
          >
            <Text style={[styles.tabText, activeTab === 'appointments' && styles.activeTabText]}>
              Appointments ({appointments.filter(a => a.status === 'pending').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'admissions' && styles.activeTab]} 
            onPress={() => setActiveTab('admissions')}
          >
            <Text style={[styles.tabText, activeTab === 'admissions' && styles.activeTabText]}>
              Admissions ({admissions.filter(a => a.status === 'pending').length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'appointments' ? (
            <View>
              <Text style={styles.sectionTitle}>Appointment Requests</Text>
              <View style={styles.filterRow}>
                {(['all','pending','approved','rejected','confirmed','cancelled','attended','missed'] as const).map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setAppointmentFilter(f)}
                    style={[styles.filterChip, appointmentFilter===f && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                  > 
                    <Text style={{ color: appointmentFilter===f ? '#FFFFFF' : colors.textSecondary, fontWeight: '600', textTransform: 'capitalize' }}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {appointments.length === 0 ? (
                <Text style={styles.noDataText}>No appointments found</Text>
              ) : (
                appointments
                  .filter(a => appointmentFilter === 'all' ? true : a.status === appointmentFilter)
                  .map((appointment) => (
                  <View key={appointment.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.studentName}>{appointment.name}</Text>
                      <View style={[styles.statusBadge, styles[`status${appointment.status}`]]}>
                        <Text style={styles.statusText}>{appointment.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardText}>Email: {appointment.email}</Text>
                    <Text style={styles.cardText}>Phone: {appointment.phone}</Text>
                    <Text style={styles.cardText}>Department: {appointment.department}</Text>
                    <Text style={styles.cardText}>Preferred Date: {formatDate(appointment.preferredDate)}</Text>
                    {appointment.assignedDate && (
                      <Text style={styles.cardText}>Assigned: {formatDate(appointment.assignedDate)}</Text>
                    )}
                    {appointment.remarks && (
                      <Text style={styles.cardText}>Remarks: {appointment.remarks}</Text>
                    )}
                    <Text style={styles.cardText}>Submitted: {formatDate(appointment.timestamp)}</Text>
                    
                    <View style={styles.actionButtons}>
                      {appointment.status === 'pending' && (
                        <>
                          <TouchableOpacity style={[styles.actionButton, styles.confirmButton]} onPress={() => handleAppointmentAction(appointment.id, 'approve')}>
                            <Text style={styles.actionButtonText}>Approve</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => handleAppointmentAction(appointment.id, 'reject')}>
                            <Text style={styles.actionButtonText}>Reject</Text>
                          </TouchableOpacity>
                        </>
                      )}
                      {(appointment.status === 'approved' || appointment.status === 'confirmed') && (
                        <>
                          <TouchableOpacity style={[styles.actionButton, styles.confirmButton]} onPress={() => handleAppointmentAction(appointment.id, 'confirm')}>
                            <Text style={styles.actionButtonText}>{appointment.assignedDate ? 'Reschedule' : 'Assign Slot'}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => handleAppointmentAction(appointment.id, 'attended')}>
                            <Text style={styles.actionButtonText}>Attended</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => handleAppointmentAction(appointment.id, 'missed')}>
                            <Text style={styles.actionButtonText}>Missed</Text>
                          </TouchableOpacity>
                        </>
                      )}
                      <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: colors.error }]}
                        onPress={() => handleDeleteAppointment(appointment.id)}
                      >
                        <Text style={styles.actionButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View>
              <Text style={styles.sectionTitle}>Admission Applications</Text>
              <View style={styles.filterRow}>
                {(['all','pending','approved','rejected'] as const).map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setAdmissionFilter(f)}
                    style={[styles.filterChip, admissionFilter===f && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                  > 
                    <Text style={{ color: admissionFilter===f ? '#FFFFFF' : colors.textSecondary, fontWeight: '600', textTransform: 'capitalize' }}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {admissions.length === 0 ? (
                <Text style={styles.noDataText}>No admission applications found</Text>
              ) : (
                admissions
                  .filter(a => admissionFilter === 'all' ? true : a.status === admissionFilter)
                  .map((admission) => (
                  <View key={admission.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.studentName}>{admission.fullName}</Text>
                      <View style={[styles.statusBadge, styles[`status${admission.status}`]]}>
                        <Text style={styles.statusText}>{admission.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardText}>Email: {admission.email}</Text>
                    <Text style={styles.cardText}>Phone: {admission.phone}</Text>
                    <Text style={styles.cardText}>Course: {admission.courseInterested}</Text>
                    <Text style={styles.cardText}>Address: {admission.address}</Text>
                    {admission.remarks && (
                      <Text style={styles.cardText}>Remarks: {admission.remarks}</Text>
                    )}
                    <Text style={styles.cardText}>Applied: {formatDate(admission.timestamp)}</Text>
                    
                    <View style={styles.actionButtons}>
                      {admission.status === 'pending' && (
                        <>
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.approveButton]}
                            onPress={() => handleAdmissionAction(admission.id, 'approve')}
                          >
                            <Text style={styles.actionButtonText}>Approve</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => handleAdmissionAction(admission.id, 'reject')}
                          >
                            <Text style={styles.actionButtonText}>Reject</Text>
                          </TouchableOpacity>
                        </>
                      )}
                      <TouchableOpacity 
                        style={[styles.actionButton, { backgroundColor: colors.error }]}
                        onPress={() => handleDeleteAdmission(admission.id)}
                      >
                        <Text style={styles.actionButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </AuthGuard>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  card: {
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
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statuspending: {
    backgroundColor: colors.statusPending,
  },
  statusconfirmed: {
    backgroundColor: colors.statusConfirmed,
  },
  statuscancelled: {
    backgroundColor: colors.statusCancelled,
  },
  statusapproved: {
    backgroundColor: colors.statusApproved,
  },
  statusrejected: {
    backgroundColor: colors.statusRejected,
  },
  statusattended: {
    backgroundColor: colors.statusConfirmed,
  },
  statusmissed: {
    backgroundColor: colors.statusCancelled,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#000000',
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  institutionCode: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});
