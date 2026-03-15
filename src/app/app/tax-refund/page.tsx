"use client";

import { useState } from "react";
import { FileText, Upload, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TaxRefundPage() {
    const [step, setStep] = useState<"info" | "form" | "success">("info");
    const [taxYear, setTaxYear] = useState("2024");
    const [refundAmount, setRefundAmount] = useState("");
    const [accountId, setAccountId] = useState("acc1");

    if (step === "success") {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="text-center">
                    <CardContent className="pt-12 pb-8">
                        <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Tax Refund Request Submitted!
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Your tax refund request has been submitted successfully. You'll receive your refund within 5-7 business days.
                        </p>
                        <Button onClick={() => setStep("info")}>
                            Back to Tax Refund
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === "form") {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => setStep("info")} className="gap-2">
                    ← Back
                </Button>

                <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                    <CardContent className="p-6 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-3" />
                        <h2 className="text-2xl font-bold mb-2">Tax Refund Application</h2>
                        <p className="text-emerald-100">Get your tax refund deposited directly to your account</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tax Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tax Year</Label>
                            <select
                                value={taxYear}
                                onChange={(e) => setTaxYear(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                            >
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Expected Refund Amount</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Deposit Account</Label>
                            <select
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                            >
                                <option value="acc1">Primary Checking - ****4521</option>
                                <option value="acc2">High-Yield Savings - ****7832</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Social Security Number</Label>
                                <Input type="text" placeholder="XXX-XX-XXXX" />
                            </div>
                            <div className="space-y-2">
                                <Label>Filing Status</Label>
                                <select className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950">
                                    <option>Single</option>
                                    <option>Married Filing Jointly</option>
                                    <option>Married Filing Separately</option>
                                    <option>Head of Household</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upload Tax Documents</CardTitle>
                        <CardDescription>Upload your W-2, 1099, or other tax forms</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
                            <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" multiple />
                        </label>
                    </CardContent>
                </Card>

                <Button 
                    onClick={() => setStep("success")}
                    disabled={!refundAmount}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                    Submit Tax Refund Request
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-6 w-6 text-emerald-600" />
                    Tax Refund
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Get your tax refund deposited directly to your account
                </p>
            </div>

            <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 text-sm mb-1">Average Refund Time</p>
                            <p className="text-3xl font-bold">5-7 Days</p>
                        </div>
                        <Clock className="h-12 w-12 text-emerald-100" />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                            <FileText className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast Processing</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get your refund in as little as 5 business days
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Direct Deposit</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Funds deposited directly to your account
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                            <CheckCircle2 className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Secure & Safe</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Bank-level security for your information
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Submit Your Information</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Provide your tax information and upload required documents
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">We Process Your Request</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Our team reviews and processes your tax refund request
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Receive Your Refund</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Get your refund deposited directly to your account
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button onClick={() => setStep("form")} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Start Tax Refund Application
            </Button>
        </div>
    );
}
