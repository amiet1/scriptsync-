// middleware.js
import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';


export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    // Redirect to login if the token is missing
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the JWT token
    const secret= process.env.JWT_SECRET
    if(!secret) throw new Error('secret not defined in env');
    jwt.verify(token, secret);
    // Token is valid; allow the request to continue
    return NextResponse.next();
  } catch (error) {
    // Token verification failed; redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Define routes to protect
export const config = {
  matcher: [ '/((?!login|public|api).*)'], // protects all info, can also protect whatever route that you want 
};

//verifying the session token in the cookie. If the token is valid, access is allowed; otherwise, the user is redirected to the login page.