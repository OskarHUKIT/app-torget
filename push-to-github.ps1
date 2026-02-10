# Script to push to GitHub with proper authentication
# This will prompt you for credentials

Write-Host "=== Push to GitHub ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "You'll be prompted for GitHub credentials:" -ForegroundColor Yellow
Write-Host "  Username: OskarHUKIT" -ForegroundColor White
Write-Host "  Password: Use a Personal Access Token (not your password!)" -ForegroundColor White
Write-Host ""
Write-Host "Don't have a token? Create one at:" -ForegroundColor Yellow
Write-Host "  https://github.com/settings/tokens" -ForegroundColor White
Write-Host "  Select 'repo' scope" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue..."

# Clear any cached credentials
Write-Host ""
Write-Host "Clearing cached credentials..." -ForegroundColor Cyan
git credential-manager-core erase <<< "protocol=https
host=github.com
"

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "When prompted, enter:" -ForegroundColor Yellow
Write-Host "  Username: OskarHUKIT" -ForegroundColor White
Write-Host "  Password: [Your Personal Access Token]" -ForegroundColor White
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Success! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "Next: Deploy to Vercel at https://vercel.com" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Push failed. Make sure you:" -ForegroundColor Red
    Write-Host "1. Have a Personal Access Token" -ForegroundColor Yellow
    Write-Host "2. Use OskarHUKIT as username" -ForegroundColor Yellow
    Write-Host "3. Use the token as password" -ForegroundColor Yellow
}
