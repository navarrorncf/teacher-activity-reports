// Only run the line bellow if the database was not yet created
// require("./db/createDatabase");

/*=======
  IMPORTS
  =======*/

const { RoleController } = require("../db/controller");
const { Report } = require(".");

/*=======================================
  MONTH SELECTION AND BASIC CONFIGURATION
  =======================================*/

const MONTHS = ["04", "05"];
const MONTH_NAMES = {
  "04": "ABRIL",
  "05": "MAIO",
  // "06": "JUNHO",
  // "07": "JULHO",
};

const CURRENT_YEAR = "2021";

/*====================
  FUNCTION DEFINITIONS
  ====================*/

const pluckID = ({ ID }) => ID;

const generateReport = (month) => (ID) =>
  new Report(ID, month, CURRENT_YEAR).export();

const getAllReports = (ID) => {
  const allReports = MONTHS.map((month) => {
    return {
      Month: MONTH_NAMES[month],
      ...generateReport(month)(ID),
    };
  }).reduce((acc, cur) => {
    const activities = cur.Activities;
    delete cur.Activities;

    return Object.assign(acc, { ...cur, [cur.Month]: activities });
  }, {});

  delete allReports.Month;

  return allReports;
};

/*===================================
  SAVE ACTIVITY REPORTS AS HTML FILES
  ===================================*/

const allReports = RoleController.selectAllRoles()
  .map(pluckID)
  .map(getAllReports);

/*===============================
  GENERATE JSON WITH REPORTS DATA
  ===============================*/

module.exports = JSON.stringify(allReports);
