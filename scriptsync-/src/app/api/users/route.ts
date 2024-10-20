import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

interface UserData {
    username: string;
    email: string;
    password: string;
    id: number;
    location?: string ;
    age?: number;
    interests?: string;
    role?: string;
}

const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
   const users =  req.json() 
   await prisma.user.findMany();
    return NextResponse.json(users);
}

//create new user
export async function POST(req: NextRequest) {
const { username, email, password, role, location, age, interests }: UserData = await req.json() //extract user data
  const newUser = await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: password,
            location: location, 
            age: age,
            interests: interests,
            role: role
            
        },
    });
    return NextResponse.json(newUser, { status: 201 });
}

//update user info 
export async function PUT(req: NextRequest) {
   const { id, username, email, password }: UserData = await req.json();
    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            username,
            email,
            password,
        },
    });
    return NextResponse.json(updatedUser);
}


export async function DELETE(req: NextRequest) {
 const { id } = await req.json();
    await prisma.user.delete({
        where: { id },
    });
    return NextResponse.json({ message: 'User deleted successfully' });
}