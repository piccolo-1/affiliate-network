import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
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

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30'; // days
    const days = parseInt(range);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get daily stats
    const dailyStats = await prisma.dailyStats.findMany({
      where: {
        userId: session.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Calculate totals
    const totals = dailyStats.reduce(
      (acc, day) => ({
        clicks: acc.clicks + day.clicks,
        conversions: acc.conversions + day.conversions,
        revenue: acc.revenue + day.revenue,
        payout: acc.payout + day.payout,
      }),
      { clicks: 0, conversions: 0, revenue: 0, payout: 0 }
    );

    // Calculate averages
    const avgConversionRate = totals.clicks > 0
      ? ((totals.conversions / totals.clicks) * 100).toFixed(2)
      : 0;
    const avgEpc = totals.clicks > 0
      ? (totals.payout / totals.clicks).toFixed(2)
      : 0;

    // Get approved offers count
    const approvedOffers = await prisma.offerApplication.count({
      where: {
        userId: session.id,
        status: 'approved',
      },
    });

    return NextResponse.json({
      dailyStats: dailyStats.map(day => ({
        date: day.date.toISOString().split('T')[0],
        clicks: day.clicks,
        conversions: day.conversions,
        revenue: day.revenue,
        payout: day.payout,
      })),
      totals,
      metrics: {
        conversionRate: avgConversionRate,
        epc: avgEpc,
        approvedOffers,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
