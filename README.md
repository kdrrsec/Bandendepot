# Bandendepot.com - B2B Tire Wholesale Platform

A complete B2B tire wholesale web platform built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- **Public Homepage**: Marketing landing page with login/registration
- **Authenticated B2B App**: Product catalog, dashboard, orders, and account management
- **Admin Panel**: Company approval, brand/product management
- **Role-based Access Control**: Separate user and admin roles
- **Company Approval System**: Companies must be approved before accessing prices

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bandendepot?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

Replace the database connection string with your PostgreSQL credentials.

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with initial data
npm run db:seed
```

The seed script will create:
- Admin user: `admin@bandendepot.com` / `admin123`
- 10 brands (Michelin, Bridgestone, Continental, etc.)
- 30 products with inventory and prices

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth routes
│   │   ├── admin/        # Admin API routes
│   │   ├── products/     # Product API routes
│   │   └── company/      # Company API routes
│   ├── app/              # Authenticated app pages
│   │   ├── catalog/      # Product catalog
│   │   ├── product/      # Product detail pages
│   │   ├── orders/       # Order history
│   │   └── account/      # Account management
│   ├── admin/            # Admin panel pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── page.tsx          # Public homepage
├── components/
│   ├── layouts/          # Layout components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
└── middleware.ts        # Route protection
```

## User Roles

### Admin
- Access: `/admin`
- Can approve/reject company accounts
- Can manage brands and products
- Can update prices and inventory

### User (Company)
- Access: `/app` (after company approval)
- Can view product catalog with B2B prices
- Can manage favorites
- Can view order history
- Can manage account details

## Branding Colors

- **Primary**: Dark Blue `#0B2A4A`
- **Secondary**: Anthracite `#1F2937`
- **Accent**: Yellow `#F6B21A`
- **Neutral**: White `#FFFFFF` / Light Gray `#F3F4F6`

## Database Schema

- **User**: Authentication and user accounts
- **Company**: B2B company information with approval status
- **Brand**: Tire brands
- **Product**: Tire products with specifications
- **Inventory**: Stock quantities and delivery times
- **Price**: B2B pricing (base or company-specific)
- **Favorite**: User favorite products
- **Order**: Order history (schema ready, UI mocked)

## Security

- All pricing routes require authentication and company approval
- Admin routes require ADMIN role
- Server-side validation on all API routes
- Password hashing with bcrypt
- Session-based authentication with NextAuth

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database commands
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema changes
npm run db:migrate   # Create migration
npm run db:seed      # Seed database
```

## Production Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations: `npm run db:push`
4. Seed database: `npm run db:seed`
5. Build: `npm run build`
6. Start: `npm start`

## Default Admin Credentials

- Email: `admin@bandendepot.com`
- Password: `admin123`

**⚠️ Change these credentials in production!**

## License

Private - All rights reserved











