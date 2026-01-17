# SATS - Vercel Deployment

## Vercel Settings:

**Root Directory:** `./`
**Build Command:** `npm run build`
**Output Directory:** `frontend/.next`
**Install Command:** `npm install`

## Environment Variables:
Add in Vercel dashboard:
```
GEMINI_API_KEY=AIzaSyDKp2s3rwLuKLxscucOuyDfcYdMnlFj8bM
```

## Deploy Steps:
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

## Local Development:
```bash
# Frontend
cd frontend && npm run dev

# Backend  
cd backend && npm start
```