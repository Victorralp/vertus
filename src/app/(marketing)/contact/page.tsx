"use client";

import { useState } from "react";
import {
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    Send,
    Clock,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
    {
        icon: Mail,
        title: "Email",
        value: "support@vertexcu.com",
        description: "We'll respond within 24 hours",
    },
    {
        icon: Phone,
        title: "Phone",
        value: "1-800-NEXUS-00",
        description: "Mon-Fri, 9am-6pm EST",
    },
    {
        icon: MapPin,
        title: "Address",
        value: "123 Financial Plaza",
        description: "San Francisco, CA 94102",
    },
];

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Hero */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20" />
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-6">
                            <MessageSquare className="h-4 w-4" />
                            Contact Us
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Get in{" "}
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Touch
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                            Have a question or need help? We're here for you.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Send us a message
                            </h2>

                            {submitted ? (
                                <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
                                    <CardContent className="p-8 text-center">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Message Sent!
                                        </h3>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                                            Thank you for reaching out. We have received your message and will respond within 24 hours.
                                        </p>
                                        <Button
                                            className="mt-6"
                                            variant="outline"
                                            onClick={() => setSubmitted(false)}
                                        >
                                            Send Another Message
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" placeholder="John" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" placeholder="Doe" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="john@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" placeholder="How can we help?" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <textarea
                                            id="message"
                                            className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Tell us more about your inquiry..."
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
                                        Send Message
                                        <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Other ways to reach us
                            </h2>
                            <div className="space-y-4">
                                {contactInfo.map((info) => (
                                    <Card key={info.title} className="border-gray-200 dark:border-gray-800">
                                        <CardContent className="p-4 flex items-start gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                                <info.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {info.title}
                                                </h3>
                                                <p className="text-emerald-600 dark:text-emerald-400">
                                                    {info.value}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {info.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <Clock className="h-5 w-5 text-emerald-500" />
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Support Hours
                                    </h3>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li>Monday - Friday: 9:00 AM - 6:00 PM EST</li>
                                    <li>Saturday: 10:00 AM - 4:00 PM EST</li>
                                    <li>Sunday: Closed</li>
                                </ul>
                                <p className="mt-4 text-xs text-gray-500">
                                    For urgent matters outside business hours, please use our secure
                                    messaging feature in your account dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
