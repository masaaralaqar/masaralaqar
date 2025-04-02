import React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
  direction?:
    | "to-r"
    | "to-l"
    | "to-t"
    | "to-b"
    | "to-tr"
    | "to-tl"
    | "to-br"
    | "to-bl";
  animate?: boolean;
  animationDuration?: number;
  as?: React.ElementType;
}

export function GradientText({
  children,
  className,
  from = "from-primary",
  to = "to-secondary",
  direction = "to-r",
  animate = false,
  animationDuration = 10,
  as: Component = "span",
}: GradientTextProps) {
  return (
    <Component
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r",
        `bg-gradient-${direction}`,
        from,
        to,
        animate && "animate-gradient bg-[length:400%_400%]",
        className,
      )}
      style={
        animate ? { animationDuration: `${animationDuration}s` } : undefined
      }
    >
      {children}
    </Component>
  );
}
