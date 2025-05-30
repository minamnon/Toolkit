import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], filename: string): void {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'البيانات');
    
    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}_${currentDate}.xlsx`;
    
    // Save the file
    XLSX.writeFile(workbook, fullFilename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('فشل في تصدير البيانات');
  }
}

export function exportToPDF(data: any[], title: string): void {
  try {
    // Create a simple HTML table for printing
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; direction: rtl; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #f2f2f2; }
          h1 { color: #1976D2; }
          .header { text-align: center; margin-bottom: 30px; }
          .date { font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <div class="date">تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}</div>
        </div>
        <table>
          <thead>
            <tr>
              ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                ${Object.values(item).map(value => `<td>${value}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    // Open new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('فشل في تصدير البيانات إلى PDF');
  }
}
