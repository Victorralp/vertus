# Service Account Setup Guide

This guide explains how to set up a Firebase service account for local development and production.

## For Local Development (Emulators)

When using Firebase emulators, you don't need a real service account. The `.env.local` file already contains demo credentials that work with the emulators:

```env
FIREBASE_ADMIN_PROJECT_ID=digital-banking-platform-demo
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@digital-banking-platform-demo.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nDEMO_KEY_FOR_EMULATOR\n-----END PRIVATE KEY-----\n"
```

These demo credentials are sufficient for local development with emulators.

## For Production

To deploy to production, you need to create a real Firebase service account:

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### Step 2: Enable Required Services

1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Save changes

2. **Firestore**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose production mode or test mode
   - Select a location

3. **Cloud Functions**:
   - Go to Functions
   - Click "Get started" if prompted
   - Functions will be enabled automatically

### Step 3: Get Web App Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select Web (</>) icon
4. Register your app with a nickname
5. Copy the configuration object

Update your `.env.local` or `.env.production` with these values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 4: Generate Service Account Key

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Click "Generate key" in the confirmation dialog
4. A JSON file will be downloaded - **keep this file secure!**

### Step 5: Extract Service Account Credentials

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xyz@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

Extract these values to your `.env.production` or production environment:

```env
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xyz@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- Keep the `\n` characters in the private key (they represent newlines)
- Wrap the private key in double quotes
- Never commit this file or these values to version control
- Add `.env.production` to your `.gitignore`

### Step 6: Secure the Service Account File

1. **Delete the downloaded JSON file** after extracting the values
2. Or store it in a secure password manager
3. Never commit it to Git
4. Never share it publicly

### Step 7: Set Environment Variables in Production

Depending on your hosting platform:

#### Vercel
1. Go to your project settings
2. Navigate to Environment Variables
3. Add each variable with its value
4. Select "Production" environment
5. Save changes

#### Firebase Hosting
1. Use Firebase Functions config:
```bash
firebase functions:config:set admin.project_id="your-project-id"
firebase functions:config:set admin.client_email="your-email"
firebase functions:config:set admin.private_key="your-key"
```

#### Other Platforms
Consult your platform's documentation for setting environment variables.

## Security Best Practices

### DO:
✅ Use environment variables for all credentials
✅ Use different Firebase projects for dev/staging/prod
✅ Rotate service account keys regularly (every 90 days)
✅ Use Firebase security rules to restrict data access
✅ Enable Firebase App Check in production
✅ Monitor Firebase usage and set up billing alerts
✅ Use least-privilege principle for service accounts

### DON'T:
❌ Commit service account JSON files to Git
❌ Share service account keys publicly
❌ Use production credentials in development
❌ Hardcode credentials in source code
❌ Give service accounts more permissions than needed
❌ Reuse service accounts across multiple projects
❌ Store credentials in client-side code

## Troubleshooting

### "Invalid service account" error
- Check that the private key includes `\n` characters
- Verify the private key is wrapped in double quotes
- Ensure there are no extra spaces or line breaks

### "Permission denied" error
- Verify the service account has the correct roles
- Check Firebase security rules
- Ensure the service account is from the correct project

### "Project not found" error
- Verify `FIREBASE_ADMIN_PROJECT_ID` matches your Firebase project ID
- Check that the project exists in Firebase Console
- Ensure you're using the correct Firebase project

## Rotating Service Account Keys

It's recommended to rotate service account keys every 90 days:

1. Generate a new private key (Step 4 above)
2. Update environment variables with new credentials
3. Deploy the updated configuration
4. Verify the new key works
5. Delete the old key from Firebase Console:
   - Go to Project Settings > Service Accounts
   - Click "Manage service account permissions"
   - Find the old key and delete it

## Additional Resources

- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-service-accounts)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
