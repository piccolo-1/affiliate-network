'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  MousePointer,
  Target,
  Gift,
  ArrowRight,
  Calendar
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes] = await Promise.all([
        fetch(`/api/stats?range=${dateRange}`),
        fetch('/api/applications'),
      ]);

      const statsData = await statsRes.json();
      const appsData = await appsRes.json();

      setStats(statsData);
      setApplications(appsData.applications || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Clicks',
      value: stats?.totals?.clicks?.toLocaleString() || '0',
      icon: MousePointer,
      change: '+12.5%',
      positive: true,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Conversions',
      value: stats?.totals?.conversions?.toLocaleString() || '0',
      icon: Target,
      change: '+8.2%',
      positive: true,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Earnings',
      value: `$${stats?.totals?.payout?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}`,
      icon: DollarSign,
      change: '+15.3%',
      positive: true,
      color: 'from-gaming-accent to-pink-500',
    },
    {
      title: 'Active Offers',
      value: stats?.metrics?.approvedOffers?.toString() || '0',
      icon: Gift,
      change: '+2',
      positive: true,
      color: 'from-purple-500 to-violet-500',
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 text-sm">
          <p className="text-gray-400 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'payout' || entry.name === 'revenue'
                ? `$${entry.value.toLocaleString()}`
                : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-white/10 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        <div className="glass rounded-xl p-6 h-80 animate-pulse">
          <div className="h-full bg-white/5 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here&apos;s your performance overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-gaming-accent cursor-pointer"
          >
            <option value="7" className="bg-gaming-dark">Last 7 days</option>
            <option value="30" className="bg-gaming-dark">Last 30 days</option>
            <option value="90" className="bg-gaming-dark">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="glass rounded-xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20 flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-2">Conversion Rate</p>
          <p className="text-3xl font-bold text-gaming-accent">{stats?.metrics?.conversionRate || 0}%</p>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-2">Earnings Per Click</p>
          <p className="text-3xl font-bold text-gaming-gold">${stats?.metrics?.epc || '0.00'}</p>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-2">Approved Offers</p>
          <p className="text-3xl font-bold text-green-400">{stats?.metrics?.approvedOffers || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6">Earnings Overview</h2>
          <div className="h-64">
            {stats?.dailyStats?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailyStats}>
                  <defs>
                    <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e94560" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e94560" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="payout"
                    name="Earnings"
                    stroke="#e94560"
                    fillOpacity={1}
                    fill="url(#colorPayout)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Clicks & Conversions Chart */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6">Traffic & Conversions</h2>
          <div className="h-64">
            {stats?.dailyStats?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    name="Clicks"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    name="Conversions"
                    stroke="#4ade80"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="glass rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">My Offers</h2>
          <Link
            href="/dashboard/offers"
            className="text-gaming-accent hover:text-gaming-accent/80 flex items-center gap-1 text-sm"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">You haven&apos;t applied to any offers yet</p>
            <Link
              href="/offers"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg transition-colors"
            >
              Browse Offers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400">
                  <th className="pb-4">Offer</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Payout</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="text-sm">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          {app.offer.thumbnailUrl ? (
                            <img
                              src={app.offer.thumbnailUrl}
                              alt={app.offer.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Gift className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium">{app.offer.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-white/10 rounded text-xs capitalize">
                        {app.offer.category.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-4 text-gaming-gold font-medium">
                      {app.offer.payoutType === 'CPA'
                        ? `$${app.offer.payoutAmount}`
                        : app.offer.payoutType === 'RevShare'
                        ? `${app.offer.revSharePercent}%`
                        : `$${app.offer.payoutAmount} + ${app.offer.revSharePercent}%`}
                    </td>
                    <td className="py-4">
                      <span className={`badge ${
                        app.status === 'approved' ? 'badge-success' :
                        app.status === 'pending' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/offers"
          className="glass rounded-xl p-6 text-center card-hover group"
        >
          <Gift className="w-8 h-8 text-gaming-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold mb-1">Browse Offers</p>
          <p className="text-sm text-gray-400">Find new offers to promote</p>
        </Link>
        <Link
          href="/dashboard/messages"
          className="glass rounded-xl p-6 text-center card-hover group"
        >
          <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold mb-1">Contact Manager</p>
          <p className="text-sm text-gray-400">Get help from your AM</p>
        </Link>
        <Link
          href="/dashboard/stats"
          className="glass rounded-xl p-6 text-center card-hover group"
        >
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold mb-1">View Reports</p>
          <p className="text-sm text-gray-400">Detailed performance stats</p>
        </Link>
      </div>
    </div>
  );
}

// Import MessageSquare for quick actions
import { MessageSquare } from 'lucide-react';
