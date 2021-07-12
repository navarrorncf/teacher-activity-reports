const db = require("./connection");

const statements = {
  addRole: db.prepare(
    `INSERT INTO Role (
      EmployeeID, Registration, Role, Field, Subject, Shift
    ) values (
      @EmployeeID, @Registration, @Role, @Field, @Subject, @Shift
    )`
  ),
  selectAll: db.prepare(`SELECT * FROM Role`),
  getByRole: db.prepare(`SELECT * FROM Role WHERE Role LIKE ?`),
  getByID: db.prepare(`SELECT * FROM Role WHERE EmployeeID = ?`),
  getEmployeeID: db.prepare("SELECT EmployeeID FROM Role WHERE ID = ?"),
  getRoleByID: db.prepare("SELECT * FROM Role WHERE ID = ?"),
};

/**
 * Adds a Shift that belongs to an Employee in Shift table
 * @param {String} EmployeeID   Employee's ID on Employee table
 * @param {String} Registration Employee's registration
 * @param {String} Role         Employee's role
 * @param {String} Field        Employee's field
 * @param {String} Subject      Employee's teaching subject, if a teacher
 * @param {String} Shift        Employee's work shift
 * @returns Info object about transaction, null if transaction has failed
 */
module.exports.addRole = ({
  EmployeeID,
  Registration,
  Role,
  Field,
  Subject,
  Shift,
}) => {
  try {
    const status = statements.addRole.run({
      EmployeeID,
      Registration,
      Role,
      Field,
      Subject,
      Shift,
    });
    return status;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Gets all rows in Role table
 * @returns Array with all rows in Role table
 */
module.exports.selectAllRoles = () => {
  try {
    const result = statements.selectAll.all();
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports.getByRole = (Role) => {
  try {
    const coordinators = statements.getByRole.all(`${Role}%`);
    return coordinators;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getByID = ({ EmployeeID }) => {
  try {
    const roles = statements.getByID.all(EmployeeID);
    return roles;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getEmployeeID = ({ RoleID }) => {
  try {
    const ID = statements.getEmployeeID.get(RoleID);
    return ID;
  } catch (error) {
    console.log(error);
  }
};

module.exports.getRoleByID = ({ RoleID }) => {
  try {
    const role = statements.getRoleByID.get(RoleID);
    return role;
  } catch (error) {
    console.log(error);
  }
};
