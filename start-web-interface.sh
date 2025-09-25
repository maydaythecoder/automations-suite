#!/bin/bash

# Automation Suite Web Interface Startup Script - Retro Edition

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║    🎮 AUTOMATION SUITE WEB INTERFACE - RETRO EDITION 🎮     ║"
echo "║                                                              ║"
echo "║    ████████╗██╗   ██╗███████╗███████╗███████╗                ║"
echo "║    ╚══██╔══╝██║   ██║██╔════╝██╔════╝██╔════╝                ║"
echo "║       ██║   ██║   ██║█████╗  █████╗  ███████╗                ║"
echo "║       ██║   ╚██╗ ██╔╝██╔══╝  ██╔══╝  ╚════██║                ║"
echo "║       ██║    ╚████╔╝ ███████╗███████╗███████║                ║"
echo "║       ╚═╝     ╚═══╝  ╚══════╝╚══════╝╚══════╝                ║"
echo "║                                                              ║"
echo "║    🎯 8-BIT STYLE AUTOMATION CONTROL CENTER 🎯              ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Navigate to web interface directory
cd "$(dirname "$0")/web-interface"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in web-interface directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if automation suite is running
echo ""
echo "🔍 Checking automation suite status..."

# Check if automation controller exists
if [ ! -f "../automation-controller.js" ]; then
    echo "⚠️  Warning: automation-controller.js not found"
    echo "   Make sure you're running this from the automation suite root directory"
fi

# Check if config exists
if [ ! -f "../configs/master-config.json" ]; then
    echo "⚠️  Warning: master-config.json not found"
    echo "   Run 'node setup-automations.js' first to set up your automation suite"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║    🚀 STARTING RETRO WEB INTERFACE SERVER 🚀                ║"
echo "║                                                              ║"
echo "║    📊 Dashboard: http://localhost:3000                      ║"
echo "║    🔌 API: http://localhost:3000/api                         ║"
echo "║    📡 WebSocket: ws://localhost:3000                         ║"
echo "║                                                              ║"
echo "║    🎮 FEATURES:                                              ║"
echo "║    • 8-bit retro styling with NES.css                       ║"
echo "║    • Retro sound effects                                     ║"
echo "║    • Scanline effects                                        ║"
echo "║    • Pixel-perfect animations                                ║"
echo "║    • Real-time automation control                           ║"
echo "║                                                              ║"
echo "║    Press Ctrl+C to stop the server                          ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Start the server
npm start