import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Workout from '@/models/Workout';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const setSchema = z.object({
  weight: z.number().min(0),
  reps: z.number().min(1),
  completed: z.boolean().default(false)
});

const workoutExerciseSchema = z.object({
  exerciseId: z.string(),
  sets: z.array(setSchema),
  notes: z.string().optional()
});

const workoutSchema = z.object({
  name: z.string().min(1),
  date: z.string().datetime(),
  duration: z.number().min(0),
  notes: z.string().optional(),
  exercises: z.array(workoutExerciseSchema)
});

// Middleware para verificar el token
const verifyToken = async (request: Request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

// GET /api/workouts/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const workout = await Workout.findOne({ _id: params.id, userId })
      .populate('exercises.exerciseId');

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(workout);
  } catch (error: any) {
    console.error('Error fetching workout:', error);
    return NextResponse.json(
      { error: 'Error fetching workout' },
      { status: 500 }
    );
  }
}

// PATCH /api/workouts/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();
    
    const validation = workoutSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const workout = await Workout.findOne({ _id: params.id, userId });
    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      params.id,
      { $set: validation.data },
      { new: true }
    ).populate('exercises.exerciseId');

    return NextResponse.json(updatedWorkout);
  } catch (error: any) {
    console.error('Error updating workout:', error);
    return NextResponse.json(
      { error: 'Error updating workout' },
      { status: 500 }
    );
  }
}

// DELETE /api/workouts/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const workout = await Workout.findOne({ _id: params.id, userId });
    
    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    await Workout.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Workout deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Error deleting workout' },
      { status: 500 }
    );
  }
} 