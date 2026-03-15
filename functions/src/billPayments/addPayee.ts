/**
 * Add Payee Cloud Function
 * 
 * POST /api/billPayments/addPayee
 * 
 * Creates a new payee for bill payments with encrypted account number.
 * Validates routing number and ensures user authentication.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { encrypt } from '../utils/encryption';

// Validation helper for routing number
function validateRoutingNumber(routingNumber: string): boolean {
  // Must be exactly 9 digits
  if (!/^\d{9}$/.test(routingNumber)) {
    return false;
  }
  
  // Validate using routing number checksum algorithm
  const digits = routingNumber.split('').map(Number);
  const checksum = (
    3 * (digits[0] + digits[3] + digits[6]) +
    7 * (digits[1] + digits[4] + digits[7]) +
    (digits[2] + digits[5] + digits[8])
  ) % 10;
  
  return checksum === 0;
}

interface AddPayeeRequest {
  name: string;
  accountNumber: string;
  routingNumber: string;
  address?: string;
  category: 'utilities' | 'rent' | 'credit_card' | 'insurance' | 'loan' | 'subscription' | 'other';
}

interface AddPayeeResponse {
  payeeId: string;
  name: string;
  accountNumber: string; // Encrypted
  routingNumber: string;
  address?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export const addPayee = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
      return;
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    
    // Parse and validate request body
    const body = req.body as AddPayeeRequest;
    
    // Validate required fields
    if (!body.name || !body.accountNumber || !body.routingNumber || !body.category) {
      res.status(400).json({ 
        error: 'Missing required fields: name, accountNumber, routingNumber, category' 
      });
      return;
    }
    
    // Validate name length
    if (body.name.length < 1 || body.name.length > 100) {
      res.status(400).json({ 
        error: 'Payee name must be between 1 and 100 characters' 
      });
      return;
    }
    
    // Validate account number length
    if (body.accountNumber.length < 1 || body.accountNumber.length > 50) {
      res.status(400).json({ 
        error: 'Account number must be between 1 and 50 characters' 
      });
      return;
    }
    
    // Validate routing number format and checksum
    if (!validateRoutingNumber(body.routingNumber)) {
      res.status(400).json({ 
        error: 'Invalid routing number. Must be 9 digits with valid checksum' 
      });
      return;
    }
    
    // Validate category
    const validCategories = ['utilities', 'rent', 'credit_card', 'insurance', 'loan', 'subscription', 'other'];
    if (!validCategories.includes(body.category)) {
      res.status(400).json({ 
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}` 
      });
      return;
    }
    
    // Validate address length if provided
    if (body.address && body.address.length > 200) {
      res.status(400).json({ 
        error: 'Address must be less than 200 characters' 
      });
      return;
    }
    
    // Encrypt the account number for security
    const encryptedAccountNumber = encrypt(body.accountNumber);
    
    // Create payee document
    const db = admin.firestore();
    const payeeRef = db.collection('users').doc(uid).collection('payees').doc();
    
    const now = admin.firestore.Timestamp.now();
    const payeeData = {
      payeeId: payeeRef.id,
      uid: uid,
      name: body.name,
      accountNumber: encryptedAccountNumber,
      routingNumber: body.routingNumber,
      address: body.address || null,
      category: body.category,
      createdAt: now,
      updatedAt: now,
    };
    
    await payeeRef.set(payeeData);
    
    // Return response with payee data
    const response: AddPayeeResponse = {
      payeeId: payeeData.payeeId,
      name: payeeData.name,
      accountNumber: payeeData.accountNumber,
      routingNumber: payeeData.routingNumber,
      address: payeeData.address || undefined,
      category: payeeData.category,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    };
    
    res.status(201).json(response);
    
  } catch (error) {
    console.error('Error adding payee:', error);
    
    if ((error as any).code === 'auth/id-token-expired') {
      res.status(401).json({ error: 'Token expired' });
      return;
    }
    
    if ((error as any).code === 'auth/argument-error') {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});
