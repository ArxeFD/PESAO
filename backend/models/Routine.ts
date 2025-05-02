import mongoose, { Schema, Document } from 'mongoose';
import { IExercise } from './Workout';

export interface IRoutine extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  exercises: IExercise[];
  frequency: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const routineSchema = new Schema<IRoutine>({
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
  exercises: [{
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
  }],
  frequency: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
routineSchema.index({ userId: 1, isActive: 1 });

export default mongoose.models.Routine || mongoose.model<IRoutine>('Routine', routineSchema); 