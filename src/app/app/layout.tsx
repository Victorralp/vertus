"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Receipt,
    Send,
    Globe,
    PlusCircle,
    RefreshCw,
    Landmark,
    FileText,
    Gift,
    HelpCircle,
    Clock3
} from "lucide-react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { VertexLogo } from "@/components/shared/vertex-logo";

const navigation = [
    {
        section: "MAIN",
        items: [
            { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
            { name: "Recent Activity", href: "/app/recent-activity", icon: Clock3 },
            { name: "Transactions", href: "/app/transactions", icon: Receipt },
            { name: "Cards", href: "/app/cards", icon: CreditCard },
        ]
    },
    {
        section: "TRANSFERS",
        items: [
            { name: "Local Transfer", href: "/app/transfers/local", icon: Send },
            { name: "International", href: "/app/transfers/international", icon: Globe },
            { name: "Deposit", href: "/app/deposit", icon: PlusCircle },
            { name: "Currency Swap", href: "/app/currency-swap", icon: RefreshCw },
        ]
    },
    {
        section: "SERVICES",
        items: [
            { name: "Loans", href: "/app/loans", icon: Landmark },
            { name: "Tax Refund", href: "/app/tax-refund", icon: FileText },
            { name: "Grants", href: "/app/grants", icon: Gift },
        ]
    },
    {
        section: "ACCOUNT",
        items: [
            { name: "Settings", href: "/app/settings", icon: Settings },
            { name: "Support", href: "/app/support", icon: HelpCircle },
        ]
    }
];

function Sidebar({ mobile = false, onClose, user }: { mobile?: boolean; onClose?: () => void; user: FirebaseUser | null }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/sign-in");
    };

    return (
        <div
            className={`flex h-full flex-col ${mobile ? "w-full" : "w-64"} border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0f1419]`}
        >
            {/* Logo */}
            <div className="p-4">
                <Link href="/app/dashboard" onClick={onClose}>
                    <VertexLogo width={176} height={48} />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="scrollbar-none flex-1 space-y-6 overflow-y-auto px-3 py-4">
                {navigation.map((section) => (
                    <div key={section.section}>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                            {section.section}
                        </p>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Sign out"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function Header({ user, onMenuClick }: { user: FirebaseUser | null; onMenuClick: () => void }) {
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, title: "Payment received", detail: "£420.00 from Acme Ltd", time: "2m ago" },
        { id: 2, title: "Card purchase", detail: "Starbucks • $8.90", time: "12m ago" },
        { id: 3, title: "Security alert", detail: "New sign-in from Chrome on Windows", time: "1h ago" },
    ];

    return (
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1419] flex items-center justify-between px-4 lg:px-6 relative">
            <div className="flex items-center gap-4">
                <button
                    className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={onMenuClick}
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Welcome back, {user?.displayName?.split(' ')[0] || 'John'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 relative">
                {/* Theme toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white relative"
                    onClick={() => setShowNotifications((v) => !v)}
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full" />
                </button>

                {showNotifications && (
                    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#0f1419] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-30">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{notifications.length} new</p>
                            </div>
                            <button
                                type="button"
                                className="text-xs text-blue-600 hover:underline"
                                onClick={() => setShowNotifications(false)}
                            >
                                Close
                            </button>
                        </div>
                        <div className="scrollbar-none max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                            {notifications.map((note) => (
                                <div key={note.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/60">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{note.title}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{note.detail}</p>
                                    <p className="text-[11px] text-gray-400 mt-1">{note.time}</p>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-center">
                            <Link href="/app/notifications" className="text-sm text-blue-600 hover:underline">
                                View all notifications
                            </Link>
                        </div>
                    </div>
                )}

                {/* User */}
                <Link href="/app/settings" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                </Link>
            </div>
        </header>
    );
}

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Prefetch all primary app routes so navigation feels instant.
    useEffect(() => {
        navigation.forEach((section) => {
            section.items.forEach((item) => {
                router.prefetch(item.href);
            });
        });
    }, [router]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/sign-in");
                return;
            }
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0e13]">
            {/* Desktop Sidebar */}
            <div className="hidden h-screen shrink-0 lg:block">
                <Sidebar user={user} />
            </div>

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-72 z-50">
                        <div className="absolute top-4 right-4">
                            <button
                                className="p-2 text-gray-400 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <Sidebar mobile onClose={() => setMobileMenuOpen(false)} user={user} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <Header user={user} onMenuClick={() => setMobileMenuOpen(true)} />
                <main className="scrollbar-none flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
