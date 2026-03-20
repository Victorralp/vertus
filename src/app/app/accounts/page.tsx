"use client";

import Link from "next/link";
import {
    Wallet,
    Plus,
    TrendingUp,
    ChevronRight,
    Eye,
    EyeOff,
    PiggyBank,
    Building2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMockBankingData } from "@/hooks/use-mock-banking-data";
import { PageLoadingState } from "@/components/shared/page-loading-state";

const accountIcons = {
    checking: Wallet,
    savings: PiggyBank,
    business: Building2,
};

const accountColors = {
    checking: "from-blue-500 to-cyan-500",
    savings: "from-emerald-500 to-teal-500",
    business: "from-purple-500 to-pink-500",
};

export default function AccountsPage() {
    const [showBalances, setShowBalances] = useState(true);
    const { accounts, loading } = useMockBankingData();

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    if (loading) {
        return <PageLoadingState title="Loading accounts" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accounts</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage balances that stay synced with activity and transfers</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBalances(!showBalances)}
                    >
                        {showBalances ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                        {showBalances ? "Hide" : "Show"}
                    </Button>
                    <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600">
                        <Link href="/app/support">
                            <Plus className="h-4 w-4 mr-1" />
                            Request Account
                        </Link>
                    </Button>
                </div>
            </div>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Balance</p>
                            <p className="text-3xl font-bold mt-1">
                                {showBalances ? formatCurrency(totalBalance) : "••••••••"}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">Across {accounts.length} accounts</p>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400 text-sm">
                            <TrendingUp className="h-4 w-4" />
                            <span>Personalized by your account profile</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {accounts.map((account) => {
                    const Icon = accountIcons[account.type as keyof typeof accountIcons] || Wallet;
                    const color = accountColors[account.type as keyof typeof accountColors] || "from-gray-500 to-gray-600";

                    return (
                        <Link key={account.id} href={`/app/accounts/${account.id}`}>
                            <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <CardTitle className="text-lg mt-3">{account.name}</CardTitle>
                                    <CardDescription>{account.number}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {showBalances ? formatCurrency(account.balance) : "••••••"}
                                    </p>
                                    <p className="text-sm text-gray-500 capitalize mt-1">
                                        {account.type} account
                                    </p>

                                    {account.type === "savings" && account.interestRate && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Interest Rate</span>
                                                <span className="font-medium text-emerald-600">{account.interestRate}</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
