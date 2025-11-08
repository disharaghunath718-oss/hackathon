
import ExcelJS from 'exceljs';
export const createApplicationExcel = async (apps) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Applications');
  ws.addRow(['Name','Email','Department','Drive','Score','Skills']);
  apps.forEach(a => {
    ws.addRow([a.student.name, a.student.email, a.student.department, a.drive.companyName + ' - ' + a.drive.role, a.score, (a.parsedResume?.skills || []).join(', ')]);
  });
  const buf = await wb.xlsx.writeBuffer();
  return buf;
};
export default { createApplicationExcel };
