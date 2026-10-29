# Authentication Backend Project Report

## Final-year project context

**Current project:** MERN authentication starter and reusable identity service
**Planned product:** AI-powered expense tracker
**Role of this project in the planned product:** This backend will provide account creation, email verification, login, session persistence, logout, and password recovery. Expense features should be built as separate protected modules that rely on the authenticated user ID supplied by this service.

**Review date:** 5 September 2026
**Repository:** Auth_Project

---

## 1. Executive summary

This project implements a full-stack authentication system using Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Nodemailer, and a React/Vite frontend. The system covers the main account lifecycle:

1. A user signs up with a name, email address, and password.
2. The password is hashed before storage.
3. A six-digit email verification code is generated and stored with an expiry.
4. A JWT is issued in an HTTP-only cookie.
5. The user verifies the account through the verification code.
6. The user can log in later, check the current session, and log out.
7. A forgotten password can be reset through an expiring email link.

The current implementation is a strong foundation for the authentication boundary of the planned AI expense tracker. It already separates authentication concerns into routes, controllers, a user model, middleware, database access, email services, and frontend state management. The next application should add expense, category, budget, reporting, and AI services without placing those responsibilities inside the authentication controller.

The implementation is functional in structure, but it should receive a security and reliability pass before final submission. The most important actions are to remove exposed credentials from project notes, ensure secrets are never committed, improve validation and error status codes, make email delivery behavior consistent, add automated API tests, and document the Postman test process.

---

## 2. Project progress and implemented features

### Completed backend work

- Express server created in `backend/index.js`.
- Environment configuration loaded using `dotenv`.
- CORS configured for the React development server at `http://localhost:5173`.
- JSON request parsing enabled.
- Cookie parsing enabled.
- MongoDB connection implemented with Mongoose.
- Authentication routes mounted under `/api/auth`.
- User model created with account, verification, reset, and activity fields.
- Password hashing implemented with bcryptjs.
- JWT creation implemented with a seven-day expiry.
- JWT stored in an HTTP-only cookie named `token`.
- Protected session-check route implemented through `verifyToken` middleware.
- Six-digit email verification flow implemented.
- Password reset request and password reset completion implemented.
- Welcome, verification, reset-request, and reset-success email templates implemented.
- Production serving logic added so Express can serve the built React frontend.

### Completed frontend work

- React 19 application created with Vite.
- React Router routes added for login, registration, verification, password recovery, password reset, and dashboard pages.
- Zustand store created for authentication state and API actions.
- Axios configured with `withCredentials = true` so cookies are sent to the backend.
- Protected route behavior added.
- Redirect behavior added for logged-in and unverified users.
- Loading, error, and success states added in the authentication screens.
- Password strength meter and reusable input/loading components added.
- Framer Motion used for page and control animations.
- Tailwind CSS used for the interface styling.

### Current project boundary

The current dashboard is an authentication demonstration. It displays profile and account activity information, but it is not yet an expense dashboard. This is appropriate for the current stage because the authentication service can be stabilized independently before expense data and AI capabilities are introduced.

---

## 3. Architecture and request flow

### Backend structure

- `backend/index.js`: application entry point, middleware registration, route mounting, and production static serving.
- `backend/controllers/auth.controllers.js`: business logic for signup, login, verification, logout, password reset, and session checks.
- `backend/routes/auth.routes.js`: HTTP method and URL definitions.
- `backend/models/user.model.js`: Mongoose schema and User model.
- `backend/middleware/verifyToken.js`: reads and verifies the JWT cookie.
- `backend/db/connectDB.js`: opens the MongoDB connection.
- `backend/utils/generateTokenAndSetCookie.js`: signs the JWT and configures the cookie.
- `backend/mailtrap/emails.js`: sends messages through Nodemailer.
- `backend/mailtrap/gmail.config.js`: configures the SMTP transporter.
- `backend/mailtrap/emailTemplates.js`: contains the HTML email templates.

The folder is named `mailtrap`, but the current implementation uses Gmail SMTP through Nodemailer. Renaming the folder to `email` or `mail` would make the implementation clearer, unless Mailtrap is intentionally planned as a future provider.

### Authentication flow

**Signup:** The controller validates required fields, checks for an existing email, hashes the password, creates a six-digit verification code, stores the user, issues a cookie, and starts the verification email process.

**Email verification:** The submitted code is matched with the stored code and checked against its expiry. On success, `isVerified` becomes true and the temporary verification fields are removed.

**Login:** The email is searched, bcrypt compares the submitted password with the stored hash, a JWT is issued, `lastLogin` is updated, and the safe user object is returned.

**Session check:** The browser sends the HTTP-only cookie. `verifyToken` validates it and places the decoded `userId` on `req`. The controller then loads the user without the password.

**Password reset:** A cryptographically random token is generated and stored with a one-hour expiry. The user receives a link containing that token. The reset route validates the token, hashes the new password, clears the token fields, and sends a success email.

**Logout:** The server clears the `token` cookie.

---

## 4. Complete API route review

Base URL for local development: `http://localhost:4000/api/auth`

| Method | Endpoint                 | Authentication             | Request body or parameter                                                              | Purpose                                                                                   |
| ------ | ------------------------ | -------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| POST   | `/signup`                | Not required               | `{ "email": "user@example.com", "password": "StrongPassword1!", "name": "Test User" }` | Creates an account, hashes the password, sends verification, and sets the session cookie. |
| POST   | `/login`                 | Not required               | `{ "email": "user@example.com", "password": "StrongPassword1!" }`                      | Validates credentials, updates `lastLogin`, and sets the JWT cookie.                      |
| POST   | `/logout`                | Cookie is normally present | No body                                                                                | Clears the JWT cookie.                                                                    |
| POST   | `/verify-email`          | Cookie is normally present | `{ "code": "123456" }`                                                                 | Confirms the email verification code.                                                     |
| POST   | `/forgot-password`       | Not required               | `{ "email": "user@example.com" }`                                                      | Creates an expiring reset token and sends a reset link.                                   |
| POST   | `/reset-password/:token` | Not required               | `{ "password": "NewStrongPassword1!" }`                                                | Replaces the password and consumes the reset token.                                       |
| GET    | `/check-auth`            | Required                   | No body; valid `token` cookie required                                                 | Returns the current authenticated user without the password.                              |

### Route behavior and expected responses

Successful requests return JSON with `success: true`, a message, and, where appropriate, a user object. Failed requests generally return `success: false` and a message. The password is deliberately removed from user responses using object spreading plus `password: undefined`, and the protected user lookup explicitly selects `-password`.

For the final submission, the API documentation should also specify validation rules, exact status codes, example error responses, and whether an unverified account is allowed to log in. The current backend allows login before checking `isVerified`; the frontend later redirects unverified users to the verification screen. That behavior should be made explicit or enforced consistently in the backend.

---

## 5. Why each dependency is used

### Backend dependencies

- **Express:** HTTP server and routing framework for the REST API.
- **Mongoose:** MongoDB object modeling, schemas, validation hooks, and database queries.
- **bcryptjs:** One-way password hashing and password comparison. Plain passwords should never be stored.
- **jsonwebtoken:** Creates and verifies signed session tokens.
- **cookie-parser:** Makes request cookies available through `req.cookies`.
- **cors:** Allows the Vite frontend on another local origin to call the backend and send credentials.
- **dotenv:** Loads MongoDB, JWT, SMTP, and application settings from `.env` instead of hard-coding them.
- **nodemailer:** Sends verification and password reset email through SMTP.
- **crypto:** Generates strong random reset tokens. Node provides a built-in crypto module; the separate `crypto` package in `package.json` should be reviewed and is likely unnecessary.
- **nodemon:** Restarts the backend during development after source changes.

### Frontend dependencies

- **React and React DOM:** Component-based user interface.
- **Vite:** Fast frontend development server and production bundler.
- **React Router DOM:** Client-side routes and protected/redirected views.
- **Axios:** HTTP client used to call the backend API and preserve credentials.
- **Zustand:** Small global state store for user, loading, errors, messages, and auth actions.
- **Tailwind CSS and `@tailwindcss/vite`:** Utility styling integrated with Vite.
- **Framer Motion:** Page and control animation.
- **Lucide React:** Consistent interface icons.
- **React Hot Toast:** User feedback for successful or failed operations.
- **ESLint and React plugins:** Code quality and React-specific lint checks.

---

## 6. Environment and setup review

The project expects a root `.env` file based on `.env.example`:

```text
MONGO_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=long_random_secret
NODE_ENV=development
GMAIL_HOST=smtp.gmail.com
GMAIL_PORT=587
GMAIL_SECURE=false
GMAIL_USER=your_email@example.com
GMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

### Recommended setup sequence

1. Install Node.js 18 or a current LTS release.
2. From the repository root, run `npm install`.
3. Run `npm install --prefix frontend`.
4. Copy `.env.example` to `.env`.
5. Create a MongoDB database and place its connection string in `MONGO_URI`.
6. Create a Gmail App Password or configure another SMTP provider.
7. Set a strong random `JWT_SECRET`.
8. Start the backend with `npm run dev`.
9. In another terminal, start the frontend with `cd frontend && npm run dev`.
10. Open `http://localhost:5173`.

The root `build` script installs root dependencies, installs frontend dependencies, and runs the frontend build. The production server then serves `frontend/dist` when `NODE_ENV=production`.

---

## 7. MongoDB setup and likely problems

MongoDB stores the `User` documents. The connection is opened in `connectDB()` using `process.env.MONGO_URI`. If the connection fails, the server logs the error and exits with status 1.

### MongoDB Atlas checklist

- Create a MongoDB Atlas project and cluster.
- Create a database user with a strong password.
- Add the development machine IP address to Network Access, or use a controlled temporary access rule during development.
- Copy the driver connection string.
- URL-encode special characters in the database password if required.
- Place the final URI in `.env` and never commit it.
- Confirm the database user has permission to read and write the selected database.

### Common connection problems

- The URI is empty or contains a typo.
- The database password contains special characters that are not URL-encoded.
- The current IP address is not allowed by Atlas.
- The cluster is paused or unavailable.
- The application is started from a directory where the expected `.env` file is not found.
- Local MongoDB is assumed to be running even though the project is configured for Atlas, or vice versa.

A good diagnostic sequence is to inspect the server log, verify the environment variable is loaded without printing secrets, test the URI in MongoDB Compass, and confirm the Atlas network and database-user settings.

The current `connectDB.js` logs the complete Mongo URI. That is useful while debugging but unsafe in a shared log or final deployment. It should log a redacted connection description instead.

---

## 8. Gmail SMTP and email setup

Email is required for verification and password recovery. The implementation uses Nodemailer with Gmail SMTP defaults: host `smtp.gmail.com`, port `587`, and STARTTLS. `GMAIL_PASS` must be a Gmail App Password, not the normal account password.

### Recommended Gmail setup

- Enable two-factor authentication on the Gmail account.
- Create an App Password for the application.
- Store the generated value only in `.env` or a deployment secret manager.
- Use the same sender address as `GMAIL_USER`.
- Keep port 587 with `GMAIL_SECURE=false` for STARTTLS, or use port 465 with secure TLS settings.
- Test verification and password reset email separately.

### Email-related issues to discuss in the submission

- SMTP credentials may be missing or invalid.
- Gmail may reject normal account passwords.
- Messages may arrive in spam.
- Some hosting providers restrict outbound SMTP connections.
- The current signup controller starts `sendVerificationEmail()` without awaiting it, so signup can succeed even when email delivery fails.
- The verification template says the code expires in 15 minutes, while the controller stores it for 24 hours. These values should agree.
- The project folder is called `mailtrap`, but the active provider is Gmail SMTP. This is a naming/documentation mismatch.

---

## 9. Postman testing approach and problems

Postman is useful for isolating backend problems from frontend problems. The key detail in this project is that authentication is stored in an HTTP-only cookie, not returned as a bearer token in the JSON response.

### Suggested Postman collection order

1. **Signup**
    - POST `http://localhost:4000/api/auth/signup`
    - JSON body with `email`, `password`, and `name`.
    - Check the response and confirm that Postman stores the `token` cookie.
2. **Verify email**
    - POST `/verify-email`
    - JSON body with the six-digit code received by email.
    - Confirm `isVerified` becomes true.
3. **Check auth**
    - GET `/check-auth`
    - Send the cookie saved from signup or login.
    - Confirm the response contains the user without a password.
4. **Logout**
    - POST `/logout`
    - Confirm the cookie is cleared.
5. **Login**
    - POST `/login`
    - Confirm a fresh token cookie is stored.
6. **Forgot password**
    - POST `/forgot-password`
    - Confirm an email is sent and a reset link is generated.
7. **Reset password**
    - POST `/reset-password/:token`
    - Send the new password and then test login with it.

### Typical Postman difficulties

- Postman does not retain the cookie because the request host, port, or domain changes between calls.
- The `token` cookie is visible in Postman's cookie manager but is not sent because the request is being made to a different host such as `127.0.0.1` instead of `localhost`.
- A protected request returns 401 because signup or login was run in a different Postman session without the cookie jar.
- A request is sent as form-data or plain text instead of raw JSON.
- The `Content-Type: application/json` header is missing.
- The verification code is read from a delayed or spam email.
- A reset link is copied incorrectly, especially the token path parameter.
- CORS errors are sometimes mistaken for backend authentication errors. CORS mainly affects browser calls; Postman can still call the API directly, but cookies must still be managed.

### Postman best practice

Create collection variables such as `baseUrl = http://localhost:4000/api/auth` and `resetToken`. Add tests that assert status codes and `success: true`. Keep the cookie jar enabled. Never save real SMTP passwords, database passwords, or JWT secrets in a shared Postman collection.

---

## 10. Code review and development approach

### What was approached well

- The project was divided into controllers, routes, models, middleware, utilities, database access, and email services. This is a maintainable starting structure.
- Passwords are hashed with bcryptjs rather than stored in plaintext.
- JWTs are placed in HTTP-only cookies, reducing exposure to client-side JavaScript.
- The cookie is configured with `sameSite: 'strict'` and becomes secure in production.
- Verification and reset tokens have expiry fields and are cleared after use.
- Error messages are generally user-oriented rather than exposing the password.
- The frontend uses a central auth store, so API behavior is not duplicated across every page.
- The production build path is already considered, which is useful for a final-year demonstration.

### High-priority issues before submission

1. **Credential exposure in project notes:** `Manager.txt` contains what appears to be a MongoDB password. Treat it as compromised, rotate it immediately, remove it from the repository, and use environment variables or a secret manager.
2. **Secret logging:** `connectDB.js` logs the full Mongo URI. Redact it.
3. **Input validation:** Add schema or request validation for email format, password strength, name length, verification code format, and reset password rules.
4. **Status code consistency:** Invalid JWTs currently lead to a 500 response in the middleware catch block; invalid credentials should use 401 or 400, and server failures should use 500.
5. **Email delivery consistency:** Await verification email sending or deliberately queue it and expose a controlled retry path. Do not let a failed email create an account that cannot be verified without recovery.
6. **Verification policy:** Decide whether login should be rejected until `isVerified` is true. Enforce the chosen policy in the backend, not only in frontend routing.
7. **Rate limiting:** Add rate limits for login, signup, verification, and password reset endpoints.
8. **Password reset privacy:** Consider returning the same response for an existing and non-existing email to reduce account enumeration.
9. **Token storage:** Consider hashing reset tokens before storing them, so a database leak does not immediately provide usable reset links.
10. **Testing:** Add automated tests for success, validation failures, expired tokens, duplicate emails, invalid credentials, and protected routes.

### Medium-priority improvements

- Normalize emails to lowercase before lookup and storage.
- Add a unique index migration/check and handle duplicate-key errors cleanly.
- Remove console logging of user objects and operational data in production.
- Fix response typos such as `sucess` and `forget password`.
- Add a resend-verification endpoint with throttling.
- Add request IDs and structured logs.
- Configure production CORS from an environment variable instead of hard-coding one origin.
- Add secure production cookie settings including an appropriate `domain` and `sameSite` strategy for the deployed architecture.
- Rename `forgotpassword` to `forgotPassword` for consistency.
- Remove unused or unnecessary dependencies after confirming the Node runtime provides the required module.

### Important correctness observation

The verification controller stores a token expiry of 24 hours, while the email template states that it expires after 15 minutes. A final-year reviewer may notice this inconsistency. Choose one policy and update both the code and template.

---

## 11. How this backend supports the AI expense tracker

The authentication service should become the identity boundary for the future product. Every expense document should include an owner reference such as `userId`, and every expense route should use the same JWT middleware before reading or modifying data.

A possible future module layout is:

```text
backend/
  controllers/
    auth.controllers.js
    expense.controllers.js
    budget.controllers.js
    ai.controllers.js
  models/
    user.model.js
    expense.model.js
    budget.model.js
  routes/
    auth.routes.js
    expense.routes.js
    budget.routes.js
    ai.routes.js
```

The authenticated user ID from `req.userId` can be used to enforce tenant isolation:

- Create expense: attach `req.userId` as the owner.
- List expenses: query only documents belonging to `req.userId`.
- Update or delete expense: require both the document ID and matching owner.
- Generate AI insights: send only that user's authorized expense data to the AI service.
- Build reports: aggregate only records owned by the current user.

This separation prevents a serious design mistake: allowing AI or expense logic to access data without first establishing which user owns it.

### Suggested expense-tracker stages

1. Stabilize authentication and security.
2. Add expense CRUD with ownership checks.
3. Add categories, recurring expenses, budgets, and income.
4. Add filtering, monthly summaries, exports, and charts.
5. Add AI categorization and natural-language insights with privacy controls.
6. Add audit logs, rate limits, monitoring, and deployment documentation.

The AI features should be presented as an additional service built on top of a tested authorization foundation, not as a replacement for access control.

---

## 12. Recommended final-year evidence

For the final submission, collect the following evidence:

- Architecture diagram showing React, Express, MongoDB, SMTP, and the future expense/AI modules.
- Screenshots of signup, verification, login, dashboard, forgot password, and reset password.
- Postman collection showing every API route and expected status code.
- MongoDB screenshot showing a user document with a hashed password and no plaintext password.
- Demonstration that an invalid cookie cannot access `/check-auth`.
- Demonstration that an expired verification or reset token fails.
- Test results for duplicate signup, incorrect login, logout, and password reset.
- Deployment/environment variable documentation with all secrets redacted.
- A limitations section that clearly separates the implemented authentication module from planned expense and AI features.

---

## 13. Final assessment

The project has progressed beyond a basic login demo. It provides a coherent authentication lifecycle, a reusable backend route structure, an operational MongoDB integration, an email-based trust and recovery flow, and a React client that consumes the API through a central state store. That is a suitable foundation for the planned AI-powered expense tracker.

The next stage should prioritize reliability and security rather than adding more screens immediately. Rotating the exposed database credential, removing sensitive logging, aligning expiry rules, improving validation and HTTP status handling, and adding automated tests will make the backend much stronger for an academic evaluation. Once those items are addressed, the authentication service can be reused cleanly by the expense, budget, reporting, and AI modules.
