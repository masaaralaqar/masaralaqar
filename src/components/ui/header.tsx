import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Calculator, House, Landmark, Bot } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled || !transparent
          ? "bg-background/90 backdrop-blur-md border-b"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center transition-transform hover:scale-105"
          >
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="h-12 w-auto"
              style={{ maxHeight: '48px' }}
            />
          </Link>
        </div>

        {isMobile ? (
          <MobileMenu />
        ) : (
          <NavigationMenu dir="rtl">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-1",
                      location.pathname === "/" &&
                        "bg-primary/10 text-primary font-medium",
                    )}
                  >
                    <Calculator className="h-4 w-4" />
                    حاسبة التمويل
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/bank-comparison">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-1",
                      location.pathname === "/bank-comparison" &&
                        "bg-primary/10 text-primary font-medium",
                    )}
                  >
                    <Landmark className="h-4 w-4" />
                    مقارنة البنوك
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/ai-assistant">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex items-center gap-1",
                      location.pathname === "/ai-assistant" &&
                        "bg-primary/10 text-primary font-medium",
                    )}
                  >
                    <Bot className="h-4 w-4" />
                    البوت الذكي
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
    </header>
  );
}

function MobileMenu() {
  const location = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="max-w-[280px]">
        <div className="grid gap-4 px-2 py-4">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-center">
              <img 
                src="/logo.svg" 
                alt="Logo" 
                className="h-16 w-auto"
                style={{ maxHeight: '64px' }}
              />
            </SheetTitle>
          </SheetHeader>
          <Separator />
          <nav className="grid gap-2">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-lg font-medium rounded-md transition-colors",
                location.pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted",
              )}
            >
              <Calculator className="h-5 w-5 text-primary" />
              حاسبة التمويل
            </Link>
            <Link
              to="/bank-comparison"
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-lg font-medium rounded-md transition-colors",
                location.pathname === "/bank-comparison"
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted",
              )}
            >
              <Landmark className="h-5 w-5 text-primary" />
              مقارنة البنوك
            </Link>
            <Link
              to="/ai-assistant"
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-lg font-medium rounded-md transition-colors",
                location.pathname === "/ai-assistant"
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted",
              )}
            >
              <Bot className="h-5 w-5 text-primary" />
              البوت الذكي
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
