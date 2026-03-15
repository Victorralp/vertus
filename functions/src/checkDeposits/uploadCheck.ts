/**
 * Upload Check Cloud Function
 * 
 * POST /api/checkDeposits/upload
 * 
 * Handles check image upload with quality validation.
 * Uploads images to Cloud Storage and initiates OCR processing.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as Busboy from 'busboy';
import { ImageQualityCheck } from './types';

export const uploadCheck = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
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
    
    // Parse multipart form data
    const busboy = Busboy({ headers: req.headers });
    const uploads: { [key: string]: Buffer } = {};
    const fields: { [key: string]: string } = {};
    
    busboy.on('file', (fieldname, file, info) => {
      const chunks: Buffer[] = [];
      file.on('data', (chunk) => chunks.push(chunk));
      file.on('end', () => {
        uploads[fieldname] = Buffer.concat(chunks);
      });
    });
    
    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });
    
    await new Promise((resolve, reject) => {
      busboy.on('finish', resolve);
      busboy.on('error', reject);
      req.pipe(busboy);
    });
    
    // Validate required fields
    if (!fields.accountId) {
      res.status(400).json({ error: 'Missing required field: accountId' });
      return;
    }
    
    if (!uploads.frontImage || !uploads.backImage) {
      res.status(400).json({ error: 'Both front and back check images are required' });
      return;
    }
    
    // Validate file sizes (max 10MB each)
    const maxSize = 10 * 1024 * 1024;
    if (uploads.frontImage.length > maxSize || uploads.backImage.length > maxSize) {
      res.status(400).json({ error: 'Image file size must be less than 10MB' });
      return;
    }
    
    // Validate image quality
    const frontQuality = await validateImageQuality(uploads.frontImage);
    const backQuality = await validateImageQuality(uploads.backImage);
    
    if (!frontQuality.isValid) {
      res.status(400).json({ 
        error: 'Front image quality is insufficient', 
        issues: frontQuality.issues 
      });
      return;
    }
    
    if (!backQuality.isValid) {
      res.status(400).json({ 
        error: 'Back image quality is insufficient', 
        issues: backQuality.issues 
      });
      return;
    }
    
    const db = admin.firestore();
    
    // Verify account exists and belongs to user
    const accountRef = db.collection('accounts').doc(fields.accountId);
    const accountDoc = await accountRef.get();
    
    if (!accountDoc.exists) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    
    const accountData = accountDoc.data();
    if (accountData?.uid !== uid) {
      res.status(403).json({ error: 'Account does not belong to user' });
      return;
    }
    
    // Upload images to Cloud Storage
    const bucket = admin.storage().bucket();
    const depositId = db.collection('users').doc(uid).collection('checkDeposits').doc().id;
    
    const frontImagePath = `checkDeposits/${uid}/${depositId}/front.jpg`;
    const backImagePath = `checkDeposits/${uid}/${depositId}/back.jpg`;
    
    await bucket.file(frontImagePath).save(uploads.frontImage, {
      metadata: { contentType: 'image/jpeg' },
    });
    
    await bucket.file(backImagePath).save(uploads.backImage, {
      metadata: { contentType: 'image/jpeg' },
    });
    
    // Generate signed URLs (valid for 7 days)
    const [frontUrl] = await bucket.file(frontImagePath).getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    
    const [backUrl] = await bucket.file(backImagePath).getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    
    // Perform OCR (placeholder - will be implemented in next task)
    const ocrData = {
      confidence: 0.0,
      // OCR extraction will be added in task 2.3
    };
    
    // Create check deposit record
    const timestamp = admin.firestore.Timestamp.now();
    const holdUntil = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 business days
    );
    
    const depositData = {
      depositId,
      uid,
      accountId: fields.accountId,
      amount: 0, // Will be set after OCR or user confirmation
      checkNumber: '', // Will be set after OCR or user confirmation
      checkDate: timestamp, // Will be updated after OCR or user confirmation
      status: 'pending_review',
      frontImageUrl: frontUrl,
      backImageUrl: backUrl,
      ocrData,
      holdUntil,
      createdAt: timestamp,
    };
    
    await db
      .collection('users')
      .doc(uid)
      .collection('checkDeposits')
      .doc(depositId)
      .set(depositData);
    
    res.status(201).json({
      depositId,
      status: 'pending_review',
      frontImageUrl: frontUrl,
      backImageUrl: backUrl,
      ocrData,
      createdAt: timestamp.toDate().toISOString(),
    });
    
  } catch (error) {
    console.error('Error uploading check:', error);
    
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

/**
 * Validate image quality
 * Based on criteria from Arya.ai and Unit.co
 */
async function validateImageQuality(imageBuffer: Buffer): Promise<ImageQualityCheck> {
  const issues: string[] = [];
  
  // Basic validation - in production, use image processing library like sharp
  // For now, just check file size and basic properties
  
  const metrics = {
    resolution: { width: 0, height: 0 },
    aspectRatio: 0,
  };
  
  // Minimum file size check (very basic)
  if (imageBuffer.length < 10000) {
    issues.push('Image file size too small');
  }
  
  // In production, you would:
  // 1. Use sharp or similar library to get actual dimensions
  // 2. Check resolution >= 1200x600
  // 3. Calculate brightness (80-200 range)
  // 4. Calculate sharpness (Laplacian variance > 100)
  // 5. Detect corners using computer vision
  
  // For now, assume valid if file size is reasonable
  const isValid = issues.length === 0 && imageBuffer.length >= 10000 && imageBuffer.length <= 10 * 1024 * 1024;
  
  return {
    isValid,
    issues,
    metrics,
  };
}
