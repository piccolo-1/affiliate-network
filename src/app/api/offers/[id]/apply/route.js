import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { notes } = body;

    // Check if user is approved
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (user.status !== 'approved') {
      return NextResponse.json(
        { error: 'Your account must be approved before applying to offers' },
        { status: 403 }
      );
    }

    // Check if offer exists
    const offer = await prisma.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Check if already applied
    const existingApplication = await prisma.offerApplication.findUnique({
      where: {
        userId_offerId: {
          userId: session.id,
          offerId: id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this offer' },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.offerApplication.create({
      data: {
        userId: session.id,
        offerId: id,
        notes,
        status: offer.requiresApproval ? 'pending' : 'approved',
        trackingLink: offer.requiresApproval ? null : generateTrackingLink(user.affiliateId || user.id, offer.id),
      },
    });

    // Create notification for manager
    if (offer.managerId) {
      await prisma.notification.create({
        data: {
          userId: offer.managerId,
          type: 'application',
          title: 'New Offer Application',
          content: `${user.firstName} ${user.lastName} has applied to ${offer.name}`,
          link: `/manager/applications/${application.id}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      application,
      message: offer.requiresApproval
        ? 'Application submitted. Pending approval.'
        : 'Application approved. You can now promote this offer.',
    });
  } catch (error) {
    console.error('Apply to offer error:', error);
    return NextResponse.json(
      { error: 'Failed to apply to offer' },
      { status: 500 }
    );
  }
}

function generateTrackingLink(affiliateId, offerId) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/track?aff=${affiliateId}&offer=${offerId}`;
}
