import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { departments } from '@/data/departments';
import { router } from 'expo-router';

export default function CoursesScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Courses</Text>
        <Text style={styles.subtitle}>Explore all departments and programs</Text>
      </View>

      <View style={styles.grid}>
        {departments.map((dept) => (
          <TouchableOpacity key={dept.id} style={styles.card} onPress={() => setSelected(dept)}>
            <Image source={{ uri: dept.image }} style={styles.image} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>{dept.name}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{dept.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Image source={{ uri: selected?.image }} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{selected?.name}</Text>
            <Text style={styles.modalDesc}>{selected?.description}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => {
              const dept = selected;
              setSelected(null);
              router.push({ pathname: '/booking/appointment', params: { department: dept.name, departmentId: dept.id } });
            }}>
              <Text style={styles.modalButtonText}>Booking appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setSelected(null)}>
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.textPrimary },
  subtitle: { fontSize: 16, color: colors.textSecondary },
  grid: { padding: 20, paddingTop: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: colors.surface, borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  image: { width: '100%', height: 110 },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 12, color: colors.textSecondary },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  modalImage: { width: '100%', height: 160, borderRadius: 12, marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 8 },
  modalDesc: { fontSize: 14, color: colors.textSecondary, marginBottom: 16, lineHeight: 20 },
  modalButton: { backgroundColor: colors.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 10 },
  modalButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  modalCancel: { alignItems: 'center', padding: 10 },
  modalCancelText: { color: colors.textSecondary },
});


