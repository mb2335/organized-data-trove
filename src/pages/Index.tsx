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

const NC_ALLOWED_NAMES = ['Allen', 'Jenny', 'Glenda', 'Paul', 'Peter', 'Kristen'];

const Index = () => {
  const [organizedData, setOrganizedData] = useState<{ [key: string]: any[] }>({});

  const handleFileProcessed = (data: any[]) => {
    const categorized: { [key: string]: any[] } = {};
    let currentCategory = '';
    
    // Initialize categories
    CATEGORIES.forEach(category => {
      categorized[category] = [];
    });

    // Process each row
    data.forEach((row, index) => {
      // Check if this row contains a category
      const categoryMatch = CATEGORIES.find(category => 
        Object.values(row).some(value => 
          String(value).trim().toUpperCase() === category.toUpperCase()
        )
      );

      if (categoryMatch) {
        currentCategory = categoryMatch;
        console.log(`Found category: ${currentCategory}`);
      } else if (currentCategory && Object.values(row).some(value => value)) {
        // If we have a current category and the row isn't empty
        if (currentCategory === 'NC') {
          // For NC category, only include rows where the first name matches our allowed list
          const rowValues = Object.values(row);
          console.log('NC row:', row);
          console.log('Row values:', rowValues);
          const firstName = String(rowValues[5] || '').trim(); // Index 5 contains First Name
          console.log('First Name found:', firstName);
          console.log('Is in allowed list:', NC_ALLOWED_NAMES.includes(firstName));
          
          if (NC_ALLOWED_NAMES.includes(firstName)) {
            categorized[currentCategory].push(row);
          }
        } else {
          // For other categories, include all non-empty rows
          categorized[currentCategory].push(row);
        }
      }
    });

    console.log('Final categorized data:', categorized);
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