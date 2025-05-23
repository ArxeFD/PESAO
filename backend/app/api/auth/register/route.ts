import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  weight: z.number().min(0),
  height: z.number().min(0)
});

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('Received registration request for email:', body.email);

    const validation = registerSchema.safeParse(body);
    
    if (!validation.success) {
      console.log('Validation error:', validation.error.issues);
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name, weight, height } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user with plain password
    // The User model's pre-save hook will handle the hashing
    const user = await User.create({
      email,
      password, // This will be hashed by the User model
      name,
      role: 'user',
      weight: Number(weight),
      height: Number(height)
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      weight: user.weight,
      height: user.height,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    console.log('User registered successfully:', userResponse.email);
    return NextResponse.json({ user: userResponse, token }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 