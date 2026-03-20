"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    Download,
    Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMockBankingData } from "@/hooks/use-mock-banking-data";
import type { MockBankTransaction } from "@/lib/data/mock-banking";
import { PageLoadingState } from "@/components/shared/page-loading-state";

const typeFilters = [
    { value: "all", label: "All" },
    { value: "credit", label: "Money in" },
    { value: "debit", label: "Money out" },
] as const;

const statusFilters = [
    { value: "all", label: "Any status" },
    { value: "processed", label: "Processed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
] as const;

type TransactionTypeFilter = (typeof typeFilters)[number]["value"];
type TransactionStatusFilter = (typeof statusFilters)[number]["value"];

function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount);
}

function formatDate(date: Date) {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getStatusBadge(status: MockBankTransaction["status"]) {
    if (status === "processed") {
        return <Badge className="border-transparent bg-emerald-500/10 text-emerald-300">Processed</Badge>;
    }

    if (status === "pending") {
        return <Badge className="border-transparent bg-amber-500/10 text-amber-300">Pending</Badge>;
    }

    return <Badge className="border-transparent bg-red-500/10 text-red-300">Failed</Badge>;
}

export default function TransactionsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<TransactionTypeFilter>("all");
    const [selectedStatus, setSelectedStatus] = useState<TransactionStatusFilter>("all");
    const { accountsById, loading, transactions } = useMockBankingData();

    const filteredTransactions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return transactions
            .slice()
            .sort((left, right) => right.date.getTime() - left.date.getTime())
            .filter((tx) => {
                const matchesQuery =
                    query.length === 0 ||
                    tx.reference.toLowerCase().includes(query) ||
                    tx.description.toLowerCase().includes(query) ||
                    tx.category.toLowerCase().includes(query);

                const matchesType = selectedType === "all" || tx.type === selectedType;
                const matchesStatus = selectedStatus === "all" || tx.status === selectedStatus;

                return matchesQuery && matchesType && matchesStatus;
            });
    }, [searchQuery, selectedStatus, selectedType, transactions]);

    const totals = useMemo(() => {
        const credits = filteredTransactions
            .filter((tx) => tx.type === "credit")
            .reduce((sum, tx) => sum + tx.amount, 0);

        const debits = filteredTransactions
            .filter((tx) => tx.type === "debit")
            .reduce((sum, tx) => sum + tx.amount, 0);

        return {
            credits,
            debits,
            flagged: filteredTransactions.filter((tx) => tx.status !== "processed").length,
        };
    }, [filteredTransactions]);

    const yearRange = useMemo(() => {
        if (transactions.length === 0) {
            return "";
        }

        const years = transactions.map((transaction) => transaction.date.getFullYear());
        return `${Math.min(...years)} - ${Math.max(...years)}`;
    }, [transactions]);

    if (loading) {
        return <PageLoadingState title="Loading transactions" />;
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Review account activity, settlement status, and receipt records across {yearRange}.
                    </p>
                </div>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => window.print()}>
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-[#0b1324] px-4 py-3.5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Money In</p>
                    <p className="mt-2 text-xl font-semibold">{formatCurrency(totals.credits, "USD")}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#0b1324] px-4 py-3.5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Money Out</p>
                    <p className="mt-2 text-xl font-semibold">{formatCurrency(totals.debits, "USD")}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#0b1324] px-4 py-3.5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Pending / Failed</p>
                    <p className="mt-2 text-xl font-semibold">{totals.flagged}</p>
                </div>
            </div>

            <Card className="overflow-hidden border-slate-800 bg-[#050b18] text-white shadow-[0_24px_60px_rgba(2,6,23,0.38)]">
                <CardHeader className="gap-4 border-b border-slate-800/80 bg-[#0b1324]">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <Input
                                placeholder="Search by merchant, category, or reference"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-slate-700 bg-[#0f172a] pl-10 text-white placeholder:text-slate-500"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {typeFilters.map((filter) => (
                                <Button
                                    key={filter.value}
                                    type="button"
                                    variant={selectedType === filter.value ? "default" : "outline"}
                                    className={selectedType === filter.value ? "" : "border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"}
                                    onClick={() => setSelectedType(filter.value)}
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {statusFilters.map((filter) => (
                            <Button
                                key={filter.value}
                                type="button"
                                variant={selectedStatus === filter.value ? "secondary" : "ghost"}
                                className={selectedStatus === filter.value ? "bg-slate-800 text-white hover:bg-slate-700" : "text-slate-400 hover:bg-slate-800 hover:text-white"}
                                onClick={() => setSelectedStatus(filter.value)}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                </CardHeader>

                <CardContent className="space-y-3 p-4 sm:p-6">
                    {filteredTransactions.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
                            <p className="text-lg font-semibold text-white">No transactions match your filters</p>
                            <p className="mt-2 text-sm text-slate-400">Try a broader search or reset the type and status filters.</p>
                            <Button
                                variant="outline"
                                className="mt-5"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedType("all");
                                    setSelectedStatus("all");
                                }}
                            >
                                Reset filters
                            </Button>
                        </div>
                    ) : (
                        filteredTransactions.map((tx) => {
                            const isCredit = tx.type === "credit";

                            return (
                                <div key={tx.id} className="rounded-2xl border border-slate-800 bg-[#0b1324] p-4">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                                                isCredit ? "bg-emerald-500/14 text-emerald-400" : "bg-rose-500/14 text-rose-400"
                                            }`}>
                                                {isCredit ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-lg font-semibold text-white">{formatCurrency(tx.amount, tx.currency)}</p>
                                                <p className="mt-1 text-sm text-slate-300">{tx.description}</p>
                                                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                                                    {accountsById[tx.accountId]?.name ?? "Account"} · {tx.category}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                                            <Badge className={`border-transparent ${isCredit ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
                                                {isCredit ? "Money in" : "Money out"}
                                            </Badge>
                                            {getStatusBadge(tx.status)}
                                            <Button asChild variant="outline" size="sm" className="border-slate-500 bg-transparent text-blue-400 hover:bg-slate-900 hover:text-blue-300">
                                                <Link href={`/app/transactions/${tx.id}`}>Receipt</Link>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3 rounded-xl bg-[#08101f] p-3 text-sm sm:grid-cols-3">
                                        <div>
                                            <p className="text-slate-500">Reference</p>
                                            <code className="mt-1 block text-xs text-slate-300">{tx.reference}</code>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Date</p>
                                            <p className="mt-1 font-medium text-white">{formatDate(tx.date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Status</p>
                                            <p className="mt-1 font-medium capitalize text-white">{tx.status}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
