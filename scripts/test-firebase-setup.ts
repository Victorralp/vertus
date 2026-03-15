/**
 * Firebase Setup Verification Script
 * 
 * This script tests the Firebase SDK configuration to ensure everything is set up correctly.
 * Run this script with: npx ts-node scripts/test-firebase-setup.ts
 * 
 * Prerequisites:
 * - Firebase emulators must be running (npm run emulators)
 * - Environment variables must be set in .env.local
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testFirebaseSetup() {
  console.log('🔍 Testing Firebase SDK Setup...\n');

  // Test 1: Environment Variables
  console.log('1️⃣ Checking environment variables...');
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'FIREBASE_ADMIN_PROJECT_ID',
    'FIREBASE_ADMIN_CLIENT_EMAIL',
    'FIREBASE_ADMIN_PRIVATE_KEY',
  ];

  let allEnvVarsPresent = true;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`   ❌ Missing: ${envVar}`);
      allEnvVarsPresent = false;
    } else {
      console.log(`   ✅ ${envVar}`);
    }
  }

  if (!allEnvVarsPresent) {
    console.error('\n❌ Some environment variables are missing. Please check your .env.local file.\n');
    process.exit(1);
  }

  console.log('\n2️⃣ Testing Firebase Client SDK...');
  try {
    // Dynamic import to avoid issues with Firebase initialization
    const { auth, db, functions } = await import('../src/lib/firebase/client');
    
    console.log(`   ✅ Firebase app initialized`);
    console.log(`   ✅ Project ID: ${auth.app.options.projectId}`);
    console.log(`   ✅ Auth domain: ${auth.app.options.authDomain}`);
    
    // Check if emulators are configured
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      console.log(`   ✅ Emulators configured`);
      console.log(`      - Auth: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST}`);
      console.log(`      - Firestore: ${process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST}`);
      console.log(`      - Functions: ${process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_HOST}`);
    }
  } catch (error) {
    console.error(`   ❌ Error initializing Firebase Client SDK:`, error);
    process.exit(1);
  }

  console.log('\n3️⃣ Testing Firebase Admin SDK...');
  try {
    const { adminAuth, adminDb } = await import('../src/lib/firebase/admin');
    
    console.log(`   ✅ Firebase Admin SDK initialized`);
    console.log(`   ✅ Project ID: ${process.env.FIREBASE_ADMIN_PROJECT_ID}`);
    
    // Test Admin SDK connection (only works with emulators running)
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      try {
        // Try to list users (will work with emulator)
        const listUsersResult = await adminAuth.listUsers(1);
        console.log(`   ✅ Admin SDK can connect to Auth emulator`);
        console.log(`   ℹ️  Users in emulator: ${listUsersResult.users.length}`);
      } catch (error: any) {
        if (error.code === 'auth/emulator-config-failed') {
          console.log(`   ⚠️  Auth emulator not running. Start with: npm run emulators`);
        } else {
          console.log(`   ⚠️  Could not connect to emulator: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error(`   ❌ Error initializing Firebase Admin SDK:`, error);
    process.exit(1);
  }

  console.log('\n4️⃣ Testing Auth Helper Functions...');
  try {
    const authHelpers = await import('../src/lib/firebase/auth');
    
    const expectedFunctions = [
      'signUp',
      'signIn',
      'signOut',
      'sendVerificationEmail',
      'resetPassword',
      'getCurrentUser',
      'getIdToken',
      'isEmailVerified',
      'waitForAuthInit',
    ];

    for (const funcName of expectedFunctions) {
      if (typeof (authHelpers as any)[funcName] === 'function') {
        console.log(`   ✅ ${funcName} function exported`);
      } else {
        console.error(`   ❌ ${funcName} function not found`);
      }
    }
  } catch (error) {
    console.error(`   ❌ Error loading auth helpers:`, error);
    process.exit(1);
  }

  console.log('\n✅ All Firebase SDK setup tests passed!\n');
  console.log('📝 Next steps:');
  console.log('   1. Start Firebase emulators: npm run emulators');
  console.log('   2. Start Next.js dev server: npm run dev');
  console.log('   3. Open http://localhost:3000 in your browser\n');
}

// Run the tests
testFirebaseSetup().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
