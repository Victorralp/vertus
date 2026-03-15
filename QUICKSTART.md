# Quick Start Guide

This guide will help you get the Digital Banking Platform running locally in under 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm installed
- Firebase CLI installed globally (`npm install -g firebase-tools`)

## Quick Setup (Local Development)

### 1. Install Dependencies

```bash
# Install main project dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### 2. Environment Configuration

The project comes pre-configured for local development with Firebase Emulators. The `.env.local` file is already set up with emulator configuration.

**No Firebase project needed for local development!**

### 3. Start Firebase Emulators

In one terminal window:

```bash
npm run emulators
```

This will start:
- ✅ Auth Emulator on http://localhost:9099
- ✅ Firestore Emulator on http://localhost:8080
- ✅ Functions Emulator on http://localhost:5001
- ✅ Emulator UI on http://localhost:4000

### 4. Start Development Server

In another terminal window:

```bash
npm run dev
```

The app will be available at http://localhost:3000

### 5. Access the Application

- **Main App**: http://localhost:3000
- **Emulator UI**: http://localhost:4000 (to inspect data)

## What's Working Now

✅ Next.js 14 with TypeScript and Tailwind CSS
✅ Firebase Emulators (Auth, Firestore, Functions)
✅ Firestore Security Rules
✅ shadcn/ui Components
✅ Project Structure and Configuration

## What's Next

The following features will be implemented in subsequent tasks:

- 🔄 Firebase SDK Integration (Task 1.3)
- 🔄 Cloud Functions (Phase 2)
- 🔄 Authentication Pages (Phase 3)
- 🔄 Banking Dashboard (Phase 4)
- 🔄 Transfers and Cards (Phases 5-6)

## Troubleshooting

### Emulators won't start

Make sure Firebase CLI is installed:
```bash
npm install -g firebase-tools
```

### Port already in use

If you see port conflicts, you can change the ports in `firebase.json`:
```json
"emulators": {
  "auth": { "port": 9099 },
  "firestore": { "port": 8080 },
  "functions": { "port": 5001 },
  "ui": { "port": 4000 }
}
```

### Functions build errors

Make sure you've installed functions dependencies:
```bash
cd functions
npm install
npm run build
cd ..
```

## Development Workflow

1. **Start Emulators**: `npm run emulators` (keep running)
2. **Start Dev Server**: `npm run dev` (in separate terminal)
3. **Make Changes**: Edit files in `src/`
4. **View Changes**: Hot reload at http://localhost:3000
5. **Inspect Data**: Use Emulator UI at http://localhost:4000

## Useful Commands

```bash
# Development
npm run dev                    # Start Next.js dev server
npm run emulators             # Start Firebase emulators

# Building
npm run build                 # Build Next.js app
npm run functions:build       # Build Cloud Functions

# Emulator Data Management
npm run emulators:export      # Export emulator data
npm run emulators:import      # Start with imported data

# Code Quality
npm run lint                  # Run ESLint
```

## Next Steps

1. Review the project structure in `SETUP.md`
2. Check the implementation plan in `.kiro/specs/digital-banking-platform/tasks.md`
3. Start implementing features following the task list

## Need Help?

- Check `SETUP.md` for detailed setup information
- Review `README.md` for project overview
- See `.kiro/specs/digital-banking-platform/` for requirements and design docs
