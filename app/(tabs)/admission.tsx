import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Phone, Mail, FileText, GraduationCap } from 'lucide-react-native';
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

const courses = [
  'Computer Science Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Commerce',
  'Arts and Science',
];

export default function AdmissionScreen() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    courseInterested: '',
    address: '',
    remarks: '',
  });
  const [errors, setErrors] = useState<any>({});

  const { colors } = useTheme();
  const { user } = useAuth();
  const { addAdmission } = useData();

  const handleContactCall = () => {
    const phoneNumber = '+919876543210'; // Dummy number
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleContactEmail = () => {
    const email = 'admission@gojan.ac.in'; // Dummy email
    Linking.openURL(`mailto:${email}`);
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.courseInterested) {
      newErrors.courseInterested = 'Please select a course';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const admissionData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        courseInterested: formData.courseInterested,
        address: formData.address,
        remarks: formData.remarks,
        userId: user?.id,
      };

      // Use DataContext to add admission
      await addAdmission(admissionData);

      Alert.alert(
        'Application Submitted',
        'Your admission application has been submitted successfully. Our admission team will contact you soon.',
        [{ text: 'OK', onPress: () => setShowForm(false) }]
      );
      
      // Reset form
      setFormData({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        courseInterested: '',
        address: '',
        remarks: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  if (showForm) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Admission Application</Text>
          <Text style={styles.subtitle}>Fill out the form below to apply</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
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
            <Text style={styles.label}>Course Interested *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coursesContainer}>
              {courses.map((course) => (
                <TouchableOpacity
                  key={course}
                  style={[
                    styles.courseChip,
                    formData.courseInterested === course && styles.courseChipSelected
                  ]}
                  onPress={() => setFormData({ ...formData, courseInterested: course })}
                >
                  <Text style={[
                    styles.courseChipText,
                    formData.courseInterested === course && styles.courseChipTextSelected
                  ]}>
                    {course}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.courseInterested && <Text style={styles.errorText}>{errors.courseInterested}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.address && styles.inputError]}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Enter your complete address"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Remarks (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.remarks}
              onChangeText={(text) => setFormData({ ...formData, remarks: text })}
              placeholder="Any additional information or questions"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <GraduationCap size={48} color={colors.primary} />
        <Text style={styles.title}>Admission Information</Text>
        <Text style={styles.subtitle}>Get started with your admission process</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Contact Admission Office</Text>
          <Text style={styles.cardDescription}>
            Speak directly with our admission counselors for personalized guidance
          </Text>
          
          <View style={styles.contactActions}>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactCall}>
              <Phone size={20} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>Call Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactButton} onPress={handleContactEmail}>
              <Mail size={20} color="#FFFFFF" />
              <Text style={styles.contactButtonText}>Send Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Online Application</Text>
          <Text style={styles.cardDescription}>
            Fill out our comprehensive admission form to get started with the application process
          </Text>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setFormData({
                fullName: user?.name || '',
                email: user?.email || '',
                phone: '',
                courseInterested: '',
                address: '',
                remarks: '',
              });
              setShowForm(true);
            }}
          >
            <FileText size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Get Admission Form</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Available Courses</Text>
          <Text style={styles.cardDescription}>
            Choose from our wide range of undergraduate and postgraduate programs
          </Text>
          
          <View style={styles.coursesPreview}>
            {courses.slice(0, 4).map((course) => (
              <View key={course} style={styles.courseItem}>
                <Text style={styles.courseItemText}>{course}</Text>
              </View>
            ))}
            <Text style={styles.moreCoursesText}>...and more</Text>
          </View>
        </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    justifyContent: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  coursesPreview: {
    marginTop: 8,
  },
  courseItem: {
    backgroundColor: colors.accent + '20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  courseItemText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  moreCoursesText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
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
    height: 80,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  coursesContainer: {
    marginTop: 8,
  },
  courseChip: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  courseChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  courseChipText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  courseChipTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 0.48,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});