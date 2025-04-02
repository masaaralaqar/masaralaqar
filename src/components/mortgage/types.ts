export interface Bank {
  id: string;
  name: string;
  rate: number;
}

export interface MortgageResultsType {
  maxLoan: number;
  monthlyPayment: number;
  supportAmount: number;
  actualPayment: number;
  supportPercentage: number;
  loanToValue: number;
  bankName: string;
  interestRate: number;
  totalInterest: number;
  totalPayment: number;
  approvalChance: string;
  sakaniSupport?: number;
  isEligible?: boolean;
  eligibilityReason?: string;
  bankComparison?: ComparisonBankData[];
}

// --- Added Type for Bank Comparison Table Data ---
export interface ComparisonBankData {
  bankName: string;
  rate: number;
  monthlyPayment: number;
  totalPayment: number;
}
// --- End Added Type ---

export interface MortgageCalculatorState {
  salary: number;
  obligations: number;
  familySize: number;
  loanYears: number;
  results: MortgageResultsType | null;
  selectedBank: string;
  employmentSector: string;
  propertyType: string;
  propertyState: string;
  propertyValue: number;
  downPayment: number;
  employerName?: string;
  salaryTransfer?: boolean;
}

export interface BankComparisonItem {
  bankId: string;
  bankName: string;
  interestRate: number;
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  colorHex: string;
}

export interface PaymentPeriod {
  period: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface AmortizationSchedule {
  bankId: string;
  bankName: string;
  periods: PaymentPeriod[];
}

// Step configuration for sequential form
export type StepId = 'personal' | 'property' | 'loan';

export interface Step {
  id: StepId;
  title: string;
  icon: React.ReactNode;
}

// Platform description for various pages
export const PLATFORM_DESCRIPTION = {
  short: "المنصة الذكية لاتخاذ قرارات عقارية سليمة",
  medium: "منصة مسار العقار تساعدك في اتخاذ قرارات عقارية سليمة وصحيحة من خلال أدوات تحليل ذكية ومعلومات موثوقة",
  long: "منصة مسار العقار ليست منصة تمويل عقاري، بل هي منصة استشارية متخصصة تساعدك في اتخاذ قرارات عقارية سليمة وصحيحة استناداً إلى تحليل البيانات والمعلومات الموثوقة. نوفر لك أدوات حساب ذكية ومعلومات محدثة لمساعدتك في فهم خياراتك العقارية واتخاذ أفضل القرارات المالية."
};

// Banking regulations reference data
export const BANKING_REGULATIONS = {
  minSalary: 4000, // الحد الأدنى للراتب للأهلية للتمويل العقاري
  maxDebtToIncome: 0.65, // الحد الأقصى لنسبة الالتزامات إلى الدخل
  minRetiredSalary: 3000, // الحد الأدنى للراتب التقاعدي
  minDownPaymentPercentage: {
    residential: 0.1, // الحد الأدنى للدفعة المقدمة للوحدات السكنية (10%)
    land: 0.3 // الحد الأدنى للدفعة المقدمة للأراضي (30%)
  }
};
