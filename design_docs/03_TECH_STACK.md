Tech Stack Overview

This document explains what technologies we use and why.

The goal:

Very low budget
Easy for beginner developer
Can scale later
Production ready
Frontend — Next.js (React)

We will build customer + admin UI using Next.js.

Why Next.js?

SEO friendly (important for Google traffic)
Fast performance
Free deployment on Vercel
Huge community support

Languages:

TypeScript
HTML / CSS / TailwindCSS
Backend — NestJS (Node.js)

Backend is already created.

Why NestJS?

Enterprise level architecture
Scalable & structured
Uses TypeScript
Similar structure to Java Spring Boot (industry standard)

Backend responsibilities:

Authentication
Order workflow
Payment integration
Admin APIs
Database — PostgreSQL

Why PostgreSQL?

Free & open source
Very reliable
Handles complex relations well
Perfect for ecommerce/order systems
ORM — TypeORM

Why ORM?
We don’t write raw SQL. ORM converts code → SQL automatically.

Benefits:

Faster development
Less bugs
Auto table creation
Image Storage — Cloudflare R2

We must store:

Product screenshots
Parcel photos

Why Cloudflare R2?

Very cheap
S3 compatible
No egress cost (huge benefit)
Authentication — JWT

Users login using secure token.

Why JWT?

Industry standard
Works well with mobile apps later
Stateless (cheap to scale)
Payments — Wise (Primary)

Why Wise?

Best currency exchange rates
Supports international users
Low fees
Perfect for NRI customers

Future upgrade:

Stripe (cards)
Deployment Platforms (Budget Friendly)
Component	Platform	Why
Frontend	Vercel	Free & easy
Backend	Railway / Render	Cheap
Database	Railway PostgreSQL	Managed DB
Storage	Cloudflare R2	Cheapest storage
Domain	GoDaddy	Already purchased
Dev Tools
Tool	Purpose
VS Code	Code editor
Postman	API testing
DBeaver	Database GUI
GitHub	Code hosting