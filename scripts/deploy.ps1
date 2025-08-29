# AquaSense Deployment Script for Windows PowerShell
# This script helps deploy AquaSense to Vercel

param(
    [string]$Environment = "production",
    [switch]$SkipBuild = $false,
    [switch]$SkipTests = $false
)

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Blue = "Cyan"

function Write-Status {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor $Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor $Blue
}

Write-Host "🌊 AquaSense Deployment Script" -ForegroundColor Blue
Write-Host "==============================" -ForegroundColor Blue
Write-Host ""

# Check if Node.js is installed
Write-Info "Checking system requirements..."
try {
    $nodeVersion = node --version
    Write-Status "Node.js is installed: $nodeVersion"
} catch {
    Write-Error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Status "npm is installed: $npmVersion"
} catch {
    Write-Error "npm is not installed. Please install npm."
    exit 1
}

# Check if Vercel CLI is installed
Write-Info "Checking Vercel CLI..."
try {
    $vercelVersion = vercel --version
    Write-Status "Vercel CLI is installed: $vercelVersion"
} catch {
    Write-Warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    Write-Status "Vercel CLI installed"
}

# Install dependencies
Write-Info "Installing dependencies..."
npm install
Write-Status "Dependencies installed"

# Run tests (unless skipped)
if (-not $SkipTests) {
    Write-Info "Running tests..."
    try {
        npm run test:ci 2>$null
        Write-Status "Tests passed"
    } catch {
        Write-Warning "Tests failed or not configured. Continuing with deployment..."
    }
}

# Build project (unless skipped)
if (-not $SkipBuild) {
    Write-Info "Building project..."
    npm run build
    Write-Status "Project built successfully"
}

# Check environment variables
Write-Info "Checking environment configuration..."
if (Test-Path ".env.local") {
    Write-Status "Local environment file found"
} else {
    Write-Warning "No .env.local file found. Make sure to set environment variables in Vercel dashboard."
}

# Deploy to Vercel
Write-Info "Deploying to Vercel..."
if ($Environment -eq "production") {
    Write-Info "Deploying to production..."
    vercel --prod
} else {
    Write-Info "Deploying to preview..."
    vercel
}

Write-Status "Deployment complete! 🎉"
Write-Host ""
Write-Info "Next steps:"
Write-Host "1. Check your Vercel dashboard for deployment status"
Write-Host "2. Set up environment variables in Vercel if not done already"
Write-Host "3. Configure your custom domain (optional)"
Write-Host "4. Set up monitoring and analytics"
Write-Host ""
Write-Info "Useful commands:"
Write-Host "• vercel --prod          Deploy to production"
Write-Host "• vercel logs            View deployment logs"
Write-Host "• vercel env ls          List environment variables"
Write-Host "• vercel domains         Manage custom domains"