import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import { Search, GraduationCap, Moon, Sun } from 'lucide-react-native'; // TODO: Add type declarations for 'lucide-react-native' if needed
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const departments = [
  {
    id: '1',
    name: 'Computer Science Engineering',
    description: 'Advanced computing, software development, and emerging technologies',
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg'
  },
  {
    id: '2',
    name: 'Information Technology',
    description: 'IT systems, network management, and digital infrastructure',
    image: 'https://images.pexels.com/photos/325111/pexels-photo-325111.jpeg'
  },
  {
    id: '3',
    name: 'Electronics & Communication',
    description: 'Electronic systems, telecommunications, and signal processing',
    image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg'
  },
  {
    id: '4',
    name: 'Mechanical Engineering',
    description: 'Machine design, manufacturing, and mechanical systems',
    image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg'
  },
  {
    id: '5',
    name: 'Civil Engineering',
    description: 'Infrastructure development, construction, and urban planning',
    image: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg'
  },
  {
    id: '6',
    name: 'Electrical Engineering',
    description: 'Power systems, electrical design, and renewable energy',
    image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg'
  },
  {
    id: '7',
    name: 'Business Administration',
    description: 'Management principles, business strategy, and leadership',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
  },
  {
    id: '8',
    name: 'Master of Commerce',
    description: 'Advanced accounting, finance, and business analytics',
    image: 'https://images.pexels.com/photos/210574/pexels-photo-210574.jpeg'
  },
  {
    id: '9',
    name: 'Arts & Science',
    description: 'Liberal arts education with interdisciplinary approach',
    image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'
  },
  {
    id: '10',
    name: 'Data Science',
    description: 'Big data analytics, machine learning, and statistical modeling',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg'
  },
  {
    id: '11',
    name: 'Biotechnology',
    description: 'Biological sciences, genetic engineering, and medical research',
    image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg'
  },
  {
    id: '12',
    name: 'Aerospace Engineering',
    description: 'Aircraft design, space technology, and aerodynamics',
    image: 'https://images.pexels.com/photos/355935/pexels-photo-355935.jpeg'
  }
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState(departments);
  const { colors } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const filtered = departments.filter(dept =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDepartments(filtered);
  }, [searchQuery]);

  const handleDepartmentPress = (department: any) => {
    router.push({
      pathname: '/booking/appointment',
      params: { department: department.name, departmentId: department.id }
    });
  };

  const handleAdmissionPress = () => {
    router.push('/(tabs)/admission');
  };

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg' }}
        style={styles.header}
        imageStyle={styles.headerImage}>
        <View style={styles.headerOverlay}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome, {user?.name}!</Text>
              <Text style={styles.collegeText}>Gojan School of Business and Technology</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search departments..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity style={styles.admissionButton} onPress={handleAdmissionPress}>
          <GraduationCap size={24} color="#FFFFFF" />
          <Text style={styles.admissionButtonText}>Book Admission</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Departments</Text>
        
        <View style={styles.departmentsGrid}>
          {filteredDepartments.map((department) => (
            <TouchableOpacity 
              key={department.id} 
              style={styles.departmentCard} 
              onPress={() => handleDepartmentPress(department)}
            >
              <Image source={{ uri: department.image }} style={styles.departmentImage} />
              <View style={styles.departmentContent}>
                <Text style={styles.departmentTitle} numberOfLines={2}>
                  {department.name}
                </Text>
                <Text style={styles.departmentDescription} numberOfLines={3}>
                  {department.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
    height: 200,
    justifyContent: 'flex-end',
  },
  headerImage: {
    opacity: 0.8,
  },
  headerOverlay: {
    backgroundColor: 'rgba(30, 64, 175, 0.8)',
    padding: 20,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  collegeText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    maxWidth: '70%',
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.textPrimary,
  },
  admissionButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: colors.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  admissionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  departmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  departmentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  departmentImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  departmentContent: {
    padding: 12,
  },
  departmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 18,
  },
  departmentDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});