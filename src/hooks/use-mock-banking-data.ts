"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { createMockBankingData } from "@/lib/data/mock-banking";

export function useMockBankingData() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const userKey = user?.uid || user?.email || "guest";
    const data = useMemo(() => createMockBankingData(userKey), [userKey]);

    return {
        user,
        loading,
        userKey,
        ...data,
    };
}
