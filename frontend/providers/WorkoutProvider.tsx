import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workout } from '@/types';
import { mockWorkouts } from '@/data/mockWorkouts';

type SortOption = 'most_recent' | 'oldest' | 'most_volume' | 'most_sets';

type WorkoutContextType = {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (workoutId: string) => void;
  getWorkoutById: (workoutId: string) => Workout | undefined;
  recentWorkouts: Workout[];
  sortWorkouts: (option: SortOption) => Workout[];
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);

  const addWorkout = (workout: Workout) => {
    setWorkouts(prev => [workout, ...prev]);
  };

  const updateWorkout = (workout: Workout) => {
    setWorkouts(prev => 
      prev.map(w => w.id === workout.id ? workout : w)
    );
  };

  const deleteWorkout = (workoutId: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));
  };

  const getWorkoutById = (workoutId: string) => {
    return workouts.find(w => w.id === workoutId);
  };

  const sortWorkouts = (option: SortOption) => {
    const sortedWorkouts = [...workouts];
    
    switch (option) {
      case 'most_recent':
        return sortedWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      case 'oldest':
        return sortedWorkouts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      case 'most_volume':
        return sortedWorkouts.sort((a, b) => {
          const volumeA = a.exercises.reduce((acc, ex) => 
            acc + ex.sets.reduce((setAcc, set) => setAcc + (set.weight * set.reps), 0), 0);
          const volumeB = b.exercises.reduce((acc, ex) => 
            acc + ex.sets.reduce((setAcc, set) => setAcc + (set.weight * set.reps), 0), 0);
          return volumeB - volumeA;
        });
      
      case 'most_sets':
        return sortedWorkouts.sort((a, b) => {
          const setsA = a.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
          const setsB = b.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
          return setsB - setsA;
        });
      
      default:
        return sortedWorkouts;
    }
  };

  // Get the 3 most recent workouts
  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        getWorkoutById,
        recentWorkouts,
        sortWorkouts,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
}