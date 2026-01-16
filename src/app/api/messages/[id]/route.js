import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

// Get conversation messages
export async function GET(request, { params }) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                email: true,
                skype: true,
                telegram: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some(
      (p) => p.userId === session.id
    );

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Not authorized to view this conversation' },
        { status: 403 }
      );
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: session.id },
        read: false,
      },
      data: {
        read: true,
      },
    });

    // Update last read timestamp
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId: id,
        userId: session.id,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return NextResponse.json({
      conversation,
      otherParticipants: conversation.participants
        .filter((p) => p.userId !== session.id)
        .map((p) => p.user),
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}
