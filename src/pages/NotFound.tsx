
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { FadeIn, SlideIn } from "@/components/ui/transitions";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Header />
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <FadeIn>
            <h1 className="text-9xl font-bold text-primary/20">404</h1>
          </FadeIn>
          <SlideIn direction="up" delay={300}>
            <h2 className="text-2xl font-semibold mb-6 -mt-4">الصفحة غير موجودة</h2>
            <p className="text-muted-foreground mb-8">
              لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.
            </p>
            <Button asChild size="lg">
              <a href="/" className="inline-flex items-center gap-2">
                <Home size={18} />
                <span>العودة للصفحة الرئيسية</span>
              </a>
            </Button>
          </SlideIn>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
