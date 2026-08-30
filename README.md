# Bookstore Web Application

Angular frontend for browsing books and administering the bookstore API. The
application provides separate customer and administrator experiences backed by
JWT authentication and role-aware routing.

## Features

- User registration and login with inline validation and API error feedback
- Persistent JWT session and light/dark theme preference
- Customer book catalogue and book details
- Administrator book creation, editing, and deletion
- Administrator account creation, listing, and deletion
- Authentication and role route guards
- Shared administrator navigation and responsive layouts
- Automatic session cleanup and login redirect after API `401` responses

## Technology

- Angular 21 with standalone components
- TypeScript 5.9
- Angular signals and reactive forms
- Angular Router and functional HTTP interceptors
- Vitest with jsdom
- npm 11

## Requirements

- A Node.js version supported by Angular 21 (`20.19+`, `22.12+`, or `24+`)
- npm 11.6.2, as declared in `package.json`
- The bookstore API running at `http://localhost:8081`

## Local Setup

1. Start the backend API and PostgreSQL by following the backend README.
2. Install exact frontend dependencies:

```bash
npm ci
```

3. Start the development server:

```bash
npm start
```

4. Open `http://localhost:4200`.

The Angular development server uses `proxy.conf.json` to forward `/api`
requests to `http://localhost:8081`, so browser CORS configuration is not
required for local development.

## Development Accounts

When the backend runs with its `dev` profile and the values from its
`.env.example`, these accounts are available:

| Email | Password | Destination after login |
| --- | --- | --- |
| `admin@bookstore.local` | `Admin123` | Book administration |
| `user@bookstore.local` | `User123` | Customer catalogue |

If the backend uses different `SEED_ADMIN_PASSWORD` or `SEED_USER_PASSWORD`
values, use those passwords instead.

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/signup` | Public | Create a user account |
| `/login` | Public | Authenticate |
| `/home` | Authenticated | Browse books |
| `/books/:id` | Authenticated | View book details |
| `/admin/books` | `ADMIN` | Manage books |
| `/admin/admins` | `ADMIN` | Manage administrators |

The root route redirects to `/signup`. Unauthenticated visitors attempting to
open a protected route are sent to `/login`; authenticated non-admin users are
sent from admin routes to `/home`.

## Authentication

After login, the application stores `token`, `role`, and `email` in browser
`localStorage`. The HTTP interceptor adds the token to protected API requests:

```http
Authorization: Bearer <token>
```

Route guards provide client-side navigation control, while the backend remains
the authority for authentication and permissions. A rejected or expired token
causes the frontend to clear the stored session and redirect to `/login`.

## Validation

Registration mirrors the API constraints:

- Valid email address
- Password and confirmation between 8 and 50 characters
- Matching password and confirmation
- Optional leading `+` followed by 10 to 15 phone digits

Book and administrator forms display backend failures without discarding the
current page state.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the development server on port 4200 |
| `npm run build` | Create an optimized production build in `dist/bookstore/` |
| `npm run watch` | Build continuously with the development configuration |
| `npm test` | Run Vitest through the Angular test builder |

Run the test suite once for CI or local verification:

```bash
npm test -- --watch=false
```

## Project Structure

```text
src/app/
|- core/     authentication, API services, guards, interceptor, and theme
|- pages/    signup, login, customer, book detail, and admin screens
`- shared/   reusable navigation and book presentation components
```

The application uses standalone components, functional guards and
interceptors, reactive forms, and signals for UI state.

## Production Deployment

Production builds keep API URLs relative to the frontend origin. Configure the
web server or gateway to:

- Serve the generated files from `dist/bookstore/browser/`.
- Fall back to `index.html` for Angular routes.
- Forward `/api` to the Spring Boot service.

If the API must run on a different browser origin, add an environment-based API
URL strategy and matching backend CORS policy before deployment.

## Related API Resources

The backend repository contains full API setup instructions, Swagger/OpenAPI
links, and executable Postman collections for book and administrator flows.
