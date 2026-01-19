import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

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

    const conversation = db.conversation.findUnique({
      where: { id },
      include: {
        participants: true,
        messages: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const isParticipant = (conversation.participantIds || []).includes(session.id);

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Not authorized to view this conversation' },
        { status: 403 }
      );
    }

    db.message.updateMany({
      where: {
        conversationId: id,
        receiverId: session.id,
      },
      data: { read: true },
    });

    return NextResponse.json({
      conversation,
      otherParticipants: conversation.participants
        ?.filter((p) => p.userId !== session.id)
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
