'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  User
} from 'lucide-react';

export default function OfferDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [offer, setOffer] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchOffer();
    checkAuth();
  }, [id]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      // Not logged in
    }
  };

  const fetchOffer = async () => {
    try {
      const res = await fetch(`/api/offers/${id}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to load offer');
        return;
      }

      setOffer(data.offer);
      setApplication(data.application);
    } catch (error) {
      setError('Failed to load offer');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setApplying(true);
    setError('');

    try {
      const res = await fetch(`/api/offers/${id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to apply');
        return;
      }

      setApplication(data.application);
    } catch (error) {
      setError('Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const copyTrackingLink = () => {
    if (application?.trackingLink) {
      navigator.clipboard.writeText(application.trackingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
      return `$${offer.payoutAmount} CPA + ${offer.revSharePercent}% RevShare`;
    }
  };

  const parseJson = (json) => {
    try {
      return JSON.parse(json) || [];
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gaming-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error && !offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/offers" className="text-gaming-accent hover:underline">
            Back to Offers
          </Link>
        </div>
      </div>
    );
  }

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

            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-5 py-2 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-medium transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-medium transition-colors"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Offers
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-gaming-dark to-gaming-darker">
                  {offer.thumbnailUrl ? (
                    <img
                      src={offer.thumbnailUrl}
                      alt={offer.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">
                      {getCategoryIcon(offer.category)}
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {offer.exclusive && (
                      <span className="px-3 py-1 bg-gaming-gold text-black text-sm font-bold rounded">
                        EXCLUSIVE
                      </span>
                    )}
                    {offer.featured && (
                      <span className="px-3 py-1 bg-gaming-accent text-white text-sm font-bold rounded flex items-center gap-1">
                        <Star className="w-4 h-4 fill-white" /> FEATURED
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{offer.name}</h1>
                      <p className="text-gray-400">by {offer.advertiser}</p>
                    </div>
                    <span className="px-3 py-1 bg-white/10 rounded-lg capitalize text-sm">
                      {offer.category.replace('-', ' ')}
                    </span>
                  </div>

                  <p className="text-gray-300 leading-relaxed">{offer.description}</p>

                  {offer.previewUrl && (
                    <a
                      href={offer.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-gaming-accent hover:underline"
                    >
                      Preview Offer <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Targeting Info */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Targeting</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* GEO Targets */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Geo Targets
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {parseJson(offer.geoTargets).map((geo, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 rounded text-sm">
                          {geo}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Device Targets */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Device Targets</h3>
                    <div className="flex gap-4">
                      {parseJson(offer.deviceTargets).map((device, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          {device === 'desktop' && <Monitor className="w-4 h-4" />}
                          {device === 'mobile' && <Smartphone className="w-4 h-4" />}
                          {device === 'tablet' && <Tablet className="w-4 h-4" />}
                          <span className="capitalize">{device}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Traffic Types */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Allowed Traffic</h3>
                    <div className="flex flex-wrap gap-2">
                      {parseJson(offer.trafficTypes).map((type, i) => (
                        <span key={i} className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm capitalize">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Restrictions */}
                  {offer.restrictions && (
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-400 mb-3">Restrictions</h3>
                      <p className="text-red-400 text-sm">{offer.restrictions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payout Card */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Payout</h2>
                <div className="text-3xl font-bold text-gaming-gold mb-4">
                  {formatPayout(offer)}
                </div>

                <div className="space-y-3 mb-6">
                  {offer.epc && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">EPC</span>
                      <span>${offer.epc}</span>
                    </div>
                  )}
                  {offer.conversionRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Conversion Rate</span>
                      <span>{offer.conversionRate}%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Currency</span>
                    <span>{offer.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Approval</span>
                    <span>{offer.requiresApproval ? 'Required' : 'Auto-approve'}</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Application Status */}
                {application ? (
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg text-center ${
                      application.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      application.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      Status: <span className="font-semibold capitalize">{application.status}</span>
                    </div>

                    {application.status === 'approved' && application.trackingLink && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Your Tracking Link
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={application.trackingLink}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                          />
                          <button
                            onClick={copyTrackingLink}
                            className="px-3 py-2 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg transition-colors"
                          >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full py-3 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-semibold transition-all btn-glow disabled:opacity-50"
                  >
                    {applying ? 'Applying...' : user ? 'Apply to Promote' : 'Login to Apply'}
                  </button>
                )}
              </div>

              {/* Manager Card */}
              {offer.manager && (
                <div className="glass rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Affiliate Manager</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gaming-accent/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gaming-accent" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {offer.manager.firstName} {offer.manager.lastName}
                      </div>
                      <div className="text-sm text-gray-400">Affiliate Manager</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    {offer.manager.skype && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <span>Skype:</span>
                        <span className="text-white">{offer.manager.skype}</span>
                      </div>
                    )}
                    {offer.manager.telegram && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <span>Telegram:</span>
                        <span className="text-white">{offer.manager.telegram}</span>
                      </div>
                    )}
                  </div>

                  {user && (
                    <Link
                      href={`/dashboard/messages/new?to=${offer.manager.id}&subject=Question about ${offer.name}`}
                      className="flex items-center justify-center gap-2 w-full py-2 border border-white/20 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send Message
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
