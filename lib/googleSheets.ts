import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

/**
 * Initialize Google Sheets connection
 */
export const initializeGoogleSheets = async () => {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  if (!process.env.GOOGLE_SHEET_ID) {
    throw new Error('GOOGLE_SHEET_ID environment variable is not set');
  }

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();

  return { doc, serviceAccountAuth };
};

/**
 * Get or create a sheet by name
 */
export const getOrCreateSheet = async (doc: GoogleSpreadsheet, sheetName: string) => {
  let sheet = doc.sheetsByTitle[sheetName];

  if (!sheet) {
    sheet = await doc.addSheet({ title: sheetName });
  }

  return sheet;
};

/**
 * Add header row if sheet is empty
 */
export const initializeSheetHeaders = async (sheet: any, headers: string[]) => {
  if (sheet.rowCount === 0 || sheet.rowCount === 1) {
    await sheet.setHeaderRow(headers);
  }
};

/**
 * Add a row to the sheet
 */
export const addRowToSheet = async (sheet: any, rowData: Record<string, string>) => {
  await sheet.addRow(rowData);
};

/**
 * Get all rows from a sheet
 */
export const getAllRows = async (sheet: any) => {
  const rows = await sheet.getRows();
  return rows.map((row: any) => row._rawData);
};

/**
 * Get rows filtered by a condition
 */
export const getRowsFiltered = async (sheet: any, filterFn: (row: any) => boolean) => {
  const rows = await sheet.getRows();
  return rows.filter(filterFn).map((row: any) => row._rawData);
};

/**
 * Update a specific row
 */
export const updateRow = async (sheet: any, rowIndex: number, updates: Record<string, string>) => {
  const rows = await sheet.getRows();
  if (rows[rowIndex]) {
    Object.assign(rows[rowIndex], updates);
    await rows[rowIndex].save();
  }
};

/**
 * Delete a specific row
 */
export const deleteRow = async (sheet: any, rowIndex: number) => {
  const rows = await sheet.getRows();
  if (rows[rowIndex]) {
    await rows[rowIndex].delete();
  }
};

/**
 * Get row count
 */
export const getRowCount = async (sheet: any) => {
  const rows = await sheet.getRows();
  return rows.length;
};

/**
 * Add multiple rows at once
 */
export const addMultipleRows = async (sheet: any, rowsData: Record<string, string>[]) => {
  for (const rowData of rowsData) {
    await sheet.addRow(rowData);
  }
};

/**
 * Clear all data from sheet (keep headers)
 */
export const clearSheetData = async (sheet: any) => {
  const rows = await sheet.getRows();
  for (const row of rows) {
    await row.delete();
  }
};

/**
 * Export helper - prepare row data for the DC Hiring form
 */
export const prepareDCHiringRow = (formData: any) => {
  return {
    'Timestamp': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    'Full Name': formData.fullName || '',
    'Email': formData.email || '',
    'Country': formData.country || '',
    'City': formData.city || '',
    'Discord': formData.discord || '',
    'Twitter': formData.twitter || '',
    'Interests': formData.interests?.join(', ') || '',
    'Familiarity Level': formData.experience?.familiarity || '',
    'What Excites You': formData.experience?.excites || '',
    'Why Join': formData.experience?.whyJoin || '',
    'Something Proud Of': formData.contribution?.proud || '',
    'Time Commitment': formData.contribution?.timeCommit || '',
  };
};

/**
 * Validation helpers
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};
