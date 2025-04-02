import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // Positive values move slower, negative values move faster
  direction?: "up" | "down" | "left" | "right";
  overflow?: boolean;
  disabled?: boolean;
}

export function ParallaxSection({
  children,
  className,
  speed = 0.5,
  direction = "up",
  overflow = false,
  disabled = false,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [disabled]);

  useEffect(() => {
    if (disabled || !isVisible) return;

    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const elementTop = scrollTop + rect.top;
      const windowHeight = window.innerHeight;

      // Calculate how far the element is from the viewport center
      const distanceFromCenter =
        elementTop - scrollTop - windowHeight / 2 + rect.height / 2;

      // Calculate the parallax offset
      const newOffset = distanceFromCenter * speed * -0.1;
      setOffset(newOffset);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed, direction, disabled, isVisible]);

  const getTransform = () => {
    if (disabled) return "none";

    switch (direction) {
      case "up":
        return `translateY(${offset}px)`;
      case "down":
        return `translateY(${-offset}px)`;
      case "left":
        return `translateX(${offset}px)`;
      case "right":
        return `translateX(${-offset}px)`;
      default:
        return `translateY(${offset}px)`;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        overflow ? "overflow-visible" : "overflow-hidden",
        className,
      )}
    >
      <div
        style={{
          transform: getTransform(),
          transition: "transform 0.1s ease-out",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
