import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check, ChevronDown, Clock, X, Search, Plus } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Workout, Exercise } from '@/types';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useExercises } from '@/hooks/useExercises';
import ExerciseSearchItem from '@/components/exercises/ExerciseSearchItem';
import RestTimer from '@/components/workout/RestTimer';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function NewWorkoutScreen() {
  const router = useRouter();
  const { addWorkout } = useWorkouts();
  const { exercises } = useExercises();
  
  const [workoutName, setWorkoutName] = useState('Quick Workout');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<{
    exercise: Exercise;
    sets: { weight: string; reps: string; id: string }[];
  }[]>([]);
  const [showTimer, setShowTimer] = useState(false);

  // Filter exercises based on search query
  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addExerciseToWorkout = (exercise: Exercise) => {
    setSelectedExercises(prev => [
      ...prev, 
      { 
        exercise, 
        sets: [{ weight: '', reps: '', id: Date.now().toString() }] 
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
      id: Date.now().toString()
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
    if (selectedExercises.length === 0) {
      return;
    }
    
    const newWorkout: Workout = {
      id: Date.now().toString(),
      name: workoutName,
      date: new Date().toISOString(),
      duration: 60,
      notes: '',
      exercises: selectedExercises.map(item => ({
        exerciseId: item.exercise.id,
        sets: item.sets.map(set => ({
          id: set.id,
          weight: parseFloat(set.weight) || 0,
          reps: parseInt(set.reps) || 0,
          completed: true,
        })),
        notes: '',
      })),
    };
    
    addWorkout(newWorkout);
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
                key={exercise.id}
                exercise={exercise}
                onPress={() => addExerciseToWorkout(exercise)}
              />
            ))}
          </ScrollView>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <TextInput
              style={styles.workoutNameInput}
              value={workoutName}
              onChangeText={setWorkoutName}
              selectTextOnFocus
            />
            <TouchableOpacity
              style={styles.finishButton}
              onPress={handleFinishWorkout}
              disabled={selectedExercises.length === 0}
            >
              <Check size={20} color={selectedExercises.length === 0 ? theme.colors.textSecondary : theme.colors.white} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {selectedExercises.map((item, exerciseIndex) => (
              <Animated.View 
                key={`${item.exercise.id}-${exerciseIndex}`}
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
                  <View key={set.id} style={styles.setRow}>
                    <Text style={styles.setText}>{setIndex + 1}</Text>
                    <TextInput
                      style={styles.setInput}
                      value={set.weight}
                      onChangeText={(value) => updateSetValue(exerciseIndex, setIndex, 'weight', value)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={theme.colors.textSecondary}
                    />
                    <TextInput
                      style={styles.setInput}
                      value={set.reps}
                      onChangeText={(value) => updateSetValue(exerciseIndex, setIndex, 'reps', value)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={theme.colors.textSecondary}
                    />
                    {item.sets.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeSet(exerciseIndex, setIndex)}
                        style={styles.removeSetButton}
                      >
                        <X size={14} color={theme.colors.textSecondary} />
                      </TouchableOpacity>
                    )}
                    {item.sets.length === 1 || setIndex !== item.sets.length - 1 ? (
                      <View style={styles.emptyAction} />
                    ) : null}
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
                  
                  <TouchableOpacity 
                    style={styles.restTimerButton}
                    onPress={() => setShowTimer(true)}
                  >
                    <Clock size={14} color={theme.colors.primary} />
                    <Text style={styles.addSetText}>Rest Timer</Text>
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
          
          {showTimer && (
            <RestTimer
              onClose={() => setShowTimer(false)}
              defaultTime={90}
            />
          )}
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
    width: 50,
    textAlign: 'center',
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
    width: 50,
    textAlign: 'center',
  },
  setInput: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    width: 50,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  removeSetButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyAction: {
    width: 24,
    marginLeft: 8,
  },
  setActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginRight: 12,
  },
  restTimerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  addSetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: theme.colors.primary,
    marginLeft: 6,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
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
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  searchResults: {
    flex: 1,
  },
});