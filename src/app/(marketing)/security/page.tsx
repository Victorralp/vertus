import Link from "next/link";
import {
    Shield,
    Lock,
    Fingerprint,
    Eye,
    AlertTriangle,
    CheckCircle2,
    Key,
    Smartphone,
    Server,
    FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const securityFeatures = [
    {
        icon: Lock,
        title: "256-bit SSL Encryption",
        description: "All data transmitted between your device and our servers is encrypted using bank-grade 256-bit SSL encryption.",
    },
    {
        icon: Key,
        title: "OTP Verification",
        description: "Sensitive actions like transfers and security changes require one-time password verification via email.",
    },
    {
        icon: Fingerprint,
        title: "Biometric Authentication",
        description: "Use fingerprint or face recognition for quick and secure access to your accounts.",
    },
    {
        icon: Smartphone,
        title: "Real-time Alerts",
        description: "Get instant notifications for every transaction, login, and security event.",
    },
    {
        icon: Eye,
        title: "Fraud Monitoring",
        description: "Our systems continuously monitor for suspicious activity and potential threats.",
    },
    {
        icon: Server,
        title: "Secure Infrastructure",
        description: "Built on Firebase's enterprise-grade cloud infrastructure with automatic backups.",
    },
];

const practices = [
    "Multi-factor authentication for all accounts",
    "Regular security audits and penetration testing",
    "Automatic session timeout for inactive users",
    "IP-based rate limiting to prevent brute force attacks",
    "Immutable audit logs for all security events",
    "Strict data access controls with role-based permissions",
];

export default function SecurityPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
                            <Shield className="h-4 w-4" />
                            Security
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Your Security is Our{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Top Priority
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                            We implement multiple layers of security to protect your accounts,
                            personal information, and financial data.
                        </p>
                    </div>
                </div>
            </section>

            {/* Security Features */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        How We Protect You
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {securityFeatures.map((feature) => (
                            <Card key={feature.title} className="border-gray-200 dark:border-gray-800">
                                <CardContent className="p-6">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-4">
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

            {/* Security Practices */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Our Security Practices
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                We follow industry best practices and continuously improve our security measures.
                            </p>
                            <ul className="mt-8 space-y-4">
                                {practices.map((practice) => (
                                    <li key={practice} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                        {practice}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white">
                            <FileCheck className="h-12 w-12 mb-4" />
                            <h3 className="text-2xl font-bold">Compliance & Audits</h3>
                            <p className="mt-2 text-blue-100">
                                Our security measures are regularly audited and we maintain compliance
                                with industry standards and regulations.
                            </p>
                            <div className="mt-6 pt-6 border-t border-white/20">
                                <p className="text-sm text-blue-200">
                                    Our security measures comply with all regulatory requirements and industry standards.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-3xl p-8">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Security Tips for You
                                </h3>
                                <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>• Never share your OTP codes with anyone</li>
                                    <li>• Use strong, unique passwords for your account</li>
                                    <li>• Enable notifications for all account activity</li>
                                    <li>• Report suspicious activity immediately</li>
                                    <li>• Keep your contact information up to date</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
