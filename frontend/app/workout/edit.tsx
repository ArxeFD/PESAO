import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Check, ChevronDown, X, Search, Plus, Calendar, ChevronLeft, Trash2 } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Workout, Exercise, WorkoutExercise } from '@/types';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useExercises } from '@/hooks/useExercises';
import ExerciseSearchItem from '@/components/exercises/ExerciseSearchItem';
import Animated, { FadeInDown } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ExerciseForm } from '@/components/workout/ExerciseForm';
import { ExerciseSetForm } from '@/components/workout/ExerciseSetForm';

export default function EditWorkoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getWorkoutById, updateWorkout, isLoading: isLoadingWorkout } = useWorkouts();
  const { getExerciseById, exercises, isLoading: isLoadingExercises } = useExercises();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: new Date(),
    duration: 0,
    exercises: [] as WorkoutExercise[],
    notes: ''
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (typeof id === 'string') {
        try {

          const workoutData = await getWorkoutById(id);

          if (workoutData) {
            setWorkout(workoutData);
            setFormData({
              name: workoutData.name,
              date: new Date(workoutData.date),
              duration: workoutData.duration,
              exercises: workoutData.exercises,
              notes: workoutData.notes
            });
          }
        } catch (error) {
          console.error('Error fetching workout:', error);
          Alert.alert('Error', 'Failed to load workout');
          router.back();
        }
      }
    };

    fetchWorkout();
  }, [id]);

  const handleSave = async () => {
    try {
      if (!workout) return;

      // Convert form data to workout format
      const updatedWorkout = {
        ...workout,
        name: formData.name,
        date: formData.date.toISOString(),
        duration: formData.duration,
        exercises: formData.exercises.map(exercise => ({
          exerciseId: typeof exercise.exerciseId === 'string' 
            ? exercise.exerciseId 
            : exercise.exerciseId._id,
          sets: exercise.sets.map(set => ({
            _id: set._id,
            weight: set.weight,
            reps: set.reps,
            completed: set.completed
          })),
          notes: exercise.notes
        })),
        notes: formData.notes
      };

      await updateWorkout(workout._id, updatedWorkout);
      router.back();
    } catch (error) {
      console.error('Error updating workout:', error);
      Alert.alert('Error', 'Failed to update workout');
    }
  };

  const handleAddExercise = () => {
    setIsSearchOpen(true);
  };

  const handleRemoveExercise = (index: number) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        exercises: prev.exercises.filter((_, i) => i !== index)
      };
      return updated;
    });
  };

  const handleUpdateExercise = (index: number, updatedExercise: WorkoutExercise) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        exercises: prev.exercises.map((exercise, i) => 
          i === index ? updatedExercise : exercise
        )
      };
      return updated;
    });
  };

  const handleUpdateSets = (exerciseIndex: number, sets: WorkoutExercise['sets']) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        exercises: prev.exercises.map((exercise, i) => 
          i === exerciseIndex ? { ...exercise, sets } : exercise
        )
      };
      return updated;
    });
  };

  if (isLoadingWorkout || isLoadingExercises || !workout) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Workout</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Workout name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {format(formData.date, 'MMM d, yyyy')}
            </Text>
            <Calendar size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setFormData(prev => ({ ...prev, date }));
                }
              }}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={formData.duration.toString()}
            onChangeText={(text) => setFormData(prev => ({ ...prev, duration: parseInt(text) || 0 }))}
            keyboardType="numeric"
            placeholder="Duration in minutes"
          />
        </View>

        <View style={styles.exercisesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <TouchableOpacity onPress={handleAddExercise} style={styles.addButton}>
              <Plus size={20} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>

          {formData.exercises.map((exercise, index) => (
            <View key={`${typeof exercise.exerciseId === 'string' ? exercise.exerciseId : exercise.exerciseId._id}-${index}`} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>
                  {typeof exercise.exerciseId === 'string' 
                    ? exercises.find(e => e._id === exercise.exerciseId)?.name || 'Unknown Exercise'
                    : exercise.exerciseId.name}
                </Text>
                <TouchableOpacity 
                  onPress={() => handleRemoveExercise(index)}
                  style={styles.removeButton}
                >
                  <Trash2 size={20} color={theme.colors.danger} />
                </TouchableOpacity>
              </View>

              <ExerciseForm
                exercise={exercise}
                exercises={exercises}
                onUpdate={(updatedExercise) => handleUpdateExercise(index, updatedExercise)}
              />

              <ExerciseSetForm
                sets={exercise.sets}
                onUpdate={(sets) => handleUpdateSets(index, sets)}
              />
            </View>
          ))}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Add notes about your workout"
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      {isSearchOpen ? (
        <View style={styles.searchContainer}>
          <View style={styles.searchHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsSearchOpen(false)}
            >
              <X size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.searchTitle}>Add Exercise</Text>
            <View style={{ width: 40 }} />
          </View>
          
          <View style={styles.searchInputContainer}>
            <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView style={styles.searchResults}>
            {exercises
              .filter(exercise => 
                exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(exercise => (
                <ExerciseSearchItem
                  key={exercise._id}
                  exercise={exercise}
                  onPress={() => {
                    const newExercise: WorkoutExercise = {
                      exerciseId: exercise,
                      sets: [{
                        _id: Date.now().toString(),
                        weight: 0,
                        reps: 0,
                        completed: false
                      }],
                      notes: ''
                    };
                    setFormData(prev => ({
                      ...prev,
                      exercises: [...prev.exercises, newExercise]
                    }));
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                />
              ))}
          </ScrollView>
        </View>
      ) : null}
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
  closeButton: {
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  exercisesSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  exerciseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  removeButton: {
    padding: 4,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  searchResults: {
    flex: 1,
  },
}); 