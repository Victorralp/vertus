import Link from "next/link";
import {
    ArrowRight,
    TrendingUp,
    Home,
    Car,
    GraduationCap,
    Building2,
    CheckCircle2,
    Calculator,
    Clock,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const loanTypes = [
    {
        icon: Home,
        title: "Home Loans",
        description: "Competitive mortgage rates for your dream home.",
        rate: "5.99%",
        term: "15-30 years",
    },
    {
        icon: Car,
        title: "Auto Loans",
        description: "Finance your next vehicle with low rates.",
        rate: "4.49%",
        term: "3-7 years",
    },
    {
        icon: GraduationCap,
        title: "Education Loans",
        description: "Invest in your future with flexible student loans.",
        rate: "5.25%",
        term: "5-15 years",
    },
    {
        icon: Building2,
        title: "Business Loans",
        description: "Grow your business with capital when you need it.",
        rate: "5.49%",
        term: "1-10 years",
    },
];

const benefits = [
    "No hidden fees or prepayment penalties",
    "Fast online application process",
    "Decision within 24 hours",
    "Flexible repayment options",
    "Competitive fixed rates",
    "Expert loan advisors",
];

export default function LoansPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-950/20" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-900/30 px-4 py-1.5 text-sm font-medium text-orange-700 dark:text-orange-300 mb-6">
                            <TrendingUp className="h-4 w-4" />
                            Loans & Financing
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Financing for Your{" "}
                            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                Every Need
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                            Transparent terms, competitive rates, and a simple application process.
                            Get the funding you need to achieve your goals.
                        </p>
                        <div className="mt-8">
                            <Link href="/sign-up">
                                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                                    Apply Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Loan Types */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Our Loan Products
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loanTypes.map((loan) => (
                            <Card key={loan.title} className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white flex-shrink-0">
                                            <loan.icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {loan.title}
                                            </h3>
                                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                                {loan.description}
                                            </p>
                                            <div className="mt-4 flex items-center gap-6 text-sm">
                                                <div>
                                                    <span className="text-gray-500">From</span>
                                                    <span className="ml-2 text-2xl font-bold text-orange-600">{loan.rate}</span>
                                                    <span className="text-gray-500"> APR</span>
                                                </div>
                                                <div className="text-gray-500">
                                                    {loan.term}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Why Choose Our Loans?
                            </h2>
                            <ul className="mt-8 space-y-4">
                                {benefits.map((benefit) => (
                                    <li key={benefit} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <Calculator className="h-8 w-8 text-orange-500 mb-2" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">Easy Calculator</h3>
                                <p className="text-sm text-gray-500">Estimate your payments instantly</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <Clock className="h-8 w-8 text-orange-500 mb-2" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">Fast Approval</h3>
                                <p className="text-sm text-gray-500">Decision in 24 hours</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <Shield className="h-8 w-8 text-orange-500 mb-2" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">Secure Process</h3>
                                <p className="text-sm text-gray-500">Bank-grade encryption</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <TrendingUp className="h-8 w-8 text-orange-500 mb-2" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">Fixed Rates</h3>
                                <p className="text-sm text-gray-500">Predictable payments</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-white">
                    <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
                    <p className="mt-4 text-xl text-orange-100">
                        Apply online in minutes and get a decision within 24 hours.
                    </p>
                    <Link href="/sign-up">
                        <Button size="lg" className="mt-8 bg-white text-orange-600 hover:bg-gray-100">
                            Start Your Application
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
