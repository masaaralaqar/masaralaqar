import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BankComparisonItem, AmortizationSchedule } from "./types";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BankComparisonChartsProps {
  comparisonItems: BankComparisonItem[];
  amortizationSchedules: AmortizationSchedule[];
  loanYears: number;
  formatCurrency: (amount: number) => string;
}

export const BankComparisonCharts: React.FC<BankComparisonChartsProps> = ({
  comparisonItems,
  amortizationSchedules,
  loanYears,
  formatCurrency,
}) => {
  const monthlyPaymentData = comparisonItems.map(item => ({
    name: item.bankName,
    payment: item.monthlyPayment,
    fill: item.colorHex,
  }));

  const totalInterestData = comparisonItems.map(item => ({
    name: item.bankName,
    interest: item.totalInterest,
    fill: item.colorHex,
  }));

  const totalPaymentData = comparisonItems.map(item => ({
    name: item.bankName,
    payment: item.totalPayment,
    fill: item.colorHex,
  }));

  // تحضير بيانات للمخطط الخطي
  const prepareLineChartData = () => {
    if (!amortizationSchedules.length) return [];

    // إنشاء مجموعة من النقاط على المخطط كل ستة أشهر للوضوح
    const intervals = Math.min(10, loanYears); // الحد الأقصى للنقاط 10
    const yearInterval = Math.max(1, Math.floor(loanYears / intervals));
    const periodInterval = yearInterval * 12;
    
    const data = [];
    const maxPeriods = loanYears * 12;
    
    for (let i = 0; i <= maxPeriods; i += periodInterval) {
      const dataPoint: any = {
        period: i === 0 ? 0 : i / 12, // تحويل إلى سنوات
      };
      
      amortizationSchedules.forEach(schedule => {
        const period = schedule.periods[i] || { balance: 0 };
        dataPoint[schedule.bankId] = period.balance;
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };

  const lineChartData = prepareLineChartData();

  // تحويل البيانات إلى التنسيق المطلوب للرسوم البيانية
  const chartData = comparisonItems.map(item => ({
    name: item.bankName,
    monthlyPayment: Math.round(item.monthlyPayment),
    totalPayment: Math.round(item.totalPayment),
    interestRate: item.interestRate,
    totalInterest: Math.round(item.totalInterest),
  }));

  // تنسيق الأرقام للتوولتيب
  const formatTooltipValue = (value: number) => {
    return formatCurrency(value);
  };

  // تنسيق نسبة الفائدة
  const formatInterestRate = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="monthly">القسط الشهري</TabsTrigger>
          <TabsTrigger value="interest">إجمالي الأرباح</TabsTrigger>
          <TabsTrigger value="payment">إجمالي التمويل</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">مقارنة الأقساط الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis
                      tickFormatter={formatTooltipValue}
                    />
                    <Tooltip
                      formatter={formatTooltipValue}
                      labelStyle={{ textAlign: 'right' }}
                    />
                    <Bar
                      dataKey="monthlyPayment"
                      fill="#10b981"
                      name="القسط الشهري"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interest" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">إجمالي المبلغ والفوائد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis
                      tickFormatter={formatTooltipValue}
                    />
                    <Tooltip
                      formatter={formatTooltipValue}
                      labelStyle={{ textAlign: 'right' }}
                    />
                    <Legend />
                    <Bar
                      dataKey="totalPayment"
                      fill="#3b82f6"
                      name="إجمالي المبلغ"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="totalInterest"
                      fill="#ef4444"
                      name="إجمالي الفوائد"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">مقارنة معدلات الفائدة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis
                      tickFormatter={formatInterestRate}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(2)}%`, 'معدل الفائدة']}
                      labelStyle={{ textAlign: 'right' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="interestRate"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ r: 6 }}
                      activeDot={{ r: 8 }}
                      name="معدل الفائدة"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">مقارنة تناقص القرض بمرور الوقت</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={{}}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" name="السنة" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<ChartTooltipContent formatter={formatCurrency} />} />
                <Legend />
                {amortizationSchedules.map((schedule, index) => (
                  <Line 
                    key={schedule.bankId}
                    type="monotone"
                    dataKey={schedule.bankId}
                    name={schedule.bankName}
                    stroke={comparisonItems[index]?.colorHex || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
