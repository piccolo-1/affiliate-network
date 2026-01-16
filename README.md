# iGaming Affiliate Network

A modern affiliate marketing network platform focused on iGaming (casino, sports betting, poker, lottery, and esports) with Everflow tracking system integration.

## Features

- **Offer Marketplace**: Browse and apply to premium iGaming offers similar to ClickBank/OfferVault
- **Everflow Integration**: Full tracking system integration for clicks, conversions, and payouts
- **Affiliate Dashboard**: Comprehensive stats, earnings tracking, and performance analytics
- **Built-in Messaging**: Direct communication with affiliate managers
- **Payment Management**: Track earnings and payment history
- **Responsive Design**: Modern, mobile-friendly interface with dark gaming theme

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: JWT with HTTP-only cookies

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd affiliate-network
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:push
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

After running the seed script, you can log in with these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@igaming-network.com | admin123 |
| Manager | manager@igaming-network.com | manager123 |
| Affiliate | demo@affiliate.com | demo123 |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── offers/        # Offer management
│   │   ├── messages/      # Messaging system
│   │   └── stats/         # Statistics & analytics
│   ├── dashboard/         # Affiliate dashboard pages
│   ├── offers/            # Public offer marketplace
│   ├── login/             # Login page
│   └── register/          # Registration page
├── lib/                   # Utility functions
│   ├── auth.js           # Authentication helpers
│   ├── db.js             # Database client
│   └── everflow.js       # Everflow API integration
└── components/           # Reusable components

prisma/
├── schema.prisma         # Database schema
└── seed.js              # Database seeding script
```

## Everflow Integration

The platform integrates with Everflow for affiliate tracking. Configure your Everflow credentials in `.env`:

```env
EVERFLOW_API_KEY=your-api-key
EVERFLOW_NETWORK_ID=your-network-id
EVERFLOW_API_URL=https://api.eflow.team/v1
```

### Features:
- Affiliate tracking link generation
- Click and conversion tracking
- Real-time stats and reporting
- Postback URL configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new affiliate
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Offers
- `GET /api/offers` - List offers (with filters)
- `GET /api/offers/[id]` - Get offer details
- `POST /api/offers/[id]/apply` - Apply to offer

### Messaging
- `GET /api/messages` - List conversations
- `POST /api/messages` - Send message / Create conversation
- `GET /api/messages/[id]` - Get conversation messages

### Stats
- `GET /api/stats` - Get performance statistics

## Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (change in production!)
JWT_SECRET="your-secret-key"

# Everflow API
EVERFLOW_API_KEY="your-api-key"
EVERFLOW_NETWORK_ID="your-network-id"
EVERFLOW_API_URL="https://api.eflow.team/v1"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

For production deployment, consider:
- Using PostgreSQL instead of SQLite
- Setting up proper environment variables
- Configuring a reverse proxy (nginx)
- Setting up SSL certificates

## License

MIT License
