// Exercise types
export interface Exercise {
  _id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  instructions: string;
  equipment: Equipment;
  createdAt?: string;
  updatedAt?: string;
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
  _id: string;
  name: string;
  date: string;
  duration: number; // in minutes
  exercises: WorkoutExercise[];
  notes: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutExercise {
  exerciseId: string | Exercise; // Can be either string (ID) or full Exercise object
  sets: ExerciseSet[];
  notes: string;
}

export interface ExerciseSet {
  _id: string;
  weight: number;
  reps: number;
  completed: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

export interface WorkoutTemplate {
  _id: string;
  name: string;
  exercises: WorkoutTemplateExercise[];
  userId: string;
  createdAt: string;
  lastPerformed?: string;
  updatedAt?: string;
}

export interface WorkoutTemplateExercise {
  exerciseId: string;
  setCount: number;
}

// Progress types
export interface Progress {
  _id: string;
  exerciseId: string;
  userId: string;
  date: string;
  maxWeight: number;
  maxReps: number;
  volume: number; // total weight * reps across all sets
  createdAt?: string;
  updatedAt?: string;
}

// User profile types
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  bodyweight?: number;
  height?: number;
  units: 'kg' | 'lb';
  distanceUnits: 'km' | 'mi';
  restTimer: number; // in seconds
  createdAt?: string;
  updatedAt?: string;
}