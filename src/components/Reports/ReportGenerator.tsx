import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportData {
  headers: string[];
  rows: any[][];
  title: string;
}

interface ReportGeneratorProps {
  data: ReportData;
  onGenerate?: () => void;
}

export function ReportGenerator({ data, onGenerate }: ReportGeneratorProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(data.title, 14, 15);
    
    autoTable(doc, {
      head: [data.headers],
      body: data.rows,
      startY: 25,
    });
    
    doc.save(`${data.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    onGenerate?.();
  };

  const generateExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, `${data.title.toLowerCase().replace(/\s+/g, '-')}.xlsx`);
    onGenerate?.();
  };

  return (
    <div className="flex space-x-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generatePDF}
        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <FileDown className="w-4 h-4 mr-2" />
        Exportar PDF
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateExcel}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Exportar Excel
      </motion.button>
    </div>
  );
}