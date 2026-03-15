"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

const passwordRequirements = [
    { regex: /.{8,}/, label: "At least 8 characters" },
    { regex: /[A-Z]/, label: "One uppercase letter" },
    { regex: /[a-z]/, label: "One lowercase letter" },
    { regex: /[0-9]/, label: "One number" },
];

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const passwordChecks = passwordRequirements.map(req => ({
        ...req,
        passed: req.regex.test(password)
    }));

    const allPasswordRequirementsMet = passwordChecks.every(check => check.passed);
    const passwordsMatch = password === confirmPassword && confirmPassword !== "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!allPasswordRequirementsMet) {
            setError("Password does not meet all requirements");
            return;
        }

        if (!passwordsMatch) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            try {
                // Update profile with name
                await updateProfile(userCredential.user, { displayName: name });

                // Create user document in Firestore
                try {
                    await setDoc(doc(db, "users", userId), {
                        uid: userId,
                        email: email,
                        name: name,
                        role: "user",
                        createdAt: serverTimestamp(),
                        lastLoginAt: null,
                        security: {
                            emailVerified: false,
                            mfaEnabled: false,
                            totpEnabled: false,
                        },
                    });
                } catch (firestoreError: any) {
                    console.error("Firestore write error:", firestoreError);
                    
                    // Attempt cleanup: delete the Firebase Auth user
                    try {
                        await userCredential.user.delete();
                        console.log("Successfully cleaned up Firebase Auth user after Firestore failure");
                    } catch (cleanupError: any) {
                        console.error("Failed to cleanup Firebase Auth user:", cleanupError);
                        setError("Account created but setup incomplete. Please contact support with error code: FS_CLEANUP_FAILED");
                        setLoading(false);
                        return;
                    }
                    
                    throw new Error("Failed to create your account. Please try again.");
                }

                // Fire-and-forget custom verification email (do not block UX)
                (async () => {
                    try {
                        const controller = new AbortController();
                        const timer = setTimeout(() => controller.abort(), 5000);
                        await fetch("/api/auth/send-verification", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email }),
                            signal: controller.signal,
                        });
                        clearTimeout(timer);
                    } catch (emailError: any) {
                        console.warn("Verification email send skipped:", emailError?.message || emailError);
                    }
                })();

                // Redirect to verification page
                router.push("/verify-email");
            } catch (profileError: any) {
                console.error("Profile update error:", profileError);
                // Profile update failure is not critical, continue
                router.push("/verify-email");
            }
        } catch (err: unknown) {
            console.error("Sign-up error:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to create account";
            
            if (errorMessage.includes("email-already-in-use")) {
                setError("An account with this email already exists");
            } else if (errorMessage.includes("invalid-email")) {
                setError("Please enter a valid email address");
            } else if (errorMessage.includes("weak-password")) {
                setError("Password is too weak");
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-xl border-gray-200 dark:border-gray-800">
            <CardHeader className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto mb-4">
                    <UserPlus className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>Join Vertex Credit Union in minutes</CardDescription>
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
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                className="pl-10"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        {/* Password requirements */}
                        <div className="mt-2 space-y-1">
                            {passwordChecks.map((check, i) => (
                                <div key={i} className={`flex items-center gap-2 text-xs ${check.passed ? 'text-emerald-600' : 'text-gray-400'}`}>
                                    <CheckCircle2 className={`h-3 w-3 ${check.passed ? 'opacity-100' : 'opacity-40'}`} />
                                    {check.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        {confirmPassword && (
                            <p className={`text-xs ${passwordsMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                        disabled={loading || !allPasswordRequirementsMet || !passwordsMatch}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <UserPlus className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                    By creating an account, you agree to our{" "}
                    <Link href="/legal/terms" className="text-emerald-600 hover:underline">Terms</Link>
                    {" "}and{" "}
                    <Link href="/legal/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
                </p>
            </CardContent>

            <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-emerald-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
