import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 bg-muted/30">
      <div className="container">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-32 h-auto mb-2">
            <img 
              src={import.meta.env.MODE === 'production' ? '/masaralaqar/assets/masar-logo.svg' : '/assets/masar-logo.svg'} 
              alt="مسار العقار" 
              className="w-full h-auto"
            />
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} جميع المعلومات المقدمة في هذه المنصة هي لأغراض معلوماتية فقط.
          </p>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/privacy-policy"
              className="text-sm text-primary hover:underline"
            >
              سياسة الخصوصية
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              to="/terms-conditions"
              className="text-sm text-primary hover:underline"
            >
              الشروط والأحكام
            </Link>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border/30 w-full">
            <p className="text-sm text-center text-muted-foreground mb-3">طرق الدفع المدعومة وشهادات الموثوقية</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-8" />
              <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-8" />
              <img src="https://img.icons8.com/color/48/amex.png" alt="American Express" className="h-8" />
              <img src="https://img.icons8.com/color/48/mada-card.png" alt="Mada" className="h-8" />
              <img src="https://seeklogo.com/images/S/stc-pay-logo-B1CA44F339-seeklogo.com.png" alt="STC Pay" className="h-9" />
              <img src="https://img.icons8.com/color/48/apple-pay.png" alt="Apple Pay" className="h-8" />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
              <div className="flex flex-col items-center">
                <img src="/assets/certificate.png" alt="معروف" className="h-12" />
                <p className="text-xs text-muted-foreground mt-1">رقم معروف: 359034</p>
              </div>
              
              <div className="flex flex-col items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Saudi_Ministry_of_Commerce_Logo.svg/200px-Saudi_Ministry_of_Commerce_Logo.svg.png" 
                  alt="شهادة منصة الأعمال" 
                  className="h-10" 
                  title="موثّق عبر وزارة التجارة" 
                />
                <p className="text-xs text-muted-foreground mt-1">وزارة التجارة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 