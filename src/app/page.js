'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  ChevronRight,
  Star,
  Globe,
  Zap,
  BarChart3,
  MessageSquare
} from 'lucide-react';

export default function HomePage() {
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedOffers();
  }, []);

  const fetchFeaturedOffers = async () => {
    try {
      const res = await fetch('/api/offers?featured=true&limit=4');
      const data = await res.json();
      setFeaturedOffers(data.offers || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Active Offers', value: '500+', icon: TrendingUp },
    { label: 'Total Payouts', value: '$50M+', icon: DollarSign },
    { label: 'Active Affiliates', value: '10,000+', icon: Users },
    { label: 'Countries', value: '150+', icon: Globe },
  ];

  const features = [
    {
      icon: DollarSign,
      title: 'Top Payouts',
      description: 'Industry-leading CPA rates and RevShare deals on premium iGaming brands.',
    },
    {
      icon: Zap,
      title: 'Instant Tracking',
      description: 'Real-time Everflow tracking with detailed conversion analytics.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Reporting',
      description: 'Comprehensive reports with sub-ID tracking and performance metrics.',
    },
    {
      icon: MessageSquare,
      title: 'Dedicated Support',
      description: 'Direct messaging with affiliate managers and 24/7 support.',
    },
    {
      icon: Shield,
      title: 'Trusted Brands',
      description: 'Only licensed, reputable iGaming operators in our network.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Offers available in 150+ countries with local payment options.',
    },
  ];

  const categories = [
    { name: 'Casino', count: 150, color: 'from-purple-500 to-pink-500' },
    { name: 'Sports Betting', count: 120, color: 'from-green-500 to-emerald-500' },
    { name: 'Poker', count: 45, color: 'from-blue-500 to-cyan-500' },
    { name: 'Lottery', count: 30, color: 'from-yellow-500 to-orange-500' },
    { name: 'Esports', count: 55, color: 'from-red-500 to-rose-500' },
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      'casino': '🎰',
      'sports-betting': '⚽',
      'poker': '🃏',
      'lottery': '🎟️',
      'esports': '🎮',
    };
    return icons[category] || '🎯';
  };

  const formatPayout = (offer) => {
    if (offer.payoutType === 'CPA') {
      return `$${offer.payoutAmount} CPA`;
    } else if (offer.payoutType === 'RevShare') {
      return `${offer.revSharePercent}% RevShare`;
    } else {
      return `$${offer.payoutAmount} + ${offer.revSharePercent}%`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gaming-accent to-gaming-gold rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">iG</span>
              </div>
              <span className="text-xl font-bold">iGaming Network</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/offers" className="text-gray-300 hover:text-white transition-colors">
                Offers
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-medium transition-colors btn-glow"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Premium iGaming</span>
            <br />
            Affiliate Network
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Access exclusive casino, sports betting, poker, and esports offers with
            industry-leading payouts. Powered by Everflow tracking for real-time analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-semibold text-lg transition-all btn-glow"
            >
              Start Earning Today
            </Link>
            <Link
              href="/offers"
              className="px-8 py-4 glass hover:bg-white/10 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              Browse Offers <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="glass rounded-xl p-6 text-center card-hover">
                <stat.icon className="w-8 h-8 text-gaming-accent mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Offer Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/offers?category=${category.name.toLowerCase().replace(' ', '-')}`}
                className="glass rounded-xl p-6 text-center card-hover group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform`}>
                  {getCategoryIcon(category.name.toLowerCase().replace(' ', '-'))}
                </div>
                <div className="font-semibold mb-1">{category.name}</div>
                <div className="text-sm text-gray-400">{category.count}+ Offers</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Offers Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Offers</h2>
            <Link
              href="/offers"
              className="text-gaming-accent hover:text-gaming-accent/80 flex items-center gap-2"
            >
              View All <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass rounded-xl p-6 animate-pulse">
                  <div className="h-40 bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-6 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredOffers.map((offer) => (
                <Link
                  key={offer.id}
                  href={`/offers/${offer.id}`}
                  className="glass rounded-xl overflow-hidden card-hover group"
                >
                  <div className="relative h-40 bg-gradient-to-br from-gaming-dark to-gaming-darker">
                    {offer.thumbnailUrl ? (
                      <img
                        src={offer.thumbnailUrl}
                        alt={offer.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {getCategoryIcon(offer.category)}
                      </div>
                    )}
                    {offer.exclusive && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-gaming-gold text-black text-xs font-bold rounded">
                        EXCLUSIVE
                      </span>
                    )}
                    {offer.featured && (
                      <Star className="absolute top-3 right-3 w-5 h-5 text-gaming-gold fill-gaming-gold" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-gaming-accent transition-colors">
                      {offer.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {offer.shortDescription || offer.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-gaming-gold font-bold">
                        {formatPayout(offer)}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {offer.category.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Choose Our Network?
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            We provide everything you need to succeed in iGaming affiliate marketing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass rounded-xl p-6 card-hover">
                <div className="w-12 h-12 bg-gaming-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gaming-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gaming-accent/20 to-gaming-gold/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of successful affiliates and start promoting premium iGaming brands today.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-semibold text-lg transition-all btn-glow"
          >
            Create Free Account <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gaming-accent to-gaming-gold rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold">iG</span>
                </div>
                <span className="text-xl font-bold">iGaming Network</span>
              </div>
              <p className="text-gray-400 text-sm">
                The leading affiliate network for iGaming offers. Premium brands, top payouts, dedicated support.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/offers" className="hover:text-white">Offers</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/offers?category=casino" className="hover:text-white">Casino</Link></li>
                <li><Link href="/offers?category=sports-betting" className="hover:text-white">Sports Betting</Link></li>
                <li><Link href="/offers?category=poker" className="hover:text-white">Poker</Link></li>
                <li><Link href="/offers?category=esports" className="hover:text-white">Esports</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/compliance" className="hover:text-white">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} iGaming Affiliate Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
