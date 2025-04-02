import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
  className?: string;
  children: React.ReactNode;
  intensity?: "light" | "medium" | "strong";
  speed?: "slow" | "medium" | "fast";
  colors?: string[];
}

export function AnimatedGradientBackground({
  className,
  children,
  intensity = "medium",
  speed = "medium",
  colors = ["#9333EA", "#3B82F6", "#06B6D4", "#8B5CF6"],
}: AnimatedGradientBackgroundProps) {
  const intensityMap = {
    light: "opacity-[0.15]",
    medium: "opacity-[0.25]",
    strong: "opacity-[0.4]",
  };

  const speedMap = {
    slow: "animate-[gradient_15s_ease_infinite]",
    medium: "animate-[gradient_10s_ease_infinite]",
    fast: "animate-[gradient_5s_ease_infinite]",
  };

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0 -z-10 bg-[length:200%_200%] blur-[100px]",
          intensityMap[intensity],
          speedMap[speed],
        )}
        style={{
          backgroundImage: `linear-gradient(-45deg, ${colors.join(", ")})`,
          backgroundSize: "400% 400%",
          animation: `gradient ${speed === "slow" ? 15 : speed === "medium" ? 10 : 5}s ease infinite`,
        }}
      />
      {children}
    </div>
  );
}
