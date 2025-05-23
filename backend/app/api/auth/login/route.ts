import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import { z } from 'zod';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    console.log('Starting login process...');
    await connectDB();
    
    const body = await request.json();
    console.log('Received login request for email:', body.email);
    
    const validation = loginSchema.safeParse(body);
    
    if (!validation.success) {
      console.log('Validation failed:', validation.error.issues);
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    console.log('Searching for user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('User found, verifying password...');

    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('Password verified successfully');

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
        role: user.role,
        weight: user.weight,
        height: user.height
      },
      token,
    };

    console.log('Login successful for user:', user.email);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 