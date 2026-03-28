High Level Architecture
Frontend (Next.js website)
        |
Backend API (NestJS)
        |
PostgreSQL Database
        |
Cloud Storage (Images)
        |
Payment Gateway (Wise)
        |
Shipping APIs (future)
Components Overview
1️⃣ Frontend (Customer Website)

Responsibilities:

Signup/Login
Create orders
Upload product screenshots
Track orders
Make payments

Tech: Next.js (React)

2️⃣ Backend API (NestJS)

Responsibilities:

Authentication
Business logic
Order management
Payment integration
Admin APIs

This is the brain of the system.

3️⃣ Database (PostgreSQL)

Stores:

Users
Orders
Order items
Payments
Addresses
Status logs
4️⃣ Image Storage

We store:

Product screenshots
Packing photos

Low-cost solution:

Cloudflare R2 (cheap S3 alternative)
5️⃣ Payment Gateway

Primary choice: Wise

Why:

Best FX rates
Very low fees
Good for international users

Future:

Stripe (cards)
6️⃣ Deployment Architecture (Budget Friendly)
Frontend → Vercel (Free)
Backend → Railway / Render
Database → Railway PostgreSQL
Images → Cloudflare R2
Domain → GoDaddy (already)

This stack can support 2000 concurrent users easily.

Backend Module Architecture (NestJS)
Auth Module
Users Module
Orders Module
Order Items Module
Payments Module
Uploads Module
Admin Module
Notifications Module
Database Core Tables

Main tables we will build:

users
addresses
orders
order_items
order_status_logs
payments
uploads
Scalability Strategy

When traffic grows:

Move DB → AWS RDS
Move backend → AWS ECS
Add Redis caching
Add Queue system (BullMQ)