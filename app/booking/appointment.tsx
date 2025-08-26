import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

export default function AppointmentBookingScreen() {
  const params = useLocalSearchParams();
  const { department, departmentId } = params;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: department as string || '',
    preferredDate: new Date(),
    remarks: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const { colors } = useTheme();
  const { user } = useAuth();
  const { addAppointment } = useData();

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday to Friday
  };

  const getNextWeekday = (date: Date) => {
    const nextDate = new Date(date);
    while (!isWeekday(nextDate)) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
    return nextDate;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const adjustedDate = isWeekday(selectedDate) 
        ? selectedDate 
        : getNextWeekday(selectedDate);
      setFormData({ ...formData, preferredDate: adjustedDate });
      
      if (!isWeekday(selectedDate)) {
        Alert.alert(
          'Weekday Required',
          'Appointments are only available Monday through Friday. Date adjusted to next weekday.'
        );
      }
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const appointmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        preferredDate: formData.preferredDate.toISOString(),
        remarks: formData.remarks,
        userId: user?.id,
      };

      // Use DataContext to add appointment
      await addAppointment(appointmentData);

      Alert.alert(
        'Appointment Booked',
        'Your counselling appointment has been booked successfully. You will receive confirmation soon.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Book Counselling Appointment</Text>
        <Text style={styles.subtitle}>Schedule a meeting with our counselors</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textSecondary}
            editable={!user?.name}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!user?.email}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone *</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Enter your phone number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Department *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.border + '40' }]}
            value={formData.department}
            editable={false}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preferred Date * (Weekdays only)</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={colors.textSecondary} />
            <Text style={styles.dateText}>
              {formData.preferredDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={formData.preferredDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Remarks (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.remarks}
            onChangeText={(text) => setFormData({ ...formData, remarks: text })}
            placeholder="Any specific requirements or questions"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          * You will receive a confirmation email with the assigned date and time within 24 hours.
        </Text>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.surface,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    padding: 20,
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
  textArea: {
    height: 100,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  dateInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});