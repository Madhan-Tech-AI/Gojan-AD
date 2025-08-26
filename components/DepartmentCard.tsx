import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface DepartmentCardProps {
  department: {
    id: string;
    name: string;
    description: string;
    image: string;
  };
  onPress: () => void;
}

export default function DepartmentCard({ department, onPress }: DepartmentCardProps) {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: department.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {department.name}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {department.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  card: {
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
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});