'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Globe,
  Building,
  Save,
  Lock,
  CreditCard,
  Bell,
  CheckCircle
} from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    company: '',
    website: '',
    phone: '',
    skype: '',
    telegram: '',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
      setProfile({
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        company: data.user.company || '',
        website: data.user.website || '',
        phone: data.user.phone || '',
        skype: data.user.skype || '',
        telegram: data.user.telegram || '',
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulated save
    setTimeout(() => {
      setSaving(false);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert('Passwords do not match');
      return;
    }
    setSaving(true);
    // Simulated save
    setTimeout(() => {
      setSaving(false);
      setSuccess('Password updated successfully');
      setPassword({ current: '', new: '', confirm: '' });
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'payment', label: 'Payment Info', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-white/10 rounded w-48 animate-pulse"></div>
        <div className="glass rounded-xl p-6 animate-pulse">
          <div className="h-64 bg-white/5 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-gaming-accent text-white'
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass rounded-xl p-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={saveProfile} className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-white/10">
              <div className="w-20 h-20 bg-gaming-accent/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gaming-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user?.firstName} {user?.lastName}</h3>
                <p className="text-gray-400">{user?.email}</p>
                <span className={`badge mt-2 ${
                  user?.status === 'approved' ? 'badge-success' :
                  user?.status === 'pending' ? 'badge-warning' : 'badge-danger'
                }`}>
                  {user?.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    className="input-field pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="company"
                    value={profile.company}
                    onChange={handleProfileChange}
                    className="input-field pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="website"
                    value={profile.website}
                    onChange={handleProfileChange}
                    className="input-field pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="input-field pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skype</label>
                <input
                  type="text"
                  name="skype"
                  value={profile.skype}
                  onChange={handleProfileChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telegram</label>
                <input
                  type="text"
                  name="telegram"
                  value={profile.telegram}
                  onChange={handleProfileChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <form onSubmit={savePassword} className="space-y-6">
            <h3 className="text-lg font-semibold pb-4 border-b border-white/10">Change Password</h3>

            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  name="new"
                  value={password.new}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={password.confirm}
                  onChange={handlePasswordChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Lock className="w-5 h-5" />
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold pb-4 border-b border-white/10">Payment Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select className="input-field cursor-pointer">
                  <option value="wire" className="bg-gaming-dark">Wire Transfer</option>
                  <option value="paypal" className="bg-gaming-dark">PayPal</option>
                  <option value="crypto" className="bg-gaming-dark">Cryptocurrency</option>
                  <option value="skrill" className="bg-gaming-dark">Skrill</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Minimum Payout</label>
                <select className="input-field cursor-pointer">
                  <option value="100" className="bg-gaming-dark">$100</option>
                  <option value="250" className="bg-gaming-dark">$250</option>
                  <option value="500" className="bg-gaming-dark">$500</option>
                  <option value="1000" className="bg-gaming-dark">$1,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">PayPal Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-field"
                />
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                Payments are processed on the 1st and 15th of each month. Minimum payout is $100.
              </p>
            </div>

            <div className="flex justify-end pt-6 border-t border-white/10">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-medium transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Payment Info
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold pb-4 border-b border-white/10">Notification Preferences</h3>

            <div className="space-y-4">
              {[
                { id: 'email_offers', label: 'New Offer Notifications', desc: 'Get notified when new offers are available' },
                { id: 'email_payments', label: 'Payment Notifications', desc: 'Get notified about payment processing' },
                { id: 'email_messages', label: 'Message Notifications', desc: 'Get notified when you receive new messages' },
                { id: 'email_reports', label: 'Weekly Report', desc: 'Receive weekly performance summary' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gaming-accent"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-white/10">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gaming-accent hover:bg-gaming-accent/80 rounded-lg font-medium transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Affiliate ID</p>
            <p className="font-medium">{user?.affiliateId || user?.id?.slice(0, 8)}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Referral Code</p>
            <p className="font-medium">{user?.referralCode || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Member Since</p>
            <p className="font-medium">
              {new Date(user?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
