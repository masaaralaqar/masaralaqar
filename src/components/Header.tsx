import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, Bot, Building, LogOut, User, Menu, LogIn, ArrowUp, MessageSquare, Phone, ExternalLink } from "lucide-react";
// Temporarily removed ModeToggle import due to path issues
// import { ModeToggle } from "./mode-toggle"; 
import { useAuth } from "@/contexts/auth-context";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    // لن نقوم بإعادة التوجيه هنا لأنها تتم في سياق المصادقة
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // إذا كان المستخدم غير مسجل، فإنه سيتم توجيهه لصفحة تسجيل الدخول عند محاولة الوصول لصفحة محمية
  const handleProtectedPathClick = (path: string) => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", path);
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  // التوجيه مباشرة لصفحة تسجيل الدخول
  const handleLoginClick = () => {
    navigate("/login");
  };

  // تحديد ما إذا كنا في صفحة تسجيل الدخول
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo - تحديث مسار الصورة */}
          <Link to="/" className="flex items-center">
            <div className="py-2 px-1 flex items-center justify-center">
              <img 
                src={import.meta.env.MODE === 'production' ? '/logo.svg' : '/logo.svg'} 
                alt="مسار العقار" 
                className="h-10 sm:h-14 md:h-16 w-auto object-contain"
              />
            </div>
          </Link>

          {/* عرض زر الصفحة الرئيسية فقط في صفحة تسجيل الدخول */}
          {isLoginPage ? (
            <Link to="/">
              <Button variant="ghost">
                الصفحة الرئيسية
              </Button>
            </Link>
          ) : (
            <>
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="قائمة التنقل"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Navigation - Desktop */}
              <nav className="hidden md:flex items-center gap-6">
                {/* رسالة الترحيب للمستخدم المسجل */}
                {isAuthenticated && user && (
                  <span className="text-sm font-medium text-primary">
                    الله يحييك يا {user.name}
                  </span>
                )}

                <Link 
                  to="/contact"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/contact") ? "text-primary" : ""}`}
                >
                  اتصل بنا
                </Link>
                
                <Link 
                  to="/faq"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/faq") ? "text-primary" : ""}`}
                >
                  الأسئلة الشائعة
                </Link>
                
                <Link 
                  to="/bank-comparison"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/bank-comparison") ? "text-primary" : ""}`}
                >
                  مقارنة البنوك
                </Link>
                
                <Link 
                  to="/ai-assistant"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/ai-assistant") ? "text-primary" : ""}`}
                >
                  البوت العقاري
                </Link>
                
                <Link 
                  to="/calculator"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/calculator") ? "text-primary" : ""}`}
                >
                  حاسبة التمويل
                </Link>
                
                <Link 
                  to="/"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary" : ""}`}
                >
                  الرئيسية
                </Link>
                
                {isAuthenticated ? (
                  // إذا كان المستخدم مسجل الدخول، أظهر زر تسجيل الخروج
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </Button>
                ) : (
                  // إذا كان المستخدم زائرًا، أظهر زر تسجيل الدخول
                  <Button
                    variant="default"
                    className="gap-2"
                    onClick={handleLoginClick}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>تسجيل الدخول</span>
                  </Button>
                )}
              </nav>
            </>
          )}
        </div>
      </header>

      {/* Mobile Menu - Overlay */}
      {isMenuOpen && !isLoginPage && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <nav className="fixed top-16 left-0 right-0 p-4 bg-background border-b shadow-lg">
            <div className="flex flex-col space-y-3">
              {/* رسالة الترحيب للمستخدم المسجل في القائمة المحمولة */}
              {isAuthenticated && user && (
                <div className="text-center text-sm font-medium text-primary py-2 border-b border-border">
                  الله يحييك يا {user.name}
                </div>
              )}

              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive("/contact") ? "default" : "ghost"}
                  className="w-full justify-center gap-2"
                >
                  اتصل بنا
                </Button>
              </Link>

              <Link to="/faq" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive("/faq") ? "default" : "ghost"}
                  className="w-full justify-center gap-2"
                >
                  الأسئلة الشائعة
                </Button>
              </Link>

              <Link to="/bank-comparison" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive("/bank-comparison") ? "default" : "ghost"}
                  className="w-full justify-center gap-2"
                >
                  مقارنة البنوك
                </Button>
              </Link>

              <Link to="/ai-assistant" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive("/ai-assistant") ? "default" : "ghost"}
                  className="w-full justify-center gap-2"
                >
                  البوت العقاري
                </Button>
              </Link>

              <Link to="/calculator" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive("/calculator") ? "default" : "ghost"}
                  className="w-full justify-center gap-2"
                >
                  حاسبة التمويل
                </Button>
              </Link>

              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive("/") ? "default" : "ghost"}
                  className="w-full justify-center gap-2"
                >
                  الرئيسية
                </Button>
              </Link>
              
              {isAuthenticated ? (
                // زر تسجيل الخروج للمستخدمين المسجلين
                <Button
                  variant="destructive"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </Button>
              ) : (
                // زر تسجيل الدخول للزائرين
                <Button
                  variant="default"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  <span>تسجيل الدخول</span>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
      
      {/* زر العودة للأعلى - يظهر في صفحة تسجيل الدخول فقط */}
      {isLoginPage && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-4 left-4 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="العودة للأعلى"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      {/* WhatsApp Direct Chat Button */}
      <a 
        href="https://wa.me/966547271676"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 z-50"
        aria-label="تواصل معنا عبر واتساب"
        title="للأسئلة والاستفسارات"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          <span className="text-sm font-medium">واتساب</span>
        </div>
      </a>
    </>
  );
} 