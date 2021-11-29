import Excel, {Buffer, Column, Row} from 'exceljs';
import {Log} from 'models';

const TAG = 'helpers.excel';

export async function generateExcel(headers: Column[], payload: any[]): Promise<Buffer> {
    Log.info('generateExcel()');
    try {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('sheet0');
        worksheet.columns = headers;
        payload.forEach((rowData) => {
            const row: Row = {} as Row;
            for (const header of headers) {
                row[header.key] = rowData[header.key];
            }
            worksheet.addRow(row);
        });
        return workbook.xlsx.writeBuffer();
    } catch (error) {
        Log.error(TAG, 'generateExcel()', error);
        throw error;
    }
}
