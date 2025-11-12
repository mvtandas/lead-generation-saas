
import { Lead } from '../types';

declare const XLSX: any;

export const exportToXlsx = (data: Lead[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
  
  // Adjust column widths
  const columnWidths = Object.keys(data[0] || {}).map(key => {
    if (key === 'description' || key === 'qualityReasoning' || key === 'notes') {
      return { wch: 40 };
    }
    if (key === 'companyName' || key === 'address' || key === 'website' || key === 'email') {
        return { wch: 30 };
    }
    return { wch: 15 };
  });
  worksheet['!cols'] = columnWidths;

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
