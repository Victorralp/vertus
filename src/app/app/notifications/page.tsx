"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Bell,
    CheckCircle2,
    Clock4,
    ShieldAlert,
    Trash2,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type NotificationType = "payment" | "security" | "system";
type Filter = "all" | "unread" | "security";

type Notification = {
    id: number;
    title: string;
    detail: string;
    time: string;
    type: NotificationType;
    read: boolean;
};

const seed: Notification[] = [
    { id: 1, title: "Payment received", detail: "£420.00 from Acme Ltd", time: "2m ago", type: "payment", read: false },
    { id: 2, title: "Card purchase", detail: "Starbucks • $8.90", time: "12m ago", type: "payment", read: false },
    { id: 3, title: "Security alert", detail: "New sign-in from Chrome on Windows", time: "1h ago", type: "security", read: false },
    { id: 4, title: "Scheduled transfer", detail: "Wire to HSBC set for tomorrow 9:00", time: "3h ago", type: "system", read: true },
];

const storageKey = "app-notifications-feed";

function getNotificationMeta(type: NotificationType) {
    if (type === "payment") {
        return {
            label: "Payment",
            icon: CheckCircle2,
            iconClassName: "text-emerald-500",
            badgeClassName: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
        };
    }

    if (type === "security") {
        return {
            label: "Security",
            icon: ShieldAlert,
            iconClassName: "text-amber-500",
            badgeClassName: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
        };
    }

    return {
        label: "System",
        icon: Clock4,
        iconClassName: "text-sky-500",
        badgeClassName: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
    };
}

function FilterButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-900"
            }`}
        >
            {label}
        </button>
    );
}

export default function NotificationsPage() {
    const [items, setItems] = useState<Notification[]>(seed);
    const [filter, setFilter] = useState<Filter>("all");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        try {
            const saved = window.localStorage.getItem(storageKey);

            if (!saved) {
                return;
            }

            const parsed = JSON.parse(saved) as Notification[];
            if (Array.isArray(parsed)) {
                setItems(parsed);
            }
        } catch {
            window.localStorage.removeItem(storageKey);
        }
    }, []);

    useEffect(() => {
        if (!mounted) {
            return;
        }

        window.localStorage.setItem(storageKey, JSON.stringify(items));
    }, [mounted, items]);

    const unreadCount = items.filter((notification) => !notification.read).length;
    const securityCount = items.filter((notification) => notification.type === "security").length;
    const hasUnread = unreadCount > 0;

    const filteredItems = useMemo(() => {
        if (filter === "unread") {
            return items.filter((notification) => !notification.read);
        }

        if (filter === "security") {
            return items.filter((notification) => notification.type === "security");
        }

        return items;
    }, [filter, items]);

    const markAllRead = () => {
        setItems((previous) => previous.map((notification) => ({ ...notification, read: true })));
    };

    const clearRead = () => {
        setItems((previous) => previous.filter((notification) => !notification.read));
    };

    const toggleRead = (id: number) => {
        setItems((previous) =>
            previous.map((notification) =>
                notification.id === id ? { ...notification, read: !notification.read } : notification
            )
        );
    };

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <section
                className={`relative overflow-hidden rounded-[32px] border border-slate-200 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.18)] dark:border-slate-800 ${
                    hasUnread
                        ? "bg-[linear-gradient(140deg,#111827_0%,#1d4d4f_52%,#ecfeff_100%)]"
                        : "bg-[linear-gradient(140deg,#111827_0%,#243244_52%,#e2e8f0_100%)]"
                }`}
            >
                <div
                    className={`absolute inset-0 ${
                        hasUnread
                            ? "bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_30%)]"
                            : "bg-[radial-gradient(circle_at_top_right,rgba(148,163,184,0.14),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(71,85,105,0.18),transparent_30%)]"
                    }`}
                />
                <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
                    <div className="min-w-0 space-y-4 text-white">
                        <div className={`inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] ${hasUnread ? "text-cyan-100" : "text-slate-200"}`}>
                            Notification Center
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Activity, alerts, and security events</h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-200/90 sm:text-base">
                                Track incoming payments, card activity, and account security updates in one place without the feed spilling across the page.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                            <p className={`text-xs uppercase tracking-[0.22em] ${hasUnread ? "text-cyan-100/80" : "text-slate-200/80"}`}>Unread</p>
                            <p className="mt-2 text-3xl font-semibold">{unreadCount}</p>
                            <p className="mt-1 text-sm text-slate-200/80">Still waiting for review</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                            <p className={`text-xs uppercase tracking-[0.22em] ${hasUnread ? "text-cyan-100/80" : "text-slate-200/80"}`}>Security</p>
                            <p className="mt-2 text-3xl font-semibold">{securityCount}</p>
                            <p className="mt-1 text-sm text-slate-200/80">Protection-related events</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm sm:col-span-3 xl:col-span-1">
                            <p className={`text-xs uppercase tracking-[0.22em] ${hasUnread ? "text-cyan-100/80" : "text-slate-200/80"}`}>Feed Size</p>
                            <p className="mt-2 text-3xl font-semibold">{items.length}</p>
                            <p className="mt-1 text-sm text-slate-200/80">Active notifications in your feed</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Feed Controls</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Filter the feed and clear notifications you have already reviewed.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={markAllRead}
                        disabled={!unreadCount}
                        className="h-10 rounded-xl"
                    >
                        Mark All Read
                    </Button>
                    <Button
                        variant="outline"
                        onClick={clearRead}
                        disabled={items.length === unreadCount || items.length === 0}
                        className="h-10 rounded-xl"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear Read
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <FilterButton active={filter === "all"} label="All Activity" onClick={() => setFilter("all")} />
                <FilterButton active={filter === "unread"} label="Unread" onClick={() => setFilter("unread")} />
                <FilterButton active={filter === "security"} label="Security" onClick={() => setFilter("security")} />
            </div>

            <Card className="overflow-hidden rounded-[28px] border-slate-200 shadow-sm dark:border-slate-800">
                <CardHeader className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-emerald-500" />
                                <CardTitle>Activity Feed</CardTitle>
                            </div>
                            <CardDescription className="mt-1">
                                {filteredItems.length} item{filteredItems.length === 1 ? "" : "s"} in the current view
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                                <Bell className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">No notifications in this view</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Try another filter or wait for new activity.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredItems.map((notification) => {
                                const meta = getNotificationMeta(notification.type);
                                const Icon = meta.icon;

                                return (
                                    <div
                                        key={notification.id}
                                        className={`grid gap-4 px-6 py-5 transition hover:bg-slate-50/70 dark:hover:bg-slate-900/50 lg:grid-cols-[auto_minmax(0,1fr)_auto] ${
                                            notification.read ? "opacity-75" : ""
                                        }`}
                                    >
                                        <div
                                            className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${
                                                notification.read
                                                    ? "border-slate-200 bg-slate-100/80 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500"
                                                    : `border-transparent bg-slate-100 dark:bg-slate-900 ${meta.iconClassName}`
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
                                                    {notification.title}
                                                </p>
                                                {!notification.read && (
                                                    <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-sky-500" />
                                                )}
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                                        notification.read
                                                            ? "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                                                            : meta.badgeClassName
                                                    }`}
                                                >
                                                    {meta.label}
                                                </span>
                                            </div>
                                            <p className="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-slate-400">
                                                {notification.detail}
                                            </p>
                                            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                                                {notification.time}
                                            </p>
                                        </div>

                                        <div className="flex items-center lg:justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleRead(notification.id)}
                                                className="h-10 rounded-xl"
                                            >
                                                {notification.read ? "Mark Unread" : "Mark Read"}
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
