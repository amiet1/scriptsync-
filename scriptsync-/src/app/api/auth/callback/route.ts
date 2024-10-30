import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prisma'; 
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  try {
    // Step 1: Verify the code
    const user = await verifyCodeAndFetchUser(code); 

    if (!user) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    // Step 2: Generate a JWT token for the session
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    // Step 3: Store the session in PostgreSQL
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1-hour expiration
      },
    });

    // Step 4: Set the token as an HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60, // 1-hour expiration
    });

    // Redirect to a protected page after successful login
    const redirectUrl = new URL('/dashboard', requestUrl.origin);
    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'An error occurred during authentication' }, { status: 500 });
  }
}

// Custom helper function for verifying the code and fetching the user
async function verifyCodeAndFetchUser(code: string) {
  // Adjust the verification logic as necessary
  const user = await prisma.user.findUnique({ where: { email: code } });
  return user;
}


//Handles authentication, creates a session, sets a JWT token in an HTTP-only cookie, and redirects the user to the intended page.