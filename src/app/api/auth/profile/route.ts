"use server";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, verifyIdToken } from "@/lib/firebase/admin";

function getBearerToken(request: Request) {
    const header = request.headers.get("authorization");

    if (!header?.startsWith("Bearer ")) {
        return null;
    }

    return header.slice(7);
}

function toMaskedSsn(maskedValue?: string, last4?: string) {
    const digits = `${maskedValue || ""}${last4 || ""}`.replace(/\D/g, "");

    if (digits.length < 4) {
        return "";
    }

    return `***-**-${digits.slice(-4)}`;
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Failed to load profile.";
}

export async function GET(request: Request) {
    const token = getBearerToken(request);

    if (!token) {
        return NextResponse.json({ success: false, message: "Missing authorization token." }, { status: 401 });
    }

    try {
        const decodedToken = await verifyIdToken(token);
        const userRef = adminDb.collection("users").doc(decodedToken.uid);
        const identityRef = userRef.collection("private").doc("identity");

        const [userSnapshot, identitySnapshot] = await Promise.all([
            userRef.get(),
            identityRef.get(),
        ]);

        const userData = userSnapshot.data() as {
            name?: string;
            email?: string;
            security?: { mfaEnabled?: boolean };
            identity?: { ssnMasked?: string; ssnLast4?: string };
        } | undefined;

        const identityData = identitySnapshot.data() as {
            ssnMasked?: string;
            ssnLast4?: string;
        } | undefined;

        const maskedSsn = toMaskedSsn(
            userData?.identity?.ssnMasked || identityData?.ssnMasked,
            userData?.identity?.ssnLast4 || identityData?.ssnLast4
        );

        if (!userSnapshot.exists) {
            return NextResponse.json(
                { success: false, message: "Profile not found." },
                { status: 404 }
            );
        }

        if (!userData?.identity?.ssnLast4 && identityData?.ssnLast4) {
            await userRef.set(
                {
                    identity: {
                        ssnLast4: identityData.ssnLast4,
                        ssnMasked: identityData.ssnMasked,
                        ssnProvidedAt: FieldValue.serverTimestamp(),
                    },
                },
                { merge: true }
            );
        }

        return NextResponse.json({
            success: true,
            profile: {
                uid: decodedToken.uid,
                name: userData?.name || decodedToken.name || "",
                email: userData?.email || decodedToken.email || "",
                maskedSsn,
                mfaEnabled: Boolean(userData?.security?.mfaEnabled),
            },
        });
    } catch (error: unknown) {
        console.error("load profile error:", error);

        return NextResponse.json(
            { success: false, message: getErrorMessage(error) },
            { status: 500 }
        );
    }
}
