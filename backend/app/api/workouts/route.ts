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

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma, Expires',
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

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

// GET /api/workouts
export async function GET(request: Request) {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    await connectDB();
    const workouts = await Workout.find({ userId })
      .populate('exercises.exerciseId')
      .sort({ date: -1 });

    return NextResponse.json(workouts, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Error fetching workouts' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/workouts
export async function POST(request: Request) {
  try {
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    await connectDB();
    const body = await request.json();

    const validation = workoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400, headers: corsHeaders }
      );
    }

    const workout = await Workout.create({
      ...validation.data,
      userId
    });

    const populatedWorkout = await Workout.findById(workout._id)
      .populate('exercises.exerciseId');

    return NextResponse.json(populatedWorkout, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Error creating workout' },
      { status: 500, headers: corsHeaders }
    );
  }
}