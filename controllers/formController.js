import axios from "axios";

export const getFormResponses = async (req, res) => {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    const sheetRange = "A1:Z1000";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=${apiKey}`;

    const response = await axios.get(url);
    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      let obj = {};
      headers.forEach((key, index) => {
        obj[key] = row[index] || "";
      });
      return obj;
    });

    res.status(200).json({
      message: "Form responses fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching Google Sheet:", error.message);
    res.status(500).json({ message: "Error fetching form data" });
  }
};
