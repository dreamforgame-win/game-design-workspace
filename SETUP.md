# Game Design Workspace — Setup Guide

## Quick Start

```bash
# 1. Install dependencies
cd game-design-workspace
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your database URL and email credentials

# 3. Set up database
npx prisma generate
npx prisma migrate dev --name init

# 4. Seed default themes
npm run db:seed

# 5. Run development server
npm run dev
```

Open http://localhost:3000

## Database Options

### Option A: Local PostgreSQL
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/game_design_workspace"
```

### Option B: Docker
```bash
docker run --name gdw-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=game_design_workspace -p 5432:5432 -d postgres:16
```

### Option C: Vercel Postgres (Production)
Use the Vercel dashboard to create a Postgres database, then copy the connection string.

## Email Provider (for Magic Link auth)

### Development: Mailtrap (recommended)
1. Sign up at https://mailtrap.io
2. Get SMTP credentials from your inbox settings
3. Set in .env.local:
```
EMAIL_SERVER_HOST=sandbox.smtp.mailtrap.io
EMAIL_SERVER_PORT=2525
EMAIL_SERVER_USER=your_user
EMAIL_SERVER_PASSWORD=your_pass
EMAIL_FROM=noreply@gamedesign.local
```

### Production: Resend
```
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=re_your_api_key
EMAIL_FROM=noreply@yourdomain.com
```

## Current State

The scaffold includes:
- ✅ Project configuration (Next.js 15, TypeScript strict, TailwindCSS 4)
- ✅ Design token system (3 themes via CSS custom properties)
- ✅ UI primitive components (Button, Input, Modal, Card, Loading, EmptyState)
- ✅ Database schema (Prisma + PostgreSQL)
- ✅ Auth setup (NextAuth v5 magic link)
- ✅ Document CRUD server actions
- ✅ Auto-save hook
- ✅ Zustand editor store
- ✅ Page routes (login, workspace, editor, public share)
- ✅ Document templates (GDD, System Design, Feature Proposal, Presentation)

Still needs (see TASKS.md):
- Task 7: Markdown rendering pipeline (remark-directive)
- Task 8: Milkdown editor integration
- Task 9: Full editor page with split pane
- Task 11: Landing page
- Tasks 13-14: Additional themes CSS
- Task 16: Presentation mode
