"use client";

import { MethodPage } from "../_components/method-page";

export default function WeChatTransferPage() {
  return (
    <MethodPage
      name="WeChat Pay"
      accentFrom="from-emerald-500"
      accentTo="to-green-500"
      identifierLabel="WeChat ID or phone"
      identifierPlaceholder="WeChat ID or +86 138 0000 0000"
      helper="Use the recipient’s WeChat Pay ID or the phone linked to their wallet."
    />
  );
}
