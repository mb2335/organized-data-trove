import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DataSectionProps {
  category: string;
  data: any[];
}

const DataSection = ({ category, data }: DataSectionProps) => {
  const exportSection = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, category);
    XLSX.writeFile(wb, `${category}.xlsx`);
  };

  if (!data.length) return null;

  // Define the specific columns we want to display
  const columns = [
    'Type',
    'First Name',
    'Last Name',
    'Company',
    'Business Type',
    'Area',
    'Start Date',
    'Notes',
    'Email',
    'Cell'
  ];

  // Get the values for each row based on our column mapping
  const getRowValues = (row: any) => {
    const values = Object.values(row);
    return [
      values[4] || '', // Type
      values[5] || '', // First Name
      values[6] || '', // Last Name
      values[7] || '', // Company
      values[8] || '', // Business Type
      values[9] || '', // Area
      values[10] || '', // Start Date
      values[11] || '', // Notes
      values[12] || '', // Email
      values[13] || '', // Cell
    ];
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={category}>
        <div className="flex items-center justify-between">
          <AccordionTrigger className="text-lg font-semibold">
            {category} ({data.length} items)
          </AccordionTrigger>
          <Button
            variant="outline"
            size="sm"
            className="mr-4"
            onClick={(e) => {
              e.stopPropagation();
              exportSection();
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <AccordionContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {columns.map((header, index) => (
                    <th key={index} className="p-2 text-left border-b bg-gray-50">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {getRowValues(row).map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-2">
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DataSection;