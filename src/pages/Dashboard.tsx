import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator, Bot, Building, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            أدواتك جاهزة ✨، استخدمها بثقة
          </h1>
          <p className="text-gray-600">
            استكشف أدواتنا المتقدمة وابدأ رحلتك العقارية اليوم
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* حاسبة التمويل */}
          <Link to="/calculator" className="block">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <Calculator className="h-12 w-12 text-primary mb-4" />
                <CardTitle>حاسبة التمويل</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  تعرف كم تقدر تشتري عقارك؟ جرب حاسبتنا الذكية وتعرف على قدرتك الشرائية في ثواني
                </p>
                <Button variant="outline" className="w-full">
                  ابدأ الآن
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* البوت العقاري */}
          <Link to="/ai-assistant" className="block">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <Bot className="h-12 w-12 text-primary mb-4" />
                <CardTitle>البوت العقاري</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  اسأل اللي تبي، وبوتنا يجاوبك لحظيًا وكأن معك خبير عقار جنبك
                </p>
                <Button variant="outline" className="w-full">
                  ابدأ الآن
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* الدليل العقاري */}
          <Link to="/guide" className="block">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <Building className="h-12 w-12 text-primary mb-4" />
                <CardTitle>الدليل العقاري</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  لا تدخل السوق وانت ضايف، حمّل دليلنا وخلّك أذكى من السوق
                </p>
                <Button variant="outline" className="w-full">
                  ابدأ الآن
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* المقارنة */}
          <Link to="/compare" className="block">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <ArrowRight className="h-12 w-12 text-primary mb-4" />
                <CardTitle>المقارنة</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  احترت بين مشروعين؟ أداة المقارنة تحسمها لك بالأرقام
                </p>
                <Button variant="outline" className="w-full">
                  ابدأ الآن
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
