/**
 * Constants for Digital Banking Platform
 * 
 * This file contains constant values used throughout the application.
 */

/**
 * Account Constants
 */
export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
} as const;

export const ACCOUNT_STATUSES = {
  ACTIVE: 'active',
  FROZEN: 'frozen',
} as const;

export const DEFAULT_CURRENCY = 'USD';

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'] as const;

/**
 * Transaction Constants
 */
export const TRANSACTION_TYPES = {
  DEBIT: 'debit',
  CREDIT: 'credit',
} as const;

/**
 * Transfer Constants
 */
export const TRANSFER_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const MAX_TRANSFER_AMOUNT = 1000000000; // $10 million in cents
export const MIN_TRANSFER_AMOUNT = 1; // 1 cent

/**
 * OTP Constants
 */
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 5;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RATE_LIMIT_PER_HOUR = 5;

export const OTP_PURPOSES = {
  LOGIN: 'login',
  TRANSFER: 'transfer',
  SETTINGS: 'settings',
} as const;

/**
 * User Constants
 */
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

/**
 * Card Constants
 */
export const CARD_TYPES = {
  VIRTUAL: 'virtual',
} as const;

export const CARD_STATUSES = {
  ACTIVE: 'active',
  FROZEN: 'frozen',
} as const;

/**
 * Audit Log Action Types
 */
export const AUDIT_ACTIONS = {
  // Authentication
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  PASSWORD_RESET: 'password_reset',
  PASSWORD_CHANGE: 'password_change',
  EMAIL_VERIFIED: 'email_verified',
  
  // OTP
  OTP_GENERATED: 'otp_generated',
  OTP_VERIFIED_SUCCESS: 'otp_verified_success',
  OTP_VERIFIED_FAILURE: 'otp_verified_failure',
  
  // Transfers
  TRANSFER_INITIATED: 'transfer_initiated',
  TRANSFER_COMPLETED: 'transfer_completed',
  TRANSFER_FAILED: 'transfer_failed',
  
  // Cards
  CARD_FROZEN: 'card_frozen',
  CARD_UNFROZEN: 'card_unfrozen',
  CARD_CREATED: 'card_created',
  
  // Security
  MFA_ENABLED: 'mfa_enabled',
  MFA_DISABLED: 'mfa_disabled',
  TOTP_ENABLED: 'totp_enabled',
  TOTP_DISABLED: 'totp_disabled',
  
  // Account
  ACCOUNT_CREATED: 'account_created',
  ACCOUNT_FROZEN: 'account_frozen',
  ACCOUNT_UNFROZEN: 'account_unfrozen',
  
  // Profile
  PROFILE_UPDATED: 'profile_updated',
} as const;

/**
 * Pagination Constants
 */
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

/**
 * Validation Constants
 */
export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 200;
export const MESSAGE_MAX_LENGTH = 1000;

/**
 * Time Constants (in milliseconds)
 */
export const ONE_MINUTE = 60 * 1000;
export const FIVE_MINUTES = 5 * 60 * 1000;
export const ONE_HOUR = 60 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Error Codes
 */
export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'auth/invalid-credentials',
  EMAIL_NOT_VERIFIED: 'auth/email-not-verified',
  USER_NOT_FOUND: 'auth/user-not-found',
  WEAK_PASSWORD: 'auth/weak-password',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  
  // OTP
  OTP_EXPIRED: 'otp/expired',
  OTP_INVALID: 'otp/invalid',
  OTP_MAX_ATTEMPTS: 'otp/max-attempts',
  OTP_RATE_LIMIT: 'otp/rate-limit',
  
  // Transfer
  INSUFFICIENT_BALANCE: 'transfer/insufficient-balance',
  INVALID_ACCOUNT: 'transfer/invalid-account',
  SAME_ACCOUNT: 'transfer/same-account',
  INVALID_AMOUNT: 'transfer/invalid-amount',
  DUPLICATE_TRANSFER: 'transfer/duplicate',
  
  // Authorization
  UNAUTHORIZED: 'auth/unauthorized',
  FORBIDDEN: 'auth/forbidden',
  
  // General
  NOT_FOUND: 'error/not-found',
  INTERNAL_ERROR: 'error/internal',
  VALIDATION_ERROR: 'error/validation',
  RATE_LIMIT_EXCEEDED: 'error/rate-limit',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  TRANSFER_COMPLETED: 'Transfer completed successfully',
  OTP_SENT: 'OTP sent to your email',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
  PASSWORD_CHANGED: 'Password changed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  CARD_FROZEN: 'Card frozen successfully',
  CARD_UNFROZEN: 'Card unfrozen successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
} as const;

/**
 * Route Constants
 */
export const ROUTES = {
  // Public
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_OTP: '/verify-otp',
  
  // Marketing
  PERSONAL: '/personal',
  BUSINESS: '/business',
  LOANS: '/loans',
  CARDS: '/cards',
  SECURITY: '/security',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/legal/privacy',
  TERMS: '/legal/terms',
  ACCESSIBILITY: '/legal/accessibility',
  
  // App
  DASHBOARD: '/app/dashboard',
  ACCOUNTS: '/app/accounts',
  TRANSFERS: '/app/transfers',
  CARDS_APP: '/app/cards',
  SETTINGS: '/app/settings',
  SETTINGS_PROFILE: '/app/settings/profile',
  SETTINGS_SECURITY: '/app/settings/security',
  SETTINGS_PREFERENCES: '/app/settings/preferences',
  
  // Admin
  ADMIN: '/app/admin',
  ADMIN_USERS: '/app/admin/users',
  ADMIN_AUDIT_LOGS: '/app/admin/audit-logs',
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  LAST_ACCOUNT: 'lastAccount',
} as const;

/**
 * Theme Constants
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;
