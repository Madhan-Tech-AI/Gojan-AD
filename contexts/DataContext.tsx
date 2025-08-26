import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  preferredDate: string;
  remarks: string;
  userId?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  timestamp: string;
  assignedDate?: string;
  mode?: 'online' | 'in_person';
  counselorName?: string;
}

export interface Admission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  courseInterested: string;
  address: string;
  remarks: string;
  userId?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  previousEducation?: string;
  percentageOrGPA?: string;
  guardianName?: string;
  guardianPhone?: string;
}

interface DataContextType {
  appointments: Appointment[];
  admissions: Admission[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  addAdmission: (admission: Omit<Admission, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment['status'], assignedDate?: string) => Promise<void>;
  updateAdmissionStatus: (id: string, status: Admission['status']) => Promise<void>;
  refreshData: () => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  deleteAdmission: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsData, admissionsData] = await Promise.all([
        AsyncStorage.getItem('appointments'),
        AsyncStorage.getItem('admissions'),
      ]);

      if (appointmentsData) {
        setAppointments(JSON.parse(appointmentsData));
      }
      if (admissionsData) {
        setAdmissions(JSON.parse(admissionsData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'timestamp' | 'status'>) => {
    try {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  };

  const addAdmission = async (admissionData: Omit<Admission, 'id' | 'timestamp' | 'status'>) => {
    try {
      const newAdmission: Admission = {
        ...admissionData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const updatedAdmissions = [...admissions, newAdmission];
      setAdmissions(updatedAdmissions);
      await AsyncStorage.setItem('admissions', JSON.stringify(updatedAdmissions));
    } catch (error) {
      console.error('Error adding admission:', error);
      throw error;
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status'], assignedDate?: string) => {
    try {
      const updatedAppointments = appointments.map(apt => 
        apt.id === id 
          ? { ...apt, status, assignedDate: assignedDate || apt.assignedDate }
          : apt
      );
      setAppointments(updatedAppointments);
      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  };

  const updateAdmissionStatus = async (id: string, status: Admission['status']) => {
    try {
      const updatedAdmissions = admissions.map(adm => 
        adm.id === id ? { ...adm, status } : adm
      );
      setAdmissions(updatedAdmissions);
      await AsyncStorage.setItem('admissions', JSON.stringify(updatedAdmissions));
    } catch (error) {
      console.error('Error updating admission status:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const deleteAppointment = async (id: string) => {
    try {
      const updated = appointments.filter((a) => a.id !== id);
      setAppointments(updated);
      await AsyncStorage.setItem('appointments', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  };

  const deleteAdmission = async (id: string) => {
    try {
      const updated = admissions.filter((a) => a.id !== id);
      setAdmissions(updated);
      await AsyncStorage.setItem('admissions', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting admission:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        appointments,
        admissions,
        addAppointment,
        addAdmission,
        updateAppointmentStatus,
        updateAdmissionStatus,
        refreshData,
        deleteAppointment,
        deleteAdmission,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
