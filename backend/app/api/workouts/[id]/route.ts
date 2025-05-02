import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectDB from '@/lib/db';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const exerciseSchema = z.object({
  name: z.string(),
  sets: z.number().min(1),
  reps: z.number().min(1),
  weight: z.number().min(0),
  notes: z.string().optional(),
});

const workoutSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  exercises: z.array(exerciseSchema),
  duration: z.number().min(0),
  date: z.string().optional(),
});

async function getUserIdFromToken(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  return decoded.userId;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB();
    const headersList = headers();
    const userId = await getUserIdFromToken(headersList.get('authorization'));

    const workout = await db.findWorkoutById(params.id);
    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    if (workout.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(workout);
  } catch (error: any) {
    console.error('Fetch workout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB();
    const headersList = headers();
    const userId = await getUserIdFromToken(headersList.get('authorization'));

    const workout = await db.findWorkoutById(params.id);
    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    if (workout.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = workoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const workoutData = {
      ...validation.data,
      userId,
      date: validation.data.date ? new Date(validation.data.date) : new Date(),
    };

    const updatedWorkout = await db.updateWorkout(params.id, workoutData);

    return NextResponse.json(updatedWorkout);
  } catch (error: any) {
    console.error('Update workout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectDB();
    const headersList = headers();
    const userId = await getUserIdFromToken(headersList.get('authorization'));

    const workout = await db.findWorkoutById(params.id);
    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    if (workout.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await db.deleteWorkout(params.id);

    return NextResponse.json({ message: 'Workout deleted successfully' });
  } catch (error: any) {
    console.error('Delete workout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 