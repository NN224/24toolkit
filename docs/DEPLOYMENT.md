# Deployment Guide - Products VS

Complete step-by-step guide for deploying Products VS to production.

## Pre-Deployment Checklist

### 1. Code Preparation

- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] TypeScript compilation successful
- [ ] Build completes without errors
- [ ] Environment variables documented

### 2. Database Setup

- [ ] Supabase project created
- [ ] All SQL scripts executed
- [ ] RLS policies configured
- [ ] Admin user created
- [ ] Test data added (optional)

### 3. External Services

- [ ] Groq API key obtained
- [ ] Google Analytics property created (optional)
- [ ] Domain purchased (if custom domain)
- [ ] SSL certificate ready

## Step-by-Step Deployment

### Step 1: Prepare Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Go to SQL Editor and run migrations:

\`\`\`sql
-- Run scripts/001_create_comparisons_tables.sql
-- Run scripts/002_add_views_column.sql
\`\`\`

3. Create admin user:

\`\`\`sql
-- Generate password hash first using bcryptjs
INSERT INTO admin_users (email, password_hash, name)
VALUES (
  'your-email@example.com',
  'your-bcrypt-hash-here',
  'Your Name'
);
\`\`\`

4. Get your credentials from Settings > API:
   - Project URL
   - Anon/Public key
   - Service Role key

### Step 2: Get Groq API Key

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create a new API key
3. Save it securely

### Step 3: Deploy to Vercel

#### Option A: GitHub Integration (Recommended)

1. Push code to GitHub:
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
\`\`\`

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

6. Add environment variables (see below)
7. Click "Deploy"

#### Option B: Vercel CLI

1. Install Vercel CLI:
\`\`\`bash
npm i -g vercel
\`\`\`

2. Login:
\`\`\`bash
vercel login
\`\`\`

3. Deploy:
\`\`\`bash
vercel
\`\`\`

4. Follow prompts and add environment variables

### Step 4: Configure Environment Variables

In Vercel dashboard, go to Settings > Environment Variables and add:

\`\`\`
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Groq AI
GROQ_API_KEY=your-groq-api-key

# JWT Secret (generate new one)
JWT_SECRET=your-random-32-char-secret

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
\`\`\`

### Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed:
   - A record: 76.76.21.21
   - CNAME: cname.vercel-dns.com
4. Wait for DNS propagation (up to 48 hours)
5. SSL certificate auto-generated

### Step 6: Post-Deployment Configuration

#### Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: `https://your-domain.com/sitemap.xml`

#### Google Analytics

1. Create GA4 property
2. Get Measurement ID
3. Add to environment variables
4. Redeploy

#### Test Everything

1. Homepage loads correctly
2. Navigation works
3. Search functionality
4. AI Battle generates comparisons
5. Admin login works
6. Comparison pages load
7. Sitemap accessible
8. robots.txt accessible

## Monitoring

### Vercel Analytics

- Automatically enabled
- View in Vercel dashboard
- Real-time visitor data
- Performance metrics

### Google Analytics

- Track page views
- Monitor user behavior
- Conversion tracking
- Custom events

### Error Monitoring

Check Vercel logs:
\`\`\`bash
vercel logs your-deployment-url
\`\`\`

Or in dashboard: Deployments > [Your Deployment] > Logs

## Maintenance

### Regular Tasks

**Daily:**
- Check error logs
- Monitor admin dashboard
- Review pending comparisons

**Weekly:**
- Review analytics
- Check performance metrics
- Update content if needed

**Monthly:**
- Database backup
- Security updates
- Dependency updates

### Updating the Site

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Vercel auto-deploys
5. Verify deployment successful

### Rolling Back

If deployment fails:
1. Go to Vercel dashboard
2. Deployments tab
3. Find previous working deployment
4. Click "..." > "Promote to Production"

## Scaling

### Performance Optimization

- Enable Vercel Edge Network
- Use Vercel Image Optimization
- Implement caching strategies
- Optimize database queries

### Database Scaling

- Upgrade Supabase plan if needed
- Add database indexes
- Implement connection pooling
- Consider read replicas

### Cost Management

- Monitor Vercel usage
- Check Supabase bandwidth
- Review Groq API usage
- Optimize API calls

## Troubleshooting

### Build Fails

\`\`\`bash
# Clear cache and rebuild
vercel --force

# Check build logs
vercel logs --follow
\`\`\`

### Environment Variables Not Working

- Ensure variables are set for Production
- Redeploy after adding variables
- Check variable names match code

### Database Connection Issues

- Verify Supabase credentials
- Check RLS policies
- Ensure service role key is correct

### Domain Not Working

- Check DNS propagation: `dig your-domain.com`
- Verify DNS records
- Wait up to 48 hours
- Contact domain registrar if issues persist

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate keys regularly** - Update JWT secret, API keys
3. **Monitor logs** - Check for suspicious activity
4. **Keep dependencies updated** - Run `npm audit`
5. **Use strong passwords** - For admin accounts
6. **Enable 2FA** - On Vercel, Supabase, GitHub

## Support

If you encounter issues:

1. Check Vercel logs
2. Review Supabase logs
3. Test locally first
4. Check GitHub issues
5. Contact support

## Success Checklist

After deployment, verify:

- [ ] Site loads at production URL
- [ ] All pages accessible
- [ ] AI Battle works
- [ ] Admin login successful
- [ ] Database connections work
- [ ] Analytics tracking
- [ ] Sitemap indexed
- [ ] SSL certificate active
- [ ] Custom domain working (if applicable)
- [ ] Error monitoring active
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] SEO meta tags present

Congratulations! Your Products VS site is now live!
