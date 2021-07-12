const ForeignKeySeeder = require("./ForeignKeySeeder");
const {
  databaseConnection,
  RoleController,
  RoleSupervisorController,
} = require("../controller");

const allRoles = RoleController.selectAllRoles();

class RoleSupervisorSeeder extends ForeignKeySeeder {
  constructor(databaseConnection, tableName, tableRows) {
    super(databaseConnection, tableName, tableRows);
  }
}

const COORDINATORS = RoleController.getByRole("Coordenação");
const SUPERVISORS = RoleController.getByRole("Supervisão");
const PRINCIPALS = RoleController.getByRole("%diret");

const getSupervisors = (Field, Role, Shift) => {
  const supervisor = SUPERVISORS.filter((s) => s.Shift === Shift);
  const coordinators = COORDINATORS.filter((c) => c.Shift === Shift);
  if (Shift === "Noturno") {
    if (/professor/i.test(Role)) {
      return [...coordinators, ...supervisor, ...PRINCIPALS];
    } else if (/coordena/i.test(Role)) {
      return [...supervisor, ...PRINCIPALS];
    } else if (/supervis/i.test(Role)) {
      return PRINCIPALS;
    } else {
      return [...coordinators, ...supervisor, ...PRINCIPALS];
    }
  } else if (/(SRG|SAA|SOE)/i.test(Field)) {
    return [...supervisor, ...PRINCIPALS];
  } else if (Shift === "Diurno") {
    if (/professor/i.test(Role)) {
      const coordinator = coordinators.filter((c) => c.Field === Field);
      return [...coordinator, ...supervisor, ...PRINCIPALS];
    } else if (/coordena/i.test(Role) || /apoio/i.test(Role)) {
      return [...supervisor, ...PRINCIPALS];
    } else {
      return PRINCIPALS;
    }
  }
  throw new Error("Uncaught General Case");
};

RoleSupervisorSeeder.prototype.seedDatabase = function () {
  if (this.tableRows.length) {
    const batchInsert = this.databaseConnection.transaction((tableRows) => {
      for (const tableRow of tableRows) {
        this.setTableFields(["RoleID, SupervisorRoleID"]);

        const { ID: RoleID, Field, Role, Shift } = tableRow;
        const supervisors = getSupervisors(Field, Role, Shift);

        supervisors.forEach(({ ID: SupervisorRoleID }) => {
          if (RoleID !== SupervisorRoleID) {
            RoleSupervisorController.addRoleSupervisor({
              RoleID,
              SupervisorRoleID,
            });
          }
        });
      }
    });

    batchInsert(this.tableRows);
  } else {
    throw new Error(`Must have tableRows for seeding table ${this.tableName}`);
  }
};

const roleSupervisorSeeder = new RoleSupervisorSeeder(
  databaseConnection,
  "RoleSupervisor",
  allRoles
);

module.exports = roleSupervisorSeeder;
