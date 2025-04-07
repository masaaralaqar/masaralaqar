import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 bg-muted/30">
      <div className="container">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-32 h-auto">
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
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
            <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" />
            <img src="https://img.icons8.com/color/48/amex.png" alt="American Express" />
            <img src="https://img.icons8.com/color/48/mada-card.png" alt="Mada" />
            <img src="https://seeklogo.com/images/S/stc-pay-logo-B1CA44F339-seeklogo.com.png" alt="STC Pay" style={{height: "48px"}} />
            <img src="https://img.icons8.com/color/48/apple-pay.png" alt="Apple Pay" />
            <img src="https://maroof.sa/assets/imgs/maroof-logo.svg" alt="معروف" style={{height: "48px"}} title="موثّق في معروف - رقم: 359034" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Saudi_Ministry_of_Commerce_Logo.svg/200px-Saudi_Ministry_of_Commerce_Logo.svg.png" alt="شهادة منصة الأعمال" style={{height: "48px"}} title="موثّق عبر وزارة التجارة" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 