import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const conversations = db.conversation.findMany({
      where: {
        participants: { some: { userId: session.id } },
      },
      include: {
        participants: true,
        messages: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const conversationsWithUnread = conversations.map((conv) => {
      const unreadCount = db.message.count({
        where: {
          conversationId: conv.id,
          receiverId: session.id,
          read: false,
        },
      });

      return {
        ...conv,
        unreadCount,
        otherParticipants: conv.participants
          ?.filter((p) => p.userId !== session.id)
          .map((p) => p.user),
      };
    });

    return NextResponse.json({ conversations: conversationsWithUnread });
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

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

    if (conversationId) {
      const conversation = db.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      const message = db.message.create({
        data: {
          conversationId,
          senderId: session.id,
          content,
        },
      });

      db.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date().toISOString() },
      });

      return NextResponse.json({ message });
    }

    if (!recipientId || !subject || !content) {
      return NextResponse.json(
        { error: 'Recipient, subject, and content are required' },
        { status: 400 }
      );
    }

    const recipient = db.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    const conversation = db.conversation.create({
      data: {
        subject,
        participantIds: [session.id, recipientId],
      },
    });

    const message = db.message.create({
      data: {
        conversationId: conversation.id,
        senderId: session.id,
        receiverId: recipientId,
        content,
      },
    });

    return NextResponse.json({
      conversation: { ...conversation, messages: [message] },
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
