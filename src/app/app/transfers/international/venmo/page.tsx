"use client";

import { MethodPage } from "../_components/method-page";

export default function VenmoTransferPage() {
  return (
    <MethodPage
      name="Venmo"
      accentFrom="from-blue-500"
      accentTo="to-sky-500"
      identifierLabel="Venmo handle"
      identifierPlaceholder="@username"
      helper="Include the @ handle exactly as it appears in Venmo."
    />
  );
}
