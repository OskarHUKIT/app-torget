# Supabase Keys Explained

## Yes! Here's the Mapping:

In Supabase, you'll see different labels, but here's what they correspond to:

### ✅ **anon public key** = **Publishable Key** (Client-Side)
- Also called: "anon", "public", "publishable"
- **Safe to expose** in client-side code
- Used for: Browser/client-side operations
- Goes in: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ⚠️ **service_role key** = **Secret Key** (Server-Side)
- Also called: "service_role", "secret", "service key"
- **MUST KEEP SECRET** - never expose in client-side code
- Used for: Server-side operations, admin tasks
- Goes in: `SUPABASE_SERVICE_ROLE_KEY`

---

## What You'll See in Supabase Dashboard

When you go to **Settings → API**, you'll see:

```
Project API keys
├─ anon public          ← This is your PUBLISHABLE KEY
│   └─ Use this for: Client-side code
│
└─ service_role        ← This is your SECRET KEY
    └─ Use this for: Server-side code (keep secret!)
```

---

## Your .env.local File Should Look Like:

```env
# Publishable Key (anon public) - Safe for client-side
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Secret Key (service_role) - Keep secret!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Quick Reference

| Supabase Label | Common Name | Environment Variable | Safe for Client? |
|---------------|-------------|---------------------|------------------|
| anon public | Publishable Key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes |
| service_role | Secret Key | `SUPABASE_SERVICE_ROLE_KEY` | ❌ No |

---

## How to Identify Them

**Publishable Key (anon):**
- Labeled as "anon", "anon public", or "public"
- Usually shown first in the list
- Has "public" or "anon" in the description
- ✅ Safe to use in browser/client code

**Secret Key (service_role):**
- Labeled as "service_role", "service", or "secret"
- Usually shown second, sometimes with a warning icon
- Has "service_role" or "secret" in the description
- ⚠️ Warning: "Keep this secret" or "Do not expose"

---

## Still Confused?

If you see different labels in your Supabase dashboard:
1. Look for the one that says "public" or "anon" → That's your publishable key
2. Look for the one that says "service" or "secret" → That's your secret key

Both keys will be long strings starting with `eyJ...` - make sure to copy the entire key!
