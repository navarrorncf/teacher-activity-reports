const { readdirSync } = require("fs");

const IGNORED = ["index.js", "reportParser"];

const filterIgnored = (relativePath) => !IGNORED.includes(relativePath);

const turnIntoObject = (acc, cur) => Object.assign(acc, { [cur]: cur });

const AVAILABLE_MONTHS = readdirSync(__dirname)
  .filter(filterIgnored)
  .reduce(turnIntoObject, {});

const isAvailable = (month) => !!AVAILABLE_MONTHS[month];

const get = (month) => require(`./${month}`);

const getReportsByMonth = (month) => (isAvailable(month) ? get(month) : null);

module.exports.availableMonths = AVAILABLE_MONTHS;
module.exports.getReportsByMonth = getReportsByMonth;
