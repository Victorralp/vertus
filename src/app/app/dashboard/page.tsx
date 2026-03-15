"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    TrendingUp,
    ArrowRight,
    Eye,
    EyeOff,
    Clock,
    ChevronRight,
    Loader2,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

interface AccountDisplay {
    accountId: string;
    type: string;
    balance: number;
    accountNumber: string;
}

interface TransactionDisplay {
    txId: string;
    description: string;
    amount: number;
    type: string;
    createdAt: Date;
}

// Mock data - matches the accounts page
const mockAccounts: AccountDisplay[] = [
    {
        accountId: "acc1",
        type: "checking",
        balance: 1245832, // in cents
        accountNumber: "****4521",
    },
    {
        accountId: "acc2",
        type: "savings",
        balance: 4523000, // in cents
        accountNumber: "****7832",
    },
    {
        accountId: "acc3",
        type: "business",
        balance: 8975045, // in cents
        accountNumber: "****9156",
    },
];

const mockTransactions: TransactionDisplay[] = [
    {
        txId: "tx1",
        description: "Starbucks Coffee",
        amount: 545, // in cents
        type: "debit",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
        txId: "tx2",
        description: "Salary Deposit",
        amount: 450000, // in cents
        type: "credit",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
        txId: "tx3",
        description: "Amazon Purchase",
        amount: 8999, // in cents
        type: "debit",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
        txId: "tx4",
        description: "Netflix Subscription",
        amount: 1599, // in cents
        type: "debit",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    },
    {
        txId: "tx5",
        description: "Freelance Payment",
        amount: 125000, // in cents
        type: "credit",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    },
];

const quickActions = [
    { name: "Transfer", href: "/app/transfers", icon: ArrowUpRight },
    { name: "Accounts", href: "/app/accounts", icon: Wallet },
    { name: "Cards", href: "/app/cards", icon: CreditCard },
];

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [showBalance, setShowBalance] = useState(true);
    const [accounts, setAccounts] = useState<AccountDisplay[]>([]);
    const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Simulate loading delay
                setTimeout(() => {
                    setAccounts(mockAccounts);
                    setTransactions(mockTransactions);
                    setLoading(false);
                }, 500);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    const formatCurrency = (amount: number) => {
        // Convert from cents to dollars
        const dollars = amount / 100;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(dollars);
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getAccountName = (type: string) => {
        return type === 'checking' ? 'Checking Account' : 'Savings Account';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.displayName?.split(' ')[0] || 'there'}!
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Here's an overview of your accounts
                </p>
            </div>

            {/* Total Balance Card */}
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardHeader className="pb-2">
                    <CardDescription className="text-emerald-100">Total Balance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl font-bold">
                                {showBalance ? formatCurrency(totalBalance) : '••••••••'}
                            </span>
                            <button
                                onClick={() => setShowBalance(!showBalance)}
                                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                            >
                                {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {accounts.length > 0 && (
                            <div className="flex items-center gap-1 text-emerald-100 text-sm">
                                <TrendingUp className="h-4 w-4" />
                                <span>{accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}</span>
                            </div>
                        )}
                    </div>
                    {accounts.length === 0 && (
                        <p className="text-emerald-100 text-sm mt-2">
                            No accounts found. Create your first account to get started.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
                {quickActions.map((action) => (
                    <Link key={action.name} href={action.href}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                            <CardContent className="p-4 flex flex-col items-center text-center">
                                <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                                    <action.icon className="h-6 w-6" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {action.name}
                                </span>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Accounts & Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Accounts */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Your Accounts</CardTitle>
                        <Link href="/app/accounts">
                            <Button variant="ghost" size="sm" className="text-emerald-600">
                                View All
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {accounts.map((account) => (
                            <Link key={account.accountId} href={`/app/accounts/${account.accountId}`}>
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
                                            <Wallet className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{getAccountName(account.type)}</p>
                                            <p className="text-sm text-gray-500">{account.accountNumber}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {showBalance ? formatCurrency(account.balance) : '••••'}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">{account.type}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                        <Button variant="ghost" size="sm" className="text-emerald-600">
                            <Clock className="mr-1 h-4 w-4" />
                            History
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <div key={tx.txId} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.type === 'credit'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                            }`}>
                                            {tx.type === 'credit'
                                                ? <ArrowDownRight className="h-4 w-4" />
                                                : <ArrowUpRight className="h-4 w-4" />
                                            }
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{tx.description}</p>
                                            <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                                        </div>
                                    </div>
                                    <span className={`font-semibold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900 dark:text-white'
                                        }`}>
                                        {tx.type === 'credit' ? '+' : ''}{formatCurrency(tx.amount)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No recent transactions</p>
                                <p className="text-xs mt-1">Your transaction history will appear here</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
