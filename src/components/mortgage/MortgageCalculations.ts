
import { MortgageResultsType } from "./types";

// حساب نسبة الدعم بناءً على الراتب وعدد أفراد الأسرة
export const calculateSupportPercentage = (salary: number, familySize: number): number => {
  if (salary <= 14000) {
    return 100;
  }
  
  const excessAmount = Math.floor((salary - 14000) / 1000);
  let supportPercentage = Math.max(35, 100 - (excessAmount * 5));
  
  // إضافة بونص لحجم الأسرة
  if (familySize > 3) {
    supportPercentage = Math.min(100, supportPercentage + ((familySize - 3) * 5));
  }
  
  return supportPercentage;
};

// حساب الحد الأقصى لنسبة الاستقطاع بناءً على الدخل
export const calculateMaxInstallmentPercentage = (salary: number): number => {
  // تحديث النسب وفقًا للوائح البنك المركزي السعودي (ساما)
  if (salary < 5000) {
    return 45; // الحد الأقصى للاستقطاع للرواتب المنخفضة
  } else if (salary <= 10000) {
    return 50;
  } else if (salary <= 15000) {
    return 55;
  } else if (salary <= 25000) {
    return 65;
  } else {
    return 70; // الحد الأقصى للاستقطاع للرواتب العالية
  }
};

// التحقق من الأهلية للتمويل
export const checkEligibility = (
  salary: number, 
  obligations: number, 
  employmentSector: string,
  propertyValue: number,
  propertyType: string,
  downPayment: number
): { isEligible: boolean; reason?: string } => {
  // التحقق من الحد الأدنى للراتب
  if (salary < 4000) {
    return { 
      isEligible: false, 
      reason: "الراتب أقل من الحد الأدنى المطلوب (4000 ريال)" 
    };
  }
  
  // التحقق من نسبة الالتزامات الشهرية إلى الدخل
  const debtToIncome = obligations / salary;
  if (debtToIncome > 0.65) {
    return { 
      isEligible: false, 
      reason: "نسبة الالتزامات الحالية تتجاوز الحد المسموح به (65%)"
    };
  }
  
  // التحقق من قطاع العمل (في حالة المتقاعدين)
  if (employmentSector === "retired" && salary < 3000) {
    return { 
      isEligible: false,
      reason: "الراتب التقاعدي أقل من الحد الأدنى المطلوب للمتقاعدين"
    };
  }
  
  // التحقق من نسبة الدفعة المقدمة
  if (propertyType === "apartment" || propertyType === "house") {
    // للوحدات السكنية: يجب أن تكون الدفعة المقدمة 10% على الأقل
    const minDownPayment = propertyValue * 0.1;
    if (downPayment < minDownPayment) {
      return { 
        isEligible: false, 
        reason: `الدفعة المقدمة أقل من الحد الأدنى المطلوب (${Math.round(minDownPayment)} ريال، أي 10% من قيمة العقار)`
      };
    }
  } else if (propertyType === "land") {
    // للأراضي: يجب أن تكون الدفعة المقدمة 30% على الأقل
    const minDownPayment = propertyValue * 0.3;
    if (downPayment < minDownPayment) {
      return { 
        isEligible: false, 
        reason: `الدفعة المقدمة أقل من الحد الأدنى المطلوب للأراضي (${Math.round(minDownPayment)} ريال، أي 30% من قيمة الأرض)`
      };
    }
  }
  
  return { isEligible: true };
};

// تقييم فرصة الموافقة على التمويل
export const evaluateApprovalChance = (loanToValue: number, salary: number, obligations: number): string => {
  const debtToIncome = obligations / salary;
  
  if (loanToValue > 90 || debtToIncome > 0.5) {
    return "منخفضة";
  } else if (loanToValue > 75 || debtToIncome > 0.4) {
    return "متوسطة";
  } else {
    return "عالية";
  }
};

// حساب مبلغ الدعم من برنامج سكني
export const calculateSakaniSupport = (salary: number, familySize: number): number => {
  // قيمة الدعم الحكومي الأساسي (100,000 ريال أو 150,000 ريال)
  let baseSupport = 100000;
  
  // زيادة الدعم للأسر الأكبر حجماً
  if (familySize >= 5) {
    baseSupport = 150000;
  }
  
  // تقليل الدعم للرواتب الأعلى
  if (salary > 20000) {
    const reductionFactor = Math.min(1, (salary - 20000) / 20000);
    baseSupport = Math.max(50000, baseSupport - (baseSupport * reductionFactor * 0.5));
  }
  
  return Math.round(baseSupport);
};
