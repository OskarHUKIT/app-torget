# GitHub & Vercel Deployment Guide

This guide will walk you through deploying App Torget to Vercel via GitHub.

## Prerequisites

- ✅ Supabase project set up
- ✅ `.env.local` file configured
- ✅ Code ready to deploy

---

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website

1. **Go to GitHub**
   - Visit [github.com](https://github.com) and sign in
   - Click the **"+"** icon in top right → **"New repository"**

2. **Create Repository**
   - **Repository name**: `app-torget` (or your preferred name)
   - **Description**: "Web App Marketplace - PWA Discovery Platform"
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize with README" (we already have files)
   - Click **"Create repository"**

3. **Copy Repository URL**
   - GitHub will show you commands - copy the repository URL
   - It looks like: `https://github.com/yourusername/app-torget.git`

### Option B: Using GitHub CLI (if installed)

```bash
cd "c:\Users\oskar\Desktop\app torget"
gh repo create app-torget --public --source=. --remote=origin --push
```

---

## Step 2: Push Code to GitHub

### Initialize Git (if not already done)

```powershell
cd "c:\Users\oskar\Desktop\app torget"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - App Torget marketplace"

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/app-torget.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys

---

## Step 3: Connect to Vercel

### 1. Sign Up/Login to Vercel

- Go to [vercel.com](https://vercel.com)
- Click **"Sign Up"** or **"Log In"**
- Choose **"Continue with GitHub"** (recommended - easier integration)

### 2. Import Project

- Once logged in, click **"Add New..."** → **"Project"**
- You'll see your GitHub repositories
- Find `app-torget` and click **"Import"**

### 3. Configure Project

Vercel will auto-detect Next.js. You'll see:

**Framework Preset**: Next.js (auto-detected) ✅

**Root Directory**: `./` (leave as is)

**Build Command**: `npm run build` (auto-filled) ✅

**Output Directory**: `.next` (auto-filled) ✅

**Install Command**: `npm install` (auto-filled) ✅

Click **"Deploy"** (we'll add environment variables next)

---

## Step 4: Add Environment Variables in Vercel

### After First Deployment

1. **Go to Project Settings**
   - Click on your project name in Vercel dashboard
   - Go to **"Settings"** tab
   - Click **"Environment Variables"** in left sidebar

2. **Add Each Variable**

Click **"Add New"** for each variable:

```env
NEXT_PUBLIC_SUPABASE_URL
```
- Value: Your Supabase Project URL
- Environment: Production, Preview, Development (select all)

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
- Value: Your Supabase anon/public key
- Environment: Production, Preview, Development (select all)

```env
SUPABASE_SERVICE_ROLE_KEY
```
- Value: Your Supabase service_role key
- Environment: Production, Preview, Development (select all)

```env
NEXT_PUBLIC_APP_URL
```
- Value: Your Vercel deployment URL (e.g., `https://app-torget.vercel.app`)
- Environment: Production, Preview, Development (select all)

```env
GITHUB_TOKEN (Optional)
```
- Value: Your GitHub Personal Access Token (only if using GitHub repo uploads)
- Environment: Production, Preview, Development (select all)

### 3. Redeploy

After adding environment variables:
- Go to **"Deployments"** tab
- Click the **"..."** menu on the latest deployment
- Click **"Redeploy"**
- Or push a new commit to trigger automatic deployment

---

## Step 5: Verify Deployment

1. **Check Deployment Status**
   - Go to **"Deployments"** tab
   - Wait for build to complete (usually 1-2 minutes)
   - Status should show **"Ready"** ✅

2. **Visit Your Site**
   - Click on the deployment
   - Click **"Visit"** or use the URL shown
   - Your app should be live!

3. **Test the App**
   - Try signing up/login
   - Test uploading an app
   - Check if everything works

---

## Step 6: Set Up Custom Domain (Optional)

1. **Go to Settings → Domains**
2. **Add Domain**
   - Enter your domain (e.g., `apptorget.com`)
   - Follow Vercel's DNS configuration instructions
3. **Update Environment Variable**
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain

---

## Step 7: Enable Automatic Deployments

### Automatic Deployments are Already Enabled!

- ✅ Every push to `main` branch → Production deployment
- ✅ Every push to other branches → Preview deployment
- ✅ Pull Requests → Preview deployment

### To Deploy Updates:

Just push to GitHub:
```powershell
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically deploy! 🚀

---

## Troubleshooting

### Build Fails

**Error: "Environment variable not found"**
- Fix: Make sure all environment variables are added in Vercel
- Make sure they're enabled for the correct environments

**Error: "Module not found"**
- Fix: Check `package.json` has all dependencies
- Make sure `node_modules` is NOT committed (it's in `.gitignore`)

**Error: "Build timeout"**
- Fix: Check for infinite loops or heavy operations in build
- Vercel has a 45-minute timeout

### Deployment Works But App Doesn't

**"Cannot connect to Supabase"**
- Fix: Check environment variables are correct
- Make sure Supabase project is active (not paused)

**"Database error"**
- Fix: Make sure database migration has been run
- Check RLS policies are set up correctly

**"Storage bucket not found"**
- Fix: Create the `apps` bucket in Supabase Storage
- Make sure it's set to Public

---

## Quick Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Environment variables added in Vercel
- [ ] First deployment successful
- [ ] App tested and working
- [ ] Custom domain configured (optional)

---

## Next Steps

1. **Set up GitHub Actions** (optional) - for CI/CD
2. **Configure Analytics** - Add Vercel Analytics
3. **Set up Monitoring** - Add error tracking (Sentry, etc.)
4. **Optimize Performance** - Add caching, CDN, etc.

---

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)

Good luck with your deployment! 🚀
