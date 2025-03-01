function runProc(data) {
  if (!data) {
    return;
  }
  // Parse input
  const dataLines = data.split("\n");
  const headerRow = dataLines.shift().split(",");
  const rows = dataLines.map((line) =>
    line.split(",").map((cell) => cell.trim())
  );

  // Calculate maxDensity
  const densityColIndex = headerRow.indexOf("density");
  const maxDensity = rows.reduce(
    (max, row) => Math.max(max, parseInt(row[densityColIndex])),
    0
  );

  // Add relative density column to the table
  headerRow.push("relative_density");
  for (const row of rows) {
    const relativeDensity = Math.round(
      (row[densityColIndex] * 100) / maxDensity
    );
    row.push(relativeDensity.toString());
  }

  // Calculate correct widths for rows
  const colWidths = headerRow.map((colName, colIndex) =>
    rows.reduce(
      (max, row) => Math.max(max, row[colIndex].length),
      colName.length
    )
  );

  // Sort by new column
  const relativeDensityColIndex = headerRow.indexOf("relative_density");
  rows.sort(
    (r1, r2) => r2[relativeDensityColIndex] - r1[relativeDensityColIndex]
  );

  // Log to console
  const GAP = 4;
  const lines = [headerRow, ...rows].map((row) =>
    row
      .map((cell, idx) => {
        const colWidth = colWidths[idx] + GAP;
        return idx > 0 ? cell.padStart(colWidth) : cell.padEnd(colWidth);
      })
      .join("")
  );

  for (const line of lines) {
    console.log(line);
  }
}

export { runProc };
