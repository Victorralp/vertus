"use client";

import { useEffect, useMemo, useState } from "react";
import { VertexLogo } from "@/components/shared/vertex-logo";

interface LoadingScreenProps {
  title?: string;
  statusMessages?: string[];
  subtitle?: string;
  fixed?: boolean;
  compact?: boolean;
  showMetrics?: boolean;
}

export function LoadingScreen({
  title = "Loading your workspace",
  statusMessages = [
    "Verifying your secure session",
    "Syncing your accounts and activity",
    "Finalizing your dashboard",
  ],
  subtitle = "Secure Digital Banking",
  fixed = true,
  compact = false,
  showMetrics = true,
}: LoadingScreenProps) {
  const [dots, setDots] = useState("");
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) {
          return prev;
        }

        const increment = prev < 48 ? 9 : prev < 74 ? 5 : 2;
        return Math.min(prev + increment, 92);
      });
    }, 260);

    return () => clearInterval(interval);
  }, []);

  const status = useMemo(() => {
    if (statusMessages.length === 0) {
      return "";
    }

    if (statusMessages.length === 1) {
      return statusMessages[0];
    }

    if (progress < 42) {
      return statusMessages[0];
    }

    if (progress < 74) {
      return statusMessages[1] ?? statusMessages[0];
    }

    return statusMessages[2] ?? statusMessages[statusMessages.length - 1];
  }, [progress, statusMessages]);

  return (
    <div
      className={`${fixed ? "fixed inset-0 z-50" : "relative min-h-[24rem] w-full rounded-[32px]"} flex items-center justify-center overflow-hidden bg-slate-950`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.24),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(16,185,129,0.2),transparent_26%),radial-gradient(circle_at_bottom,rgba(37,99,235,0.18),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))]" />
      <div className={`absolute left-1/2 top-1/2 ${compact ? "h-[24rem] w-[24rem]" : "h-[34rem] w-[34rem]"} -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10 bg-cyan-400/5 blur-3xl`} />

      <div className={`relative mx-6 w-full ${compact ? "max-w-lg p-6" : "max-w-md p-8"} overflow-hidden rounded-[28px] border border-white/10 bg-white/6 text-slate-100 shadow-[0_32px_120px_rgba(2,6,23,0.7)] backdrop-blur-2xl`}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <div className={`relative flex ${compact ? "h-24 w-24" : "h-28 w-28"} items-center justify-center`}>
            <div className="absolute inset-0 rounded-full border border-cyan-300/20" />
            <div className="absolute inset-2 rounded-full border border-cyan-300/15 border-t-cyan-300/70 animate-spin" />
            <div className="absolute inset-5 rounded-full border border-emerald-300/15 border-b-emerald-300/70 animate-spin [animation-direction:reverse] [animation-duration:2.8s]" />
            <div className="absolute h-3.5 w-3.5 rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300 shadow-[0_0_25px_rgba(103,232,249,0.8)] animate-pulse" />
          </div>

          <div className={`${compact ? "mt-5" : "mt-6"}`}>
            <VertexLogo width={compact ? 170 : 190} height={compact ? 46 : 52} className="mx-auto drop-shadow-[0_12px_34px_rgba(34,211,238,0.24)]" />
          </div>

          <div className={`${compact ? "mt-5" : "mt-6"} space-y-2`}>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-200/80">
              {subtitle}
            </p>
            <h2 className={`${compact ? "text-xl" : "text-2xl"} font-semibold text-white`}>
              {title}
              {dots}
            </h2>
            <p className="text-sm text-slate-300/80">
              {status}
            </p>
          </div>

          <div className={`${compact ? "mt-6" : "mt-7"} w-full`}>
            <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
              <span>System check</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(52,211,153,0.95),rgba(34,211,238,1),rgba(59,130,246,0.95))] shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {showMetrics ? (
            <div className={`${compact ? "mt-5" : "mt-6"} grid w-full grid-cols-3 gap-3 text-left`}>
              <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Auth</p>
                <p className="mt-1 text-sm font-medium text-white">Protected</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Sync</p>
                <p className="mt-1 text-sm font-medium text-white">Live Data</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Shield</p>
                <p className="mt-1 text-sm font-medium text-white">Encrypted</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
