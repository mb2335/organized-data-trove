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
  [key: string]: any;
  __rowNum__?: number;
}

const Index = () => {
  const [organizedData, setOrganizedData] = useState<{ [key: string]: ExcelRow[] }>({});

  const handleFileProcessed = (data: ExcelRow[]) => {
    // Filter rows between rows 28-146
    const relevantData = data.filter(row => {
      const rowNum = row.__rowNum__;
      return rowNum !== undefined && rowNum >= 27 && rowNum <= 145;
    });
    
    let currentCategory = '';
    const categorized: { [key: string]: ExcelRow[] } = {};
    
    relevantData.forEach((row) => {
      // Get only the type (column E), first name (column F), and last name (column G)
      const filteredRow: ExcelRow = {};
      Object.entries(row).forEach(([key, value]) => {
        const colIndex = key.charCodeAt(0) - 65; // Convert A=0, B=1, etc.
        if (colIndex >= 4 && colIndex <= 6) { // Columns E, F, G
          const columnName = colIndex === 4 ? 'Type' : 
                           colIndex === 5 ? 'First Name' : 
                           'Last Name';
          filteredRow[columnName] = value;
        }
      });

      // Check if the row is a category header
      const isCategory = CATEGORIES.some(category => 
        Object.values(row).some(value => 
          String(value).trim() === category
        )
      );
      
      if (isCategory) {
        // Set current category based on the matching category
        currentCategory = CATEGORIES.find(category => 
          Object.values(row).some(value => 
            String(value).trim() === category
          )
        ) || '';
        if (!categorized[currentCategory]) {
          categorized[currentCategory] = [];
        }
      } else if (currentCategory && Object.keys(filteredRow).length > 0) {
        // Add the filtered row to the current category if it has any data
        if (Object.values(filteredRow).some(value => value !== undefined && value !== '')) {
          categorized[currentCategory].push(filteredRow);
        }
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