# Pawshift

Pet care that works your hours: grooming, walks, home visits and day care for dogs, cats, rabbits, guinea pigs, birds and fish.
Entrepreneurship Case Study 14 by Fauzan Baig (Roll No. 150096724092, Cohort: Elon Musk).

## Run locally
```bash
npm install
npm start          # http://localhost:3000
npm test           # API tests
```
Requires Node 18 or newer.

## Pages
| Page | What it does |
|---|---|
| `/` | Home, animals, Shift Planner, "Pawshift for Work" lead form |
| `/book` | Choose animal and services, live server-side pricing, book, demo payment |
| `/track` | Live visit timeline, route map and photo update (after payment) |
| `/play` | Treat Catch game with leaderboard and a coupon reward |
| `/club` | Wag Club loyalty tier by phone number |
| `/admin` | Owner dashboard (default key `pawshift`; set `ADMIN_KEY`) |

## Payments
Checkout is a demo: pressing Pay records a successful payment and issues a receipt. No card details are collected and no money moves.
To go live, replace the body of `POST /api/bookings/:id/pay` in `server.js` with a gateway call (for example Razorpay) and confirm via its webhook.

## Configuration
`PORT` (default 3000), `ADMIN_KEY` (default `pawshift`), `DB_FILE` (default `data/db.json`).

## Deploying from GitHub
Push the repo, then create a Node web service on Render, Railway or similar: build `npm install`, start `npm start`. Add a persistent disk (or set `DB_FILE` to one) because bookings are stored in a JSON file. Serverless hosts with read-only disks (such as Vercel) need a real database instead.

## Notes for production
The JSON file store suits a demo. Before real customers: add a database, real authentication for `/admin`, rate limiting, and a payment gateway.
