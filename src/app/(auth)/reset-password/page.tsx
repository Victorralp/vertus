"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setSent(true);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to send reset email";
            if (errorMessage.includes("user-not-found")) {
                // Don't reveal if email exists for security
                setSent(true);
            } else if (errorMessage.includes("invalid-email")) {
                setError("Please enter a valid email address");
            } else {
                setError("Failed to send reset email. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <Card className="w-full max-w-md shadow-xl border-gray-200 dark:border-gray-800">
                <CardHeader className="text-center">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-4">
                        <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-2xl">Check Your Email</CardTitle>
                    <CardDescription>
                        If an account exists for <span className="font-medium">{email}</span>,
                        you'll receive a password reset link.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg text-sm text-emerald-700 dark:text-emerald-300">
                        <p>Check your inbox and spam folder. The link will expire in 1 hour.</p>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setSent(false);
                            setEmail("");
                        }}
                    >
                        Send to Different Email
                    </Button>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <Link href="/sign-in" className="text-sm text-emerald-600 hover:underline">
                        ← Back to Sign In
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-xl border-gray-200 dark:border-gray-800">
            <CardHeader className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-4">
                    <KeyRound className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">Reset Password</CardTitle>
                <CardDescription>Enter your email to receive a reset link</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="pl-10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="flex justify-center">
                <Link href="/sign-in" className="text-sm text-gray-500 hover:text-emerald-600">
                    ← Back to Sign In
                </Link>
            </CardFooter>
        </Card>
    );
}
