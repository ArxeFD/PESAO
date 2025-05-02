import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    const db = await connectDB();
    
    const body = await request.json();
    const validation = loginSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    const user = await db.findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response
    const response = {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 