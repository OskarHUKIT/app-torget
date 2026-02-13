# Detailed Supabase Setup Steps

## Step 1: Create Storage Bucket

1. **Log into Supabase Dashboard**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Sign in to your account

2. **Select Your Project**
   - Click on your project name (or create one if you haven't)

3. **Navigate to Storage**
   - Look at the left sidebar menu
   - Click on **"Storage"** (it has a folder icon)

4. **Create New Bucket**
   - You'll see a button that says **"New bucket"** or **"Create bucket"** (usually at the top right)
   - Click it

5. **Configure the Bucket**
   - **Name**: Type `apps` (lowercase, no spaces)
   - **Public bucket**: ✅ **CHECK THIS BOX** (very important!)
     - This makes files accessible via public URLs
   - **File size limit**: Leave default or set to your preference
   - **Allowed MIME types**: Leave empty (allows all file types)

6. **Create**
   - Click **"Create bucket"** or **"Save"**
   - You should see the bucket appear in your storage list

---

## Step 2: Run Database Migration

### Option A: Using SQL Editor (Recommended)

1. **Open SQL Editor**
   - In the left sidebar, click **"SQL Editor"** (has a `</>` icon)
   - Or go to: **SQL Editor** → **New query**

2. **Open the Migration File**
   - Open the file `supabase/migrations/001_initial_schema.sql` in your code editor
   - Select ALL the contents (Ctrl+A or Cmd+A)
   - Copy it (Ctrl+C or Cmd+C)

3. **Paste into SQL Editor**
   - Click in the SQL Editor text area
   - Paste the SQL code (Ctrl+V or Cmd+V)
   - You should see all the SQL statements

4. **Run the Migration**
   - Click the **"Run"** button (usually bottom right, or press `Ctrl+Enter` / `Cmd+Enter`)
   - Wait a few seconds

5. **Check for Success**
   - You should see a green success message: **"Success. No rows returned"**
   - If you see errors (red text), let me know what they say!

### Additional Migration: Add Link Support (002)

If you already ran `001_initial_schema.sql` and want to support "Add Link" (external URLs like itch.io):

1. Open `supabase/migrations/002_external_link_apps.sql`
2. Copy all contents and paste into SQL Editor
3. Run it
4. This adds the `external_link` upload type and makes `manifest_url` nullable

### Additional Migration: Nytti Content Feed (003)

For the Nytti feed (content table, engagement, profiles):

1. Open `supabase/migrations/003_nytti_content_feed.sql`
2. Copy all contents and paste into SQL Editor
3. Run it
4. This creates `content`, `user_engagement`, `profiles` tables and syncs approved apps to the feed

### EU Data Residency (Important for Nytti)

**When creating your Supabase project**, choose an EU region (e.g. Frankfurt or Stockholm) so all data stays in Europe. Existing projects cannot be migrated to a different region—create a new project in EU if needed.

### Option B: Using Table Editor (Alternative - Manual)

If SQL Editor doesn't work, you can create tables manually:

1. Go to **Table Editor** in left sidebar
2. Click **"New table"**
3. Create the `apps` table with these columns:
   - `id` (uuid, primary key, default: uuid_generate_v4())
   - `name` (text, not null)
   - `description` (text, nullable)
   - `upload_type` (text, not null)
   - `external_url` (text, nullable)
   - ... (this is tedious, use SQL Editor instead!)

---

## Step 3: Verify Everything Worked

### Check Tables Were Created

1. Go to **Table Editor** in left sidebar
2. You should see two tables:
   - ✅ `apps`
   - ✅ `user_favorites`

### Check Storage Bucket

1. Go to **Storage** in left sidebar
2. You should see:
   - ✅ `apps` bucket (with a globe icon if it's public)

### Check RLS Policies

1. Go to **Authentication** → **Policies** (or **Table Editor** → select `apps` table → **Policies** tab)
2. You should see several policies for the `apps` table

---

## Troubleshooting

### "Permission denied" or "RLS policy" errors
- Make sure you ran the entire migration file
- Check that RLS policies were created (scroll down in SQL Editor results)

### "Bucket already exists" error
- The bucket name `apps` is already taken
- Either delete the old one or use a different name (then update code later)

### "Function does not exist" error
- Make sure you copied the ENTIRE migration file
- The file includes `CREATE EXTENSION` and `CREATE FUNCTION` statements

### Can't find SQL Editor
- Look for `</>` icon in left sidebar
- Or try: **Database** → **SQL Editor**

---

## Quick Checklist

- [ ] Storage bucket `apps` created and set to **Public**
- [ ] SQL migration file copied from `supabase/migrations/001_initial_schema.sql`
- [ ] SQL pasted into SQL Editor
- [ ] Migration run successfully (green success message)
- [ ] Tables `apps` and `user_favorites` visible in Table Editor
- [ ] `.env.local` file created with Supabase credentials

---

## Still Stuck?

If you're having trouble:
1. Take a screenshot of the error message
2. Tell me which step you're on
3. Describe what you see in the Supabase dashboard

I can help troubleshoot!
