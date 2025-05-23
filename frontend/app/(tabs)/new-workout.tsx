import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Check, ChevronDown, X, Search, Plus, Calendar } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Workout, Exercise } from '@/types';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useExercises } from '@/hooks/useExercises';
import ExerciseSearchItem from '@/components/exercises/ExerciseSearchItem';
import Animated, { FadeInDown } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/providers/AuthProvider';

export default function NewWorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { createWorkout } = useWorkouts();
  const { exercises } = useExercises();
  const { user } = useAuth();
  
  const [workoutName, setWorkoutName] = useState('Quick Workout');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<{
    exercise: Exercise;
    sets: { weight: string; reps: string; _id: string }[];
  }[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (params.date) {
      return parseISO(params.date as string);
    }
    return new Date();
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [duration, setDuration] = useState('60');

  // Reset state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setWorkoutName('Quick Workout');
      setSelectedExercises([]);
      if (params.date) {
        setSelectedDate(parseISO(params.date as string));
      } else {
        setSelectedDate(new Date());
      }
      setIsSearchOpen(false);
      setSearchQuery('');
    }, [params.date])
  );

  // Filter exercises based on search query
  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addExerciseToWorkout = (exercise: Exercise) => {
    setSelectedExercises(prev => [
      ...prev, 
      { 
        exercise, 
        sets: [{ weight: '', reps: '', _id: Date.now().toString() }] 
      }
    ]);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const addSet = (exerciseIndex: number) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises[exerciseIndex].sets.push({
      weight: newSelectedExercises[exerciseIndex].sets[newSelectedExercises[exerciseIndex].sets.length - 1].weight,
      reps: newSelectedExercises[exerciseIndex].sets[newSelectedExercises[exerciseIndex].sets.length - 1].reps,
      _id: Date.now().toString()
    });
    setSelectedExercises(newSelectedExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setSelectedExercises(newSelectedExercises);
  };

  const updateSetValue = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises[exerciseIndex].sets[setIndex][field] = value;
    setSelectedExercises(newSelectedExercises);
  };

  const removeExercise = (exerciseIndex: number) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises.splice(exerciseIndex, 1);
    setSelectedExercises(newSelectedExercises);
  };

  const handleFinishWorkout = () => {
    if (selectedExercises.length === 0 || !user) {
      return;
    }
    
    const newWorkout: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'> = {
      name: workoutName,
      date: selectedDate.toISOString(),
      duration: parseInt(duration) || 60,
      notes: '',
      userId: user.id,
      exercises: selectedExercises.map(item => ({
        exerciseId: item.exercise._id,
        sets: item.sets.map(set => ({
          _id: set._id,
          weight: parseFloat(set.weight) || 0,
          reps: parseInt(set.reps) || 0,
          completed: true,
        })),
        notes: '',
      })),
    };
    
    createWorkout(newWorkout);
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TextInput
          style={styles.workoutNameInput}
          value={workoutName}
          onChangeText={setWorkoutName}
          placeholder="Workout Name"
          placeholderTextColor={theme.colors.textSecondary}
        />
        <TouchableOpacity 
          style={[styles.finishButton, selectedExercises.length === 0 && styles.finishButtonDisabled]}
          onPress={handleFinishWorkout}
          disabled={selectedExercises.length === 0}
        >
          <Check size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

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
              autoFocus
            />
          </View>
          
          <ScrollView style={styles.searchResults}>
            {filteredExercises.map(exercise => (
              <ExerciseSearchItem
                key={exercise._id}
                exercise={exercise}
                onPress={() => addExerciseToWorkout(exercise)}
              />
            ))}
          </ScrollView>
        </View>
      ) : (
        <>
          <ScrollView style={styles.content}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity 
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {format(selectedDate, 'MMM d, yyyy')}
                </Text>
                <Calendar size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                placeholder="Duration in minutes"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {selectedExercises.map((item, exerciseIndex) => (
              <Animated.View 
                key={`${item.exercise._id}-${exerciseIndex}`}
                style={styles.exerciseCard}
                entering={FadeInDown.delay(exerciseIndex * 100).duration(300)}
              >
                <View style={styles.exerciseHeader}>
                  <View>
                    <Text style={styles.exerciseName}>{item.exercise.name}</Text>
                    <Text style={styles.exerciseCategory}>{item.exercise.category}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeExercise(exerciseIndex)}
                    style={styles.removeExerciseButton}
                  >
                    <X size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.setHeaders}>
                  <Text style={styles.setHeaderText}>SET</Text>
                  <Text style={styles.setHeaderText}>KG</Text>
                  <Text style={styles.setHeaderText}>REPS</Text>
                  <Text style={styles.setHeaderText}></Text>
                </View>

                {item.sets.map((set, setIndex) => (
                  <View key={set._id} style={styles.setRow}>
                    <Text style={styles.setText}>{setIndex + 1}</Text>
                    <TextInput
                      style={styles.setInput}
                      value={set.weight}
                      onChangeText={(value) => updateSetValue(exerciseIndex, setIndex, 'weight', value)}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                    <TextInput
                      style={styles.setInput}
                      value={set.reps}
                      onChangeText={(value) => updateSetValue(exerciseIndex, setIndex, 'reps', value)}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                    <TouchableOpacity
                      style={styles.removeSetButton}
                      onPress={() => removeSet(exerciseIndex, setIndex)}
                    >
                      <X size={14} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ))}

                <View style={styles.setActions}>
                  <TouchableOpacity 
                    style={styles.addSetButton}
                    onPress={() => addSet(exerciseIndex)}
                  >
                    <Plus size={14} color={theme.colors.primary} />
                    <Text style={styles.addSetText}>Add Set</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}

            <TouchableOpacity
              style={styles.addExerciseButton}
              onPress={() => setIsSearchOpen(true)}
            >
              <Plus size={20} color={theme.colors.primary} />
              <Text style={styles.addExerciseText}>Add Exercise</Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
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
  workoutNameInput: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  finishButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  exerciseCategory: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  removeExerciseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setHeaders: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  setHeaderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
    width: 60,
    marginLeft: 16,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    width: 60,
  },
  setInput: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 8,
    width: 60,
    marginLeft: 16,
    textAlign: 'center',
  },
  removeSetButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  setActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 16,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addSetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addExerciseText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 8,
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
    backgroundColor: theme.colors.card,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textPrimary,
    paddingVertical: 12,
  },
  searchResults: {
    flex: 1,
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
});