"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

export default function WireTransferPage() {
  const [form, setForm] = useState({
    amount: "",
    beneficiary: "",
    iban: "",
    swift: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const disabled =
    !form.amount || !form.beneficiary || !form.iban || !form.swift;

  const Orb = () => (
    <div className="relative h-44 w-44 mx-auto mb-6">
      <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
      <div className="absolute inset-4 rounded-full border border-emerald-400/30 animate-ping [animation-delay:200ms]" />
      <div className="absolute inset-8 rounded-full border border-blue-400/30 animate-ping [animation-delay:400ms]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_30px_14px_rgba(16,185,129,0.35)] animate-pulse" />
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="relative min-h-[75vh] overflow-hidden rounded-2xl bg-slate-950 text-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.12),transparent_32%),radial-gradient(circle_at_50%_70%,rgba(59,130,246,0.12),transparent_28%)] blur-sm" />
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-xl" />

        <div className="relative flex flex-col items-center justify-center p-10 space-y-6 text-center">
          <Orb />
          <div className="h-14 w-14 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-cyan-200">Wire Initiated</h1>
            <p className="text-slate-300 mt-2">
              We’re processing your international wire. You can track status in Transactions.
            </p>
          </div>
          <Button variant="outline" onClick={() => setSubmitted(false)} className="border-cyan-300/40 text-cyan-100 hover:bg-white/5">
            Start another wire
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[90vh] overflow-hidden rounded-2xl bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_82%_26%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_52%_70%,rgba(14,165,233,0.14),transparent_30%)] blur-sm" />
      <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-xl" />

      <div className="relative grid lg:grid-cols-2 gap-8 p-6 lg:p-10 items-start">
        <div className="text-center lg:text-left space-y-4">
          <Orb />
          <h1 className="text-3xl font-semibold text-cyan-200 tracking-tight">International Wire</h1>
          <p className="text-slate-300 max-w-xl">
            Send high-value transfers securely. Enter recipient details; we’ll route via SWIFT with live status.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-cyan-300/30 text-xs text-cyan-100">End-to-end encryption</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-cyan-300/30 text-xs text-cyan-100">FX auto-optimized</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-cyan-300/30 text-xs text-cyan-100">Typical speed: 1-3 hrs</span>
          </div>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white">Wire Details</CardTitle>
            <CardDescription className="text-slate-400">Complete all required fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label>Beneficiary Name</Label>
              <Input
                placeholder="Full legal name"
                value={form.beneficiary}
                onChange={(e) => setForm({ ...form, beneficiary: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label>IBAN / Account</Label>
              <Input
                placeholder="Enter IBAN or account number"
                value={form.iban}
                onChange={(e) => setForm({ ...form, iban: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label>SWIFT / BIC</Label>
              <Input
                placeholder="e.g., BKTRUS33"
                value={form.swift}
                onChange={(e) => setForm({ ...form, swift: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Input
                placeholder="Purpose or reference"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 border-0 shadow-lg shadow-blue-500/25"
              disabled={disabled}
              onClick={() => setSubmitted(true)}
            >
              Send Wire
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
