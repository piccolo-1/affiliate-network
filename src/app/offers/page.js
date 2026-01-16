'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Star,
  ChevronRight,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  X
} from 'lucide-react';

export default function OffersPage() {
  const searchParams = useSearchParams();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    payoutType: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchOffers();
  }, [filters, pagination.page]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '12',
      });

      if (filters.category && filters.category !== 'all') {
        params.set('category', filters.category);
      }
      if (filters.payoutType) {
        params.set('payoutType', filters.payoutType);
      }
      if (filters.search) {
        params.set('search', filters.search);
      }

      const res = await fetch(`/api/offers?${params.toString()}`);
      const data = await res.json();

      setOffers(data.offers || []);
      setPagination(prev => ({
        ...prev,
        totalPages: data.pagination?.totalPages || 1,
        total: data.pagination?.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'casino', label: 'Casino' },
    { value: 'sports-betting', label: 'Sports Betting' },
    { value: 'poker', label: 'Poker' },
    { value: 'lottery', label: 'Lottery' },
    { value: 'esports', label: 'Esports' },
  ];

  const payoutTypes = [
    { value: '', label: 'All Payout Types' },
    { value: 'CPA', label: 'CPA' },
    { value: 'RevShare', label: 'RevShare' },
    { value: 'Hybrid', label: 'Hybrid' },
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

  const parseGeoTargets = (geoTargets) => {
    try {
      return JSON.parse(geoTargets);
    } catch {
      return [];
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
              <Link href="/offers" className="text-white font-medium">
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
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-medium transition-colors"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Offer Marketplace</h1>
            <p className="text-gray-400">
              Browse {pagination.total} premium iGaming offers from trusted brands
            </p>
          </div>

          {/* Search and Filters */}
          <div className="glass rounded-xl p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gaming-accent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gaming-accent cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-gaming-dark">
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Payout Type Filter */}
              <select
                value={filters.payoutType}
                onChange={(e) => handleFilterChange('payoutType', e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gaming-accent cursor-pointer"
              >
                {payoutTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-gaming-dark">
                    {type.label}
                  </option>
                ))}
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-3 glass rounded-lg"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Active Filters */}
            {(filters.category !== 'all' || filters.payoutType || filters.search) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                {filters.search && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-gaming-accent/20 rounded-full text-sm">
                    Search: {filters.search}
                    <button onClick={() => handleFilterChange('search', '')}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.category !== 'all' && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-gaming-accent/20 rounded-full text-sm">
                    {categories.find(c => c.value === filters.category)?.label}
                    <button onClick={() => handleFilterChange('category', 'all')}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.payoutType && (
                  <span className="flex items-center gap-2 px-3 py-1 bg-gaming-accent/20 rounded-full text-sm">
                    {filters.payoutType}
                    <button onClick={() => handleFilterChange('payoutType', '')}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Offers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="glass rounded-xl p-4 animate-pulse">
                  <div className="h-40 bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-6 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-white/10 rounded"></div>
                </div>
              ))}
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">No offers found</h3>
              <p className="text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {offers.map((offer) => (
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

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-gaming-accent transition-colors">
                        {offer.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {offer.shortDescription || offer.description}
                      </p>

                      {/* Geo Targets */}
                      <div className="flex items-center gap-1 mb-3 text-xs text-gray-500">
                        <Globe className="w-4 h-4" />
                        <span>{parseGeoTargets(offer.geoTargets).slice(0, 5).join(', ')}</span>
                        {parseGeoTargets(offer.geoTargets).length > 5 && (
                          <span>+{parseGeoTargets(offer.geoTargets).length - 5}</span>
                        )}
                      </div>

                      {/* Payout and Category */}
                      <div className="flex justify-between items-center">
                        <span className="text-gaming-gold font-bold">
                          {formatPayout(offer)}
                        </span>
                        <span className="text-xs px-2 py-1 bg-white/10 rounded capitalize">
                          {offer.category.replace('-', ' ')}
                        </span>
                      </div>

                      {/* EPC and CR */}
                      {(offer.epc || offer.conversionRate) && (
                        <div className="flex gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
                          {offer.epc && <span>EPC: ${offer.epc}</span>}
                          {offer.conversionRate && <span>CR: {offer.conversionRate}%</span>}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 glass rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} iGaming Affiliate Network. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
