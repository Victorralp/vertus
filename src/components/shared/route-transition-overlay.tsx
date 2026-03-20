"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingScreen } from "@/components/shared/loading-screen";

/**
 * Shows the branded loading overlay on each route change.
 * Uses pathname changes as the trigger (App Router navigation events fire after URL commit).
 */
export function RouteTransitionOverlay() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    // Trigger overlay on route change
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 450);
    return () => clearTimeout(timeout);
  }, [hasMounted, pathname]);

  if (!visible) return null;
  return (
    <LoadingScreen
      title="Switching views"
      statusMessages={[
        "Opening your next workspace",
        "Syncing the latest account state",
        "Almost there",
      ]}
      showMetrics={false}
    />
  );
}
