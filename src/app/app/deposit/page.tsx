"use client";

import { useState } from "react";
import { 
    PlusCircle, 
    Camera, 
    Upload, 
    CheckCircle2,
    AlertCircle,
    FileText,
    CreditCard,
    Building2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DepositMethod = "check" | "cash" | "wire";

export default function DepositPage() {
    const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(null);
    const [checkFront, setCheckFront] = useState<File | null>(null);
    const [checkBack, setCheckBack] = useState<File | null>(null);
    const [amount, setAmount] = useState("");
    const [accountId, setAccountId] = useState("acc1");

    const depositMethods = [
        {
            id: "check" as DepositMethod,
            name: "Mobile Check Deposit",
            description: "Deposit checks by taking photos with your device",
            icon: Camera,
            color: "from-blue-500 to-cyan-500"
        },
        {
            id: "cash" as DepositMethod,
            name: "Cash Deposit",
            description: "Find nearby ATMs or branches for cash deposits",
            icon: CreditCard,
            color: "from-emerald-500 to-teal-500"
        },
        {
            id: "wire" as DepositMethod,
            name: "Wire Transfer",
            description: "Receive funds via wire transfer to your account",
            icon: Building2,
            color: "from-purple-500 to-pink-500"
        }
    ];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
        const file = e.target.files?.[0];
        if (file) {
            if (side === "front") setCheckFront(file);
            else setCheckBack(file);
        }
    };

    const Orb = ({ label }: { label: string }) => (
        <div className="relative h-44 w-44 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
            <div className="absolute inset-4 rounded-full border border-emerald-400/30 animate-ping [animation-delay:200ms]" />
            <div className="absolute inset-8 rounded-full border border-blue-400/30 animate-ping [animation-delay:400ms]" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_30px_14px_rgba(16,185,129,0.35)] animate-pulse" />
            </div>
            <p className="absolute -bottom-8 w-full text-center text-xs tracking-[0.24em] text-cyan-200 uppercase">{label}</p>
        </div>
    );

    if (selectedMethod === "cash") {
        return (
            <div className="relative min-h-[80vh] overflow-hidden rounded-2xl bg-slate-950 text-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.12),transparent_32%),radial-gradient(circle_at_50%_70%,rgba(59,130,246,0.12),transparent_28%)] blur-sm" />
                <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-xl" />

                <div className="relative p-6 lg:p-10 space-y-8">
                    <Button variant="ghost" onClick={() => setSelectedMethod(null)} className="gap-2 text-slate-200">
                        ← Back
                    </Button>

                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="text-center space-y-4">
                            <Orb label="Cash Deposit" />
                            <h1 className="text-3xl font-semibold text-cyan-200 tracking-tight">Deposit Cash Securely</h1>
                            <p className="text-slate-300 max-w-xl mx-auto">
                                Use any Vertex-enabled ATM or partner location to add funds instantly. We’ll guide you and keep your session secure.
                            </p>
                            <div className="flex justify-center gap-3">
                                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 border-0 shadow-lg shadow-cyan-500/20">
                                    Find Nearby ATM
                                </Button>
                                <Button variant="outline" className="border-cyan-300/40 text-cyan-100 hover:bg-white/5">
                                    Get Deposit Code
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white">Cash Steps</CardTitle>
                                    <CardDescription className="text-slate-400">What you’ll need at the kiosk</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-slate-200">
                                    <p>1. Bring your debit card or mobile wallet to authenticate.</p>
                                    <p>2. Insert cash; bills are counted instantly with on-screen confirmation.</p>
                                    <p>3. Funds are available immediately after the receipt appears.</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white">Limits & Availability</CardTitle>
                                    <CardDescription className="text-slate-400">Updated in real time</CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-slate-200 space-y-2">
                                    <p>• Daily cash deposit limit: $5,000</p>
                                    <p>• Instant availability up to $1,500; remainder clears within minutes.</p>
                                    <p>• 24/7 support if a bill is rejected.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedMethod === "wire") {
        return (
            <div className="relative min-h-[80vh] overflow-hidden rounded-2xl bg-slate-950 text-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_82%_26%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_52%_70%,rgba(14,165,233,0.14),transparent_30%)] blur-sm" />
                <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-xl" />

                <div className="relative p-6 lg:p-10 space-y-8">
                    <Button variant="ghost" onClick={() => setSelectedMethod(null)} className="gap-2 text-slate-200">
                        ← Back
                    </Button>

                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="text-center space-y-4">
                            <Orb label="Wire Transfer" />
                            <h1 className="text-3xl font-semibold text-cyan-200 tracking-tight">Receive a Wire</h1>
                            <p className="text-slate-300 max-w-xl mx-auto">
                                Share these credentials with the sending bank. We monitor every inbound wire for speed and security.
                            </p>
                            <div className="flex justify-center gap-3">
                                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 shadow-lg shadow-blue-500/25">
                                    Copy Instructions
                                </Button>
                                <Button variant="outline" className="border-cyan-300/40 text-cyan-100 hover:bg-white/5">
                                    Notify Support
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white">Receiving Details</CardTitle>
                                    <CardDescription className="text-slate-400">Domestic & International</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-3 text-sm text-slate-200">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Account Name</span>
                                        <span className="font-medium">Vertex Credit Union</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Account Number</span>
                                        <span className="font-medium">0987 6543 2100</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Routing (ABA)</span>
                                        <span className="font-medium">111000614</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">SWIFT / BIC</span>
                                        <span className="font-medium">VERXUS33</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Bank Address</span>
                                        <span className="font-medium text-right">200 Market St, Suite 500<br />San Francisco, CA 94105</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white">Posting Speeds</CardTitle>
                                    <CardDescription className="text-slate-400">Typical windows</CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-slate-200 space-y-2">
                                    <p>• Domestic wires: post within 1 hour of receipt window.</p>
                                    <p>• International wires: 2–6 business hours depending on intermediary banks.</p>
                                    <p>• Real-time status will appear in Transactions.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedMethod === "check") {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => setSelectedMethod(null)} className="gap-2">
                    ← Back
                </Button>

                <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                    <CardContent className="p-6 text-center">
                        <Camera className="h-12 w-12 mx-auto mb-3" />
                        <h2 className="text-2xl font-bold mb-2">Mobile Check Deposit</h2>
                        <p className="text-blue-100">Deposit checks instantly by taking photos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Select Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <select
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                        >
                            <option value="acc1">Primary Checking - ****4521</option>
                            <option value="acc2">High-Yield Savings - ****7832</option>
                        </select>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Check Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">$</span>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="text-xl h-12 pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Front of Check</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                {checkFront ? (
                                    <div className="text-center">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{checkFront.name}</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Upload or take photo</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => handleFileUpload(e, "front")}
                                    className="hidden"
                                />
                            </label>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Back of Check</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                {checkBack ? (
                                    <div className="text-center">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{checkBack.name}</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Upload or take photo</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => handleFileUpload(e, "back")}
                                    className="hidden"
                                />
                            </label>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">Tips for best results:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Endorse the back of the check</li>
                                    <li>Place check on a dark surface</li>
                                    <li>Ensure all corners are visible</li>
                                    <li>Avoid shadows and glare</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button 
                    disabled={!checkFront || !checkBack || !amount}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    Submit Deposit
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <PlusCircle className="h-6 w-6 text-emerald-600" />
                    Deposit Funds
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Choose how you'd like to deposit money into your account
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {depositMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className="text-left p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all group"
                        >
                            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white mb-4`}>
                                <Icon className="h-7 w-7" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600">
                                {method.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {method.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Deposits</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No recent deposits</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
