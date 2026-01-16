/**
 * Simple JSON-based database for demo purposes
 * Data is stored in memory and persisted to a JSON file
 */

import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Default data structure
const defaultData = {
  users: [],
  offers: [],
  applications: [],
  conversations: [],
  messages: [],
  dailyStats: [],
};

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Load database from file
function loadDb() {
  ensureDataDir();
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
  return { ...defaultData };
}

// Save database to file
function saveDb(data) {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// In-memory database
let db = loadDb();

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Database operations
const database = {
  // Users
  user: {
    findUnique: ({ where }) => {
      return db.users.find(u => {
        if (where.id) return u.id === where.id;
        if (where.email) return u.email === where.email;
        if (where.affiliateId) return u.affiliateId === where.affiliateId;
        return false;
      }) || null;
    },
    findMany: ({ where = {}, orderBy, select } = {}) => {
      let results = [...db.users];
      if (where.role) results = results.filter(u => u.role === where.role);
      if (where.status) results = results.filter(u => u.status === where.status);
      if (orderBy) {
        const [key, order] = Object.entries(orderBy)[0];
        results.sort((a, b) => order === 'desc' ? b[key] - a[key] : a[key] - b[key]);
      }
      return results;
    },
    create: ({ data }) => {
      const user = { id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data };
      db.users.push(user);
      saveDb(db);
      return user;
    },
    update: ({ where, data }) => {
      const index = db.users.findIndex(u => u.id === where.id || u.email === where.email);
      if (index !== -1) {
        db.users[index] = { ...db.users[index], ...data, updatedAt: new Date().toISOString() };
        saveDb(db);
        return db.users[index];
      }
      return null;
    },
    upsert: ({ where, update, create }) => {
      const existing = database.user.findUnique({ where });
      if (existing) {
        return database.user.update({ where, data: update });
      }
      return database.user.create({ data: create });
    },
  },

  // Offers
  offer: {
    findUnique: ({ where, include }) => {
      const offer = db.offers.find(o => o.id === where.id) || null;
      if (offer && include?.manager) {
        offer.manager = db.users.find(u => u.id === offer.managerId) || null;
      }
      return offer;
    },
    findMany: ({ where = {}, orderBy, take, skip = 0, include } = {}) => {
      let results = [...db.offers];
      if (where.status) results = results.filter(o => o.status === where.status);
      if (where.category) results = results.filter(o => o.category === where.category);
      if (where.payoutType) results = results.filter(o => o.payoutType === where.payoutType);
      if (where.featured) results = results.filter(o => o.featured === where.featured);
      if (where.OR) {
        results = results.filter(o =>
          where.OR.some(condition => {
            if (condition.name?.contains) return o.name.toLowerCase().includes(condition.name.contains.toLowerCase());
            if (condition.description?.contains) return o.description.toLowerCase().includes(condition.description.contains.toLowerCase());
            return false;
          })
        );
      }
      if (orderBy) {
        results.sort((a, b) => {
          for (const [key, order] of Object.entries(orderBy)) {
            if (a[key] < b[key]) return order === 'desc' ? 1 : -1;
            if (a[key] > b[key]) return order === 'desc' ? -1 : 1;
          }
          return 0;
        });
      }
      const total = results.length;
      if (take) results = results.slice(skip, skip + take);
      if (include?.manager) {
        results = results.map(o => ({
          ...o,
          manager: db.users.find(u => u.id === o.managerId) || null,
        }));
      }
      return { results, total };
    },
    create: ({ data }) => {
      const offer = { id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data };
      db.offers.push(offer);
      saveDb(db);
      return offer;
    },
    count: ({ where = {} } = {}) => {
      let results = [...db.offers];
      if (where.status) results = results.filter(o => o.status === where.status);
      return results.length;
    },
  },

  // Applications
  offerApplication: {
    findUnique: ({ where }) => {
      if (where.userId_offerId) {
        return db.applications.find(a =>
          a.userId === where.userId_offerId.userId &&
          a.offerId === where.userId_offerId.offerId
        ) || null;
      }
      return db.applications.find(a => a.id === where.id) || null;
    },
    findMany: ({ where = {}, include, orderBy } = {}) => {
      let results = [...db.applications];
      if (where.userId) results = results.filter(a => a.userId === where.userId);
      if (where.offerId) results = results.filter(a => a.offerId === where.offerId);
      if (where.status) results = results.filter(a => a.status === where.status);
      if (orderBy) {
        const [key, order] = Object.entries(orderBy)[0];
        results.sort((a, b) => order === 'desc' ? new Date(b[key]) - new Date(a[key]) : new Date(a[key]) - new Date(b[key]));
      }
      if (include?.offer) {
        results = results.map(a => ({
          ...a,
          offer: db.offers.find(o => o.id === a.offerId) || null,
        }));
      }
      if (include?.user) {
        results = results.map(a => ({
          ...a,
          user: db.users.find(u => u.id === a.userId) || null,
        }));
      }
      return results;
    },
    create: ({ data }) => {
      const app = { id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data };
      db.applications.push(app);
      saveDb(db);
      return app;
    },
    count: ({ where = {} } = {}) => {
      let results = [...db.applications];
      if (where.userId) results = results.filter(a => a.userId === where.userId);
      if (where.status) results = results.filter(a => a.status === where.status);
      return results.length;
    },
  },

  // Conversations
  conversation: {
    findUnique: ({ where, include }) => {
      const conv = db.conversations.find(c => c.id === where.id) || null;
      if (conv && include) {
        if (include.messages) {
          conv.messages = db.messages
            .filter(m => m.conversationId === conv.id)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map(m => ({
              ...m,
              sender: db.users.find(u => u.id === m.senderId) || null,
            }));
        }
        if (include.participants) {
          conv.participants = (conv.participantIds || []).map(pid => ({
            userId: pid,
            user: db.users.find(u => u.id === pid) || null,
          }));
        }
      }
      return conv;
    },
    findMany: ({ where = {}, include, orderBy } = {}) => {
      let results = [...db.conversations];
      if (where.participants?.some) {
        results = results.filter(c =>
          (c.participantIds || []).includes(where.participants.some.userId)
        );
      }
      if (orderBy) {
        const [key, order] = Object.entries(orderBy)[0];
        results.sort((a, b) => order === 'desc' ? new Date(b[key]) - new Date(a[key]) : new Date(a[key]) - new Date(b[key]));
      }
      if (include) {
        results = results.map(conv => {
          const result = { ...conv };
          if (include.messages) {
            result.messages = db.messages
              .filter(m => m.conversationId === conv.id)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 1);
          }
          if (include.participants) {
            result.participants = (conv.participantIds || []).map(pid => ({
              userId: pid,
              user: db.users.find(u => u.id === pid) || null,
            }));
          }
          return result;
        });
      }
      return results;
    },
    create: ({ data }) => {
      const conv = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        participantIds: data.participantIds || [],
        ...data
      };
      db.conversations.push(conv);
      saveDb(db);
      return conv;
    },
    update: ({ where, data }) => {
      const index = db.conversations.findIndex(c => c.id === where.id);
      if (index !== -1) {
        db.conversations[index] = { ...db.conversations[index], ...data, updatedAt: new Date().toISOString() };
        saveDb(db);
        return db.conversations[index];
      }
      return null;
    },
  },

  // Messages
  message: {
    findMany: ({ where = {}, include, orderBy } = {}) => {
      let results = [...db.messages];
      if (where.conversationId) results = results.filter(m => m.conversationId === where.conversationId);
      if (where.receiverId) results = results.filter(m => m.receiverId === where.receiverId);
      if (where.read !== undefined) results = results.filter(m => m.read === where.read);
      if (orderBy) {
        const [key, order] = Object.entries(orderBy)[0];
        results.sort((a, b) => order === 'desc' ? new Date(b[key]) - new Date(a[key]) : new Date(a[key]) - new Date(b[key]));
      }
      if (include?.sender) {
        results = results.map(m => ({
          ...m,
          sender: db.users.find(u => u.id === m.senderId) || null,
        }));
      }
      return results;
    },
    create: ({ data }) => {
      const msg = { id: generateId(), createdAt: new Date().toISOString(), read: false, ...data };
      db.messages.push(msg);
      saveDb(db);
      return msg;
    },
    updateMany: ({ where, data }) => {
      let count = 0;
      db.messages = db.messages.map(m => {
        let match = true;
        if (where.conversationId && m.conversationId !== where.conversationId) match = false;
        if (where.receiverId && m.receiverId !== where.receiverId) match = false;
        if (match) {
          count++;
          return { ...m, ...data };
        }
        return m;
      });
      saveDb(db);
      return { count };
    },
    count: ({ where = {} } = {}) => {
      let results = [...db.messages];
      if (where.receiverId) results = results.filter(m => m.receiverId === where.receiverId);
      if (where.read !== undefined) results = results.filter(m => m.read === where.read);
      return results.length;
    },
  },

  // Daily Stats
  dailyStats: {
    findMany: ({ where = {}, orderBy } = {}) => {
      let results = [...db.dailyStats];
      if (where.userId) results = results.filter(s => s.userId === where.userId);
      if (where.date?.gte) results = results.filter(s => new Date(s.date) >= new Date(where.date.gte));
      if (where.date?.lte) results = results.filter(s => new Date(s.date) <= new Date(where.date.lte));
      if (orderBy) {
        const [key, order] = Object.entries(orderBy)[0];
        results.sort((a, b) => order === 'desc' ? new Date(b[key]) - new Date(a[key]) : new Date(a[key]) - new Date(b[key]));
      }
      return results;
    },
    create: ({ data }) => {
      const stat = { id: generateId(), createdAt: new Date().toISOString(), ...data };
      db.dailyStats.push(stat);
      saveDb(db);
      return stat;
    },
  },

  // Utility to reload data
  reload: () => {
    db = loadDb();
  },

  // Get raw data (for debugging)
  raw: () => db,
};

export default database;
