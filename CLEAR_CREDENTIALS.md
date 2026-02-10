# Clear GitHub Credentials - Step by Step

## The Problem
Git is using cached credentials for `OskarHU04` but you need to push as `OskarHUKIT`.

## Solution: Clear Credentials and Use Personal Access Token

### Step 1: Clear Windows Credential Manager

**Option A: Using GUI**
1. Press `Win + R`
2. Type: `control /name Microsoft.CredentialManager`
3. Press Enter
4. Click "Windows Credentials"
5. Find any entries with "github.com" or "git:https://github.com"
6. Click on them → Click "Remove"
7. Close the window

**Option B: Using Command Line**
```powershell
# List GitHub credentials
cmdkey /list | Select-String "github"

# Remove GitHub credentials (replace with actual credential name if found)
cmdkey /delete:git:https://github.com
```

### Step 2: Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Settings:
   - Note: `app-torget-push`
   - Expiration: 90 days (or your preference)
   - Scopes: ✅ Check `repo` (Full control of private repositories)
4. Click "Generate token"
5. **COPY THE TOKEN** - you won't see it again!

### Step 3: Push with Token

```powershell
cd "c:\Users\oskar\Desktop\app torget"
git push -u origin main
```

When prompted:
- **Username**: `OskarHUKIT`
- **Password**: Paste your Personal Access Token (the long string you copied)

---

## Alternative: Use SSH Instead

If tokens don't work, use SSH:

### 1. Generate SSH Key
```powershell
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter 3 times (accept defaults, no passphrase)
```

### 2. Copy Public Key
```powershell
cat ~/.ssh/id_ed25519.pub
# Copy the entire output
```

### 3. Add to GitHub
- Go to: https://github.com/settings/keys
- Click "New SSH key"
- Paste your public key
- Save

### 4. Change Remote to SSH
```powershell
cd "c:\Users\oskar\Desktop\app torget"
git remote set-url origin git@github.com:OskarHUKIT/app-torget.git
git push -u origin main
```

---

## Quick Test

After clearing credentials, test with:
```powershell
git push -u origin main
```

If it still uses wrong account, the credentials weren't fully cleared. Try the GUI method above.
