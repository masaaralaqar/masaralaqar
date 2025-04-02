
import React from "react";
import { FadeIn, SlideIn } from "./ui/transitions";
import { GlassCard } from "./ui/glass-card";
import { cn } from "@/lib/utils";
import { ArrowDown, Calculator, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function Hero() {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20 px-4 sm:px-6">
      {/* Enhanced Background with Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="absolute top-1/3 right-1/3 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/3 w-[250px] md:w-[450px] h-[250px] md:h-[450px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>
      
      {/* Main Content */}
      <div className="container max-w-7xl mx-auto text-center z-10">
        <FadeIn delay={100}>
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm bg-background/50 backdrop-blur-sm">
            <span className="mr-1 text-primary">✦</span> 
            <span>الحلول المالية الذكية</span>
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6 text-foreground">
            <span className="block">مسار العقار</span>
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent block mt-2">
              الطريق الأمثل للتمويل العقاري
            </span>
          </h1>
        </FadeIn>
        
        <SlideIn delay={300} direction="up">
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 md:mb-14 max-w-3xl mx-auto leading-relaxed px-4">
            نقدم لك حلولاً متكاملة للتمويل العقاري مع حاسبة متطورة ومساعد ذكي يعمل بتقنيات الذكاء الاصطناعي
            لمساعدتك في اتخاذ أفضل القرارات المالية
          </p>
        </SlideIn>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto mb-10">
          <SlideIn delay={500} direction="right">
            <Link to="#calculator" className="block h-full group">
              <GlassCard 
                className="h-full p-8 md:p-10 text-center transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
                hoverEffect={true}
                intensity="light"
                borderEffect="subtle"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 shadow-sm">
                    <Calculator className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">حاسبة التمويل العقاري</h3>
                  <p className="text-muted-foreground text-base md:text-lg">
                    احسب بدقة قيمة القرض وقسطك الشهري والدعم المتاح لك بناءً على معايير التمويل الحديثة
                  </p>
                  <Button variant="ghost" className="mt-6 group-hover:bg-primary/10 transition-colors">
                    ابدأ الحساب الآن
                    <ArrowDown className="mr-2 h-4 w-4 rotate-[270deg]" />
                  </Button>
                </div>
              </GlassCard>
            </Link>
          </SlideIn>
          
          <SlideIn delay={700} direction="left">
            <Link to="#assistant" className="block h-full group">
              <GlassCard 
                className="h-full p-8 md:p-10 text-center transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
                hoverEffect={true}
                intensity="light" 
                borderEffect="subtle"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 shadow-sm">
                    <MessageSquare className="w-10 h-10 text-cyan-600" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">المساعد العقاري الذكي</h3>
                  <p className="text-muted-foreground text-base md:text-lg">
                    احصل على إجابات فورية لجميع استفساراتك حول التمويل العقاري وخيارات السكن المتاحة لك
                  </p>
                  <Button variant="ghost" className="mt-6 group-hover:bg-cyan-500/10 transition-colors">
                    استشر المساعد الآن
                    <ArrowDown className="mr-2 h-4 w-4 rotate-[270deg]" />
                  </Button>
                </div>
              </GlassCard>
            </Link>
          </SlideIn>
        </div>
        
        {/* Stats Section */}
        <SlideIn delay={900} direction="up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mt-8 mb-12">
            <div className="flex flex-col items-center p-4">
              <span className="text-3xl md:text-4xl font-bold text-primary mb-2">+50,000</span>
              <span className="text-sm md:text-base text-muted-foreground">مستخدم نشط</span>
            </div>
            <div className="flex flex-col items-center p-4">
              <span className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</span>
              <span className="text-sm md:text-base text-muted-foreground">نسبة الرضا</span>
            </div>
            <div className="flex flex-col items-center p-4">
              <span className="text-3xl md:text-4xl font-bold text-primary mb-2">+15</span>
              <span className="text-sm md:text-base text-muted-foreground">بنك متاح</span>
            </div>
            <div className="flex flex-col items-center p-4">
              <span className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</span>
              <span className="text-sm md:text-base text-muted-foreground">دعم متواصل</span>
            </div>
          </div>
        </SlideIn>
      </div>
      
      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="p-2 bg-background/70 backdrop-blur-sm rounded-full shadow-sm border border-border/50">
          <ArrowDown className="text-primary h-6 w-6" />
        </div>
      </div>
    </section>
  );
}
