import mongoose, { Schema, Document } from 'mongoose';

export interface ISet extends Document {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface IWorkoutExercise extends Document {
  exerciseId: mongoose.Types.ObjectId;
  sets: ISet[];
  notes?: string;
}

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  date: Date;
  duration: number;
  notes?: string;
  exercises: IWorkoutExercise[];
  createdAt: Date;
  updatedAt: Date;
}

const setSchema = new Schema({
  weight: {
    type: Number,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const workoutExerciseSchema = new Schema({
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: [setSchema],
  notes: {
    type: String,
    required: false
  }
});

const workoutSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  exercises: [workoutExerciseSchema]
}, {
  timestamps: true
});

// Index for faster queries
workoutSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema); 