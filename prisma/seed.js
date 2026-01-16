const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@igaming-network.com' },
    update: {},
    create: {
      email: 'admin@igaming-network.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'approved',
    },
  });

  // Create affiliate manager
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@igaming-network.com' },
    update: {},
    create: {
      email: 'manager@igaming-network.com',
      password: managerPassword,
      firstName: 'John',
      lastName: 'Manager',
      role: 'manager',
      status: 'approved',
      skype: 'john.manager',
      telegram: '@johnmanager',
    },
  });

  // Create demo affiliate
  const affiliatePassword = await bcrypt.hash('demo123', 10);
  const affiliate = await prisma.user.upsert({
    where: { email: 'demo@affiliate.com' },
    update: {},
    create: {
      email: 'demo@affiliate.com',
      password: affiliatePassword,
      firstName: 'Demo',
      lastName: 'Affiliate',
      role: 'affiliate',
      status: 'approved',
      company: 'Demo Marketing LLC',
      website: 'https://demo-affiliate.com',
      affiliateId: 'AFF-001',
      referralCode: 'DEMO2024',
    },
  });

  // Create sample offers
  const offers = [
    {
      name: 'BetKing Casino',
      description: 'BetKing is a premier online casino offering over 3,000 slot games, live dealer tables, and sports betting. Licensed and regulated with 24/7 customer support. High converting landing pages and dedicated affiliate support.',
      shortDescription: 'Premium online casino with 3000+ games and sports betting',
      category: 'casino',
      advertiser: 'BetKing Ltd',
      previewUrl: 'https://betking-demo.com',
      thumbnailUrl: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400',
      payoutType: 'CPA',
      payoutAmount: 150,
      currency: 'USD',
      geoTargets: JSON.stringify(['US', 'CA', 'GB', 'AU', 'DE', 'NL']),
      deviceTargets: JSON.stringify(['desktop', 'mobile', 'tablet']),
      trafficTypes: JSON.stringify(['search', 'social', 'native', 'display']),
      restrictions: 'No incentivized traffic. No brand bidding.',
      status: 'active',
      featured: true,
      exclusive: false,
      requiresApproval: true,
      conversionRate: 4.2,
      epc: 2.85,
      managerId: manager.id,
    },
    {
      name: 'SportsBet Pro',
      description: 'Leading sports betting platform with competitive odds on all major sports leagues. Live betting, cash-out features, and mobile app. Strong brand recognition and high player lifetime value.',
      shortDescription: 'Sports betting with live odds on all major leagues',
      category: 'sports-betting',
      advertiser: 'SportsBet International',
      previewUrl: 'https://sportsbet-demo.com',
      thumbnailUrl: 'https://images.unsplash.com/photo-1461896836934- voices?w=400',
      payoutType: 'RevShare',
      revSharePercent: 35,
      currency: 'USD',
      geoTargets: JSON.stringify(['US', 'CA', 'GB', 'AU', 'NZ']),
      deviceTargets: JSON.stringify(['desktop', 'mobile']),
      trafficTypes: JSON.stringify(['search', 'social', 'email', 'native']),
      restrictions: 'No pop traffic. Quality traffic only.',
      status: 'active',
      featured: true,
      exclusive: true,
      requiresApproval: true,
      conversionRate: 3.8,
      epc: 3.20,
      managerId: manager.id,
    },
    {
      name: 'LuckySpin Slots',
      description: 'Exciting slots-focused casino with progressive jackpots, daily bonuses, and VIP program. Easy registration process and multiple payment options. Great for slot enthusiasts.',
      shortDescription: 'Slots casino with progressive jackpots and daily bonuses',
      category: 'casino',
      advertiser: 'LuckySpin Gaming',
      previewUrl: 'https://luckyspin-demo.com',
      thumbnailUrl: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400',
      payoutType: 'Hybrid',
      payoutAmount: 75,
      revSharePercent: 25,
      currency: 'USD',
      geoTargets: JSON.stringify(['GB', 'DE', 'SE', 'NO', 'FI', 'NL']),
      deviceTargets: JSON.stringify(['mobile', 'tablet']),
      trafficTypes: JSON.stringify(['social', 'native', 'display']),
      restrictions: 'Mobile traffic preferred.',
      status: 'active',
      featured: false,
      exclusive: false,
      requiresApproval: true,
      conversionRate: 5.1,
      epc: 2.45,
      managerId: manager.id,
    },
    {
      name: 'PokerStars Elite',
      description: 'Premium poker network with tournaments, cash games, and sit-n-go options. Industry-leading software and massive player pool. High-value players with excellent retention.',
      shortDescription: 'Elite poker platform with tournaments and cash games',
      category: 'poker',
      advertiser: 'PokerStars Elite Ltd',
      previewUrl: 'https://pokerstars-elite-demo.com',
      thumbnailUrl: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=400',
      payoutType: 'CPA',
      payoutAmount: 200,
      currency: 'USD',
      geoTargets: JSON.stringify(['US', 'CA', 'GB', 'DE', 'FR', 'ES', 'IT']),
      deviceTargets: JSON.stringify(['desktop', 'mobile']),
      trafficTypes: JSON.stringify(['search', 'social', 'email']),
      restrictions: 'Experienced poker affiliates only.',
      status: 'active',
      featured: true,
      exclusive: true,
      requiresApproval: true,
      conversionRate: 2.9,
      epc: 4.50,
      managerId: manager.id,
    },
    {
      name: 'MegaLotto International',
      description: 'Play international lotteries online including Powerball, EuroMillions, and more. Secure ticket purchasing and automatic prize notifications. High conversion on lottery enthusiasts.',
      shortDescription: 'International lottery tickets online',
      category: 'lottery',
      advertiser: 'MegaLotto Inc',
      previewUrl: 'https://megalotto-demo.com',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400',
      payoutType: 'CPA',
      payoutAmount: 45,
      currency: 'USD',
      geoTargets: JSON.stringify(['US', 'CA', 'AU', 'NZ', 'GB']),
      deviceTargets: JSON.stringify(['desktop', 'mobile', 'tablet']),
      trafficTypes: JSON.stringify(['search', 'display', 'email']),
      restrictions: 'No misleading claims about winning odds.',
      status: 'active',
      featured: false,
      exclusive: false,
      requiresApproval: false,
      conversionRate: 6.2,
      epc: 1.95,
      managerId: manager.id,
    },
    {
      name: 'ESports Bet Arena',
      description: 'Dedicated esports betting platform covering CS2, Dota 2, League of Legends, Valorant, and more. Live streaming integration and competitive odds. Perfect for gaming audience.',
      shortDescription: 'Esports betting on CS2, Dota 2, LoL, and more',
      category: 'esports',
      advertiser: 'ESports Bet Ltd',
      previewUrl: 'https://esports-arena-demo.com',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
      payoutType: 'RevShare',
      revSharePercent: 40,
      currency: 'USD',
      geoTargets: JSON.stringify(['US', 'CA', 'GB', 'DE', 'SE', 'DK', 'KR', 'JP']),
      deviceTargets: JSON.stringify(['desktop', 'mobile']),
      trafficTypes: JSON.stringify(['social', 'native', 'display']),
      restrictions: 'Gaming/esports content creators preferred.',
      status: 'active',
      featured: true,
      exclusive: false,
      requiresApproval: true,
      conversionRate: 4.8,
      epc: 3.75,
      managerId: manager.id,
    },
    {
      name: 'Royal Casino VIP',
      description: 'Luxury online casino targeting high rollers with exclusive bonuses, personal account managers, and premium game selection. Higher payouts for quality VIP traffic.',
      shortDescription: 'VIP casino for high rollers with exclusive bonuses',
      category: 'casino',
      advertiser: 'Royal Gaming Group',
      previewUrl: 'https://royal-vip-demo.com',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
      payoutType: 'CPA',
      payoutAmount: 350,
      currency: 'USD',
      geoTargets: JSON.stringify(['GB', 'DE', 'CH', 'AT', 'AE', 'SG']),
      deviceTargets: JSON.stringify(['desktop']),
      trafficTypes: JSON.stringify(['search', 'email']),
      restrictions: 'Premium traffic sources only. Minimum $1000 FTD required.',
      status: 'active',
      featured: false,
      exclusive: true,
      requiresApproval: true,
      conversionRate: 1.8,
      epc: 5.60,
      managerId: manager.id,
    },
    {
      name: 'QuickBet Mobile',
      description: 'Mobile-first betting app with quick bet features, instant deposits, and fast withdrawals. Optimized for casual bettors with simple interface. Great for mobile traffic.',
      shortDescription: 'Mobile-first betting app with instant deposits',
      category: 'sports-betting',
      advertiser: 'QuickBet Technologies',
      previewUrl: 'https://quickbet-demo.com',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
      payoutType: 'CPA',
      payoutAmount: 85,
      currency: 'USD',
      geoTargets: JSON.stringify(['US', 'CA', 'AU', 'GB', 'IE']),
      deviceTargets: JSON.stringify(['mobile']),
      trafficTypes: JSON.stringify(['social', 'native', 'push']),
      restrictions: 'Mobile traffic only.',
      status: 'active',
      featured: false,
      exclusive: false,
      requiresApproval: true,
      conversionRate: 5.5,
      epc: 2.30,
      managerId: manager.id,
    },
  ];

  for (const offer of offers) {
    await prisma.offer.create({ data: offer });
  }

  // Create some demo stats
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    await prisma.dailyStats.create({
      data: {
        userId: affiliate.id,
        date: date,
        clicks: Math.floor(Math.random() * 500) + 100,
        conversions: Math.floor(Math.random() * 20) + 5,
        revenue: parseFloat((Math.random() * 2000 + 500).toFixed(2)),
        payout: parseFloat((Math.random() * 1500 + 300).toFixed(2)),
      },
    });
  }

  console.log('Database seeded successfully!');
  console.log('');
  console.log('Demo Accounts:');
  console.log('  Admin: admin@igaming-network.com / admin123');
  console.log('  Manager: manager@igaming-network.com / manager123');
  console.log('  Affiliate: demo@affiliate.com / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
