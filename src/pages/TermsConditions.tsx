import React from 'react';

const TermsConditions: React.FC = () => {
  return (
    <div dir="rtl" className="container mx-auto px-4 py-8 max-w-4xl text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        📄 الشروط والأحكام – "مسار العقار"
      </h1>

      <section className="mb-8">
        <p className="mb-6 leading-relaxed text-lg">
          مرحبًا بك في مسار العقار، باستخدامك لمنصتنا فإنك توافق على الشروط التالية، لذا يرجى قراءتها بعناية.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">1. طبيعة المنصة</h2>
        <p className="mb-4 leading-relaxed">
          "مسار العقار" هي منصة إلكترونية تهدف إلى مساعدة المستخدمين في فهم المجال العقاري من خلال أدوات معرفية مثل:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 mr-4">
          <li>الحاسبة العقارية</li>
          <li>البوت العقاري التفاعلي</li>
          <li>الدليل العقاري ومقارنة عروض البنوك  </li>
        </ul>
        <p className="mb-4 leading-relaxed font-bold text-red-500 dark:text-red-400">
          ❗ لا تُقدم المنصة أي توصيات مالية أو استشارات رسمية، ولا تُعتبر جهة تمويلية أو قانونية.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">2. استخدام المنصة</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 mr-4">
          <li>يجب أن يكون استخدامك للمنصة قانونيًا ومناسبًا</li>
          <li>لا يجوز إساءة استخدام أي ميزة أو محاولة اختراق النظام</li>
          <li>لا تضمن المنصة دقة النتائج بنسبة 100%، والمستخدم يتحمل مسؤولية قراراته</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">3. الحسابات</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 mr-4">
          <li>يجب الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك</li>
          <li>تحتفظ "مسار العقار" بالحق في تعليق أو حذف الحسابات المخالفة</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">4. حقوق الملكية</h2>
        <p className="mb-4 leading-relaxed">
          جميع المحتويات والمواد على المنصة مملوكة لـ "مسار العقار"، ولا يجوز إعادة استخدامها دون إذن كتابي.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">5. التعديلات</h2>
        <p className="mb-4 leading-relaxed">
          قد يتم تعديل الشروط والأحكام في أي وقت، وسيتم إعلام المستخدمين بالتحديثات عبر البريد أو داخل المنصة.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">6. حدود المسؤولية</h2>
        <p className="mb-4 leading-relaxed">
          "مسار العقار" غير مسؤولة عن أي قرارات تُتخذ بناءً على محتوى المنصة أو أدواتها. نوصي دائمًا بمراجعة الجهات الرسمية قبل اتخاذ أي إجراء عقاري.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">7. التواصل</h2>
        <p className="mb-4 leading-relaxed">
          لأي استفسارات بخصوص الشروط والأحكام، يرجى التواصل عبر: 
        </p>
      </section>
    </div>
  );
};

export default TermsConditions; 