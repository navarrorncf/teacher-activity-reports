const { readFileSync } = require("fs");
const { join } = require("path");
const encoding = { encoding: "utf-8" };

const parseEmployee = (employeeEntry) => {
  let [Name, CPF, Registration, Role, Field, Email, Shift] =
    employeeEntry.split(",");
  Shift = Shift.split("-");

  return {
    Name,
    CPF,
    Registration,
    Role,
    Field,
    Email,
    Shift,
  };
};

module.exports = readFileSync(join(__dirname, "employees.csv"), encoding)
  .split("\n")
  .map(parseEmployee);
