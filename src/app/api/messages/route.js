import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

// Get all conversations for user
export async function GET(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Get unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: session.id },
            read: false,
          },
        });

        return {
          ...conv,
          unreadCount,
          otherParticipants: conv.participants
            .filter((p) => p.userId !== session.id)
            .map((p) => p.user),
        };
      })
    );

    return NextResponse.json({ conversations: conversationsWithUnread });
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// Create new conversation / Send message
export async function POST(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { recipientId, subject, content, conversationId } = body;

    // If conversationId provided, add message to existing conversation
    if (conversationId) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          participants: true,
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
          { error: 'Not authorized to post in this conversation' },
          { status: 403 }
        );
      }

      const message = await prisma.message.create({
        data: {
          conversationId,
          senderId: session.id,
          content,
        },
      });

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      // Create notification for other participants
      const otherParticipants = conversation.participants.filter(
        (p) => p.userId !== session.id
      );

      for (const participant of otherParticipants) {
        await prisma.notification.create({
          data: {
            userId: participant.userId,
            type: 'message',
            title: 'New Message',
            content: `You have a new message in "${conversation.subject}"`,
            link: `/dashboard/messages/${conversationId}`,
          },
        });
      }

      return NextResponse.json({ message });
    }

    // Create new conversation
    if (!recipientId || !subject || !content) {
      return NextResponse.json(
        { error: 'Recipient, subject, and content are required' },
        { status: 400 }
      );
    }

    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Create conversation with message
    const conversation = await prisma.conversation.create({
      data: {
        subject,
        participants: {
          create: [
            { userId: session.id },
            { userId: recipientId },
          ],
        },
        messages: {
          create: {
            senderId: session.id,
            receiverId: recipientId,
            content,
          },
        },
      },
      include: {
        messages: true,
        participants: {
          include: {
            user: {
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

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'message',
        title: 'New Message',
        content: `You have a new message: "${subject}"`,
        link: `/dashboard/messages/${conversation.id}`,
      },
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
