const db = require("./connection");
const { selectEmployeeID } = require("./EmailController");

const statements = {
  addActivityReport: db.prepare(
    `INSERT INTO ActivityReport (
      Timestamp, RoleID, Date, MorningShift, AfternoonShift, NightShift
      ) values (
      @Timestamp, @RoleID, @Date, @MorningShift, @AfternoonShift, @NightShift
      )`
  ),
  getEmployeeReports: db.prepare(
    `SELECT * FROM ActivityReport WHERE RoleID = ?`
  ),
  getEmployeeMonthReports: db.prepare(
    `SELECT * FROM ActivityReport WHERE RoleID = @RoleID AND Date LIKE @Date ORDER BY Date`
  ),
};

/**
 * Adds a new report to ActivityReport table
 * @param {String} emailAddress   Employee's email address
 * @param {String} Timestamp      Timestamp from when report was sent by the Employee
 * @param {String} Date           Date string in ISO format
 * @param {String} MorningShift   Activities performed in the morning shift
 * @param {String} AfternoonShift Activities performed in the afternoon shift
 * @param {String} NightShift     Activities performed in the night shift
 * @returns                       Info object from database transaction, null if an error has occurred
 */
module.exports.addReport = (
  emailAddress,
  Timestamp,
  date,
  MorningShift,
  AfternoonShift,
  NightShift
) => {
  try {
    const EmployeeID = selectEmployeeID(emailAddress);
    const result = statements.addActivityReport.run({
      Timestamp,
      EmployeeID,
      Date: date,
      MorningShift,
      AfternoonShift,
      NightShift,
    });
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports.getEmployeeReports = (EmployeeID) => {
  try {
    const reports = statements.getEmployeeReports.all(EmployeeID);
    return reports;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getEmployeeMonthReports = ({ RoleID, Year = "2021", Month }) => {
  try {
    const Date = `${Year}/${Month}/%`;
    const reports = statements.getEmployeeMonthReports.all({
      RoleID,
      Date,
    });
    return reports;
  } catch (error) {
    console.log(error);
    return null;
  }
};
