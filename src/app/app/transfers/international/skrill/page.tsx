"use client";

import { MethodPage } from "../_components/method-page";

export default function SkrillTransferPage() {
  return (
    <MethodPage
      name="Skrill"
      accentFrom="from-fuchsia-500"
      accentTo="to-purple-500"
      identifierLabel="Skrill email"
      identifierPlaceholder="name@example.com"
      helper="Payments are sent to this Skrill account email."
    />
  );
}
