import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Exercise from '@/models/Exercise';
import { z } from 'zod';

const exerciseSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['chest', 'back', 'shoulders', 'legs', 'arms', 'core']),
  primaryMuscles: z.array(z.string()),
  secondaryMuscles: z.array(z.string()).optional(),
  instructions: z.string().min(1),
  equipment: z.enum(['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight'])
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

// GET /api/exercises
export async function GET() {
  try {
    await connectDB();
    const exercises = await Exercise.find().sort({ name: 1 });
    return NextResponse.json(exercises, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Error fetching exercises' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/exercises
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const validation = exerciseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400, headers: corsHeaders }
      );
    }

    const exercise = await Exercise.create(validation.data);
    return NextResponse.json(exercise, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    console.error('Error creating exercise:', error);
    return NextResponse.json(
      { error: 'Error creating exercise' },
      { status: 500, headers: corsHeaders }
    );
  }
}