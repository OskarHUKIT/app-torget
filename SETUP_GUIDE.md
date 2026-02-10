# Setup Guide for App Torget

This guide explains what you need to configure in Supabase, GitHub, and Vercel before we can deploy the app.

## 📦 Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in:
   - **Project Name**: `app-torget` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes 2-3 minutes)

### 2. Get Supabase Credentials
Once project is created:
1. Go to **Settings** → **API**
2. Copy these values (we'll use them as environment variables):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (keep secret! Only for server-side)

### 3. Create Storage Bucket
1. Go to **Storage** in left sidebar
2. Click "New bucket"
3. Name: `apps`
4. **Public bucket**: ✅ Check this (apps need to be publicly accessible)
5. Click "Create bucket"

### 4. Set Up Database Tables
We'll create the tables via SQL migration files. The code will include instructions, but you can also:
1. Go to **SQL Editor** in Supabase
2. Run the migration SQL (will be in `supabase/migrations/001_initial_schema.sql`)

### 5. Configure Authentication (Optional - for later)
- Email auth is enabled by default
- You can add OAuth providers (Google, GitHub, etc.) in **Authentication** → **Providers** if needed

---

## 🐙 GitHub Setup

### 1. Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click "New repository"
3. Fill in:
   - **Repository name**: `app-torget`
   - **Visibility**: Public or Private (your choice)
   - **Initialize**: Don't initialize with README (we'll create files)
4. Click "Create repository"

### 2. Get GitHub Personal Access Token (for GitHub repo downloads)
If you want users to upload apps via GitHub repos:
1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click "Generate new token (classic)"
3. Name: `app-torget-github`
4. Select scopes:
   - ✅ `public_repo` (to read public repositories)
   - ✅ `repo` (if you want private repo support)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

**Note**: This is optional - only needed if you want GitHub repo upload functionality.

---

## 🚀 Vercel Setup

### 1. Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Connect your GitHub account when prompted

### 2. Prepare for Deployment
Once code is ready:
1. Push code to your GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service_role key (for server-side)
   - `GITHUB_TOKEN` = Your GitHub token (if using GitHub uploads)
6. Click "Deploy"

### 3. Configure Custom Domain (Optional)
- After deployment, you can add a custom domain in **Settings** → **Domains**
- Example: `apptorget.com` or `app-torget.vercel.app`

---

## 🔑 Environment Variables Summary

You'll need these in Vercel (and locally in `.env.local`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... (server-side only)

# GitHub (optional - for GitHub repo uploads)
GITHUB_TOKEN=ghp_...

# App Config
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## ✅ Quick Checklist

- [ ] Supabase project created
- [ ] Supabase credentials copied (URL, anon key, service_role key)
- [ ] Supabase Storage bucket `apps` created (public)
- [ ] GitHub repository created
- [ ] GitHub token created (optional)
- [ ] Vercel account ready
- [ ] Environment variables ready to add

---

## 🚦 Next Steps

Once you've completed the Supabase setup (at minimum), I can:
1. Initialize the Next.js project
2. Set up the database schema
3. Configure Supabase client
4. Start building features

**You can start with just Supabase setup** - GitHub and Vercel can be configured later when we're ready to deploy!
