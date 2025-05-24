import axios from "axios";
import { sendReminderEmail } from "../utils/emailService.js";

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

const isValidEmail = (email) =>
  typeof email === "string" && /\S+@\S+\.\S+/.test(email.trim());

export const sendEventReminders = async (req, res) => {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const apiKey = process.env.GOOGLE_API_KEY;
    const sheetRange = "A1:Z1000";

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=${apiKey}`;
    const response = await axios.get(url);
    const rows = response.data.values;

    if (!rows || rows.length < 2) {
      return res.status(404).json({ message: "No form responses found." });
    }

    const headers = rows[0];
    const emailIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("email")
    );
    const nameIndex = headers.findIndex(
      (h) =>
        h.toLowerCase().includes("name") ||
        h.toLowerCase().includes("contact person")
    );

    if (emailIndex === -1) {
      return res
        .status(400)
        .json({ message: "Email column not found in sheet." });
    }

    let sent = 0,
      skipped = 0;

    for (let i = 1; i < Math.min(4, rows.length); i++) {
      const row = rows[i];
      const email = row[emailIndex]?.trim();
      const name = row[nameIndex]?.trim() || "";

      if (email && email.includes("@")) {
        console.log(`Sending to: ${email}, Name: ${name}`);
        await sendReminderEmail(email, name);
        sent++;
      } else {
        console.log(`Skipped invalid row ${i}: Email = ${email}`);
        skipped++;
      }
    }

    res.status(200).json({
      message: `Sent ${sent} reminder emails. Skipped ${skipped} invalid.`,
    });
  } catch (error) {
    console.error("Error sending event reminders:", error.message);
    res.status(500).json({ message: "Failed to send reminders." });
  }
};
