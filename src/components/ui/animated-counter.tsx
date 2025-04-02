import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  className?: string;
  textClassName?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  easing?: "linear" | "easeOut" | "easeInOut";
}

export function AnimatedCounter({
  value,
  duration = 1000,
  formatValue,
  className,
  textClassName,
  decimals = 0,
  prefix = "",
  suffix = "",
  easing = "easeOut",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  };

  const formatDisplayValue = (val: number) => {
    if (formatValue) {
      return formatValue(val);
    }

    const fixed = val.toFixed(decimals);
    return `${prefix}${fixed}${suffix}`;
  };

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunctions[easing](progress);

      const currentValue =
        startValueRef.current + (value - startValueRef.current) * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, duration, easing]);

  return (
    <div className={cn("inline-flex items-center", className)}>
      <span className={cn("font-medium", textClassName)}>
        {formatDisplayValue(displayValue)}
      </span>
    </div>
  );
}
