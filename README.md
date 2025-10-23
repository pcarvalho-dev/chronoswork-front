# Chronos.work Frontend

A modern time tracking application frontend built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Overview

This is the frontend application for Chronos.work, providing a beautiful and intuitive interface for tracking work hours with check-in/check-out functionality.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: React 19

## Features

- **Landing Page**: Modern, responsive landing page with feature showcase
- **Authentication**: Login and registration pages with form validation
- **Dashboard**: Interactive dashboard with:
  - Real-time check-in/check-out functionality
  - Active session tracking
  - Time log history with duration calculations
  - Beautiful UI with responsive design
- **API Integration**: Fully integrated with the Chronos.work backend API

## Project Structure

```
chronos_work_frontend/
├── app/
│   ├── components/       # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Footer.tsx
│   ├── contexts/         # React contexts (for future use)
│   ├── lib/             # Utilities and API client
│   │   └── api.ts       # API client for backend integration
│   ├── dashboard/       # Dashboard page
│   │   └── page.tsx
│   ├── login/           # Login page
│   │   └── page.tsx
│   ├── register/        # Register page
│   │   └── page.tsx
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home/landing page
├── public/              # Static assets
├── .env.local           # Environment variables (not committed)
├── next.config.ts       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:8000` (see chronos_work project)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server (Turbopack enabled by default)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Integration

The frontend integrates with the backend API through the `app/lib/api.ts` client:

### Endpoints Used

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /timelog/checkin` - Check in to start a work session
- `POST /timelog/checkout` - Check out from current session
- `GET /timelog` - Get all time logs

### Authentication

The application uses session-based authentication with cookies. The API client is configured with:
- `credentials: 'include'` for session cookies
- Automatic error handling
- TypeScript types for all responses

## Pages

### Landing Page (`/`)
- Hero section with call-to-action buttons
- Features showcase
- Footer with links

### Login (`/login`)
- Email and password authentication
- Error handling with user feedback
- Redirect to dashboard on success

### Register (`/register`)
- User registration with name, email, and password
- Password confirmation validation
- Automatic login after registration

### Dashboard (`/dashboard`)
- Real-time session tracking
- Check-in/check-out buttons
- Time log history with duration calculations
- Active session indicator

## Styling

The project uses Tailwind CSS with a custom design system:

### Color Palette
- **Primary**: Blue shades (primary-50 to primary-950)
- **Warm Grey**: Neutral shades (warmGrey-50 to warmGrey-950)

### Custom Tailwind Classes
- `.btn` - Base button styles
- `.btn-primary` - Primary button (blue)
- `.btn-secondary` - Secondary button (grey)
- `.btn-ghost` - Ghost button (transparent)
- `.card` - Card container with border and shadow
- `.input` - Form input with focus styles
- `.label` - Form label
- `.container-custom` - Responsive container with max-width

## Development Notes

### Migration from Vite to Next.js

This project was migrated from Vite to Next.js 16 for:
- Better SEO with server-side rendering capabilities
- Built-in routing with file-based system
- API routes support (for future use)
- Improved performance with Turbopack
- Better developer experience

### TypeScript Configuration

The project uses strict TypeScript with:
- ES2020 target
- React JSX automatic runtime
- Path aliases (`@/*` for project root)
- Isolated modules for better performance

## Future Enhancements

- [ ] Add authentication context for global user state
- [ ] Implement protected routes middleware
- [ ] Add loading skeletons for better UX
- [ ] Implement time log filtering and search
- [ ] Add data export functionality
- [ ] Implement dark mode
- [ ] Add unit and integration tests

## Contributing

This is part of the Chronos.work project. See the main project README for contribution guidelines.

## License

MIT
