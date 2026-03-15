"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ArrowLeft, Shield } from "lucide-react";

type MethodPageProps = {
  name: string;
  accentFrom: string; // tailwind gradient from
  accentTo: string; // tailwind gradient to
  identifierLabel: string;
  identifierPlaceholder: string;
  helper?: string;
};

export function MethodPage({
  name,
  accentFrom,
  accentTo,
  identifierLabel,
  identifierPlaceholder,
  helper,
}: MethodPageProps) {
  const router = useRouter();
  const [form, setForm] = useState({ amount: "", identifier: "", pin: "", note: "" });
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!form.amount || !form.identifier || !form.pin) return;
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" className="gap-2" onClick={() => router.push("/app/transfers/international")}> 
          <ArrowLeft className="h-4 w-4" />
          Back to methods
        </Button>

        <Card className="text-center">
          <CardContent className="pt-12 pb-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{name} transfer started</h2>
              <p className="text-gray-500 dark:text-gray-400">We are processing your request. You can track it in Transactions.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push("/app/transactions")}>View transactions</Button>
              <Button onClick={() => { setSuccess(false); setForm({ amount: "", identifier: "", pin: "", note: "" }); }}>New transfer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.push("/app/transfers/international")}> 
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className={`bg-gradient-to-r ${accentFrom} ${accentTo} text-white border-0`}>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-1">{name} Transfer</h1>
          <p className="text-white/80 text-sm">Complete the form below to start your {name.toLowerCase()} transfer.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transfer details</CardTitle>
              <CardDescription>Enter the amount and destination details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Amount (USD)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{identifierLabel}</Label>
                <Input
                  placeholder={identifierPlaceholder}
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                />
                {helper && <p className="text-xs text-gray-500">{helper}</p>}
              </div>
              <div className="space-y-2">
                <Label>Transaction PIN</Label>
                <Input
                  type="password"
                  placeholder="Enter your PIN"
                  value={form.pin}
                  onChange={(e) => setForm({ ...form, pin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Note (optional)</Label>
                <Input
                  placeholder="Purpose or reference"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
              <Button className="w-full" disabled={!form.amount || !form.identifier || !form.pin} onClick={handleSubmit}>
                Submit {name} transfer
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Secure processing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">All payments are encrypted and monitored for fraud. Never share your PIN.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transfer tips</CardTitle>
              <CardDescription>Reduce delays and rejections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <p>• Make sure the destination details match your recipient’s account.</p>
              <p>• Large transfers may require additional verification.</p>
              <p>• Contact support if you need to cancel within 30 minutes.</p>
              <Button variant="outline" className="w-full" onClick={() => router.push("/app/support")}>Contact support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
