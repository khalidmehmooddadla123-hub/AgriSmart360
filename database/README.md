# AgriSmart 360 — Database

This folder contains the database schema and related files for AgriSmart 360.

## Technology

- **Database**: PostgreSQL (managed by [Supabase](https://supabase.com))
- **Auth**: Supabase Auth (Email, Google OAuth, Phone OTP)
- **Row Level Security**: Enabled on all tables

## Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Open the **SQL Editor** in your Supabase Dashboard
3. Run the SQL in `schema.sql` to create all required tables and RLS policies

## Tables

| Table           | Description                                 |
|-----------------|---------------------------------------------|
| `profiles`      | User profiles linked to `auth.users`        |
| `complaints`    | User complaints / support tickets           |
| `notifications` | User notifications (price, weather, etc.)   |

## Connection

Both the **frontend** and **backend** connect to Supabase:

- **Frontend** (`frontend/src/lib/supabase.ts`): Uses the **anon (public) key** for client-side operations, restricted by Row Level Security.
- **Backend** (`backend/src/config/supabase.ts`): Uses the **service role key** for server-side operations that may bypass RLS.

## Environment Variables

### Frontend (`frontend/.env.local`)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (`backend/.env`)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```
