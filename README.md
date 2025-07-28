# Crypto Crash Game Backend

This is a backend implementation of a real-time "Crash" game using Node.js, Express, MongoDB, and WebSockets.

## 📦 Features

- Crash multiplier increases exponentially
- Real-time WebSocket multiplier updates
- Provably fair crash algorithm
- USD to BTC/ETH conversion using CoinGecko API
- Simulated wallet system
- MongoDB for persistence

## 🔧 Setup

1. `npm install`
2. Configure `.env`
3. Start MongoDB locally
4. Run server: `node server.js`

## 📡 API Endpoints

- `POST /api/game/bet` — Place a bet
- `POST /api/game/cashout` — Cash out
- `GET /api/wallet/:userId` — Get wallet

## 💬 WebSocket Events

- `round_start` — new round started
- `multiplier_update` — current multiplier
- `round_crash` — round ended
- `cashout_received` — cashout confirmed

## 📁 Sample WebSocket Client

Open `public/client.html` in browser to test.

---

✅ Developed for backend assignment. Production-ready, testable, and provably fair.
