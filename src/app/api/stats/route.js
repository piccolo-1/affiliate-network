import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import everflow from '@/lib/everflow';

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
    const range = searchParams.get('range') || '30';
    const days = parseInt(range);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get user for affiliate ID
    const user = db.user.findUnique({
      where: { id: session.id },
    });

    const affiliateId = user?.affiliateId || session.id;

    // Try to get stats from Everflow first, fallback to local
    let dailyStats = [];
    let totals = { clicks: 0, conversions: 0, revenue: 0, payout: 0 };

    const hasEverflowConfig = process.env.EVERFLOW_API_KEY &&
      process.env.EVERFLOW_API_KEY !== 'demo-api-key';

    if (hasEverflowConfig) {
      try {
        const everflowStats = await everflow.getDailyStats(
          affiliateId,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );

        if (everflowStats && everflowStats.data) {
          dailyStats = everflowStats.data.map(day => ({
            date: day.date,
            clicks: day.total_click || 0,
            conversions: day.cv || 0,
            revenue: day.revenue || 0,
            payout: day.payout || 0,
          }));

          totals = dailyStats.reduce(
            (acc, day) => ({
              clicks: acc.clicks + day.clicks,
              conversions: acc.conversions + day.conversions,
              revenue: acc.revenue + day.revenue,
              payout: acc.payout + day.payout,
            }),
            { clicks: 0, conversions: 0, revenue: 0, payout: 0 }
          );
        }
      } catch (error) {
        console.error('Everflow stats fetch failed, using local data:', error);
      }
    }

    // Fallback to local database stats
    if (dailyStats.length === 0) {
      const localStats = db.dailyStats.findMany({
        where: {
          userId: session.id,
          date: { gte: startDate.toISOString() },
        },
        orderBy: { date: 'asc' },
      });

      dailyStats = localStats.map(day => ({
        date: day.date.split('T')[0],
        clicks: day.clicks || 0,
        conversions: day.conversions || 0,
        revenue: day.revenue || 0,
        payout: day.payout || 0,
      }));

      totals = dailyStats.reduce(
        (acc, day) => ({
          clicks: acc.clicks + day.clicks,
          conversions: acc.conversions + day.conversions,
          revenue: acc.revenue + day.revenue,
          payout: acc.payout + day.payout,
        }),
        { clicks: 0, conversions: 0, revenue: 0, payout: 0 }
      );
    }

    const avgConversionRate = totals.clicks > 0
      ? ((totals.conversions / totals.clicks) * 100).toFixed(2)
      : 0;
    const avgEpc = totals.clicks > 0
      ? (totals.payout / totals.clicks).toFixed(2)
      : 0;

    const approvedOffers = db.offerApplication.count({
      where: { userId: session.id, status: 'approved' },
    });

    return NextResponse.json({
      dailyStats,
      totals,
      metrics: {
        conversionRate: avgConversionRate,
        epc: avgEpc,
        approvedOffers,
      },
      source: hasEverflowConfig && dailyStats.length > 0 ? 'everflow' : 'local',
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
