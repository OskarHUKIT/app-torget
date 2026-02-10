# How to Get Supabase Credentials and Set Up .env.local

## Step 1: Get Your Supabase Credentials

### 1. Log into Supabase Dashboard
- Go to [app.supabase.com](https://app.supabase.com)
- Sign in with your account

### 2. Select Your Project
- Click on your project name (the one you created earlier, e.g., "app-torget")

### 3. Navigate to API Settings
- Look at the left sidebar
- Click on **"Settings"** (gear icon)
- Then click on **"API"** (under the Settings section)

### 4. Find Your Credentials

You'll see several sections. Here's what you need:

#### Project URL
- Look for **"Project URL"** section
- Copy the URL (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
- This is your `NEXT_PUBLIC_SUPABASE_URL`

#### Project API keys
- Look for **"Project API keys"** section
- You'll see two keys:

**anon public key:**
- This is the one labeled **"anon"** or **"public"**
- It starts with `eyJ...` (long string)
- This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Safe to expose in client-side code

**service_role key:**
- This is labeled **"service_role"** or **"secret"**
- Also starts with `eyJ...` (different long string)
- This is your `SUPABASE_SERVICE_ROLE_KEY`
- ⚠️ **KEEP THIS SECRET!** Never expose in client-side code

---

## Step 2: Create .env.local File

### Option A: Using Your Code Editor

1. In your project root folder (`c:\Users\oskar\Desktop\app torget`)
2. Create a new file named `.env.local` (exactly this name, with the dot at the start)
3. Copy the template below and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Option B: Using Command Line (PowerShell)

```powershell
cd "c:\Users\oskar\Desktop\app torget"
New-Item -Path ".env.local" -ItemType File
notepad .env.local
```

Then paste the template and fill in your values.

---

## Step 3: Fill In Your Values

Replace the placeholder values with your actual Supabase credentials:

```env
# Replace xxxxxxxxxxxxx with your actual project reference
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Replace with your anon/public key (the long eyJ... string)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Replace with your service_role key (the long eyJ... string)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Keep this as is for local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 4: Verify Your Setup

1. Make sure `.env.local` is in your project root (same folder as `package.json`)
2. Make sure there are **no spaces** around the `=` sign
3. Make sure there are **no quotes** around the values (unless the value itself contains spaces)
4. Save the file

---

## Step 5: Test It Works

1. Restart your development server:
   ```bash
   # Stop the server (Ctrl+C if running)
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. Try signing up or logging in
4. If you see errors, check:
   - Browser console (F12) for client-side errors
   - Terminal for server-side errors
   - That your `.env.local` file has correct values

---

## Visual Guide: Where to Find Credentials

```
Supabase Dashboard
  └─ [Your Project]
      └─ Settings (⚙️ icon)
          └─ API
              ├─ Project URL
              │   └─ Copy this → NEXT_PUBLIC_SUPABASE_URL
              └─ Project API keys
                  ├─ anon public → Copy this → NEXT_PUBLIC_SUPABASE_ANON_KEY
                  └─ service_role → Copy this → SUPABASE_SERVICE_ROLE_KEY
```

---

## Troubleshooting

### "Invalid API key" error
- Double-check you copied the entire key (they're very long!)
- Make sure there are no extra spaces or line breaks
- Make sure you're using the correct key (anon vs service_role)

### "Project not found" error
- Check that your Project URL is correct
- Make sure your project is active (not paused)

### File not found (.env.local)
- Make sure the file is named exactly `.env.local` (with the dot)
- Make sure it's in the project root folder
- On Windows, you might need to create it as `.env.local.` (with dot at end) - Windows will remove the trailing dot

### Changes not taking effect
- Restart your development server after changing `.env.local`
- Make sure you're editing the right file (check the path)

---

## Security Notes

- ✅ `.env.local` is already in `.gitignore` - your secrets are safe
- ✅ Never commit `.env.local` to GitHub
- ✅ The `NEXT_PUBLIC_*` variables are safe to expose (they're meant for client-side)
- ⚠️ The `SUPABASE_SERVICE_ROLE_KEY` should NEVER be exposed in client-side code
- ⚠️ When deploying to Vercel, add these same variables in Vercel's environment variables settings

---

## Quick Copy Template

Copy this and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Good luck! 🚀
