const ForeignKeySeeder = require("./ForeignKeySeeder");
const { databaseConnection } = require("../controller");

const employees = require("../../input/employees").map(({ Name, Email }) => ({
  Name,
  Email,
}));

employees.push({
  Name: "LARYSSA LOPES DOS ANJOS",
  Email: "laryssa.lopes@edu.se.df.gov.br",
});

employees.push({
  Name: "EVERTON DOS SANTOS TEIXEIRA DE OLIVEIRA",
  Email: "everton.teixeira@edu.se.df.gov.br",
});

employees.push({
  Name: "EVERSON DE SOUSA LEMES",
  Email: "everson.lemes@edu.se.df.gov.br",
});

employees.push({
  Name: "CLAUDIO CESAR GONCALVES DA PAIXAO",
  Email: "claudio.paixao@se.df.gov.br",
});

employees.push({
  Name: "LUCAS LIMA PINTO",
  Email: "lucas.pinto85@edu.se.df.gov.br",
});

class EmailSeeder extends ForeignKeySeeder {
  constructor(databaseConnection, tableName, tableRows) {
    super(databaseConnection, tableName, tableRows);
  }
}

EmailSeeder.prototype.seedDatabase = function () {
  if (this.tableRows.length) {
    const batchInsert = this.databaseConnection.transaction((tableRows) => {
      this.setTableFields(["Address", "EmployeeID"]);
      for (const tableRow of tableRows) {
        const { Name, Email } = tableRow;
        const EmployeeID = this.getEmployeeID(Name);

        this.insertStatement().run({ Address: Email, EmployeeID });
      }
    });

    batchInsert(this.tableRows);
  } else {
    throw new Error(`Must have tableRows for seeding table ${this.tableName}`);
  }
};

const emailSeeder = new EmailSeeder(databaseConnection, "Email", employees);

module.exports = emailSeeder;
