"use client";

import { MethodPage } from "../_components/method-page";

export default function PayPalTransferPage() {
  return (
    <MethodPage
      name="PayPal"
      accentFrom="from-indigo-500"
      accentTo="to-blue-500"
      identifierLabel="PayPal email"
      identifierPlaceholder="name@example.com"
      helper="We send a PayPal payout to this email. Ensure it matches your PayPal account."
    />
  );
}
