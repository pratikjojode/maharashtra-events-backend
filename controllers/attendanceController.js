import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getAttendanceData = async (req, res) => {
  const { GOOGLE_API_KEY, SHEET_ID, SHEET_NAME } = process.env;


  const sheetRange = "A1:Z1000";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(
    SHEET_NAME
  )}!${sheetRange}?key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No data found in sheet." });
    }

    const [headers, ...data] = rows;

    const formatted = data.map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        const cleanHeader = header.trim();
        obj[cleanHeader] = row[index] || "";
      });
      return obj;
    });

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching sheet data:", error.message);
    res.status(500).json({ message: "Failed to fetch sheet data." });
  }
};
