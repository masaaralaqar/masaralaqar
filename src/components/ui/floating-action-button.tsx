import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";

const fabVariants = cva(
  "fixed rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50",
  {
    variants: {
      position: {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
        "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
        "top-center": "top-6 left-1/2 -translate-x-1/2",
      },
      size: {
        sm: "h-12 w-12",
        default: "h-14 w-14",
        lg: "h-16 w-16",
      },
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        gradient:
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground",
        outline:
          "bg-background border-2 border-primary text-primary hover:bg-primary/10",
      },
    },
    defaultVariants: {
      position: "bottom-right",
      size: "default",
      variant: "primary",
    },
  },
);

interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  icon: React.ReactNode;
  pulse?: boolean;
  tooltip?: string;
}

export function FloatingActionButton({
  className,
  position,
  size,
  variant,
  icon,
  pulse = false,
  tooltip,
  ...props
}: FloatingActionButtonProps) {
  return (
    <div className="relative group">
      {tooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          {tooltip}
        </div>
      )}
      <button
        className={cn(
          fabVariants({ position, size, variant }),
          pulse && "animate-pulse",
          "hover:scale-110",
          className,
        )}
        {...props}
      >
        {icon}
      </button>
    </div>
  );
}
