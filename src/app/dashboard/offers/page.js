'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Gift,
  Copy,
  Check,
  ExternalLink,
  Search,
  Filter,
  Eye
} from 'lucide-react';

export default function MyOffersPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingLink = (appId, link) => {
    navigator.clipboard.writeText(link);
    setCopiedId(appId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const statusCounts = {
    all: applications.length,
    approved: applications.filter((a) => a.status === 'approved').length,
    pending: applications.filter((a) => a.status === 'pending').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/10 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="h-32 bg-white/10 rounded mb-4"></div>
              <div className="h-6 bg-white/10 rounded mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Offers</h1>
          <p className="text-gray-400">Manage your offer applications and tracking links</p>
        </div>
        <Link
          href="/offers"
          className="flex items-center gap-2 px-4 py-2 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg transition-colors"
        >
          <Gift className="w-5 h-5" />
          Browse More Offers
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'approved', label: 'Approved' },
          { value: 'pending', label: 'Pending' },
          { value: 'rejected', label: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'bg-gaming-accent text-white'
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {tab.label} ({statusCounts[tab.value]})
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      {filteredApplications.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Gift className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No offers found</h3>
          <p className="text-gray-400 mb-6">
            {filter === 'all'
              ? "You haven't applied to any offers yet"
              : `No ${filter} applications`}
          </p>
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg transition-colors"
          >
            Browse Offers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <div key={app.id} className="glass rounded-xl overflow-hidden card-hover">
              {/* Offer Header */}
              <div className="relative h-32 bg-gradient-to-br from-gaming-dark to-gaming-darker">
                {app.offer.thumbnailUrl ? (
                  <img
                    src={app.offer.thumbnailUrl}
                    alt={app.offer.name}
                    className="w-full h-full object-cover opacity-60"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    {getCategoryIcon(app.offer.category)}
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`badge ${
                    app.status === 'approved' ? 'badge-success' :
                    app.status === 'pending' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>

              {/* Offer Details */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{app.offer.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <span className="px-2 py-0.5 bg-white/10 rounded capitalize">
                    {app.offer.category.replace('-', ' ')}
                  </span>
                  <span className="text-gaming-gold font-medium">
                    {formatPayout(app.offer)}
                  </span>
                </div>

                {/* Tracking Link */}
                {app.status === 'approved' && app.trackingLink && (
                  <div className="mb-4">
                    <label className="block text-xs text-gray-400 mb-1">Tracking Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={app.trackingLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-xs truncate"
                      />
                      <button
                        onClick={() => copyTrackingLink(app.id, app.trackingLink)}
                        className="px-3 py-2 bg-gaming-accent hover:bg-gaming-accent/80 rounded transition-colors"
                      >
                        {copiedId === app.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/offers/${app.offer.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border border-white/20 hover:bg-white/10 rounded-lg text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Offer
                  </Link>
                  {app.status === 'approved' && app.trackingLink && (
                    <a
                      href={app.trackingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-2 border border-white/20 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Footer Info */}
              <div className="px-4 py-3 bg-white/5 text-xs text-gray-400 flex justify-between">
                <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                {app.updatedAt !== app.createdAt && (
                  <span>Updated: {new Date(app.updatedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
