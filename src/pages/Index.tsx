import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import DataSection from '@/components/DataSection';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const CATEGORIES = [
  'NC',
  'Snohomish',
  'Seattle',
  'East King',
  'South King',
  'Pierce',
  'TKP',
  'SW',
  'SE',
  'Spokane',
  'Corporate Staff'
];

interface ExcelRow {
  [key: string]: string | number | null;
  '!styles'?: {
    fill?: {
      fgColor?: {
        rgb?: string;
      };
    };
  };
}

const Index = () => {
  const [organizedData, setOrganizedData] = useState<{ [key: string]: ExcelRow[] }>({});

  const handleFileProcessed = (data: ExcelRow[]) => {
    // Filter rows between rows 28-146 and identify categories by black highlighting
    const relevantData = data.slice(27, 146);
    
    let currentCategory = '';
    const categorized: { [key: string]: ExcelRow[] } = {};
    
    relevantData.forEach((row) => {
      // Check if the row is a category header (has black highlighting)
      const isCategory = row?.['!styles']?.fill?.fgColor?.rgb === '000000' || 
                        CATEGORIES.includes(String(Object.values(row)[0]));
      
      if (isCategory) {
        // Set current category based on the first non-empty value in the row
        const categoryValue = Object.values(row).find(val => val) || '';
        currentCategory = String(categoryValue);
        if (!categorized[currentCategory]) {
          categorized[currentCategory] = [];
        }
      } else if (currentCategory) {
        // Add the row to the current category, preserving empty cells
        categorized[currentCategory].push(row);
      }
    });

    setOrganizedData(categorized);
  };

  const exportAll = () => {
    const wb = XLSX.utils.book_new();
    
    CATEGORIES.forEach(category => {
      if (organizedData[category]?.length) {
        const ws = XLSX.utils.json_to_sheet(organizedData[category]);
        XLSX.utils.book_append_sheet(wb, ws, category);
      }
    });
    
    XLSX.writeFile(wb, 'all_categories.xlsx');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">Excel File Organizer</h1>
          <FileUpload onFileProcessed={handleFileProcessed} />
        </div>

        {Object.keys(organizedData).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Organized Data</h2>
              <Button onClick={exportAll}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
            <div className="space-y-4">
              {CATEGORIES.map(category => (
                <DataSection
                  key={category}
                  category={category}
                  data={organizedData[category] || []}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;