"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    Download,
    Filter,
    Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockTransactions, type Transaction } from "./data";

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

export default function TransactionsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] =
        useState<TransactionTypeFilter>("all");
    const [selectedStatus, setSelectedStatus] =
        useState<TransactionStatusFilter>("all");
    const transactions = mockTransactions;

    const formatCurrency = (amount: number, currency: string) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        }).format(amount);

    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const formatTime = (date: Date) =>
        date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

    const formatDateParts = (date: Date) => ({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        day: date.getDate(),
        year: date.getFullYear(),
        time: date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }),
    });

    const filteredTransactions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return transactions.filter((tx) => {
            const matchesQuery =
                query.length === 0 ||
                tx.reference.toLowerCase().includes(query) ||
                tx.description.toLowerCase().includes(query) ||
                tx.category.toLowerCase().includes(query);

            const matchesType =
                selectedType === "all" || tx.type === selectedType;
            const matchesStatus =
                selectedStatus === "all" || tx.status === selectedStatus;

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

        const pendingCount = filteredTransactions.filter(
            (tx) => tx.status === "pending"
        ).length;

        const failedCount = filteredTransactions.filter(
            (tx) => tx.status === "failed"
        ).length;

        return {
            credits,
            debits,
            pendingCount,
            failedCount,
        };
    }, [filteredTransactions]);

    const getStatusBadge = (status: Transaction["status"]) => {
        if (status === "processed") {
            return (
                <Badge
                    variant="success"
                    className="min-w-[6.9rem] justify-center gap-1.5 whitespace-nowrap border-transparent bg-emerald-500/10 px-3 py-1.5 text-[13px] text-emerald-300"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    Processed
                </Badge>
            );
        }

        if (status === "pending") {
            return (
                <Badge
                    variant="warning"
                    className="min-w-[6.9rem] justify-center gap-1.5 whitespace-nowrap border-transparent bg-amber-500/10 px-3 py-1.5 text-[13px] text-amber-300"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    Pending
                </Badge>
            );
        }

        return (
            <Badge className="min-w-[6.9rem] justify-center gap-1.5 whitespace-nowrap border-transparent bg-red-500/10 px-3 py-1.5 text-[13px] text-red-300">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Failed
            </Badge>
        );
    };

    const getTypeBadge = (type: Transaction["type"]) => {
        const isCredit = type === "credit";

        return (
            <Badge
                className={`min-w-[7.3rem] justify-center gap-1.5 whitespace-nowrap border-transparent px-3 py-1.5 text-[13px] ${
                    isCredit
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-rose-500/10 text-rose-300"
                }`}
            >
                {isCredit ? (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                ) : (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                )}
                {isCredit ? "Money in" : "Money out"}
            </Badge>
        );
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Transactions
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Review account activity, settlement status, and receipt records.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Mar 4 - Mar 12
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-[#0b1324] px-4 py-3.5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                        Money In
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                        {formatCurrency(totals.credits, "USD")}
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#0b1324] px-4 py-3.5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                        Money Out
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                        {formatCurrency(totals.debits, "USD")}
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#0b1324] px-4 py-3.5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                        Pending / Failed
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                        {totals.pendingCount + totals.failedCount}
                    </p>
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
                                    variant={
                                        selectedType === filter.value
                                            ? "default"
                                            : "outline"
                                    }
                                    className={`rounded-full ${
                                        selectedType !== filter.value
                                            ? "border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                                            : ""
                                    }`}
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
                                variant={
                                    selectedStatus === filter.value
                                        ? "secondary"
                                        : "ghost"
                                }
                                className={`rounded-full ${
                                    selectedStatus !== filter.value
                                        ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                                        : "bg-slate-800 text-white hover:bg-slate-700"
                                }`}
                                onClick={() => setSelectedStatus(filter.value)}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {filteredTransactions.length === 0 ? (
                        <div className="m-6 rounded-2xl border border-dashed border-slate-700 p-10 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                                <Search className="h-6 w-6" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-white">
                                No transactions match your filters
                            </h3>
                            <p className="mt-2 text-sm text-slate-400">
                                Try a broader search term or reset the type and
                                status filters.
                            </p>
                            <div className="mt-5 flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedType("all");
                                        setSelectedStatus("all");
                                    }}
                                >
                                    Reset filters
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="hidden lg:block">
                                <div className="overflow-x-auto">
                                    <table className="w-full table-fixed">
                                        <colgroup>
                                            <col className="w-[35%]" />
                                            <col className="w-[14%]" />
                                            <col className="w-[14%]" />
                                            <col className="w-[16%]" />
                                            <col className="w-[11%]" />
                                            <col className="w-[10%]" />
                                        </colgroup>
                                        <thead className="bg-[#111a2b]">
                                            <tr className="border-b border-slate-800">
                                                <th className="px-7 py-4 text-left text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                                    Transaction
                                                </th>
                                                <th className="px-7 py-4 text-center text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                                    Type
                                                </th>
                                                <th className="px-7 py-4 text-center text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                                    Status
                                                </th>
                                                <th className="px-7 py-4 text-center text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                                    Reference
                                                </th>
                                                <th className="px-7 py-4 text-left text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                                    Date
                                                </th>
                                                <th className="px-7 py-4 text-right text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/90">
                                            {filteredTransactions.map((tx) => {
                                                const dateParts = formatDateParts(tx.date);

                                                return (
                                                <tr
                                                    key={tx.id}
                                                    className="border-b border-slate-800/90 bg-[#050b18] transition-colors hover:bg-[#0a1222]"
                                                >
                                                    <td className="px-6 py-5 align-top xl:px-7">
                                                        <div className="flex items-start gap-3">
                                                            <div
                                                                className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                                                                    tx.type === "credit"
                                                                        ? "bg-emerald-500/14 text-emerald-400"
                                                                        : "bg-rose-500/14 text-rose-400"
                                                                }`}
                                                            >
                                                                {tx.type === "credit" ? (
                                                                    <ArrowDownRight className="h-4 w-4" />
                                                                ) : (
                                                                    <ArrowUpRight className="h-4 w-4" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-[1.55rem] font-semibold leading-none text-white xl:text-[1.7rem]">
                                                                    {formatCurrency(tx.amount, tx.currency)}
                                                                </p>
                                                                <p className="mt-2 max-w-[15rem] text-sm leading-6 text-slate-300 xl:max-w-[17rem]">
                                                                    {tx.description}
                                                                </p>
                                                                <p className="mt-2 text-xs uppercase tracking-[0.28em] text-slate-500">
                                                                    {tx.category}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 align-middle text-center xl:px-7">
                                                        <div className="flex w-full justify-center">
                                                            {getTypeBadge(tx.type)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 align-middle text-center xl:px-7">
                                                        <div className="flex w-full justify-center">
                                                            {getStatusBadge(tx.status)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 align-middle text-center xl:px-7">
                                                        <div className="flex w-full justify-center">
                                                            <code className="inline-flex min-w-[8.5rem] max-w-[8.5rem] justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded-xl bg-slate-800 px-3 py-2.5 text-xs text-slate-300">
                                                                {tx.reference}
                                                            </code>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 align-top xl:px-7">
                                                        <div className="w-[4.5rem]">
                                                            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                                                                {dateParts.month}
                                                            </p>
                                                            <p className="mt-2 text-[2.15rem] font-bold leading-[0.92] text-white">
                                                                {dateParts.day}
                                                            </p>
                                                            <p className="mt-1 text-[1.35rem] font-semibold leading-none text-white">
                                                                {dateParts.year}
                                                            </p>
                                                            <p className="mt-3 text-xs leading-5 text-slate-400">
                                                                {dateParts.time}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right align-top xl:px-7">
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-2 rounded-xl border-slate-500 bg-transparent px-3 text-blue-400 hover:bg-slate-900 hover:text-blue-300"
                                                        >
                                                            <Link href={`/app/transactions/${tx.id}`}>
                                                                Receipt
                                                            </Link>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )})}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="space-y-3 lg:hidden">
                                {filteredTransactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="rounded-2xl border border-slate-800 bg-[#050b18] p-4 text-white"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                                                        tx.type === "credit"
                                                            ? "bg-emerald-500/14 text-emerald-400"
                                                            : "bg-rose-500/14 text-rose-400"
                                                    }`}
                                                >
                                                    {tx.type === "credit" ? (
                                                        <ArrowDownRight className="h-5 w-5" />
                                                    ) : (
                                                        <ArrowUpRight className="h-5 w-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">
                                                        {formatCurrency(tx.amount, tx.currency)}
                                                    </p>
                                                    <p className="mt-1 text-sm text-slate-300">
                                                        {tx.description}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(tx.status)}
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {getTypeBadge(tx.type)}
                                            <Badge variant="outline">
                                                {tx.category}
                                            </Badge>
                                        </div>

                                        <div className="mt-4 grid gap-3 rounded-xl bg-[#0b1324] p-3 text-sm">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-slate-400">
                                                    Reference
                                                </span>
                                                <code className="text-xs text-slate-300">
                                                    {tx.reference}
                                                </code>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-slate-400">
                                                    Date
                                                </span>
                                                <span className="font-medium text-white">
                                                    {formatDate(tx.date)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-slate-400">
                                                    Time
                                                </span>
                                                <span className="font-medium text-white">
                                                    {formatTime(tx.date)}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            asChild
                                            variant="outline"
                                            className="mt-4 w-full gap-2 rounded-xl border-slate-500 bg-transparent text-blue-400 hover:bg-slate-900 hover:text-blue-300"
                                        >
                                            <Link href={`/app/transactions/${tx.id}`}>
                                                Receipt
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex flex-col gap-3 border-t border-slate-800 px-6 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                                <p>
                                    Showing{" "}
                                    <span className="font-semibold text-white">
                                        {filteredTransactions.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-white">
                                        {transactions.length}
                                    </span>{" "}
                                    transactions
                                </p>
                                <span>Compact ledger view</span>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 dark:border-slate-800 dark:bg-[#0b1324] dark:text-slate-400">
                Largest credit:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                        Math.max(
                            ...filteredTransactions.map((tx) =>
                                tx.type === "credit" ? tx.amount : 0
                            ),
                            0
                        ),
                        "USD"
                    )}
                </span>
                {" · "}
                Largest debit:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                        Math.max(
                            ...filteredTransactions.map((tx) =>
                                tx.type === "debit" ? tx.amount : 0
                            ),
                            0
                        ),
                        "USD"
                    )}
                </span>
                {" · "}
                Net movement:{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(totals.credits - totals.debits, "USD")}
                </span>
            </div>
        </div>
    );
}
