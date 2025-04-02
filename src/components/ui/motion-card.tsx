import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface MotionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  glowColor?: string;
  glowIntensity?: "light" | "medium" | "strong";
  hoverEffect?: "lift" | "tilt" | "glow" | "scale" | "none";
  borderGradient?: boolean;
}

export function MotionCard({
  className,
  children,
  glowColor = "rgba(147, 51, 234, 0.5)", // Purple glow by default
  glowIntensity = "medium",
  hoverEffect = "lift",
  borderGradient = false,
  ...props
}: MotionCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const intensityMap = {
    light: "0 5px 15px",
    medium: "0 8px 25px",
    strong: "0 10px 35px",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverEffect === "tilt") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  const getTransform = () => {
    if (hoverEffect === "tilt") {
      const { x, y } = mousePosition;
      const height = 300; // Approximate card height
      const width = 400; // Approximate card width
      const rotateX = ((y - height / 2) / height) * 10;
      const rotateY = ((width / 2 - x) / width) * 10;
      return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    return "";
  };

  const getHoverClass = () => {
    switch (hoverEffect) {
      case "lift":
        return "transition-transform duration-300 hover:-translate-y-2";
      case "scale":
        return "transition-transform duration-300 hover:scale-[1.02]";
      case "glow":
        return "transition-shadow duration-300";
      case "tilt":
        return "transition-transform duration-200";
      default:
        return "";
    }
  };

  const getHoverStyle = () => {
    if (hoverEffect === "glow") {
      return {
        boxShadow: `${intensityMap[glowIntensity]} ${glowColor}`,
      };
    }
    return {};
  };

  return (
    <div
      className={cn(
        "rounded-xl bg-card p-6 shadow-md",
        getHoverClass(),
        borderGradient && "border border-transparent bg-clip-padding",
        borderGradient &&
          'before:absolute before:inset-0 before:-z-10 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-primary before:to-secondary before:content-[""]',
        className,
      )}
      style={{
        transform: getTransform(),
        ...(hoverEffect === "glow"
          ? { transition: "box-shadow 0.3s ease" }
          : {}),
        ...(borderGradient ? { backgroundClip: "padding-box" } : {}),
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
      onMouseOver={hoverEffect === "glow" ? () => {} : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
