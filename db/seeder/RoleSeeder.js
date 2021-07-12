const ForeignKeySeeder = require("./ForeignKeySeeder");
const { databaseConnection, EmployeeController } = require("../controller");

const pluckFields = ({ CPF, Field, Registration, Role, Shift }) => ({
  CPF,
  Field,
  Registration,
  Role,
  Shift,
});

const employees = require("../../input/employees").map(pluckFields);

class RoleSeeder extends ForeignKeySeeder {
  constructor(databaseConnection, tableName, tableRows) {
    super(databaseConnection, tableName, tableRows);
  }
}

RoleSeeder.prototype.seedDatabase = function () {
  if (this.tableRows.length) {
    const batchInsert = this.databaseConnection.transaction((tableRows) => {
      for (const tableRow of tableRows) {
        const { Field, CPF, Registration, Role, Shift } = tableRow;
        const EmployeeID = EmployeeController.getEmployeeByCPF(CPF).ID;

        this.setTableFields(
          ["EmployeeID", ...this.tableFields].filter((f) => f !== "CPF")
        );

        Shift.forEach((shift) => {
          this.insertStatement().run({
            EmployeeID,
            Field,
            Registration,
            Role,
            Shift: shift,
          });
        });
      }
    });

    batchInsert(this.tableRows);
  } else {
    throw new Error(`Must have tableRows for seeding table ${this.tableName}`);
  }
};

const roleSeeder = new RoleSeeder(databaseConnection, "Role", employees);

module.exports = roleSeeder;
