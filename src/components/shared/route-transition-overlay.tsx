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

  useEffect(() => {
    // Trigger overlay on route change
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 600); // keep brief but noticeable
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!visible) return null;
  return <LoadingScreen />;
}
