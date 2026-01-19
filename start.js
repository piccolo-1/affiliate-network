#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('');
console.log('========================================');
console.log('  iGaming Affiliate Network - Setup');
console.log('========================================');
console.log('');

// Step 1: Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('Step 1: Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✓ Dependencies installed\n');
  } catch (e) {
    console.error('Error installing dependencies');
    process.exit(1);
  }
} else {
  console.log('Step 1: Dependencies already installed ✓\n');
}

// Step 2: Create database with demo data
console.log('Step 2: Setting up database...');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data', 'db.json');
const dir = path.dirname(DB_PATH);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const adminPassword = bcrypt.hashSync('admin123', 10);
const managerPassword = bcrypt.hashSync('manager123', 10);
const affiliatePassword = bcrypt.hashSync('demo123', 10);

const manager = {
  id: generateId(),
  email: 'manager@igaming-network.com',
  password: managerPassword,
  firstName: 'John',
  lastName: 'Manager',
  role: 'manager',
  status: 'approved',
  skype: 'john.manager',
  telegram: '@johnmanager',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const affiliate = {
  id: generateId(),
  email: 'demo@affiliate.com',
  password: affiliatePassword,
  firstName: 'Demo',
  lastName: 'Affiliate',
  role: 'affiliate',
  status: 'approved',
  company: 'Demo Marketing LLC',
  affiliateId: 'AFF-001',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const users = [
  { id: generateId(), email: 'admin@igaming-network.com', password: adminPassword, firstName: 'Admin', lastName: 'User', role: 'admin', status: 'approved', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  manager,
  affiliate,
];

const offers = [
  { id: generateId(), name: 'BetKing Casino', shortDescription: 'Premium casino with 3000+ games', description: 'Premier online casino with slots, live dealer, and sports betting.', category: 'casino', advertiser: 'BetKing Ltd', payoutType: 'CPA', payoutAmount: 150, currency: 'USD', geoTargets: '["US","CA","GB","AU"]', deviceTargets: '["desktop","mobile"]', trafficTypes: '["search","social"]', status: 'active', featured: true, exclusive: false, requiresApproval: true, conversionRate: 4.2, epc: 2.85, managerId: manager.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: generateId(), name: 'SportsBet Pro', shortDescription: 'Sports betting on all major leagues', description: 'Leading sports betting platform with competitive odds.', category: 'sports-betting', advertiser: 'SportsBet Int', payoutType: 'RevShare', revSharePercent: 35, currency: 'USD', geoTargets: '["US","CA","GB"]', deviceTargets: '["desktop","mobile"]', trafficTypes: '["search","social"]', status: 'active', featured: true, exclusive: true, requiresApproval: true, conversionRate: 3.8, epc: 3.20, managerId: manager.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: generateId(), name: 'PokerStars Elite', shortDescription: 'Elite poker tournaments', description: 'Premium poker network with tournaments and cash games.', category: 'poker', advertiser: 'PokerStars Ltd', payoutType: 'CPA', payoutAmount: 200, currency: 'USD', geoTargets: '["US","CA","GB","DE"]', deviceTargets: '["desktop"]', trafficTypes: '["search","email"]', status: 'active', featured: true, exclusive: true, requiresApproval: true, conversionRate: 2.9, epc: 4.50, managerId: manager.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: generateId(), name: 'ESports Arena', shortDescription: 'Esports betting on CS2, LoL, Dota', description: 'Dedicated esports betting platform.', category: 'esports', advertiser: 'ESports Bet Ltd', payoutType: 'RevShare', revSharePercent: 40, currency: 'USD', geoTargets: '["US","CA","GB","KR"]', deviceTargets: '["desktop","mobile"]', trafficTypes: '["social","native"]', status: 'active', featured: true, exclusive: false, requiresApproval: true, conversionRate: 4.8, epc: 3.75, managerId: manager.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: generateId(), name: 'MegaLotto', shortDescription: 'International lottery tickets', description: 'Play Powerball, EuroMillions online.', category: 'lottery', advertiser: 'MegaLotto Inc', payoutType: 'CPA', payoutAmount: 45, currency: 'USD', geoTargets: '["US","CA","AU"]', deviceTargets: '["desktop","mobile"]', trafficTypes: '["search","display"]', status: 'active', featured: false, exclusive: false, requiresApproval: false, conversionRate: 6.2, epc: 1.95, managerId: manager.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: generateId(), name: 'LuckySpin Slots', shortDescription: 'Progressive jackpot slots', description: 'Slots casino with huge jackpots.', category: 'casino', advertiser: 'LuckySpin Gaming', payoutType: 'Hybrid', payoutAmount: 75, revSharePercent: 25, currency: 'USD', geoTargets: '["GB","DE","SE"]', deviceTargets: '["mobile"]', trafficTypes: '["social","native"]', status: 'active', featured: false, exclusive: false, requiresApproval: true, conversionRate: 5.1, epc: 2.45, managerId: manager.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const dailyStats = [];
for (let i = 0; i < 30; i++) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  dailyStats.push({
    id: generateId(),
    userId: affiliate.id,
    date: date.toISOString(),
    clicks: Math.floor(Math.random() * 500) + 100,
    conversions: Math.floor(Math.random() * 20) + 5,
    payout: parseFloat((Math.random() * 1500 + 300).toFixed(2)),
    createdAt: new Date().toISOString(),
  });
}

const db = { users, offers, applications: [], conversations: [], messages: [], dailyStats };
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
console.log('✓ Database created with demo data\n');

// Step 3: Start server
console.log('Step 3: Starting server...\n');
console.log('========================================');
console.log('');
console.log('  Website starting at:');
console.log('  http://localhost:3000');
console.log('');
console.log('  Login with:');
console.log('  Email: demo@affiliate.com');
console.log('  Password: demo123');
console.log('');
console.log('========================================');
console.log('');

execSync('npm run dev', { stdio: 'inherit' });
