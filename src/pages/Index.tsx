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

const Index = () => {
  const [organizedData, setOrganizedData] = useState<{ [key: string]: any[] }>({});

  const handleFileProcessed = (data: any[]) => {
    const relevantData = data.slice(25, 146);
    
    let currentCategory = '';
    const categorized: { [key: string]: any[] } = {};
    
    relevantData.forEach((row) => {
      const rowValues = Object.values(row);
      const firstValue = String(rowValues[0] || '');
      
      // Check if this row is a category header
      if (CATEGORIES.includes(firstValue)) {
        currentCategory = firstValue;
        if (!categorized[currentCategory]) {
          categorized[currentCategory] = [];
        }
      } else if (currentCategory) {
        // Check if the first value looks like a type (Alcohol/Entertainment, Full Service, Lodging, QSR)
        const isType = /^(Alcohol\/Entertainment|Full Service|Lodging|QSR|ADD|Y)$/i.test(firstValue);
        
        let formattedRow;
        if (isType) {
          formattedRow = {
            'Type': String(rowValues[0] || ''),
            'First Name': String(rowValues[1] || ''),
            'Last Name': String(rowValues[2] || '')
          };
        } else {
          // If it's not a type, treat it as a name
          formattedRow = {
            'Type': '',
            'First Name': String(rowValues[0] || ''),
            'Last Name': String(rowValues[1] || '')
          };
        }
        
        // Add the row even if some values are blank
        categorized[currentCategory].push(formattedRow);
      }
    });

    console.log('Categorized data:', categorized);
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
