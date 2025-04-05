import React, { useState, useEffect, useRef } from "react";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "./ui/glass-card";
import { Button } from "@/components/ui/button";
import { Calculator, AlertTriangle, ArrowRight, Check, ArrowLeft, Info, Landmark } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PersonalInfoTab } from "./mortgage/PersonalInfoTab";
import { PropertyInfoTab } from "./mortgage/PropertyInfoTab";
import { LoanInfoTab } from "./mortgage/LoanInfoTab";
import { ResultsDisplay } from "./mortgage/ResultsDisplay";
import { Bank, MortgageResultsType, Step, StepId, PLATFORM_DESCRIPTION } from "./mortgage/types";
import { 
  calculateSupportPercentage, 
  calculateMaxInstallmentPercentage,
  evaluateApprovalChance,
  calculateSakaniSupport,
  checkEligibility
} from "./mortgage/MortgageCalculations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StepNavigation } from "./mortgage/StepNavigation";
import { BankComparisonTable } from "./mortgage/BankComparisonTable";
import { preventScrollOnNavigation, preventAutoScroll } from "@/lib/utils";

export function MortgageCalculator() {
  const { toast } = useToast();
  const [salary, setSalary] = useState<number>(10000);
  const [obligations, setObligations] = useState<number>(0);
  const [familySize, setFamilySize] = useState<number>(3);
  const [loanYears, setLoanYears] = useState<number>(25);
  const [results, setResults] = useState<MortgageResultsType | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>("alrajhi");
  const [employmentSector, setEmploymentSector] = useState<string>("government");
  const [propertyType, setPropertyType] = useState<string>("apartment");
  const [propertyState, setPropertyState] = useState<string>("ready");
  const [propertyValue, setPropertyValue] = useState<number>(500000);
  const [downPayment, setDownPayment] = useState<number>(50000);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);
  // مرجع للنتائج لاستخدامه في التمرير التلقائي
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Step navigation state
  const [currentStep, setCurrentStep] = useState<StepId>('personal');
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());

  // Define the steps
  const steps: Step[] = [
    { id: 'personal', title: 'بيانات المستفيد', icon: <Calculator size={18} /> },
    { id: 'property', title: 'بيانات العقار', icon: <Calculator size={18} /> },
    { id: 'loan', title: 'بيانات التمويل', icon: <Calculator size={18} /> },
  ];

  // تعريف البنوك ومعدلات الفائدة - محدثة وفقًا للمعلومات المقدمة
  const banks: Bank[] = [
    { id: "riyad", name: "بنك الرياض", rate: 3.70 },
    { id: "snb", name: "البنك الأهلي السعودي", rate: 3.90 },
    { id: "alrajhi", name: "مصرف الراجحي", rate: 4.10 },
    { id: "jazira", name: "بنك الجزيرة", rate: 3.64 },
    { id: "albilad", name: "بنك البلاد", rate: 3.99 },
    { id: "anb", name: "البنك العربي الوطني", rate: 4.00 },
    { id: "bsf", name: "البنك السعودي الفرنسي", rate: 3.99 },
    { id: "alinma", name: "مصرف الإنماء", rate: 3.99 },
  ];

  // Mock data for bank comparison - rates might differ from the selection list
  const comparisonBanks: Bank[] = [
    { id: "riyad", name: "بنك الرياض", rate: 3.75 },
    { id: "snb", name: "البنك الأهلي السعودي", rate: 3.95 },
    { id: "alrajhi", name: "مصرف الراجحي", rate: 4.15 },
    { id: "jazira", name: "بنك الجزيرة", rate: 3.70 },
    { id: "albilad", name: "بنك البلاد", rate: 4.05 },
    { id: "anb", name: "البنك العربي الوطني", rate: 4.05 },
    { id: "bsf", name: "البنك السعودي الفرنسي", rate: 4.00 },
    { id: "alinma", name: "مصرف الإنماء", rate: 4.00 },
  ];

  // تطبيق منع التمرير التلقائي عند تحميل المكون
  useEffect(() => {
    preventAutoScroll();
  }, []);

  // Get interest rate for the *selected* bank for the main calculation
  const getBankInterestRate = (): number => {
    const selectedBankData = banks.find(bank => bank.id === selectedBank);
    return selectedBankData ? selectedBankData.rate / 100 : 0.04;
  };

  // Go to a specific step
  const goToStep = (stepId: StepId) => {
    if (completedSteps.has(stepId)) {
      // منع التمرير التلقائي عند التنقل بين الخطوات
      preventScrollOnNavigation();
      setCurrentStep(stepId);
    }
  };

  // Move to the next step or complete the form
  const handleNextStep = () => {
    // منع التمرير التلقائي عند الانتقال للخطوة التالية
    preventScrollOnNavigation();
    
    // Mark current step as completed
    setCompletedSteps(prev => {
      const newCompleted = new Set(prev);
      newCompleted.add(currentStep);
      return newCompleted;
    });
    
    // Find the current step index
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    // If there's a next step, move to it
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    } else {
      // If we're on the last step, calculate the mortgage
      calculateMortgage();
    }
  };

  // Move to the previous step if available
  const handlePreviousStep = () => {
    // منع التمرير التلقائي عند الرجوع للخطوة السابقة
    preventScrollOnNavigation();
    
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  // Check if the current step is valid to proceed
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 'personal':
        return salary >= 4000; // Minimum salary requirement
      case 'property':
        return propertyValue > 0 && downPayment >= 0;
      case 'loan':
        return selectedBank && loanYears >= 5;
      default:
        return false;
    }
  };

  const calculateMortgage = () => {
    // التحقق من الأهلية أولاً
    const eligibilityCheck = checkEligibility(
      salary, 
      obligations, 
      employmentSector,
      propertyValue,
      propertyType,
      downPayment
    );
    
    if (!eligibilityCheck.isEligible) {
      setEligibilityError(eligibilityCheck.reason || "غير مؤهل للتمويل");
      setResults(null);
      
      toast({
        title: "غير مؤهل للتمويل",
        description: eligibilityCheck.reason,
        variant: "destructive",
      });
      
      return;
    }
    
    // إذا كان مؤهلاً، نحسب التمويل المتاح
    setEligibilityError(null);
    
    // حساب نسبة الدعم
    const supportPercentage = calculateSupportPercentage(salary, familySize);
    
    // حساب الحد الأقصى للقسط الشهري
    const maxInstallmentPercentage = calculateMaxInstallmentPercentage(salary);
    const maxMonthlyInstallment = (salary * (maxInstallmentPercentage / 100)) - obligations;
    
    // الحصول على معدل الفائدة للبنك المحدد
    const annualInterestRate = getBankInterestRate();
    const monthlyInterestRate = annualInterestRate / 12;
    const numberOfPayments = loanYears * 12;
    
    // حساب قيمة القرض القصوى
    const loanToValue = ((propertyValue - downPayment) / propertyValue) * 100;
    const maxLoanByProperty = propertyValue - downPayment;
    
    // قيود النسبة المئوية للتمويل بناءً على نوع العقار
    let maxLoanPercentage = propertyType === "land" ? 70 : 90;
    
    // التحقق من الحد الأقصى للتمويل بناءً على نسبة التمويل إلى القيمة
    const maxLoanByLTV = propertyValue * (maxLoanPercentage / 100);
    
    // حساب أقصى قرض استنادًا إلى القدرة على السداد
    const maxLoanByPayment = Math.min(
      (maxMonthlyInstallment / monthlyInterestRate) * 
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments)),
      1500000 // وضع حد أقصى للتمويل
    );
    
    // اختيار الحد الأدنى من بين القيود المختلفة
    const maxLoan = Math.min(maxLoanByProperty, maxLoanByLTV, maxLoanByPayment);
    
    // حساب مبلغ التمويل المدعوم (برنامج سكني)
    const supportedAmount = Math.min(maxLoan, 500000);
    const unsupportedAmount = Math.max(0, maxLoan - 500000);
    
    // حساب القسط الشهري الإجمالي
    const totalMonthlyPayment = 
      (maxLoan * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    // حساب مبلغ الدعم الشهري من خلال نسبة الدعم
    const principalPayment = maxLoan / numberOfPayments;
    const interestPortion = totalMonthlyPayment - principalPayment;
    const supportedInterestPortion = interestPortion * (supportedAmount / Math.max(1, maxLoan));
    const monthlyInterestSupport = supportedInterestPortion * (supportPercentage / 100);
    
    // حساب دعم سكني (الدعم المقدم مقدماً)
    const sakaniSupport = calculateSakaniSupport(salary, familySize);
    
    // حساب القسط بعد خصم الدعم الشهري
    const actualPayment = totalMonthlyPayment - monthlyInterestSupport;
    
    // حساب إجمالي الفائدة على مدى فترة القرض
    const totalInterest = (totalMonthlyPayment * numberOfPayments) - maxLoan;
    
    // تقييم فرصة الموافقة
    const approvalChance = evaluateApprovalChance(loanToValue, salary, obligations);
    
    // الحصول على اسم البنك المحدد
    const selectedBankName = banks.find(bank => bank.id === selectedBank)?.name || "غير محدد";

    // --- Calculate comparison data ---
    const bankComparisonData = calculateBankComparisonData(maxLoan, loanYears);
    // --- End calculation ---

    setResults({
      maxLoan: Math.round(maxLoan),
      monthlyPayment: Math.round(totalMonthlyPayment),
      supportAmount: Math.round(monthlyInterestSupport),
      actualPayment: Math.round(actualPayment),
      supportPercentage,
      loanToValue: Math.round(loanToValue * 10) / 10,
      bankName: selectedBankName,
      interestRate: annualInterestRate * 100,
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalMonthlyPayment * numberOfPayments),
      approvalChance,
      sakaniSupport,
      bankComparison: bankComparisonData
    });
    
    // التمرير إلى النتائج بعد الانتهاء من الحساب
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    
    toast({
      title: "تم احتساب التمويل",
      description: "تم إجراء الحسابات بناءً على البيانات المدخلة",
    });
  };

  // --- Function to calculate comparison data ---
  const calculateBankComparisonData = (loanAmount: number, loanYears: number) => {
    const comparisonData = comparisonBanks.map(bank => {
      const monthlyRate = (bank.rate / 100) / 12;
      const numberOfPayments = loanYears * 12;
      let monthlyPayment = 0;
      let totalPayment = 0;

      if (monthlyRate > 0 && numberOfPayments > 0 && loanAmount > 0) {
         monthlyPayment = 
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
         totalPayment = monthlyPayment * numberOfPayments;
      } else if (loanAmount > 0 && numberOfPayments > 0) {
         // Handle 0% interest rate case
         monthlyPayment = loanAmount / numberOfPayments;
         totalPayment = loanAmount;
      }

      return {
        bankName: bank.name,
        rate: bank.rate,
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(totalPayment),
      };
    });
    return comparisonData;
  };
  // --- End function ---

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { 
      style: 'currency', 
      currency: 'SAR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  // Render the active step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <PersonalInfoTab
            salary={salary}
            setSalary={setSalary}
            obligations={obligations}
            setObligations={setObligations}
            familySize={familySize}
            setFamilySize={setFamilySize}
            employmentSector={employmentSector}
            setEmploymentSector={setEmploymentSector}
            formatCurrency={formatCurrency}
          />
        );
      case 'property':
        return (
          <PropertyInfoTab
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            propertyState={propertyState}
            setPropertyState={setPropertyState}
            propertyValue={propertyValue}
            setPropertyValue={setPropertyValue}
            downPayment={downPayment}
            setDownPayment={setDownPayment}
            formatCurrency={formatCurrency}
          />
        );
      case 'loan':
        return (
          <LoanInfoTab
            selectedBank={selectedBank}
            setSelectedBank={setSelectedBank}
            loanYears={loanYears}
            setLoanYears={setLoanYears}
            banks={banks}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 mb-10">
      {/* الخطوات والمدخلات */}
      <div className="flex items-center justify-center w-full mb-2">
        <div className="w-full max-w-2xl">
          <StepNavigation 
            steps={steps} 
            currentStep={currentStep}
            completedSteps={completedSteps}
            goToStep={goToStep}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <GlassCard className="h-full">
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <Calculator size={20} />
                <span>حاسبة التمويل العقاري</span>
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="pb-8">
              {eligibilityError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{eligibilityError}</AlertDescription>
                </Alert>
              )}
              
              {renderStepContent()}
              
              <div className="flex items-center justify-between mt-8">
                {currentStep !== steps[0].id && (
                  <Button 
                    className="flex items-center gap-2"
                    onClick={handlePreviousStep}
                  >
                    <ArrowRight size={16} />
                    <span>السابق</span>
                  </Button>
                )}
                
                <div className="mr-auto">
                  <Button 
                    className="flex items-center gap-2" 
                    disabled={!isCurrentStepValid()}
                    onClick={handleNextStep}
                  >
                    <span>{currentStep === steps[steps.length - 1].id ? 'احسب التمويل' : 'التالي'}</span>
                    {currentStep === steps[steps.length - 1].id ? (
                      <Calculator size={16} />
                    ) : (
                      <ArrowLeft size={16} />
                    )}
                  </Button>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
        
        <div className="xl:col-span-1" ref={resultsRef}>
          <ResultsDisplay results={results} formatCurrency={formatCurrency} />
        </div>
      </div>
      
      {/* جدول مقارنة العروض المصرفية */}
      {results && (
        <div className="my-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Landmark size={24} />
            <span>مقارنة عروض البنوك</span>
          </h2>
          <div className="bg-card rounded-xl border shadow-sm p-4 overflow-x-auto">
            <BankComparisonTable 
              comparisonData={results.bankComparison} 
              formatCurrency={formatCurrency} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
