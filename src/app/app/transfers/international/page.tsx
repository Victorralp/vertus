"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Globe, 
    ArrowLeft,
    CreditCard,
    Landmark,
    Bitcoin,
    DollarSign,
    Shield,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    Eye,
    EyeOff,
    Users,
    RefreshCw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TransferMethod = 
    | "wire" 
    | "crypto" 
    | "paypal" 
    | "wise" 
    | "cashapp" 
    | "skrill" 
    | "venmo" 
    | "zelle" 
    | "revolut" 
    | "alipay" 
    | "wechat";

type TransferStep = "select" | "wire-form" | "crypto-form" | "preview" | "success" | "idle-timeout";

const transferMethods = [
    {
        id: "wire" as TransferMethod,
        name: "Wire Transfer",
        description: "Transfer funds directly to international bank accounts.",
        icon: Landmark,
        color: "blue",
        featured: true,
        href: "/app/transfers/international/wire",
    },
    {
        id: "crypto" as TransferMethod,
        name: "Cryptocurrency",
        description: "Send funds to your cryptocurrency wallet.",
        icon: Bitcoin,
        color: "orange",
        featured: true,
        href: "/app/transfers/international/crypto",
    },
    {
        id: "paypal" as TransferMethod,
        name: "PayPal",
        description: "Transfer funds to your PayPal account.",
        icon: CreditCard,
        color: "purple",
        featured: true,
        href: "/app/transfers/international/paypal",
    },
    {
        id: "wise" as TransferMethod,
        name: "Wise Transfer",
        description: "Transfer with lower fees using Wise.",
        icon: Globe,
        color: "green",
        featured: true,
        href: "/app/transfers/international/wise",
    },
    {
        id: "cashapp" as TransferMethod,
        name: "Cash App",
        description: "Quick transfers to your Cash App account.",
        icon: DollarSign,
        color: "pink",
        featured: true,
        href: "/app/transfers/international/cashapp",
    },
];

const additionalMethods = [
    { id: "skrill" as TransferMethod, name: "Skrill", description: "Transfer funds to your Skrill account.", icon: CreditCard, href: "/app/transfers/international/skrill" },
    { id: "venmo" as TransferMethod, name: "Venmo", description: "Send funds to your Venmo account.", icon: CreditCard, href: "/app/transfers/international/venmo" },
    { id: "zelle" as TransferMethod, name: "Zelle", description: "Quick transfers to your Zelle account.", icon: CreditCard, href: "/app/transfers/international/zelle" },
    { id: "revolut" as TransferMethod, name: "Revolut", description: "Transfer to your account with low fees.", icon: CreditCard, href: "/app/transfers/international/revolut" },
    { id: "alipay" as TransferMethod, name: "Alipay", description: "Send funds to your Alipay account.", icon: CreditCard, href: "/app/transfers/international/alipay" },
    { id: "wechat" as TransferMethod, name: "WeChat Pay", description: "Transfer to your WeChat Pay wallet.", icon: CreditCard, href: "/app/transfers/international/wechat" },
];

export default function InternationalTransferPage() {
    const router = useRouter();
    const [step, setStep] = useState<TransferStep>("select");
    const [showAdditional, setShowAdditional] = useState(false);
    const [showPin, setShowPin] = useState(false);

    // Prefetch all method pages so navigation feels instant.
    useEffect(() => {
        [...transferMethods, ...additionalMethods].forEach((method) => {
            if (method.href) {
                router.prefetch(method.href);
            }
        });
    }, [router]);
    
    const availableBalance = 224000.00;

    const [wireForm, setWireForm] = useState({
        amount: "",
        beneficiaryName: "",
        accountNumber: "",
        bankName: "",
        bankAddress: "",
        accountType: "online-banking",
        country: "Afghanistan",
        iban: "",
        swift: "",
        pin: "",
        note: ""
    });

    const [cryptoForm, setCryptoForm] = useState({
        amount: "",
        cryptocurrency: "BTC",
        network: "native",
        walletAddress: "",
        pin: "",
        note: ""
    });

    const quickAmounts = [100, 500, 1000];
    const cryptoQuickAmounts = [0.001, 0.01, 0.1];

    const handleMethodSelect = (method: TransferMethod) => {
        if (method === "wire") {
            setStep("wire-form");
            return;
        }
        if (method === "crypto") {
            setStep("crypto-form");
            return;
        }
        router.push(`/app/transfers/international/${method}`);
    };

    const handleWireSubmit = () => {
        if (!wireForm.pin) return;
        setStep("idle-timeout");
    };

    const handleCryptoSubmit = () => {
        if (!cryptoForm.pin) return;
        setStep("idle-timeout");
    };

    if (step === "idle-timeout") {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="text-center">
                    <CardContent className="pt-12 pb-10 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                            <AlertCircle className="h-8 w-8 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Session idle too long</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                            For your security we paused this transfer. Please contact Customer Service to continue.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button asChild>
                                <a href="mailto:support@vertexcu.com">Contact Customer Service</a>
                            </Button>
                            <Button variant="outline" onClick={() => setStep("select")}>
                                Start Over
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === "success") {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="text-center">
                    <CardContent className="pt-12 pb-8">
                        <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Transfer Initiated!
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Your international transfer is being processed
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => router.push("/app/transactions")}>
                                View Transactions
                            </Button>
                            <Button onClick={() => setStep("select")}>
                                Make Another Transfer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === "wire-form") {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => setStep("select")} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                    <CardContent className="p-6 text-center">
                        <Landmark className="h-12 w-12 mx-auto mb-3" />
                        <h2 className="text-2xl font-bold mb-2">International Wire Transfer</h2>
                        <p className="text-blue-100">Withdrawals are typically processed within 1-3 hours.</p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-blue-900 dark:bg-blue-950 text-white border-blue-800">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-blue-300 text-sm mb-1">Account Balance</p>
                                        <p className="text-sm text-blue-300">USD Currency</p>
                                    </div>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                </div>
                                <p className="text-3xl font-bold">${availableBalance.toLocaleString()}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Amount to Transfer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">$</span>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={wireForm.amount}
                                        onChange={(e) => setWireForm({ ...wireForm, amount: e.target.value })}
                                        className="text-2xl h-14 pl-10"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {quickAmounts.map((amount) => (
                                        <Button
                                            key={amount}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setWireForm({ ...wireForm, amount: amount.toString() })}
                                            className="flex-1"
                                        >
                                            ${amount}
                                        </Button>
                                    ))}
                                    <Button variant="outline" size="sm" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                                        Max
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Beneficiary Account Name</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Enter beneficiary's full name"
                                        value={wireForm.beneficiaryName}
                                        onChange={(e) => setWireForm({ ...wireForm, beneficiaryName: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Beneficiary Account Number</Label>
                                        <Input
                                            placeholder="Enter account number"
                                            value={wireForm.accountNumber}
                                            onChange={(e) => setWireForm({ ...wireForm, accountNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bank Name</Label>
                                        <Input
                                            placeholder="Enter bank name"
                                            value={wireForm.bankName}
                                            onChange={(e) => setWireForm({ ...wireForm, bankName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Bank Address</Label>
                                    <Input
                                        placeholder="Enter bank address"
                                        value={wireForm.bankAddress}
                                        onChange={(e) => setWireForm({ ...wireForm, bankAddress: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Account Type</Label>
                                        <select
                                            value={wireForm.accountType}
                                            onChange={(e) => setWireForm({ ...wireForm, accountType: e.target.value })}
                                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                                        >
                                            <option value="online-banking">Online Banking</option>
                                            <option value="savings">Savings</option>
                                            <option value="checking">Checking</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Country</Label>
                                        <select
                                            value={wireForm.country}
                                            onChange={(e) => setWireForm({ ...wireForm, country: e.target.value })}
                                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                                        >
                                            <option value="Afghanistan">Afghanistan</option>
                                            <option value="USA">United States</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="Canada">Canada</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>IBAN Number</Label>
                                        <Input
                                            placeholder="Enter IBAN number"
                                            value={wireForm.iban}
                                            onChange={(e) => setWireForm({ ...wireForm, iban: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-500">International Bank Account Number</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SWIFT Code</Label>
                                        <Input
                                            placeholder="Enter SWIFT/BIC code"
                                            value={wireForm.swift}
                                            onChange={(e) => setWireForm({ ...wireForm, swift: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-500">8-11 character bank identifier code</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Transaction PIN</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPin ? "text" : "password"}
                                            placeholder="Enter your 4-10 digit PIN"
                                            value={wireForm.pin}
                                            onChange={(e) => setWireForm({ ...wireForm, pin: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPin(!showPin)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">This is your transaction PIN, not your login password</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Note (Optional)</Label>
                                    <Input
                                        placeholder="Optional payment description or note"
                                        value={wireForm.note}
                                        onChange={(e) => setWireForm({ ...wireForm, note: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button 
                                        onClick={handleWireSubmit}
                                        disabled={!wireForm.amount || !wireForm.beneficiaryName || !wireForm.pin}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    >
                                        Continue to Transfer
                                    </Button>
                                    <Button variant="outline">
                                        Save Beneficiary
                                    </Button>
                                    <Button variant="outline" onClick={() => router.push("/app/dashboard")}>
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Transaction</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            All transfers are encrypted and processed securely. Never share your PIN with anyone.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Quick Transfer</CardTitle>
                                <Button variant="ghost" size="sm" className="text-blue-600">
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Refresh
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        No saved beneficiaries yet
                                    </p>
                                    <p className="text-xs text-gray-500">Add one to get started</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (step === "crypto-form") {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => setStep("select")} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0">
                    <CardContent className="p-6 text-center">
                        <Bitcoin className="h-12 w-12 mx-auto mb-3" />
                        <h2 className="text-2xl font-bold mb-2">Cryptocurrency Withdrawal</h2>
                        <p className="text-orange-100">Withdrawals are typically processed within 1-3 hours.</p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-gray-900 dark:bg-gray-950 text-white border-0">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Bitcoin Balance</p>
                                        <p className="text-sm text-gray-400">≈ $0.00</p>
                                    </div>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                </div>
                                <p className="text-3xl font-bold">0.00000000 BTC</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Amount to Transfer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder="0.00000000"
                                        value={cryptoForm.amount}
                                        onChange={(e) => setCryptoForm({ ...cryptoForm, amount: e.target.value })}
                                        className="text-2xl h-14 pr-16"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                        BTC
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {cryptoQuickAmounts.map((amount) => (
                                        <Button
                                            key={amount}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCryptoForm({ ...cryptoForm, amount: amount.toString() })}
                                            className="flex-1"
                                        >
                                            {amount} BTC
                                        </Button>
                                    ))}
                                    <Button variant="outline" size="sm" className="bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                                        Max.
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <Bitcoin className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Native</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Select your preferred cryptocurrency and network
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Cryptocurrency</Label>
                                        <select
                                            value={cryptoForm.cryptocurrency}
                                            onChange={(e) => setCryptoForm({ ...cryptoForm, cryptocurrency: e.target.value })}
                                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                                        >
                                            <option value="BTC">Bitcoin (BTC)</option>
                                            <option value="ETH">Ethereum (ETH)</option>
                                            <option value="USDT">Tether (USDT)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Network</Label>
                                        <select
                                            value={cryptoForm.network}
                                            onChange={(e) => setCryptoForm({ ...cryptoForm, network: e.target.value })}
                                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                                        >
                                            <option value="native">Native</option>
                                            <option value="erc20">ERC-20</option>
                                            <option value="bep20">BEP-20</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Wallet Address</Label>
                                    <Input
                                        placeholder="Enter wallet address"
                                        value={cryptoForm.walletAddress}
                                        onChange={(e) => setCryptoForm({ ...cryptoForm, walletAddress: e.target.value })}
                                    />
                                </div>
                                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                                    <CardContent className="p-3">
                                        <div className="flex gap-2">
                                            <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                                Double-check your wallet address. Transactions to incorrect addresses cannot be reversed.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Transaction PIN</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPin ? "text" : "password"}
                                            placeholder="Enter your 4-10 digit PIN"
                                            value={cryptoForm.pin}
                                            onChange={(e) => setCryptoForm({ ...cryptoForm, pin: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPin(!showPin)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">This is your transaction PIN, not your login password</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Note (Optional)</Label>
                                    <Input
                                        placeholder="Optional payment description or note"
                                        value={cryptoForm.note}
                                        onChange={(e) => setCryptoForm({ ...cryptoForm, note: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button 
                                        onClick={handleCryptoSubmit}
                                        disabled={!cryptoForm.amount || !cryptoForm.walletAddress || !cryptoForm.pin}
                                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                                    >
                                        Continue to Transfer
                                    </Button>
                                    <Button variant="outline">
                                        Save Beneficiary
                                    </Button>
                                    <Button variant="outline" onClick={() => router.push("/app/dashboard")}>
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Transaction</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            All transfers are encrypted and processed securely. Never share your PIN with anyone.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Quick Transfer</CardTitle>
                                <Button variant="ghost" size="sm" className="text-orange-600">
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Refresh
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        No saved beneficiaries yet
                                    </p>
                                    <p className="text-xs text-gray-500">Add one to get started</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Globe className="h-6 w-6 text-blue-600" />
                    International Transfer
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Send money worldwide with multiple payment methods
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Select Transfer Method</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {transferMethods.map((method) => {
                            const Icon = method.icon;
                            const colorClasses = {
                                blue: "from-blue-500 to-cyan-500",
                                orange: "from-orange-500 to-yellow-500",
                                purple: "from-purple-500 to-pink-500",
                                green: "from-green-500 to-emerald-500",
                                pink: "from-pink-500 to-rose-500"
                            };
                            
                            return (
                                <button
                                    key={method.id}
                                    onClick={() => handleMethodSelect(method.id)}
                                    className="text-left p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
                                >
                                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colorClasses[method.color as keyof typeof colorClasses]} flex items-center justify-center text-white mb-3`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600">
                                        {method.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {method.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {!showAdditional && (
                        <Button
                            variant="ghost"
                            onClick={() => setShowAdditional(true)}
                            className="w-full mt-4 text-blue-600"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                            Additional Transfer Methods
                        </Button>
                    )}

                    {showAdditional && (
                        <>
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Additional Transfer Methods</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {additionalMethods.map((method) => {
                                        const Icon = method.icon;
                                        return (
                                            <button
                                                key={method.id}
                                                onClick={() => handleMethodSelect(method.id)}
                                                className="text-left p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
                                            >
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 mb-3">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-blue-600">
                                                    {method.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {method.description}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-4">
                            <div className="flex gap-3">
                                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Transaction</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        All transfers are encrypted and processed securely. Never share your PIN with anyone.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Quick Transfer</CardTitle>
                            <Button variant="ghost" size="sm" className="text-blue-600">
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                    No saved beneficiaries yet
                                </p>
                                <p className="text-xs text-gray-500">Add one to get started</p>
                                <Button variant="outline" size="sm" className="mt-4">
                                    <Users className="h-4 w-4 mr-1" />
                                    Add New
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
