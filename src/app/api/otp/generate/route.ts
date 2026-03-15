"use server";

import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

const OTP_COOKIE = "otp_session";
const EXPIRES_MIN = 5;

type Body = {
  email?: string;
  purpose?: string;
};

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function POST(req: Request) {
  const { email, purpose = "transfer" } = (await req.json()) as Body;

  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required to send OTP." },
      { status: 400 }
    );
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const hash = crypto.createHash("sha256").update(code).digest("hex");
  const expiresAt = Date.now() + EXPIRES_MIN * 60_000;

  // Send email
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP not configured; logging OTP instead.");
    console.log(`OTP for ${email}: ${code} (expires in ${EXPIRES_MIN}m)`);
  } else {
    const fromEmail =
      process.env.SMTP_FROM || "Vertex Credit Union <no-reply@vertexcu.com>";
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "Your Vertex verification code (expires in 5 minutes)",
      text: `Use this code to ${purpose === "transfer" ? "complete your transfer" : "verify your action"}:\n\n${code}\n\nExpires in ${EXPIRES_MIN} minutes.\nDo not share this code with anyone.`,
    });
  }

  const res = NextResponse.json({ success: true, expiresInMinutes: EXPIRES_MIN });
  res.cookies.set(
    OTP_COOKIE,
    JSON.stringify({ hash, expiresAt, purpose }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: EXPIRES_MIN * 60,
      path: "/",
    }
  );
  return res;
}
