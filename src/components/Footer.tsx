import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using react-router-dom

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center lg:text-right mt-auto py-4 border-t border-border/40">
      <div className="container mx-auto px-6 text-gray-700 dark:text-gray-300">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          {/* Copyright - Combined for all screen sizes */}
          <div className="text-sm text-gray-600 dark:text-gray-400 lg:col-span-1 text-center lg:text-right">
            <span>جميع الحقوق محفوظة &copy; {currentYear} مسار العقار</span>
          </div>

          {/* Links */}
          <div className="flex justify-center space-x-6 rtl:space-x-reverse lg:col-span-1">
            <Link to="/privacy-policy" className="hover:text-gray-900 dark:hover:text-white text-sm">
              سياسة الخصوصية
            </Link>
            <Link to="/terms-conditions" className="hover:text-gray-900 dark:hover:text-white text-sm">
              الشروط والأحكام
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 dark:text-gray-400 lg:col-span-1 text-center lg:text-left mt-2 lg:mt-0">
            <p>
              تنويه: المعلومات لأغراض عامة فقط وليست استشارة. استشر مختصاً دائماً.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 