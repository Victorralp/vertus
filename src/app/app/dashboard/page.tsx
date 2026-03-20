"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    Eye,
    EyeOff,
    Clock3,
    ChevronRight,
    Landmark,
    ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMockBankingData } from "@/hooks/use-mock-banking-data";
import { PageLoadingState } from "@/components/shared/page-loading-state";

const quickActions = [
    { name: "Transfer", href: "/app/transfers", icon: ArrowUpRight, description: "Move money fast" },
    { name: "Accounts", href: "/app/accounts", icon: Wallet, description: "Review balances" },
    { name: "Cards", href: "/app/cards", icon: CreditCard, description: "Manage spending" },
    { name: "Loans", href: "/app/loans", icon: Landmark, description: "Explore offers" },
] as const;

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

function formatRelative(date: Date) {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return "Today";
    }

    if (diffDays === 1) {
        return "Yesterday";
    }

    if (diffDays < 7) {
        return `${diffDays} days ago`;
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DashboardPage() {
    const [showBalance, setShowBalance] = useState(true);
    const { accounts, loading, transactions, user } = useMockBankingData();

    const totalBalance = useMemo(
        () => accounts.reduce((sum, account) => sum + account.balance, 0),
        [accounts]
    );

    const currentYear = new Date().getFullYear();

    const thisYearTransactions = useMemo(
        () => transactions.filter((transaction) => transaction.date.getFullYear() === currentYear),
        [currentYear, transactions]
    );

    const incomeThisYear = useMemo(
        () =>
            thisYearTransactions
                .filter((transaction) => transaction.type === "credit")
                .reduce((sum, transaction) => sum + transaction.amount, 0),
        [thisYearTransactions]
    );

    const spendingThisYear = useMemo(
        () =>
            thisYearTransactions
                .filter((transaction) => transaction.type === "debit")
                .reduce((sum, transaction) => sum + transaction.amount, 0),
        [thisYearTransactions]
    );

    const recentTransactions = useMemo(
        () =>
            transactions
                .slice()
                .sort((left, right) => right.date.getTime() - left.date.getTime())
                .slice(0, 5),
        [transactions]
    );

    if (loading) {
        return <PageLoadingState title="Loading your dashboard" />;
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(140deg,#0f172a_0%,#134e4a_48%,#ecfeff_100%)] p-6 shadow-[0_28px_90px_rgba(15,23,42,0.18)] dark:border-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_32%)]" />
                <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
                    <div className="min-w-0 space-y-5 text-white">
                        <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-cyan-100">
                            Portfolio Overview
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                Welcome back, {user?.displayName?.split(" ")[0] || "there"}
                            </h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-200/90 sm:text-base">
                                Review balances, spot recent movement, and jump into the next action without digging through the rest of the app.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button asChild className="h-11 rounded-xl bg-white text-slate-900 hover:bg-slate-100">
                                <Link href="/app/transfers">
                                    Transfer Money
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-11 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                                <Link href="/app/recent-activity">
                                    Open Recent Activity
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/80">Total Balance</p>
                            <div className="mt-2 flex items-center gap-3">
                                <p className="truncate text-3xl font-semibold">
                                    {showBalance ? formatCurrency(totalBalance) : "••••••••"}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setShowBalance((value) => !value)}
                                    className="rounded-full border border-white/10 bg-white/10 p-2 transition hover:bg-white/20"
                                >
                                    {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <p className="mt-2 text-sm text-slate-200/80">{accounts.length} active accounts connected</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/80">Money In</p>
                            <p className="mt-2 text-3xl font-semibold">{formatCurrency(incomeThisYear)}</p>
                            <p className="mt-2 text-sm text-slate-200/80">Credits recorded in {currentYear}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm sm:col-span-3 xl:col-span-1">
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/80">Spending</p>
                            <p className="mt-2 text-3xl font-semibold">{formatCurrency(spendingThisYear)}</p>
                            <p className="mt-2 text-sm text-slate-200/80">Debits recorded in {currentYear}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <Link key={action.name} href={action.href}>
                                    <Card className="group h-full rounded-[26px] border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/40">
                                        <CardContent className="space-y-4 p-5">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-slate-900 dark:text-white">{action.name}</p>
                                                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{action.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                                                Open
                                                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </section>

                    <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <CardTitle>Accounts</CardTitle>
                            <CardDescription>Balances stay synced with your activity feed</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                            {accounts.map((account) => (
                                <Link key={account.id} href={`/app/accounts/${account.id}`}>
                                    <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/40">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">{account.name}</p>
                                                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                                                    {account.number}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
                                        </div>
                                        <p className="mt-5 text-2xl font-semibold text-slate-900 dark:text-white">
                                            {showBalance ? formatCurrency(account.balance) : "••••••"}
                                        </p>
                                        <p className="mt-2 text-sm capitalize text-slate-500 dark:text-slate-400">
                                            {account.type} account
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest movements across your connected accounts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 p-6">
                            {recentTransactions.map((transaction) => {
                                const isCredit = transaction.type === "credit";

                                return (
                                    <Link key={transaction.id} href={`/app/transactions/${transaction.id}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50/40 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-emerald-900/40 dark:hover:bg-slate-900/80">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                                                isCredit
                                                    ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300"
                                                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                            }`}>
                                                {isCredit ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-slate-900 dark:text-white">
                                                    {transaction.description}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {formatRelative(transaction.date)}
                                                </p>
                                            </div>
                                        </div>
                                        <p className={`shrink-0 text-sm font-semibold ${isCredit ? "text-emerald-600 dark:text-emerald-300" : "text-slate-900 dark:text-white"}`}>
                                            {isCredit ? "+" : "-"}
                                            {formatCurrency(transaction.amount)}
                                        </p>
                                    </Link>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                        <CardTitle>Security Snapshot</CardTitle>
                        <CardDescription>Checks that matter right now</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Protected access</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        MFA and login alerts remain active for this session.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Portfolio spread</p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                                {accounts.length}
                            </p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Accounts connected across checking, savings, and business.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <Clock3 className="h-4 w-4 text-slate-500" />
                                <p className="text-sm font-medium">Timeline coverage</p>
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                                {transactions.length}
                            </p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Transactions available across multiple years of history.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
