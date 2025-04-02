import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type TransitionType = "fade" | "slide" | "scale" | "none";

interface PageTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  duration?: number;
  className?: string;
}

export function PageTransition({
  children,
  type = "fade",
  duration = 300,
  className,
}: PageTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (transitionStage === "fadeOut") {
      setTransitionStage("fadeIn");
      setDisplayLocation(location);
    }
  };

  const getTransitionClass = () => {
    switch (type) {
      case "fade":
        return transitionStage === "fadeIn" ? "opacity-100" : "opacity-0";
      case "slide":
        return transitionStage === "fadeIn"
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8";
      case "scale":
        return transitionStage === "fadeIn"
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn("transition-all", getTransitionClass(), className)}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}
