const { databaseConnection, RoleController } = require("../controller");
const ForeignKeySeeder = require("./ForeignKeySeeder");

const { getReportsByMonth, availableMonths } = require("../../input/reports");

class ActivityReportSeeder extends ForeignKeySeeder {
  constructor(databaseConnection, tableName, tableRows) {
    super(databaseConnection, tableName, tableRows);
  }
}

ActivityReportSeeder.prototype.seedDatabase = function () {
  if (this.tableRows.length) {
    const batchInsert = this.databaseConnection.transaction((tableRows) => {
      for (const tableRow of tableRows) {
        const {
          Timestamp,
          Email,
          Date,
          MorningShift,
          AfternoonShift,
          NightShift,
        } = tableRow;

        const EmployeeID = this.getEmployeeIdByEmail(Email);

        if (!EmployeeID) console.log(Email, EmployeeID);

        const roles = RoleController.getByID({ EmployeeID });

        if (!roles) console.log(Email);

        const newTableField = this.tableFields.map((field) => {
          if (field === "Email") return "RoleID";
          return field;
        });

        this.setTableFields(newTableField);

        roles.forEach((role) => {
          const { Shift, ID: RoleID } = role;

          const entry = {
            Timestamp,
            RoleID,
            Date,
            MorningShift: Shift === "Diurno" ? MorningShift : "",
            AfternoonShift: Shift === "Diurno" ? AfternoonShift : "",
            NightShift: Shift === "Noturno" ? NightShift : "",
          };

          const hasReports =
            entry.MorningShift.length > 0 ||
            entry.AfternoonShift.length > 0 ||
            entry.NightShift.length > 0;

          if (hasReports) {
            this.insertStatement().run(entry);
          }
        });
      }
    });

    batchInsert(this.tableRows);
  } else {
    throw new Error(`Must have tableRows for seeding table ${this.tableName}`);
  }
};

const monthlyActivityReportSeeders = {
  abril: new ActivityReportSeeder(
    databaseConnection,
    "ActivityReport",
    getReportsByMonth(availableMonths.abril)
  ),
  maio: new ActivityReportSeeder(
    databaseConnection,
    "ActivityReport",
    getReportsByMonth(availableMonths.maio)
  ),
  junho: new ActivityReportSeeder(
    databaseConnection,
    "ActivityReport",
    getReportsByMonth(availableMonths.junho)
  ),
};

module.exports = monthlyActivityReportSeeders;
