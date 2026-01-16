'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  Calendar,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const res = await fetch('/api/stats?range=30');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample payment history
  const paymentHistory = [
    { id: 1, date: '2024-01-15', amount: 2450.00, method: 'PayPal', status: 'completed' },
    { id: 2, date: '2024-01-01', amount: 1875.50, method: 'Wire Transfer', status: 'completed' },
    { id: 3, date: '2023-12-15', amount: 3200.00, method: 'PayPal', status: 'completed' },
    { id: 4, date: '2023-12-01', amount: 2100.25, method: 'Crypto (BTC)', status: 'completed' },
    { id: 5, date: '2023-11-15', amount: 1650.00, method: 'PayPal', status: 'completed' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/10 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-white/10 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pendingEarnings = stats?.totals?.payout || 0;
  const totalPaid = paymentHistory.reduce((sum, p) => sum + p.amount, 0);
  const nextPaymentDate = new Date();
  nextPaymentDate.setDate(nextPaymentDate.getDate() > 15 ? 1 : 15);
  if (nextPaymentDate.getDate() === 1) {
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-gray-400">Track your earnings and payment history</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 rounded-lg transition-colors">
          <Download className="w-5 h-5" />
          Export History
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gaming-accent/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gaming-accent" />
            </div>
            <span className="badge badge-warning">Pending</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Pending Earnings</p>
          <p className="text-2xl font-bold">
            ${pendingEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Paid</p>
          <p className="text-2xl font-bold">
            ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Next Payment Date</p>
          <p className="text-2xl font-bold">
            {nextPaymentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Payment Schedule Info */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gaming-accent" />
              <span>Payments processed on the 1st and 15th of each month</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-gaming-accent" />
              <span>Minimum payout: $100</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-gaming-accent" />
              <span>Net-15 payment terms</span>
            </div>
          </div>
          <div className="p-4 bg-gaming-accent/10 border border-gaming-accent/20 rounded-lg">
            <h3 className="font-medium mb-2">Your Current Balance</h3>
            <p className="text-3xl font-bold text-gaming-gold">
              ${pendingEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {pendingEarnings >= 100
                ? 'Eligible for next payout'
                : `Need $${(100 - pendingEarnings).toFixed(2)} more to reach minimum`}
            </p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 bg-white/5">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    {new Date(payment.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium text-gaming-gold">
                    ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">{payment.method}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      payment.status === 'completed' ? 'badge-success' :
                      payment.status === 'pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gaming-accent hover:underline flex items-center gap-1">
                      View <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Accepted Payment Methods</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'PayPal', icon: '💳' },
            { name: 'Wire Transfer', icon: '🏦' },
            { name: 'Cryptocurrency', icon: '₿' },
            { name: 'Skrill', icon: '💰' },
          ].map((method) => (
            <div
              key={method.name}
              className="p-4 bg-white/5 rounded-lg text-center hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="text-3xl mb-2">{method.icon}</div>
              <p className="text-sm">{method.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
