import * as React from "react";
import { cn } from "@/lib/utils";

interface ShimmerEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  width?: string;
  height?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  variant?: "default" | "card" | "text" | "button" | "image";
}

export function ShimmerEffect({
  className,
  width = "100%",
  height = "16px",
  rounded = "md",
  variant = "default",
  ...props
}: ShimmerEffectProps) {
  const roundedMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const variantMap = {
    default: "h-4",
    card: "h-32",
    text: "h-4 w-2/3",
    button: "h-10 w-24",
    image: "aspect-square",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/40",
        roundedMap[rounded],
        variantMap[variant],
        className,
      )}
      style={{
        width,
        height: variant === "image" ? "auto" : height,
      }}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

export function ShimmerButton({
  className,
  children,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "relative inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "overflow-hidden",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {!disabled && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </button>
  );
}
