import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
    ArrowRight,
    Shield,
    CheckCircle2,
    Star,
    Quote,
    ChevronDown,
    Globe,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { features, products, rates, testimonials, faqs } from "@/lib/data/marketing-content";

export const metadata: Metadata = {
    title: "Modern Banking for the Digital Age | Vertex Credit Union",
    description: "Experience banking reimagined with instant transfers, bank-grade security, and 24/7 access.",
    openGraph: {
        title: "Modern Banking for the Digital Age | Vertex Credit Union",
        description: "Experience banking reimagined with instant transfers, bank-grade security, and 24/7 access.",
        type: "website",
    }
};

export default function HomePage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-[600px]">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
                        alt="Modern banking architecture"
                        fill
                        className="object-cover opacity-40 dark:opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/85 via-teal-50/85 to-cyan-50/85 dark:from-gray-950/85 dark:via-gray-900/85 dark:to-gray-950/85" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-6">
                            <Shield className="h-4 w-4" />
                            Secure · Fast · Modern
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
                            Banking for the{" "}
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Digital Age
                            </span>
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Experience banking reimagined. Instant transfers, bank-grade security,
                            and a beautiful interface designed for the way you live today.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/sign-up">
                                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 h-12 px-8 text-base">
                                    Open Free Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                                    Learn More
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                No monthly fees
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                Instant setup
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                24/7 access
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Why Choose Vertex Credit Union?
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            Built with modern technology and security-first design
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-5xl">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature) => (
                                <div key={feature.title} className="relative group">
                                    <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative flex flex-col items-center text-center p-6">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4">
                                            <feature.icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Our Products
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            Everything you need for personal and business banking
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {products.map((product) => (
                            <Link key={product.title} href={product.href}>
                                <Card className="group h-full hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-800 overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${product.color} text-white mb-4`}>
                                            <product.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {product.title}
                                        </h3>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                                            {product.description}
                                        </p>
                                        <div className="mt-4 flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                                            Learn more
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rates Section */}
            <section className="relative py-24 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop"
                        alt="Financial growth background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/95 to-teal-700/95" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center text-white">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Competitive Rates
                        </h2>
                        <p className="mt-4 text-lg text-emerald-100">
                            Earn more, pay less. Our rates are designed for your benefit.
                        </p>
                    </div>

                    <div className="mx-auto mt-12 max-w-4xl grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {rates.map((rate) => (
                            <div key={rate.type} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white">
                                <p className="text-sm font-medium text-emerald-200">{rate.type}</p>
                                <p className="mt-2 text-4xl font-bold">{rate.rate}</p>
                                <p className="text-sm text-emerald-200">{rate.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/sign-up">
                            <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 h-12 px-8">
                                Start Earning Today
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="relative py-24 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2940&auto=format&fit=crop"
                        alt="Security background"
                        fill
                        className="object-cover opacity-5 dark:opacity-[0.02]"
                    />
                    <div className="absolute inset-0 bg-gray-50/90 dark:bg-gray-900/90" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-4">
                                <Lock className="h-4 w-4" />
                                Enterprise Security
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                Your Security is Our Priority
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                                We implement multiple layers of security to protect your accounts and personal information.
                            </p>

                            <ul className="mt-8 space-y-4">
                                {[
                                    "256-bit SSL encryption for all data",
                                    "OTP verification for sensitive actions",
                                    "Biometric authentication support",
                                    "Real-time fraud monitoring",
                                    "Secure card freeze/unfreeze controls",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8">
                                <Link href="/security">
                                    <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                                        Learn About Our Security
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 flex items-center justify-center">
                                <Shield className="h-48 w-48 text-white/20" />
                                <div className="absolute inset-8 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <Lock className="h-16 w-16 mx-auto mb-4" />
                                        <p className="text-2xl font-bold">Protected</p>
                                        <p className="text-emerald-100">24/7 Monitoring</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Loved by Thousands
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            See what our customers have to say about their experience
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-5xl grid grid-cols-1 gap-8 md:grid-cols-3">
                        {testimonials.map((testimonial, i) => (
                            <Card key={i} className="border-gray-200 dark:border-gray-800">
                                <CardContent className="p-6">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <Quote className="h-8 w-8 text-emerald-500/20 mb-2" />
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {testimonial.content}
                                    </p>
                                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {testimonial.author}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Frequently Asked Questions
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            Everything you need to know about Vertex Credit Union
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-3xl divide-y divide-gray-200 dark:divide-gray-800">
                        {faqs.map((faq, i) => (
                            <details key={i} className="group py-6">
                                <summary className="flex cursor-pointer items-center justify-between text-left">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {faq.question}
                                    </h3>
                                    <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="mt-4 text-gray-600 dark:text-gray-400">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-950">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <Globe className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                        Ready to Transform Your Banking?
                    </h2>
                    <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who have made the switch to modern banking.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/sign-up">
                            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white h-14 px-10 text-lg">
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-gray-700 text-gray-300 hover:bg-gray-800">
                                Contact Sales
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
