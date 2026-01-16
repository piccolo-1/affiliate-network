import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            skype: true,
            telegram: true,
          },
        },
        creatives: true,
      },
    });

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Check if user has applied for this offer
    const session = await getSession();
    let application = null;

    if (session) {
      application = await prisma.offerApplication.findUnique({
        where: {
          userId_offerId: {
            userId: session.id,
            offerId: id,
          },
        },
      });
    }

    return NextResponse.json({
      offer,
      application,
    });
  } catch (error) {
    console.error('Get offer error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offer' },
      { status: 500 }
    );
  }
}
