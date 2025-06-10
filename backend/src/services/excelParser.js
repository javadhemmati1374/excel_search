const XLSX = require("xlsx");

const excelColumnMapping = {
  RegProvince: "reg_province",
  RegCity: "reg_city",
  Address: "address",
  City: "city",
  ParentClassificationName: "parent_classification_name",
  ClassificationName: "classification_name",
  CustomTitle: "custom_title",
  TelNum: "tel_num",
};

exports.parseExcelFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    const mappedData = jsonData
      .map((row) => {
        const newRow = {};
        for (const excelCol in row) {
          const trimmedExcelCol = excelCol.trim();
          const dbCol = excelColumnMapping[trimmedExcelCol];
          if (dbCol) {
            newRow[dbCol] = row[excelCol];
          }
        }

        if (newRow.tel_num !== undefined) {
          newRow.tel_num = String(newRow.tel_num).trim();
        } else {
          console.warn(`Row missing TelNum: ${JSON.stringify(row)}`);
          return null;
        }
        return newRow;
      })
      .filter(Boolean);

    return mappedData;
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    throw error;
  }
};
