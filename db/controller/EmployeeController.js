const db = require("./connection");

const statements = {
  addOne: db.prepare(`INSERT INTO Employee (Name, CPF) VALUES (@Name, @CPF)`),
  selectEmployee: db.prepare(`SELECT * FROM Employee WHERE NAME LIKE ?`),
  getAll: db.prepare(`SELECT * FROM Employee`),
  getEmployeeByID: db.prepare(`SELECT * FROM Employee WHERE ID = ?`),
  getEmployeeByCPF: db.prepare(`SELECT * FROM Employee WHERE CPF = ?`),
};

/**
 * Adds a new employee to Employee table
 * @param {String} Name Employee's full name
 * @param {String} CPF Employee's CPF
 * @param {String} Registration Employee's registration code
 * @returns Info object about the transaction, null if transaction has failed
 */
module.exports.addEmployee = ({ Name, CPF }) => {
  try {
    const status = statements.addOne.run({
      Name: Name.toUpperCase(),
      CPF,
    });
    return status;
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

/**
 * Gets all Employees in Employee table
 * @returns Array with all rows in Employee table
 */
module.exports.getAllEmployees = () => {
  try {
    const results = statements.getAll.all();
    return results;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Gets a Employee's ID based on his name
 * @param {String} Name Employee's name
 * @returns Employee's ID int Employee table
 */
module.exports.selectEmployee = (Name) => {
  try {
    const result = statements.selectEmployee.get(Name + "%");
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Gets a Employee's data based on his ID
 * @param {String} ID Employee's ID
 * @returns An object with the Employee's data or null, if not found
 */
module.exports.getEmployeeByID = ({ ID }) => {
  try {
    const result = statements.getEmployeeByID.get(ID);
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Gets a Employee's data based on his ID
 * @param {String} ID Employee's ID
 * @returns An object with the Employee's data or null, if not found
 */
module.exports.getEmployeeByCPF = (CPF) => {
  try {
    const result = statements.getEmployeeByCPF.get(CPF);
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};
