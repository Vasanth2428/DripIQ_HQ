# Fountain Command Center Deployment Script
# This script helps you deploy your application to Vercel

Write-Host "🚀 Fountain Command Center Deployment Script" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI installation..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI is installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Build the project
Write-Host "Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please check for errors." -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "Follow the prompts to complete deployment." -ForegroundColor Cyan
vercel

Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "Don't forget to set environment variables in your Vercel dashboard:" -ForegroundColor Yellow
Write-Host "- VITE_SUPABASE_URL" -ForegroundColor Cyan
Write-Host "- VITE_SUPABASE_ANON_KEY" -ForegroundColor Cyan
