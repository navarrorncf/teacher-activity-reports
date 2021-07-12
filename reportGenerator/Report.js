const {
  ActivityReportController,
  EmailController,
  EmployeeController,
  RoleController,
  RoleSupervisorController,
} = require("../db/controller");

const CURRENT_YEAR = new Date().getFullYear().toString();
const CURRENT_MONTH_NUMBER = "04";
const MONTH_NAMES = {
  "04": "ABRIL",
  "05": "MAIO",
};

const getMainEmail = (emails) => {
  if (!emails) return null;
  if (emails.length === 1) return emails[0];
  return emails.filter((email) => /@se/.test(email))[0];
};

class Report {
  constructor(RoleID, Month = CURRENT_MONTH_NUMBER, Year = CURRENT_YEAR) {
    this.RoleID = RoleID;
    this.Month = Month;
    this.Year = Year;

    this.Activities = ActivityReportController.getEmployeeMonthReports({
      RoleID,
      Month,
    });

    this.allEmails = EmailController.selectEmployeeEmails({ RoleID });

    this.Email = getMainEmail(this.allEmails);

    this.Activities = this.getActivities();

    this.EmployeeID = RoleController.getEmployeeID({ RoleID }).EmployeeID;

    const { Registration, Role, Shift } = RoleController.getRoleByID({
      RoleID,
    });

    this.Registration = Registration;
    this.Role = Role;
    this.Shift = Shift;

    this.Name = EmployeeController.getEmployeeByID({
      ID: this.EmployeeID,
    }).Name;

    this.Supervisors = RoleSupervisorController.getSupervisors({ RoleID });
  }

  getActivities() {
    const allReports = ActivityReportController.getEmployeeMonthReports({
      RoleID: this.RoleID,
      Month: this.Month,
    });

    const updatedReports = {};

    allReports.forEach((report) => {
      const updatedReport = updatedReports[report.Date];

      if (!updatedReport) {
        updatedReports[report.Date] = report;
      } else if (report.Timestamp.localeCompare(updatedReport.Timestamp) > 0) {
        updatedReports[report.Date] = report;
      }
    });

    const updatedReportsArray = Object.values(updatedReports);

    updatedReportsArray.sort((a, b) => a.Date.localeCompare(b.Date));

    return updatedReportsArray
      .map(({ Date, MorningShift, AfternoonShift, NightShift }) => ({
        Date,
        MorningShift,
        AfternoonShift,
        NightShift,
      }))
      .map((entry) => {
        const [year, month, day] = entry.Date.split("/");
        entry.Date = `${day}/${month}/${year}`;
        return entry;
      });
  }

  export() {
    const c = this.Supervisors.filter((s) => /coordena/i.test(s.Role));
    const s = this.Supervisors.filter((s) => /supervis/i.test(s.Role));
    const d = this.Supervisors.filter((s) => /^Diretor$/.test(s.Role));
    const v = this.Supervisors.filter((s) => /vice/i.test(s.Role));

    c.sort((a, b) => a.Name - b.Name);

    const orderedSupervisors = [...c, ...s, ...v, ...d];

    return {
      Name: this.Name,
      Registration: this.Registration,
      Role: this.Role,
      Email: this.Email,
      Activities: this.Activities,
      Year: this.Year,
      Month: MONTH_NAMES[this.Month],
      Shift: this.Shift,
      Supervisors: orderedSupervisors,
    };
  }
}

module.exports = Report;
