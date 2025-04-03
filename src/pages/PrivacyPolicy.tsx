import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div dir="rtl" className="container mx-auto px-4 py-8 max-w-4xl text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        🛡️ سياسة الخصوصية – "مسار العقار"
      </h1>

      <section className="mb-8">
        <p className="mb-6 leading-relaxed text-lg">
          نلتزم في "مسار العقار" بحماية خصوصية مستخدمينا. نهدف من خلال هذه السياسة إلى توضيح كيفية جمع واستخدام وحماية بياناتك عند استخدام منصتنا.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">1. البيانات التي نجمعها</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 mr-4">
          <li>البيانات التي تدخلها في حاسبة العقار</li>
          <li>الأسئلة والاستفسارات التي ترسلها للبوت التفاعلي</li>
          <li>بيانات التسجيل في حالة إنشاء حساب</li>
          <li>بيانات تصفح عامة مثل الموقع الجغرافي ونوع المتصفح</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">2. استخدام البيانات</h2>
        <p className="mb-4 leading-relaxed">
          نستخدم البيانات التي نجمعها من أجل:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 mr-4">
          <li>تقديم وتحسين الخدمات المقدمة</li>
          <li>تخصيص تجربة المستخدم</li>
          <li>تحليل أنماط الاستخدام لتطوير المنصة</li>
          <li>الرد على استفساراتك</li>
        </ul>
        <p className="mb-4 leading-relaxed font-semibold text-green-600 dark:text-green-400">
          ✅ نحن لا نبيع أو نشارك معلوماتك الشخصية مع أي طرف ثالث لأغراض تسويقية.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">3. حماية البيانات</h2>
        <p className="mb-4 leading-relaxed">
          نتخذ إجراءات أمنية للحفاظ على بياناتك، بما في ذلك:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 mr-4">
          <li>تشفير البيانات الحساسة</li>
          <li>استخدام اتصالات آمنة (HTTPS)</li>
          <li>مراجعة دورية لإجراءات الأمان</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">4. ملفات تعريف الارتباط (Cookies)</h2>
        <p className="mb-4 leading-relaxed">
          نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل استخدام الموقع. يمكنك ضبط متصفحك لرفض هذه الملفات، ولكن ذلك قد يؤثر على بعض وظائف المنصة.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">5. حقوقك</h2>
        <p className="mb-4 leading-relaxed">
          يحق لك:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 mr-4">
          <li>الوصول إلى بياناتك الشخصية</li>
          <li>طلب تصحيح أو حذف بياناتك</li>
          <li>الاعتراض على معالجة بياناتك</li>
          <li>سحب موافقتك في أي وقت</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">6. التعديلات على سياسة الخصوصية</h2>
        <p className="mb-4 leading-relaxed">
          قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر إشعار على موقعنا.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300 dark:border-gray-700">7. التواصل معنا</h2>
        <p className="mb-4 leading-relaxed">
          لأي استفسارات بخصوص سياسة الخصوصية، يرجى التواصل عبر:
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy; 