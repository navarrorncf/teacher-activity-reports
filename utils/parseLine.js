const trimQuotes = require("./trimQuotes");
const headers = ["timestamp", "email", "date", "shift", "activities"];

/**
 * Parses a row from the form response sheet
 * @param {string} row row to be parsed
 * @returns the array parsed from the row string passed as argument
 */
const parseLine = (row) => {
  if (/Carimbo de data\/hora/.test(row)) return headers;

  const dataArray = trimQuotes(row).split('","');
  if (dataArray.length == headers.length) return dataArray;
  else
    throw new Error(`Data inconsistency at line => ${dataArray.slice(0, 3)}`);
  /* catch (e) {
    // TODO: Make an error handler and a logger for the app
    console.log(e);
  } */
};

module.exports = parseLine;
