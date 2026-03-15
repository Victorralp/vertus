"use client";

import { MethodPage } from "../_components/method-page";

export default function CashAppTransferPage() {
  return (
    <MethodPage
      name="Cash App"
      accentFrom="from-lime-500"
      accentTo="to-green-500"
      identifierLabel="$Cashtag"
      identifierPlaceholder="$yourcashtag"
      helper="Use the recipient’s exact $Cashtag to avoid failed payments."
    />
  );
}
