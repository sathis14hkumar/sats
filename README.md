# 💡 Idea Intelligence Engine

Startup idea analyzer with competitor research and build recommendations.

## Features
- Chat-style UI for idea submission
- Real-time competitor analysis (Web, GitHub, Reddit)
- Similarity matching (0-100%)
- Gap identification
- MVP build recommendations
- Tech stack suggestions

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **AI**: Google Gemini API
- **APIs**: DuckDuckGo, GitHub, Reddit (all free)

## Quick Start

### With Docker Compose
```bash
docker-compose up --build
```
Access: http://localhost:3000

### Manual Setup

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Similarity Scale
- 90-100%: ❌ Idea already exists
- 70-89%: ⚠️ Needs differentiation
- 40-69%: 🟡 Partial overlap
- 0-39%: ✅ Fresh idea

## Environment Variables
Backend `.env`:
```
GEMINI_API_KEY=your_key_here
PORT=5000
```
