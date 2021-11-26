const { readdirSync } = require("fs");

//===============================//
//                               //
//   REDUCE CALLBACK FUNCTIONS   //
//                               //
//===============================//

const { mergeArrays } = require("./reduceCallbacks");

//============================//
//                            //
//   MAP CALLBACK FUNCTIONS   //
//                            //
//============================//

const {
  getFileContents,
  getFilePath,
  getRows,
  removeEmptyRows,
  getRowsWithHeaders,
  buildEntries,
  buildDateStrings,
} = require("./mapCallbacks.v2");

//===============================//
//                               //
//   FILTER CALLBACK FUNCTIONS   //
//                               //
//===============================//

const { isCsvFile } = require("./filterCallbacks");

//==================//
//                  //
//   ENTRY PARSER   //
//                  //
//==================//

const getAllReports = (currentDirectory, year, month) =>
  readdirSync(currentDirectory)
    .filter(isCsvFile)
    .map((fileName) => getFilePath(currentDirectory, fileName))
    .map(getFileContents)
    .map(getRows)
    .map(removeEmptyRows)
    .map(getRowsWithHeaders)
    .reduce(mergeArrays, [])
    .map(buildEntries)
    .reduce(mergeArrays, [])
    .map((entry) => buildDateStrings(entry, year, month));

module.exports = getAllReports;
