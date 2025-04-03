import React, { useEffect } from "react";
import { BankComparisonPage } from "../components/mortgage/BankComparisonPage";
import { Toaster } from "@/components/ui/toaster";
import { preventAutoScroll } from "@/lib/utils";

const BankComparison = () => {
  // التأكد من فتح الصفحة من الأعلى
  useEffect(() => {
    preventAutoScroll();
  }, []);

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">مقارنة البنوك</h1>
          <p className="text-muted-foreground">
            قارن بين مختلف البنوك للحصول على أفضل عروض التمويل العقاري
          </p>
        </div>
        <BankComparisonPage />
      </div>
      <Toaster />
    </div>
  );
};

export default BankComparison;
