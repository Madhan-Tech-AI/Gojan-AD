import * as Notifications from 'expo-notifications';
import { Linking } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async sendMissedAppointmentReminder(appointment: any) {
    try {
      // Check if we have permissions
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        throw new Error('Notification permissions not granted');
      }

      // Schedule a local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Missed Appointment Reminder',
          body: `You missed your appointment with ${appointment.department}. Please reschedule.`,
          data: { appointmentId: appointment.id },
        },
        trigger: {
          seconds: 1, // Send immediately
        },
      });

      // Also prepare email reminder
      this.prepareEmailReminder(appointment);
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw error;
    }
  },

  prepareEmailReminder(appointment: any) {
    const subject = encodeURIComponent('Missed Appointment - Please Reschedule');
    const body = encodeURIComponent(
      `Dear ${appointment.name},\n\n` +
      `You missed your counselling appointment scheduled for ${new Date(appointment.preferredDate).toLocaleDateString()} with the ${appointment.department} department.\n\n` +
      `Please reschedule your appointment at your earliest convenience.\n\n` +
      `Best regards,\n` +
      `Gojan School of Business and Technology`
    );

    const mailto = `mailto:${appointment.email}?subject=${subject}&body=${body}`;
    Linking.openURL(mailto);
  },
};