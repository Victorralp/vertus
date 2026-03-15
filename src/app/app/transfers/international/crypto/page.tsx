"use client";

import { MethodPage } from "../_components/method-page";

export default function CryptoTransferPage() {
  return (
    <MethodPage
      name="Crypto"
      accentFrom="from-amber-500"
      accentTo="to-orange-600"
      identifierLabel="Wallet address"
      identifierPlaceholder="Paste destination wallet address"
      helper="Ensure the network matches your recipient’s wallet to avoid loss of funds."
    />
  );
}
