"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function VerifyEmailPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push("/sign-in");
                return;
            }

            try {
                // Check if token is valid by reloading user
                await currentUser.reload();
                
                if (currentUser.emailVerified) {
                    router.push("/app/dashboard");
                    return;
                }

                setUser(currentUser);
                setLoading(false);
            } catch (error: any) {
                // If token is expired, sign out and redirect
                if (error?.code === 'auth/user-token-expired') {
                    await auth.signOut();
                    router.push("/sign-in");
                } else {
                    console.error("Error checking user:", error);
                    setLoading(false);
                }
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleResend = async () => {
        if (!user || resending) return;

        setResending(true);
        setResent(false);

        try {
            await fetch("/api/auth/send-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email }),
            });
            setResent(true);
        } catch (error: any) {
            console.error("Error resending verification:", error);
            // If token is expired, sign out and redirect to sign in
            if (error?.code === 'auth/user-token-expired') {
                await auth.signOut();
                router.push("/sign-in");
            }
        } finally {
            setResending(false);
        }
    };

    const handleRefresh = async () => {
        if (!user) return;

        try {
            await user.reload();
            if (user.emailVerified) {
                router.push("/app/dashboard");
            }
        } catch (error: any) {
            // If token is expired, sign out and redirect to sign in
            if (error?.code === 'auth/user-token-expired') {
                await auth.signOut();
                router.push("/sign-in");
            }
            console.error("Error refreshing user:", error);
        }
    };

    if (loading) {
        return (
            <Card className="w-full max-w-md shadow-xl border-gray-200 dark:border-gray-800">
                <CardContent className="py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-xl border-gray-200 dark:border-gray-800">
            <CardHeader className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mx-auto mb-4">
                    <Mail className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                <CardDescription>
                    We sent a verification link to<br />
                    <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                        What to do next:
                    </h3>
                    <ol className="text-sm text-emerald-700 dark:text-emerald-300 space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="font-medium">1.</span>
                            Check your email inbox (and spam folder)
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-medium">2.</span>
                            Click the verification link in the email
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-medium">3.</span>
                            Return here and click "I've Verified"
                        </li>
                    </ol>
                </div>

                {resent && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        Verification email sent!
                    </div>
                )}

                <Button
                    onClick={handleRefresh}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                    I've Verified My Email
                    <RefreshCw className="ml-2 h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleResend}
                    disabled={resending}
                >
                    {resending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        "Resend Verification Email"
                    )}
                </Button>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
                <Button
                    variant="ghost"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={async () => {
                        await auth.signOut();
                        router.push("/sign-in");
                    }}
                >
                    Sign Out & Start Over
                </Button>
                <Link href="/sign-in" className="text-sm text-gray-500 hover:text-emerald-600">
                    ← Back to Sign In
                </Link>
            </CardFooter>
        </Card>
    );
}
