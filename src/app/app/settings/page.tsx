"use client";

import { useState, useEffect } from "react";
import {
    Settings,
    User,
    Shield,
    Bell,
    Moon,
    Sun,
    Lock,
    Smartphone,
    Mail,
    Key,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onAuthStateChanged, User as FirebaseUser, updateProfile, updatePassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function SettingsPage() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false
    });
    const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setName(currentUser.displayName || "");
                setEmail(currentUser.email || "");
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSaveProfile = async () => {
        if (!user) return;
        setLoading(true);
        setError("");
        setSaved(false);

        try {
            await updateProfile(user, { displayName: name });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!user) return;
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
        } catch (err) {
            setError("Failed to change password. You may need to re-authenticate.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account preferences</p>
            </div>

            {/* Success/Error Messages */}
            {saved && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    Changes saved successfully
                </div>
            )}
            {error && (
                <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-emerald-500" />
                        Profile
                    </CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                disabled
                                className="bg-gray-50 dark:bg-gray-900"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSaveProfile} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Save Changes
                    </Button>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-emerald-500" />
                        Security
                    </CardTitle>
                    <CardDescription>Manage your security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Two-Factor */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-500">Extra security for your account</p>
                            </div>
                        </div>
                        <Button
                            variant={twoFactorEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                            className={twoFactorEnabled ? "bg-emerald-600" : ""}
                        >
                            {twoFactorEnabled ? "Enabled" : "Enable"}
                        </Button>
                    </div>

                    {/* Change Password */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-gray-500" />
                            <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="current">Current</Label>
                                <Input
                                    id="current"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new">New</Label>
                                <Input
                                    id="new"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm</Label>
                                <Input
                                    id="confirm"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleChangePassword} disabled={loading || !newPassword}>
                            Update Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-emerald-500" />
                        Notifications
                    </CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { key: "email", label: "Email Notifications", icon: Mail, desc: "Receive updates via email" },
                        { key: "push", label: "Push Notifications", icon: Bell, desc: "Browser notifications" },
                        { key: "sms", label: "SMS Alerts", icon: Smartphone, desc: "Text message alerts" },
                    ].map(({ key, label, icon: Icon, desc }) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                            <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                                    <p className="text-sm text-gray-500">{desc}</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                aria-pressed={notifications[key as keyof typeof notifications]}
                                onClick={() =>
                                    setNotifications((prev) => {
                                        const updated = !prev[key as keyof typeof notifications];
                                        setNotificationStatus(`${label} ${updated ? "enabled" : "disabled"}`);
                                        return { ...prev, [key]: updated };
                                    })
                                }
                                className={`w-16 justify-between ${notifications[key as keyof typeof notifications] ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : ''}`}
                            >
                                <span className="text-xs">{notifications[key as keyof typeof notifications] ? 'On' : 'Off'}</span>
                                <div
                                    className={`w-8 h-4 rounded-full transition-colors ${notifications[key as keyof typeof notifications] ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${notifications[key as keyof typeof notifications] ? 'translate-x-4' : 'translate-x-0.5'
                                            }`}
                                    />
                                </div>
                            </Button>
                        </div>
                    ))}
                    {notificationStatus && (
                        <p className="text-xs text-emerald-600 mt-2">{notificationStatus}</p>
                    )}
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-emerald-500" />
                        Appearance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                                <p className="text-sm text-gray-500">Toggle dark theme</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            aria-pressed={darkMode}
                            onClick={() => setDarkMode(!darkMode)}
                            className={`w-16 justify-between ${darkMode ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : ''}`}
                        >
                            <span className="text-xs">{darkMode ? 'On' : 'Off'}</span>
                            <div className={`w-8 h-4 rounded-full transition-colors ${darkMode ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                <span className={`block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
