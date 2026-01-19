import { NextResponse } from 'next/server';
import db from '@/lib/db';
import everflow from '@/lib/everflow';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const affiliateId = searchParams.get('aff');
  const offerId = searchParams.get('offer');
  const sub1 = searchParams.get('sub1') || '';
  const sub2 = searchParams.get('sub2') || '';
  const sub3 = searchParams.get('sub3') || '';

  if (!affiliateId || !offerId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Get offer details
    const offer = db.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Log click to local database
    const today = new Date().toISOString().split('T')[0];
    const existingStat = db.dailyStats.findUnique({
      where: {
        date_offerId_affiliateId: {
          date: today,
          offerId: offerId,
          affiliateId: affiliateId,
        },
      },
    });

    if (existingStat) {
      db.dailyStats.update({
        where: { id: existingStat.id },
        data: { clicks: existingStat.clicks + 1 },
      });
    } else {
      // Find user by affiliateId
      const user = db.user.findUnique({
        where: { affiliateId: affiliateId },
      }) || db.user.findUnique({
        where: { id: affiliateId },
      });

      if (user) {
        db.dailyStats.create({
          data: {
            userId: user.id,
            offerId: offerId,
            affiliateId: affiliateId,
            date: new Date().toISOString(),
            clicks: 1,
            conversions: 0,
            revenue: 0,
            payout: 0,
          },
        });
      }
    }

    // If Everflow is configured and offer has Everflow ID, redirect to Everflow
    const hasEverflowConfig = process.env.EVERFLOW_API_KEY &&
      process.env.EVERFLOW_API_KEY !== 'demo-api-key';

    if (hasEverflowConfig && offer.everflowOfferId) {
      const everflowUrl = await everflow.generateTrackingLink(
        affiliateId,
        offer.everflowOfferId,
        { subIds: { sub1, sub2, sub3 } }
      );
      return NextResponse.redirect(everflowUrl);
    }

    // Fallback: redirect to offer URL directly
    if (offer.url) {
      const redirectUrl = new URL(offer.url);
      redirectUrl.searchParams.set('aff', affiliateId);
      if (sub1) redirectUrl.searchParams.set('sub1', sub1);
      if (sub2) redirectUrl.searchParams.set('sub2', sub2);
      if (sub3) redirectUrl.searchParams.set('sub3', sub3);
      return NextResponse.redirect(redirectUrl.toString());
    }

    // If no URL, show offer details page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/offers/${offerId}`
    );
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Tracking failed' },
      { status: 500 }
    );
  }
}
