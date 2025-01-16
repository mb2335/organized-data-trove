import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onFileProcessed: (data: any[]) => void;
}

const FileUpload = ({ onFileProcessed }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          onFileProcessed(jsonData);
          toast.success('File uploaded successfully');
        } catch (error) {
          toast.error('Error processing file');
          console.error('Error processing file:', error);
        }
      };
      reader.readAsBinaryString(file);
    }
  }, [onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive ? 'Drop the file here' : 'Drag & drop an Excel file here, or click to select'}
      </p>
      <p className="text-xs text-gray-500 mt-1">Supports .xlsx and .xls files</p>
    </div>
  );
};

export default FileUpload;