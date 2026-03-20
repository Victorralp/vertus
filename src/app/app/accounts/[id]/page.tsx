"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Share2,
    Wallet,
    Eye,
    EyeOff,
    CalendarDays,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useMockBankingData } from "@/hooks/use-mock-banking-data";
import { PageLoadingState } from "@/components/shared/page-loading-state";

export default function AccountDetailPage() {
    const params = useParams();
    const accountId = params.id as string;
    const [showDetails, setShowDetails] = useState(true);
    const { accountsById, loading, transactionsByAccount } = useMockBankingData();

    const account = accountsById[accountId];
    const accountTransactions = useMemo(
        () =>
            (transactionsByAccount[accountId] ?? [])
                .slice()
                .sort((left, right) => right.date.getTime() - left.date.getTime()),
        [accountId, transactionsByAccount]
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    if (loading) {
        return <PageLoadingState title="Loading account details" />;
    }

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                    </Button>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/app/transfers">
                            <Share2 className="h-4 w-4 mr-1" />
                            Transfer
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowDetails(!showDetails)}
                            className="p-2 rounded-full hover:bg-white/10"
                        >
                            {showDetails ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    <p className="text-emerald-100 text-sm">Available Balance</p>
                    <p className="text-4xl font-bold mt-1">
                        {showDetails ? formatCurrency(account.balance) : "••••••••"}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                        <div>
                            <p className="text-emerald-100">Account Number</p>
                            <p className="font-medium">{showDetails ? account.fullNumber : account.number}</p>
                        </div>
                        <div>
                            <p className="text-emerald-100">Routing Number</p>
                            <p className="font-medium">{showDetails ? account.routingNumber : "•••••••••"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Link href="/app/transfers" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Transfer
                    </Button>
                </Link>
                <Button variant="outline" className="flex-1" onClick={() => window.print()}>
                    <Download className="h-4 w-4 mr-2" />
                    Statement
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Transaction History</CardTitle>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/app/transactions">
                                <CalendarDays className="h-4 w-4 mr-1" />
                                Open Ledger
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {accountTransactions.map((tx) => (
                                <Link key={tx.id} href={`/app/transactions/${tx.id}`} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                            tx.type === "credit"
                                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                                        }`}>
                                            {tx.type === "credit"
                                                ? <ArrowDownRight className="h-5 w-5" />
                                                : <ArrowUpRight className="h-5 w-5" />
                                            }
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{tx.description}</p>
                                            <p className="text-sm text-gray-500">{formatDate(tx.date)} • {tx.category}</p>
                                        </div>
                                    </div>
                                    <span className={`font-semibold ${tx.type === "credit" ? "text-emerald-600" : "text-gray-900 dark:text-white"}`}>
                                        {tx.type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Account Snapshot</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                            <p className="text-xs uppercase tracking-[0.2em]">Available</p>
                            <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(account.availableBalance ?? account.balance)}
                            </p>
                        </div>

                        {typeof account.pendingBalance === "number" && (
                            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                                <p className="text-xs uppercase tracking-[0.2em]">Pending</p>
                                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(account.pendingBalance)}
                                </p>
                            </div>
                        )}

                        {account.interestRate && (
                            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                                <p className="text-xs uppercase tracking-[0.2em]">Interest Rate</p>
                                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                                    {account.interestRate}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
