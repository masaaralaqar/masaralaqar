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
          
          <div className="flex flex-wrap justify-center items-center gap-6 my-4 max-w-xl">
            <div className="flex flex-wrap justify-center items-center gap-3">
              <img src="https://maroof.sa/Images/VisaCard.png" alt="فيزا" title="فيزا" width="40" height="25" loading="lazy" />
              <img src="https://maroof.sa/Images/MasterCard.png" alt="ماستر كارد" title="ماستر كارد" width="40" height="25" loading="lazy" />
              <img src="https://maroof.sa/Images/mada.png" alt="مدى" title="مدى" width="40" height="25" loading="lazy" />
              <img src="https://maroof.sa/Images/ApplePay.png" alt="آبل باي" title="آبل باي" width="40" height="25" loading="lazy" />
            </div>
            
            <div className="flex items-center gap-2 mr-2">
              <a 
                href="https://maroof.sa/359034" 
                target="_blank" 
                rel="noopener noreferrer"
                title="رقم معروف: 359034"
              >
                <img 
                  src="https://maroof.sa/Images/maroof.png" 
                  alt="شهادة معروف" 
                  width="60" 
                  height="25"
                  loading="lazy"
                />
              </a>
              <span className="text-xs text-muted-foreground">359034</span>
            </div>
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
        </div>
      </div>
    </footer>
  );
};

export default Footer; 