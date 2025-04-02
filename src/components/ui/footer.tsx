import React from "react";
import { cn } from "@/lib/utils";
import { House, Landmark, Home, Calculator, Bot } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "w-full bg-background py-6 px-4 border-t border-border",
        className,
      )}
      {...props}
    >
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand and Info */}
          <div className="flex flex-col space-y-1 items-center md:items-start text-center md:text-right">
            <div className="flex items-center gap-2">
              <House className="h-5 w-5 text-primary" />
              <span className="text-foreground font-bold">مسار العقار</span>
            </div>
            <p className="text-muted-foreground text-sm">
              منصة متخصصة في تقديم خدمات التمويل العقاري
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex gap-6">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <Calculator className="h-4 w-4" />
              <span>حاسبة التمويل</span>
            </Link>
            <Link
              to="/bank-comparison"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <Landmark className="h-4 w-4" />
              <span>مقارنة البنوك</span>
            </Link>
            <Link
              to="/ai-assistant"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <Bot className="h-4 w-4" />
              <span>البوت الذكي</span>
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-sm">
              &copy; {currentYear} جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
