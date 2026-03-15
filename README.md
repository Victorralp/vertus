# Digital Banking Platform

A production-grade digital banking platform built with Next.js 14, TypeScript, Firebase, and modern UI components.

## Features

- 🏦 Modern banking interface with account management
- 🔐 Secure authentication with OTP verification
- 💸 Internal account transfers
- 💳 Virtual card management
- 📊 Transaction history and audit logging
- 🎨 Light/Dark mode support
- 📱 Fully responsive design
- ♿ Accessible UI components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **Form Validation**: React Hook Form + Zod
- **State Management**: React Context + Hooks

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public marketing site
│   ├── (auth)/                   # Auth pages
│   └── app/                      # Authenticated banking app
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── marketing/                # Marketing site components
│   ├── banking/                  # Banking app components
│   ├── auth/                     # Auth components
│   └── shared/                   # Shared components
└── lib/
    ├── firebase/                 # Firebase configuration
    ├── hooks/                    # React hooks
    ├── validations/              # Zod schemas
    └── types/                    # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see `.env.example`)

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run emulators` - Start Firebase emulators
- `npm run emulators:export` - Export emulator data
- `npm run emulators:import` - Start emulators with imported data
- `npm run functions:build` - Build Cloud Functions
- `npm run functions:deploy` - Deploy Cloud Functions
- `npm run deploy` - Build and deploy entire app

## Firebase Setup

### Local Development with Emulators

This project uses Firebase Emulators for local development, allowing you to develop and test without affecting production data.

1. **Install Firebase CLI** (if not already installed):
```bash
npm install -g firebase-tools
```

2. **Configure Environment Variables**:
   - Copy `.env.example` to `.env.local`
   - The default values are configured for Firebase Emulators
   - No real Firebase project needed for local development

3. **Start Firebase Emulators**:
```bash
npm run emulators
```

This will start:
- Auth Emulator on `localhost:9099`
- Firestore Emulator on `localhost:8080`
- Functions Emulator on `localhost:5001`
- Emulator UI on `localhost:4000`

4. **Run the Development Server** (in a separate terminal):
```bash
npm run dev
```

### Production Firebase Setup

To deploy to production Firebase:

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password provider)
   - Create a Firestore database
   - Enable Cloud Functions

2. **Update `.firebaserc`**:
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

3. **Configure Environment Variables**:
   - Update `.env.local` with your Firebase project credentials
   - Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false` for production
   - Configure SMTP settings for email functionality

4. **Deploy**:
```bash
npm run deploy
```

### Firebase Configuration Files

- `firebase.json` - Firebase project configuration
- `.firebaserc` - Firebase project aliases
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore indexes
- `functions/` - Cloud Functions source code

## Development Status

This project is currently in development. See the implementation plan in `.kiro/specs/digital-banking-platform/tasks.md` for progress.

## Security

This is a DEMO application for educational purposes. It implements realistic security practices but should not be used for actual financial transactions without proper security audits and compliance reviews.

## License

MIT
