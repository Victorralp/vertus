"use client";

import { useState } from "react";
import { Landmark, TrendingDown, Calculator, CheckCircle2, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loanTypes = [
    {
        id: "personal",
        name: "Personal Loan",
        description: "Flexible loans for any purpose",
        rate: "5.99%",
        maxAmount: "$50,000",
        term: "1-7 years",
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: "home",
        name: "Home Loan",
        description: "Competitive mortgage rates",
        rate: "3.25%",
        maxAmount: "$1,000,000",
        term: "15-30 years",
        color: "from-emerald-500 to-teal-500"
    },
    {
        id: "auto",
        name: "Auto Loan",
        description: "Finance your dream car",
        rate: "4.49%",
        maxAmount: "$100,000",
        term: "2-7 years",
        color: "from-purple-500 to-pink-500"
    },
    {
        id: "business",
        name: "Business Loan",
        description: "Grow your business",
        rate: "6.99%",
        maxAmount: "$500,000",
        term: "1-10 years",
        color: "from-orange-500 to-red-500"
    }
];

export default function LoansPage() {
    const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
    const [loanAmount, setLoanAmount] = useState("");
    const [loanTerm, setLoanTerm] = useState("5");
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    const calculatePayment = () => {
        if (!loanAmount || !loanTerm) return;
        const principal = parseFloat(loanAmount);
        const rate = 0.0599 / 12; // 5.99% annual rate
        const payments = parseInt(loanTerm) * 12;
        const payment = (principal * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
        setMonthlyPayment(payment);
    };

    if (selectedLoan) {
        const loan = loanTypes.find(l => l.id === selectedLoan);
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => setSelectedLoan(null)} className="gap-2">
                    ← Back to Loan Types
                </Button>

                <Card className={`bg-gradient-to-r ${loan?.color} text-white border-0`}>
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold mb-2">{loan?.name}</h2>
                        <p className="text-white/90 mb-4">{loan?.description}</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-white/70 text-sm">Interest Rate</p>
                                <p className="text-xl font-bold">{loan?.rate}</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">Max Amount</p>
                                <p className="text-xl font-bold">{loan?.maxAmount}</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-sm">Term</p>
                                <p className="text-xl font-bold">{loan?.term}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Loan Calculator</CardTitle>
                        <CardDescription>Calculate your estimated monthly payment</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Loan Amount</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Loan Term (years)</Label>
                            <Input
                                type="number"
                                placeholder="5"
                                value={loanTerm}
                                onChange={(e) => setLoanTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={calculatePayment} className="w-full">
                            <Calculator className="h-4 w-4 mr-2" />
                            Calculate Payment
                        </Button>
                        {monthlyPayment > 0 && (
                            <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                                <CardContent className="p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Monthly Payment</p>
                                    <p className="text-3xl font-bold text-emerald-600">
                                        ${monthlyPayment.toFixed(2)}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Application Form</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input type="tel" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="space-y-2">
                            <Label>Annual Income</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <Input type="number" placeholder="0.00" className="pl-8" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Employment Status</Label>
                            <select className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950">
                                <option>Full-time Employed</option>
                                <option>Part-time Employed</option>
                                <option>Self-employed</option>
                                <option>Unemployed</option>
                            </select>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            Submit Application
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Landmark className="h-6 w-6 text-blue-600" />
                    Loans
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Find the perfect loan for your needs
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loanTypes.map((loan) => (
                    <Card key={loan.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedLoan(loan.id)}>
                        <CardContent className="p-6">
                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${loan.color} flex items-center justify-center text-white mb-4`}>
                                <Landmark className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{loan.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{loan.description}</p>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-500">Rate from</p>
                                    <p className="font-semibold text-emerald-600">{loan.rate}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Up to</p>
                                    <p className="font-semibold">{loan.maxAmount}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Term</p>
                                    <p className="font-semibold">{loan.term}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Why Choose Our Loans?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">Competitive Rates</p>
                                <p className="text-sm text-gray-500">Best rates in the market</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">Fast Approval</p>
                                <p className="text-sm text-gray-500">Get approved in 24 hours</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">Flexible Terms</p>
                                <p className="text-sm text-gray-500">Choose your repayment plan</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
