import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, MoveVertical as MoreVertical, ChevronDown, Share2, ChevronRight, Edit2, Trash2, ChevronLeft } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useExercises } from '@/hooks/useExercises';
import { format } from 'date-fns';
import WorkoutExerciseItem from '@/components/workout/WorkoutExerciseItem';
import { EllipsisVertical } from 'lucide-react-native';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { workouts, getWorkoutById, deleteWorkout } = useWorkouts();
  const { getExerciseById } = useExercises();
  
  const workout = getWorkoutById(id || '');
  
  const [editMode, setEditMode] = useState(false);
  const [workoutName, setWorkoutName] = useState(workout?.name || '');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (workout) {
      setWorkoutName(workout.name);
    }
  }, [workout]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteWorkout(id || '');
            router.back();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push({
      pathname: '/workout/edit',
      params: { id: id }
    });
  };

  if (!workout) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Workout Not Found</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centeredContainer}>
          <Text style={styles.notFoundText}>The workout you're looking for doesn't exist.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/workout/new')}
          >
            <Text style={styles.buttonText}>Create New Workout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate total volume
  const totalVolume = workout.exercises.reduce((acc, ex) => {
    return acc + ex.sets.reduce((setAcc, set) => {
      return setAcc + (set.weight * set.reps);
    }, 0);
  }, 0);

  // Get total sets
  const totalSets = workout.exercises.reduce((acc, ex) => {
    return acc + ex.sets.length;
  }, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        {editMode ? (
          <TextInput
            style={styles.nameInput}
            value={workoutName}
            onChangeText={setWorkoutName}
            onBlur={() => setEditMode(false)}
            autoFocus
          />
        ) : (
          <TouchableOpacity onPress={() => setEditMode(true)}>
            <Text style={styles.headerTitle}>{workout.name}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => setShowOptions(!showOptions)}
        >
          <EllipsisVertical size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={handleEdit}
          >
            <Edit2 size={20} color={theme.colors.textPrimary} />
            <Text style={styles.optionText}>Edit Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color="#FF0000" />
            <Text style={[styles.optionText, { color: "#FF0000" }]}>Delete Workout</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {format(new Date(workout.date), 'EEEE, MMMM d, yyyy • h:mm a')}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{workout.exercises.length}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalSets}</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.durationContainer}>
              <Clock size={14} color={theme.colors.textSecondary} style={styles.durationIcon} />
              <Text style={styles.statValue}>{workout.duration}m</Text>
            </View>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalVolume.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Volume</Text>
          </View>
        </View>

        <View style={styles.exercisesContainer}>
          {workout.exercises.map((exercise, index) => {
            const exerciseData = getExerciseById(exercise.exerciseId);
            if (!exerciseData) return null;
            
            return (
              <WorkoutExerciseItem
                key={`${exercise.exerciseId}-${index}`}
                exercise={exerciseData}
                sets={exercise.sets}
              />
            );
          })}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>Share Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MoreVertical size={20} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>Export as PDF</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Workout History</Text>
            <TouchableOpacity style={styles.historyButton}>
              <Text style={styles.historyButtonText}>View All</Text>
              <ChevronRight size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.historyCard}>
            <Text style={styles.historyEmptyText}>
              No previous workouts with the same exercises found.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  nameInput: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 150,
    textAlign: 'center',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  dateContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationIcon: {
    marginRight: 4,
  },
  exercisesContainer: {
    marginBottom: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  historyContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 4,
  },
  historyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  historyEmptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    padding: 24,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.white,
  },
  optionsContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginLeft: 12,
  },
  deleteButton: {
    marginTop: 4,
  },
  deleteText: {
    color: theme.colors.error,
  },
});