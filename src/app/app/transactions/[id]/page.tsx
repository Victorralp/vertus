"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    CircleDollarSign,
    Clock3,
    Download,
    Receipt,
    ShieldCheck,
    Tag,
    Landmark,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMockBankingData } from "@/hooks/use-mock-banking-data";
import { PageLoadingState } from "@/components/shared/page-loading-state";

const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount);

const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

export default function TransactionDetailsPage() {
    const params = useParams();
    const transactionId = params.id as string;
    const { accountsById, loading, transactions } = useMockBankingData();
    const transaction = transactions.find((item) => item.id === transactionId);

    if (loading) {
        return <PageLoadingState title="Loading transaction details" />;
    }

    if (!transaction) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Transaction not found</p>
                <Link href="/app/transactions">
                    <Button variant="link" className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to transactions
                    </Button>
                </Link>
            </div>
        );
    }

    const account = accountsById[transaction.accountId];
    const isCredit = transaction.type === "credit";
    const statusTone =
        transaction.status === "processed"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
            : transaction.status === "pending"
              ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300";

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                    <Button asChild variant="ghost" className="w-fit gap-2 px-0">
                        <Link href="/app/transactions">
                            <ArrowLeft className="h-4 w-4" />
                            Back to transactions
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Transaction details
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Review the full payment record, reference, timing,
                            and settlement status.
                        </p>
                    </div>
                </div>

                <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => window.print()}>
                    <Download className="h-4 w-4" />
                    Download receipt
                </Button>
            </div>

            <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 text-white">
                <CardContent className="relative p-6 lg:p-8">
                    <div className="absolute right-0 top-0 h-44 w-44 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-36 w-36 -translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-400/20 blur-3xl" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div
                                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                                    isCredit
                                        ? "bg-emerald-400/20 text-emerald-200"
                                        : "bg-rose-400/20 text-rose-200"
                                }`}
                            >
                                {isCredit ? (
                                    <ArrowDownRight className="h-7 w-7" />
                                ) : (
                                    <ArrowUpRight className="h-7 w-7" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-[0.24em] text-blue-100/80">
                                    {transaction.category}
                                </p>
                                <h2 className="mt-2 text-3xl font-bold">
                                    {formatCurrency(transaction.amount, transaction.currency)}
                                </h2>
                                <p className="mt-2 max-w-xl text-sm text-slate-200/80">
                                    {transaction.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge className="gap-1.5 border-transparent bg-white/10 text-white">
                                {isCredit ? "Money in" : "Money out"}
                            </Badge>
                            <Badge className={`gap-1.5 border ${statusTone}`}>
                                {transaction.status}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Receipt summary</CardTitle>
                        <CardDescription>
                            Core information attached to this transaction.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Receipt className="h-4 w-4" />
                                Reference
                            </div>
                            <code className="mt-3 block text-sm font-semibold text-gray-900 dark:text-white">
                                {transaction.reference}
                            </code>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <CircleDollarSign className="h-4 w-4" />
                                Amount
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(transaction.amount, transaction.currency)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <CalendarDays className="h-4 w-4" />
                                Date
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                                {formatDate(transaction.date)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Clock3 className="h-4 w-4" />
                                Time
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                                {formatTime(transaction.date)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Tag className="h-4 w-4" />
                                Category
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                                {transaction.category}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <ShieldCheck className="h-4 w-4" />
                                Settlement
                            </div>
                            <p className="mt-3 text-sm font-semibold capitalize text-gray-900 dark:text-white">
                                {transaction.status}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60 md:col-span-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Landmark className="h-4 w-4" />
                                Account
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                                {account?.name ?? "Unknown account"} {account ? `(${account.number})` : ""}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Processing notes</CardTitle>
                        <CardDescription>
                            Helpful context around how this payment moved.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
                            <p className="font-semibold text-gray-900 dark:text-white">
                                Timeline
                            </p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Created on {formatDate(transaction.date)} at{" "}
                                {formatTime(transaction.date)}.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
                            <p className="font-semibold text-gray-900 dark:text-white">
                                Direction
                            </p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                This transaction was recorded as{" "}
                                {isCredit ? "incoming money" : "outgoing money"}.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
                            <p className="font-semibold text-gray-900 dark:text-white">
                                Funding account
                            </p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {account?.name ?? "Unknown account"} {account ? `(${account.number})` : ""}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
                            <p className="font-semibold text-gray-900 dark:text-white">
                                Description
                            </p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {transaction.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
