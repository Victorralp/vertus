"use client";

import { MethodPage } from "../_components/method-page";

export default function ZelleTransferPage() {
  return (
    <MethodPage
      name="Zelle"
      accentFrom="from-purple-600"
      accentTo="to-indigo-500"
      identifierLabel="Zelle email or phone"
      identifierPlaceholder="email or +1 555 123 4567"
      helper="Use the recipient’s Zelle-registered email or phone number."
    />
  );
}
