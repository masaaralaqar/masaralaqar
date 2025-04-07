import React from 'react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const faqItems = [
    {
      question: 'ما هي منصة مسار العقار؟',
      answer: 'مسار العقار هي منصة إلكترونية ذكية تساعد الأفراد في السعودية على اتخاذ قرارات تملك عقاري صحيحة، من خلال أدوات مثل حاسبة تمويل دقيقة، بوت استشارات عقارية، ودليل شامل لرحلة التملك.'
    },
    {
      question: 'هل الاشتراك لمرة واحدة فقط؟',
      answer: 'نعم، الاشتراك يتم دفعه مرة واحدة فقط بقيمة 49 ريال، ويفتح لك الوصول الكامل لجميع أدوات المنصة بدون رسوم شهرية أو تجديدات.'
    },
    {
      question: 'هل أحتاج إلى خبرة عقارية لاستخدام المنصة؟',
      answer: 'لا، المنصة مصممة لتناسب الجميع، سواء كنت مبتدئ أو لديك معرفة بسيطة. كل أداة فيها تشرح نفسها بخطوات بسيطة وسهلة.'
    },
    {
      question: 'ما هي الأدوات المتاحة داخل المنصة؟',
      answer: 'توفر المنصة: حاسبة تمويل عقاري، دليل تملك عقاري خطوة بخطوة، بوت استشارات ذكي يجاوب على أسئلتك، وأداة مقارنة عقارات.'
    },
    {
      question: 'كيف أتواصل مع الدعم الفني؟',
      answer: 'تقدر تتواصل معنا مباشرة عبر واتساب أو البريد الإلكتروني، وسنقوم بالرد في أقرب وقت.'
    }
  ];

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">الأسئلة الشائعة</h1>
      
      <div className="space-y-6">
        {faqItems.map((item, index) => (
          <div key={index} className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
            <p className="text-gray-700">{item.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link to="/contact" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90">
          تواصل معنا
        </Link>
      </div>
    </div>
  );
}
