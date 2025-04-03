import React, { useEffect } from "react";
import { SaudiRealEstateExpert } from "../components/SaudiRealEstateExpert";
import { Toaster } from "@/components/ui/toaster";
import { preventAutoScroll } from "@/lib/utils";

export default function RealEstateAdvisor() {
  // منع التمرير التلقائي عند تحميل الصفحة
  useEffect(() => {
    const cleanup = preventAutoScroll();
    
    // تطبيق متكرر لمنع أي تمرير لاحق
    const additionalPrevention = setInterval(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    // إيقاف التطبيق المتكرر بعد ثانية
    const stopPrevention = setTimeout(() => {
      clearInterval(additionalPrevention);
    }, 1000);
    
    return () => {
      if (cleanup) cleanup();
      clearInterval(additionalPrevention);
      clearTimeout(stopPrevention);
    };
  }, []);

  return (
    <div className="w-full">
      <SaudiRealEstateExpert />
      <Toaster />
    </div>
  );
} 