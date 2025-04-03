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
        </div>
      </div>
    </footer>
  );
};

export default Footer; 