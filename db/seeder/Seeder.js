class Seeder {
  constructor(databaseConnection, tableName, tableRows) {
    this.databaseConnection = databaseConnection;
    this.tableName = tableName;
    this.tableRows = tableRows;
    this.tableFields = this.loadTableFields();
  }

  loadTableFields() {
    const firstRow =
      this.tableRows && this.tableRows.length ? this.tableRows[0] : null;

    return firstRow ? Object.keys(firstRow) : null;
  }

  setTableFields(tableFields) {
    this.tableFields = tableFields;
  }

  insertStatement() {
    return this.databaseConnection.prepare(`
      INSERT OR IGNORE INTO ${this.tableName} (${this.tableFields.join(", ")})
      VALUES (@${this.tableFields.join(", @")})`);
  }

  seedDatabase() {
    if (this.tableRows.length) {
      const batchInsert = this.databaseConnection.transaction((tableRows) => {
        for (const tableRow of tableRows) this.insertStatement().run(tableRow);
      });

      try {
        batchInsert(this.tableRows);
      } catch (error) {
        console.log(error);
      }
    } else {
      throw new Error(
        `Must have tableRows for seeding table ${this.tableName}`
      );
    }
  }
}

module.exports = Seeder;
