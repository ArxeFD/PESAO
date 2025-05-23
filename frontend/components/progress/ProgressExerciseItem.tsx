import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';

type ProgressExerciseItemProps = {
  _id: string;
  name: string;
  category: string;
  isSelected: boolean;
  onPress: () => void;
};

export default function ProgressExerciseItem({
  _id,
  name,
  category,
  isSelected,
  onPress
}: ProgressExerciseItemProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
      
      <ChevronRight 
        size={20} 
        color={isSelected ? theme.colors.primary : theme.colors.textSecondary} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedContainer: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  category: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
});