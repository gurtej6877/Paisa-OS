import { google } from 'googleapis';

// Elaborated Setup: We use a Service Account to bypass user-facing OAuth.
// The credentials should be stored in environment variables.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getAuthClient() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });
}

export async function appendExpenseToSheet(expense: any) {
  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // Ordered array mapping to columns: ID | Date | Time | Amount | Description | Category | Payment Method | Notes
    const row = [
      expense.id,
      expense.expense_date,
      new Date().toLocaleTimeString('en-IN'),
      expense.amount,
      expense.description,
      expense.category,
      expense.payment_method,
      expense.notes || '',
      new Date().toISOString(),
      new Date().toISOString()
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Expenses!A:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });
    return { success: true };
  } catch (error) {
    console.error("Google Sheets Sync Failed (Append):", error);
    // We return success: false rather than throwing, so the DB transaction still succeeds
    return { success: false, error }; 
  }
}
