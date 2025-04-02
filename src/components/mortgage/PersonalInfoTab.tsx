
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StaggeredChildren } from "@/components/ui/transitions";

interface PersonalInfoTabProps {
  salary: number;
  setSalary: (value: number) => void;
  obligations: number;
  setObligations: (value: number) => void;
  familySize: number;
  setFamilySize: (value: number) => void;
  employmentSector: string;
  setEmploymentSector: (value: string) => void;
  formatCurrency: (amount: number) => string;
}

export function PersonalInfoTab({
  salary,
  setSalary,
  obligations,
  setObligations,
  familySize,
  setFamilySize,
  employmentSector,
  setEmploymentSector,
  formatCurrency
}: PersonalInfoTabProps) {
  return (
    <StaggeredChildren staggerDelay={100} className="space-y-6">
      <div>
        <Label htmlFor="salary" className="flex items-center gap-2 mb-2">
          الراتب الشهري
          <span className="text-primary font-semibold">{formatCurrency(salary)}</span>
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            id="salary"
            min={4000}
            max={50000}
            step={500}
            value={[salary]}
            onValueChange={(values) => setSalary(values[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-24"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="obligations" className="flex items-center gap-2 mb-2">
          الالتزامات الشهرية
          <span className="text-primary font-semibold">{formatCurrency(obligations)}</span>
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            id="obligations"
            min={0}
            max={20000}
            step={100}
            value={[obligations]}
            onValueChange={(values) => setObligations(values[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={obligations}
            onChange={(e) => setObligations(Number(e.target.value))}
            className="w-24"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="family-size" className="flex items-center gap-2 mb-2">
          عدد أفراد الأسرة
          <span className="text-primary font-semibold">{familySize}</span>
        </Label>
        <div className="flex items-center gap-4">
          <Slider
            id="family-size"
            min={1}
            max={10}
            step={1}
            value={[familySize]}
            onValueChange={(values) => setFamilySize(values[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={familySize}
            onChange={(e) => setFamilySize(Number(e.target.value))}
            className="w-24"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <Label className="mb-2 block">قطاع العمل</Label>
        <RadioGroup 
          defaultValue="government" 
          onValueChange={setEmploymentSector}
          value={employmentSector}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="government" id="government" />
            <Label htmlFor="government">قطاع حكومي</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="military" id="military" />
            <Label htmlFor="military">قطاع عسكري</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">قطاع خاص</Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <RadioGroupItem value="retired" id="retired" />
            <Label htmlFor="retired">متقاعد</Label>
          </div>
        </RadioGroup>
      </div>
    </StaggeredChildren>
  );
}
