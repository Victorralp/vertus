"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    User,
    Shield,
    Bell,
    Moon,
    Sun,
    Smartphone,
    Mail,
    Key,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronRight
} from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onAuthStateChanged, User as FirebaseUser, updatePassword, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

type AccountProfile = {
    uid: string;
    name?: string;
    email?: string;
    maskedSsn?: string;
    mfaEnabled?: boolean;
};

type NotificationSettings = {
    email: boolean;
    push: boolean;
    sms: boolean;
};

const defaultNotifications: NotificationSettings = {
    email: true,
    push: true,
    sms: false,
};

async function loadAccountProfile(idToken: string) {
    const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });

    const body = (await response.json().catch(() => null)) as
        | { message?: string; profile?: AccountProfile }
        | null;

    if (!response.ok || !body?.profile) {
        throw new Error(body?.message || "Failed to load profile.");
    }

    return body.profile;
}

function ToggleRow({
    label,
    description,
    checked,
    onToggle,
    icon: Icon,
}: {
    label: string;
    description: string;
    checked: boolean;
    onToggle: () => void;
    icon: typeof Bell;
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/5"
        >
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 dark:text-white">{label}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
            <div className={`flex h-7 w-12 shrink-0 items-center rounded-full px-1 transition ${checked ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-0"}`} />
            </div>
        </button>
    );
}

export default function SettingsPage() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [maskedSsn, setMaskedSsn] = useState("");
    const [profileLoading, setProfileLoading] = useState(true);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);
    const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const ssnDisplay = profileLoading ? "Loading..." : maskedSsn || "Pending";
    const profileStatus = profileLoading ? "Syncing" : maskedSsn ? "Verified" : "Incomplete";
    const isDarkMode = mounted ? resolvedTheme === "dark" : false;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) {
            return;
        }

        const savedNotifications = window.localStorage.getItem("settings-notifications");

        if (!savedNotifications) {
            return;
        }

        try {
            const parsed = JSON.parse(savedNotifications) as Partial<NotificationSettings>;
            setNotifications({
                email: parsed.email ?? defaultNotifications.email,
                push: parsed.push ?? defaultNotifications.push,
                sms: parsed.sms ?? defaultNotifications.sms,
            });
        } catch {
            window.localStorage.removeItem("settings-notifications");
        }
    }, [mounted]);

    useEffect(() => {
        if (!mounted) {
            return;
        }

        window.localStorage.setItem("settings-notifications", JSON.stringify(notifications));
    }, [mounted, notifications]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                setName("");
                setEmail("");
                setMaskedSsn("");
                setProfileLoading(false);
                return;
            }

            setName(currentUser.displayName || "");
            setEmail(currentUser.email || "");
            setProfileLoading(true);

            try {
                const idToken = await currentUser.getIdToken();
                const profile = await loadAccountProfile(idToken);

                setName(profile.name || currentUser.displayName || "");
                setEmail(profile.email || currentUser.email || "");
                setMaskedSsn(profile.maskedSsn || "");
                setTwoFactorEnabled(Boolean(profile.mfaEnabled));
            } catch (profileError) {
                console.error("Failed to load profile:", profileError);
                setMaskedSsn("");
            } finally {
                setProfileLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSaveProfile = async () => {
        if (!user) {
            return;
        }

        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        setLoading(true);
        setError("");
        setSaved(false);

        try {
            const trimmedName = name.trim();
            await updateProfile(user, { displayName: trimmedName });
            await updateDoc(doc(db, "users", user.uid), { name: trimmedName });
            setName(trimmedName);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            setError("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!user) {
            return;
        }

        if (!currentPassword) {
            setError("Enter your current password before changing it.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await updatePassword(user, newPassword);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            setError("Failed to change password. You may need to re-authenticate.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleNotification = (key: keyof NotificationSettings, label: string) => {
        setNotifications((previous) => {
            const updated = !previous[key];
            setNotificationStatus(`${label} ${updated ? "enabled" : "disabled"}`);
            return { ...previous, [key]: updated };
        });
    };

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(140deg,#0f172a_0%,#12354d_50%,#dff7f4_100%)] p-6 shadow-[0_28px_90px_rgba(15,23,42,0.22)] dark:border-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.16),transparent_30%)]" />
                <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
                    <div className="min-w-0 space-y-4 text-white">
                        <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-cyan-100">
                            Account Settings
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Profile, security, and identity</h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-200/90 sm:text-base">
                                Keep your account details current, review your masked identity data, and control the parts of the workspace that are available to you right now.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                        <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/80">Profile</p>
                            <p className="mt-2 truncate text-lg font-semibold">{name || "Unnamed profile"}</p>
                            <p className="mt-1 truncate text-sm text-slate-200/80">{email || "No email on file"}</p>
                        </div>
                        <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/80">Identity</p>
                            <p className="mt-2 truncate font-mono text-xl font-semibold tracking-[0.16em]">{ssnDisplay}</p>
                            <p className="mt-1 text-sm text-slate-200/80">Masked SSN only</p>
                        </div>
                        <div className="min-w-0 rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm sm:col-span-2 xl:col-span-1">
                            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/80">Status</p>
                            <p className="mt-2 text-lg font-semibold">{profileStatus}</p>
                            <p className="mt-1 text-sm leading-5 text-slate-200/80">
                                {twoFactorEnabled ? "Extra login protection is active on this account." : "Identity is visible, but advanced protection has not been configured yet."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Control Center</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your account preferences</p>
            </div>

            {saved && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Changes saved successfully
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
                <div className="space-y-6">
                    <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-emerald-500" />
                                Profile
                            </CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5 p-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        placeholder="John Doe"
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        disabled
                                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,rgba(240,253,250,0.95),rgba(236,254,255,0.75))] p-5 dark:border-slate-800 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(8,47,73,0.78))]">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Identity on file</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                            Your SSN is stored securely and only the masked version is shown in the app.
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center rounded-full border border-emerald-300/60 bg-white/70 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
                                        {profileStatus}
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    <div className="rounded-2xl border border-white/60 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Masked SSN</p>
                                        <p className="mt-2 truncate font-mono text-2xl font-semibold tracking-[0.14em] text-slate-950 dark:text-white">{ssnDisplay}</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/60 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Visibility</p>
                                        <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">Masked in app</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Full SSN is never displayed here.</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleSaveProfile}
                                disabled={loading}
                                className="h-11 rounded-xl bg-[linear-gradient(135deg,#0f766e,#0f9b8e)] px-6 text-white hover:opacity-95"
                            >
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save Profile
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-emerald-500" />
                                Security
                            </CardTitle>
                            <CardDescription>Use the controls that are currently active on your account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                                                <Smartphone className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                                                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                                    {twoFactorEnabled ? "Extra login protection is active." : "Advanced protection is not enabled on this account yet."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${twoFactorEnabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"}`}>
                                        {twoFactorEnabled ? "Enabled" : "Not active"}
                                    </div>
                                </div>
                                {!twoFactorEnabled && (
                                    <div className="mt-4">
                                        <Button asChild variant="outline" className="h-10 rounded-xl">
                                            <Link href="/app/support">
                                                Contact Support
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Key className="h-5 w-5 text-slate-500" />
                                    <p className="font-medium text-slate-900 dark:text-white">Change Password</p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="current">Current</Label>
                                        <Input
                                            id="current"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(event) => setCurrentPassword(event.target.value)}
                                            placeholder="••••••••"
                                            className="h-11 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new">New</Label>
                                        <Input
                                            id="new"
                                            type="password"
                                            value={newPassword}
                                            onChange={(event) => setNewPassword(event.target.value)}
                                            placeholder="••••••••"
                                            className="h-11 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm">Confirm</Label>
                                        <Input
                                            id="confirm"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(event) => setConfirmPassword(event.target.value)}
                                            placeholder="••••••••"
                                            className="h-11 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <Button variant="outline" onClick={handleChangePassword} disabled={loading || !newPassword} className="h-11 rounded-xl">
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Update Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-emerald-500" />
                                Notifications
                            </CardTitle>
                            <CardDescription>These preferences are saved on this device</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <ToggleRow
                                label="Email Notifications"
                                description="Receive updates via email"
                                checked={notifications.email}
                                onToggle={() => handleToggleNotification("email", "Email notifications")}
                                icon={Mail}
                            />
                            <ToggleRow
                                label="Push Notifications"
                                description="Browser notifications for activity and alerts"
                                checked={notifications.push}
                                onToggle={() => handleToggleNotification("push", "Push notifications")}
                                icon={Bell}
                            />
                            <ToggleRow
                                label="SMS Alerts"
                                description="Text message alerts for sensitive events"
                                checked={notifications.sms}
                                onToggle={() => handleToggleNotification("sms", "SMS alerts")}
                                icon={Smartphone}
                            />
                            {notificationStatus && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">{notificationStatus}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                            <CardTitle className="flex items-center gap-2">
                                <Sun className="h-5 w-5 text-emerald-500" />
                                Appearance
                            </CardTitle>
                            <CardDescription>Switch the real app theme from here</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <button
                                type="button"
                                onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                                className="flex w-full items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/5"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                                        {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                            {mounted ? `Currently using ${isDarkMode ? "dark" : "light"} mode.` : "Loading theme preference..."}
                                        </p>
                                    </div>
                                </div>
                                <div className={`flex h-7 w-12 shrink-0 items-center rounded-full px-1 transition ${isDarkMode ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                                    <span className={`block h-5 w-5 rounded-full bg-white shadow transition ${isDarkMode ? "translate-x-5" : "translate-x-0"}`} />
                                </div>
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
