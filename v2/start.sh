#!/bin/bash
# Start script for EGC Portfolio v2
# Kills processes on ports 3000 and 8000, then starts both servers

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the v2 directory
cd "$SCRIPT_DIR"

# Kill any processes on ports 3000 and 8000 (force kill)
echo "Cleaning up ports 3000 and 8000..."
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
lsof -ti :8000 | xargs kill -9 2>/dev/null || true

# Wait a moment for ports to clear
sleep 1

# Start PHP API server in background
echo "Starting PHP API server on port 8000..."
php -S localhost:8000 -t api > /dev/null 2>&1 &

# Wait a moment for API to start
sleep 1

# Start React dev server
echo "Starting React dev server on port 3000..."
BROWSER=none npm run start:react
