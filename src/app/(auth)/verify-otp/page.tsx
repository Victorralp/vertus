"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/firebase/client";

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const action = searchParams.get("action") || "transfer";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
        const unsub = auth.onAuthStateChanged((user) => {
            setUserEmail(user?.email ?? null);
        });
        return () => unsub();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only take last character
        setOtp(newOtp);
        setError("");

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join("");

        if (otpValue.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setLoading(true);
        setError("");
        setAttemptsRemaining(null);

        try {
            const resp = await fetch("/api/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: otpValue, purpose: action }),
            });
            const data = await resp.json();

            if (!resp.ok || !data.success) {
                setError(data.message || "Verification failed. Please try again.");
                return;
            }

            setVerified(true);

            setTimeout(() => {
                if (action === "transfer") {
                    router.push("/app/transfers?verified=true");
                } else {
                    router.push("/app/dashboard");
                }
            }, 1200);
        } catch (err: any) {
            console.error("OTP verification error:", err);
            setError("Unable to verify code. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!userEmail) {
            setError("No email found for your account.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const resp = await fetch("/api/otp/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, purpose: action }),
            });
            const data = await resp.json();
            if (!resp.ok || !data.success) {
                setError(data.message || "Failed to resend code. Please try again.");
                return;
            }

            setOtp(["", "", "", "", "", ""]);
            setAttemptsRemaining(null);
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            console.error("OTP resend error:", err);
            setError("Failed to resend code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (verified) {
        return (
            <Card className="w-full max-w-md shadow-xl border-gray-200 dark:border-gray-800">
                <CardContent className="py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Verified Successfully
                    </h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Redirecting...
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md shadow-xl border-gray-200 dark:border-gray-800">
            <CardHeader className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-4">
                    <KeyRound className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
                <CardDescription>
                    We sent a 6-digit code to your email
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <div>
                                <p>{error}</p>
                                {attemptsRemaining !== null && (
                                    <p className="mt-1 text-xs">
                                        {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 outline-none transition-all bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                disabled={loading}
                            />
                        ))}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                        disabled={loading || otp.join("").length !== 6}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            "Verify Code"
                        )}
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            className="text-sm text-emerald-600 hover:underline"
                            onClick={handleResend}
                            disabled={loading}
                        >
                            Didn't receive code? Resend
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
