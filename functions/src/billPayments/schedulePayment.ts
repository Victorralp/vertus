/**
 * Schedule Payment Cloud Function
 * 
 * POST /api/billPayments/schedulePayment
 * 
 * Schedules a bill payment (one-time or recurring) after validating:
 * - User authentication
 * - Payee exists
 * - Account has sufficient balance
 * - Scheduled date is in the future
 * - Recurrence rules are valid
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface RecurrenceRule {
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  dayOfMonth?: number;        // For monthly (1-31)
  dayOfWeek?: number;         // For weekly (0-6, 0=Sunday)
  endDate?: string;           // ISO date string (optional)
}

interface SchedulePaymentRequest {
  payeeId: string;
  fromAccountId: string;
  amount: number;             // In cents
  scheduledDate: string;      // ISO date string
  recurring?: boolean;
  recurrenceRule?: RecurrenceRule;
  memo?: string;
}

interface SchedulePaymentResponse {
  paymentId: string;
  uid: string;
  payeeId: string;
  fromAccountId: string;
  amount: number;
  scheduledDate: string;
  status: string;
  recurring: boolean;
  recurrenceRule?: RecurrenceRule;
  memo?: string;
  createdAt: string;
}

export const schedulePayment = functions.https.onRequest(async (req, res) => {
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
    const body = req.body as SchedulePaymentRequest;
    
    // Validate required fields
    if (!body.payeeId || !body.fromAccountId || body.amount === undefined || body.amount === null || !body.scheduledDate) {
      res.status(400).json({ 
        error: 'Missing required fields: payeeId, fromAccountId, amount, scheduledDate' 
      });
      return;
    }
    
    // Validate amount
    if (typeof body.amount !== 'number' || body.amount <= 0 || !Number.isInteger(body.amount)) {
      res.status(400).json({ 
        error: 'Amount must be a positive integer (in cents)' 
      });
      return;
    }
    
    // Validate amount is not too large ($10 million max)
    if (body.amount > 1000000000) {
      res.status(400).json({ 
        error: 'Amount exceeds maximum allowed ($10,000,000)' 
      });
      return;
    }
    
    // Validate memo length if provided
    if (body.memo && body.memo.length > 200) {
      res.status(400).json({ 
        error: 'Memo must be less than 200 characters' 
      });
      return;
    }
    
    // Parse and validate scheduled date
    const scheduledDate = new Date(body.scheduledDate);
    if (isNaN(scheduledDate.getTime())) {
      res.status(400).json({ 
        error: 'Invalid scheduledDate format. Must be a valid ISO date string' 
      });
      return;
    }
    
    // Validate scheduled date is in the future
    const now = new Date();
    if (scheduledDate <= now) {
      res.status(400).json({ 
        error: 'Scheduled date must be in the future' 
      });
      return;
    }
    
    // Validate recurring payment settings
    const recurring = body.recurring || false;
    if (recurring) {
      if (!body.recurrenceRule) {
        res.status(400).json({ 
          error: 'Recurrence rule is required for recurring payments' 
        });
        return;
      }
      
      // Validate frequency
      const validFrequencies = ['weekly', 'biweekly', 'monthly', 'quarterly'];
      if (!validFrequencies.includes(body.recurrenceRule.frequency)) {
        res.status(400).json({ 
          error: `Invalid frequency. Must be one of: ${validFrequencies.join(', ')}` 
        });
        return;
      }
      
      // Validate monthly recurrence has dayOfMonth
      if (body.recurrenceRule.frequency === 'monthly') {
        if (body.recurrenceRule.dayOfMonth === undefined) {
          res.status(400).json({ 
            error: 'dayOfMonth is required for monthly recurring payments' 
          });
          return;
        }
        
        if (body.recurrenceRule.dayOfMonth < 1 || body.recurrenceRule.dayOfMonth > 31) {
          res.status(400).json({ 
            error: 'dayOfMonth must be between 1 and 31' 
          });
          return;
        }
      }
      
      // Validate weekly recurrence has dayOfWeek
      if (body.recurrenceRule.frequency === 'weekly') {
        if (body.recurrenceRule.dayOfWeek === undefined) {
          res.status(400).json({ 
            error: 'dayOfWeek is required for weekly recurring payments' 
          });
          return;
        }
        
        if (body.recurrenceRule.dayOfWeek < 0 || body.recurrenceRule.dayOfWeek > 6) {
          res.status(400).json({ 
            error: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)' 
          });
          return;
        }
      }
      
      // Validate endDate if provided
      if (body.recurrenceRule.endDate) {
        const endDate = new Date(body.recurrenceRule.endDate);
        if (isNaN(endDate.getTime())) {
          res.status(400).json({ 
            error: 'Invalid endDate format. Must be a valid ISO date string' 
          });
          return;
        }
        
        if (endDate <= scheduledDate) {
          res.status(400).json({ 
            error: 'End date must be after scheduled date' 
          });
          return;
        }
      }
    }
    
    const db = admin.firestore();
    
    // Use a transaction to ensure data consistency
    const result = await db.runTransaction(async (transaction) => {
      // Verify payee exists and belongs to user
      const payeeRef = db.collection('users').doc(uid).collection('payees').doc(body.payeeId);
      const payeeDoc = await transaction.get(payeeRef);
      
      if (!payeeDoc.exists) {
        throw new Error('PAYEE_NOT_FOUND');
      }
      
      // Verify account exists and belongs to user
      const accountRef = db.collection('accounts').doc(body.fromAccountId);
      const accountDoc = await transaction.get(accountRef);
      
      if (!accountDoc.exists) {
        throw new Error('ACCOUNT_NOT_FOUND');
      }
      
      const accountData = accountDoc.data();
      if (accountData?.uid !== uid) {
        throw new Error('ACCOUNT_NOT_OWNED');
      }
      
      // Check account status
      if (accountData?.status !== 'active') {
        throw new Error('ACCOUNT_NOT_ACTIVE');
      }
      
      // Check account balance
      const balance = accountData?.balance || 0;
      if (balance < body.amount) {
        throw new Error('INSUFFICIENT_FUNDS');
      }
      
      // Create bill payment document
      const paymentRef = db.collection('users').doc(uid).collection('billPayments').doc();
      
      const timestamp = admin.firestore.Timestamp.now();
      const scheduledTimestamp = admin.firestore.Timestamp.fromDate(scheduledDate);
      
      const paymentData: any = {
        paymentId: paymentRef.id,
        uid: uid,
        payeeId: body.payeeId,
        fromAccountId: body.fromAccountId,
        amount: body.amount,
        scheduledDate: scheduledTimestamp,
        status: 'scheduled',
        recurring: recurring,
        memo: body.memo || null,
        confirmationNumber: null,
        failureReason: null,
        createdAt: timestamp,
        processedAt: null,
      };
      
      // Add recurrence rule if recurring
      if (recurring && body.recurrenceRule) {
        const recurrenceRule: any = {
          frequency: body.recurrenceRule.frequency,
        };
        
        if (body.recurrenceRule.dayOfMonth !== undefined) {
          recurrenceRule.dayOfMonth = body.recurrenceRule.dayOfMonth;
        }
        
        if (body.recurrenceRule.dayOfWeek !== undefined) {
          recurrenceRule.dayOfWeek = body.recurrenceRule.dayOfWeek;
        }
        
        if (body.recurrenceRule.endDate) {
          recurrenceRule.endDate = admin.firestore.Timestamp.fromDate(
            new Date(body.recurrenceRule.endDate)
          );
        }
        
        paymentData.recurrenceRule = recurrenceRule;
      } else {
        paymentData.recurrenceRule = null;
      }
      
      transaction.set(paymentRef, paymentData);
      
      return paymentData;
    });
    
    // Prepare response
    const response: SchedulePaymentResponse = {
      paymentId: result.paymentId,
      uid: result.uid,
      payeeId: result.payeeId,
      fromAccountId: result.fromAccountId,
      amount: result.amount,
      scheduledDate: result.scheduledDate.toDate().toISOString(),
      status: result.status,
      recurring: result.recurring,
      memo: result.memo || undefined,
      createdAt: result.createdAt.toDate().toISOString(),
    };
    
    // Add recurrence rule to response if present
    if (result.recurrenceRule) {
      const recurrenceRule: RecurrenceRule = {
        frequency: result.recurrenceRule.frequency,
      };
      
      if (result.recurrenceRule.dayOfMonth !== undefined) {
        recurrenceRule.dayOfMonth = result.recurrenceRule.dayOfMonth;
      }
      
      if (result.recurrenceRule.dayOfWeek !== undefined) {
        recurrenceRule.dayOfWeek = result.recurrenceRule.dayOfWeek;
      }
      
      if (result.recurrenceRule.endDate) {
        recurrenceRule.endDate = result.recurrenceRule.endDate.toDate().toISOString();
      }
      
      response.recurrenceRule = recurrenceRule;
    }
    
    res.status(201).json(response);
    
  } catch (error) {
    console.error('Error scheduling payment:', error);
    
    // Handle specific error cases
    if ((error as Error).message === 'PAYEE_NOT_FOUND') {
      res.status(404).json({ error: 'Payee not found' });
      return;
    }
    
    if ((error as Error).message === 'ACCOUNT_NOT_FOUND') {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    
    if ((error as Error).message === 'ACCOUNT_NOT_OWNED') {
      res.status(403).json({ error: 'Account does not belong to user' });
      return;
    }
    
    if ((error as Error).message === 'ACCOUNT_NOT_ACTIVE') {
      res.status(400).json({ error: 'Account is not active' });
      return;
    }
    
    if ((error as Error).message === 'INSUFFICIENT_FUNDS') {
      res.status(400).json({ error: 'Insufficient funds in account' });
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
