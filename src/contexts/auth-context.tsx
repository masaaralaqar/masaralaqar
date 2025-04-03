import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  sessionToken?: string;
  lastActive?: number;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAccess: (path: string) => boolean;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// كلمة المرور التي يحصل عليها المستخدم عند شراء الدليل
const DEMO_PASSWORD = "123456"; 

// قائمة الصفحات المحمية التي تتطلب تسجيل الدخول
const PROTECTED_PATHS = ["/calculator", "/ai-assistant", "/bank-comparison"];

// المدة التي يبقى المستخدم نشطًا فيها (بالمللي ثانية) - 2 ساعة
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

// إنشاء رمز CSRF فريد 
const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// تشفير بسيط للمعلومات (في الإنتاج يجب استخدام مكتبة تشفير حقيقية)
const encryptData = (data: any): string => {
  return btoa(JSON.stringify(data));
};

// فك تشفير البيانات
const decryptData = (encryptedData: string): any => {
  try {
    return JSON.parse(atob(encryptedData));
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // التحقق من جلسة المستخدم عند تحميل التطبيق
  useEffect(() => {
    const loadUserSession = () => {
      // التحقق من وجود بيانات المستخدم عند تحميل التطبيق
      const encryptedSession = localStorage.getItem("user_session");
      if (encryptedSession) {
        try {
          const session = decryptData(encryptedSession);
          
          if (session) {
            // التحقق من صلاحية الجلسة
            const now = new Date().getTime();
            if (session.lastActive && now - session.lastActive < SESSION_TIMEOUT) {
              setUser(session.user);
              setIsAuthenticated(true);
              
              // تحديث وقت آخر نشاط
              refreshSession();
            } else {
              // انتهت الجلسة
              localStorage.removeItem("user_session");
              localStorage.removeItem("csrf_token");
            }
          }
        } catch (error) {
          console.error("Failed to parse stored user session:", error);
          localStorage.removeItem("user_session");
          localStorage.removeItem("csrf_token");
        }
      }
      setIsLoading(false);
    };
    
    loadUserSession();
    
    // إضافة مستمع لتحديث الجلسة عند التفاعل مع الصفحة
    const handleUserActivity = () => {
      if (isAuthenticated) {
        refreshSession();
      }
    };
    
    // تحديث الجلسة عند التفاعل مع الصفحة
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    
    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [isAuthenticated]);

  // تحديث جلسة المستخدم
  const refreshSession = () => {
    if (user) {
      const csrfToken = localStorage.getItem("csrf_token") || generateCSRFToken();
      
      const sessionData = {
        user: user,
        lastActive: new Date().getTime(),
        csrfToken
      };
      
      localStorage.setItem("csrf_token", csrfToken);
      localStorage.setItem("user_session", encryptData(sessionData));
    }
  };

  const login = async (name: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // التحقق من كلمة المرور فقط
    if (password === DEMO_PASSWORD) {
      // إنشاء رمز CSRF
      const csrfToken = generateCSRFToken();
      localStorage.setItem("csrf_token", csrfToken);
      
      const authenticatedUser = { 
        id: Date.now().toString(), // إنشاء معرف فريد
        name: name,
        sessionToken: generateCSRFToken(), // رمز جلسة آمن
        lastActive: new Date().getTime()
      };
      
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      
      // تخزين بيانات الجلسة بشكل آمن
      const sessionData = {
        user: authenticatedUser,
        lastActive: new Date().getTime(),
        csrfToken
      };
      
      localStorage.setItem("user_session", encryptData(sessionData));
      setIsLoading(false);
      
      // التحقق من وجود مسار للتوجيه بعد تسجيل الدخول
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      }
      
      toast({
        title: `أهلاً بك ${name}`,
        description: "مرحباً بك في منصة مسار العقار",
      });
      return true;
    }
    
    setIsLoading(false);
    toast({
      title: "فشل تسجيل الدخول",
      description: "كلمة المرور غير صحيحة",
      variant: "destructive",
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_session");
    localStorage.removeItem("csrf_token");
    setIsAuthenticated(false);
    navigate("/");
    toast({
      title: "تم تسجيل الخروج بنجاح",
    });
  };

  // دالة للتحقق من الوصول إلى مسار معين
  const checkAccess = (path: string): boolean => {
    // التحقق من صلاحية الجلسة قبل التحقق من الوصول
    const encryptedSession = localStorage.getItem("user_session");
    if (encryptedSession) {
      const session = decryptData(encryptedSession);
      if (session) {
        const now = new Date().getTime();
        if (session.lastActive && now - session.lastActive > SESSION_TIMEOUT) {
          // انتهت الجلسة
          logout();
          return false;
        }
      }
    }
    
    // إذا كان المسار محميًا ولا يوجد مستخدم مسجل الدخول
    return !(PROTECTED_PATHS.includes(path) && !isAuthenticated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isLoading,
        checkAccess,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
