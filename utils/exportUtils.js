export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);

  const escapeCSVField = (field) => {
    if (field === null || field === undefined) return "";

    let value = String(field);

    // Prevent Excel formulas from evaluating
    if (/^[=+\-@]/.test(value)) value = `'${value}`;

    // Replace line breaks and excess spaces
    value = value
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Handle Google Drive links split with commas
    if (value.includes("http") && value.includes(",")) {
      value = value.replace(/,\s*(https?:\/\/)/g, "; $1");
    }

    // Escape double quotes and wrap in double quotes if needed
    const needsQuotes =
      /[",\n;]/.test(value) || value.includes("  ") || value === "";
    if (needsQuotes) value = `"${value.replace(/"/g, '""')}"`;

    return value;
  };

  const csvHeader = headers.map(escapeCSVField).join(",");
  const csvRows = data.map((row) =>
    headers.map((header) => escapeCSVField(row[header])).join(",")
  );

  const csvContent = [csvHeader, ...csvRows].join("\r\n");
  const BOM = "\uFEFF"; // UTF-8 BOM for Excel compatibility

  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
