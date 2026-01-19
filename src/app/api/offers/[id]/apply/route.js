import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import everflow from '@/lib/everflow';

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

    // Check if user is approved
    const user = db.user.findUnique({
      where: { id: session.id },
    });

    if (!user || user.status !== 'approved') {
      return NextResponse.json(
        { error: 'Your account must be approved before applying to offers' },
        { status: 403 }
      );
    }

    // Check if offer exists
    const offer = db.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Check if already applied
    const existingApplication = db.offerApplication.findUnique({
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

    // Generate tracking link using Everflow integration
    const affiliateId = user.affiliateId || user.id;
    const trackingLink = await generateTrackingLink(affiliateId, offer);

    // Create application
    const application = db.offerApplication.create({
      data: {
        userId: session.id,
        offerId: id,
        status: offer.requiresApproval ? 'pending' : 'approved',
        trackingLink: trackingLink,
      },
    });

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

async function generateTrackingLink(affiliateId, offer) {
  const hasEverflowConfig = process.env.EVERFLOW_API_KEY &&
    process.env.EVERFLOW_API_KEY !== 'demo-api-key';

  // If Everflow is configured, use Everflow tracking
  if (hasEverflowConfig && offer.everflowOfferId) {
    try {
      return await everflow.generateTrackingLink(affiliateId, offer.everflowOfferId);
    } catch (error) {
      console.error('Everflow tracking link generation failed:', error);
      // Fall back to local tracking
    }
  }

  // Fallback to local tracking URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/track?aff=${affiliateId}&offer=${offer.id}`;
}
