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

    const allUsers = db.user.findMany();
    const managers = allUsers.filter(u =>
      (u.role === 'manager' || u.role === 'admin') && u.status === 'approved'
    );

    return NextResponse.json({
      managers: managers.map(m => ({
        id: m.id,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        skype: m.skype,
        telegram: m.telegram,
        role: m.role,
      })),
    });
  } catch (error) {
    console.error('Get managers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch managers' },
      { status: 500 }
    );
  }
}
