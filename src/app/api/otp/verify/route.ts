"use server";

import { NextResponse } from "next/server";
import crypto from "crypto";

const OTP_COOKIE = "otp_session";

type Body = {
  code?: string;
  purpose?: string;
};

function parseCookie(header: string | null) {
  if (!header) return null;
  const match = header
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${OTP_COOKIE}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=")[1]));
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  const { code, purpose = "transfer" } = (await req.json()) as Body;

  if (!code || code.length !== 6) {
    return NextResponse.json(
      { success: false, message: "Enter the 6-digit code." },
      { status: 400 }
    );
  }

  const cookieData = parseCookie(req.headers.get("cookie"));
  if (!cookieData) {
    return NextResponse.json(
      { success: false, message: "No OTP session. Please request a new code." },
      { status: 400 }
    );
  }

  const { hash, expiresAt, purpose: storedPurpose } = cookieData;

  if (Date.now() > expiresAt) {
    return NextResponse.json(
      { success: false, message: "Code expired. Please request a new one." },
      { status: 400 }
    );
  }

  if (storedPurpose !== purpose) {
    return NextResponse.json(
      { success: false, message: "Code does not match this action." },
      { status: 400 }
    );
  }

  const incomingHash = crypto.createHash("sha256").update(code).digest("hex");
  if (incomingHash !== hash) {
    return NextResponse.json(
      { success: false, message: "Invalid code." },
      { status: 400 }
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(OTP_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
