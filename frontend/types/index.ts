// Exercise types
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  instructions: string;
  equipment: Equipment;
}

export type ExerciseCategory = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'legs'
  | 'core'
  | 'cardio'
  | 'olympic'
  | 'full body'
  | 'other';

export type Muscle =
  | 'chest'
  | 'upperChest'
  | 'lowerChest'
  | 'lats'
  | 'upperBack'
  | 'lowerBack'
  | 'frontDelts'
  | 'sideDelts'
  | 'rearDelts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'glutes'
  | 'abs'
  | 'obliques'
  | 'traps';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'bands'
  | 'smith machine'
  | 'other'
  | 'none';

// Workout types
export interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number; // in minutes
  exercises: WorkoutExercise[];
  notes: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: ExerciseSet[];
  notes: string;
}

export interface ExerciseSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: WorkoutTemplateExercise[];
  createdAt: string;
  lastPerformed?: string;
}

export interface WorkoutTemplateExercise {
  exerciseId: string;
  setCount: number;
}

// Progress types
export interface Progress {
  exerciseId: string;
  date: string;
  maxWeight: number;
  maxReps: number;
  volume: number; // total weight * reps across all sets
}

// User profile types
export interface UserProfile {
  name: string;
  photo?: string;
  bodyweight?: number;
  height?: number;
  units: 'kg' | 'lb';
  distanceUnits: 'km' | 'mi';
  restTimer: number; // in seconds
}