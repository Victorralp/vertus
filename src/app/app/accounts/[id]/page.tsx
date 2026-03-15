"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Share2,
    MoreHorizontal,
    Wallet,
    TrendingUp,
    Eye,
    EyeOff,
    CalendarDays
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Account data
const accountsData: Record<string, {
    id: string;
    name: string;
    type: string;
    balance: number;
    number: string;
    routingNumber: string;
    transactions: Array<{
        id: string;
        description: string;
        amount: number;
        date: string;
        type: string;
        category: string;
    }>;
}> = {
    acc1: {
        id: "acc1",
        name: "Primary Checking",
        type: "checking",
        balance: 12458.32,
        number: "1234567894521",
        routingNumber: "021000021",
        transactions: [
            { id: "t1", description: "Netflix Subscription", amount: -15.99, date: "Jan 27, 2026", type: "debit", category: "Entertainment" },
            { id: "t2", description: "Salary Deposit", amount: 4500.00, date: "Jan 26, 2026", type: "credit", category: "Income" },
            { id: "t3", description: "Amazon Purchase", amount: -89.99, date: "Jan 25, 2026", type: "debit", category: "Shopping" },
            { id: "t4", description: "Uber Ride", amount: -23.50, date: "Jan 24, 2026", type: "debit", category: "Transport" },
            { id: "t5", description: "Transfer from Savings", amount: 500.00, date: "Jan 23, 2026", type: "credit", category: "Transfer" },
        ]
    },
    acc2: {
        id: "acc2",
        name: "High-Yield Savings",
        type: "savings",
        balance: 45230.00,
        number: "1234567897832",
        routingNumber: "021000021",
        transactions: [
            { id: "t1", description: "Interest Payment", amount: 156.78, date: "Jan 25, 2026", type: "credit", category: "Interest" },
            { id: "t2", description: "Transfer to Checking", amount: -500.00, date: "Jan 23, 2026", type: "debit", category: "Transfer" },
            { id: "t3", description: "Deposit", amount: 2000.00, date: "Jan 15, 2026", type: "credit", category: "Deposit" },
        ]
    },
    acc3: {
        id: "acc3",
        name: "Business Account",
        type: "business",
        balance: 89750.45,
        number: "1234567899156",
        routingNumber: "021000021",
        transactions: [
            { id: "t1", description: "Client Payment - ABC Corp", amount: 15000.00, date: "Jan 27, 2026", type: "credit", category: "Income" },
            { id: "t2", description: "Office Supplies", amount: -234.56, date: "Jan 26, 2026", type: "debit", category: "Expense" },
            { id: "t3", description: "Software Subscription", amount: -99.00, date: "Jan 25, 2026", type: "debit", category: "Expense" },
        ]
    }
};

export default function AccountDetailPage() {
    const params = useParams();
    const accountId = params.id as string;
    const [showDetails, setShowDetails] = useState(true);

    const account = accountsData[accountId];

    if (!account) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Account not found</p>
                <Link href="/app/accounts">
                    <Button variant="link" className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Accounts
                    </Button>
                </Link>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const maskNumber = (num: string) => {
        return '••••' + num.slice(-4);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/app/accounts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{account.name}</h1>
                        <p className="text-gray-500 capitalize">{account.type} Account</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                    </Button>
                    <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                    </Button>
                </div>
            </div>

            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="p-2 rounded-full hover:bg-white/10"
                        >
                            {showDetails ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    <p className="text-emerald-100 text-sm">Available Balance</p>
                    <p className="text-4xl font-bold mt-1">
                        {showDetails ? formatCurrency(account.balance) : '••••••••'}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-emerald-100">Account Number</p>
                            <p className="font-medium">{showDetails ? account.number : maskNumber(account.number)}</p>
                        </div>
                        <div>
                            <p className="text-emerald-100">Routing Number</p>
                            <p className="font-medium">{showDetails ? account.routingNumber : '•••••••••'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-3">
                <Link href="/app/transfers" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Transfer
                    </Button>
                </Link>
                <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Statement
                </Button>
            </div>

            {/* Transactions */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Transaction History</CardTitle>
                    <Button variant="ghost" size="sm">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        Filter
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {account.transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'credit'
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                        }`}>
                                        {tx.type === 'credit'
                                            ? <ArrowDownRight className="h-5 w-5" />
                                            : <ArrowUpRight className="h-5 w-5" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{tx.description}</p>
                                        <p className="text-sm text-gray-500">{tx.date} • {tx.category}</p>
                                    </div>
                                </div>
                                <span className={`font-semibold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900 dark:text-white'
                                    }`}>
                                    {tx.type === 'credit' ? '+' : ''}{formatCurrency(tx.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
