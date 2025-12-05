# Deployment Guide

Complete guide for deploying the OMEX Admin Dashboard to production.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Backup plan in place

## Environment Variables

Create `.env.production`:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.com
NODE_ENV=production
```

## Build for Production

```bash
# Install dependencies
npm install

# Run type check
npm run type-check

# Build the application
npm run build

# Test production build locally
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended)

**Advantages:**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Automatic deployments from Git
- Built-in analytics

**Steps:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd admin-dashboard
vercel
```

4. **Configure Environment Variables**
```bash
vercel env add NEXT_PUBLIC_MEDUSA_BACKEND_URL production
```

5. **Deploy to Production**
```bash
vercel --prod
```

**vercel.json Configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_MEDUSA_BACKEND_URL": "@medusa-backend-url"
  }
}
```

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the application**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod
```

**netlify.toml Configuration:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NEXT_PUBLIC_MEDUSA_BACKEND_URL = "https://your-medusa-backend.com"
```

### Option 3: Docker

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  admin-dashboard:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.com
    restart: unless-stopped
```

**Build and Run:**
```bash
docker build -t omex-admin-dashboard .
docker run -p 3001:3001 -e NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend.com omex-admin-dashboard
```

### Option 4: AWS (EC2 + Nginx)

**Steps:**

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro or larger
   - Open ports 80, 443, 22

2. **Connect and Setup**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

3. **Deploy Application**
```bash
# Clone repository
git clone your-repo-url
cd admin-dashboard

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "admin-dashboard" -- start
pm2 save
pm2 startup
```

4. **Configure Nginx**
```nginx
# /etc/nginx/sites-available/admin-dashboard
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/admin-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **Setup SSL with Let's Encrypt**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 5: DigitalOcean App Platform

**Steps:**

1. **Create app.yaml**
```yaml
name: omex-admin-dashboard
services:
  - name: web
    github:
      repo: your-username/your-repo
      branch: main
      deploy_on_push: true
    build_command: npm run build
    run_command: npm start
    envs:
      - key: NEXT_PUBLIC_MEDUSA_BACKEND_URL
        value: https://your-medusa-backend.com
    http_port: 3001
```

2. **Deploy via CLI**
```bash
doctl apps create --spec app.yaml
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check if site is accessible
curl https://your-domain.com

# Check API connectivity
curl https://your-domain.com/api/health
```

### 2. Setup Monitoring

**Vercel Analytics:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Custom Monitoring:**
```typescript
// lib/monitoring.ts
export const logError = (error: Error, context?: any) => {
  // Send to your monitoring service
  console.error('Error:', error, context)
  
  // Example: Send to Sentry
  // Sentry.captureException(error, { extra: context })
}
```

### 3. Setup Logging

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data)
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data)
  },
}
```

### 4. Configure CDN

For static assets, use a CDN:

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn.com'],
  },
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.your-domain.com' 
    : '',
}
```

### 5. Setup Backups

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/admin-dashboard"

# Create backup
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz /path/to/admin-dashboard

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
```

## Performance Optimization

### 1. Enable Compression

```javascript
// next.config.js
module.exports = {
  compress: true,
}
```

### 2. Optimize Images

```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/product.jpg"
  width={500}
  height={500}
  alt="Product"
  loading="lazy"
/>
```

### 3. Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
})
```

### 4. Caching Strategy

```typescript
// API route with caching
export async function GET(request: Request) {
  const data = await fetchData()
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  })
}
```

## Security Hardening

### 1. Security Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ]
  },
}
```

### 2. Environment Variables

Never commit sensitive data:

```bash
# .gitignore
.env
.env.local
.env.production
.env.*.local
```

### 3. Rate Limiting

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip ?? 'unknown'
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 100
  
  const requests = rateLimit.get(ip) || []
  const recentRequests = requests.filter((time: number) => now - time < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  recentRequests.push(now)
  rateLimit.set(ip, recentRequests)
  
  return NextResponse.next()
}
```

## Rollback Plan

### Quick Rollback

**Vercel:**
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

**Docker:**
```bash
# Keep previous image
docker tag omex-admin-dashboard:latest omex-admin-dashboard:backup

# Rollback
docker stop admin-dashboard
docker run -d --name admin-dashboard omex-admin-dashboard:backup
```

**PM2:**
```bash
# Revert code
git reset --hard HEAD~1

# Rebuild
npm run build

# Restart
pm2 restart admin-dashboard
```

## Maintenance Mode

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'
  
  if (maintenanceMode && !request.nextUrl.pathname.startsWith('/maintenance')) {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }
  
  return NextResponse.next()
}
```

## Monitoring & Alerts

### Setup Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    // Check external services
    
    return Response.json({ status: 'healthy' })
  } catch (error) {
    return Response.json({ status: 'unhealthy' }, { status: 500 })
  }
}
```

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

## Support & Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**Port Already in Use:**
```bash
# Find process
lsof -i :3001

# Kill process
kill -9 [PID]
```

**Environment Variables Not Loading:**
```bash
# Verify .env file
cat .env

# Restart application
pm2 restart admin-dashboard
```

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
version: '3.8'

services:
  admin-dashboard:
    image: omex-admin-dashboard
    deploy:
      replicas: 3
    ports:
      - "3001-3003:3001"
```

### Load Balancer (Nginx)

```nginx
upstream admin_dashboard {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    listen 80;
    location / {
        proxy_pass http://admin_dashboard;
    }
}
```

## Cost Optimization

- Use CDN for static assets
- Enable caching
- Optimize images
- Use serverless for low traffic
- Monitor usage and scale accordingly

## Checklist Before Going Live

- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Database backups configured
- [ ] Monitoring enabled
- [ ] Error tracking setup
- [ ] Performance tested
- [ ] Security audit passed
- [ ] Documentation complete
- [ ] Team trained
- [ ] Rollback plan tested
