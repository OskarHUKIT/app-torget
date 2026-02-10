# Fix GitHub Authentication Error

## Problem
You're authenticated as `OskarHU04` but trying to push to `OskarHUKIT/app-torget.git`

## Solutions

### Option 1: Use Personal Access Token (Recommended)

1. **Create a Personal Access Token**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Name: `app-torget-push`
   - Select scopes: ✅ `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Update Git Credentials**
   - When you push, Git will ask for username and password
   - Username: `OskarHUKIT` (repository owner)
   - Password: **Paste your Personal Access Token** (not your GitHub password)

3. **Push Again**
   ```powershell
   git push -u origin main
   ```

### Option 2: Update Git Credential Manager

Clear old credentials and use the correct account:

```powershell
# Clear cached credentials
git credential-manager-core erase
# Or on older Windows:
git credential-manager erase

# Then try pushing again - it will prompt for credentials
git push -u origin main
```

### Option 3: Use SSH Instead of HTTPS

1. **Generate SSH Key** (if you don't have one)
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter to accept default location
   # Optionally set a passphrase
   ```

2. **Add SSH Key to GitHub**
   - Copy your public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste the key and save

3. **Change Remote to SSH**
   ```powershell
   git remote set-url origin git@github.com:OskarHUKIT/app-torget.git
   git push -u origin main
   ```

### Option 4: Use Correct Account Credentials

If `OskarHU04` should have access:
- Make sure `OskarHU04` is added as a collaborator to the repository
- Or use `OskarHUKIT` account credentials

---

## Quick Fix (Try This First)

Run this command and use your Personal Access Token when prompted:

```powershell
git push -u origin main
```

When prompted:
- **Username**: `OskarHUKIT`
- **Password**: Your Personal Access Token (not your password!)
