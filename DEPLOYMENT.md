# Deployment Guide for Fountain Command Center

## 🏗️ Architecture Overview

Your application uses a **hybrid architecture**:
- **Frontend**: React + Vite (deployed on hosting platform)
- **Backend**: Supabase (cloud-hosted database, auth, real-time)
- **Future AI**: Can be integrated via API routes or external services

## Prerequisites
Before deploying, ensure you have:
1. ✅ Supabase database set up and running
2. ✅ All environment variables configured
3. ✅ Application tested locally (`npm run dev`)

## Deployment Options

### Option 1: Vercel + Supabase + AI Integration (Recommended)

**Why Vercel?**
- Perfect for React/Vite applications
- Built-in API routes for future AI integration
- Automatic deployments from Git
- Serverless functions for AI APIs
- Free tier available

**Architecture:**
```
Frontend (Vercel) ←→ API Routes (Vercel Functions) ←→ AI Services
       ↓
   Supabase (Database, Auth, Real-time)
```

**Steps:**
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Set environment variables (see below)

4. **Set Environment Variables in Vercel Dashboard:**
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

5. **Future AI Integration:**
   Create `api/ai-predictions.js` in your project:
   ```javascript
   export default async function handler(req, res) {
     // AI integration logic here
     res.status(200).json({ prediction: 'AI result' });
   }
   ```

### Option 2: Railway (Full-Stack Platform)

**Why Railway?**
- Full-stack deployment (frontend + backend)
- Built-in database support
- Easy environment management
- Perfect for AI integration
- Automatic scaling

**Steps:**
1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set environment variables:**
   ```bash
   railway variables set VITE_SUPABASE_URL=https://cwuaxzahsbgzqobqbeph.supabase.co
   railway variables set VITE_SUPABASE_ANON_KEY=your_key_here
   ```

### Option 3: Render (Full-Stack Platform)

**Why Render?**
- Full-stack deployment
- Automatic scaling
- Easy database integration
- Good for AI workloads
- Free tier available

**Steps:**
1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure build settings:**
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. **Set environment variables in Render dashboard**

### Option 4: Netlify (Frontend + Functions)

**Why Netlify?**
- Great for frontend deployment
- Built-in serverless functions for AI
- Easy environment management
- Good integration with Supabase

**Steps:**
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Set environment variables in Netlify dashboard**

### Option 5: AWS Amplify (Full-Stack)

**Why AWS Amplify?**
- Full-stack deployment
- Built-in AI services (SageMaker, Rekognition, etc.)
- Scalable infrastructure
- Good for enterprise applications

**Steps:**
1. **Install Amplify CLI:**
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Initialize and deploy:**
   ```bash
   amplify init
   amplify add hosting
   amplify publish
   ```

## Environment Variables Setup

### For Production Deployment

You'll need to set these environment variables in your deployment platform:

```bash
VITE_SUPABASE_URL=https://cwuaxzahsbgzqobqbeph.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dWF4emFoc2JnenFvYnFiZXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MzY1MTUsImV4cCI6MjA3MDIxMjUxNX0.Fy8t_lHV3CwpymgenyyE7P8fFQNGHGQGN3OedCm5VGI
```

### For Local Development

Create `.env.local`:
```bash
VITE_SUPABASE_URL=https://cwuaxzahsbgzqobqbeph.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dWF4emFoc2JnenFvYnFiZXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MzY1MTUsImV4cCI6MjA3MDIxMjUxNX0.Fy8t_lHV3CwpymgenyyE7P8fFQNGHGQGN3OedCm5VGI
```

## AI Integration Planning

### Option A: Vercel API Routes (Recommended)
Create `api/` folder in your project:
```
api/
├── ai-predictions.js     # AI predictions endpoint
├── maintenance-ai.js     # Maintenance recommendations
└── sensor-analysis.js    # Sensor data analysis
```

### Option B: External AI Services
- **OpenAI API**: For natural language processing
- **Google Cloud AI**: For predictive analytics
- **AWS SageMaker**: For custom ML models
- **Hugging Face**: For pre-trained models

### Option C: Supabase Edge Functions
```bash
supabase functions new ai-predictions
```

## Pre-Deployment Checklist

### 1. Database Setup
- [ ] Run Supabase migrations: `supabase db push`
- [ ] Seed database: `supabase db reset`
- [ ] Generate types: `supabase gen types typescript --local > src/integrations/supabase/types.ts`

### 2. Code Quality
- [ ] Run tests: `npm test` (if configured)
- [ ] Check for TypeScript errors: `npm run type-check`
- [ ] Build locally: `npm run build`

### 3. Environment Variables
- [ ] ✅ Update `src/integrations/supabase/client.ts` to use environment variables
- [ ] Set environment variables in deployment platform
- [ ] ✅ Remove hardcoded API keys (FIXED)

### 4. Security (CRITICAL)
- [ ] ✅ Fix API key exposure (FIXED)
- [ ] ✅ Configure proper CORS policies (FIXED)
- [ ] ✅ Add input validation to API routes (FIXED)
- [ ] ✅ Add security headers (vercel.json, netlify.toml)
- [ ] Update CORS allowed origins with your actual domain
- [ ] Review security audit report: `SECURITY_AUDIT.md`

### 5. Performance
- [ ] Optimize images and assets
- [ ] Enable compression in deployment platform
- [ ] Set up CDN if needed

## Post-Deployment

### 1. Testing
- [ ] Test all major features
- [ ] Verify real-time data updates
- [ ] Check mobile responsiveness
- [ ] Test authentication flows

### 2. Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Monitor Supabase usage
- [ ] Set up uptime monitoring

### 3. Security
- [ ] Review Supabase RLS policies
- [ ] Ensure environment variables are secure
- [ ] Set up proper CORS if needed

## Quick Start: Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - Go to your project settings
   - Add environment variables
   - Redeploy

Your app will be live at `https://your-project.vercel.app`

## Troubleshooting

### Common Issues:
1. **Build fails:** Check TypeScript errors and missing dependencies
2. **Environment variables not working:** Ensure they're set in deployment platform
3. **Supabase connection fails:** Verify URL and keys are correct
4. **Real-time not working:** Check Supabase real-time settings

### Support:
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Netlify: https://docs.netlify.com
- Supabase: https://supabase.com/docs

## Next Steps After Deployment

1. **Set up custom domain** (optional)
2. **Configure SSL certificate** (usually automatic)
3. **Set up CI/CD pipeline** for automatic deployments
4. **Monitor performance** and user analytics
5. **Plan for scaling** as your user base grows
6. **Integrate AI services** for enhanced functionality
