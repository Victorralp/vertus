"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeftRight,
    AlertCircle,
    Loader2,
    ChevronDown,
    History,
    Shield,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMockBankingData } from "@/hooks/use-mock-banking-data";

export default function TransfersPage() {
    const router = useRouter();
    const { accounts, accountsById, loading: dataLoading, recentTransfers } = useMockBankingData();
    const [fromAccount, setFromAccount] = useState("");
    const [toAccount, setToAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const selectedFrom = accounts.find((account) => account.id === fromAccount);
    const transferAmount = parseFloat(amount) || 0;

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(num);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (dataLoading || !fromAccount || !toAccount) {
            setError("Please select both accounts");
            return;
        }

        if (fromAccount === toAccount) {
            setError("Cannot transfer to the same account");
            return;
        }

        if (transferAmount <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        if (selectedFrom && transferAmount > selectedFrom.balance) {
            setError("Insufficient funds");
            return;
        }

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push("/verify-otp?action=transfer");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transfers</h1>
                <p className="text-gray-500 dark:text-gray-400">Move money between your synced accounts</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowLeftRight className="h-5 w-5 text-emerald-500" />
                                New Transfer
                            </CardTitle>
                            <CardDescription>Transfer funds between the same accounts shown on your dashboard and ledger</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>From Account</Label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-12 px-4 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={fromAccount}
                                            onChange={(e) => setFromAccount(e.target.value)}
                                            disabled={loading || dataLoading}
                                        >
                                            <option value="">Select account...</option>
                                            {accounts.map((acc) => (
                                                <option key={acc.id} value={acc.id}>
                                                    {acc.name} ({acc.number}) - {formatCurrency(acc.balance)}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>To Account</Label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-12 px-4 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={toAccount}
                                            onChange={(e) => setToAccount(e.target.value)}
                                            disabled={loading || dataLoading}
                                        >
                                            <option value="">Select account...</option>
                                            {accounts.filter((acc) => acc.id !== fromAccount).map((acc) => (
                                                <option key={acc.id} value={acc.id}>
                                                    {acc.name} ({acc.number})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Amount</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            placeholder="0.00"
                                            className="pl-8 h-12 text-lg"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            disabled={loading || dataLoading}
                                        />
                                    </div>
                                    {selectedFrom && transferAmount > 0 && (
                                        <p className={`text-sm ${transferAmount > selectedFrom.balance ? "text-red-500" : "text-gray-500"}`}>
                                            Available: {formatCurrency(selectedFrom.balance)}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Description (Optional)</Label>
                                    <Input
                                        placeholder="e.g., Monthly savings"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={loading || dataLoading}
                                    />
                                </div>

                                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-800 dark:text-amber-200">
                                        <p className="font-medium">OTP Verification Required</p>
                                        <p className="mt-1">You will be asked to verify this transfer with a one-time code sent to your email.</p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                                    disabled={loading || dataLoading || !fromAccount || !toAccount || transferAmount <= 0}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Continue to Verify
                                            <ArrowLeftRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <History className="h-5 w-5 text-gray-500" />
                                Recent Transfers
                            </CardTitle>
                            <CardDescription>Your latest internal moves across connected accounts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTransfers.map((transfer) => (
                                    <div key={transfer.id} className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(transfer.amount)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {transfer.date.toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {(accountsById[transfer.fromAccountId]?.name ?? "Account")} → {(accountsById[transfer.toAccountId]?.name ?? "Account")}
                                        </p>
                                    </div>
                                ))}
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/app/recent-activity">Open recent activity</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
