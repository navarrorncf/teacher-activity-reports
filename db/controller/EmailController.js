const db = require("./connection");
const { selectEmployee } = require("./EmployeeController");
const { getEmployeeID } = require("./RoleController");

const statements = {
  addEmail: db.prepare(
    "INSERT INTO Email (EmployeeID, Address) values (@EmployeeID, @Address)"
  ),
  selectAll: db.prepare("SELECT * FROM Email"),
  selectEmployeeID: db.prepare(
    "SELECT EmployeeID from Email where Address LIKE ?"
  ),
  selectEmployeeEmails: db.prepare(
    "SELECT Address as Email FROM Email WHERE EmployeeID = ?"
  ),
};

/**
 * Adds an email address that belongs to a Employee in Employee table
 * @param {String} Name Employee's name
 * @param {String} Address Email address
 * @returns Info object about transaction, null if transaction has failed
 */
module.exports.addEmail = ({ Name, Address }) => {
  try {
    const EmployeeID = selectEmployee(Name).ID;
    const status = statements.addEmail.run({
      EmployeeID,
      Address,
    });
    return status;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Gets all rows in Email table
 * @returns Array with all rows in Email table
 */
module.exports.selectAllEmails = () => {
  try {
    const result = statements.selectAll.all();
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Gets a Employee's ID based on an email address
 * @param {String} Address Employee email address
 * @returns {Integer} Employee ID, null if an error occurs
 */
module.exports.selectEmployeeID = (Address) => {
  try {
    const result = statements.selectEmployeeID.get(Address).EmployeeID;
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const pluckEmail = (entry) => entry.Email;

module.exports.selectEmployeeEmails = ({ RoleID }) => {
  try {
    const { EmployeeID } = getEmployeeID({ RoleID });
    const result = statements.selectEmployeeEmails
      .all(EmployeeID)
      .map(pluckEmail);
    return result;
  } catch (error) {
    console.log(error);
  }
};
