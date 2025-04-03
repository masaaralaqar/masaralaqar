import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('ar-SA', { 
    style: 'currency', 
    currency: 'SAR',
    maximumFractionDigits: 0 
  }).format(amount);
}

/**
 * منع التمرير التلقائي للأسفل في المتصفح
 * 
 * دالة محسنة تضمن بقاء الصفحة في الأعلى عند التحميل وتمنع أي محاولات تمرير تلقائية
 */
export function preventAutoScroll() {
  if (typeof window === 'undefined') return;
  
  // تخزين الموضع الأصلي للتمرير
  const originalScrollPosition = window.scrollY;
  
  // إعادة ضبط موضع التمرير بشكل متكرر
  const interval = setInterval(() => {
    window.scrollTo(0, originalScrollPosition);
  }, 10);
  
  // إيقاف إعادة الضبط المتكرر بعد 500 مللي ثانية
  setTimeout(() => {
    clearInterval(interval);
  }, 500);
  
  // إرجاع دالة للتنظيف عند الحاجة
  return () => {
    clearInterval(interval);
  };
}

/**
 * ضبط التمرير عند تغيير المكونات أو الانتقال بينها
 * خاصة بالتنقل داخل نفس الصفحة مثل الحاسبة
 */
export function preventScrollOnNavigation() {
  if (typeof window === 'undefined') return;
  
  // حفظ موضع التمرير الحالي
  const currentPosition = window.scrollY;
  
  // استخدام استراتيجية متعددة المراحل لضمان بقاء موضع التمرير كما هو
  const maintainPosition = () => {
    window.scrollTo(0, 0);
  };
  
  // التطبيق الفوري
  maintainPosition();
  
  // تطبيق في مواقيت مختلفة للتأكد من استمرارية التأثير
  const timers = [
    setTimeout(maintainPosition, 0),
    setTimeout(maintainPosition, 10),
    setTimeout(maintainPosition, 20),
    setTimeout(maintainPosition, 50),
    setTimeout(maintainPosition, 100)
  ];
  
  return () => {
    timers.forEach(timer => clearTimeout(timer));
  };
}
