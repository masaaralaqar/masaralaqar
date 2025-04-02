import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/auth-context";
// Temporarily removed ThemeProvider due to path issues
// import { ThemeProvider } from "./components/theme-provider"; 

// Import page/component for the AI bot
import { SaudiRealEstateExpert } from "./components/SaudiRealEstateExpert"; 

// Import legal pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Login from "./pages/Login";

// Import components for Header/Footer
import Header from "./components/Header";
import Footer from "./components/Footer";

// Re-adding import for the Index page (Calculator)
import Index from "./pages/Index";
// Re-adding import for the Bank Comparison page
import BankComparison from "./pages/BankComparison";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {isAuthenticated && <Header />}
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <Routes>
          {/* Login page */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
          } />
          <Route path="/ai-assistant" element={
              <ProtectedRoute>
                <SaudiRealEstateExpert />
              </ProtectedRoute>
          } />
          <Route path="/bank-comparison" element={
              <ProtectedRoute>
                <BankComparison />
              </ProtectedRoute>
          } />
          
          {/* Legal pages - not protected */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          
          {/* Redirect all other routes to login if not authenticated */}
          <Route path="*" element={
            isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />
          } />
        </Routes>
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
