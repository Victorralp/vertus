# Firebase SDK Usage Examples

This document provides practical examples of how to use the Firebase SDK in the Digital Banking Platform.

## Client-Side Examples

### 1. Sign Up a New User

```typescript
import { signUp } from '@/lib/firebase/auth';

async function handleSignUp(email: string, password: string, name: string) {
  try {
    const userCredential = await signUp(email, password, name);
    console.log('User created:', userCredential.user.uid);
    // Email verification sent automatically
    // Redirect to verification page
  } catch (error) {
    console.error('Sign up failed:', error.message);
    // Show error to user
  }
}
```

### 2. Sign In an Existing User

```typescript
import { signIn } from '@/lib/firebase/auth';

async function handleSignIn(email: string, password: string) {
  try {
    const userCredential = await signIn(email, password);
    console.log('Signed in:', userCredential.user.email);
    // Redirect to dashboard
  } catch (error) {
    console.error('Sign in failed:', error.message);
    // Show error to user
  }
}
```

### 3. Sign Out

```typescript
import { signOut } from '@/lib/firebase/auth';

async function handleSignOut() {
  try {
    await signOut();
    console.log('Signed out successfully');
    // Redirect to home page
  } catch (error) {
    console.error('Sign out failed:', error.message);
  }
}
```

### 4. Check Authentication State

```typescript
'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

// Usage in a component
function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return <div>Welcome, {user.email}</div>;
}
```

### 5. Send Email Verification

```typescript
import { sendVerificationEmail } from '@/lib/firebase/auth';
import { auth } from '@/lib/firebase/client';

async function handleResendVerification() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await sendVerificationEmail(user);
    console.log('Verification email sent');
    // Show success message
  } catch (error) {
    console.error('Failed to send verification:', error.message);
  }
}
```

### 6. Reset Password

```typescript
import { resetPassword } from '@/lib/firebase/auth';

async function handlePasswordReset(email: string) {
  try {
    await resetPassword(email);
    console.log('Password reset email sent');
    // Show success message
  } catch (error) {
    console.error('Password reset failed:', error.message);
  }
}
```

### 7. Get ID Token for API Calls

```typescript
import { getIdToken } from '@/lib/firebase/auth';

async function callProtectedAPI() {
  const token = await getIdToken();
  if (!token) {
    console.error('Not authenticated');
    return;
  }

  const response = await fetch('/api/protected', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
}
```

### 8. Read Data from Firestore

```typescript
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';

async function getUserAccounts(userId: string) {
  try {
    const accountsRef = collection(db, 'accounts');
    const q = query(accountsRef, where('uid', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const accounts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return accounts;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
}
```

### 9. Listen to Real-time Updates

```typescript
import { db } from '@/lib/firebase/client';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

function useUserAccounts(userId: string) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const accountsRef = collection(db, 'accounts');
    const q = query(accountsRef, where('uid', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const accountsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAccounts(accountsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { accounts, loading };
}
```

### 10. Call Cloud Function

```typescript
import { functions } from '@/lib/firebase/client';
import { httpsCallable } from 'firebase/functions';

async function generateOTP(userId: string, purpose: string) {
  try {
    const generateOTPFunction = httpsCallable(functions, 'generateOTP');
    const result = await generateOTPFunction({ userId, purpose });
    
    console.log('OTP generated:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error;
  }
}
```

## Server-Side Examples

### 1. Verify ID Token in API Route

```typescript
// app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyIdToken(token);
    
    // User is authenticated
    const userId = decodedToken.uid;
    
    // Fetch user data or perform protected operation
    return NextResponse.json({ 
      message: 'Success',
      userId,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
```

### 2. Get User by Email

```typescript
import { getUserByEmail } from '@/lib/firebase/admin';

async function findUserByEmail(email: string) {
  try {
    const userRecord = await getUserByEmail(email);
    console.log('User found:', userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error('User not found:', error);
    return null;
  }
}
```

### 3. Set Custom Claims (Admin Role)

```typescript
import { setCustomUserClaims } from '@/lib/firebase/admin';

async function makeUserAdmin(userId: string) {
  try {
    await setCustomUserClaims(userId, { admin: true });
    console.log('User is now an admin');
  } catch (error) {
    console.error('Failed to set admin role:', error);
  }
}
```

### 4. Read from Firestore (Server-side)

```typescript
import { adminDb } from '@/lib/firebase/admin';

async function getUserData(userId: string) {
  try {
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    
    return userDoc.data();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
```

### 5. Write to Firestore (Server-side)

```typescript
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

async function createAuditLog(userId: string, action: string, metadata: any) {
  try {
    const logRef = await adminDb.collection('auditLogs').add({
      uid: userId,
      action,
      metadata,
      createdAt: FieldValue.serverTimestamp(),
    });
    
    console.log('Audit log created:', logRef.id);
    return logRef.id;
  } catch (error) {
    console.error('Error creating audit log:', error);
    throw error;
  }
}
```

### 6. Firestore Transaction (Server-side)

```typescript
import { adminDb } from '@/lib/firebase/admin';

async function transferFunds(fromAccountId: string, toAccountId: string, amount: number) {
  try {
    await adminDb.runTransaction(async (transaction) => {
      // Read both accounts
      const fromAccountRef = adminDb.collection('accounts').doc(fromAccountId);
      const toAccountRef = adminDb.collection('accounts').doc(toAccountId);
      
      const fromAccountDoc = await transaction.get(fromAccountRef);
      const toAccountDoc = await transaction.get(toAccountRef);
      
      if (!fromAccountDoc.exists || !toAccountDoc.exists) {
        throw new Error('Account not found');
      }
      
      const fromBalance = fromAccountDoc.data()!.balance;
      const toBalance = toAccountDoc.data()!.balance;
      
      if (fromBalance < amount) {
        throw new Error('Insufficient funds');
      }
      
      // Update both accounts atomically
      transaction.update(fromAccountRef, { balance: fromBalance - amount });
      transaction.update(toAccountRef, { balance: toBalance + amount });
    });
    
    console.log('Transfer completed successfully');
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
}
```

### 7. Middleware Authentication

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase/admin';

export async function middleware(request: NextRequest) {
  // Only protect /app routes
  if (!request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  try {
    // Get token from cookie or header
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const decodedToken = await verifyIdToken(token);
    
    // Check email verification
    if (!decodedToken.email_verified) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }

    // User is authenticated and verified
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

export const config = {
  matcher: '/app/:path*',
};
```

## React Hook Examples

### Custom Auth Hook

```typescript
// hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { signIn, signUp, signOut } from '@/lib/firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      await signUp(email, password, name);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      await signOut();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };
}
```

### Custom Firestore Hook

```typescript
// hooks/useFirestore.ts
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/client';
import { collection, query, where, onSnapshot, Query } from 'firebase/firestore';

export function useFirestoreQuery<T>(firestoreQuery: Query) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      firestoreQuery,
      (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestoreQuery]);

  return { data, loading, error };
}
```

## Best Practices

### 1. Error Handling
Always wrap Firebase calls in try-catch blocks and provide user-friendly error messages.

### 2. Loading States
Show loading indicators while Firebase operations are in progress.

### 3. Cleanup
Always unsubscribe from listeners in useEffect cleanup functions.

### 4. Security
- Never expose Admin SDK in client code
- Always verify tokens server-side
- Use Firestore security rules
- Validate all inputs

### 5. Performance
- Use real-time listeners sparingly
- Implement pagination for large datasets
- Cache data when appropriate
- Use indexes for complex queries

### 6. Type Safety
- Use TypeScript types for all Firebase data
- Define interfaces for your data models
- Use type guards for runtime validation

## Common Patterns

### Protected Route Component

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
```

### Form with Firebase Auth

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push('/app/dashboard');
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Sign In</button>
    </form>
  );
}
```

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth/web/start)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js with Firebase](https://firebase.google.com/docs/hosting/nextjs)
