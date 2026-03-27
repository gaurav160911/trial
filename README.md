# GigShield 🛡️

**Micro-insurance platform for gig workers** (Swiggy/Zomato delivery partners)

## Features

- ✅ **Registration Process** — 5-step onboarding (Phone OTP → Aadhaar → Platform → Partner ID → Zone)
- ✅ **Insurance Policy Management** — Subscribe/cancel weekly plans (₹29 / ₹49 / ₹79), view history
- ✅ **Dynamic Premium Calculation** — Rule-based engine: zone × seasonal × risk × loyalty discount
- ✅ **Claims Management** — Auto-trigger claims (rain/AQI/heat), fraud detection, mock Razorpay payout

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite, React Router, Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + Mock OTP (demo OTP: `123456`) |
| Payments | Mock Razorpay |

## Quick Start

### Backend
```bash
cd server
npm install
# copy .env.example to .env and set MONGO_URI
npm run dev        # runs on http://localhost:5000
```

### Frontend
```bash
cd client
npm install
npm run dev        # runs on http://localhost:5173
```

### Demo Login
- Phone: any 10-digit number
- OTP: `123456`

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/send-otp` | Send OTP |
| POST | `/api/auth/verify-otp` | Verify OTP → JWT |
| PUT | `/api/auth/profile` | Update profile |
| GET | `/api/policies/current` | Active policy |
| POST | `/api/policies/subscribe` | Subscribe plan |
| GET | `/api/claims` | All claims |
| POST | `/api/claims/trigger` | Trigger claim |
| POST | `/api/claims/:id/payout` | Process payout |
| GET | `/api/premium/calculate` | Calculate premium |
