import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  exercises: IExercise[];
  duration: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseSchema = new Schema<IExercise>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sets: {
    type: Number,
    required: true,
    min: 1,
  },
  reps: {
    type: Number,
    required: true,
    min: 1,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
});

const workoutSchema = new Schema<IWorkout>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  exercises: [exerciseSchema],
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
workoutSchema.index({ userId: 1, date: -1 });

export default mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema); 