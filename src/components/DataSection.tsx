import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Download, Copy } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";

interface DataSectionProps {
  category: string;
  data: any[];
}

const DataSection = ({ category, data }: DataSectionProps) => {
  const { toast } = useToast();

  const exportSection = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, category);
    XLSX.writeFile(wb, `${category}.xlsx`);
  };

  const copyToClipboard = () => {
    // Filter out rows where both first and last name are blank but type exists
    // Also filter out rows with ADD type
    const filteredData = data.filter(row => {
      if (row.Type === 'ADD') return false;
      if (row.Type && !row['First Name'] && !row['Last Name']) return false;
      return true;
    });

    // Format data for clipboard (tab-separated values)
    const formattedData = filteredData.map(row => 
      `${row.Type}\t${row['First Name']}\t${row['Last Name']}`
    ).join('\n');

    navigator.clipboard.writeText(formattedData).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Data has been copied in Excel-compatible format"
      });
    });
  };

  if (!data.length) return null;

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={category}>
        <div className="flex items-center justify-between">
          <AccordionTrigger className="text-lg font-semibold">
            {category} ({data.length} items)
          </AccordionTrigger>
          <div className="flex gap-2 mr-4">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard();
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                exportSection();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <AccordionContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left border-b bg-gray-50">Type</th>
                  <th className="p-2 text-left border-b bg-gray-50">First Name</th>
                  <th className="p-2 text-left border-b bg-gray-50">Last Name</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => {
                  // Determine if row should be faded based on First Name
                  const shouldFade = !row['First Name'] || 
                    ['Alcohol/Entertainment', 'Full Service', 'Lodging', 'Y', 'y'].includes(row['First Name']);
                  
                  return (
                    <tr 
                      key={index} 
                      className={`border-b hover:bg-gray-50 ${shouldFade ? 'opacity-50' : ''}`}
                    >
                      <td className="p-2">{row.Type === 'ADD' ? '' : row.Type}</td>
                      <td className="p-2">{row['First Name']}</td>
                      <td className="p-2">{row['Last Name']}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DataSection;