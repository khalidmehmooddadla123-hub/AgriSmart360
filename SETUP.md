# AgriSmart 360 — Setup Guide
## پاکستانی کسانوں کا ڈیجیٹل زرعی نظام

---

## 📋 Project Overview

AgriSmart 360 is a full-stack agriculture web platform built for Pakistan farmers with:
- Real-time crop prices (Pakistan Mandi + Global)
- Weather forecasting with spray recommendations
- AI Chat Assistant (Urdu voice output)
- Plant disease detection
- Farmer marketplace
- Agriculture news & government updates
- Land/property ads
- Complaint system
- User profiles and history tracking
- Eco-friendly farming guidance

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript |
| UI | Tailwind CSS + custom theme |
| Charts | Recharts |
| Routing | React Router DOM v6 |
| State | React Context + TanStack Query |
| Auth | Supabase Auth (email/phone/Google) |
| Database | Supabase (PostgreSQL) |
| Translation | i18next (11 languages) |
| Weather | OpenWeather API |
| Notifications | Twilio SMS |
| Build | Vite 7 |

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
git clone <your-repo>
cd AgriSmart360
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the values (see below for how to get each key).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 API Keys Setup

### Supabase (Database + Auth)

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project** → Sign up free
3. Create a new project (choose a region close to Pakistan)
4. Go to **Settings → API**
5. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

#### Supabase Database Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- User profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  role TEXT DEFAULT 'farmer',
  city TEXT,
  province TEXT,
  country TEXT DEFAULT 'Pakistan',
  farm_size TEXT,
  crops_grown TEXT[],
  language_preference TEXT DEFAULT 'ur',
  notification_preferences JSONB,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Complaints table
CREATE TABLE complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  category TEXT DEFAULT 'other',
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own complaints"
  ON complaints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own complaints"
  ON complaints FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### Enable Google OAuth in Supabase

1. Go to **Authentication → Providers → Google**
2. Enable Google provider
3. Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com):
   - Create project → Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `https://your-project.supabase.co/auth/v1/callback` as authorized redirect URI
4. Paste Client ID and Secret in Supabase

#### Enable Phone/OTP Auth

1. Go to **Authentication → Providers → Phone**
2. Enable phone provider
3. Configure Twilio (see below)

---

### OpenWeather API (Weather Data)

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a **free account**
3. Go to **My API Keys**
4. Copy your API key → `VITE_OPENWEATHER_API_KEY`

**Free plan includes:**
- 60 calls/minute
- Current weather
- 5-day forecast

---

### Twilio (SMS Notifications + Phone OTP)

1. Go to [https://www.twilio.com](https://www.twilio.com)
2. Sign up for a **free trial** ($15 credit)
3. Go to **Account → Dashboard**
4. Copy:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`
5. Get a Twilio phone number → `TWILIO_PHONE_NUMBER`

**Note:** Twilio keys should only be used in backend/edge functions (Supabase Edge Functions), NOT in frontend code.

#### Supabase Edge Function for SMS (optional)

```typescript
// supabase/functions/send-sms/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { to, message } = await req.json()
  
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
  const from = Deno.env.get('TWILIO_PHONE_NUMBER')
  
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: from, Body: message }),
    }
  )
  
  return new Response(JSON.stringify(await response.json()))
})
```

---

### Trading Economics API (Global Crop Prices)

1. Go to [https://tradingeconomics.com/api](https://tradingeconomics.com/api)
2. Sign up for API access
3. Copy API key → `VITE_TRADING_ECONOMICS_API_KEY`

**Note:** Free plan has limited calls. For production, consider caching prices.

---

## 🌍 Pakistan Mandi Prices API

For real Pakistan mandi prices, these sources may be used:

1. **Pakistan Bureau of Statistics**: [https://www.pbs.gov.pk](https://www.pbs.gov.pk)
2. **AMIS (Agricultural Market Information System)**: [http://amis.pk](http://amis.pk)
3. **Kissan Info** (unofficial): scraping approach

Currently the app uses representative mock data that can be replaced by real API calls in `src/lib/api.ts`.

---

## 📁 Folder Structure

```
AgriSmart360/
├── public/
│   ├── leaf.svg              # App logo
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx    # Main layout wrapper
│   │   │   ├── Navbar.tsx    # Top navigation
│   │   │   └── Sidebar.tsx   # Side navigation
│   │   ├── ui/               # Reusable UI components
│   │   └── ...               # Feature components
│   ├── contexts/
│   │   ├── AuthContext.tsx   # Auth state + Supabase
│   │   └── ThemeContext.tsx  # Dark/light mode
│   ├── hooks/
│   │   └── useNotifications.ts
│   ├── lib/
│   │   ├── api.ts            # API calls + mock data
│   │   ├── i18n.ts           # 11-language config
│   │   └── supabase.ts       # Supabase client
│   ├── pages/
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── Prices.tsx        # Crop prices
│   │   ├── Weather.tsx       # Weather forecast
│   │   ├── ChatAssistant.tsx # AI chat (Urdu voice)
│   │   ├── Marketplace.tsx   # Buy/sell crops
│   │   ├── DiseaseDetection.tsx # Plant disease AI
│   │   ├── News.tsx          # Agriculture news
│   │   ├── LandAds.tsx       # Land/equipment ads
│   │   ├── Complaint.tsx     # Complaint system
│   │   ├── Profile.tsx       # User profile
│   │   ├── History.tsx       # Activity history
│   │   ├── EcoFarming.tsx    # Eco farming tips
│   │   ├── Notifications.tsx # Notifications
│   │   ├── Advisory.tsx      # Farmer advisory
│   │   ├── Login.tsx         # Login page
│   │   └── Register.tsx      # Registration
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   ├── App.tsx               # Router + providers
│   ├── main.tsx              # Entry point
│   └── index.css             # Tailwind + global styles
├── .env.example              # Environment variables template
├── tailwind.config.js        # Tailwind custom theme
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
└── SETUP.md                  # This file
```

---

## 🌐 Languages Supported

| Code | Language | Script |
|------|----------|--------|
| `ur` | اردو (Urdu) — **Default** | RTL |
| `en` | English | LTR |
| `pa` | ਪੰਜਾਬੀ (Punjabi) | LTR |
| `sd` | سنڌي (Sindhi) | RTL |
| `ps` | پښتو (Pashto) | RTL |
| `skr` | سرائیکی (Saraiki) | RTL |
| `bal` | بلوچی (Balochi) | RTL |
| `ar` | العربية (Arabic) | RTL |
| `zh` | 中文 (Chinese) | LTR |
| `hi` | हिंदी (Hindi) | LTR |
| `tr` | Türkçe (Turkish) | LTR |

---

## 🔐 Authentication Methods

1. **Email + Password** — Standard login
2. **Phone + OTP** — SMS verification via Twilio/Supabase
3. **Google OAuth** — One-click Google login
4. **Demo Mode** — Test without registration

---

## 📱 User Roles

| Role | Access |
|------|--------|
| `farmer` | Full access |
| `urban_farmer` | Full access |
| `buyer` | Marketplace + prices |
| `agriculture_expert` | All + advisory tools |
| `admin` | Full admin access |

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Add environment variables in Vercel Dashboard → Settings → Environment Variables.

### Deploy to Netlify

```bash
npm run build
# Deploy the dist/ folder to Netlify
```

---

## 📞 Support

For queries about this platform:
- Email: support@agrismart360.pk
- Helpline: 0800-27474 (Free)
- Working Hours: 9 AM – 6 PM (Mon–Sat)

---

Built with ❤️ for Pakistan's Farming Community 🌾
