import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { Workout } from '@/types';
import { format } from 'date-fns';
import { Dumbbell, Clock } from 'lucide-react-native';

type WorkoutCardProps = {
  workout: Workout;
  onPress: () => void;
};

export default function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  // Calculate the total volume of the workout
  const totalVolume = workout.exercises.reduce((acc, exercise) => {
    return acc + exercise.sets.reduce((setAcc, set) => {
      return setAcc + (set.weight * set.reps);
    }, 0);
  }, 0);

  // Get total sets
  const totalSets = workout.exercises.reduce((acc, exercise) => {
    return acc + exercise.sets.length;
  }, 0);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{workout.name}</Text>
        <Text style={styles.date}>{format(new Date(workout.date), 'MMM d, yyyy')}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Dumbbell size={14} color={theme.colors.textSecondary} style={styles.statIcon} />
          <Text style={styles.statText}>
            {workout.exercises.length} {workout.exercises.length === 1 ? 'exercise' : 'exercises'} • {totalSets} {totalSets === 1 ? 'set' : 'sets'}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Clock size={14} color={theme.colors.textSecondary} style={styles.statIcon} />
          <Text style={styles.statText}>{workout.duration} min</Text>
        </View>
      </View>
      
      <View style={styles.exercisesContainer}>
        {workout.exercises.slice(0, 3).map((exercise, index) => (
          <View key={`${exercise.exerciseId}-${index}`} style={styles.exerciseRow}>
            <View style={styles.exerciseDot} />
            <Text style={styles.exerciseName}>
              {/* We would usually get the exercise name from the database */}
              {['Bench Press', 'Pull Up', 'Shoulder Press', 'Squat', 'Tricep Pushdown', 
                'Lat Pulldown', 'Bicep Curl', 'Romanian Deadlift', 'Leg Press', 'Incline Bench Press'][parseInt(exercise.exerciseId) - 1]}
            </Text>
            <Text style={styles.exerciseSets}>
              {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}
            </Text>
          </View>
        ))}
        
        {workout.exercises.length > 3 && (
          <Text style={styles.moreExercises}>
            +{workout.exercises.length - 3} more exercises
          </Text>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.volume}>Volume: {totalVolume.toLocaleString()} kg</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 6,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  exercisesContainer: {
    padding: 16,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: 8,
  },
  exerciseName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  exerciseSets: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  moreExercises: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginLeft: 14,
  },
  footer: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  volume: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
});