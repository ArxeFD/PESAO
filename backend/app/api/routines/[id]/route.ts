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

const routineSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  exercises: z.array(exerciseSchema),
  frequency: z.number().min(1),
  active: z.boolean().optional(),
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

    const routine = await db.findRoutineById(params.id);
    if (!routine) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      );
    }

    if (routine.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(routine);
  } catch (error: any) {
    console.error('Fetch routine error:', error);
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

    const routine = await db.findRoutineById(params.id);
    if (!routine) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      );
    }

    if (routine.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = routineSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const routineData = {
      ...validation.data,
      userId,
      active: validation.data.active ?? routine.active,
    };

    const updatedRoutine = await db.updateRoutine(params.id, routineData);

    return NextResponse.json(updatedRoutine);
  } catch (error: any) {
    console.error('Update routine error:', error);
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

    const routine = await db.findRoutineById(params.id);
    if (!routine) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      );
    }

    if (routine.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await db.deleteRoutine(params.id);

    return NextResponse.json({ message: 'Routine deleted successfully' });
  } catch (error: any) {
    console.error('Delete routine error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 