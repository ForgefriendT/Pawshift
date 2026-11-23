# Pawshift 🐾
> **Pet care that works your hours: grooming, walks, home visits and day care for dogs, cats, rabbits, guinea pigs, birds and fish.**  
> *Entrepreneurship Case Study 14 by Fauzan Baig (Roll No. 150096724092, Cohort: Elon Musk).*

---

## 📌 Overview

Pawshift is a modern on-demand and subscription pet care platform designed for urban pet parents and corporate employee wellness programs. It bridges the gap between busy work schedules and responsible pet ownership through vetted carers, real-time tracking, transparent tiered pricing, and corporate benefits packages.

---

## 📂 Repository Contents

This repository contains both the complete business and academic case study materials as well as the fully working web application:

- **`app/`**: Full-stack Node.js & Express web application with interactive booking, real-time visit tracking simulation, loyalty system, minigame, and admin dashboard.
- **`Pawshift_Business_Model.xlsx`**: Detailed financial models, unit economics, revenue projections, and CAC/LTV calculations.
- **`Pawshift_Business_Report.docx`**: Complete entrepreneurial case study report, market analysis, competitor breakdown, and operational strategy.
- **`Pawshift_Presentation.pdf`**: Pitch deck and presentation covering market opportunity, solution, go-to-market plan, and financial highlights.
- **`Pawshift_WebApp.zip`**: Packaged archive of the web application.

---

## 🚀 Web Application Features

| Page | Route | Description |
|---|---|---|
| **Home & Shift Planner** | `/` | Showcase of services across 6 pet species, interactive Shift Planner calculating unattended hours and recommendations, and corporate "Pawshift for Work" lead form. |
| **Booking & Checkout** | `/book` | Dynamic multi-step booking engine with animal selection, sizing, service customization, plans (Pay-as-you-go, Plus, Pro), coupon validation, and mock checkout (UPI, Card, Cash). |
| **Live Visit Tracking** | `/track` | Interactive real-time timeline, animated route map progress, carer details, and photo updates. Includes demo visit simulation. |
| **Treat Catch Minigame** | `/play` | HTML5 canvas minigame with global leaderboard. Scoring 20+ unlocks discount coupon codes. |
| **Wag Club Loyalty** | `/club` | Loyalty points tracker calculating 1 Wag per ₹10 spent, tier progress (Pup, Good Boy, Top Dog, Pack Leader), and past booking history. |
| **Owner Dashboard** | `/admin` | Key-authenticated dashboard displaying gross revenue, paid/unpaid bookings breakdown, recent bookings table, and corporate leads. |

---

## 🛠️ Tech Stack

- **Runtime & Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript (ES6+), Modern Semantic HTML5, Custom CSS3 Design System
- **Persistence**: Atomic file-based JSON store with temp-write & atomic rename
- **Fonts & Typography**: Figtree & Unbounded via Google Fonts
- **Testing**: Built-in automated API test suite (`node test.js`)

---

## ⚡ Quickstart

### Prerequisites
- Node.js 18.0.0 or higher
- npm

### 1. Installation
Navigate into the `app/` folder and install dependencies:
```bash
cd app
npm install
```

### 2. Run Tests
Verify all API endpoints and booking flows:
```bash
npm test
```

### 3. Start the Server
```bash
npm start
```
The server will start on [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deploy to Netlify

You can deploy Pawshift directly to Netlify in one click:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ForgefriendT/Pawshift)

### Netlify Deployment Details
- **Base directory**: `app`
- **Publish directory**: `public`
- **Functions directory**: `functions` (serverless API powered by Express via `serverless-http`)
- Pre-configured `netlify.toml` handles all clean routing (`/book`, `/track`, `/play`, `/club`, `/admin`) and redirects all `/api/*` requests to the Netlify Serverless Function.

---

## 👨‍💻 Author

**Fauzan Baig**  
- **Roll No**: 150096724092  
- **Cohort**: Elon Musk  
- **GitHub**: [@ForgefriendT](https://github.com/ForgefriendT)
