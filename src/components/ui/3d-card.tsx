import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ThreeDCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  intensity?: number;
  border?: boolean;
  shadow?: boolean;
  glare?: boolean;
  glareOpacity?: number;
  glarePosition?: "all" | "top" | "bottom" | "left" | "right";
  disabled?: boolean;
}

export function ThreeDCard({
  className,
  children,
  intensity = 10,
  border = true,
  shadow = true,
  glare = true,
  glareOpacity = 0.2,
  glarePosition = "all",
  disabled = false,
  ...props
}: ThreeDCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation based on mouse position
    const rotateYValue = (mouseX / (rect.width / 2)) * intensity;
    const rotateXValue = (mouseY / (rect.height / 2)) * intensity * -1;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);

    // Calculate glare position
    const glareXValue = ((e.clientX - rect.left) / rect.width) * 100;
    const glareYValue = ((e.clientY - rect.top) / rect.height) * 100;
    setGlareX(glareXValue);
    setGlareY(glareYValue);
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovered(false);
      setRotateX(0);
      setRotateY(0);
    }
  };

  const getGlarePosition = () => {
    switch (glarePosition) {
      case "top":
        return { top: 0, left: 0, right: 0, height: "50%" };
      case "bottom":
        return { bottom: 0, left: 0, right: 0, height: "50%" };
      case "left":
        return { top: 0, bottom: 0, left: 0, width: "50%" };
      case "right":
        return { top: 0, bottom: 0, right: 0, width: "50%" };
      default:
        return { top: 0, right: 0, bottom: 0, left: 0 };
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative rounded-xl bg-card transition-transform duration-200 ease-out",
        border && "border border-border",
        shadow && "shadow-lg",
        isHovered && !disabled && "z-10",
        className,
      )}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered && !disabled ? 1.02 : 1})`,
        transition: "transform 0.2s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}

      {glare && isHovered && !disabled && (
        <div
          className="absolute rounded-xl pointer-events-none overflow-hidden"
          style={{
            ...getGlarePosition(),
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${glareOpacity}) 0%, rgba(255, 255, 255, 0) 80%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
}
