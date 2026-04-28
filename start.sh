#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR/backend"

echo "================================"
echo "  EduCode Backend + Tunnel"
echo "================================"

# Port 8080 ni bo'shatish
echo "Port tozalanmoqda..."
pkill -f "tsx src/index.ts" 2>/dev/null
pkill -f "npx tsx" 2>/dev/null
pkill -f "ngrok http" 2>/dev/null
kill -9 $(lsof -ti :8080) 2>/dev/null
sleep 2

# Backend ishga tushirish
echo "Backend ishga tushirilmoqda..."
CORS_ORIGINS="*" \
NODE_ENV=production \
npx tsx src/index.ts > /tmp/educode-backend.log 2>&1 &
BACKEND_PID=$!

sleep 5

if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "XATO: Backend ishlamadi. Log:"
  tail -15 /tmp/educode-backend.log
  exit 1
fi
echo "Backend ishlayapti (PID: $BACKEND_PID)"

# Ngrok — browser warning ni o'tkazib yuborish uchun header qo'shiladi
echo "Ngrok tunnel ochilmoqda..."
ngrok http 8080 \
  --domain=strangely-dropper-unawake.ngrok-free.dev \
  --authtoken=3CzaR02IMeu6cDo3eAyq35p8qg6_2ThQDLSSfFGXvHeA8dj3u \
  --request-header-add="ngrok-skip-browser-warning:true" \
  --log=stdout > /tmp/educode-ngrok.log 2>&1 &

sleep 3

echo ""
echo "================================"
echo "  TAYYOR!"
echo "  https://strangely-dropper-unawake.ngrok-free.dev"
echo "================================"
