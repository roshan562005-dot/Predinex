"use client";

import Link from "next/link";
import { useId } from "react";

interface PredinexLogoProps {
  size?: "sm" | "md" | "lg";
  linked?: boolean;
  className?: string;
  fullWidth?: boolean;
  /** "dark" = light tagline (for dark/navy backgrounds, default)
   *  "light" = dark tagline (for white/light sidebar backgrounds) */
  variant?: "dark" | "light";
}

export function PredinexLogo({
  size = "md",
  linked = true,
  className = "",
  fullWidth = false,
  variant = "dark",
}: PredinexLogoProps) {
  const uid = useId().replace(/:/g, "");

  // Scale factors per size
  const cfg = {
    sm: { scale: 0.72 },
    md: { scale: 1 },
    lg: { scale: 1.35 },
  };

  const scale = cfg[size].scale;

  // Base dimensions (md reference)
  const iconSize = 44;
  const nameSize = 26;  // px — PREDINEX font size
  const tagSize  = 8.5; // px — tagline font size

  // Tagline colour adapts to background
  const tagColor = variant === "light" ? "#111827" : "#6ee7b7";

  const inner = (
    <div
      className={`inline-flex items-center gap-3 group select-none ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: "left center" }}
    >
      {/* ── Icon: 3D Hexagonal Pulse Shield ───────────────── */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-500 group-hover:rotate-[15deg]"
        style={{ filter: "drop-shadow(0 4px 8px rgba(59,130,246,0.35)) drop-shadow(0 1px 2px rgba(16,185,129,0.25))" }}
      >
        <defs>
          {/* Main blue→green gradient */}
          <linearGradient id={`${uid}-main`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* 3D face fill — top-left lit */}
          <linearGradient id={`${uid}-face`} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#60a5fa" stopOpacity="0.22" />
            <stop offset="60%"  stopColor="#3b82f6" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.18" />
          </linearGradient>

          {/* 3D side-shadow band (bottom-right edge) */}
          <linearGradient id={`${uid}-side`} x1="30" y1="10" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#1d4ed8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#065f46" stopOpacity="0.45" />
          </linearGradient>

          {/* Highlight shimmer — top edge */}
          <linearGradient id={`${uid}-highlight`} x1="8" y1="4" x2="40" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Glow fill for outer blur */}
          <linearGradient id={`${uid}-glow`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
          </linearGradient>

          {/* Soft blur filter */}
          <filter id={`${uid}-blur`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* ── Layer 1: Ambient glow (blurred) */}
        <polygon
          points="24,2 43,13 43,35 24,46 5,35 5,13"
          fill={`url(#${uid}-glow)`}
          filter={`url(#${uid}-blur)`}
        />

        {/* ── Layer 2: 3D bottom/right shadow face (depth illusion) */}
        <polygon
          points="24,46 43,35 44,36.5 25,47.5"
          fill={`url(#${uid}-side)`}
          opacity="0.6"
        />
        <polygon
          points="43,35 44,36.5 45,14 43,13"
          fill={`url(#${uid}-side)`}
          opacity="0.5"
        />

        {/* ── Layer 3: Main hex face fill (3D lit surface) */}
        <polygon
          points="24,4 41,13.5 41,34.5 24,44 7,34.5 7,13.5"
          fill={`url(#${uid}-face)`}
        />

        {/* ── Layer 4: Outer hex border */}
        <polygon
          points="24,4 41,13.5 41,34.5 24,44 7,34.5 7,13.5"
          stroke={`url(#${uid}-main)`}
          strokeWidth="1.5"
          fill="none"
          opacity="0.95"
        />

        {/* ── Layer 5: Top-edge highlight (3D shine) */}
        <polygon
          points="24,4 41,13.5 35,13.5 24,7.5 13,13.5 7,13.5"
          fill={`url(#${uid}-highlight)`}
        />

        {/* ── Layer 6: Inner hexagon ring */}
        <polygon
          points="24,10 36,17 36,31 24,38 12,31 12,17"
          stroke={`url(#${uid}-main)`}
          strokeWidth="0.7"
          fill="none"
          opacity="0.3"
        />

        {/* ── Layer 7: ECG pulse line */}
        <polyline
          points="10,24 15,24 17,17 20,31 23,20 26,28 29,24 34,24 38,24"
          stroke={`url(#${uid}-main)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ── Layer 8: DNA accent dots */}
        <circle cx="24" cy="11" r="1.8" fill={`url(#${uid}-main)`} opacity="0.85" />
        <circle cx="24" cy="37" r="1.8" fill={`url(#${uid}-main)`} opacity="0.85" />

        {/* ── Layer 9: Inner highlight dot (glass effect) */}
        <circle cx="15" cy="15" r="2.5" fill="white" opacity="0.12" />
      </svg>

      {/* ── Wordmark ──────────────────────────────────────── */}
      <div className="flex flex-col gap-[3px]">

        {/* PREDINEX — bold gradient (unchanged) */}
        <span
          style={{
            fontSize: `${nameSize}px`,
            fontWeight: 900,
            letterSpacing: "0.14em",
            lineHeight: 1,
            background: "linear-gradient(90deg, #2563eb 0%, #10b981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            whiteSpace: "nowrap",
          }}
        >
          PREDINEX
        </span>

        {/* Tagline — colour adapts to variant */}
        <span
          style={{
            fontSize: `${tagSize}px`,
            fontWeight: 700,
            letterSpacing: "0.08em",
            lineHeight: 1,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            color: tagColor,
            opacity: variant === "light" ? 0.75 : 0.9,
          }}
        >
          Prevent Diabetes Before It Begins
        </span>
      </div>
    </div>
  );

  if (!linked) return inner;

  return (
    <Link href="/" className="block w-fit">
      {inner}
    </Link>
  );
}
