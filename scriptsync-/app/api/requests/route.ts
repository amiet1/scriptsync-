import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import prisma from '../../../prisma/prisma';

export async function POST(request: NextRequest) {
  try {
    const { recipientId, date, time, scriptId, senderId } = await request.json();

    if (!recipientId || !date || !time || !scriptId || !senderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newRequest = await prisma.request.create({
      data: {
        sender: {
          connect: { id: senderId }
        },
        recipient: {
          connect: { id: recipientId }
        },
        script: {
          connect: { id: scriptId }
        },
        date,
        time,
        status: 'pending'
      },
      include: {
        sender: true,
        recipient: true,
        script: true
      }
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}
