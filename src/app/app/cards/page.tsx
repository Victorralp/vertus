"use client";

import { useState } from "react";
import {
    CreditCard,
    Shield,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Copy,
    CheckCircle2,
    Plus,
    Smartphone
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Card data
const cards = [
    {
        id: "card1",
        name: "NexusCard Essential",
        type: "Virtual Debit",
        number: "4532 •••• •••• 8956",
        fullNumber: "4532 7891 2345 8956",
        expiry: "12/28",
        cvv: "123",
        frozen: false,
        color: "from-gray-800 to-gray-900",
        lastUsed: "Today at 2:34 PM"
    },
    {
        id: "card2",
        name: "NexusCard Rewards",
        type: "Premium Debit",
        number: "5412 •••• •••• 3421",
        fullNumber: "5412 6789 0123 3421",
        expiry: "08/27",
        cvv: "456",
        frozen: false,
        color: "from-emerald-500 to-teal-600",
        lastUsed: "Yesterday"
    },
];

export default function CardsPage() {
    const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
    const [frozenCards, setFrozenCards] = useState<Record<string, boolean>>({});
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const toggleDetails = (cardId: string) => {
        setShowDetails(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    };

    const toggleFreeze = (cardId: string) => {
        setFrozenCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text.replace(/\s/g, ''));
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cards</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your virtual cards</p>
                </div>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
                    <Plus className="h-4 w-4 mr-1" />
                    Request New Card
                </Button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {cards.map((card) => {
                    const isShowing = showDetails[card.id];
                    const isFrozen = frozenCards[card.id];

                    return (
                        <div key={card.id} className="space-y-4">
                            {/* Card Visual */}
                            <div className={`relative h-56 rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white shadow-xl ${isFrozen ? 'opacity-60' : ''}`}>
                                {isFrozen && (
                                    <div className="absolute inset-0 bg-gray-900/50 rounded-2xl flex items-center justify-center">
                                        <div className="text-center">
                                            <Lock className="h-8 w-8 mx-auto mb-2" />
                                            <p className="font-medium">Card Frozen</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm opacity-80">{card.type}</p>
                                        <p className="font-bold text-lg">{card.name}</p>
                                    </div>
                                    <CreditCard className="h-8 w-8 opacity-80" />
                                </div>

                                <div className="mt-8">
                                    <p className="text-sm opacity-80 mb-1">Card Number</p>
                                    <p className="text-xl font-mono tracking-wider">
                                        {isShowing ? card.fullNumber : card.number}
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs opacity-80">Expires</p>
                                        <p className="font-medium">{isShowing ? card.expiry : '••/••'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs opacity-80">CVV</p>
                                        <p className="font-medium">{isShowing ? card.cvv : '•••'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs opacity-80">Last Used</p>
                                        <p className="text-sm">{card.lastUsed}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Controls */}
                            <Card>
                                <CardContent className="pt-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
                                            onClick={() => toggleDetails(card.id)}
                                        >
                                            {isShowing ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            {isShowing ? 'Hide Details' : 'Show Details'}
                                        </Button>

                                        <Button
                                            variant={isFrozen ? "default" : "outline"}
                                            className={`flex items-center gap-2 ${isFrozen ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                                            onClick={() => toggleFreeze(card.id)}
                                        >
                                            {isFrozen ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                            {isFrozen ? 'Unfreeze' : 'Freeze'}
                                        </Button>
                                    </div>

                                    {isShowing && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                                            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                <div>
                                                    <p className="text-xs text-gray-500">Card Number</p>
                                                    <p className="font-mono text-sm">{card.fullNumber}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(card.fullNumber, `${card.id}-number`)}
                                                >
                                                    {copiedField === `${card.id}-number` ? (
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                    <p className="text-xs text-gray-500">Expiry</p>
                                                    <p className="font-mono text-sm">{card.expiry}</p>
                                                </div>
                                                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                    <p className="text-xs text-gray-500">CVV</p>
                                                    <p className="font-mono text-sm">{card.cvv}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            {/* Digital Wallet */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-emerald-500" />
                        Add to Digital Wallet
                    </CardTitle>
                    <CardDescription>Use your cards with Apple Pay, Google Pay, and more</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="h-12 px-6">
                            Apple Pay
                        </Button>
                        <Button variant="outline" className="h-12 px-6">
                            Google Pay
                        </Button>
                        <Button variant="outline" className="h-12 px-6">
                            Samsung Pay
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800 dark:text-amber-200">
                            <p className="font-medium">Card Security</p>
                            <p className="mt-1">Your card details are encrypted and never stored on your device. Use the freeze feature if you suspect any unauthorized activity.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
