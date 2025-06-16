import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import prisma from '../../../prisma/prisma';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { serialize } from 'cookie';


export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'username and password are required' }, { status: 400 });
  }

  try {
    // Fetch the user by username
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate the JWT and set cookies as needed
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60, // 1-hour expiration
    };

    const cookiesHeader = serialize('authToken', token, cookieOptions);
 
    const response = NextResponse.json({ success: true, message: 'Login successful!' });
    response.headers.append('Set-Cookie', cookiesHeader);
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}

/**
 * User Submits Login Form:
The login function (POST request) is triggered immediately when the user submits their username and password.
Login Function Handles Everything:

The login function verifies the user's credentials (username and password).
If the credentials are correct, it generates a JWT token, stores it as an HTTP-only cookie, and creates a session if needed.

It then redirects the user directly to the dashboard.
 */