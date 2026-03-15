# Authentication Guide - Vertex Credit Union

## Understanding the 404 Error on /app/dashboard

If you're seeing a 404 error when trying to access `/app/dashboard`, it's because **you need to be authenticated** to access the dashboard and other app routes.

## How Authentication Works

### Protected Routes
The following routes require authentication:
- `/app/dashboard` - Main dashboard
- `/app/accounts` - Account management
- `/app/transactions` - Transaction history
- `/app/transfers` - Money transfers
- `/app/cards` - Card management
- `/app/settings` - User settings
- All other `/app/*` routes

### Public Routes
These routes are accessible without authentication:
- `/` - Homepage
- `/personal` - Personal banking info
- `/business` - Business banking info
- `/loans` - Loan information
- `/cards` - Card products
- `/security` - Security information
- `/about` - About us
- `/contact` - Contact page
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page

## How to Access the Dashboard

### Step 1: Create an Account
1. Navigate to http://localhost:3001/sign-up
2. Fill in your details:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
3. Click "Create Account"
4. You'll be redirected to verify your email

### Step 2: Sign In
1. Navigate to http://localhost:3001/sign-in
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the dashboard

### Step 3: Access Dashboard
Once authenticated, you can access:
- http://localhost:3001/app/dashboard
- All other protected routes

## Authentication Flow

```
User visits /app/dashboard
    ↓
App Layout checks authentication
    ↓
Is user authenticated?
    ├─ Yes → Show dashboard
    └─ No → Redirect to /sign-in
```

## Testing with Mock Data

The dashboard currently uses mock data for:
- **Accounts**: 3 sample accounts (Checking, Savings, Business)
- **Transactions**: 5 recent transactions
- **Balance**: Total balance across all accounts

This mock data will display once you're authenticated.

## Firebase Authentication

The app uses Firebase Authentication with:
- Email/Password authentication
- Session persistence
- Secure token management
- Automatic session refresh

### Environment Variables Required
Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Troubleshooting

### Issue: 404 on /app/dashboard
**Solution**: You need to sign in first
1. Go to http://localhost:3001/sign-in
2. Create an account if you don't have one
3. Sign in with your credentials

### Issue: Redirect loop
**Solution**: Clear browser cache and cookies
1. Open DevTools (F12)
2. Go to Application tab
3. Clear storage
4. Refresh the page

### Issue: "Loading..." screen stuck
**Solution**: Check Firebase configuration
1. Verify `.env.local` has correct Firebase credentials
2. Check browser console for errors
3. Ensure Firebase project is active

### Issue: Can't create account
**Solution**: Check Firebase Authentication settings
1. Go to Firebase Console
2. Enable Email/Password authentication
3. Check for any error messages in console

## Quick Test Account

For testing purposes, you can create a test account:
- **Email**: test@vertexcu.com
- **Password**: Test123!
- **Name**: Test User

## Development Server

Make sure the development server is running:
```bash
cd digital-banking-platform
npm run dev
```

Server should be available at:
- **Local**: http://localhost:3001
- **Network**: Check terminal for network URL

## Authentication States

### Not Authenticated
- Shows loading screen briefly
- Redirects to `/sign-in`
- Cannot access `/app/*` routes

### Authenticated
- Shows dashboard with user data
- Can access all `/app/*` routes
- User info displayed in sidebar
- Can sign out from sidebar

## Session Management

### Session Duration
- Sessions persist across browser restarts
- Automatic token refresh
- Secure session storage

### Sign Out
To sign out:
1. Click your profile in the sidebar
2. Click the logout icon
3. You'll be redirected to `/sign-in`

## Security Features

- ✅ Password hashing (handled by Firebase)
- ✅ Secure token storage
- ✅ HTTPS required in production
- ✅ Session timeout handling
- ✅ CSRF protection
- ✅ XSS protection

## Next Steps

1. **Sign Up**: Create your account at `/sign-up`
2. **Sign In**: Log in at `/sign-in`
3. **Explore**: Access the dashboard and other features
4. **Test**: Try different features and routes

## Support

If you continue to experience issues:
1. Check browser console for errors
2. Verify Firebase configuration
3. Clear browser cache
4. Try incognito/private mode
5. Check network tab for failed requests

---

**Remember**: The dashboard is a protected route. You must be authenticated to access it!
