import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { Exercise } from '@/types';
import { ChevronRight } from 'lucide-react-native';

type ExerciseSearchItemProps = {
  exercise: Exercise;
  onPress: () => void;
};

export default function ExerciseSearchItem({ exercise, onPress }: ExerciseSearchItemProps) {
  // Map equipment to icon or text
  const getEquipmentText = (equipment: string) => {
    switch (equipment) {
      case 'barbell':
        return 'Barbell';
      case 'dumbbell':
        return 'Dumbbell';
      case 'cable':
        return 'Cable';
      case 'machine':
        return 'Machine';
      case 'bodyweight':
        return 'Bodyweight';
      default:
        return equipment.charAt(0).toUpperCase() + equipment.slice(1);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        <View style={styles.details}>
          <Text style={styles.category}>{exercise.category}</Text>
          <View style={styles.dot} />
          <Text style={styles.equipment}>{getEquipmentText(exercise.equipment)}</Text>
        </View>
      </View>
      <ChevronRight size={20} color={theme.colors.textSecondary} />
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  content: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.textSecondary,
    marginHorizontal: 8,
  },
  equipment: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});