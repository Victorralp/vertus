"use client";

import { useState } from "react";
import { 
    HelpCircle, 
    MessageSquare, 
    Phone, 
    Mail, 
    Search,
    ChevronDown,
    ChevronUp,
    Send
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const faqs = [
    {
        id: 1,
        question: "How do I reset my password?",
        answer: "You can reset your password by clicking on 'Forgot Password' on the login page. Follow the instructions sent to your email to create a new password."
    },
    {
        id: 2,
        question: "What are the transfer limits?",
        answer: "Daily transfer limits vary by account type. Standard accounts have a $10,000 daily limit, while premium accounts have a $50,000 daily limit."
    },
    {
        id: 3,
        question: "How long do international transfers take?",
        answer: "International wire transfers typically take 1-3 business days. Cryptocurrency transfers are usually processed within 1-3 hours."
    },
    {
        id: 4,
        question: "Are there any fees for transfers?",
        answer: "Local transfers are free. International wire transfers have a $25 fee. Cryptocurrency transfers have network fees that vary by currency."
    },
    {
        id: 5,
        question: "How do I update my account information?",
        answer: "Go to Settings > Profile to update your personal information, contact details, and security settings."
    }
];

export default function SupportPage() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [message, setMessage] = useState("");

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="h-6 w-6 text-blue-600" />
                    Help & Support
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Get help with your account and banking needs
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Chat with our support team
                        </p>
                        <Button variant="outline" size="sm">Start Chat</Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                            <Phone className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone Support</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Call us at 1-800-NEXUS-BANK
                        </p>
                        <Button variant="outline" size="sm">Call Now</Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                            <Mail className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            support@vertexcu.com
                        </p>
                        <Button variant="outline" size="sm">Send Email</Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>We'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input placeholder="What do you need help with?" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full min-h-32 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                            placeholder="Describe your issue or question..."
                        />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find answers to common questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="space-y-2">
                        {filteredFaqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                >
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {faq.question}
                                    </span>
                                    {expandedFaq === faq.id ? (
                                        <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                {expandedFaq === faq.id && (
                                    <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No FAQs found matching your search</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Need Immediate Assistance?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Our support team is available 24/7 to help you with any urgent issues.
                    </p>
                    <div className="flex gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Support
                        </Button>
                        <Button variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Start Live Chat
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
