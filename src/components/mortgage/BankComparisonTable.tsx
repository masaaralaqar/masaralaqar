import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComparisonBankData } from './types'; // Assuming type is defined in types.ts
import { FadeIn } from "@/components/ui/transitions"; // Import FadeIn

interface BankComparisonTableProps {
  comparisonData: ComparisonBankData[];
  formatCurrency: (amount: number) => string;
}

export const BankComparisonTable: React.FC<BankComparisonTableProps> = ({ 
  comparisonData, 
  formatCurrency 
}) => {
  return (
    <FadeIn duration={500} delay={200}> {/* Added fade-in animation */}
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[25%] py-4 text-right font-bold text-lg">البنك</TableHead>
              <TableHead className="w-[15%] py-4 text-center font-bold text-lg">نسبة الفائدة</TableHead>
              <TableHead className="w-[30%] py-4 text-center font-bold text-lg">القسط الشهري</TableHead>
              <TableHead className="w-[30%] py-4 text-center font-bold text-lg">إجمالي المبلغ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonData.map((bank, index) => (
              <TableRow 
                key={index}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="w-[25%] py-4 text-right font-semibold text-primary">{bank.bankName}</TableCell>
                <TableCell className="w-[15%] py-4 text-center font-medium">{bank.rate.toFixed(2)}%</TableCell>
                <TableCell className="w-[30%] py-4 text-center font-medium">{formatCurrency(bank.monthlyPayment)}</TableCell>
                <TableCell className="w-[30%] py-4 text-center font-medium">{formatCurrency(bank.totalPayment)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </FadeIn>
  );
};
