/**
 * Get Payees Cloud Function
 * 
 * GET /api/billPayments/payees
 * 
 * Retrieves all payees for the authenticated user.
 * Returns payees with encrypted account numbers (not decrypted for security).
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface PayeeResponse {
  payeeId: string;
  name: string;
  accountNumber: string; // Encrypted
  routingNumber: string;
  address?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface GetPayeesResponse {
  payees: PayeeResponse[];
  count: number;
}

export const getPayees = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
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
    
    // Query all payees for the user
    const db = admin.firestore();
    const payeesSnapshot = await db
      .collection('users')
      .doc(uid)
      .collection('payees')
      .orderBy('createdAt', 'desc')
      .get();
    
    // Map payees to response format
    const payees: PayeeResponse[] = payeesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        payeeId: data.payeeId,
        name: data.name,
        accountNumber: data.accountNumber, // Keep encrypted
        routingNumber: data.routingNumber,
        address: data.address || undefined,
        category: data.category,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      };
    });
    
    const response: GetPayeesResponse = {
      payees,
      count: payees.length,
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error getting payees:', error);
    
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
