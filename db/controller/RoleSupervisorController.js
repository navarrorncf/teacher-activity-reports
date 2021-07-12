const db = require("./connection");

const statements = {
  insertRoleSupervisor: db.prepare(
    `INSERT INTO RoleSupervisor (RoleID, SupervisorRoleID) 
     VALUES (@RoleID, @SupervisorRoleID)`
  ),
  getSupervisors: db.prepare(`
    SELECT e.Name, r.Role, em.Address as Email
    FROM RoleSupervisor rs1
    JOIN RoleSupervisor rs2 ON rs1.SupervisorRoleID = rs2.RoleID
    JOIN Role r ON rs1.SupervisorRoleID = r.ID
    JOIN Employee e ON r.EmployeeID = e.ID
    JOIN Email em ON r.EmployeeID = em.EmployeeID
    WHERE rs1.RoleID = ?
    GROUP BY rs1.SupervisorRoleID
  `),
};

module.exports.addRoleSupervisor = ({ RoleID, SupervisorRoleID }) => {
  try {
    const status = statements.insertRoleSupervisor.run({
      RoleID,
      SupervisorRoleID,
    });
    return status;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getSupervisors = ({ RoleID }) => {
  try {
    const supervisors = statements.getSupervisors.all(RoleID);
    return supervisors;
  } catch (error) {
    console.log(error);
    return null;
  }
};
