import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  variant?:
    | "default"
    | "elevated"
    | "flat"
    | "outlined"
    | "frosted"
    | "gradient";
  hoverEffect?: "none" | "lift" | "glow" | "scale" | "border" | "shine";
  accentColor?:
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "destructive";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

export function GlassCard({
  className,
  children,
  variant = "default",
  hoverEffect = "lift",
  accentColor = "primary",
  shadow = "md",
  rounded = "lg",
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "bg-white/80 dark:bg-black/50 backdrop-blur-md",
    elevated: "bg-white/90 dark:bg-black/60 backdrop-blur-md shadow-lg",
    flat: "bg-background border border-border",
    outlined: `border-2 border-${accentColor} bg-white/50 dark:bg-black/30 backdrop-blur-sm`,
    frosted:
      "bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10",
    gradient: `bg-gradient-to-br from-${accentColor}/10 to-${accentColor}/30 backdrop-blur-sm`,
  };

  const hoverStyles = {
    none: "",
    lift: "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
    glow: `transition-all duration-300 hover:shadow-[0_0_15px_rgba(var(--${accentColor})/0.5)]`,
    scale: "transition-all duration-300 hover:scale-[1.02]",
    border: `transition-all duration-300 hover:border-${accentColor}/70`,
    shine:
      "overflow-hidden hover:before:animate-shine relative before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
  };

  const shadowStyles = {
    none: "",
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-3xl",
  };

  return (
    <div
      className={cn(
        variantStyles[variant],
        hoverStyles[hoverEffect],
        shadowStyles[shadow],
        roundedStyles[rounded],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-4 border-b border-border/40 flex items-center justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-xl font-semibold tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function GlassCardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function GlassCardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 py-5", className)} {...props}>
      {children}
    </div>
  );
}

export function GlassCardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-5 py-4 mt-auto border-t border-border/40 flex items-center justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
