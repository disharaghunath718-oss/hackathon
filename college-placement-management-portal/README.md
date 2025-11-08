
# Placement Management Portal (MERN) - Repo

This repository contains a **backend (Node/Express/MongoDB)** and a **frontend (React + Tailwind)** skeleton for the Placement Management Portal.

## Features included
- Role-based auth (student / hod / tpo)
- Drive creation & application flow
- Resume upload to local storage (`/uploads`)
- Nodemailer email integration using SMTP
- AI service placeholder for **Gemini AI** (requires GEMINI_API_KEY)
- Resume parsing + scoring stub
- Resume filtering & Excel export endpoint
- Frontend skeleton with login, dashboards and enhanced UI using Tailwind

## Quick start (backend)
1. `cd backend`
2. `cp .env.example .env` and fill environment variables
3. `npm install`
4. `npm run dev`

## Quick start (frontend)
1. `cd frontend`
2. `npm install`
3. `npm start`

See `.env.example` files for required environment variables.

