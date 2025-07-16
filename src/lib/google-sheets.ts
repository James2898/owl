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

export const sheets = google.sheets({ version: "v4", auth });

export const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;

// drive
export const getGoogleDriveDirectLink = (driveLink: string) => {
  if (!driveLink) {
    return "";
  }

  const match =
    driveLink.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    driveLink.match(/id=([a-zA-Z0-9_-]+)/);

  if (match && match[1]) {
    const fileId = match[1];
    // This is the most reliable format for direct image embedding
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // If we can't parse it, return the original link or an empty string,
  // letting the onError handler on the <img> tag take over if it fails.
  console.warn(
    `Could not extract file ID from Google Drive link: ${driveLink}`
  );
  return driveLink;

  return "";
};
