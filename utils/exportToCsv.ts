import { Lead } from '../types';

export const exportToCsv = (leads: Lead[], filename: string): void => {
  if (leads.length === 0) {
    alert('Export edilecek lead bulunamadı');
    return;
  }

  // CSV header
  const headers = [
    'Company Name',
    'Category',
    'Description',
    'Address',
    'City',
    'Country',
    'Phone',
    'Email',
    'Website',
    'LinkedIn',
    'Facebook',
    'Instagram',
    'Rating',
    'Review Count',
    'Quality Score',
    'Quality Reasoning',
    'Status',
    'Notes',
    'Business Hours',
    'Google Maps URL',
    'Generated Date'
  ];

  // Convert leads to CSV rows
  const rows = leads.map(lead => [
    escapeCSVValue(lead.companyName),
    escapeCSVValue(lead.category),
    escapeCSVValue(lead.description),
    escapeCSVValue(lead.address),
    escapeCSVValue(lead.city),
    escapeCSVValue(lead.country),
    escapeCSVValue(lead.phone || ''),
    escapeCSVValue(lead.email || ''),
    escapeCSVValue(lead.website || ''),
    escapeCSVValue(lead.linkedin || ''),
    escapeCSVValue(lead.facebook || ''),
    escapeCSVValue(lead.instagram || ''),
    lead.rating,
    lead.reviewCount,
    lead.qualityScore,
    escapeCSVValue(lead.qualityReasoning),
    escapeCSVValue(lead.status || ''),
    escapeCSVValue(lead.notes || ''),
    escapeCSVValue(lead.businessHours),
    escapeCSVValue(lead.googleMapsUri || ''),
    escapeCSVValue(lead.generatedDate)
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Helper function to escape CSV values
const escapeCSVValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
};

