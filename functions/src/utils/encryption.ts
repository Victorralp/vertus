/**
 * Encryption Utility for Sensitive Data
 * 
 * This module provides encryption and decryption functions for sensitive data
 * such as account numbers, routing numbers, and other PII.
 * 
 * Uses AES-256-GCM for encryption with a secret key from environment variables.
 */

import * as crypto from 'crypto';

// Algorithm configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES, this is always 16 bytes

/**
 * Get encryption key from environment or generate a default one for development
 * In production, this MUST be set via Firebase Functions config
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    // In development, use a default key (NOT FOR PRODUCTION)
    console.warn('WARNING: Using default encryption key. Set ENCRYPTION_KEY in production!');
    return crypto.scryptSync('default-dev-key-change-in-production', 'salt', 32);
  }
  
  // Derive a 32-byte key from the provided key using scrypt
  return crypto.scryptSync(key, 'nexusbank-salt', 32);
}

/**
 * Encrypts a string value using AES-256-GCM
 * 
 * @param plaintext - The string to encrypt
 * @returns Encrypted string in format: iv:authTag:encryptedData (all hex encoded)
 */
export function encrypt(plaintext: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts a string value that was encrypted with the encrypt function
 * 
 * @param encryptedData - The encrypted string in format: iv:authTag:encryptedData
 * @returns Decrypted plaintext string
 */
export function decrypt(encryptedData: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedData.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Masks a sensitive string for display purposes
 * Shows only the last 4 characters
 * 
 * @param value - The string to mask
 * @returns Masked string (e.g., "****1234")
 */
export function maskSensitiveData(value: string): string {
  if (value.length <= 4) {
    return '****';
  }
  
  const last4 = value.slice(-4);
  const masked = '*'.repeat(value.length - 4);
  return masked + last4;
}

/**
 * Validates that encrypted data can be decrypted
 * Useful for testing encryption/decryption round-trip
 * 
 * @param encryptedData - The encrypted string to validate
 * @returns true if valid, false otherwise
 */
export function validateEncryptedData(encryptedData: string): boolean {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      return false;
    }
    
    // Try to decrypt - if it works, it's valid
    decrypt(encryptedData);
    return true;
  } catch {
    return false;
  }
}
