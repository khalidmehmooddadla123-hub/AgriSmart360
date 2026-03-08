# AgriSmart 360

**Pakistan's Smart Agriculture Ecosystem** 🌾

A full-stack agriculture web platform built for Pakistani farmers with real-time crop prices, weather forecasting, AI chat assistant, plant disease detection, farmer marketplace, and more.

## Project Structure

```
AgriSmart360/
├── frontend/          # React + Vite + TypeScript (UI)
├── backend/           # Express.js + TypeScript (API server)
├── database/          # Database schema & documentation (Supabase/PostgreSQL)
├── package.json       # Root scripts to run frontend & backend
├── SETUP.md           # Detailed setup guide
└── README.md          # This file
```

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 2. Environment Variables

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

Fill in the required API keys (see [SETUP.md](SETUP.md) for details).

### 3. Database Setup

Run the SQL in `database/schema.sql` in your [Supabase SQL Editor](https://supabase.com) to create the required tables.

### 4. Run Development Servers

```bash
# Run both frontend and backend
npm run dev

# Or run them separately:
npm run dev:frontend    # http://localhost:5173
npm run dev:backend     # http://localhost:5000
```

### 5. Build for Production

```bash
npm run build
```

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 19 + TypeScript + Vite 7 + Tailwind   |
| Backend    | Node.js + Express.js + TypeScript            |
| Database   | Supabase (PostgreSQL)                        |
| Auth       | Supabase Auth + Firebase (phone OTP)         |
| i18n       | i18next (Urdu default + English)             |

---

Built with ❤️ for Pakistan's Farming Community 🌾
