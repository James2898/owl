import { google } from "googleapis";

if (
  !process.env.GOOGLE_SHEETS_CLIENT_EMAIL ||
  !process.env.GOOGLE_SHEETS_PRIVATE_KEY ||
  !process.env.GOOGLE_SHEETS_ID
) {
  throw new Error(
    "Google Sheets credentials are not set in environment variables."
  );
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export { sheets };

export const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
