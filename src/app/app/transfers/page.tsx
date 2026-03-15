"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeftRight,
    AlertCircle,
    Loader2,
    CheckCircle2,
    ChevronDown,
    History,
    Shield
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Account data
const accounts = [
    { id: "acc1", name: "Primary Checking", balance: 12458.32, number: "****4521" },
    { id: "acc2", name: "High-Yield Savings", balance: 45230.00, number: "****7832" },
    { id: "acc3", name: "Business Account", balance: 89750.45, number: "****9156" },
];

const recentTransfers = [
    { id: "tf1", from: "Primary Checking", to: "Savings", amount: 500, date: "Jan 25, 2026" },
    { id: "tf2", from: "Business Account", to: "Primary Checking", amount: 2000, date: "Jan 20, 2026" },
    { id: "tf3", from: "Savings", to: "Primary Checking", amount: 1000, date: "Jan 15, 2026" },
];

export default function TransfersPage() {
    const router = useRouter();
    const [fromAccount, setFromAccount] = useState("");
    const [toAccount, setToAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const selectedFrom = accounts.find(a => a.id === fromAccount);
    const selectedTo = accounts.find(a => a.id === toAccount);
    const transferAmount = parseFloat(amount) || 0;

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!fromAccount || !toAccount) {
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

        // Redirect to OTP verification
        // In production, this would call a Cloud Function to initiate the transfer
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push("/verify-otp?action=transfer");
    };

    if (success) {
        return (
            <div className="max-w-lg mx-auto">
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Transfer Successful!
                        </h2>
                        <p className="mt-2 text-gray-500">
                            {formatCurrency(transferAmount)} has been transferred from {selectedFrom?.name} to {selectedTo?.name}.
                        </p>
                        <Link href="/app/dashboard">
                            <Button className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-600">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transfers</h1>
                <p className="text-gray-500 dark:text-gray-400">Move money between your accounts</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transfer Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowLeftRight className="h-5 w-5 text-emerald-500" />
                                New Transfer
                            </CardTitle>
                            <CardDescription>Transfer funds between your accounts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {/* From Account */}
                                <div className="space-y-2">
                                    <Label>From Account</Label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-12 px-4 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={fromAccount}
                                            onChange={(e) => setFromAccount(e.target.value)}
                                            disabled={loading}
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

                                {/* To Account */}
                                <div className="space-y-2">
                                    <Label>To Account</Label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-12 px-4 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={toAccount}
                                            onChange={(e) => setToAccount(e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="">Select account...</option>
                                            {accounts.filter(a => a.id !== fromAccount).map((acc) => (
                                                <option key={acc.id} value={acc.id}>
                                                    {acc.name} ({acc.number})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Amount */}
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
                                            disabled={loading}
                                        />
                                    </div>
                                    {selectedFrom && transferAmount > 0 && (
                                        <p className={`text-sm ${transferAmount > selectedFrom.balance ? 'text-red-500' : 'text-gray-500'}`}>
                                            Available: {formatCurrency(selectedFrom.balance)}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label>Description (Optional)</Label>
                                    <Input
                                        placeholder="e.g., Monthly savings"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Security Notice */}
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
                                    disabled={loading || !fromAccount || !toAccount || transferAmount <= 0}
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

                {/* Recent Transfers */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <History className="h-5 w-5 text-gray-500" />
                                Recent Transfers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTransfers.map((tf) => (
                                    <div key={tf.id} className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(tf.amount)}
                                            </span>
                                            <span className="text-xs text-gray-500">{tf.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {tf.from} → {tf.to}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
