const Seeder = require("./Seeder");
const { databaseConnection } = require("../controller");

const pluckFields = ({ Name, CPF }) => ({
  Name,
  CPF,
});

const employees = require("../../input/employees").map(pluckFields);

const employeeSeeder = new Seeder(databaseConnection, "Employee", employees);

module.exports = employeeSeeder;
