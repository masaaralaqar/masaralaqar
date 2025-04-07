import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, Bot, Building, ShoppingCart, ArrowRight, ExternalLink, ArrowDown, Flame } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { preventAutoScroll } from "@/lib/utils";
import SEO from "@/components/ui/seo-head";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Ensure page loads from the top
  useEffect(() => {
    preventAutoScroll();
  }, []);

  // Navigate to login page first, then redirect to the target page after authentication
  const handleFeatureClick = (targetPath: string) => {
    if (user) {
      navigate(targetPath);
    } else {
      // Save the target path to redirect after login
      localStorage.setItem("redirectAfterLogin", targetPath);
      navigate("/login");
    }
  };

  // بيانات Schema.org المنظمة للصفحة الرئيسية
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "/",
    "name": "مسار العقار - دليلك الذكي في عالم العقار",
    "description": "منصة سعودية تساعد المهتمين بالعقار في اكتساب المعرفة الصحيحة، عبر دليل عقاري شامل، وبوت ذكي يجاوب على استفساراتك، وأدوات تسهّل عليك فهم التمويل، الاستثمار، وصيانة المنزل.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const features = [
    {
      icon: <Calculator className="h-12 w-12 text-primary" />,
      title: "حاسبة التمويل",
      description: "أداة حسابية توضح لك الأرقام المتوقعة بناءً على مدخلاتك",
      path: "/calculator",
    },
    {
      icon: <Bot className="h-12 w-12 text-primary" />,
      title: "البوت العقاري",
      description: "يجيب على استفساراتك العقارية العامة ويساعدك في فهم المصطلحات والمفاهيم الأساسية",
      path: "/ai-assistant",
    },
    {
      icon: <Building className="h-12 w-12 text-primary" />,
      title: "مقارنة البنوك",
      description: "مقارنة سهلة للمعلومات العامة المتاحة عن منتجات التمويل المختلفة",
      path: "/bank-comparison",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="مسار العقار - دليلك الذكي في عالم العقار" description="منصة سعودية تساعد المهتمين بالعقار في اكتساب المعرفة الصحيحة، عبر دليل عقاري شامل، وبوت ذكي يجاوب على استفساراتك، وأدوات تسهّل عليك فهم التمويل، الاستثمار، وصيانة المنزل." />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-8 md:py-12 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-primary">
            مسار العقار – شريكك الموثوق في رحلة العقار
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 md:mb-12 px-4">
            منصة سعودية متخصصة تساعدك في فهم عالم العقار بكل سهولة. نوفر لك أدوات ذكية وحلول عملية
            تخليك تتخذ قرارات صح في رحلتك العقارية، سواء كنت تبي تشتري، تستثمر، أو تطور عقارك.
          </p>
        </section>

        {/* قسم شراء الدليل العقاري */}
        <section className="container pb-12 md:pb-16 px-4">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl p-6 md:p-10 shadow-lg border border-primary/30">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="md:w-2/3">
                <h2 className="text-xl md:text-3xl font-bold mb-4 text-primary">
                  عرض العيد! وفّر أكثر من 80% 🎉
                </h2>
                <p className="text-base leading-relaxed mb-4">
                  دليل شامل يجمع لك كل اللي تحتاجه عن العقار في السعودية.
                  معلومات قيّمة وأدوات احترافية تساعدك في رحلتك العقارية.
                </p>
                <div className="bg-primary/10 rounded-lg p-4 mb-6">
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-primary">
                        عرض محدود!
                      </p>
                      <div className="bg-orange-500/10 p-1.5 rounded-full">
                        <Flame className="h-5 w-5 text-orange-500" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      فرصة ذهبية بسعر خاص لفترة محدودة
                    </p>
                  </div>

                  <div className="flex items-center gap-2 my-3">
                    <span className="text-2xl font-bold text-primary">49 ريال</span>
                    <span className="text-sm line-through text-muted-foreground">299 ريال</span>
                  </div>

                  <div className="bg-orange-500/10 rounded p-2 text-sm text-muted-foreground">
                    <p className="text-center font-medium">
                      ترا العرض محدود، لا تفوت الفرصة!
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-primary/90 mb-2">
                  وش تحصل في الدليل؟
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2 mr-4">
                  <li>وصول كامل لجميع خدمات المنصة</li>
                  <li>معلومات مختارة بعناية من تجارب حقيقية</li>
                  <li>نصائح وإرشادات تختصر عليك الطريق</li>
                  <li>دعم فني لأي استفسار</li>
                </ul>
                <div className="space-y-4">
                  <Button 
                    size="lg"
                    className="w-full group bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-full transition-all shadow-md hover:shadow-lg"
                    onClick={() => window.open("#", "_blank")}
                  >
                    <ShoppingCart className="h-5 w-5 ml-2 group-hover:-translate-x-1 transition-transform duration-300" />
                    اشتره الآن بـ 49 ريال
                    <ExternalLink className="h-4 w-4 mr-2 opacity-70" />
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    خربناها! السعر بيرجع 299 ريال بعد انتهاء العرض 🔥
                  </p>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md rotate-3 transform hover:rotate-0 transition-all duration-300">
                  <img 
                    src={import.meta.env.MODE === 'production' 
                      ? 'https://masaralaqar.sa/assets/guide-cover.svg' 
                      : '/assets/guide-cover.svg'
                    } 
                    alt="دليل مسار العقار" 
                    className="w-56 h-auto object-contain rounded-lg"
                    onError={(e) => {
                      console.log('Error loading image, using fallback');
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // منع التكرار اللانهائي
                      target.src = "https://placehold.co/400x500/5f9fca/ffffff?text=دليل+مسار+العقار";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-8 md:py-12 bg-muted/30">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-primary text-center">
            خدماتنا المميزة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-5 md:p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="mb-4 md:mb-6 flex items-center justify-center">
                  <div className="bg-primary/10 p-3 md:p-4 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-5 md:mb-6 text-center flex-grow">
                  {feature.description}
                </p>
                <Button 
                  className="w-full"
                  onClick={() => handleFeatureClick(feature.path)}
                >
                  {feature.title === "البوت العقاري" ? "جربه الآن" : "جربها الحين"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="container py-8 md:py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-muted/50 rounded-xl p-5 md:p-8 shadow-sm border border-border">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">رؤيتنا</h2>
              <p className="text-sm md:text-lg leading-relaxed">
                نطمح نكون المرجع الأول في السعودية للي يبي يفهم العقار بشكل صحيح وسهل.
                نقدم المعلومة بأسلوب عصري وذكي يناسب احتياجات مجتمعنا.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-5 md:p-8 shadow-sm border border-border">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">هدفنا</h2>
              <p className="text-sm md:text-lg leading-relaxed">
                نساعد كل سعودي يتخذ قراراته العقارية بثقة وعلم، من خلال أدوات تفاعلية
                وبوت ذكي يفهم لهجتنا ويقدم النصيحة المناسبة.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
