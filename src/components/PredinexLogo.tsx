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

  const sizeClasses = {
    sm: "h-8 md:h-10",
    md: "h-10 md:h-12",
    lg: "h-16 md:h-20",
  };

  const inner = (
    <div
      className={`inline-flex flex-col items-start gap-1 group select-none ${className}`}
    >
      <img 
        src="/logo.png" 
        alt="Predinex Logo" 
        className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-500 group-hover:scale-105 ${variant === 'dark' ? 'invert brightness-0 dark:brightness-200' : ''}`}
        onError={(e) => {
           // Fallback to text if image fails to load
           e.currentTarget.style.display = 'none';
        }}
      />
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
          marginTop: "4px",
          marginLeft: "2px"
        }}
      >
        Prevent Diabetes Before It Begins
      </span>
    </div>
  );

  if (!linked) return inner;

  return (
    <Link href="/" className="block w-fit">
      {inner}
    </Link>
  );
}
