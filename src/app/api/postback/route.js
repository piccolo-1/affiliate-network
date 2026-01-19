import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Postback endpoint for conversion tracking
// Called by advertisers when a conversion occurs
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const affiliateId = searchParams.get('aff') || searchParams.get('affiliate_id');
  const offerId = searchParams.get('offer') || searchParams.get('offer_id');
  const payout = parseFloat(searchParams.get('payout') || searchParams.get('amount') || '0');
  const revenue = parseFloat(searchParams.get('revenue') || '0');
  const transactionId = searchParams.get('txn') || searchParams.get('transaction_id') || '';
  const status = searchParams.get('status') || 'approved';

  if (!affiliateId || !offerId) {
    return NextResponse.json(
      { error: 'Missing required parameters (aff, offer)' },
      { status: 400 }
    );
  }

  try {
    // Find user
    const user = db.user.findUnique({
      where: { affiliateId: affiliateId },
    }) || db.user.findUnique({
      where: { id: affiliateId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      );
    }

    // Update daily stats
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
        data: {
          conversions: existingStat.conversions + 1,
          payout: existingStat.payout + payout,
          revenue: existingStat.revenue + revenue,
        },
      });
    } else {
      db.dailyStats.create({
        data: {
          userId: user.id,
          offerId: offerId,
          affiliateId: affiliateId,
          date: new Date().toISOString(),
          clicks: 0,
          conversions: 1,
          revenue: revenue,
          payout: payout,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Conversion recorded',
      data: {
        affiliateId,
        offerId,
        payout,
        revenue,
        transactionId,
        status,
      },
    });
  } catch (error) {
    console.error('Postback error:', error);
    return NextResponse.json(
      { error: 'Failed to record conversion' },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export async function POST(request) {
  try {
    const body = await request.json();

    const affiliateId = body.aff || body.affiliate_id;
    const offerId = body.offer || body.offer_id;
    const payout = parseFloat(body.payout || body.amount || '0');
    const revenue = parseFloat(body.revenue || '0');

    if (!affiliateId || !offerId) {
      return NextResponse.json(
        { error: 'Missing required parameters (aff, offer)' },
        { status: 400 }
      );
    }

    // Find user
    const user = db.user.findUnique({
      where: { affiliateId: affiliateId },
    }) || db.user.findUnique({
      where: { id: affiliateId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Affiliate not found' },
        { status: 404 }
      );
    }

    // Update daily stats
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
        data: {
          conversions: existingStat.conversions + 1,
          payout: existingStat.payout + payout,
          revenue: existingStat.revenue + revenue,
        },
      });
    } else {
      db.dailyStats.create({
        data: {
          userId: user.id,
          offerId: offerId,
          affiliateId: affiliateId,
          date: new Date().toISOString(),
          clicks: 0,
          conversions: 1,
          revenue: revenue,
          payout: payout,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Conversion recorded',
    });
  } catch (error) {
    console.error('Postback error:', error);
    return NextResponse.json(
      { error: 'Failed to record conversion' },
      { status: 500 }
    );
  }
}
