/**
 * Get Payment History Cloud Function
 * 
 * GET /api/billPayments/history
 * 
 * Retrieves bill payment history for the authenticated user with pagination.
 * Supports filtering by status and date range.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface BillPaymentResponse {
  paymentId: string;
  uid: string;
  payeeId: string;
  fromAccountId: string;
  amount: number;
  scheduledDate: string;
  status: string;
  recurring: boolean;
  recurrenceRule?: any;
  memo?: string;
  confirmationNumber?: string;
  failureReason?: string;
  createdAt: string;
  processedAt?: string;
  cancelledAt?: string;
}

interface PaymentHistoryResponse {
  payments: BillPaymentResponse[];
  hasMore: boolean;
  lastPaymentId?: string;
}

export const getPaymentHistory = functions.https.onRequest(async (req, res) => {
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
    
    // Parse query parameters
    const limitParam = req.query.limit as string;
    const limit = limitParam ? parseInt(limitParam) : 20;
    const startAfter = req.query.startAfter as string;
    const status = req.query.status as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    
    // Validate limit
    if (limitParam && (isNaN(limit) || limit < 1 || limit > 100)) {
      res.status(400).json({ 
        error: 'Limit must be between 1 and 100' 
      });
      return;
    }
    
    // Validate status if provided
    const validStatuses = ['scheduled', 'processing', 'completed', 'failed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
      return;
    }
    
    // Validate dates if provided
    let startTimestamp: admin.firestore.Timestamp | undefined;
    let endTimestamp: admin.firestore.Timestamp | undefined;
    
    if (startDate) {
      const startDateObj = new Date(startDate);
      if (isNaN(startDateObj.getTime())) {
        res.status(400).json({ 
          error: 'Invalid startDate format. Must be a valid ISO date string' 
        });
        return;
      }
      startTimestamp = admin.firestore.Timestamp.fromDate(startDateObj);
    }
    
    if (endDate) {
      const endDateObj = new Date(endDate);
      if (isNaN(endDateObj.getTime())) {
        res.status(400).json({ 
          error: 'Invalid endDate format. Must be a valid ISO date string' 
        });
        return;
      }
      endTimestamp = admin.firestore.Timestamp.fromDate(endDateObj);
    }
    
    if (startTimestamp && endTimestamp && startTimestamp.toMillis() > endTimestamp.toMillis()) {
      res.status(400).json({ 
        error: 'startDate must be before endDate' 
      });
      return;
    }
    
    const db = admin.firestore();
    
    // Build query
    let query: admin.firestore.Query = db
      .collection('users')
      .doc(uid)
      .collection('billPayments')
      .orderBy('createdAt', 'desc');
    
    // Apply status filter
    if (status) {
      query = query.where('status', '==', status);
    }
    
    // Apply date range filters
    if (startTimestamp) {
      query = query.where('scheduledDate', '>=', startTimestamp);
    }
    
    if (endTimestamp) {
      query = query.where('scheduledDate', '<=', endTimestamp);
    }
    
    // Apply pagination
    if (startAfter) {
      const startAfterDoc = await db
        .collection('users')
        .doc(uid)
        .collection('billPayments')
        .doc(startAfter)
        .get();
      
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }
    
    // Fetch one extra to determine if there are more results
    query = query.limit(limit + 1);
    
    const snapshot = await query.get();
    
    // Check if there are more results
    const hasMore = snapshot.docs.length > limit;
    const payments = snapshot.docs.slice(0, limit);
    
    // Convert documents to response format
    const paymentResponses: BillPaymentResponse[] = payments.map(doc => {
      const data = doc.data();
      
      const payment: BillPaymentResponse = {
        paymentId: doc.id,
        uid: data.uid,
        payeeId: data.payeeId,
        fromAccountId: data.fromAccountId,
        amount: data.amount,
        scheduledDate: data.scheduledDate.toDate().toISOString(),
        status: data.status,
        recurring: data.recurring || false,
        createdAt: data.createdAt.toDate().toISOString(),
      };
      
      // Add optional fields
      if (data.recurrenceRule) {
        const rule: any = {
          frequency: data.recurrenceRule.frequency,
        };
        
        if (data.recurrenceRule.dayOfMonth !== undefined) {
          rule.dayOfMonth = data.recurrenceRule.dayOfMonth;
        }
        
        if (data.recurrenceRule.dayOfWeek !== undefined) {
          rule.dayOfWeek = data.recurrenceRule.dayOfWeek;
        }
        
        if (data.recurrenceRule.endDate) {
          rule.endDate = data.recurrenceRule.endDate.toDate().toISOString();
        }
        
        payment.recurrenceRule = rule;
      }
      
      if (data.memo) {
        payment.memo = data.memo;
      }
      
      if (data.confirmationNumber) {
        payment.confirmationNumber = data.confirmationNumber;
      }
      
      if (data.failureReason) {
        payment.failureReason = data.failureReason;
      }
      
      if (data.processedAt) {
        payment.processedAt = data.processedAt.toDate().toISOString();
      }
      
      if (data.cancelledAt) {
        payment.cancelledAt = data.cancelledAt.toDate().toISOString();
      }
      
      return payment;
    });
    
    // Prepare response
    const response: PaymentHistoryResponse = {
      payments: paymentResponses,
      hasMore,
    };
    
    if (hasMore && paymentResponses.length > 0) {
      response.lastPaymentId = paymentResponses[paymentResponses.length - 1].paymentId;
    }
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error fetching payment history:', error);
    
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
