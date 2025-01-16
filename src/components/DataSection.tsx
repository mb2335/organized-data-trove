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

  // Filter out empty rows and rows before line 28
  const validData = data.filter((row, index) => {
    // Only process rows from index 27 (line 28) to 156 (line 157)
    if (index < 27 || index > 156) return false;
    // Check if the row has any non-empty values
    return Object.values(row).some(value => value !== undefined && value !== null && value !== '');
  });

  if (!validData.length) return null;

  const columnHeaders = [
    'Category',
    'First Name',
    'Last Name',
    'Company',
    'Type',
    'AC Area',
    'Start',
    'Notes',
    'Email',
    'Cel'
  ];

  const filterColumns = (row: any) => {
    return [
      category,
      row['First Name'] || '',
      row['Last Name'] || '',
      row['Company'] || '',
      row['Type'] || '',
      row['AC Area'] || '',
      row['Start'] || '',
      row['Notes'] || '',
      row['Email'] || '',
      row['Cel'] || ''
    ];
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={category}>
        <div className="flex items-center justify-between">
          <AccordionTrigger className="text-lg font-semibold">
            {category} ({validData.length} items)
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
                  {columnHeaders.map((header, index) => (
                    <th key={index} className="p-2 text-left border-b bg-gray-50">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {validData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {filterColumns(row).map((cell: any, cellIndex) => (
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