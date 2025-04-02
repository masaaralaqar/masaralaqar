import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type TransitionType =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "rotate"
  | "flip"
  | "zoom"
  | "blur"
  | "none";

interface TransitionProps {
  children: React.ReactNode;
  show?: boolean;
  type?: TransitionType;
  duration?: number;
  delay?: number;
  className?: string;
  unmountOnExit?: boolean;
  easing?: string;
}

export function Transition({
  children,
  show = true,
  type = "fade",
  duration = 300,
  delay = 0,
  className,
  unmountOnExit = false,
  easing = "ease-in-out",
}: TransitionProps) {
  const [shouldRender, setShouldRender] = useState(show);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (show) {
      setShouldRender(true);
      timeoutId = setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      if (unmountOnExit) {
        timeoutId = setTimeout(() => setShouldRender(false), duration);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [show, duration, unmountOnExit]);

  if (!shouldRender && unmountOnExit) return null;

  const getTransitionStyles = () => {
    const baseStyles = {
      transition: `all ${duration}ms ${easing} ${delay}ms`,
      opacity: isVisible ? 1 : 0,
    };

    const transformStyles = {
      fade: {},
      "slide-up": {
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      },
      "slide-down": {
        transform: isVisible ? "translateY(0)" : "translateY(-20px)",
      },
      "slide-left": {
        transform: isVisible ? "translateX(0)" : "translateX(20px)",
      },
      "slide-right": {
        transform: isVisible ? "translateX(0)" : "translateX(-20px)",
      },
      scale: {
        transform: isVisible ? "scale(1)" : "scale(0.95)",
      },
      rotate: {
        transform: isVisible ? "rotate(0deg)" : "rotate(-10deg)",
      },
      flip: {
        transform: isVisible ? "rotateY(0deg)" : "rotateY(90deg)",
      },
      zoom: {
        transform: isVisible ? "scale(1)" : "scale(0)",
      },
      blur: {
        filter: isVisible ? "blur(0)" : "blur(8px)",
      },
      none: {
        opacity: 1,
      },
    };

    return {
      ...baseStyles,
      ...transformStyles[type],
    };
  };

  return (
    <div className={cn(className)} style={getTransitionStyles()}>
      {children}
    </div>
  );
}

export function FadeIn({
  children,
  duration = 500,
  delay = 0,
  className,
  once = true,
}: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-opacity duration-500 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function SlideIn({
  children,
  duration = 500,
  delay = 0,
  className,
  direction = "up",
  once = true,
  distance = "medium",
}: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
  distance?: "small" | "medium" | "large";
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const distanceMap = {
    small: 4,
    medium: 8,
    large: 16,
  };

  const distanceValue = distanceMap[distance];

  const directionClasses = {
    up: isVisible
      ? "translate-y-0 opacity-100"
      : `translate-y-${distanceValue} opacity-0`,
    down: isVisible
      ? "translate-y-0 opacity-100"
      : `-translate-y-${distanceValue} opacity-0`,
    left: isVisible
      ? "translate-x-0 opacity-100"
      : `translate-x-${distanceValue} opacity-0`,
    right: isVisible
      ? "translate-x-0 opacity-100"
      : `-translate-x-${distanceValue} opacity-0`,
  };

  return (
    <div
      className={cn(
        "transition-all ease-out",
        directionClasses[direction],
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function StaggeredChildren({
  children,
  staggerDelay = 100,
  initialDelay = 0,
  animation = "fade-in",
  className,
  direction = "forward",
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  animation?: "fade-in" | "slide-up" | "scale-in" | "blur-in" | "zoom-in";
  className?: string;
  direction?: "forward" | "reverse";
}) {
  const childrenArray = React.Children.toArray(children);
  const orderedChildren =
    direction === "reverse" ? [...childrenArray].reverse() : childrenArray;

  const animationClass = {
    "fade-in": "animate-fade-in",
    "slide-up": "animate-slide-up",
    "scale-in": "animate-scale-in",
    "blur-in": "animate-blur-in",
    "zoom-in": "animate-zoom-in",
  }[animation];

  return (
    <div className={className}>
      {orderedChildren.map((child, index) => (
        <div
          key={index}
          className={animationClass}
          style={{
            animationDelay: `${initialDelay + index * staggerDelay}ms`,
            animationFillMode: "both",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
