import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { WorkoutExercise } from '@/types';

interface WorkoutExerciseItemProps {
  exercise: WorkoutExercise;
  index: number;
}

export default function WorkoutExerciseItem({ exercise, index }: WorkoutExerciseItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{exercise.exerciseId.name}</Text>
          <Text style={styles.category}>{exercise.exerciseId.category}</Text>
        </View>
      </View>
          
      <View style={styles.setsContainer}>
        {exercise.sets.map((set, setIndex) => (
          <View key={set._id} style={styles.setRow}>
            <Text style={styles.setText}>Set {setIndex + 1}</Text>
            <Text style={styles.setValue}>{set.weight} kg</Text>
            <Text style={styles.setValue}>{set.reps} reps</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  category: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  setsContainer: {
    gap: 8,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
  },
  setText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    width: 60,
  },
  setValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginLeft: 16,
  },
});