export interface Transaction {
    id: string;
    amount: number;
    currency: string;
    type: "credit" | "debit";
    status: "processed" | "pending" | "failed";
    reference: string;
    description: string;
    category: string;
    date: Date;
}

export const mockTransactions: Transaction[] = [
    {
        id: "1",
        amount: 5000.0,
        currency: "USD",
        type: "credit",
        status: "processed",
        reference: "MY_-773f7da9f2",
        description: "Salary payment from Vertex Holdings",
        category: "Income",
        date: new Date("2026-03-12T04:51:00"),
    },
    {
        id: "2",
        amount: 245.78,
        currency: "USD",
        type: "debit",
        status: "processed",
        reference: "MY_-b8e4c243c8",
        description: "Groceries and household supplies",
        category: "Shopping",
        date: new Date("2026-03-11T14:20:00"),
    },
    {
        id: "3",
        amount: 1200.0,
        currency: "USD",
        type: "debit",
        status: "pending",
        reference: "MY_-2ba2d4f4b4",
        description: "Monthly rent transfer",
        category: "Housing",
        date: new Date("2026-03-10T09:58:00"),
    },
    {
        id: "4",
        amount: 8200.0,
        currency: "USD",
        type: "credit",
        status: "processed",
        reference: "MY_-b2f4bc77f4",
        description: "Investment payout",
        category: "Investments",
        date: new Date("2026-03-08T07:48:00"),
    },
    {
        id: "5",
        amount: 84.99,
        currency: "USD",
        type: "debit",
        status: "failed",
        reference: "MY_-92fd8c1ef1",
        description: "Streaming subscription renewal",
        category: "Entertainment",
        date: new Date("2026-03-06T18:16:00"),
    },
    {
        id: "6",
        amount: 3100.0,
        currency: "USD",
        type: "credit",
        status: "processed",
        reference: "MY_-2ce45d31ad",
        description: "Client invoice settlement",
        category: "Business",
        date: new Date("2026-03-04T11:42:00"),
    },
];
