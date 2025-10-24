# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chronos.work is a modern time tracking application frontend built with Next.js 16, React 19, TypeScript, and Tailwind CSS. It provides check-in/check-out functionality for tracking work hours with JWT-based authentication via a backend API.

## Development Commands

### Setup
```bash
npm install
```

Create `.env.local` with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development
```bash
npm run dev        # Start development server with Turbopack
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

### Backend Dependency
The backend API must be running on `http://localhost:8000` (from the chronos_work repository).

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Context API for authentication state
- **API Client**: Custom class-based API client (`app/lib/api.ts`)

### Authentication Flow
- **JWT-based authentication** using access tokens and refresh tokens
- **Access tokens**: Short-lived (15 minutes), stored in localStorage, sent via `Authorization: Bearer <token>` header
- **Refresh tokens**: Long-lived (7 days), stored in localStorage, used to obtain new access tokens
- **Automatic token refresh**: When a request returns 401, the API client automatically attempts to refresh the access token using the refresh token
- **Authentication Context** (`app/contexts/AuthContext.tsx`): Global state management for user authentication
  - Provides `useAuth` hook for accessing user data and auth methods
  - Automatically loads user profile on app mount
  - Handles login, register, logout, and profile refresh
- **Token storage**: Tokens stored in localStorage (keys: `accessToken`, `refreshToken`)
- **Protected routes**: Components use `useAuth` hook to access authentication state

### Project Structure
```
app/
├── components/          # Reusable UI components (Navbar, Hero, Features, Footer, etc.)
├── contexts/
│   └── AuthContext.tsx  # Authentication context and useAuth hook
├── lib/
│   └── api.ts          # API client singleton with all backend endpoints
├── dashboard/
│   └── page.tsx        # Main dashboard with check-in/check-out functionality
├── login/
│   └── page.tsx        # Login form
├── register/
│   └── page.tsx        # Registration form
├── globals.css         # Tailwind + custom component classes
├── layout.tsx          # Root layout with metadata and AuthProvider
└── page.tsx            # Landing page
```

### API Integration

The API client is a singleton exported from `app/lib/api.ts`:

```typescript
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';

// Using the auth context (recommended in components)
const { login, register, logout, user } = useAuth();
await login(email, password);
await register({ name, email, password });
await logout();

// Direct API usage (for specific cases)
await api.checkIn();
await api.checkOut();
const logs = await api.getTimeLogs();
const { user } = await api.getProfile();
```

**Backend Endpoints:**
- `POST /auth/login` - User login (returns accessToken, refreshToken, user)
- `POST /auth/register` - User registration (returns accessToken, refreshToken, user)
- `POST /auth/refresh-token` - Refresh access token (requires refreshToken in body)
- `POST /auth/logout` - Logout user (invalidates refresh token)
- `GET /auth/profile` - Get current user profile (requires auth)
- `POST /auth/upload-photo` - Upload profile photo (requires auth)
- `POST /timelog/checkin` - Start work session (requires auth)
- `POST /timelog/checkout` - End current session (requires auth)
- `GET /timelog` - Get all time logs for user (requires auth)

**Types:**
- `TimeLog` - Time log entry with id, checkIn, checkOut, and optional user
- `User` - Full user data with all profile fields (name, email, cpf, department, etc.)
- `RegisterData` - User registration payload with required and optional fields
- `AuthResponse` - Login/register response with message, user, accessToken, refreshToken
- `RefreshTokenResponse` - Refresh response with accessToken and refreshToken

**Token Management:**
The API client handles token management automatically:
- Stores tokens in localStorage on login/register
- Adds `Authorization: Bearer <token>` header to authenticated requests
- Automatically refreshes tokens on 401 errors
- Clears tokens on logout

### Styling System

Uses Tailwind CSS with custom utility classes defined in `app/globals.css`:

**Custom Classes:**
- `.btn` - Base button (use with modifiers)
- `.btn-primary` - Blue primary button
- `.btn-secondary` - Grey secondary button
- `.btn-ghost` - Transparent button with hover
- `.card` - White card with border and shadow
- `.input` - Form input with focus ring
- `.label` - Form label
- `.container-custom` - Responsive container (max-width: 1200px)

**Color Tokens:**
- `primary-*` - Blue shades (50-950) for primary actions
- `warmGrey-*` - Neutral shades (50-950) for text and backgrounds

**Spacing:**
- `navbar` - 64px navbar height
- `sidebar` - 285px (reserved for future use)
- `sidebar-collapsed` - 55px (reserved for future use)

### Component Patterns

**Client Components:**
All interactive pages use `'use client'` directive at the top since they use hooks.

**Loading States:**
Use separate `loading` and `actionLoading` states to prevent double-clicks on actions while showing initial loading.

**Error Handling:**
Display errors in red alert boxes. 401 errors are handled automatically by the API client (token refresh or redirect to login).

**Date Formatting:**
Use `toLocaleString('pt-BR')` for consistent Brazilian Portuguese date formatting.

**Interactive Background:**
The landing page uses an animated gradient mesh background (`InteractiveBackground.tsx`) with:
- 6 large gradient blobs with different colors (blue, purple, pink)
- Slow, smooth animations (12-18s duration each with staggered delays)
- Subtle mouse follower effect with 500ms transition
- Base gradient overlay for depth
- All animations use `ease-in-out` for smooth transitions

## Key Implementation Details

### Time Calculation
Duration calculation in dashboard compares check-in timestamp with either check-out timestamp or current time (`Date.now()`) for active sessions.

### Active Session Detection
Active sessions are identified by `checkOut === null`. The dashboard finds the first log without a checkout time to show as the current session.

### Image Assets
Logo is at `/public/logo.png` and should be referenced via Next.js Image component with dimensions 1200x320 (auto-resized as needed).

### Path Aliases
Use `@/*` to reference files from project root (configured in tsconfig.json).

## Migration Notes

This project was migrated from Vite to Next.js 16 for better SEO, file-based routing, and improved performance with Turbopack. The migration is complete and all Vite references have been removed.

## Implemented Features

- ✅ JWT-based authentication with access and refresh tokens
- ✅ Authentication context for global user state
- ✅ Automatic token refresh on expiration

## Future Planned Features

- Protected routes middleware
- Loading skeletons
- Time log filtering/search
- Data export functionality
- Dark mode support
- Profile editing page
