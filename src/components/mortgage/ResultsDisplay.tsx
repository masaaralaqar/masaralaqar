
import React from "react";
import { Card } from "@/components/ui/card";
import { Info, CreditCard, Percent, Clock, Users, Building, Calculator, Landmark, Gift } from "lucide-react";
import { SlideIn } from "@/components/ui/transitions";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { MortgageResultsType } from "./types";

interface ResultItemProps {
  label: string;
  value: string;
  primary?: boolean;
  icon?: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

export function ResultItem({ 
  label, 
  value, 
  primary = false,
  icon,
  className = "", 
  valueClassName = ""
}: ResultItemProps) {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span className="text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className={`font-semibold text-lg ${primary ? 'text-primary' : ''} ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}

interface ResultsDisplayProps {
  results: MortgageResultsType | null;
  formatCurrency: (amount: number) => string;
}

export function ResultsDisplay({ results, formatCurrency }: ResultsDisplayProps) {
  if (!results) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-10 border-dashed">
        <Info size={48} className="text-muted-foreground mb-4 opacity-50" />
        <p className="text-center text-muted-foreground">
          أدخل بياناتك واضغط على زر الحساب لمعرفة التمويل المتاح لك
        </p>
      </Card>
    );
  }

  return (
    <SlideIn direction="left">
      <GlassCard intensity="heavy" className="h-full">
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2">
            <Landmark size={20} />
            <span>نتائج التمويل من {results.bankName}</span>
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="space-y-6">
            <ResultItem 
              label="مبلغ التمويل الأقصى" 
              value={formatCurrency(results.maxLoan)} 
              primary
              icon={<CreditCard size={16} />}
            />
            <ResultItem 
              label="نسبة التمويل إلى قيمة العقار" 
              value={`${results.loanToValue}%`}
              icon={<Percent size={16} />}
            />
            <ResultItem 
              label="معدل الربح السنوي" 
              value={`${results.interestRate}%`}
              icon={<Percent size={16} />}
            />
            <ResultItem 
              label="القسط الشهري الإجمالي" 
              value={formatCurrency(results.monthlyPayment)} 
              icon={<Clock size={16} />}
            />
            <ResultItem 
              label="نسبة الدعم المتوقعة" 
              value={`${results.supportPercentage}%`} 
              icon={<Users size={16} />}
            />
            <ResultItem 
              label="مبلغ الدعم الشهري" 
              value={formatCurrency(results.supportAmount)} 
              icon={<Building size={16} />}
            />
            {results.sakaniSupport && (
              <ResultItem 
                label="دعم برنامج سكني (مقدم)" 
                value={formatCurrency(results.sakaniSupport)} 
                primary
                icon={<Gift size={16} />}
              />
            )}
            <ResultItem 
              label="القسط الشهري بعد الدعم" 
              value={formatCurrency(results.actualPayment)} 
              primary
              icon={<Calculator size={16} />}
            />
            
            <div className="py-3 my-2 border-t border-b border-border">
              <ResultItem 
                label="إجمالي تكلفة التمويل" 
                value={formatCurrency(results.totalPayment)} 
                icon={<Calculator size={16} />}
              />
              <ResultItem 
                label="إجمالي الأرباح المدفوعة" 
                value={formatCurrency(results.totalInterest)}
                className="mt-2" 
                icon={<Percent size={16} />}
              />
              <ResultItem 
                label="احتمالية الموافقة على التمويل" 
                value={results.approvalChance}
                valueClassName={
                  results.approvalChance === "عالية" 
                    ? "text-green-500" 
                    : results.approvalChance === "متوسطة" 
                      ? "text-yellow-500" 
                      : "text-red-500"
                }
                className="mt-2" 
                icon={<Info size={16} />}
              />
            </div>
            
            <div className="pt-4 mt-4 border-t border-border flex items-start gap-2 text-sm text-muted-foreground">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>
                هذه النتائج تقريبية وتعتمد على بيانات مدخلة محددة. قد تختلف الشروط والأحكام الفعلية حسب سياسة البنك والجهة التمويلية. دعم برنامج سكني يقدم مباشرة مقدماً كخصم من قيمة العقار.
              </p>
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>
    </SlideIn>
  );
}
