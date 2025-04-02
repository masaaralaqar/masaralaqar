import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define buttonVariants outside the component
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-br from-primary to-secondary text-primary-foreground border-none",
        glow: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary)/0.5)]",
        glass:
          "bg-white/20 backdrop-blur-md border border-white/30 text-foreground hover:bg-white/30 dark:bg-black/20 dark:border-white/10 dark:hover:bg-black/30",
        soft: "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30",
        floating:
          "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-1",
        modern:
          "bg-primary text-primary-foreground relative overflow-hidden before:absolute before:inset-0 before:bg-black/10 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-300",
        minimal: "text-foreground hover:bg-muted/50 border border-border",
        accent: "bg-accent text-accent-foreground hover:bg-accent/80",
        elevated:
          "bg-background text-foreground shadow-md hover:shadow-lg border border-border/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        xl: "h-12 px-10 text-lg",
        icon: "h-10 w-10",
        pill: "px-6 py-2 rounded-full",
        compact: "h-8 px-3 text-xs",
        wide: "h-10 px-8",
      },
      animation: {
        none: "",
        pulse: "btn-pulse",
        bounce: "animate-bounce",
        shimmer:
          "overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-700 before:ease-in-out relative",
        ripple: "btn-ripple",
        scale:
          "hover:scale-105 active:scale-95 transition-transform duration-200",
        slide:
          "relative overflow-hidden before:absolute before:inset-0 before:bg-black/10 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-300",
        glow: "hover:shadow-[0_0_15px_rgba(var(--primary)/0.5)] transition-shadow duration-300",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      fontWeight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
      rounded: "md",
      fontWeight: "medium",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  loadingText?: string;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      rounded,
      fontWeight,
      asChild = false,
      icon,
      iconPosition = "left",
      loading = false,
      loadingText,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const buttonContent = loading ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {loadingText || children}
      </>
    ) : (
      <>
        {icon && iconPosition === "left" && (
          <span className="mr-2 flex-shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === "right" && (
          <span className="ml-2 flex-shrink-0">{icon}</span>
        )}
      </>
    );

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            animation,
            rounded,
            fontWeight,
            className,
          }),
        )}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  },
);
AnimatedButton.displayName = "AnimatedButton";

// Export only the component, not the variants
export { AnimatedButton };
