# Products VS - Smart Product Comparison Platform

A comprehensive product comparison platform built with Next.js 15, featuring AI-powered comparisons, bilingual support (English & Arabic), and a complete admin moderation system.

## Features

- **70+ Static Comparisons** - Pre-written detailed comparisons across 9 categories
- **AI Battle** - Generate custom comparisons using Groq AI (llama-3.1-70b-versatile)
- **Bilingual Support** - Full English and Arabic language support with RTL
- **Admin Dashboard** - Complete moderation system with analytics and CSV export
- **SEO Optimized** - Dynamic sitemap, meta tags, Schema.org markup
- **Secure** - Rate limiting, input sanitization, security headers
- **Analytics** - Google Analytics 4 and Vercel Analytics integration
- **Responsive** - Mobile-first design with smooth animations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq API (llama-3.1-70b-versatile)
- **Styling**: CSS-in-JS with Tailwind utilities
- **Authentication**: JWT with bcryptjs
- **Analytics**: Google Analytics 4, Vercel Analytics
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account
- Groq API key
- (Optional) Google Analytics 4 measurement ID

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd products-vs
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Set up environment variables (see Environment Variables section below)

4. Run database migrations:
   - Go to your Supabase project SQL editor
   - Run `scripts/001_create_comparisons_tables.sql`
   - Run `scripts/002_add_views_column.sql`

5. Create an admin user:
\`\`\`sql
-- In Supabase SQL editor
INSERT INTO admin_users (email, password_hash, name)
VALUES (
  'admin@example.com',
  '$2a$10$...',  -- Generate using bcryptjs
  'Admin User'
);
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

7. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Groq AI (Required for AI Battle)
GROQ_API_KEY=your_groq_api_key

# JWT Secret (Required for admin auth)
JWT_SECRET=your_random_secret_key_min_32_chars

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site URL (Required for production)
NEXT_PUBLIC_SITE_URL=https://www.productsvs.com
\`\`\`

### Generating JWT Secret

\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### Generating Admin Password Hash

\`\`\`javascript
const bcrypt = require('bcryptjs');
const password = 'your_secure_password';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
\`\`\`

## Project Structure

\`\`\`
products-vs/
├── app/                      # Next.js app directory
│   ├── (routes)/            # Page routes
│   ├── api/                 # API routes
│   ├── admin/               # Admin dashboard
│   └── comparison/[slug]/   # Dynamic comparison pages
├── components/              # Reusable components
│   ├── navigation.tsx
│   ├── footer.tsx
│   ├── PendingBanner.tsx
│   └── ...
├── lib/                     # Utilities and helpers
│   ├── auth.ts             # JWT authentication
│   ├── groq.ts             # AI integration
│   ├── db/                 # Database functions
│   ├── security/           # Security utilities
│   └── analytics/          # Analytics tracking
├── scripts/                # SQL migration scripts
├── public/                 # Static assets
└── middleware.ts           # Next.js middleware

\`\`\`

## Key Features

### AI Battle

Generate custom comparisons using AI:
- Powered by Groq's llama-3.1-70b-versatile model
- Automatic category detection
- Comprehensive analysis with pros/cons
- Rate limited (5 per hour per IP)
- Spam detection and validation

### Admin Dashboard

Complete moderation system:
- JWT-based authentication
- Approve/reject pending comparisons
- Analytics dashboard with charts
- CSV export functionality
- Activity logging
- Search and filter capabilities

### SEO Optimization

- Dynamic sitemap.xml (static + dynamic comparisons)
- Meta tags (title, description, keywords)
- OpenGraph and Twitter cards
- Schema.org JSON-LD markup
- robots.txt configuration
- Canonical URLs

### Security

- Rate limiting on all API endpoints
- Input sanitization and validation
- Security headers (XSS, clickjacking protection)
- SQL injection prevention
- CSRF protection
- Secure password hashing (bcryptjs)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build the project:
\`\`\`bash
npm run build
\`\`\`

2. Start production server:
\`\`\`bash
npm start
\`\`\`

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database tables created
- [ ] Admin user created
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Google Analytics connected
- [ ] Sitemap submitted to Google Search Console
- [ ] Test all features (AI Battle, admin login, comparisons)
- [ ] Monitor error logs
- [ ] Check performance metrics

## Admin Guide

### Accessing Admin Dashboard

1. Navigate to `/admin/login`
2. Enter admin credentials
3. Dashboard shows pending comparisons

### Moderating Comparisons

1. Click "Preview" to view full comparison
2. Review content for quality and accuracy
3. Click "Approve" to publish or "Reject" with reason
4. Approved comparisons appear on the site immediately

### Exporting Data

1. Go to admin dashboard
2. Click "Export to CSV" button
3. CSV file downloads with all comparison data

### Analytics

View real-time statistics:
- Daily/weekly/monthly submissions
- Approval rates
- Category distribution
- Total comparisons

## API Documentation

### Public Endpoints

- `POST /api/generate` - Generate new comparison (rate limited)
- `POST /api/battle` - AI Battle comparison (rate limited)

### Admin Endpoints (Requires Authentication)

- `POST /api/admin/auth` - Login
- `DELETE /api/admin/auth` - Logout
- `GET /api/admin/auth` - Check session
- `GET /api/admin/pending` - Get pending comparisons
- `POST /api/admin/approve` - Approve comparison
- `POST /api/admin/reject` - Reject comparison
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/analytics` - Get detailed analytics

## Troubleshooting

### AI Battle not working
- Check GROQ_API_KEY is set correctly
- Verify API key has sufficient credits
- Check rate limiting (5 per hour per IP)

### Admin login fails
- Verify JWT_SECRET is set
- Check password hash is correct
- Ensure admin user exists in database

### Database errors
- Verify Supabase credentials
- Check RLS policies are configured
- Ensure tables are created

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall
- Check TypeScript errors: `npm run type-check`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Email: support@productsvs.com

## Acknowledgments

- Built with Next.js 15
- AI powered by Groq
- Database by Supabase
- Deployed on Vercel
