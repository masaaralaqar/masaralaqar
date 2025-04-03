import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { preventAutoScroll } from "./lib/utils";
// Temporarily removed ThemeProvider due to path issues
// import { ThemeProvider } from "./components/theme-provider"; 

// Import page/component for the AI bot
import { SaudiRealEstateExpert } from "./components/SaudiRealEstateExpert"; 

// Import legal pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Login from "./pages/Login";
// Missing pages - removed imports
// import Register from "./pages/Register";
// import Contact from "./pages/Contact";

// Import components for Header/Footer
import Header from "./components/Header";
import Footer from "./components/Footer";

// Re-adding import for the Index page (Calculator)
import Index from "./pages/Index";
// Re-adding import for the Bank Comparison page
import BankComparison from "./pages/BankComparison";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";
// Missing page - removed import
// import LandingPage from "./pages/LandingPage";
import CalculatorPage from "./pages/calculator";
// Missing components - let's create a simple AuthLayout component inline
// import AuthLayout from "./components/AuthLayout";
// import { ProtectedRoute } from "./components/ProtectedRoute";
import { preventScrollOnNavigation } from "@/lib/utils";

// Component for scroll management during navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    preventScrollOnNavigation();
  }, [pathname]);

  return null;
};

// Enhanced ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // حفظ المسار للتوجيه بعد تسجيل الدخول
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// قائمة الصفحات العامة التي لا تتطلب تسجيل الدخول
const PUBLIC_PATHS = ["/", "/login", "/privacy-policy", "/terms-conditions"];

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // تطبيق التمرير لأعلى عند تحميل المكون الرئيسي
  useEffect(() => {
    preventAutoScroll();
  }, []);

  // التحقق مما إذا كان المسار الحالي هو مسار عام
  const isPublicPath = PUBLIC_PATHS.includes(location.pathname);
  
  // يجب أن يظهر الهيدر في جميع الصفحات ما عدا صفحة تسجيل الدخول
  const shouldShowHeader = location.pathname !== "/login";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <ScrollToTop />
      {shouldShowHeader && <Header />}
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <Routes>
          {/* صفحات عامة لا تتطلب تسجيل الدخول */}
          <Route path="/" element={<Index />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/login" element={<Login />} />
          
          {/* صفحات محمية تتطلب تسجيل الدخول */}
          <Route path="/calculator" element={
            <ProtectedRoute>
              <CalculatorPage />
            </ProtectedRoute>
          } />
          <Route path="/bank-comparison" element={
            <ProtectedRoute>
              <BankComparison />
            </ProtectedRoute>
          } />
          <Route path="/ai-assistant" element={
            <ProtectedRoute>
              <SaudiRealEstateExpert />
            </ProtectedRoute>
          } />
          
          {/* التعامل مع المسارات غير الموجودة - توجيه للصفحة الرئيسية */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {/* إظهار الفوتر على جميع الصفحات ما عدا صفحة تسجيل الدخول */}
      {location.pathname !== "/login" && <Footer />}
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading (e.g., for font loading, assets, etc.)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
