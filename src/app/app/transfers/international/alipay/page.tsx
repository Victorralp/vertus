"use client";

import { MethodPage } from "../_components/method-page";

export default function AlipayTransferPage() {
  return (
    <MethodPage
      name="Alipay"
      accentFrom="from-cyan-500"
      accentTo="to-blue-500"
      identifierLabel="Alipay ID or phone"
      identifierPlaceholder="alipay ID or +86 138 0000 0000"
      helper="Provide the recipient’s verified Alipay account ID or phone number."
    />
  );
}
