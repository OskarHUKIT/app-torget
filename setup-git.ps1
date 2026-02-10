# Git Setup Script for App Torget
# Run this script to initialize git and prepare for GitHub

Write-Host "=== App Torget Git Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git is not installed. Please install Git first:" -ForegroundColor Red
    Write-Host "   Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Navigate to project directory
$projectPath = "c:\Users\oskar\Desktop\app torget"
Set-Location $projectPath
Write-Host "Working in: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Check if already a git repository
if (Test-Path ".git") {
    Write-Host "Git repository already initialized" -ForegroundColor Yellow
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 0
    }
} else {
    # Initialize git
    Write-Host "Initializing git repository..." -ForegroundColor Cyan
    git init
    Write-Host "Git repository initialized" -ForegroundColor Green
}

# Add all files
Write-Host ""
Write-Host "Adding files to git..." -ForegroundColor Cyan
git add .
Write-Host "Files added" -ForegroundColor Green

# Create initial commit
Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit - App Torget marketplace"
Write-Host "Initial commit created" -ForegroundColor Green

# Ask for GitHub repository URL
Write-Host ""
Write-Host "=== GitHub Repository Setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com and create a new repository" -ForegroundColor White
Write-Host "2. Name it app-torget (or your preferred name)" -ForegroundColor White
Write-Host "3. DO NOT initialize with README" -ForegroundColor White
Write-Host "4. Copy the repository URL" -ForegroundColor White
Write-Host ""
$repoUrl = Read-Host "Paste your GitHub repository URL here (or press Enter to skip)"

if ($repoUrl) {
    Write-Host ""
    Write-Host "Adding GitHub remote..." -ForegroundColor Cyan
    git remote add origin $repoUrl
    Write-Host "Remote added" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git branch -M main
    git push -u origin main
    Write-Host ""
    Write-Host "Code pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Skipping GitHub push. You can do it manually later:" -ForegroundColor Yellow
    Write-Host "   git remote add origin YOUR_REPO_URL" -ForegroundColor White
    Write-Host "   git branch -M main" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com and sign up/login" -ForegroundColor White
Write-Host "2. Click Add New Project" -ForegroundColor White
Write-Host "3. Import your GitHub repository" -ForegroundColor White
Write-Host "4. Add environment variables (see DEPLOYMENT_GUIDE.md)" -ForegroundColor White
Write-Host "5. Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
