# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rule: Always Push After Commit

**AFTER every `git commit`, you MUST immediately run `git push origin main`** to trigger Vercel auto-deployment.

The frontend deploys automatically from GitHub. If you commit but don't push, the changes will NOT be visible to users.

Verify the push was successful by checking: `git log origin/main --oneline -3`

## Architecture

- **Frontend**: React + Vite SPA deployed on Vercel
- **Backend**: Express API deployed separately on Vercel (https://aicity-backend-deploy.vercel.app)
- **GitHub Repo**: https://github.com/TungIT98/ai-city-frontend
- **Vercel Project**: Connects to GitHub for auto-deploy on push to `main`

## Build & Deploy

```bash
# Development
npm run dev

# Build for production
npm run build

# Push to trigger Vercel deploy (REQUIRED after every commit)
git push origin main
```

## Environment Variables

- `VITE_API_URL` - Backend API URL (currently: https://aicity-backend-deploy.vercel.app)
