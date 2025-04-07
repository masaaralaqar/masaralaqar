import React from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">اتصل بنا</h1>
      
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">نرحب باستفساراتكم واقتراحاتكم في أي وقت</p>
          <p className="text-gray-600">فريق مسار العقار جاهز للرد على جميع أسئلتكم وتقديم الدعم اللازم.</p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">البريد الإلكتروني</h3>
            <a href="mailto:masaaralaqar@gmail.com" className="text-primary hover:underline">
              masaaralaqar@gmail.com
            </a>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">رقم التواصل عبر الواتساب</h3>
            <a href="https://wa.me/966547271676" className="text-primary hover:underline">
              00966547271676
            </a>
          </div>
        </div>

        <div className="text-center">
          <Link to="/faq" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90">
            راجع الأسئلة الشائعة
          </Link>
        </div>
      </div>
    </div>
  );
}
