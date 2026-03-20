"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    Clock3,
    Search,
    ChevronRight,
    ShieldAlert,
    CircleAlert,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMockBankingData } from "@/hooks/use-mock-banking-data";
import type { MockBankTransaction } from "@/lib/data/mock-banking";
import { PageLoadingState } from "@/components/shared/page-loading-state";

const filters = [
    { value: "all", label: "Everything" },
    { value: "credit", label: "Money in" },
    { value: "debit", label: "Money out" },
] as const;

type ActivityFilter = (typeof filters)[number]["value"];

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

function formatRelative(date: Date) {
    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
        return "Just now";
    }

    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }

    if (diffDays < 7) {
        return `${diffDays}d ago`;
    }

    return formatDate(date);
}

function getStatusBadge(status: MockBankTransaction["status"]) {
    if (status === "processed") {
        return <Badge className="border-transparent bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">Processed</Badge>;
    }

    if (status === "pending") {
        return <Badge className="border-transparent bg-amber-500/10 text-amber-700 dark:text-amber-300">Pending</Badge>;
    }

    return <Badge className="border-transparent bg-red-500/10 text-red-700 dark:text-red-300">Failed</Badge>;
}

export default function RecentActivityPage() {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<ActivityFilter>("all");
    const { accountsById, loading, transactions } = useMockBankingData();

    const filtered = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return transactions
            .slice()
            .sort((left, right) => right.date.getTime() - left.date.getTime())
            .filter((transaction) => {
                const matchesFilter = filter === "all" || transaction.type === filter;
                const matchesQuery =
                    normalizedQuery.length === 0 ||
                    transaction.description.toLowerCase().includes(normalizedQuery) ||
                    transaction.category.toLowerCase().includes(normalizedQuery) ||
                    transaction.reference.toLowerCase().includes(normalizedQuery);

                return matchesFilter && matchesQuery;
            });
    }, [filter, query, transactions]);

    const stats = useMemo(() => {
        const credits = filtered.filter((transaction) => transaction.type === "credit").length;
        const debits = filtered.filter((transaction) => transaction.type === "debit").length;
        const flagged = filtered.filter((transaction) => transaction.status !== "processed").length;

        return { credits, debits, flagged };
    }, [filtered]);

    const yearSpan = useMemo(() => {
        if (transactions.length === 0) {
            return "";
        }

        const years = transactions.map((transaction) => transaction.date.getFullYear());
        return `${Math.min(...years)} - ${Math.max(...years)}`;
    }, [transactions]);

    if (loading) {
        return <PageLoadingState title="Loading recent activity" />;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(140deg,#111827_0%,#15324e_48%,#eff6ff_100%)] p-6 shadow-[0_28px_90px_rgba(15,23,42,0.18)] dark:border-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_30%)]" />
                <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
                    <div className="min-w-0 space-y-4 text-white">
                        <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-sky-100">
                            Recent Activity
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">The latest movement across your account</h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-200/90 sm:text-base">
                                Scan incoming deposits, outgoing payments, and exceptions from a history that stays consistent across pages and spans {yearSpan}.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-[0.22em] text-sky-100/80">Money In</p>
                            <p className="mt-2 text-3xl font-semibold">{stats.credits}</p>
                            <p className="mt-1 text-sm text-slate-200/80">Recent credit events</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-[0.22em] text-sky-100/80">Money Out</p>
                            <p className="mt-2 text-3xl font-semibold">{stats.debits}</p>
                            <p className="mt-1 text-sm text-slate-200/80">Recent debit events</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm sm:col-span-3 xl:col-span-1">
                            <p className="text-xs uppercase tracking-[0.22em] text-sky-100/80">Attention Needed</p>
                            <p className="mt-2 text-3xl font-semibold">{stats.flagged}</p>
                            <p className="mt-1 text-sm text-slate-200/80">Pending or failed entries</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                    <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        placeholder="Search by merchant, category, or reference"
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        className="h-11 rounded-xl pl-10"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {filters.map((item) => (
                                        <Button
                                            key={item.value}
                                            type="button"
                                            variant={filter === item.value ? "default" : "outline"}
                                            onClick={() => setFilter(item.value)}
                                            className={`rounded-full ${
                                                filter === item.value ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900" : ""
                                            }`}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                                        <Clock3 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">No recent activity matches that filter</p>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try a broader search or switch back to all activity.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filtered.map((transaction) => {
                                        const isCredit = transaction.type === "credit";
                                        const Icon = isCredit ? ArrowDownRight : ArrowUpRight;

                                        return (
                                            <div
                                                key={transaction.id}
                                                className="grid gap-4 px-6 py-5 transition hover:bg-slate-50/70 dark:hover:bg-slate-900/40 lg:grid-cols-[auto_minmax(0,1fr)_auto]"
                                            >
                                                <div className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                                                    isCredit
                                                        ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300"
                                                        : "bg-rose-500/12 text-rose-600 dark:text-rose-300"
                                                }`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
                                                            {transaction.description}
                                                        </p>
                                                        {getStatusBadge(transaction.status)}
                                                    </div>
                                                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                                        {accountsById[transaction.accountId]?.name ?? "Account"} · {transaction.category} · {transaction.reference}
                                                    </p>
                                                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                                                        {formatRelative(transaction.date)}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-start gap-3 lg:items-end">
                                                    <p className={`text-lg font-semibold ${isCredit ? "text-emerald-600 dark:text-emerald-300" : "text-slate-900 dark:text-white"}`}>
                                                        {isCredit ? "+" : "-"}
                                                        {formatCurrency(transaction.amount, transaction.currency)}
                                                    </p>
                                                    <Button asChild variant="outline" size="sm" className="rounded-xl">
                                                        <Link href={`/app/transactions/${transaction.id}`}>
                                                            Open Receipt
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <CardTitle>Watchlist</CardTitle>
                            <CardDescription>Items worth checking first</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                                <div className="flex items-start gap-3">
                                    <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-300" />
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Pending activity</p>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                            {filtered.filter((transaction) => transaction.status === "pending").length} transactions are still processing.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                                <div className="flex items-start gap-3">
                                    <CircleAlert className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-300" />
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Failed items</p>
                                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                            {filtered.filter((transaction) => transaction.status === "failed").length} activities need review or retry.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button asChild className="h-11 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0f9b8e)] text-white hover:opacity-95">
                                <Link href="/app/transactions">
                                    Open Full Transactions
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
