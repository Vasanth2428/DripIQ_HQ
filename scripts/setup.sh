#!/bin/bash

# AquaSense Quick Setup Script
# This script helps you set up AquaSense for development or deployment

set -e

echo "🌊 Welcome to AquaSense Setup!"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"
        
        # Check if version is 18 or higher
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            print_error "Node.js version 18 or higher is required. Current version: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing project dependencies..."
    npm install
    print_status "Dependencies installed successfully"
}

# Setup environment variables
setup_env() {
    if [ ! -f ".env.local" ]; then
        print_info "Setting up environment variables..."
        cp .env.example .env.local
        print_status "Environment file created: .env.local"
        print_warning "Please edit .env.local with your actual API keys and configuration"
    else
        print_status "Environment file already exists: .env.local"
    fi
}

# Setup Supabase (if CLI is available)
setup_supabase() {
    if command -v supabase &> /dev/null; then
        print_info "Supabase CLI detected. Setting up database..."
        
        read -p "Do you want to set up the Supabase database? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Linking to Supabase project..."
            read -p "Enter your Supabase project reference ID: " PROJECT_REF
            
            if [ ! -z "$PROJECT_REF" ]; then
                supabase link --project-ref $PROJECT_REF
                print_info "Running database migrations..."
                supabase db push
                print_info "Seeding database with sample data..."
                supabase db reset --linked
                print_status "Supabase database setup complete"
            else
                print_warning "Skipping Supabase setup - no project reference provided"
            fi
        fi
    else
        print_warning "Supabase CLI not found. Install it with: npm install -g supabase"
        print_info "You can set up the database manually using the Supabase dashboard"
    fi
}

# Build the project
build_project() {
    print_info "Building the project..."
    npm run build
    print_status "Project built successfully"
}

# Start development server
start_dev() {
    read -p "Do you want to start the development server? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Starting development server..."
        print_status "AquaSense will be available at http://localhost:5173"
        npm run dev
    fi
}

# Main setup flow
main() {
    echo
    print_info "Checking system requirements..."
    check_node
    check_npm
    
    echo
    print_info "Setting up project..."
    install_dependencies
    setup_env
    
    echo
    setup_supabase
    
    echo
    print_info "Testing build process..."
    build_project
    
    echo
    print_status "Setup complete! 🎉"
    echo
    print_info "Next steps:"
    echo "1. Edit .env.local with your API keys"
    echo "2. Set up your Supabase project (if not done already)"
    echo "3. Run 'npm run dev' to start development"
    echo "4. Visit http://localhost:5173 to see AquaSense"
    echo
    print_info "For deployment instructions, see DEPLOYMENT.md"
    echo "For map integration, see MAP_INTEGRATION.md"
    
    start_dev
}

# Run main function
main