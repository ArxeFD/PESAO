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

export async function GET(request: Request) {
  try {
    const db = await connectDB();
    const headersList = headers();
    const userId = await getUserIdFromToken(headersList.get('authorization'));

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const active = searchParams.get('active');

    const options = {
      page,
      limit,
      active: active ? active === 'true' : undefined,
    };

    const { routines, total } = await db.findRoutinesByUserId(userId, options);

    return NextResponse.json({
      routines,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Fetch routines error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectDB();
    const headersList = headers();
    const userId = await getUserIdFromToken(headersList.get('authorization'));

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
      active: validation.data.active ?? true,
    };

    const routine = await db.createRoutine(routineData);

    return NextResponse.json(routine, { status: 201 });
  } catch (error: any) {
    console.error('Create routine error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 