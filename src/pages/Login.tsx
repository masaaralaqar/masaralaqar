import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SEO from "@/components/ui/seo-head";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    // إذا كان المستخدم مسجل الدخول بالفعل، وجهه إلى الصفحة الرئيسية
    if (isAuthenticated) {
      // استخدام المسار المناسب اعتماداً على بيئة العمل
      navigate(import.meta.env.MODE === 'production' ? '/' : '/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !password) {
      setError("الرجاء إدخال اسمك الكريم وكلمة المرور");
      return;
    }

    // Protección simple contra ataques de fuerza bruta
    if (attempts >= 5) {
      setError("تم تجاوز عدد المحاولات المسموح بها. الرجاء المحاولة لاحقاً.");
      toast({
        title: "تنبيه أمني",
        description: "تم تجاوز عدد المحاولات المسموح بها. انتظر دقيقة وحاول مرة أخرى.",
        variant: "destructive"
      });
      setTimeout(() => {
        setAttempts(0);
      }, 60000); // Reiniciar después de 1 minuto
      return;
    }

    try {
      setLoading(true);
      const success = await login(name, password);
      if (success) {
        localStorage.setItem("userName", name);
        localStorage.setItem("username", name);
        setAttempts(0);
        // تم التوجيه في وظيفة تسجيل الدخول
      } else {
        setAttempts(attempts + 1);
        setError("كلمة المرور غير صحيحة");
      }
    } catch (error) {
      setError("حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <SEO 
        title="تسجيل الدخول - مسار العقار" 
        description="صفحة تسجيل الدخول لمنصة مسار العقار - دليلك الذكي في عالم العقار" 
        noIndex={true}
      />
      {/* Header with navigation buttons */}
      <header className="py-4 px-4 border-b bg-background">
        <div className="container flex justify-between items-center">
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowRight className="h-4 w-4" />
              <span>رجوع</span>
            </Button>
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                الصفحة الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center space-y-8">
            <div className="flex justify-center py-4">
              <div className="p-3 bg-white/5 rounded-xl shadow-sm flex items-center justify-center">
                <img 
                  src={import.meta.env.MODE === 'production' ? '/logo.svg' : '/logo.svg'} 
                  alt="مسار العقار" 
                  className="h-24 sm:h-32 md:h-40 w-auto object-contain"
                />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">مرحباً بك في مسار العقار</CardTitle>
              <CardDescription className="text-lg">
                الرجاء تسجيل الدخول للمتابعة
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكريم</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسمك الكريم"
                  className="text-right"
                  required
                  autoComplete="username"
                  spellCheck="false"
                  autoCapitalize="off"
                  maxLength={50}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="text-right"
                  required
                  autoComplete="current-password"
                  minLength={6}
                  maxLength={128}
                  disabled={loading}
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span>جاري تسجيل الدخول...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>تسجيل الدخول</span>
                  </>
                )}
              </Button>
              <div className="text-xs text-center text-muted-foreground">
                من خلال تسجيل الدخول، أنت توافق على <Link to="/terms-conditions" className="text-primary hover:underline">الشروط والأحكام</Link> و <Link to="/privacy-policy" className="text-primary hover:underline">سياسة الخصوصية</Link>.
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t bg-background">
        <div className="container flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground">
          <nav className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              سياسة الخصوصية
            </Link>
            <span>•</span>
            <Link to="/terms-conditions" className="hover:text-primary transition-colors">
              الشروط والأحكام
            </Link>
          </nav>
          <p className="text-center">
            جميع الحقوق محفوظة © {new Date().getFullYear()} مسار العقار
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
