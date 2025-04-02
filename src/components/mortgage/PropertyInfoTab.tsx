
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StaggeredChildren } from "@/components/ui/transitions";

interface PropertyInfoTabProps {
  propertyType: string;
  setPropertyType: (value: string) => void;
  propertyState: string;
  setPropertyState: (value: string) => void;
  propertyValue: number;
  setPropertyValue: (value: number) => void;
  downPayment: number;
  setDownPayment: (value: number) => void;
  formatCurrency: (amount: number) => string;
}

export function PropertyInfoTab({
  propertyType,
  setPropertyType,
  propertyState,
  setPropertyState,
  propertyValue,
  setPropertyValue,
  downPayment,
  setDownPayment,
  formatCurrency
}: PropertyInfoTabProps) {
  return (
    <StaggeredChildren staggerDelay={100} className="space-y-6">
      <div>
        <Label className="mb-2 block">نوع العقار</Label>
        <RadioGroup 
          defaultValue="apartment" 
          onValueChange={setPropertyType}
          value={propertyType}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="apartment" id="apartment" />
            <Label htmlFor="apartment">شقة سكنية</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="villa" id="villa" />
            <Label htmlFor="villa">فيلا</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="townhouse" id="townhouse" />
            <Label htmlFor="townhouse">تاون هاوس</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="land" id="land" />
            <Label htmlFor="land">أرض</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="mb-2 block">حالة العقار</Label>
        <RadioGroup 
          defaultValue="ready"
          onValueChange={setPropertyState}
          value={propertyState}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="ready" id="ready" />
            <Label htmlFor="ready">جاهز</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="offplan" id="offplan" />
            <Label htmlFor="offplan">على الخارطة</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="selfbuild" id="selfbuild" />
            <Label htmlFor="selfbuild">بناء ذاتي</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="property-value" className="flex items-center gap-2 mb-2">
          قيمة العقار التقديرية
          <span className="text-primary font-semibold">{formatCurrency(propertyValue)}</span>
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            id="property-value"
            min={200000}
            max={5000000}
            step={50000}
            value={[propertyValue]}
            onValueChange={(values) => setPropertyValue(values[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={propertyValue}
            onChange={(e) => setPropertyValue(Number(e.target.value))}
            className="w-24"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="down-payment" className="flex items-center gap-2 mb-2">
          الدفعة المقدمة
          <span className="text-primary font-semibold">{formatCurrency(downPayment)}</span>
          <span className="text-xs text-muted-foreground">
            ({Math.round((downPayment / propertyValue) * 100)}%)
          </span>
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            id="down-payment"
            min={0}
            max={Math.min(propertyValue, 2000000)}
            step={10000}
            value={[downPayment]}
            onValueChange={(values) => setDownPayment(values[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-24"
            dir="ltr"
          />
        </div>
      </div>
    </StaggeredChildren>
  );
}
