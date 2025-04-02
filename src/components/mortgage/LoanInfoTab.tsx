
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { StaggeredChildren } from "@/components/ui/transitions";
import { Bank } from "./types";

interface LoanInfoTabProps {
  selectedBank: string;
  setSelectedBank: (value: string) => void;
  loanYears: number;
  setLoanYears: (value: number) => void;
  banks: Bank[];
}

export function LoanInfoTab({
  selectedBank,
  setSelectedBank,
  loanYears,
  setLoanYears,
  banks
}: LoanInfoTabProps) {
  return (
    <StaggeredChildren staggerDelay={100} className="space-y-6">
      <div>
        <Label htmlFor="bank-select" className="mb-2 block">البنك الممول</Label>
        <Select defaultValue={selectedBank} onValueChange={setSelectedBank}>
          <SelectTrigger id="bank-select">
            <SelectValue placeholder="اختر البنك" />
          </SelectTrigger>
          <SelectContent>
            {banks.map(bank => (
              <SelectItem key={bank.id} value={bank.id}>
                {bank.name} - {bank.rate}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="loan-years" className="flex items-center gap-2 mb-2">
          مدة القرض (بالسنوات)
          <span className="text-primary font-semibold">{loanYears}</span>
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            id="loan-years"
            min={5}
            max={30}
            step={1}
            value={[loanYears]}
            onValueChange={(values) => setLoanYears(values[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={loanYears}
            onChange={(e) => setLoanYears(Number(e.target.value))}
            className="w-24"
            dir="ltr"
          />
        </div>
      </div>

      <div className="bg-secondary/30 p-4 rounded-md">
        <div className="flex items-start gap-2">
          <Info size={18} className="shrink-0 mt-0.5 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">معلومات إضافية:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>التمويل المدعوم من سكني يغطي أول 500,000 ريال</li>
              <li>نسبة التمويل للأراضي عادة لا تتجاوز 70% من قيمة العقار</li>
              <li>نسبة التمويل للوحدات السكنية تصل إلى 90% كحد أقصى</li>
              <li>مدة السداد القصوى تتأثر بعمر المستفيد ونوع العقار</li>
            </ul>
          </div>
        </div>
      </div>
    </StaggeredChildren>
  );
}
