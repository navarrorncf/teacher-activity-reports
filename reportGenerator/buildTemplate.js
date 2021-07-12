const fs = require("fs");
const path = require("path");

const opt = { encoding: "utf-8" };

const template = {
  base: fs.readFileSync(path.join(__dirname, "partials", "_base.html"), opt),
  header: fs.readFileSync(
    path.join(__dirname, "partials", "_header.html"),
    opt
  ),
  documentTitle: fs.readFileSync(
    path.join(__dirname, "partials", "_document-title.html"),
    opt
  ),
  identification: fs.readFileSync(
    path.join(__dirname, "partials", "_identification.html"),
    opt
  ),
  activities: fs.readFileSync(
    path.join(__dirname, "partials", "_activities.html"),
    opt
  ),
  activityRow: fs.readFileSync(
    path.join(__dirname, "partials", "_activity-row.html"),
    opt
  ),
  secondActivityRow: fs.readFileSync(
    path.join(__dirname, "partials", "_second-activity-row.html"),
    opt
  ),
  footer: fs.readFileSync(
    path.join(__dirname, "partials", "_footer.html"),
    opt
  ),
  signature: fs.readFileSync(
    path.join(__dirname, "partials", "_signature.html"),
    opt
  ),
};

const shiftNames = {
  MorningShift: "Matutino",
  AfternoonShift: "Vespertino",
  NightShift: "Noturno",
};

/**
 * Builds an HTML report for the report data passed
 * @param {Object}    reportData                              Data for generating html report
 * @param {string}    reportData.name                         teacher's name
 * @param {string}    reportData.registration                 teacher's registration code
 * @param {string}    reportData.month                        month of report (as 'APRIL', not '04')
 * @param {string}    reportData.year                         year of report
 * @param {Object[]}  reportData.activities                   array of activity objects
 * @param {string}    reportData.activities.date              date string in DD/MM/YYYY format
 * @param {Object}    reportData.activities.entries           array of entry objects
 * @param {string}    reportData.activities.entries.activity  activity description
 * @param {string}    reportData.activities.entries.shift     shift in which the activity took place
 * @returns {string}                                          HTML string with formatted activity report
 */
const buildTemplate = (reportData) => {
  const {
    Activities,
    Email,
    Month,
    Name,
    Registration,
    Role,
    Supervisors,
    Year,
  } = reportData;

  let body = template.header + template.documentTitle;

  const identification = template.identification
    .replace("%%REGISTRATION%%", Registration)
    .replace("%%NAME%%", Name)
    .replace("%%MONTH%%", Month)
    .replace("%%YEAR%%", Year);

  let activityTableRows = "";

  Activities.forEach((el) => {
    const { Date: referencedDate, ...Entries } = el;
    const count = Object.values(Entries).filter((e) => e.length > 0).length;

    let rowContents = "",
      insertedShifts = 0;

    Object.keys(Entries).forEach((shift) => {
      let activity = Entries[shift].replace(/\n/g, "<br />");
      if (activity.length > 0) {
        if (insertedShifts === 0) {
          rowContents += template.activityRow
            .replace("%%DATE%%", referencedDate)
            .replace("%%SHIFT%%", shiftNames[shift])
            .replace("%%ACTIVITY%%", activity);
        } else {
          rowContents += template.secondActivityRow
            .replace("%%DATE%%", referencedDate)
            .replace("%%SHIFT%%", shiftNames[shift])
            .replace("%%ACTIVITY%%", activity);
        }
        insertedShifts++;
      }
    });

    activityTableRows += rowContents;
  });

  const signatures = [{ Name, Role, Email }, ...Supervisors]
    .map((supervisor) => {
      return template.signature
        .replace("%%NAME%%", supervisor.Name)
        .replace("%%EMAIL%%", supervisor.Email)
        .replace("%%ROLE%%", supervisor.Role);
    })
    .join("");

  let footer = template.footer.replace("%%SIGNATURES%%", signatures);

  body += identification;
  body += template.activities.replace("%%TABLE_ROWS%%", activityTableRows);
  body += footer;

  return template.base.replace("%%PAGE_CONTENT%%", body);
};

module.exports = buildTemplate;
