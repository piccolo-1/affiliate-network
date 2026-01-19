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
- **Database**: JSON file-based (zero setup required)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: JWT with HTTP-only cookies

## Quick Start

### One-Command Setup

```bash
node start.js
```

This will install dependencies, seed the database, and start the server.

### Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Seed the database (optional - creates demo data):
```bash
npm run seed
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

The seeded database includes these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Affiliate | affiliate@demo.com | password123 |
| Manager | manager@demo.com | password123 |
| Admin | admin@demo.com | password123 |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── offers/        # Offer management
│   │   ├── messages/      # Messaging system
│   │   ├── stats/         # Statistics & analytics
│   │   └── postback/      # Conversion tracking
│   ├── track/             # Click tracking endpoint
│   ├── dashboard/         # Affiliate dashboard pages
│   ├── offers/            # Public offer marketplace
│   ├── login/             # Login page
│   └── register/          # Registration page
├── lib/                   # Utility functions
│   ├── auth.js           # Authentication helpers
│   ├── db.js             # JSON database client
│   └── everflow.js       # Everflow API integration

data/
└── db.json               # Database file (auto-created)

scripts/
└── seed.js               # Database seeding script
```

## Everflow Integration

The platform integrates with Everflow for affiliate tracking. Configure your Everflow credentials in `.env`:

```env
EVERFLOW_API_KEY=your-api-key
EVERFLOW_NETWORK_ID=your-network-id
EVERFLOW_API_URL=https://api.eflow.team/v1
```

### Tracking Features:
- **Click Tracking**: `/track?aff={affiliateId}&offer={offerId}`
- **Conversion Postback**: `/api/postback?aff={affiliateId}&offer={offerId}&payout={amount}`
- Real-time stats and reporting
- Automatic fallback to local tracking when Everflow is not configured

### Postback URL Format

Configure this postback URL on your advertiser side:
```
https://yourdomain.com/api/postback?aff={affiliate_id}&offer={offer_id}&payout={payout}&txn={transaction_id}
```

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

### Tracking
- `GET /track` - Click tracking redirect
- `GET /api/postback` - Conversion postback (GET or POST)

## Environment Variables

Create a `.env` file in the root directory:

```env
# JWT Secret (change in production!)
JWT_SECRET="your-secret-key"

# Everflow API (optional - falls back to local tracking)
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
- Setting up proper environment variables
- Using a persistent storage solution for the JSON database
- Configuring a reverse proxy (nginx)
- Setting up SSL certificates

## License

MIT License
