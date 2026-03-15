/**
 * Unit Tests for Encryption Utility
 * 
 * Tests encryption, decryption, masking, and validation functions.
 */

import { encrypt, decrypt, maskSensitiveData, validateEncryptedData } from './encryption';

describe('Encryption Utility', () => {
  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt a string correctly', () => {
      const plaintext = '1234567890';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });
    
    it('should produce different encrypted values for the same input', () => {
      const plaintext = '1234567890';
      const encrypted1 = encrypt(plaintext);
      const encrypted2 = encrypt(plaintext);
      
      // Different IVs should produce different encrypted values
      expect(encrypted1).not.toBe(encrypted2);
      
      // But both should decrypt to the same value
      expect(decrypt(encrypted1)).toBe(plaintext);
      expect(decrypt(encrypted2)).toBe(plaintext);
    });
    
    it('should handle empty strings', () => {
      const plaintext = '';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });
    
    it('should handle special characters', () => {
      const plaintext = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });
    
    it('should handle unicode characters', () => {
      const plaintext = '你好世界 🌍 مرحبا';
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });
    
    it('should handle long strings', () => {
      const plaintext = 'a'.repeat(10000);
      const encrypted = encrypt(plaintext);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(plaintext);
    });
    
    it('should throw error when decrypting invalid data', () => {
      expect(() => decrypt('invalid-data')).toThrow('Failed to decrypt data');
    });
    
    it('should throw error when decrypting tampered data', () => {
      const plaintext = '1234567890';
      const encrypted = encrypt(plaintext);
      
      // Tamper with the encrypted data
      const parts = encrypted.split(':');
      parts[2] = parts[2].slice(0, -2) + 'ff';
      const tampered = parts.join(':');
      
      expect(() => decrypt(tampered)).toThrow('Failed to decrypt data');
    });
  });
  
  describe('maskSensitiveData', () => {
    it('should mask account numbers correctly', () => {
      const accountNumber = '1234567890';
      const masked = maskSensitiveData(accountNumber);
      
      expect(masked).toBe('******7890');
    });
    
    it('should handle short strings', () => {
      const shortString = '123';
      const masked = maskSensitiveData(shortString);
      
      expect(masked).toBe('****');
    });
    
    it('should handle exactly 4 characters', () => {
      const fourChars = '1234';
      const masked = maskSensitiveData(fourChars);
      
      expect(masked).toBe('****');
    });
    
    it('should handle 5 characters', () => {
      const fiveChars = '12345';
      const masked = maskSensitiveData(fiveChars);
      
      expect(masked).toBe('*2345');
    });
  });
  
  describe('validateEncryptedData', () => {
    it('should validate correctly encrypted data', () => {
      const plaintext = '1234567890';
      const encrypted = encrypt(plaintext);
      
      expect(validateEncryptedData(encrypted)).toBe(true);
    });
    
    it('should reject invalid format', () => {
      expect(validateEncryptedData('invalid')).toBe(false);
      expect(validateEncryptedData('only:two:parts')).toBe(false);
      expect(validateEncryptedData('')).toBe(false);
    });
    
    it('should reject tampered data', () => {
      const plaintext = '1234567890';
      const encrypted = encrypt(plaintext);
      
      // Tamper with the data
      const parts = encrypted.split(':');
      parts[2] = parts[2].slice(0, -2) + 'ff';
      const tampered = parts.join(':');
      
      expect(validateEncryptedData(tampered)).toBe(false);
    });
  });
  
  describe('round-trip property', () => {
    it('should maintain data integrity through encryption and decryption', () => {
      const testCases = [
        '1234567890',
        '0000000000',
        '9999999999',
        'abc123def456',
        '!@#$%^&*()',
        '',
        'a',
        'a'.repeat(1000),
      ];
      
      testCases.forEach(plaintext => {
        const encrypted = encrypt(plaintext);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(plaintext);
      });
    });
  });
});
