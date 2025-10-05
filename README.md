# JWT Auth Project (MERN)

A full‑stack authentication starter built with:

-   Backend: Node.js, Express 5, MongoDB (Mongoose), JWT, Nodemailer (Gmail SMTP)
-   Frontend: React 19 + Vite, Tailwind CSS v4, Zustand, React Router, Axios

Features

-   Email + password signup with verification code (sent via email)
-   Login with httpOnly JWT cookie
-   Protected route session check (check-auth)
-   Forgot/reset password flow via email link
-   Logout
-   Production build serves the React app from Express

## Project structure

```
backend/
  index.js                 # Express app entry
  controllers/             # Auth controllers
  routes/                  # /api/auth routes
  middleware/verifyToken.js
  models/user.model.js
  db/connectDB.js          # Mongo connection
  mailtrap/                # Gmail SMTP + email templates
    gmail.config.js
    emails.js
    emailTemplates.js
frontend/
  src/                     # React app
  vite.config.js
  package.json
package.json               # root scripts for backend + build
```

## Prerequisites

-   Node.js 18+ (LTS recommended) and npm
-   A MongoDB connection string
-   Gmail account with App Password for SMTP (2FA enabled) or your own SMTP creds

## Environment variables

Create a `.env` file in the repository root (same folder as this README). Use `.env.example` as a template.

Required variables:

-   MONGO_URI: MongoDB connection string
-   PORT: Backend server port (default 4000)
-   JWT_SECRET: Any strong random string
-   NODE_ENV: development | production
-   GMAIL_HOST: SMTP host (default smtp.gmail.com)
-   GMAIL_USER: SMTP username (Gmail address if using Gmail)
-   GMAIL_PASS: SMTP password (Gmail App Password, not your normal password)
-   CLIENT_URL: Frontend URL used in password reset links (default http://localhost:5173)

Example: see `.env.example`.

Notes

-   Cookies are set with httpOnly and sameSite=strict. In production, the cookie is `secure: true`, so you must serve HTTPS.
-   CORS is configured to allow http://localhost:5173 in development.

## Install and run (development)

1. Install dependencies

```bash
# From project root
npm install
npm install --prefix frontend
```

2. Configure environment

```bash
# Create and edit your .env file
cp .env.example .env
# then open .env and fill in values
```

3. Run backend (Express + MongoDB)

```bash
npm run dev
```

The backend runs on http://localhost:4000 by default.

4. Run frontend (Vite React app)

```bash
cd frontend
npm run dev
```

The frontend runs on http://localhost:5173.

The app expects the backend at http://localhost:4000 during development (see `frontend/src/store/authStore.js`). Axios is configured with `withCredentials = true`.

## Using the app locally

-   Visit http://localhost:5173
-   Sign up with name, email, and password
-   Check your email for the verification code and enter it to verify
-   Log in and access the dashboard
-   Use “Forgot password” to receive a reset link that points to `${CLIENT_URL}/reset-password/:token`

Email sending

-   This project uses Gmail SMTP by default. Set `GMAIL_USER` and `GMAIL_PASS` (App Password) in `.env`.
-   If emails don’t arrive, check spam or your SMTP settings. The server logs will show send status.

## API endpoints (backend)

Base URL: http://localhost:4000/api/auth

-   POST /signup
    -   body: { email, password, name }
    -   sets auth cookie, sends verification email
-   POST /login
    -   body: { email, password }
    -   sets auth cookie
-   POST /logout
    -   clears auth cookie
-   POST /verify-email
    -   body: { code } // 6‑digit verification code
-   POST /forgot-password
    -   body: { email } // sends reset link to email
-   POST /reset-password/:token
    -   body: { password } // completes reset
-   GET /check-auth
    -   cookie auth required; returns user profile when authenticated

## Scripts

Root (backend + build)

-   npm run dev: Start backend with nodemon (development)
-   npm run start: Start backend with Node (production)
-   npm run build: Install frontend deps and build React app to `frontend/dist`

Frontend

-   cd frontend && npm run dev: Start Vite dev server
-   cd frontend && npm run build: Build production bundle
-   cd frontend && npm run preview: Preview built app

## Production

-   Ensure `.env` has NODE_ENV=production and correct secrets
-   Build frontend from root:

```bash
npm run build
```

-   Start server from root:

```bash
npm run start
```

Express will serve the static frontend from `frontend/dist` and proxy non‑API GET routes to `index.html`.

## Troubleshooting

-   MongoDB connection fails
    -   Check `MONGO_URI` and that your IP is allowed in MongoDB Atlas (if using Atlas)
-   Auth cookie not set in browser
    -   Ensure frontend is on http://localhost:5173 and backend on http://localhost:4000
    -   CORS and credentials are enabled; keep Axios `withCredentials = true`
-   401 on protected routes in dev
    -   Usually missing cookie; make sure requests come from the same origin configured in CORS
-   Emails not sending
    -   Use a Gmail App Password (with 2FA). Check server logs for transporter errors
    -   Adjust `GMAIL_HOST`, `GMAIL_USER`, `GMAIL_PASS` if using a different SMTP provider
-   Production cookie not sticking
    -   Use HTTPS in production (`secure: true` cookies require TLS)

## License

ISC
