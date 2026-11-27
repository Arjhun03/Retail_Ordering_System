#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================================="
echo "🚀 Starting Retail Ordering System (Backend + Frontend)"
echo "=========================================================="

# 1. Clean up stale processes on ports 5223, 7282, 4200
echo "🧹 Checking and freeing ports 5223, 7282, 4200..."
lsof -ti :5223 -ti :7282 -ti :4200 | xargs kill -9 2>/dev/null || true

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  echo "🛑 Shutting down Retail Ordering System..."
  if [ -n "$BACKEND_PID" ]; then
    kill -9 "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill -9 "$FRONTEND_PID" 2>/dev/null || true
  fi
  lsof -ti :5223 -ti :7282 -ti :4200 | xargs kill -9 2>/dev/null || true
  echo "✅ All services stopped."
  exit 0
}

trap cleanup INT TERM EXIT

# 2. Start .NET Backend Web API
echo "⚙️  Starting .NET Web API on https://localhost:7282 & http://localhost:5223..."
dotnet run --project Retail_Ordering_system.csproj --launch-profile https &
BACKEND_PID=$!

# Wait briefly for backend to bind ports
sleep 3

# 3. Start Angular Frontend
echo "🌐 Starting Angular Frontend on http://localhost:4200..."
(cd frontend && npm start) &
FRONTEND_PID=$!

echo ""
echo "=========================================================="
echo "✨ Services are launching:"
echo "   👉 Frontend UI:     http://localhost:4200"
echo "   👉 Scalar API Docs: https://localhost:7282/scalar/v1"
echo "   👉 Backend API:     https://localhost:7282"
echo "Press Ctrl+C at any time to stop both services."
echo "=========================================================="
echo ""

wait $BACKEND_PID $FRONTEND_PID
