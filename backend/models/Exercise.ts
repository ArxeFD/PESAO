import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string;
  equipment: string;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['chest', 'back', 'shoulders', 'legs', 'arms', 'core']
  },
  primaryMuscles: [{
    type: String,
    required: true
  }],
  secondaryMuscles: [{
    type: String,
    required: false
  }],
  instructions: {
    type: String,
    required: true
  },
  equipment: {
    type: String,
    required: true,
    enum: ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight']
  }
}, {
  timestamps: true
});

export default mongoose.models.Exercise || mongoose.model<IExercise>('Exercise', exerciseSchema); 