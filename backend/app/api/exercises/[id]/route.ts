import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Exercise from '@/models/Exercise';
import { z } from 'zod';

const exerciseSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(['chest', 'back', 'shoulders', 'legs', 'arms', 'core']).optional(),
  primaryMuscles: z.array(z.string()).optional(),
  secondaryMuscles: z.array(z.string()).optional(),
  instructions: z.string().min(1).optional(),
  equipment: z.enum(['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight']).optional()
});

// GET /api/exercises/:id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const exercise = await Exercise.findById(params.id);
    
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(exercise);
  } catch (error: any) {
    console.error('Error fetching exercise:', error);
    return NextResponse.json(
      { error: 'Error fetching exercise' },
      { status: 500 }
    );
  }
}

// PATCH /api/exercises/:id
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    
    const validation = exerciseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const exercise = await Exercise.findByIdAndUpdate(
      params.id,
      validation.data,
      { new: true, runValidators: true }
    );

    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(exercise);
  } catch (error: any) {
    console.error('Error updating exercise:', error);
    return NextResponse.json(
      { error: 'Error updating exercise' },
      { status: 500 }
    );
  }
}

// DELETE /api/exercises/:id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const exercise = await Exercise.findByIdAndDelete(params.id);

    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Exercise deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json(
      { error: 'Error deleting exercise' },
      { status: 500 }
    );
  }
} 