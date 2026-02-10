# Quick Deployment Steps

## 🚀 Fast Track to Deploy

### 1. Initialize Git & Push to GitHub (5 minutes)

**Option A: Use the PowerShell script**
```powershell
cd "c:\Users\oskar\Desktop\app torget"
.\setup-git.ps1
```

**Option B: Manual commands**
```powershell
cd "c:\Users\oskar\Desktop\app torget"

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/app-torget.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel (5 minutes)

1. **Go to [vercel.com](https://vercel.com)** → Sign up/login with GitHub
2. **Click "Add New Project"**
3. **Import** your `app-torget` repository
4. **Click "Deploy"** (don't add env vars yet - we'll do that after)

### 3. Add Environment Variables (2 minutes)

After first deployment:

1. Go to **Project Settings** → **Environment Variables**
2. Add these 4 variables:

```
NEXT_PUBLIC_SUPABASE_URL = (your Supabase URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY = (your anon key)
SUPABASE_SERVICE_ROLE_KEY = (your service_role key)
NEXT_PUBLIC_APP_URL = (your Vercel URL, e.g., https://app-torget.vercel.app)
```

3. **Redeploy** (click "..." on latest deployment → "Redeploy")

### 4. Done! ✅

Your app is now live at `https://app-torget.vercel.app` (or your custom domain)

---

## 🔧 If Something Goes Wrong

**Git push fails?**
- Make sure you have a GitHub Personal Access Token
- Or use SSH keys instead

**Vercel build fails?**
- Check environment variables are set
- Make sure all dependencies are in `package.json`

**App doesn't work?**
- Check Supabase credentials are correct
- Make sure database migration ran
- Check browser console for errors

---

## 📚 Full Guide

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
