/**
 * Tests for Cancel Payment Cloud Function
 * 
 * Tests cover:
 * - Authentication validation
 * - Input validation (required fields)
 * - Payment existence validation
 * - Payment ownership validation
 * - Payment status validation (only scheduled can be cancelled)
 * - Successful cancellation
 */

import * as admin from 'firebase-admin';
import { cancelPayment } from './cancelPayment';

// Mock Firebase Admin
jest.mock('firebase-admin', () => {
  const actualAdmin = jest.requireActual('firebase-admin');
  return {
    ...actualAdmin,
    auth: jest.fn(() => ({
      verifyIdToken: jest.fn(),
    })),
    firestore: jest.fn(() => ({
      collection: jest.fn(),
      runTransaction: jest.fn(),
    })),
  };
});

describe('cancelPayment Cloud Function', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockAuth: any;
  let mockFirestore: any;
  let mockTransaction: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock request
    mockRequest = {
      method: 'POST',
      headers: {
        authorization: 'Bearer valid-token',
      },
      body: {},
    };

    // Mock response
    mockResponse = {
      set: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    // Mock auth
    mockAuth = {
      verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-123' }),
    };
    (admin.auth as jest.Mock).mockReturnValue(mockAuth);

    // Mock transaction
    mockTransaction = {
      get: jest.fn(),
      update: jest.fn(),
    };

    // Create a proper mock for Firestore with nested collection/doc support
    const createMockDocRef = (path: string = '') => {
      const docRef: any = {
        toString: jest.fn().mockReturnValue(path),
        id: 'mock-doc-id',
        path: path,
      };
      // Add collection method to support nested collections
      docRef.collection = jest.fn((collectionName: string) => 
        createMockCollectionRef(`${path}/${collectionName}`)
      );
      return docRef;
    };

    const createMockCollectionRef = (path: string = '') => {
      const collectionRef: any = {
        toString: jest.fn().mockReturnValue(path),
        path: path,
      };
      collectionRef.doc = jest.fn((id?: string) => 
        createMockDocRef(`${path}/${id || 'mock-doc-id'}`)
      );
      return collectionRef;
    };

    mockFirestore = {
      collection: jest.fn((collectionName: string) => createMockCollectionRef(collectionName)),
      doc: jest.fn((id: string) => createMockDocRef(id)),
      runTransaction: jest.fn((callback) => callback(mockTransaction)),
    };
    
    (admin.firestore as any).mockReturnValue(mockFirestore);
    (admin.firestore as any).Timestamp = {
      now: jest.fn(() => ({ toDate: () => new Date('2024-01-15T10:00:00Z') })),
    };
  });

  describe('HTTP Method and CORS', () => {
    it('should handle OPTIONS request for CORS preflight', async () => {
      mockRequest.method = 'OPTIONS';

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.set).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
      expect(mockResponse.set).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'POST, OPTIONS');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalledWith('');
    });

    it('should reject non-POST requests', async () => {
      mockRequest.method = 'GET';

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(405);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
    });
  });

  describe('Authentication', () => {
    it('should reject requests without authorization header', async () => {
      mockRequest.headers = {};

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Unauthorized: Missing or invalid token',
      });
    });

    it('should reject requests with invalid token format', async () => {
      mockRequest.headers.authorization = 'InvalidFormat token';

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Unauthorized: Missing or invalid token',
      });
    });

    it('should reject expired tokens', async () => {
      mockAuth.verifyIdToken.mockRejectedValue({ code: 'auth/id-token-expired' });

      mockRequest.body = {
        paymentId: 'payment-123',
      };

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token expired' });
    });
  });

  describe('Input Validation', () => {
    it('should reject requests missing paymentId', async () => {
      mockRequest.body = {};

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Missing required field: paymentId',
      });
    });
  });

  describe('Payment Validation', () => {
    it('should reject cancellation for non-existent payment', async () => {
      mockTransaction.get.mockResolvedValue({
        exists: false,
        data: () => null,
      });

      mockRequest.body = {
        paymentId: 'non-existent-payment',
      };

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Payment not found' });
    });

    it('should reject cancellation for payment not owned by user', async () => {
      mockTransaction.get.mockResolvedValue({
        exists: true,
        data: () => ({
          uid: 'different-user',
          status: 'scheduled',
        }),
      });

      mockRequest.body = {
        paymentId: 'payment-123',
      };

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Payment does not belong to user',
      });
    });

    it('should reject cancellation for completed payment', async () => {
      mockTransaction.get.mockResolvedValue({
        exists: true,
        data: () => ({
          uid: 'test-user-123',
          status: 'completed',
        }),
      });

      mockRequest.body = {
        paymentId: 'payment-123',
      };

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Payment cannot be cancelled. Only scheduled payments can be cancelled.',
      });
    });

    it('should reject cancellation for processing payment', async () => {
      mockTransaction.get.mockResolvedValue({
        exists: true,
        data: () => ({
          uid: 'test-user-123',
          status: 'processing',
        }),
      });

      mockRequest.body = {
        paymentId: 'payment-123',
      };

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Payment cannot be cancelled. Only scheduled payments can be cancelled.',
      });
    });

    it('should reject cancellation for failed payment', async () => {
      mockTransaction.get.mockResolvedValue({
        exists: true,
        data: () => ({
          uid: 'test-user-123',
          status: 'failed',
        }),
      });

      mockRequest.body = {
        paymentId: 'payment-123',
      };

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Payment cannot be cancelled. Only scheduled payments can be cancelled.',
      });
    });

    it('should reject cancellation for already cancelled payment', async () => {
      mockTransaction.get.mockResolvedValue({
        exists: true,
        data: () => ({
          uid: 'test-user-123',
          status: 'cancelled',
        }),
      });

      mockRequest.body = {
        paymentId: 'payment-123',
      };

      await cancelPayment(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Payment cannot be cancelled. Only scheduled payments can be cancelled.',
      });
    });
  });

  describe('Successful Cancellation', () => {
    it('should successfully cancel a scheduled payment', async () => {
      mockTransaction.get.mockResolvedValue({
        exists: true,
        data: () => ({
          uid: 'test-user-123',
          paymentId: 'payment-123',
          status: 'scheduled',
          amount: 10000,
          payeeId: 'payee-456',
        }),
      });

      mockRequest.body = {
        paymentId: 'payment-123',
      };

      await cancelPayment(mockRequest, mockResponse);

      expect(mockTransaction.update).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          paymentId: 'payment-123',
          status: 'cancelled',
          cancelledAt: expect.any(String),
        })
      );
    });

    it('should successfully cancel a scheduled recurring payment', async () => {
      mockTransaction.get.mockResolvedValue({
        exists: true,
        data: () => ({
          uid: 'test-user-123',
          paymentId: 'payment-456',
          status: 'scheduled',
          amount: 5000,
          payeeId: 'payee-789',
          recurring: true,
          recurrenceRule: {
            frequency: 'monthly',
            dayOfMonth: 15,
          },
        }),
      });

      mockRequest.body = {
        paymentId: 'payment-456',
      };

      await cancelPayment(mockRequest, mockResponse);

      expect(mockTransaction.update).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          paymentId: 'payment-456',
          status: 'cancelled',
          cancelledAt: expect.any(String),
        })
      );
    });
  });
});
