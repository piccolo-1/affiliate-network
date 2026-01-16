'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  MousePointer,
  Target,
  DollarSign
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stats?range=${dateRange}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 text-sm">
          <p className="text-gray-400 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-medium">
                {entry.name === 'Earnings' || entry.name === 'Revenue'
                  ? `$${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const exportCSV = () => {
    if (!stats?.dailyStats?.length) return;

    const headers = ['Date', 'Clicks', 'Conversions', 'Revenue', 'Payout'];
    const rows = stats.dailyStats.map((day) => [
      day.date,
      day.clicks,
      day.conversions,
      day.revenue,
      day.payout,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stats-${dateRange}days.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/10 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <h1 className="text-2xl font-bold">Statistics</h1>
          <p className="text-gray-400">Detailed performance analytics</p>
        </div>
        <div className="flex items-center gap-4">
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
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-blue-400" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-400">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Clicks</p>
          <p className="text-2xl font-bold">{stats?.totals?.clicks?.toLocaleString() || 0}</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-400">
              <TrendingUp className="w-4 h-4" />
              +8%
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Conversions</p>
          <p className="text-2xl font-bold">{stats?.totals?.conversions?.toLocaleString() || 0}</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gaming-accent/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gaming-accent" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-400">
              <TrendingUp className="w-4 h-4" />
              +15%
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
          <p className="text-2xl font-bold">
            ${stats?.totals?.payout?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold">{stats?.metrics?.conversionRate || 0}%</p>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">Earnings Over Time</h2>
        <div className="h-80">
          {stats?.dailyStats?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="payout" name="Earnings" fill="#e94560" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No data available for this period
            </div>
          )}
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">Traffic & Conversions</h2>
        <div className="h-80">
          {stats?.dailyStats?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
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
              No data available for this period
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold">Daily Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 bg-white/5">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Clicks</th>
                <th className="px-6 py-4 font-medium text-right">Conversions</th>
                <th className="px-6 py-4 font-medium text-right">Conv. Rate</th>
                <th className="px-6 py-4 font-medium text-right">EPC</th>
                <th className="px-6 py-4 font-medium text-right">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats?.dailyStats?.slice().reverse().map((day, index) => {
                const cr = day.clicks > 0 ? ((day.conversions / day.clicks) * 100).toFixed(2) : 0;
                const epc = day.clicks > 0 ? (day.payout / day.clicks).toFixed(2) : 0;
                return (
                  <tr key={index} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">{day.clicks.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">{day.conversions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">{cr}%</td>
                    <td className="px-6 py-4 text-right">${epc}</td>
                    <td className="px-6 py-4 text-right font-medium text-gaming-gold">
                      ${day.payout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
