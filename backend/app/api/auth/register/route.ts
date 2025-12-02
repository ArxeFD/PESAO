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
  weight: z.number().min(0).optional(),
  height: z.number().min(0).optional()
});

// CORS headers - including Pragma and Expires
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma, Expires',
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    console.log('🎯 === REGISTER REQUEST RECEIVED ===');
    console.log('📍 Timestamp:', new Date().toISOString());

    await connectDB();
    console.log('✅ Database connected successfully');

    const body = await request.json();
    console.log('📦 Request body received:', {
      name: body.name,
      email: body.email,
      hasPassword: !!body.password,
      weight: body.weight,
      height: body.height
    });

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      console.log('❌ Validation failed:', validation.error.issues);
      return NextResponse.json(
        { error: 'Invalid input data', details: validation.error.issues },
        { status: 400, headers: corsHeaders }
      );
    }
    console.log('✅ Validation passed');

    const { name, email, password, weight, height } = validation.data;

    // Check if user already exists
    console.log('🔍 Checking if user already exists...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ User already exists with email:', email);
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400, headers: corsHeaders }
      );
    }
    console.log('✅ User does not exist, proceeding with registration');

    // Create new user
    console.log('📝 Creating new user...');
    const user = new User({
      name,
      email,
      password, // Will be hashed by the pre-save hook
      role: 'user',
      weight,
      height,
    });

    await user.save();
    console.log('✅ User saved successfully, ID:', user._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('✅ JWT token generated');

    const response = {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        weight: user.weight,
        height: user.height,
      },
      token,
    };

    console.log('🎉 Registration successful for user:', user.email);
    return NextResponse.json(response, { headers: corsHeaders });
  } catch (error: any) {
    console.error('💥 REGISTRATION ERROR:');
    console.error('   - Error name:', error.name);
    console.error('   - Error message:', error.message);
    console.error('   - Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}