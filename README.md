# Chirpin - Hockey Team Communication Platform

A modern waitlist landing page for Chirpin, a youth hockey team communication platform that simplifies team communication.

## Features

- **Game Center**: Real-time scores, stats, and updates
- **Game Finder**: Find teams to play using rankings and travel distance
- **Coach Connect**: Direct messaging between coaches
- **Team Following**: Follow teams and players across the hockey community
- **Waitlist Registration**: Email capture with PostgreSQL storage

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Tailwind CSS, shadcn/ui components
- **Forms**: React Hook Form with Zod validation

## Deployment Guide

### For Netlify

1. **Prepare Environment Variables**:
   ```bash
   DATABASE_URL=your_postgresql_url
   ```

2. **Build Commands**:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Functions directory: `dist`

3. **Database Setup**:
   - Create a PostgreSQL database (recommend Neon, Supabase, or PlanetScale)
   - Add DATABASE_URL to Netlify environment variables
   - Run migrations: `npm run db:push`

### For Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Add your DATABASE_URL
   ```

3. Push database schema:
   ```bash
   npm run db:push
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities
│   │   └── hooks/        # React hooks
├── server/               # Express backend
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database layer
│   └── db.ts            # Database connection
├── shared/               # Shared types and schemas
└── attached_assets/      # Static assets
```

## Environment Variables Required

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: development/production

## Manual Export from Replit Instructions

1. **Download all files** from your Replit project
2. **Remove Replit-specific files**:
   - `.replit`
   - `replit.nix`
   - Any Replit-specific imports in vite.config.ts
3. **Create new GitHub repository**
4. **Upload files to GitHub**
5. **Connect GitHub repo to Netlify**
6. **Configure environment variables in Netlify**
7. **Deploy**

## Database Migration

The project uses Drizzle ORM. To migrate your database:

```bash
npm run db:push
```

## Contact

For questions about the project, contact hello@chirpin.app