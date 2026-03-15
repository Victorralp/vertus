"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Send, 
    Clock, 
    DollarSign, 
    Users, 
    Shield,
    Eye,
    EyeOff,
    ArrowLeft,
    CheckCircle2,
    RefreshCw,
    Wallet
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Beneficiary {
    id: string;
    name: string;
    accountNumber: string;
    bankName: string;
}

export default function LocalTransferPage() {
    const router = useRouter();
    const [step, setStep] = useState<"form" | "preview" | "success">("form");
    const [showPin, setShowPin] = useState(false);
    const [saveBeneficiary, setSaveBeneficiary] = useState(false);
    
    const [formData, setFormData] = useState({
        fromAccount: "acc1",
        amount: "",
        accountHolderName: "",
        accountNumber: "",
        bankCode: "",
        description: "",
        pin: ""
    });

    const availableBalance = 224000.00;
    const quickAmounts = [100, 500, 1000];

    const handleQuickAmount = (amount: number) => {
        setFormData({ ...formData, amount: amount.toString() });
    };

    const handlePreview = () => {
        if (!formData.amount || !formData.accountHolderName || !formData.accountNumber || !formData.bankCode) {
            return;
        }
        setStep("preview");
    };

    const handleSubmit = () => {
        if (!formData.pin) return;
        // Simulate transfer
        setTimeout(() => {
            setStep("success");
        }, 1000);
    };

    if (step === "success") {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="text-center">
                    <CardContent className="pt-12 pb-8">
                        <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Transfer Successful!
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Your transfer of ${parseFloat(formData.amount).toLocaleString()} has been processed
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => router.push("/app/transactions")}>
                                View Transactions
                            </Button>
                            <Button onClick={() => {
                                setStep("form");
                                setFormData({
                                    fromAccount: "acc1",
                                    amount: "",
                                    accountHolderName: "",
                                    accountNumber: "",
                                    bankCode: "",
                                    description: "",
                                    pin: ""
                                });
                            }}>
                                Make Another Transfer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === "preview") {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => setStep("form")} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Form
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Review Transfer</CardTitle>
                        <CardDescription>Please review the details before confirming</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    ${parseFloat(formData.amount).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                                <span className="text-gray-500">Recipient</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formData.accountHolderName}
                                </span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                                <span className="text-gray-500">Account Number</span>
                                <span className="font-mono text-gray-900 dark:text-white">
                                    {formData.accountNumber}
                                </span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                                <span className="text-gray-500">Bank Code</span>
                                <span className="font-mono text-gray-900 dark:text-white">
                                    {formData.bankCode}
                                </span>
                            </div>
                            {formData.description && (
                                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                                    <span className="text-gray-500">Description</span>
                                    <span className="text-gray-900 dark:text-white">
                                        {formData.description}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pin">Transaction PIN</Label>
                            <div className="relative">
                                <Input
                                    id="pin"
                                    type={showPin ? "text" : "password"}
                                    placeholder="Enter your transaction PIN"
                                    value={formData.pin}
                                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                                    maxLength={4}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPin(!showPin)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">
                                This is your transaction PIN, not your login password
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button 
                                onClick={handleSubmit}
                                disabled={!formData.pin || formData.pin.length < 4}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                                Confirm Transfer
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => setSaveBeneficiary(!saveBeneficiary)}
                                className={saveBeneficiary ? "border-emerald-500 text-emerald-600" : ""}
                            >
                                {saveBeneficiary ? "Saving" : "Save"} Beneficiary
                            </Button>
                        </div>

                        <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <Shield className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            Bank-Level Security
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            All transfers are protected with 256-bit SSL encryption and processed through secure banking channels.
                                        </p>
                                        <div className="flex flex-wrap gap-3 text-xs text-emerald-700 dark:text-emerald-400">
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                SSL Encrypted
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Zero Data Storage
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                24/7 Monitoring
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Send className="h-6 w-6 text-blue-600" />
                    Local Transfer
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Send money to any local bank account securely and instantly
                </p>
            </div>

            {/* Info Card */}
            <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <Send className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Local Transfer</h3>
                                <p className="text-blue-100 text-sm">Send money instantly</p>
                            </div>
                        </div>
                        <Shield className="h-5 w-5 text-blue-100" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <div>
                                <p className="text-xs text-blue-100">Time</p>
                                <p className="font-medium">Instant</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <div>
                                <p className="text-xs text-blue-100">Fee</p>
                                <p className="font-medium">Free</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <div>
                                <p className="text-xs text-blue-100">Banks</p>
                                <p className="font-medium">All Local</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transfer Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Available Balance */}
                    <Card className="bg-gray-900 dark:bg-gray-950 text-white border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Account Balance</p>
                                    <p className="text-sm text-gray-400">USD Currency</p>
                                </div>
                                <Wallet className="h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-3xl font-bold mt-3">${availableBalance.toLocaleString()}</p>
                            <p className="text-emerald-400 text-sm mt-2 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Available for transfer
                            </p>
                        </CardContent>
                    </Card>

                    {/* Transfer Amount */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-blue-600" />
                                Transfer Amount
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">$</span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="text-2xl h-14 pl-10"
                                />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Quick amounts:</p>
                                <div className="flex gap-2">
                                    {quickAmounts.map((amount) => (
                                        <Button
                                            key={amount}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleQuickAmount(amount)}
                                            className="flex-1"
                                        >
                                            ${amount}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFormData({ ...formData, amount: availableBalance.toString() })}
                                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200"
                                    >
                                        All
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Beneficiary Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                Beneficiary Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                                <Input
                                    id="accountHolderName"
                                    placeholder="Enter recipient's full name"
                                    value={formData.accountHolderName}
                                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="accountNumber">Account Number</Label>
                                    <Input
                                        id="accountNumber"
                                        placeholder="9-digit number"
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500">9-digit number found on your checks</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bankCode">Bank Code</Label>
                                    <Input
                                        id="bankCode"
                                        placeholder="8-11 character code"
                                        value={formData.bankCode}
                                        onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
                                    />
                                    <p className="text-xs text-gray-500">8-11 character bank identifier code</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="description">Description/Memo</Label>
                                <Input
                                    id="description"
                                    placeholder="Enter transaction description or purpose of payment (optional)"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button 
                                    onClick={handlePreview}
                                    disabled={!formData.amount || !formData.accountHolderName || !formData.accountNumber || !formData.bankCode}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview Transfer
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => router.push("/app/dashboard")}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Notice */}
                    <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                        <CardContent className="p-4">
                            <div className="flex gap-3">
                                <Shield className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        Bank-Level Security
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        All transfers are protected with 256-bit SSL encryption and processed through secure banking channels. 
                                        Your financial information is never stored on our servers and all transactions are monitored for fraud protection.
                                    </p>
                                    <div className="flex flex-wrap gap-3 text-xs text-emerald-700 dark:text-emerald-400">
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            SSL Encrypted
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Zero Data Storage
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            24/7 Monitoring
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Transfer Sidebar */}
                <div className="space-y-6">
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
                                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                                    <Users className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                    No saved beneficiaries yet
                                </p>
                                <p className="text-xs text-gray-500">
                                    Add one to get started
                                </p>
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
