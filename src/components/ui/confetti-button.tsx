import React, { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfettiButtonProps extends ButtonProps {
  confettiColors?: string[];
  confettiCount?: number;
  confettiDuration?: number;
  onConfettiComplete?: () => void;
}

export function ConfettiButton({
  children,
  confettiColors = [
    "#9333EA",
    "#3B82F6",
    "#06B6D4",
    "#8B5CF6",
    "#F43F5E",
    "#F59E0B",
  ],
  confettiCount = 100,
  confettiDuration = 2000,
  onConfettiComplete,
  onClick,
  className,
  ...props
}: ConfettiButtonProps) {
  const [confetti, setConfetti] = useState<JSX.Element[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Call the original onClick handler if provided
    if (onClick) onClick(e);

    // Create confetti pieces
    const newConfetti: JSX.Element[] = [];
    const buttonRect = e.currentTarget.getBoundingClientRect();

    for (let i = 0; i < confettiCount; i++) {
      const color =
        confettiColors[Math.floor(Math.random() * confettiColors.length)];
      const size = Math.random() * 10 + 5;
      const left = Math.random() * buttonRect.width;
      const angle = Math.random() * 360;
      const velocity = Math.random() * 30 + 10;
      const rotationVelocity = Math.random() * 360 - 180;

      newConfetti.push(
        <div
          key={`confetti-${i}-${Date.now()}`}
          className="absolute rounded-sm pointer-events-none"
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size / 2}px`,
            left: `${left}px`,
            top: "50%",
            transform: "translateY(-50%)",
            animation: `confetti-${i} ${confettiDuration}ms forwards`,
          }}
        >
          <style>
            {`
              @keyframes confetti-${i} {
                0% {
                  transform: translate(0, 0) rotate(0deg);
                  opacity: 1;
                }
                100% {
                  transform: translate(${(Math.random() - 0.5) * velocity * 20}px, ${-velocity * 20}px) rotate(${angle + rotationVelocity}deg);
                  opacity: 0;
                }
              }
            `}
          </style>
        </div>,
      );
    }

    setConfetti(newConfetti);

    // Clear confetti after animation completes
    setTimeout(() => {
      setConfetti([]);
      if (onConfettiComplete) onConfettiComplete();
    }, confettiDuration);
  };

  return (
    <Button
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
      {confetti}
    </Button>
  );
}
