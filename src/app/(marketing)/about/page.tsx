import {
    Building2,
    Users,
    Target,
    Heart,
    Lightbulb,
    Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
    {
        icon: Shield,
        title: "Security First",
        description: "We prioritize the security of your data and funds above all else.",
    },
    {
        icon: Heart,
        title: "Customer Focused",
        description: "Every feature we build starts with understanding your needs.",
    },
    {
        icon: Lightbulb,
        title: "Innovation",
        description: "We embrace modern technology to deliver a better banking experience.",
    },
    {
        icon: Target,
        title: "Transparency",
        description: "No hidden fees, no fine print. Just honest, straightforward banking.",
    },
];

const team = [
    { name: "Sarah Johnson", role: "CEO & Founder" },
    { name: "Michael Chen", role: "CTO" },
    { name: "Emily Rodriguez", role: "Head of Security" },
    { name: "David Kim", role: "Head of Product" },
];

export default function AboutPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-6">
                            <Building2 className="h-4 w-4" />
                            About Us
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Reimagining{" "}
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Modern Banking
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                            Vertex Credit Union was founded with a simple mission: to make banking
                            simple, secure, and accessible to everyone.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Our Story
                        </h2>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            Traditional banks are stuck in the past. Complex fee structures,
                            outdated technology, and poor customer experiences have plagued the
                            industry for too long. We set out to build something different.
                        </p>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            Vertex Credit Union is built on modern technology with security at its core.
                            We use OTP verification for sensitive actions, implement strict access
                            controls, and maintain comprehensive audit logs. Our goal is to give
                            you complete control over your financial life.
                        </p>

                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Our Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value) => (
                            <Card key={value.title} className="border-gray-200 dark:border-gray-800 text-center">
                                <CardContent className="p-6">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-4">
                                        <value.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {value.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Leadership Team
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                        {team.map((member, i) => (
                            <div key={i} className="text-center">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                    <Users className="h-10 w-10" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {member.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
