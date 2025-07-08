import * as XLSX from "xlsx";

export function exportToExcel<T>(
    data: T[],
    filename = "dados.xlsx",
    sheetName = "Dados"
){
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filename);
}