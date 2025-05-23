import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { Exercise, WorkoutExercise } from '@/types';
import { ChevronDown } from 'lucide-react-native';

interface ExerciseFormProps {
  exercise: WorkoutExercise;
  exercises: Exercise[];
  onUpdate: (exercise: WorkoutExercise) => void;
}

export function ExerciseForm({ exercise, exercises, onUpdate }: ExerciseFormProps) {
  const handleExerciseChange = (newExercise: Exercise) => {
    onUpdate({
      ...exercise,
      exerciseId: newExercise
    });
  };

  const exerciseName = typeof exercise.exerciseId === 'string'
    ? exercises.find(e => e._id === exercise.exerciseId)?.name || 'Unknown Exercise'
    : exercise.exerciseId.name;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.exerciseSelector}
        onPress={() => {
          console.log('Exercise selector pressed');
          // TODO: Implement exercise selection modal
        }}
      >
        <Text style={styles.exerciseName}>
          {exerciseName}
        </Text>
        <ChevronDown size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  exerciseSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exerciseName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
}); 