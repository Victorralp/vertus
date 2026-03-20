"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    HelpCircle,
    MessageSquare,
    Phone,
    Mail,
    Search,
    ChevronDown,
    ChevronUp,
    Send,
    Clock3,
    ShieldCheck,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const faqs = [
    {
        id: 1,
        question: "How do I reset my password?",
        answer: "Use the password section in Settings if you're signed in, or choose Forgot Password on the sign-in page if you’re locked out."
    },
    {
        id: 2,
        question: "What are the transfer limits?",
        answer: "Standard accounts can move up to $10,000 daily. Higher verification tiers and business accounts can access larger limits."
    },
    {
        id: 3,
        question: "How long do international transfers take?",
        answer: "International wires usually settle in 1 to 3 business days. Alternative rails such as crypto can complete faster depending on the destination network."
    },
    {
        id: 4,
        question: "Are there any fees for transfers?",
        answer: "Local transfers are free. International wire pricing and network fees depend on the transfer method you select."
    },
    {
        id: 5,
        question: "How do I update my account information?",
        answer: "Go to Settings to update your profile details, view your masked identity record, and manage security preferences."
    }
];

export default function SupportPage() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const filteredFaqs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return faqs.filter((faq) => {
            if (!query) {
                return true;
            }

            return (
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query)
            );
        });
    }, [searchQuery]);

    const handleSubmit = () => {
        if (!subject.trim() || !message.trim()) {
            return;
        }

        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setSubject("");
        setMessage("");
    };

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(140deg,#0f172a_0%,#103c5a_48%,#ecfeff_100%)] p-6 shadow-[0_28px_90px_rgba(15,23,42,0.18)] dark:border-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_32%)]" />
                <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
                    <div className="min-w-0 space-y-4 text-white">
                        <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-cyan-100">
                            Support Center
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Fast help without the clutter</h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-200/90 sm:text-base">
                                Reach support, send a secure message, and find answers to common banking questions from a single clean workspace.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/80">Live Response</p>
                            <p className="mt-2 text-2xl font-semibold">24/7</p>
                            <p className="mt-1 text-sm text-slate-200/80">Critical account issues</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/80">Secure Reply</p>
                            <p className="mt-2 text-2xl font-semibold">&lt; 24h</p>
                            <p className="mt-1 text-sm text-slate-200/80">Message response window</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm sm:col-span-3 xl:col-span-1">
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/80">Security</p>
                            <p className="mt-2 text-2xl font-semibold">Verified</p>
                            <p className="mt-1 text-sm text-slate-200/80">Banking support only</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
                <div className="space-y-6">
                    <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <CardTitle>Choose a contact method</CardTitle>
                            <CardDescription>Every action below leads somewhere real</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
                            <div className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Secure Message</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    Jump straight to the message form below and send an issue summary securely.
                                </p>
                                <div className="mt-auto pt-5">
                                <Button asChild variant="outline" className="h-11 w-full justify-between rounded-xl px-4">
                                    <Link href="#message-form">
                                        Open Form
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                                </div>
                            </div>

                            <div className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Phone Support</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    Speak to a support specialist for urgent account access or transfer issues.
                                </p>
                                <div className="mt-auto pt-5">
                                <Button asChild variant="outline" className="h-11 w-full justify-between rounded-xl px-4">
                                    <a href="tel:+18008378391">
                                        Call Support
                                        <ChevronRight className="h-4 w-4" />
                                    </a>
                                </Button>
                                </div>
                            </div>

                            <div className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Email Support</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    Use email for documents, screenshots, or follow-up questions that do not need a call.
                                </p>
                                <div className="mt-auto pt-5">
                                <Button asChild variant="outline" className="h-11 w-full justify-between rounded-xl px-4">
                                    <a href="mailto:support@vertexcu.com?subject=Vertex%20Support%20Request">
                                        Email Us
                                        <ChevronRight className="h-4 w-4" />
                                    </a>
                                </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card id="message-form" className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <CardTitle>Send a secure message</CardTitle>
                            <CardDescription>We usually reply within one business day</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 p-6">
                            {sent && (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
                                    Your message was queued successfully. A support specialist will respond within 24 hours.
                                </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        value={subject}
                                        onChange={(event) => setSubject(event.target.value)}
                                        placeholder="Example: I need help with a pending transfer"
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                                    <div className="flex items-center gap-3">
                                        <Clock3 className="h-5 w-5 text-slate-500" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Support window</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">24/7 urgent support, next-business-day standard replies</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                    className="min-h-40 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20"
                                    placeholder="Tell us what happened, what you expected, and whether the issue is urgent."
                                />
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                                    Messages sent here are intended for account support.
                                </div>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!subject.trim() || !message.trim()}
                                    className="h-11 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0f9b8e)] px-6 text-white hover:opacity-95"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <CardTitle>Frequently asked questions</CardTitle>
                            <CardDescription>Search common answers before contacting support</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Search support topics"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    className="h-11 rounded-xl pl-10"
                                />
                            </div>

                            <div className="space-y-3">
                                {filteredFaqs.map((faq) => (
                                    <div
                                        key={faq.id}
                                        className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                            className="flex w-full items-center justify-between gap-4 bg-white px-4 py-4 text-left transition hover:bg-slate-50 dark:bg-slate-950/40 dark:hover:bg-slate-900"
                                        >
                                            <span className="font-medium text-slate-900 dark:text-white">{faq.question}</span>
                                            {expandedFaq === faq.id ? (
                                                <ChevronUp className="h-5 w-5 shrink-0 text-slate-400" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
                                            )}
                                        </button>
                                        {expandedFaq === faq.id && (
                                            <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {filteredFaqs.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-800">
                                    <HelpCircle className="mx-auto h-10 w-10 text-slate-400" />
                                    <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">No support topics found</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Try a broader phrase or send a direct message above.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <CardTitle>Urgent help</CardTitle>
                            <CardDescription>Use these options if you need a faster response</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                                <p className="font-medium text-slate-900 dark:text-white">Lost card, suspicious activity, or account lockout</p>
                                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                    Call support immediately so the team can freeze access and review the account with you.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button asChild className="h-11 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0f9b8e)] text-white hover:opacity-95">
                                    <a href="tel:+18008378391">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Call Support Now
                                    </a>
                                </Button>
                                <Button asChild variant="outline" className="h-11 rounded-xl">
                                    <Link href="/app/settings">
                                        Open Account Settings
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
