const { readFileSync } = require("fs");
const { join } = require("path");

const { hasContent } = require("./filterCallbacks");
const {
  reformatTimestamp,
  removeTabsAndLineBreaks,
  buildDateString,
} = require("./utils");
const { SHIFTS } = require("./constants");

module.exports.getFilePath = (dirPath, fileName) => join(dirPath, fileName);

module.exports.getFileContents = (filePath) => readFileSync(filePath, "utf-8");

module.exports.removeEmptyRows = (rowsArray) => rowsArray.filter(hasContent);

module.exports.getRows = (fileContents) => fileContents.split("\n¢¢¢¢¢");

const splitRow = (row) => row.split(/,¢¢¢¢¢/);

module.exports.getRowsWithHeaders = (rowsArray) => {
  const [headers, ...rows] = rowsArray.map(splitRow);

  headers[0] = "Timestamp";
  headers[1] = "Email";

  return rows.map((row) => ({
    headers: headers,
    activities: row,
  }));
};

module.exports.buildEntries = (rowsWithHeaders) => {
  const { headers, activities } = rowsWithHeaders;
  const [timestampHeader, emailHeader, ...dayHeaders] = headers;
  const [timestamp, email, ...dayReports] = activities;

  if (headers.length !== activities.length) {
    throw new Error(`Headers and Activities must have the same length: 
      ${headers.length} != ${activities.length}`);
  }

  const metadata = {
    [timestampHeader]: reformatTimestamp(timestamp),
    [emailHeader]: email,
  };

  const reports = {};

  dayHeaders.forEach((dayHeader, index) => {
    const [dayString, shift] = dayHeader.split(" - ");

    const day = dayString.match(/[0-9]+/)[1];

    if (!!day && !!shift) {
      if (!reports[day]) {
        reports[day] = {
          Date: day,
          MorningShift: "",
          AfternoonShift: "",
          NightShift: "",
        };
      }

      reports[day][SHIFTS[shift.trim()]] = removeTabsAndLineBreaks(
        dayReports[index]
      );
    }
  });

  return Object.values(reports).map((activities) => ({
    ...metadata,
    ...activities,
  }));
};

module.exports.buildDateStrings = (entry, year, month) => {
  const { Date: oldDateString } = entry;
  const dateString = buildDateString(oldDateString, year, month);
  return {
    ...entry,
    Date: dateString,
  };
};
