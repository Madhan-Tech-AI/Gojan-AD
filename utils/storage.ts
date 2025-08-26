import AsyncStorage from '@react-native-async-storage/async-storage';

// Appointment Storage
export const appointmentStorage = {
  async saveAppointment(appointment: any) {
    try {
      const existing = await this.getAppointments();
      const updated = [...existing, appointment];
      await AsyncStorage.setItem('appointments', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving appointment:', error);
      throw error;
    }
  },

  async getAppointments() {
    try {
      const data = await AsyncStorage.getItem('appointments');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting appointments:', error);
      return [];
    }
  },

  async cancelAppointment(appointmentId: string) {
    try {
      const appointments = await this.getAppointments();
      const updated = appointments.map((apt: any) =>
        apt.id === appointmentId ? { ...apt, status: 'Cancelled' } : apt
      );
      await AsyncStorage.setItem('appointments', JSON.stringify(updated));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  },
};

// Admission Storage
export const admissionStorage = {
  async saveAdmissionForm(admission: any) {
    try {
      const existing = await this.getAdmissionForms();
      const updated = [...existing, admission];
      await AsyncStorage.setItem('admissions', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving admission form:', error);
      throw error;
    }
  },

  async getAdmissionForms() {
    try {
      const data = await AsyncStorage.getItem('admissions');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting admission forms:', error);
      return [];
    }
  },
};