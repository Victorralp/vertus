/**
 * Type Guards and Type Converters
 * 
 * This file contains type guard functions and converters for runtime type checking
 * and converting between Firestore types and client types.
 */

import { Timestamp } from 'firebase/firestore';
import type {
  User,
  Account,
  Transaction,
  Transfer,
  OTP,
  AuditLog,
  Card,
  UserClient,
  AccountClient,
  TransactionClient,
  TransferClient,
  OTPClient,
  AuditLogClient,
  CardClient,
  AccountType,
  AccountStatus,
  TransactionType,
  TransferStatus,
  CardStatus,
  UserRole,
  OTPPurpose,
} from './index';

/**
 * Type Guards
 */

export function isAccountType(value: string): value is AccountType {
  return value === 'checking' || value === 'savings';
}

export function isAccountStatus(value: string): value is AccountStatus {
  return value === 'active' || value === 'frozen';
}

export function isTransactionType(value: string): value is TransactionType {
  return value === 'debit' || value === 'credit';
}

export function isTransferStatus(value: string): value is TransferStatus {
  return value === 'pending' || value === 'completed' || value === 'failed';
}

export function isCardStatus(value: string): value is CardStatus {
  return value === 'active' || value === 'frozen';
}

export function isUserRole(value: string): value is UserRole {
  return value === 'user' || value === 'admin';
}

export function isOTPPurpose(value: string): value is OTPPurpose {
  return value === 'login' || value === 'transfer' || value === 'settings';
}

export function isTimestamp(value: any): value is Timestamp {
  return value instanceof Timestamp || (value && typeof value.toDate === 'function');
}

/**
 * Converters: Firestore to Client
 */

export function convertUserToClient(user: User): UserClient {
  return {
    ...user,
    createdAt: user.createdAt.toDate(),
    lastLoginAt: user.lastLoginAt.toDate(),
  };
}

export function convertAccountToClient(account: Account): AccountClient {
  return {
    ...account,
    createdAt: account.createdAt.toDate(),
    updatedAt: account.updatedAt.toDate(),
  };
}

export function convertTransactionToClient(transaction: Transaction): TransactionClient {
  return {
    ...transaction,
    createdAt: transaction.createdAt.toDate(),
  };
}

export function convertTransferToClient(transfer: Transfer): TransferClient {
  return {
    ...transfer,
    createdAt: transfer.createdAt.toDate(),
    completedAt: transfer.completedAt?.toDate(),
  };
}

export function convertOTPToClient(otp: OTP): OTPClient {
  return {
    ...otp,
    createdAt: otp.createdAt.toDate(),
    expiresAt: otp.expiresAt.toDate(),
  };
}

export function convertAuditLogToClient(auditLog: AuditLog): AuditLogClient {
  return {
    ...auditLog,
    createdAt: auditLog.createdAt.toDate(),
  };
}

export function convertCardToClient(card: Card): CardClient {
  return {
    ...card,
    createdAt: card.createdAt.toDate(),
  };
}

/**
 * Converters: Client to Firestore
 */

export function convertUserToFirestore(user: UserClient): User {
  return {
    ...user,
    createdAt: Timestamp.fromDate(user.createdAt),
    lastLoginAt: Timestamp.fromDate(user.lastLoginAt),
  };
}

export function convertAccountToFirestore(account: AccountClient): Account {
  return {
    ...account,
    createdAt: Timestamp.fromDate(account.createdAt),
    updatedAt: Timestamp.fromDate(account.updatedAt),
  };
}

export function convertTransactionToFirestore(transaction: TransactionClient): Transaction {
  return {
    ...transaction,
    createdAt: Timestamp.fromDate(transaction.createdAt),
  };
}

export function convertTransferToFirestore(transfer: TransferClient): Transfer {
  return {
    ...transfer,
    createdAt: Timestamp.fromDate(transfer.createdAt),
    completedAt: transfer.completedAt ? Timestamp.fromDate(transfer.completedAt) : undefined,
  };
}

export function convertOTPToFirestore(otp: OTPClient): OTP {
  return {
    ...otp,
    createdAt: Timestamp.fromDate(otp.createdAt),
    expiresAt: Timestamp.fromDate(otp.expiresAt),
  };
}

export function convertAuditLogToFirestore(auditLog: AuditLogClient): AuditLog {
  return {
    ...auditLog,
    createdAt: Timestamp.fromDate(auditLog.createdAt),
  };
}

export function convertCardToFirestore(card: CardClient): Card {
  return {
    ...card,
    createdAt: Timestamp.fromDate(card.createdAt),
  };
}

/**
 * Batch Converters
 */

export function convertUsersToClient(users: User[]): UserClient[] {
  return users.map(convertUserToClient);
}

export function convertAccountsToClient(accounts: Account[]): AccountClient[] {
  return accounts.map(convertAccountToClient);
}

export function convertTransactionsToClient(transactions: Transaction[]): TransactionClient[] {
  return transactions.map(convertTransactionToClient);
}

export function convertTransfersToClient(transfers: Transfer[]): TransferClient[] {
  return transfers.map(convertTransferToClient);
}

export function convertAuditLogsToClient(auditLogs: AuditLog[]): AuditLogClient[] {
  return auditLogs.map(convertAuditLogToClient);
}

export function convertCardsToClient(cards: Card[]): CardClient[] {
  return cards.map(convertCardToClient);
}

/**
 * Validation Helpers
 */

export function isValidAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount > 0 && amount <= 1000000000;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidOTPCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

export function isValidAccountNumber(accountNumber: string): boolean {
  return /^\d{10,12}$/.test(accountNumber);
}

export function isValidCurrency(currency: string): boolean {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  return validCurrencies.includes(currency.toUpperCase());
}

/**
 * Null/Undefined Checks
 */

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isNotEmpty<T>(value: T[] | null | undefined): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

export function hasProperty<T extends object, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}

/**
 * Error Type Guards
 */

export function isFirebaseError(error: any): error is { code: string; message: string } {
  return error && typeof error.code === 'string' && typeof error.message === 'string';
}

export function isValidationError(error: any): error is { errors: Record<string, string[]> } {
  return error && typeof error.errors === 'object';
}
