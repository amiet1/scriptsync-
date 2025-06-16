import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';


interface UserData {
    username: string;
    email: string;
    hashedPassword: string;
    id: number;
    location?: string ;
    age?: number;
    interests?: string;
    role?: string;
}

const prisma = new PrismaClient();

export async function GET() {
   const users =  await prisma.user.findMany();
    return NextResponse.json(users);
}

//create new user
export async function POST(req: NextRequest) {
    const { username, email, password, role, location, age, interests } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        hashedPassword,
        ...(location) && ({location}), 
        ...(age) && ({age}),
        ...(interests) && ({interests}),
        ...(role) && ({role})
      },
    });
  
    return NextResponse.json(newUser, { status: 201 });
  }
//update user info 
export async function PUT(req: NextRequest) {
    const { id, username, email, password, location, age, interests, role } = await req.json();
  
    const dataToUpdate: any = {};
  
    if (username) dataToUpdate.username = username;
    if (email) dataToUpdate.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.hashedPassword = hashedPassword;
    }
    if (location) dataToUpdate.location = location;
    if (age) dataToUpdate.age = age;
    if (interests) dataToUpdate.interests = interests;
    if (role) dataToUpdate.role = role;
  
    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
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