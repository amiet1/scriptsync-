import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


interface UserData {
    username: string;
    email: string;
    password: string;
    id: number;
    location?: string;
    age?: number;
    interests?: string;
    role?: string;
}

const prisma = new PrismaClient();
export async function GET(request: Request) {

   const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

//create new user
export async function POST(request: Request) {
const { username, email, password, role, location, age, interests }: UserData = await request.json() //extract user data
  const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password,
            location,
            age,
            interests,
            role
            
        },
    });
    return NextResponse.json(newUser, { status: 201 });
}

//update user info 
export async function PUT(request: Request) {
   const { id, username, email, password }: UserData = await request.json();
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


export async function DELETE(request: Request) {
 const { id } = await request.json();
    await prisma.user.delete({
        where: { id },
    });
    return NextResponse.json({ message: 'User deleted successfully' });
}