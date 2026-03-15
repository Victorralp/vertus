/**
 * Cancel Payment Cloud Function
 * 
 * POST /api/billPayments/cancelPayment
 * 
 * Cancels a scheduled bill payment before it is processed.
 * Only payments with status 'scheduled' can be cancelled.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface CancelPaymentRequest {
  paymentId: string;
}

interface CancelPaymentResponse {
  success: boolean;
  paymentId: string;
  status: string;
  cancelledAt: string;
}

export const cancelPayment = functions.https.onRequest(async (req, res) => {
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
    const body = req.body as CancelPaymentRequest;
    
    // Validate required fields
    if (!body.paymentId) {
      res.status(400).json({ 
        error: 'Missing required field: paymentId' 
      });
      return;
    }
    
    const db = admin.firestore();
    
    // Use a transaction to ensure data consistency
    const result = await db.runTransaction(async (transaction) => {
      // Get the payment document
      const paymentRef = db.collection('users').doc(uid).collection('billPayments').doc(body.paymentId);
      const paymentDoc = await transaction.get(paymentRef);
      
      if (!paymentDoc.exists) {
        throw new Error('PAYMENT_NOT_FOUND');
      }
      
      const paymentData = paymentDoc.data();
      
      // Verify payment belongs to user
      if (paymentData?.uid !== uid) {
        throw new Error('PAYMENT_NOT_OWNED');
      }
      
      // Check payment status - only scheduled payments can be cancelled
      if (paymentData?.status !== 'scheduled') {
        throw new Error('PAYMENT_NOT_SCHEDULED');
      }
      
      // Update payment status to cancelled
      const timestamp = admin.firestore.Timestamp.now();
      transaction.update(paymentRef, {
        status: 'cancelled',
        cancelledAt: timestamp,
      });
      
      return {
        paymentId: body.paymentId,
        status: 'cancelled',
        cancelledAt: timestamp,
      };
    });
    
    // Prepare response
    const response: CancelPaymentResponse = {
      success: true,
      paymentId: result.paymentId,
      status: result.status,
      cancelledAt: result.cancelledAt.toDate().toISOString(),
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error cancelling payment:', error);
    
    // Handle specific error cases
    if ((error as Error).message === 'PAYMENT_NOT_FOUND') {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }
    
    if ((error as Error).message === 'PAYMENT_NOT_OWNED') {
      res.status(403).json({ error: 'Payment does not belong to user' });
      return;
    }
    
    if ((error as Error).message === 'PAYMENT_NOT_SCHEDULED') {
      res.status(400).json({ 
        error: 'Payment cannot be cancelled. Only scheduled payments can be cancelled.' 
      });
      return;
    }
    
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
