import React, { useState, useEffect } from "react";
import { Bank } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Scatter,
} from 'recharts';
import { Info, ArrowLeft } from "lucide-react";

// ألوان مخصصة للبنوك مع تدرجات
const BANK_COLORS = [
  { main: '#3b82f6', light: '#93c5fd' }, // أزرق
  { main: '#10b981', light: '#6ee7b7' }, // أخضر
  { main: '#f59e0b', light: '#fcd34d' }, // برتقالي
  { main: '#8b5cf6', light: '#c4b5fd' }, // بنفسجي
  { main: '#ef4444', light: '#fca5a5' }, // أحمر
  { main: '#06b6d4', light: '#67e8f9' }, // تركواز
  { main: '#f97316', light: '#fdba74' }, // برتقالي غامق
];

// تنسيق التلميحات
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-bold text-right mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-right" style={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function BankComparisonPage() {
  const [banks] = useState<Bank[]>([
    { id: "alrajhi", name: "مصرف الراجحي", rate: 4.10 },
    { id: "snb", name: "البنك الأهلي", rate: 3.90 },
    { id: "sabb", name: "البنك السعودي البريطاني", rate: 3.29 },
    { id: "riyad", name: "بنك الرياض", rate: 3.75 },
    { id: "jazira", name: "بنك الجزيرة", rate: 3.64 },
    { id: "albilad", name: "بنك البلاد", rate: 3.99 },
    { id: "alinma", name: "مصرف الإنماء", rate: 3.99 },
  ]);

  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [loanYears, setLoanYears] = useState<number>(25);
  const [selectedBanks, setSelectedBanks] = useState<string[]>(["alrajhi", "snb", "sabb"]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateComparison = () => {
    const data = selectedBanks.map((bankId, index) => {
      const bank = banks.find(b => b.id === bankId);
      if (!bank) return null;

      const monthlyRate = bank.rate / 100 / 12;
      const numberOfPayments = loanYears * 12;
      
      const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      const totalPayment = monthlyPayment * numberOfPayments;
      const totalInterest = totalPayment - loanAmount;

      return {
        name: bank.name,
        rate: bank.rate,
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
        color: BANK_COLORS[index % BANK_COLORS.length].main
      };
    }).filter(Boolean);

    setComparisonData(data);
  };

  useEffect(() => {
    calculateComparison();
  }, [loanAmount, loanYears, selectedBanks]);

  const toggleBank = (bankId: string) => {
    if (selectedBanks.includes(bankId)) {
      if (selectedBanks.length > 1) {
        setSelectedBanks(selectedBanks.filter(id => id !== bankId));
      }
    } else {
      if (selectedBanks.length < 5) {
        setSelectedBanks([...selectedBanks, bankId]);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>بيانات التمويل</CardTitle>
            <CardDescription>أدخل مبلغ ومدة التمويل المطلوب</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="loan-amount">مبلغ التمويل</Label>
              <Input
                id="loan-amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                min={100000}
                max={5000000}
                step={50000}
                className="text-left"
                dir="ltr"
              />
            </div>
            
            <div>
              <Label className="flex justify-between">
                <span>مدة القرض (بالسنوات)</span>
                <span className="text-primary font-semibold">{loanYears}</span>
              </Label>
              <Slider
                value={[loanYears]}
                onValueChange={(values) => setLoanYears(values[0])}
                min={5}
                max={30}
                step={1}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>اختر البنوك للمقارنة</CardTitle>
            <CardDescription>يمكنك اختيار حتى 5 بنوك للمقارنة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {banks.map((bank) => (
                <Button
                  key={bank.id}
                  variant={selectedBanks.includes(bank.id) ? "default" : "outline"}
                  onClick={() => toggleBank(bank.id)}
                  className="w-full"
                >
                  {bank.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      {comparisonData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>مقارنة تفصيلية للبنوك</CardTitle>
            <CardDescription>مقارنة شاملة لأسعار التمويل والعروض</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="md:hidden flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <Info size={14} className="shrink-0" />
              <span>مرر لليسار لمشاهدة باقي الجدول</span>
              <ArrowLeft size={14} className="animate-pulse text-primary shrink-0" />
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">البنك</TableHead>
                    <TableHead className="text-right">معدل الفائدة</TableHead>
                    <TableHead className="text-right">القسط الشهري</TableHead>
                    <TableHead className="text-right">إجمالي المبلغ</TableHead>
                    <TableHead className="text-right">إجمالي الفوائد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.map((bank, index) => (
                    <TableRow key={bank.name}>
                      <TableCell className="font-medium">{bank.name}</TableCell>
                      <TableCell>{bank.rate.toFixed(2)}%</TableCell>
                      <TableCell>{formatCurrency(bank.monthlyPayment)}</TableCell>
                      <TableCell>{formatCurrency(bank.totalPayment)}</TableCell>
                      <TableCell>{formatCurrency(bank.totalInterest)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      {comparisonData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Payment Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold mb-4">مقارنة الأقساط الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={comparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickMargin={25}
                    />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value)}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip
                      content={<CustomTooltip formatter={formatCurrency} />}
                      wrapperStyle={{ direction: 'rtl' }}
                    />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ paddingBottom: '20px', direction: 'rtl' }}
                    />
                    <Bar
                      dataKey="monthlyPayment"
                      fill="#10b981"
                      name="القسط الشهري"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                    <Line
                      type="monotone"
                      dataKey="monthlyPayment"
                      stroke="#047857"
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#047857', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#047857' }}
                      name="متوسط القسط"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Total Cost Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold mb-4">إجمالي التكلفة والفوائد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={comparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <defs>
                      <linearGradient id="totalPayment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="totalInterest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickMargin={25}
                    />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value)}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip
                      content={<CustomTooltip formatter={formatCurrency} />}
                      wrapperStyle={{ direction: 'rtl' }}
                    />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ paddingBottom: '20px', direction: 'rtl' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalPayment"
                      fill="url(#totalPayment)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="إجمالي المبلغ"
                    />
                    <Area
                      type="monotone"
                      dataKey="totalInterest"
                      fill="url(#totalInterest)"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="إجمالي الفوائد"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Interest Rate Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold mb-4">مقارنة معدلات الفائدة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickMargin={25}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value.toFixed(2)}%`}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip
                      content={<CustomTooltip formatter={(value: number) => `${value.toFixed(2)}%`} />}
                      wrapperStyle={{ direction: 'rtl' }}
                    />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ paddingBottom: '20px', direction: 'rtl' }}
                    />
                    <Bar
                      dataKey="rate"
                      name="معدل الفائدة"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    >
                      {comparisonData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={BANK_COLORS[index % BANK_COLORS.length].main}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Payment Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold mb-4">توزيع الأقساط الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={comparisonData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      innerRadius={60}
                      paddingAngle={5}
                      dataKey="monthlyPayment"
                      nameKey="name"
                      label={({ name, value }) => `${name} (${formatCurrency(value)})`}
                    >
                      {comparisonData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={BANK_COLORS[index % BANK_COLORS.length].main}
                          stroke={BANK_COLORS[index % BANK_COLORS.length].light}
                          strokeWidth={3}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip formatter={formatCurrency} />}
                      wrapperStyle={{ direction: 'rtl' }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ direction: 'rtl', paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
