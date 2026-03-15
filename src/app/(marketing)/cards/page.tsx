import Link from "next/link";
import {
    ArrowRight,
    CreditCard,
    Shield,
    Gift,
    Smartphone,
    CheckCircle2,
    Sparkles,
    Lock,
    Globe,
    Percent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const cardTypes = [
    {
        name: "NexusCard Essential",
        type: "Virtual Debit",
        color: "from-gray-700 to-gray-900",
        features: ["No annual fee", "Instant virtual card", "Mobile payments", "Spending alerts"],
        cta: "Get Free Card",
    },
    {
        name: "NexusCard Rewards",
        type: "Premium Debit",
        color: "from-emerald-500 to-teal-600",
        features: ["1.5% cashback", "Travel insurance", "Priority support", "Extended warranty"],
        cta: "Apply Now",
    },
    {
        name: "NexusCard Business",
        type: "Business Card",
        color: "from-purple-500 to-pink-600",
        features: ["2% on business spend", "Team cards", "Expense tracking", "Higher limits"],
        cta: "Get Business Card",
    },
];

const features = [
    {
        icon: Shield,
        title: "Secure by Design",
        description: "Freeze/unfreeze instantly, set spending limits, and get real-time alerts.",
    },
    {
        icon: Smartphone,
        title: "Digital First",
        description: "Add to Apple Pay, Google Pay, or Samsung Pay for contactless payments.",
    },
    {
        icon: Gift,
        title: "Rewarding",
        description: "Earn cashback on every purchase. No points to track, just money back.",
    },
    {
        icon: Globe,
        title: "Global Access",
        description: "Use your card worldwide with no foreign transaction fees.",
    },
];

export default function CardsPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-6">
                            <CreditCard className="h-4 w-4" />
                            Cards
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Cards That Work{" "}
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Smarter
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                            Virtual and physical cards with instant controls, real cashback rewards,
                            and security features that put you in charge.
                        </p>
                    </div>
                </div>
            </section>

            {/* Card Types */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {cardTypes.map((card) => (
                            <Card key={card.name} className="border-gray-200 dark:border-gray-800 overflow-hidden">
                                <div className={`h-48 bg-gradient-to-br ${card.color} p-6 flex flex-col justify-end text-white`}>
                                    <CreditCard className="h-10 w-10 mb-2 opacity-80" />
                                    <p className="text-sm opacity-80">{card.type}</p>
                                    <h3 className="text-xl font-bold">{card.name}</h3>
                                </div>
                                <CardContent className="p-6">
                                    <ul className="space-y-3">
                                        {card.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/sign-up">
                                        <Button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600">
                                            {card.cta}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Card Features You'll Love
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => (
                            <div key={feature.title} className="text-center p-6">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-4">
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security */}
            <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-white">
                    <Lock className="h-12 w-12 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold">Total Control Over Your Cards</h2>
                    <p className="mt-4 text-xl text-emerald-100 max-w-2xl mx-auto">
                        Freeze your card instantly, set spending limits, and receive real-time notifications
                        for every transaction. All from your dashboard.
                    </p>
                    <Link href="/sign-up">
                        <Button size="lg" className="mt-8 bg-white text-emerald-600 hover:bg-gray-100">
                            Get Your Card
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
