import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

// Get all managers (for messaging)
export async function GET(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const managers = await prisma.user.findMany({
      where: {
        role: { in: ['manager', 'admin'] },
        status: 'approved',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        skype: true,
        telegram: true,
        role: true,
      },
    });

    return NextResponse.json({ managers });
  } catch (error) {
    console.error('Get managers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch managers' },
      { status: 500 }
    );
  }
}
