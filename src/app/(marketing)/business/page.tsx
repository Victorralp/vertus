import Link from "next/link";
import {
    ArrowRight,
    Building2,
    Users,
    BarChart3,
    Shield,
    CreditCard,
    CheckCircle2,
    Banknote,
    FileText,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        icon: Banknote,
        title: "Business Checking",
        description: "Manage cash flow with unlimited transactions and integrated invoicing.",
    },
    {
        icon: Users,
        title: "Team Access",
        description: "Add team members with role-based permissions and spending limits.",
    },
    {
        icon: BarChart3,
        title: "Financial Insights",
        description: "Real-time analytics and reports to track your business performance.",
    },
    {
        icon: CreditCard,
        title: "Business Cards",
        description: "Virtual and physical cards for your team with expense tracking.",
    },
    {
        icon: FileText,
        title: "Invoicing",
        description: "Create and send professional invoices, get paid faster.",
    },
    {
        icon: Shield,
        title: "Enhanced Security",
        description: "Multi-level approvals and audit logs for complete transparency.",
    },
];

export default function BusinessBankingPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-rose-950/20" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 text-sm font-medium text-purple-700 dark:text-purple-300 mb-6">
                            <Building2 className="h-4 w-4" />
                            Business Banking
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Built for Growing{" "}
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Businesses
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                            Powerful banking tools designed for businesses of all sizes.
                            Manage your finances, team, and growth from one platform.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/sign-up">
                                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                                    Open Business Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Everything Your Business Needs
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <Card key={feature.title} className="border-gray-200 dark:border-gray-800">
                                <CardContent className="p-6">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4">
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

            {/* Rates */}
            <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-white">
                    <h2 className="text-3xl font-bold">Competitive Business Rates</h2>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                            <p className="text-purple-200">Business Loan</p>
                            <p className="text-4xl font-bold mt-2">5.49%</p>
                            <p className="text-purple-200">APR</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                            <p className="text-purple-200">Line of Credit</p>
                            <p className="text-4xl font-bold mt-2">6.99%</p>
                            <p className="text-purple-200">APR</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                            <p className="text-purple-200">Business Savings</p>
                            <p className="text-4xl font-bold mt-2">3.50%</p>
                            <p className="text-purple-200">APY</p>
                        </div>
                    </div>
                    <Link href="/sign-up">
                        <Button size="lg" className="mt-8 bg-white text-purple-600 hover:bg-gray-100">
                            Get Started Today
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
