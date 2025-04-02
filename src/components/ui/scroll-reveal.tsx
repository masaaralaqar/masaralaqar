import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AnimationType =
  | "fade-in"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale-in"
  | "none";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  rootMargin?: string;
}

export function ScrollReveal({
  children,
  animation = "fade-in",
  delay = 0,
  duration = 500,
  threshold = 0.1,
  className,
  once = true,
  rootMargin = "0px",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(currentRef);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold, rootMargin]);

  const getAnimationStyles = () => {
    if (!isVisible) {
      switch (animation) {
        case "fade-in":
          return "opacity-0";
        case "slide-up":
          return "opacity-0 translate-y-8";
        case "slide-down":
          return "opacity-0 -translate-y-8";
        case "slide-left":
          return "opacity-0 translate-x-8";
        case "slide-right":
          return "opacity-0 -translate-x-8";
        case "scale-in":
          return "opacity-0 scale-95";
        default:
          return "";
      }
    }
    return "";
  };

  return (
    <div
      ref={ref}
      className={cn("transition-all", getAnimationStyles(), className)}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : undefined,
      }}
    >
      {children}
    </div>
  );
}

export function ScrollRevealGroup({
  children,
  staggerDelay = 100,
  animation = "fade-in",
  threshold = 0.1,
  className,
  once = true,
  rootMargin = "0px",
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  animation?: AnimationType;
  threshold?: number;
  className?: string;
  once?: boolean;
  rootMargin?: string;
}) {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <ScrollReveal
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          threshold={threshold}
          once={once}
          rootMargin={rootMargin}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
