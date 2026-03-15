/**
 * Process Bill Payments Cloud Function
 * 
 * Scheduled Cloud Function that runs daily to process due bill payments.
 * 
 * Responsibilities:
 * - Query payments where scheduledDate <= now and status = 'scheduled'
 * - Check account balances
 * - Create debit transactions
 * - Update payment status to 'completed' or 'failed'
 * - Handle recurring payment creation
 * - Send notifications
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const processBillPayments = functions.pubsub
  .schedule('every day 00:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    
    console.log('Starting bill payment processing at', now.toDate().toISOString());
    
    try {
      // Query all users
      const usersSnapshot = await db.collection('users').get();
      
      let totalProcessed = 0;
      let totalSucceeded = 0;
      let totalFailed = 0;
      
      // Process payments for each user
      for (const userDoc of usersSnapshot.docs) {
        const uid = userDoc.id;
        
        // Query scheduled payments that are due
        const paymentsSnapshot = await db
          .collection('users')
          .doc(uid)
          .collection('billPayments')
          .where('status', '==', 'scheduled')
          .where('scheduledDate', '<=', now)
          .get();
        
        console.log(`Found ${paymentsSnapshot.docs.length} due payments for user ${uid}`);
        
        // Process each payment
        for (const paymentDoc of paymentsSnapshot.docs) {
          totalProcessed++;
          const paymentData = paymentDoc.data();
          
          try {
            await db.runTransaction(async (transaction) => {
              // Get account
              const accountRef = db.collection('accounts').doc(paymentData.fromAccountId);
              const accountDoc = await transaction.get(accountRef);
              
              if (!accountDoc.exists) {
                throw new Error('ACCOUNT_NOT_FOUND');
              }
              
              const accountData = accountDoc.data();
              
              // Check account status
              if (accountData?.status !== 'active') {
                throw new Error('ACCOUNT_NOT_ACTIVE');
              }
              
              // Check balance
              const balance = accountData?.balance || 0;
              if (balance < paymentData.amount) {
                throw new Error('INSUFFICIENT_FUNDS');
              }
              
              // Debit account
              transaction.update(accountRef, {
                balance: balance - paymentData.amount,
                updatedAt: admin.firestore.Timestamp.now(),
              });
              
              // Create transaction record
              const transactionRef = db.collection('transactions').doc();
              transaction.set(transactionRef, {
                transactionId: transactionRef.id,
                uid: uid,
                accountId: paymentData.fromAccountId,
                type: 'debit',
                amount: paymentData.amount,
                category: 'bill_payment',
                description: `Bill payment to ${paymentData.payeeId}`,
                status: 'completed',
                metadata: {
                  paymentId: paymentDoc.id,
                  payeeId: paymentData.payeeId,
                },
                createdAt: admin.firestore.Timestamp.now(),
              });
              
              // Generate confirmation number
              const confirmationNumber = `BP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
              
              // Update payment status
              const paymentRef = db.collection('users').doc(uid).collection('billPayments').doc(paymentDoc.id);
              transaction.update(paymentRef, {
                status: 'completed',
                confirmationNumber: confirmationNumber,
                processedAt: admin.firestore.Timestamp.now(),
              });
              
              // If recurring, create next payment instance
              if (paymentData.recurring && paymentData.recurrenceRule) {
                const nextScheduledDate = calculateNextScheduledDate(
                  paymentData.scheduledDate.toDate(),
                  paymentData.recurrenceRule
                );
                
                // Check if we should create next payment (not past end date)
                if (nextScheduledDate) {
                  const nextPaymentRef = db.collection('users').doc(uid).collection('billPayments').doc();
                  transaction.set(nextPaymentRef, {
                    paymentId: nextPaymentRef.id,
                    uid: uid,
                    payeeId: paymentData.payeeId,
                    fromAccountId: paymentData.fromAccountId,
                    amount: paymentData.amount,
                    scheduledDate: admin.firestore.Timestamp.fromDate(nextScheduledDate),
                    status: 'scheduled',
                    recurring: true,
                    recurrenceRule: paymentData.recurrenceRule,
                    memo: paymentData.memo || null,
                    confirmationNumber: null,
                    failureReason: null,
                    createdAt: admin.firestore.Timestamp.now(),
                    processedAt: null,
                  });
                }
              }
            });
            
            totalSucceeded++;
            console.log(`Successfully processed payment ${paymentDoc.id} for user ${uid}`);
            
            // TODO: Send success notification
            
          } catch (error) {
            totalFailed++;
            console.error(`Failed to process payment ${paymentDoc.id} for user ${uid}:`, error);
            
            // Update payment status to failed
            const failureReason = (error as Error).message || 'Unknown error';
            await db
              .collection('users')
              .doc(uid)
              .collection('billPayments')
              .doc(paymentDoc.id)
              .update({
                status: 'failed',
                failureReason: failureReason,
                processedAt: admin.firestore.Timestamp.now(),
              });
            
            // TODO: Send failure notification
          }
        }
      }
      
      console.log(`Bill payment processing completed. Total: ${totalProcessed}, Succeeded: ${totalSucceeded}, Failed: ${totalFailed}`);
      
    } catch (error) {
      console.error('Error in bill payment processing:', error);
      throw error;
    }
  });

/**
 * Calculate the next scheduled date for a recurring payment
 */
function calculateNextScheduledDate(
  currentDate: Date,
  recurrenceRule: any
): Date | null {
  const nextDate = new Date(currentDate);
  
  switch (recurrenceRule.frequency) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
      
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
      
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      // Handle day of month
      if (recurrenceRule.dayOfMonth) {
        nextDate.setDate(recurrenceRule.dayOfMonth);
      }
      break;
      
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
      
    default:
      return null;
  }
  
  // Check if past end date
  if (recurrenceRule.endDate) {
    const endDate = recurrenceRule.endDate.toDate();
    if (nextDate > endDate) {
      return null;
    }
  }
  
  return nextDate;
}
