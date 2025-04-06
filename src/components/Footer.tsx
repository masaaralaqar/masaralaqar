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
          
          {/* شعار ورقم معروف */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-20 h-auto">
              <img 
                src={import.meta.env.MODE === 'production' ? '/masaralaqar/assets/maroof-logo.svg' : '/assets/maroof-logo.svg'} 
                alt="معروف" 
                className="w-full h-auto"
              />
            </div>
            <p className="text-xs text-muted-foreground">رقم معروف: 359034</p>
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