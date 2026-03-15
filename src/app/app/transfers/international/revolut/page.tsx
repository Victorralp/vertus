"use client";

import { MethodPage } from "../_components/method-page";

export default function RevolutTransferPage() {
  return (
    <MethodPage
      name="Revolut"
      accentFrom="from-slate-700"
      accentTo="to-slate-500"
      identifierLabel="Revolut username or phone"
      identifierPlaceholder="@user or +44 7700 900000"
      helper="Enter the recipient’s Revolut tag or verified phone number."
    />
  );
}
