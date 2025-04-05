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
  isUserLoading: boolean;
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

// وظائف مساعدة للتخزين المحلي - لتجنب أخطاء استخدام localStorage
const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`فشل في تخزين ${key} في localStorage:`, error);
    return false;
  }
};

const safeGetItem = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`فشل في استرجاع ${key} من localStorage:`, error);
    return null;
  }
};

const safeRemoveItem = (key: string) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`فشل في حذف ${key} من localStorage:`, error);
    return false;
  }
};

// تشفير بسيط للمعلومات (في الإنتاج يجب استخدام مكتبة تشفير حقيقية)
const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    const encodedData = encodeURIComponent(jsonString);
    return btoa(encodedData);
  } catch (error) {
    console.error('Error encrypting data:', error);
    return '';
  }
};

// فك تشفير البيانات
const decryptData = (encryptedData: string): any => {
  try {
    // مرحلة أولى - التحقق من أن البيانات موجودة
    if (!encryptedData) {
      return null;
    }
    
    // مرحلة ثانية - فك التشفير
    const decoded = atob(encryptedData);
    if (!decoded) {
      return null;
    }
    
    // مرحلة ثالثة - فك ترميز URI وتحويل إلى كائن
    const decodedData = decodeURIComponent(decoded);
    return JSON.parse(decodedData);
  } catch (e) {
    console.error("Error decrypting data:", e);
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const navigate = useNavigate();
  
  // التحقق من جلسة المستخدم عند تحميل التطبيق
  useEffect(() => {
    const loadUserSession = () => {
      console.log("🔐 Loading user session...");
      // التحقق من وجود بيانات المستخدم عند تحميل التطبيق
      const encryptedSession = safeGetItem("user_session");
      if (encryptedSession) {
        try {
          setIsUserLoading(true);
          const session = decryptData(encryptedSession);
          
          if (session) {
            // التحقق من صلاحية الجلسة
            const now = new Date().getTime();
            if (session.lastActive && now - session.lastActive < SESSION_TIMEOUT) {
              console.log("✅ Valid session found, user:", session.user?.name);
              setUser(session.user);
              setIsAuthenticated(true);
              
              // تحديث وقت آخر نشاط
              refreshSession();
            } else {
              // انتهت الجلسة
              console.log("⏰ Session expired");
              safeRemoveItem("user_session");
              safeRemoveItem("csrf_token");
            }
          }
          setIsUserLoading(false);
        } catch (error) {
          console.error("❌ Failed to parse stored user session:", error);
          safeRemoveItem("user_session");
          safeRemoveItem("csrf_token");
          setIsUserLoading(false);
        }
      } else {
        console.log("🔄 No session found");
        setIsUserLoading(false);
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
      try {
        const csrfToken = safeGetItem("csrf_token") || generateCSRFToken();
        
        const sessionData = {
          user: user,
          lastActive: new Date().getTime(),
          csrfToken
        };
        
        safeSetItem("csrf_token", csrfToken);
        safeSetItem("user_session", encryptData(sessionData));
      } catch (error) {
        console.error('خطأ في تحديث الجلسة:', error);
      }
    }
  };

  const login = async (name: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('التحقق من كلمة المرور:', password, 'المطلوبة:', DEMO_PASSWORD);
    
    // التحقق من كلمة المرور فقط (بطريقة أكثر تسامحًا)
    if (password.trim() === DEMO_PASSWORD.trim()) {
      try {
        // تنظيف اسم المستخدم من أي فراغات أو أحرف غير مرغوبة
        const cleanName = name.trim();
        
        // إنشاء رمز CSRF
        const csrfToken = generateCSRFToken();
        safeSetItem("csrf_token", csrfToken);
        
        const authenticatedUser = { 
          id: Date.now().toString(), // إنشاء معرف فريد
          name: cleanName,
          sessionToken: generateCSRFToken(), // رمز جلسة آمن
          lastActive: new Date().getTime()
        };
        
        // تخزين اسم المستخدم في التخزين المحلي بجميع الصيغ المحتملة لضمان التوافق
        safeSetItem("userName", cleanName);
        safeSetItem("username", cleanName); // للتوافق مع الكود القديم
        
        // تخزين في sessionStorage أيضًا للسهولة
        try {
          sessionStorage.setItem("userName", cleanName);
          sessionStorage.setItem("username", cleanName); // للتوافق مع الكود القديم
        } catch (e) {
          console.error('فشل في تخزين الاسم في sessionStorage:', e);
        }
        
        setUser(authenticatedUser);
        setIsAuthenticated(true);
        
        // تخزين بيانات الجلسة بشكل آمن
        const sessionData = {
          user: authenticatedUser,
          lastActive: new Date().getTime(),
          csrfToken
        };
        
        safeSetItem("user_session", encryptData(sessionData));
        safeSetItem("user", JSON.stringify(authenticatedUser)); // تخزين بيانات المستخدم مباشرة أيضًا
        
        toast({
          title: `أهلاً بك ${cleanName}`,
          description: "مرحباً بك في منصة مسار العقار",
        });
        
        setIsLoading(false);
        
        // إضافة تأخير صغير قبل التوجيه للتأكد من اكتمال تحديث الحالة
        setTimeout(() => {
          // توجيه المستخدم مباشرة إلى الصفحة الرئيسية
          navigate(import.meta.env.MODE === 'production' ? '/masaralaqar/' : '/');
        }, 300);
        
        return true;
      } catch (error) {
        console.error('حدث خطأ أثناء تسجيل الدخول:', error);
        setIsLoading(false);
        toast({
          title: "حدث خطأ أثناء تسجيل الدخول",
          description: "يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
        return false;
      }
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
    // إزالة بيانات المستخدم من جميع التخزينات
    safeRemoveItem("user_session");
    safeRemoveItem("csrf_token");
    safeRemoveItem("userName");
    
    // إزالة البيانات من sessionStorage أيضًا
    try {
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("username");
    } catch (e) {
      console.error('فشل في إزالة الاسم من sessionStorage:', e);
    }
    
    setIsAuthenticated(false);
    navigate(import.meta.env.MODE === 'production' ? '/masaralaqar/' : '/');
    toast({
      title: "تم تسجيل الخروج بنجاح",
    });
  };

  // دالة للتحقق من الوصول إلى مسار معين
  const checkAccess = (path: string): boolean => {
    // التحقق من صلاحية الجلسة قبل التحقق من الوصول
    const encryptedSession = safeGetItem("user_session");
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
        isUserLoading,
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
