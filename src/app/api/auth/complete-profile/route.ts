"use server";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, verifyIdToken } from "@/lib/firebase/admin";
import { encryptSensitiveValue, maskSensitiveValue } from "@/lib/security/encryption";

type Body = {
    email?: string;
    name?: string;
    ssn?: string;
};

function getBearerToken(request: Request) {
    const header = request.headers.get("authorization");

    if (!header?.startsWith("Bearer ")) {
        return null;
    }

    return header.slice(7);
}

function normalizeSsn(ssn: string) {
    return ssn.replace(/\D/g, "");
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Failed to complete account setup.";
}

export async function POST(request: Request) {
    const token = getBearerToken(request);

    if (!token) {
        return NextResponse.json({ success: false, message: "Missing authorization token." }, { status: 401 });
    }

    const { email, name, ssn } = (await request.json()) as Body;

    if (!email || !name || !ssn) {
        return NextResponse.json(
            { success: false, message: "Email, name, and SSN are required." },
            { status: 400 }
        );
    }

    const normalizedSsn = normalizeSsn(ssn);

    if (!/^\d{9}$/.test(normalizedSsn)) {
        return NextResponse.json(
            { success: false, message: "SSN must be exactly 9 digits." },
            { status: 400 }
        );
    }

    try {
        const decodedToken = await verifyIdToken(token);

        if (decodedToken.email !== email) {
            return NextResponse.json(
                { success: false, message: "Authenticated user does not match the requested email." },
                { status: 403 }
            );
        }

        const now = FieldValue.serverTimestamp();
        const ssnLast4 = normalizedSsn.slice(-4);
        const batch = adminDb.batch();
        const userRef = adminDb.collection("users").doc(decodedToken.uid);
        const privateIdentityRef = userRef.collection("private").doc("identity");

        batch.set(userRef, {
            uid: decodedToken.uid,
            email,
            name: name.trim(),
            role: "user",
            createdAt: now,
            lastLoginAt: null,
            security: {
                emailVerified: false,
                mfaEnabled: false,
                totpEnabled: false,
            },
            identity: {
                ssnLast4,
                ssnMasked: maskSensitiveValue(normalizedSsn),
                ssnProvidedAt: now,
            },
        });

        batch.set(privateIdentityRef, {
            uid: decodedToken.uid,
            ssnEncrypted: encryptSensitiveValue(normalizedSsn),
            ssnLast4,
            ssnMasked: maskSensitiveValue(normalizedSsn),
            createdAt: now,
            updatedAt: now,
        });

        await batch.commit();

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error("complete profile error:", error);

        return NextResponse.json(
            { success: false, message: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
