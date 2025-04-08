import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator, Bot, Building, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
              مسار العقار - أداواتك الذكية لتحقيق حلمك العقاري
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              ابدأ رحلتك العقارية بثقة مع أدواتنا المتقدمة
            </p>
            <Link to="/login" className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              اشترك الآن بـ 49 ريال
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">أدواتنا التي ستحتاجها</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* حاسبة التمويل */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
              <Calculator className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">حاسبة التمويل</h3>
              <p className="text-gray-600 mb-4">
                تعرف كم تقدر تشتري عقارك؟ جرب حاسبتنا الذكية وتعرف على قدرتك الشرائية في ثواني
              </p>
              <Link to="/calculator" className="text-primary hover:underline">
                جرب الآن
              </Link>
            </div>

            {/* البوت العقاري */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
              <Bot className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">البوت العقاري</h3>
              <p className="text-gray-600 mb-4">
                اسأل اللي تبي، وبوتنا يجاوبك لحظيًا وكأن معك خبير عقار جنبك
              </p>
              <Link to="/ai-assistant" className="text-primary hover:underline">
                جرب الآن
              </Link>
            </div>

            {/* الدليل العقاري */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
              <Building className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">الدليل العقاري</h3>
              <p className="text-gray-600 mb-4">
                لا تدخل السوق وانت ضايف، حمّل دليلنا وخلّك أذكى من السوق
              </p>
              <Link to="/guide" className="text-primary hover:underline">
                جرب الآن
              </Link>
            </div>

            {/* المقارنة */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
              <ArrowRight className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">المقارنة</h3>
              <p className="text-gray-600 mb-4">
                احترت بين مشروعين؟ أداة المقارنة تحسمها لك بالأرقام
              </p>
              <Link to="/compare" className="text-primary hover:underline">
                جرب الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              استفد من أدواتنا المتقدمة بـ 49 ريال فقط
            </h2>
            <p className="text-lg text-white/90 mb-8">
              ابدأ رحلتك العقارية اليوم مع مسار العقار
            </p>
            <Link to="/login" className="inline-flex items-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors">
              اشترك الآن
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
