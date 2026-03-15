"use client";

import { useState } from "react";
import {
    ArrowRightLeft,
    BadgeDollarSign,
    CheckCircle2,
    Clock3,
    Globe2,
    Info,
    RefreshCw,
    ShieldCheck,
    TrendingUp,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const currencies = [
    { code: "USD", name: "US Dollar", rate: 1.0 },
    { code: "EUR", name: "Euro", rate: 0.92 },
    { code: "GBP", name: "British Pound", rate: 0.79 },
    { code: "JPY", name: "Japanese Yen", rate: 149.5 },
    { code: "CAD", name: "Canadian Dollar", rate: 1.36 },
    { code: "AUD", name: "Australian Dollar", rate: 1.52 },
] as const;

const quickPairs = [
    { from: "USD", to: "EUR" },
    { from: "USD", to: "GBP" },
    { from: "EUR", to: "GBP" },
    { from: "USD", to: "JPY" },
] as const;

const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(amount);

export default function CurrencySwapPage() {
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    const [fromAmount, setFromAmount] = useState("2500");

    const parsedAmount = Number.parseFloat(fromAmount);
    const safeAmount = Number.isFinite(parsedAmount) ? parsedAmount : 0;

    const fromRate = currencies.find((currency) => currency.code === fromCurrency)?.rate ?? 1;
    const toRate = currencies.find((currency) => currency.code === toCurrency)?.rate ?? 1;
    const exchangeRate = toRate / fromRate;
    const convertedAmount = safeAmount > 0 ? safeAmount * exchangeRate : 0;
    const fee = 0;
    const recipientGets = Math.max(convertedAmount - fee, 0);
    const rateChange = exchangeRate >= 1 ? "+0.42%" : "+0.18%";

    const handleAmountChange = (value: string) => {
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setFromAmount(value);
        }
    };

    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const handlePairSelect = (from: string, to: string) => {
        setFromCurrency(from);
        setToCurrency(to);
    };

    const sameCurrency = fromCurrency === toCurrency;

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
                        <RefreshCw className="h-7 w-7 text-blue-600" />
                        Currency Swap
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Convert funds with a clearer quote, live pair selection, and a cleaner review flow.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-900/20">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">
                            Market rate
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                            1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-900/20">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-300">
                            Movement
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                            {rateChange}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem] 2xl:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)]">
                <Card className="overflow-hidden">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                        <CardTitle>Swap quote</CardTitle>
                        <CardDescription>
                            Choose currencies, enter the source amount, and review the rate before confirming.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] 2xl:items-end">
                            <div className="min-w-0 space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    You send
                                </label>
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <select
                                            value={fromCurrency}
                                            onChange={(e) => setFromCurrency(e.target.value)}
                                            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white sm:max-w-[15rem]"
                                        >
                                            {currencies.map((currency) => (
                                                <option key={currency.code} value={currency.code}>
                                                    {currency.code} · {currency.name}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="text-xs uppercase tracking-[0.22em] text-gray-400">
                                            Source
                                        </span>
                                    </div>
                                    <Input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        value={fromAmount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        className="mt-4 h-14 border-0 bg-transparent px-0 text-3xl font-semibold shadow-none focus-visible:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center 2xl:pb-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleSwapCurrencies}
                                    className="h-12 w-12 rounded-full"
                                >
                                    <ArrowRightLeft className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="min-w-0 space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Recipient gets
                                </label>
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <select
                                            value={toCurrency}
                                            onChange={(e) => setToCurrency(e.target.value)}
                                            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white sm:max-w-[15rem]"
                                        >
                                            {currencies.map((currency) => (
                                                <option key={currency.code} value={currency.code}>
                                                    {currency.code} · {currency.name}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="text-xs uppercase tracking-[0.22em] text-gray-400">
                                            Target
                                        </span>
                                    </div>
                                    <div className="mt-4 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-0 text-3xl font-semibold leading-[56px] text-gray-900 dark:text-white">
                                        {recipientGets > 0
                                            ? formatCurrency(recipientGets, toCurrency)
                                            : formatCurrency(0, toCurrency)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <BadgeDollarSign className="h-4 w-4" />
                                    Exchange rate
                                </div>
                                <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                                    1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Clock3 className="h-4 w-4" />
                                    Processing time
                                </div>
                                <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                                    Instant to 2 minutes
                                </p>
                            </div>
                            <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <ShieldCheck className="h-4 w-4" />
                                    Fee
                                </div>
                                <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(fee, fromCurrency)}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
                            <div className="flex gap-3">
                                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Quote summary
                                    </p>
                                    <p className="mt-1">
                                        You are converting {formatCurrency(safeAmount || 0, fromCurrency)} into{" "}
                                        {formatCurrency(recipientGets, toCurrency)} at the current indicative rate.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            disabled={sameCurrency || safeAmount <= 0}
                            className="h-12 w-full bg-blue-600 text-base font-semibold hover:bg-blue-700"
                        >
                            {sameCurrency ? "Choose two different currencies" : "Review swap"}
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Popular pairs</CardTitle>
                            <CardDescription>
                                Tap a pair to populate the quote instantly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            {quickPairs.map((pair) => {
                                const pairRate =
                                    (currencies.find((item) => item.code === pair.to)?.rate ?? 1) /
                                    (currencies.find((item) => item.code === pair.from)?.rate ?? 1);

                                return (
                                    <button
                                        key={`${pair.from}-${pair.to}`}
                                        type="button"
                                        onClick={() => handlePairSelect(pair.from, pair.to)}
                                        className="flex items-center justify-between rounded-2xl border border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-800 dark:hover:bg-blue-900/10"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {pair.from} to {pair.to}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                1 {pair.from} = {pairRate.toFixed(4)} {pair.to}
                                            </p>
                                        </div>
                                        <Globe2 className="h-5 w-5 text-blue-600" />
                                    </button>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Why use swap</CardTitle>
                            <CardDescription>
                                A cleaner operational summary for treasury and personal use.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            Transparent pricing
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Review the rate and fees before you confirm the exchange.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            Quick settlement
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Most supported pairs complete almost immediately after review.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            Account-safe workflow
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Swap review, confirmation, and settlement stay inside the secured app flow.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
