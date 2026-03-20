import "server-only";

import { createCipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

function getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY;

    if (!key) {
        console.warn("WARNING: Using default encryption key. Set ENCRYPTION_KEY in production!");
        return scryptSync("default-dev-key-change-in-production", "salt", 32);
    }

    return scryptSync(key, "nexusbank-salt", 32);
}

export function encryptSensitiveValue(plaintext: string) {
    const key = getEncryptionKey();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${encrypted}`;
}

export function maskSensitiveValue(value: string) {
    if (value.length <= 4) {
        return "****";
    }

    return `${"*".repeat(value.length - 4)}${value.slice(-4)}`;
}
