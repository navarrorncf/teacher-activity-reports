const { readdirSync } = require("fs");

//===============//
//               //
//   CONSTANTS   //
//               //
//===============//

// const { FIELD_NAMES, REGEX_MATCHERS } = require("./constants");

//=======================//
//                       //
//   UTILITY FUNCTIONS   //
//                       //
//=======================//

// const { pluckField, reformatDate, reformatTimestamp } = require("./utils");

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

// const {
//   getFileContents,
//   getFilePath,
//   getRows,
//   removeEmptyRows,
// } = require("./mapCallbacks");

//===============================//
//                               //
//   FILTER CALLBACK FUNCTIONS   //
//                               //
//===============================//

// const { isCsvFile } = require("./filterCallbacks");

//============================//
//                            //
//   ENTRY PARSER FUNCTIONS   //
//                            //
//============================//

// const parseEntry = (entryString) => {
//
//   TODO!!
//
// };

// const parseRows = (rowsArray) => rowsArray.map(parseEntry);

// const getAllReports = (currentDirectory) =>
//   readdirSync(currentDirectory)
//     .filter(isCsvFile)
//     .map((fileName) => getFilePath(currentDirectory, fileName))
//     .map(getFileContents)
//     .map(getRows)
//     .map(removeEmptyRows)
//     .map(parseRows)
//     .reduce(mergeArrays, []);

module.exports = null;
