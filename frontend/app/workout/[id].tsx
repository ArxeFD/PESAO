import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, MoveVertical as MoreVertical, ChevronDown, Share2, ChevronRight, Edit2, Trash2, ChevronLeft } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useExercises } from '@/hooks/useExercises';
import { format } from 'date-fns';
import WorkoutExerciseItem from '@/components/workout/WorkoutExerciseItem';
import { EllipsisVertical } from 'lucide-react-native';
import { Workout, WorkoutExercise } from '@/types';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getWorkoutById, deleteWorkout } = useWorkouts();
  const { getExerciseById } = useExercises();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (typeof id === 'string') {
        try {
          console.log('Starting to fetch workout with ID:', id);
          const workoutData = await getWorkoutById(id);
          if (!workoutData) {
            console.error('No workout data received');
            Alert.alert('Error', 'Workout not found');
            router.back();
            return;
          }
          setWorkout(workoutData);
          setWorkoutName(workoutData.name);
        } catch (error) {
          console.error('Error fetching workout:', error);
          Alert.alert('Error', 'Failed to load workout');
          router.back();
        }
      }
    };

    fetchWorkout();
  }, [id]);

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
    setShowOptions(false);
    router.push({
      pathname: '/workout/edit',
      params: { id: id }
    });
  };

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Calculate the total volume of the workout
  const totalVolume = workout.exercises.reduce((acc: number, ex: WorkoutExercise) => {
    return acc + ex.sets.reduce((setAcc: number, set) => {
      return setAcc + (set.weight * set.reps);
    }, 0);
  }, 0);

  // Get total sets
  const totalSets = workout.exercises.reduce((acc: number, ex: WorkoutExercise) => {
    return acc + ex.sets.length;
  }, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workoutName}</Text>
        <TouchableOpacity onPress={() => setShowOptions(!showOptions)} style={styles.optionsButton}>
          <EllipsisVertical size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {showOptions && (
        <>
          <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.optionsMenu}>
            <TouchableOpacity onPress={handleEdit} style={styles.optionItem}>
              <Edit2 size={20} color={theme.colors.textPrimary} />
              <Text style={styles.optionText}>Edit Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.optionItem}>
              <Trash2 size={20} color={theme.colors.danger} />
              <Text style={[styles.optionText, { color: theme.colors.danger }]}>Delete Workout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <ScrollView style={styles.content}>
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Clock size={20} color={theme.colors.textSecondary} />
            <Text style={styles.infoText}>{format(new Date(workout.date), 'MMM d, yyyy')}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>{workout.duration} min</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>{totalSets} sets</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoText}>{totalVolume} kg</Text>
          </View>
        </View>

        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises.map((exercise: WorkoutExercise, index: number) => (
            <WorkoutExerciseItem
              key={`${exercise.exerciseId._id}-${index}`}
              exercise={exercise}
              index={index}
            />
          ))}
        </View>

        {workout.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{workout.notes}</Text>
          </View>
        )}
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
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  optionsButton: {
    padding: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  optionsMenu: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 8,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  exercisesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});