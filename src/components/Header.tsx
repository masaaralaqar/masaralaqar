import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, Home, Building2, Bot, LogOut, User } from "lucide-react";
// Temporarily removed ModeToggle import due to path issues
// import { ModeToggle } from "./mode-toggle"; 
import { useAuth } from "@/contexts/auth-context";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            {/* Optional: Add logo here */}
            {/* <img src="/logo.png" alt="مسار العقار" className="h-6 w-auto" /> */}
            <Building2 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              مسار العقار
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-6">
            <div className="flex items-center gap-2 ml-4">
              <User className="h-4 w-4" />
              <span className="text-sm">أهلاً {user?.name}</span>
            </div>
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                <span>حاسبة التمويل العقاري</span>
              </Button>
            </Link>
            <Link to="/ai-assistant">
              <Button
                variant={isActive("/ai-assistant") ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                <span>المستشار العقاري</span>
              </Button>
            </Link>
            <Link to="/bank-comparison">
              <Button
                variant={isActive("/bank-comparison") ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                <span>مقارنة البنوك</span>
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="flex items-center gap-2 mr-4"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </Button>
          </nav>
          {/* Temporarily removed ModeToggle button */}
          {/* <ModeToggle /> */}
        </div>
      </div>
    </header>
  );
} 