"use client";

import { LoadingScreen } from "@/components/shared/loading-screen";

interface PageLoadingStateProps {
  title: string;
  statusMessages?: string[];
}

export function PageLoadingState({
  title,
  statusMessages,
}: PageLoadingStateProps) {
  return (
    <LoadingScreen
      title={title}
      statusMessages={statusMessages}
      subtitle="Secure Banking Workspace"
      fixed={false}
      compact
    />
  );
}
