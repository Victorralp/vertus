"use server";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { adminAuth } from "@/lib/firebase/admin";

type Body = { email?: string };

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function POST(req: Request) {
  const { email } = (await req.json()) as Body;
  if (!email) {
    return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
  }

  try {
    const continueUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`
      : "http://localhost:3000/verify-email";

    const link = await adminAuth.generateEmailVerificationLink(email, {
      url: continueUrl,
      handleCodeInApp: true,
    });

    const transporter = createTransporter();
    if (!transporter) {
      console.warn("SMTP not configured; logging verification link instead.");
      console.log(`Verify link for ${email}: ${link}`);
    } else {
      const fromEmail =
        process.env.SMTP_FROM ||
        process.env.SMTP_USER ||
        "Vertex Credit Union <no-reply@vertexcu.com>";
      const replyTo = process.env.SMTP_REPLY_TO || process.env.SMTP_FROM || process.env.SMTP_USER;
      await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: "Complete your Vertex account verification",
        replyTo,
        headers: {
          "List-Unsubscribe":
            process.env.SMTP_UNSUBSCRIBE_URL ||
            (replyTo ? `<mailto:${replyTo}>` : undefined),
        },
        text: [
          "Welcome to Vertex Credit Union!",
          "",
          "Please verify your email to activate secure access to your account:",
          link,
          "",
          "If you didn't create this account, you can safely ignore this message.",
          "",
          "Vertex Credit Union • Secure Banking Platform",
        ].join("\n"),
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body { margin:0; padding:0; background:#0b1220; font-family:'Inter', Arial, sans-serif; }
    .wrapper { width:100%; padding:28px 12px; }
    .card { max-width:640px; margin:0 auto; background:#0f172a; border:1px solid #1f2937; border-radius:16px; box-shadow:0 18px 50px rgba(0,0,0,0.35); overflow:hidden; }
    .header { padding:28px 32px; background:linear-gradient(135deg,#0ea5e9 0%,#10b981 60%,#0f172a 100%); text-align:center; }
    .brand { margin:0; color:#0b1220; font-size:26px; font-weight:800; letter-spacing:-0.4px; }
    .sub { margin:6px 0 0 0; color:#0b1220; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; font-weight:700; }
    .body { padding:32px 36px; color:#e5e7eb; }
    .h1 { margin:0 0 10px 0; font-size:22px; color:#e0f2fe; }
    .p { margin:0 0 16px 0; font-size:15px; color:#cbd5e1; line-height:1.6; }
    .button { display:inline-block; padding:14px 20px; border-radius:10px; background:#0ea5e9; color:#0b1220; font-weight:700; text-decoration:none; font-size:15px; box-shadow:0 10px 30px rgba(14,165,233,0.35); }
    .note { margin:18px 0 0 0; font-size:12px; color:#94a3b8; }
    .footer { padding:18px 24px; background:#0b1220; border-top:1px solid #1f2937; color:#64748b; font-size:12px; text-align:center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <p class="brand">Vertex Credit Union</p>
        <p class="sub">Secure Verification</p>
      </div>
      <div class="body">
        <p class="h1">Verify your email</p>
        <p class="p">Welcome to Vertex. For your security, please confirm your email to enable transfers, cards, and support.</p>
        <p><a class="button" href="${link}">Verify email</a></p>
        <p class="note">If you didn’t create this account, you can safely ignore this email.</p>
      </div>
      <div class="footer">
        Vertex Credit Union • 200 Market St, Suite 500 • San Francisco, CA 94105<br/>
        You’re receiving this because verification is required for new accounts.
      </div>
    </div>
  </div>
</body>
</html>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("send verification email error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send verification email." },
      { status: 500 }
    );
  }
}
