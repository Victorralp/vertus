"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Clock4, ShieldAlert, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Notification = {
    id: number;
    title: string;
    detail: string;
    time: string;
    type: "payment" | "security" | "system";
    read: boolean;
};

const seed: Notification[] = [
    { id: 1, title: "Payment received", detail: "£420.00 from Acme Ltd", time: "2m ago", type: "payment", read: false },
    { id: 2, title: "Card purchase", detail: "Starbucks • $8.90", time: "12m ago", type: "payment", read: false },
    { id: 3, title: "Security alert", detail: "New sign-in from Chrome on Windows", time: "1h ago", type: "security", read: false },
    { id: 4, title: "Scheduled transfer", detail: "Wire to HSBC set for tomorrow 9:00", time: "3h ago", type: "system", read: true },
];

export default function NotificationsPage() {
    const [items, setItems] = useState<Notification[]>(seed);
    const unreadCount = items.filter((n) => !n.read).length;

    const markAllRead = () =>
        setItems((prev) => prev.map((n) => ({ ...n, read: true })));

    const clearRead = () =>
        setItems((prev) => prev.filter((n) => !n.read));

    const toggleRead = (id: number) =>
        setItems((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
        );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {unreadCount} unread · {items.length} total
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={markAllRead} disabled={!unreadCount}>
                        Mark all read
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearRead} disabled={items.length === unreadCount}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear read
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-blue-500" />
                        <CardTitle>Activity feed</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        Live demo
                    </Badge>
                </CardHeader>
                <CardContent className="divide-y divide-gray-100 dark:divide-gray-800">
                    {items.length === 0 && (
                        <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                            No notifications yet.
                        </div>
                    )}
                    {items.map((n) => (
                        <div
                            key={n.id}
                            className={`py-4 flex items-start gap-3 ${n.read ? "opacity-70" : ""}`}
                        >
                            <div className="pt-1">
                                {n.type === "payment" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                                {n.type === "security" && <ShieldAlert className="h-5 w-5 text-amber-500" />}
                                {n.type === "system" && <Clock4 className="h-5 w-5 text-blue-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900 dark:text-white">{n.title}</p>
                                    {!n.read && (
                                        <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{n.detail}</p>
                                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => toggleRead(n.id)}>
                                {n.read ? "Mark unread" : "Mark read"}
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
