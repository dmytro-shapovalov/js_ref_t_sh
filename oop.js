class Table {
  constructor(colNames, rowsData) {
    this.colNames = colNames;
    this.rows = rowsData.map((rowData) =>
      Object.fromEntries(
        rowData.map((cellData, idx) => [colNames[idx], cellData])
      )
    );
  }
  aggregations = {};

  addCalculatedCol(name, calc) {
    this.colNames.push(name);
    for (const row of this.rows) {
      row[name] = calc.call(this, row);
    }
  }

  addColAggregation(colName, type, calc) {
    this.aggregations[colName] = { [type]: calc.call(this) };
  }

  sort(colName, dir) {
    this.rows.sort((row1, row2) => {
      const res = parseInt(row1[colName]) < parseInt(row2[colName]);

      if (dir === "ASC") {
        return res ? -1 : 1;
      }

      if (dir === "DESC") {
        return res ? 1 : -1;
      }

      return 0;
    });
  }
}

class TableRenderer {
  constructor(table) {
    this.table = table;
  }

  toLines() {
    const GAP = 4;
    const renderInfo = {};

    for (const colName of this.table.colNames) {
      const chars = this.table.rows.reduce(
        (longest, x) => Math.max(longest, x[colName].length),
        0
      );

      renderInfo[colName] = Math.max(chars, colName.length) + GAP;
    }

    function padCol(col, value, idx) {
      return idx > 0
        ? value.padStart(renderInfo[col])
        : value.padEnd(renderInfo[col]);
    }

    const headerLine = this.table.colNames
      .map((col, idx) => padCol(col, col, idx))
      .join("");

    const lines = [
      headerLine,

      ...this.table.rows.map((row) =>
        this.table.colNames
          .map((col, idx) => padCol(col, row[col], idx))
          .join("")
      ),
    ];

    return lines;
  }

  logToConsole() {
    const lines = this.toLines();

    for (const line of lines) {
      console.log(line);
    }
  }
}

function TableFromRawData(rawData) {
  const rawRows = rawData.trim().split("\n");
  const headerRow = rawRows
    .shift()
    .split(",")
    .map((x) => x.trim());
  const rows = rawRows.map((rawRow) =>
    rawRow //
      .split(",")
      .map((x) => x.trim())
  );

  return new Table(headerRow, rows);
}

function runOop(data) {
  if (!data) {
    return;
  }

  const table = TableFromRawData(data);
  const renderer = new TableRenderer(table);

  table.addColAggregation("density", "max", function () {
    return this.rows.reduce(
      (acc, row) => Math.max(acc, parseInt(row["density"])),
      0
    );
  });

  table.addCalculatedCol("relative_density", function (row) {
    const density = parseInt(row["density"]);
    const maxDensity = parseInt(this.aggregations.density.max);
    const relativeDensity = Math.round((density * 100) / maxDensity);

    return relativeDensity.toString();
  });

  table.sort("relative_density", "DESC");

  renderer.logToConsole();
}

export { runOop };
