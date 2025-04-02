import React from "react";
import { MortgageCalculator } from "@/components/MortgageCalculator";

export default function Index() {
  return (
    <div className="w-full">
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
