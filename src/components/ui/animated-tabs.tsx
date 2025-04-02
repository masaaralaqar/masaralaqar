import * as React from "react";
import { cn } from "@/lib/utils";

interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  variant?: "underline" | "pills" | "boxed" | "minimal";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  fullWidth?: boolean;
  iconPosition?: "left" | "top";
}

export function AnimatedTabs({
  tabs,
  defaultValue,
  onChange,
  className,
  tabsClassName,
  contentClassName,
  variant = "underline",
  size = "md",
  animated = true,
  fullWidth = false,
  iconPosition = "left",
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = React.useState(
    defaultValue || tabs[0]?.value,
  );
  const [indicatorStyle, setIndicatorStyle] = React.useState({});
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const updateIndicator = React.useCallback(() => {
    const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
    if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
      const tabElement = tabRefs.current[activeIndex];
      if (!tabElement) return;

      if (variant === "underline") {
        setIndicatorStyle({
          width: `${tabElement.offsetWidth}px`,
          transform: `translateX(${tabElement.offsetLeft}px)`,
          height: "2px",
          bottom: "0",
        });
      } else if (variant === "pills") {
        setIndicatorStyle({
          width: `${tabElement.offsetWidth}px`,
          height: `${tabElement.offsetHeight}px`,
          transform: `translateX(${tabElement.offsetLeft}px)`,
          borderRadius: "9999px",
        });
      } else if (variant === "boxed") {
        setIndicatorStyle({
          width: `${tabElement.offsetWidth}px`,
          height: `${tabElement.offsetHeight}px`,
          transform: `translateX(${tabElement.offsetLeft}px)`,
          borderRadius: "0.5rem",
        });
      }
    }
  }, [activeTab, tabs, variant]);

  React.useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    if (onChange) onChange(value);
  };

  const sizeClasses = {
    sm: "text-sm py-1 px-2",
    md: "text-base py-2 px-3",
    lg: "text-lg py-3 px-4",
  };

  const variantClasses = {
    underline: "border-b border-border",
    pills: "p-1 bg-muted/50 rounded-full",
    boxed: "p-1 bg-muted/50 rounded-lg",
    minimal: "",
  };

  const activeClasses = {
    underline: "text-primary font-medium",
    pills: "text-primary-foreground font-medium",
    boxed: "text-primary-foreground font-medium",
    minimal: "text-primary font-medium",
  };

  const inactiveClasses = {
    underline: "text-muted-foreground hover:text-foreground",
    pills: "text-muted-foreground hover:text-foreground",
    boxed: "text-muted-foreground hover:text-foreground",
    minimal: "text-muted-foreground hover:text-foreground",
  };

  const indicatorClasses = {
    underline: "bg-primary",
    pills: "bg-primary",
    boxed: "bg-primary",
    minimal: "bg-primary",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("relative", variantClasses[variant], tabsClassName)}>
        <div
          className={cn(
            "flex",
            iconPosition === "top" && "flex-wrap gap-2",
            fullWidth && "w-full",
          )}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.value}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => !tab.disabled && handleTabClick(tab.value)}
              className={cn(
                "relative flex items-center justify-center transition-all",
                sizeClasses[size],
                tab.value === activeTab
                  ? activeClasses[variant]
                  : inactiveClasses[variant],
                tab.disabled && "opacity-50 cursor-not-allowed",
                fullWidth && "flex-1",
                iconPosition === "top" && tab.icon && "flex-col gap-1",
                iconPosition === "left" && tab.icon && "flex-row gap-2",
                "z-10",
              )}
              disabled={tab.disabled}
            >
              {tab.icon && tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Animated indicator */}
        {variant !== "minimal" && (
          <div
            className={cn(
              "absolute transition-all duration-300 ease-out",
              indicatorClasses[variant],
              variant === "pills" || variant === "boxed" ? "z-0" : "",
            )}
            style={indicatorStyle}
          />
        )}
      </div>

      <div className={cn("mt-4", contentClassName)}>
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className={cn(
              "transition-opacity duration-300",
              tab.value === activeTab ? "block" : "hidden",
              animated && tab.value === activeTab ? "animate-fade-in" : "",
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
