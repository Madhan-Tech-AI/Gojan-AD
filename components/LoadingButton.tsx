import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LoadingButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function LoadingButton({
  title,
  onPress,
  loading = false,
  style,
  disabled = false,
}: LoadingButtonProps) {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.button, style, (loading || disabled) && styles.disabled]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});