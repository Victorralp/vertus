# Environment Configuration for Firebase Functions

This document explains how to configure environment variables for Firebase Cloud Functions, specifically for SMTP email sending.

## Local Development Setup

### 1. Create .env File

Copy the example environment file:

```bash
cd functions
cp .env.example .env
```

### 2. Configure SMTP Credentials

Edit the `.env` file with your actual SMTP credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=NexusBank <noreply@nexusbank.com>
```

### 3. Gmail App Password Setup (Recommended)

If using Gmail, you need to create an App Password:

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification (enable if not already)
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Use this password in `SMTP_PASS` (not your regular Gmail password)

**Instructions:** https://support.google.com/accounts/answer/185833

### 4. Other Email Providers

For other email providers, update the SMTP configuration:

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

**AWS SES:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

## Production Deployment

### Option 1: Firebase Functions Config (Recommended)

Set environment variables using Firebase CLI:

```bash
# Set individual variables
firebase functions:config:set smtp.host="smtp.gmail.com"
firebase functions:config:set smtp.port="587"
firebase functions:config:set smtp.user="your-email@gmail.com"
firebase functions:config:set smtp.pass="your-app-password"
firebase functions:config:set smtp.from="NexusBank <noreply@nexusbank.com>"

# View current configuration
firebase functions:config:get

# Deploy functions with new config
firebase deploy --only functions
```

**Note:** You'll need to update your functions code to read from `functions.config()` instead of `process.env` for this approach.

### Option 2: Environment Variables in .env (Current Implementation)

The current implementation uses `process.env`, which works with:

1. **Local development:** `.env` file (loaded automatically)
2. **Firebase deployment:** Create `.env` file in functions directory before deploying

```bash
cd functions
# Create .env with production values
echo "SMTP_HOST=smtp.gmail.com" > .env
echo "SMTP_PORT=587" >> .env
echo "SMTP_USER=your-email@gmail.com" >> .env
echo "SMTP_PASS=your-app-password" >> .env
echo "SMTP_FROM=NexusBank <noreply@nexusbank.com>" >> .env

# Deploy
firebase deploy --only functions
```

**Important:** Add `.env` to `.gitignore` to avoid committing secrets!

## Testing Email Configuration

### Local Testing

1. Configure your `.env` file with valid SMTP credentials
2. Start the Firebase emulator:
   ```bash
   firebase emulators:start
   ```
3. Call the `generateOTP` function from your app
4. Check your email inbox for the OTP code

### Development Mode (No SMTP)

If SMTP is not configured, the email service will fall back to console logging:

```
==================================================
OTP EMAIL (Development Mode)
==================================================
To: user@example.com
Purpose: transfer
OTP Code: 123456
Expires: 5 minutes from now
==================================================
```

This allows development without setting up SMTP credentials.

## Troubleshooting

### "Failed to connect to email server"

- Verify SMTP_HOST and SMTP_PORT are correct
- Check if your email provider requires SSL (port 465) or STARTTLS (port 587)
- Ensure firewall/network allows outbound SMTP connections

### "Authentication failed"

- For Gmail: Use App Password, not regular password
- Verify SMTP_USER and SMTP_PASS are correct
- Check if 2FA is enabled (required for Gmail App Passwords)

### "Failed to send verification email"

- Check email provider rate limits
- Verify sender email (SMTP_FROM) is authorized
- Review Firebase Functions logs: `firebase functions:log`

### Emails not received

- Check spam/junk folder
- Verify recipient email is valid
- Check email provider's sending limits
- Review Firebase Functions logs for errors

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use App Passwords** - Don't use your main email password
3. **Rotate credentials regularly** - Update passwords periodically
4. **Use dedicated email accounts** - Create a separate account for sending
5. **Monitor usage** - Watch for unusual sending patterns
6. **Enable 2FA** - Protect your email account with two-factor authentication

## Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Firebase Functions Environment Configuration](https://firebase.google.com/docs/functions/config-env)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SendGrid SMTP Setup](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)
