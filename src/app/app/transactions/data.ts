import { createMockBankingData, type MockBankTransaction as Transaction } from "@/lib/data/mock-banking";

export type { Transaction };

export const mockTransactions = createMockBankingData("guest").transactions;
