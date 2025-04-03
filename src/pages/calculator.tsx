import React, { useEffect } from "react";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import { preventAutoScroll } from "@/lib/utils";
import SEO from "@/components/ui/seo-head";

export default function CalculatorPage() {
  // Ensure page loads from the top
  useEffect(() => {
    preventAutoScroll();
  }, []);

  // Schema.org structured data para la calculadora
  const calculatorSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "حاسبة التمويل العقاري - مسار العقار",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "SAR"
    },
    "operatingSystem": "All"
  };

  return (
    <div className="w-full">
      <SEO
        title="حاسبة التمويل العقاري - مسار العقار"
        description="احسب قيمة التمويل العقاري المناسب لك بناءً على دخلك والتزاماتك المالية واعرف قيمة القسط الشهري والدعم المستحق"
        schema={calculatorSchema}
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">حاسبة التمويل العقاري</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            احسب قيمة التمويل العقاري المناسب لك بناءً على دخلك والتزاماتك المالية
          </p>
        </div>
        <MortgageCalculator />
      </div>
    </div>
  );
} 