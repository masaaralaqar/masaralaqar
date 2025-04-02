import * as React from "react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface HoverCardAdvancedProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  contentClassName?: string;
  openDelay?: number;
  closeDelay?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  variant?: "default" | "glass" | "gradient";
  animation?: "fade" | "scale" | "slide";
}

export function HoverCardAdvanced({
  trigger,
  content,
  className,
  contentClassName,
  openDelay = 200,
  closeDelay = 200,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  alignOffset = 0,
  variant = "default",
  animation = "scale",
}: HoverCardAdvancedProps) {
  const variantClasses = {
    default: "",
    glass:
      "bg-white/80 dark:bg-black/80 backdrop-blur-md border-white/20 dark:border-white/10",
    gradient: "bg-gradient-to-b from-card to-card/80 backdrop-blur-sm",
  };

  const animationClasses = {
    fade: "animate-fade-in",
    scale: "animate-scale-in",
    slide:
      side === "top"
        ? "animate-slide-down"
        : side === "bottom"
          ? "animate-slide-up"
          : side === "left"
            ? "animate-slide-right"
            : "animate-slide-left",
  };

  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild className={className}>
        {trigger}
      </HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn(
          "w-80 p-4 shadow-lg",
          variantClasses[variant],
          animationClasses[animation],
          contentClassName,
        )}
      >
        {content}
      </HoverCardContent>
    </HoverCard>
  );
}
