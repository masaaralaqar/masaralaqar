import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 bg-muted/30">
      <div className="container">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-base font-medium">مسار العقار</p>
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
          
          {/* وسائل الدفع الآمنة */}
          <div className="mt-4 pt-4 border-t border-border/30 w-full">
            <p className="text-sm text-center text-muted-foreground mb-3">وسائل دفع آمنة</p>
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <div className="payment-icon">
                <img src={import.meta.env.MODE === 'production' ? '/masaralaqar/assets/payment-icons/apple-pay.svg' : '/assets/payment-icons/apple-pay.svg'} alt="Apple Pay" className="h-8" />
              </div>
              <div className="payment-icon">
                <img src={import.meta.env.MODE === 'production' ? '/masaralaqar/assets/payment-icons/mada.svg' : '/assets/payment-icons/mada.svg'} alt="مدى" className="h-8" />
              </div>
              <div className="payment-icon">
                <img src={import.meta.env.MODE === 'production' ? '/masaralaqar/assets/payment-icons/visa.svg' : '/assets/payment-icons/visa.svg'} alt="Visa" className="h-7" />
              </div>
              <div className="payment-icon">
                <img src={import.meta.env.MODE === 'production' ? '/masaralaqar/assets/payment-icons/mastercard.svg' : '/assets/payment-icons/mastercard.svg'} alt="Mastercard" className="h-7" />
              </div>
              <div className="payment-icon">
                <img src={import.meta.env.MODE === 'production' ? '/masaralaqar/assets/payment-icons/stcpay.svg' : '/assets/payment-icons/stcpay.svg'} alt="STC Pay" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 