"use client";

import { MethodPage } from "../_components/method-page";

export default function WiseTransferPage() {
  return (
    <MethodPage
      name="Wise"
      accentFrom="from-emerald-500"
      accentTo="to-teal-500"
      identifierLabel="Wise account email"
      identifierPlaceholder="name@example.com"
      helper="Enter the email associated with the recipient’s Wise account."
    />
  );
}
