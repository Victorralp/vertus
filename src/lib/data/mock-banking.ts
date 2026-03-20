export type MockAccountType = "checking" | "savings" | "business";
export type MockTransactionType = "credit" | "debit";
export type MockTransactionStatus = "processed" | "pending" | "failed";

export interface MockBankAccount {
    id: string;
    name: string;
    type: MockAccountType;
    balance: number;
    number: string;
    fullNumber: string;
    routingNumber: string;
    currency: string;
    availableBalance?: number;
    pendingBalance?: number;
    interestRate?: string;
    interestEarned?: number;
}

export interface MockBankTransaction {
    id: string;
    accountId: string;
    amount: number;
    currency: string;
    type: MockTransactionType;
    status: MockTransactionStatus;
    reference: string;
    description: string;
    category: string;
    date: Date;
}

export interface MockRecentTransfer {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    date: Date;
}

const baseAccounts = [
    {
        id: "acc1",
        name: "Primary Checking",
        type: "checking" as const,
        balance: 12458.32,
        routingNumber: "021000021",
        currency: "USD",
        availableBalance: 12358.32,
        pendingBalance: 100.0,
    },
    {
        id: "acc2",
        name: "High-Yield Savings",
        type: "savings" as const,
        balance: 45230.0,
        routingNumber: "021000021",
        currency: "USD",
        interestRate: "4.50%",
        interestEarned: 156.78,
    },
    {
        id: "acc3",
        name: "Business Account",
        type: "business" as const,
        balance: 89750.45,
        routingNumber: "021000021",
        currency: "USD",
        availableBalance: 89750.45,
        pendingBalance: 0,
    },
];

const baseTransactions = [
    {
        id: "tx-2026-001",
        accountId: "acc1",
        amount: 5120.0,
        currency: "USD",
        type: "credit" as const,
        status: "processed" as const,
        reference: "VCU-SAL-20260312",
        description: "Salary payment from Vertex Holdings",
        category: "Income",
        date: new Date("2026-03-12T04:51:00"),
    },
    {
        id: "tx-2026-002",
        accountId: "acc1",
        amount: 245.78,
        currency: "USD",
        type: "debit" as const,
        status: "processed" as const,
        reference: "VCU-GRC-20260311",
        description: "Groceries and household supplies",
        category: "Shopping",
        date: new Date("2026-03-11T14:20:00"),
    },
    {
        id: "tx-2026-003",
        accountId: "acc1",
        amount: 1200.0,
        currency: "USD",
        type: "debit" as const,
        status: "pending" as const,
        reference: "VCU-RNT-20260310",
        description: "Monthly rent transfer",
        category: "Housing",
        date: new Date("2026-03-10T09:58:00"),
    },
    {
        id: "tx-2026-004",
        accountId: "acc3",
        amount: 8200.0,
        currency: "USD",
        type: "credit" as const,
        status: "processed" as const,
        reference: "VCU-INV-20260308",
        description: "Investment payout",
        category: "Investments",
        date: new Date("2026-03-08T07:48:00"),
    },
    {
        id: "tx-2026-005",
        accountId: "acc1",
        amount: 84.99,
        currency: "USD",
        type: "debit" as const,
        status: "failed" as const,
        reference: "VCU-STR-20260306",
        description: "Streaming subscription renewal",
        category: "Entertainment",
        date: new Date("2026-03-06T18:16:00"),
    },
    {
        id: "tx-2026-006",
        accountId: "acc3",
        amount: 3100.0,
        currency: "USD",
        type: "credit" as const,
        status: "processed" as const,
        reference: "VCU-CLI-20260304",
        description: "Client invoice settlement",
        category: "Business",
        date: new Date("2026-03-04T11:42:00"),
    },
    {
        id: "tx-2025-001",
        accountId: "acc1",
        amount: 6800.0,
        currency: "USD",
        type: "credit" as const,
        status: "processed" as const,
        reference: "VCU-BON-20251115",
        description: "Annual performance bonus",
        category: "Income",
        date: new Date("2025-11-15T10:32:00"),
    },
    {
        id: "tx-2025-002",
        accountId: "acc1",
        amount: 1675.45,
        currency: "USD",
        type: "debit" as const,
        status: "processed" as const,
        reference: "VCU-TRV-20250603",
        description: "Summer travel booking",
        category: "Travel",
        date: new Date("2025-06-03T16:10:00"),
    },
    {
        id: "tx-2025-003",
        accountId: "acc2",
        amount: 198.22,
        currency: "USD",
        type: "credit" as const,
        status: "processed" as const,
        reference: "VCU-INT-20250127",
        description: "Savings interest payment",
        category: "Interest",
        date: new Date("2025-01-27T08:15:00"),
    },
    {
        id: "tx-2025-004",
        accountId: "acc3",
        amount: 4890.0,
        currency: "USD",
        type: "debit" as const,
        status: "processed" as const,
        reference: "VCU-EQP-20251019",
        description: "Equipment purchase for studio refresh",
        category: "Operations",
        date: new Date("2025-10-19T13:24:00"),
    },
    {
        id: "tx-2024-001",
        accountId: "acc1",
        amount: 2420.55,
        currency: "USD",
        type: "credit" as const,
        status: "processed" as const,
        reference: "VCU-TAX-20240705",
        description: "Federal tax refund",
        category: "Refund",
        date: new Date("2024-07-05T12:05:00"),
    },
    {
        id: "tx-2024-002",
        accountId: "acc1",
        amount: 950.0,
        currency: "USD",
        type: "debit" as const,
        status: "processed" as const,
        reference: "VCU-TRF-20240212",
        description: "Transfer to high-yield savings",
        category: "Transfer",
        date: new Date("2024-02-12T09:14:00"),
    },
    {
        id: "tx-2024-003",
        accountId: "acc2",
        amount: 950.0,
        currency: "USD",
        type: "credit" as const,
        status: "processed" as const,
        reference: "VCU-TRF-20240212A",
        description: "Transfer from primary checking",
        category: "Transfer",
        date: new Date("2024-02-12T09:18:00"),
    },
    {
        id: "tx-2024-004",
        accountId: "acc3",
        amount: 14250.0,
        currency: "USD",
        type: "credit" as const,
        status: "processed" as const,
        reference: "VCU-CON-20240821",
        description: "Quarterly consulting retainer",
        category: "Business",
        date: new Date("2024-08-21T10:45:00"),
    },
    {
        id: "tx-2023-001",
        accountId: "acc2",
        amount: 5100.0,
        currency: "USD",
        type: "credit" as const,
        status: "processed" as const,
        reference: "VCU-YEC-20231228",
        description: "Year-end savings contribution",
        category: "Savings",
        date: new Date("2023-12-28T15:20:00"),
    },
    {
        id: "tx-2023-002",
        accountId: "acc1",
        amount: 128.65,
        currency: "USD",
        type: "debit" as const,
        status: "processed" as const,
        reference: "VCU-UTL-20230816",
        description: "Utility bill payment",
        category: "Utilities",
        date: new Date("2023-08-16T08:05:00"),
    },
    {
        id: "tx-2023-003",
        accountId: "acc3",
        amount: 7650.0,
        currency: "USD",
        type: "credit" as const,
        status: "processed" as const,
        reference: "VCU-REV-20230509",
        description: "Project revenue distribution",
        category: "Business",
        date: new Date("2023-05-09T14:33:00"),
    },
    {
        id: "tx-2023-004",
        accountId: "acc2",
        amount: 1100.0,
        currency: "USD",
        type: "debit" as const,
        status: "processed" as const,
        reference: "VCU-TRF-20230112",
        description: "Transfer to primary checking",
        category: "Transfer",
        date: new Date("2023-01-12T11:40:00"),
    },
];

const baseRecentTransfers = [
    {
        id: "tf-2026-01",
        fromAccountId: "acc1",
        toAccountId: "acc2",
        amount: 950.0,
        date: new Date("2026-02-18T11:05:00"),
    },
    {
        id: "tf-2025-01",
        fromAccountId: "acc3",
        toAccountId: "acc1",
        amount: 2100.0,
        date: new Date("2025-10-02T09:35:00"),
    },
    {
        id: "tf-2024-01",
        fromAccountId: "acc2",
        toAccountId: "acc1",
        amount: 1100.0,
        date: new Date("2024-01-12T11:40:00"),
    },
];

function hashString(value: string) {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(index);
        hash |= 0;
    }

    return Math.abs(hash);
}

function seededOffset(userKey: string, salt: string, spread: number) {
    const hash = hashString(`${userKey}:${salt}`);
    const normalized = (hash % 1000) / 1000;
    return 1 + (normalized - 0.5) * spread * 2;
}

function toMoney(value: number) {
    return Number(value.toFixed(2));
}

function createMaskedNumber(userKey: string, accountId: string) {
    const hash = hashString(`${userKey}:${accountId}`);
    const last4 = String(1000 + (hash % 9000));
    return `****${last4}`;
}

function createFullNumber(userKey: string, accountId: string) {
    const hash = hashString(`full:${userKey}:${accountId}`);
    const suffix = String(10000000 + (hash % 90000000));
    return `1234${suffix}`;
}

function createReference(baseReference: string, userKey: string) {
    const hash = hashString(`${baseReference}:${userKey}`).toString(16).slice(0, 4).toUpperCase();
    return `${baseReference}-${hash}`;
}

export function createMockBankingData(userKey = "guest") {
    const accounts = baseAccounts.map((account) => {
        const balanceFactor = seededOffset(userKey, `${account.id}:balance`, 0.18);
        const adjustedBalance = toMoney(account.balance * balanceFactor);
        const availableBalance = account.availableBalance
            ? toMoney(account.availableBalance * balanceFactor)
            : undefined;
        const pendingBalance = account.pendingBalance
            ? toMoney(account.pendingBalance * seededOffset(userKey, `${account.id}:pending`, 0.12))
            : account.pendingBalance;
        const interestEarned = account.interestEarned
            ? toMoney(account.interestEarned * seededOffset(userKey, `${account.id}:interest`, 0.2))
            : undefined;

        return {
            ...account,
            balance: adjustedBalance,
            number: createMaskedNumber(userKey, account.id),
            fullNumber: createFullNumber(userKey, account.id),
            availableBalance,
            pendingBalance,
            interestEarned,
        };
    });

    const transactions = baseTransactions.map((transaction) => {
        const amountFactor = seededOffset(userKey, `${transaction.id}:amount`, 0.22);
        return {
            ...transaction,
            amount: toMoney(transaction.amount * amountFactor),
            reference: createReference(transaction.reference, userKey),
        };
    });

    const recentTransfers = baseRecentTransfers.map((transfer) => ({
        ...transfer,
        amount: toMoney(transfer.amount * seededOffset(userKey, `${transfer.id}:amount`, 0.2)),
    }));

    const accountsById = Object.fromEntries(accounts.map((account) => [account.id, account]));
    const transactionsByAccount = Object.fromEntries(
        accounts.map((account) => [
            account.id,
            transactions
                .filter((transaction) => transaction.accountId === account.id)
                .sort((left, right) => right.date.getTime() - left.date.getTime()),
        ])
    ) as Record<string, MockBankTransaction[]>;

    return {
        accounts,
        accountsById,
        transactions: transactions.sort((left, right) => right.date.getTime() - left.date.getTime()),
        transactionsByAccount,
        recentTransfers: recentTransfers.sort((left, right) => right.date.getTime() - left.date.getTime()),
    };
}
