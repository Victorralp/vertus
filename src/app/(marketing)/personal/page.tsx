import Link from "next/link";
import {
    ArrowRight,
    Wallet,
    PiggyBank,
    Shield,
    Smartphone,
    CreditCard,
    CheckCircle2,
    TrendingUp,
    Globe,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        icon: Wallet,
        title: "Checking Account",
        description: "Easy access to your money with no monthly fees and free ATM withdrawals nationwide.",
    },
    {
        icon: PiggyBank,
        title: "High-Yield Savings",
        description: "Earn 4.50% APY on your savings with no minimum balance requirements.",
    },
    {
        icon: CreditCard,
        title: "Virtual Cards",
        description: "Instant virtual cards for online shopping with spending controls.",
    },
    {
        icon: Smartphone,
        title: "Mobile Banking",
        description: "Full banking experience in your pocket. Deposit checks, pay bills, and more.",
    },
    {
        icon: Shield,
        title: "Secure Transfers",
        description: "OTP-verified transfers between your accounts. Instant and secure.",
    },
    {
        icon: Clock,
        title: "24/7 Access",
        description: "Access your accounts anytime, anywhere. Bank on your schedule.",
    },
];

const benefits = [
    "No monthly maintenance fees",
    "No minimum balance requirements",
    "Free unlimited transactions",
    "Instant account opening",
    "Real-time notifications",
    "Biometric security",
];

export default function PersonalBankingPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-emerald-950/20" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
                            <Wallet className="h-4 w-4" />
                            Personal Banking
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Banking That Works for{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                You
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                            Simple, transparent personal banking with no hidden fees.
                            Manage your money with ease and earn competitive rates on your savings.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/sign-up">
                                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                                    Open an Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Everything You Need
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <Card key={feature.title} className="border-gray-200 dark:border-gray-800">
                                <CardContent className="p-6">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white mb-4">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </p>
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
                                Banking Without the Hassle
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                We've eliminated the pain points of traditional banking so you can focus on what matters.
                            </p>
                            <ul className="mt-8 space-y-4">
                                {benefits.map((benefit) => (
                                    <li key={benefit} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 text-white">
                            <TrendingUp className="h-12 w-12 mb-4" />
                            <h3 className="text-2xl font-bold">Earn More with Savings</h3>
                            <p className="mt-2 text-blue-100">
                                Our high-yield savings account offers competitive rates with no strings attached.
                            </p>
                            <div className="mt-6 text-5xl font-bold">4.50%</div>
                            <p className="text-blue-200">Annual Percentage Yield</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-white">
                    <Globe className="h-12 w-12 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
                    <p className="mt-4 text-xl text-blue-100">
                        Open your account in minutes and start banking smarter.
                    </p>
                    <Link href="/sign-up">
                        <Button size="lg" className="mt-8 bg-white text-blue-600 hover:bg-gray-100">
                            Open Free Account
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
