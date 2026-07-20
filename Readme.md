# Nexus Oracle

**A cyberpunk-styled crypto price dashboard with a command palette and a hidden terminal easter egg — my first Next.js project.**

I had a lot of ideas going into this one (a "Web3 predictive engine," whale-transaction tracking, mempool visualization, an AI assistant) — most of that turned out to be bigger than what I actually got built. What's real: a live-updating price ticker dashboard styled like a hacker terminal, with genuinely fun interaction details like a command palette and a secret console.

> **Being upfront about scope:** despite the original framing, there's no blockchain integration here — no on-chain data, no mempool access, no wallet connection. The backend polls a public price API (CryptoCompare) on an interval and charts the result. If you're looking for real blockchain integration in my work, see [LiquidStream](https://github.com/med4ka/liquid-stream-solana), which actually calls a deployed Solana program.

## What's Actually Here

- **Live price dashboard** — backend polls CryptoCompare for a selected coin's USD price on an interval, stores a short time-series in SQLite, frontend renders it with animated Chart.js charts
- **Coin switching** — pick a different coin to track, resets the local history
- **Command palette (`Ctrl+K`)** — quick navigation/actions, omni-search style
- **Hidden terminal (`` Ctrl+` ``)** — a diagnostic console easter egg with a canvas-rendered matrix-rain effect
- **Framer Motion throughout** — animated transitions and HUD-style micro-interactions

## What's Not Implemented (Despite Earlier Claims)

- No blockchain/Web3 data source of any kind — no dependency on `ethers`, `web3.js`, or any chain RPC client, in either the frontend or backend
- "Whale Radar," "Mempool Visualizer," and "AI Assistant" were ideas, not built features
- There's a `/api/spike` endpoint that injects a fake data point into the chart — useful for testing the UI, but a sign that the live data pipeline was more demo than production-grade at this stage

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, Tailwind CSS, Framer Motion, Chart.js |
| Backend | Go, Gin, SQLite |
| Data Source | CryptoCompare public price API |

## Getting Started

### Prerequisites
- Node.js 18+
- Go 1.20+

### Backend

```bash
cd nexus-core-system/backend
go mod download
go run main.go
```

### Frontend

```bash
cd nexus-oracle-frontend
npm install
npm run dev
```

## Project Structure

```
nexus-oracle/
├── nexus-core-system/
│   └── backend/
│       └── main.go       # price polling loop + SQLite storage
└── nexus-oracle-frontend/
    └── ...                # Next.js dashboard, command palette, terminal easter egg
```

---

*My first Next.js project. Built with Next.js, Go, and probably too many ideas at once.*
