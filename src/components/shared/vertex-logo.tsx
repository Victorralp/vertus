"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

interface VertexLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function VertexLogo({ className = "", width = 176, height = 48 }: VertexLogoProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Show placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div 
        className={className} 
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    );
  }

  return (
    <Image
      src={isDark ? "/vertex-logo-dark.svg" : "/vertex-logo.svg"}
      alt="Vertex Credit Union"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
