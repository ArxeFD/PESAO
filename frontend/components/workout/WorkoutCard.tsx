import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { Workout } from '@/types';
import { format } from 'date-fns';
import { Dumbbell, Clock } from 'lucide-react-native';
import { useExercises } from '@/hooks/useExercises';
import { useRouter } from 'expo-router';

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const router = useRouter();
  const { getExerciseById, isLoading: isLoadingExercises } = useExercises();

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

  const handlePress = () => {
    router.push({
      pathname: '/workout/[id]',
      params: { id: workout._id }
    });
  };

  // Get exercise names for display
  const exerciseNames = workout.exercises.map(exercise => {
    const exerciseData = getExerciseById(exercise.exerciseId._id);
    return exerciseData?.name || 'Unknown Exercise';
  });

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{workout.name}</Text>
          <Text style={styles.date}>{format(new Date(workout.date), 'MMM d, yyyy')}</Text>
        </View>
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
        {!isLoadingExercises && exerciseNames.slice(0, 3).map((name, index) => (
          <View key={`${workout.exercises[index].exerciseId._id}-${index}`} style={styles.exerciseRow}>
            <View style={styles.exerciseDot} />
            <Text style={styles.exerciseName}>{name}</Text>
            <Text style={styles.exerciseSets}>
              {workout.exercises[index].sets.length} {workout.exercises[index].sets.length === 1 ? 'set' : 'sets'}
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
    alignItems: 'flex-start',
    padding: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 4,
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