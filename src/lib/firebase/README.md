# Firebase Configuration

This directory contains Firebase SDK configuration files for the Digital Banking Platform.

## Files

### `client.ts`
Firebase Client SDK configuration for browser-side operations.

**Features:**
- Initializes Firebase app with configuration from environment variables
- Configures Firebase Auth, Firestore, and Functions
- Automatically connects to Firebase emulators in development mode
- Singleton pattern to prevent multiple initializations

**Usage:**
```typescript
import { auth, db, functions } from '@/lib/firebase/client';
```

### `admin.ts`
Firebase Admin SDK configuration for server-side operations.

**Features:**
- Initializes Firebase Admin SDK with service account credentials
- Provides helper functions for user management and token verification
- Automatically connects to Firebase emulators in development mode
- Should ONLY be imported in server-side code (API routes, server components, middleware)

**Usage:**
```typescript
import { adminAuth, adminDb, verifyIdToken } from '@/lib/firebase/admin';
```

**Important:** Never import this file in client-side code!

### `auth.ts`
Authentication helper functions using Firebase Client SDK.

**Features:**
- Sign up, sign in, sign out functions
- Email verification and password reset
- User-friendly error messages
- ID token management

**Usage:**
```typescript
import { signUp, signIn, signOut, resetPassword } from '@/lib/firebase/auth';
```

## Environment Variables

### Client SDK (Public)
These variables are prefixed with `NEXT_PUBLIC_` and are exposed to the browser:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Admin SDK (Server-side only)
These variables are kept secret and only available server-side:

```env
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Emulator Configuration
For local development with Firebase emulators:

```env
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=localhost:8080
NEXT_PUBLIC_FUNCTIONS_EMULATOR_HOST=localhost:5001
```

## Local Development Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase (if not already done)
```bash
firebase init
```
Select:
- Authentication
- Firestore
- Functions
- Hosting
- Emulators

### 4. Start Firebase Emulators
```bash
npm run emulators
```

This will start:
- Auth Emulator on port 9099
- Firestore Emulator on port 8080
- Functions Emulator on port 5001
- Emulator UI on port 4000

### 5. Start Next.js Development Server
```bash
npm run dev
```

The app will automatically connect to the emulators when `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`.

## Production Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Enable Cloud Functions

### 2. Get Firebase Configuration
1. Go to Project Settings
2. Under "Your apps", add a web app
3. Copy the configuration values to your `.env.local` file

### 3. Create Service Account
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Extract the values to your `.env.local` file:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

**Important:** Never commit the service account JSON file or private key to version control!

### 4. Deploy
```bash
npm run deploy
```

## Security Best Practices

1. **Never commit credentials**: Keep `.env.local` in `.gitignore`
2. **Use environment variables**: Never hardcode API keys or secrets
3. **Separate environments**: Use different Firebase projects for development, staging, and production
4. **Rotate keys regularly**: Regenerate service account keys periodically
5. **Limit permissions**: Use Firebase security rules to restrict data access
6. **Enable App Check**: Protect your backend resources from abuse (optional but recommended)

## Firebase App Check (Optional)

Firebase App Check helps protect your backend resources from abuse by preventing unauthorized clients from accessing your Firebase services.

### Setup
1. Enable App Check in Firebase Console
2. Register your app with reCAPTCHA v3 (web) or App Attest (iOS) or Play Integrity (Android)
3. Add App Check SDK to your app:

```typescript
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// In client.ts, after initializing the app
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}
```

4. Add environment variable:
```env
NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY=your_recaptcha_site_key
```

## Troubleshooting

### Emulator Connection Issues
- Make sure emulators are running: `npm run emulators`
- Check that ports are not in use by other applications
- Verify `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in `.env.local`

### Authentication Errors
- Check that Email/Password authentication is enabled in Firebase Console
- Verify environment variables are set correctly
- Check browser console for detailed error messages

### Admin SDK Errors
- Ensure you're only importing `admin.ts` in server-side code
- Verify service account credentials are correct
- Check that private key includes `\n` characters (not literal newlines)

### CORS Errors
- Make sure you're using the correct Firebase configuration
- Check that your domain is authorized in Firebase Console
- Verify you're not mixing emulator and production configurations

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
