const Seeder = require("./Seeder");

const { EmployeeController, EmailController } = require("../controller");

class ForeignKeySeeder extends Seeder {
  constructor(databaseConnection, tableName, tableRows) {
    super(databaseConnection, tableName, tableRows);
  }
}

ForeignKeySeeder.prototype.getEmployeeIdByName = function (name) {
  const employee = EmployeeController.selectEmployee(name);
  return employee ? employee.ID : null;
};

ForeignKeySeeder.prototype.getEmployeeID =
  ForeignKeySeeder.prototype.getEmployeeIdByName;

ForeignKeySeeder.prototype.getEmployeeIdByEmail = function (emailAddress) {
  const employeeID = EmailController.selectEmployeeID(emailAddress);
  return employeeID;
};

module.exports = ForeignKeySeeder;
