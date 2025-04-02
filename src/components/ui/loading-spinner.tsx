import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "accent" | "white";
  thickness?: "thin" | "regular" | "thick";
  className?: string;
  text?: string;
  textPosition?: "top" | "bottom" | "right" | "left";
}

export function LoadingSpinner({
  size = "md",
  color = "primary",
  thickness = "regular",
  className,
  text,
  textPosition = "bottom",
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const colorMap = {
    primary: "border-primary",
    secondary: "border-secondary",
    accent: "border-accent",
    white: "border-white",
  };

  const thicknessMap = {
    thin: "border-2",
    regular: "border-3",
    thick: "border-4",
  };

  const textPositionClasses = {
    top: "flex-col-reverse",
    bottom: "flex-col",
    right: "flex-row",
    left: "flex-row-reverse",
  };

  const textSpacing = {
    top: "mb-2",
    bottom: "mt-2",
    right: "ml-3",
    left: "mr-3",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        text && textPositionClasses[textPosition],
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full border-t-transparent animate-spin",
          sizeMap[size],
          colorMap[color],
          thicknessMap[thickness],
        )}
      />
      {text && (
        <div className={cn("text-sm font-medium", textSpacing[textPosition])}>
          {text}
        </div>
      )}
    </div>
  );
}
