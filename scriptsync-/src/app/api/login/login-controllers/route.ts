
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import prisma from '../../../../../prisma/prisma';
import bcrypt from 'bcryptjs';
import cookie from 'cookie';



export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  try {
    // Fetch the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
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


    const cookiesHeader = cookie.serialize('authToken', token, cookieOptions);
 
    const response = NextResponse.redirect('/dashboard');
    response.headers.append('Set-Cookie', cookiesHeader);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}

/**
 * User Submits Login Form:

The login function (POST request) is triggered immediately when the user submits their email and password.
Login Function Handles Everything:

The login function verifies the user’s credentials (email and password).
If the credentials are correct, it generates a JWT token, stores it as an HTTP-only cookie, and creates a session if needed.

It then redirects the user directly to the dashboard.
 */