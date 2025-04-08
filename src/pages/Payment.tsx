import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Info, CreditCard } from 'lucide-react';

export default function Payment() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement real payment processing when API keys are provided
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold mb-4">
                اشترك الآن بـ 49 ريال
              </CardTitle>
              <p className="text-gray-600 mb-8">
                ستحصل على الوصول الكامل لجميع أدواتنا المتقدمة
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Registration Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Payment Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-6 w-6 text-primary mr-2" />
                    <h3 className="text-lg font-semibold">معلومات الدفع</h3>
                  </div>
                  <Alert variant="default">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      سيتم توجيهك لواجهة الدفع الآمنة بعد إكمال المعلومات
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  اكمل عملية الدفع
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="mt-12 space-y-4">
            <h3 className="text-xl font-semibold">ما الذي ستحصل عليه؟</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2" />
                <span className="text-gray-600">وصول فوري لجميع أدوات المنصة</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2" />
                <span className="text-gray-600">دعم فني متواصل</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-2" />
                <span className="text-gray-600">تحديثات مستمرة للأدوات</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
