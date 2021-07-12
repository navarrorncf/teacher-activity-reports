const { readFileSync } = require("fs");
const { join } = require("path");

const { hasContent } = require("./filterCallbacks");

module.exports.getFilePath = (dirPath, fileName) => join(dirPath, fileName);

module.exports.getFileContents = (filePath) => readFileSync(filePath, "utf-8");

module.exports.removeEmptyRows = (rowsArray) => rowsArray.filter(hasContent);

module.exports.getRows = (fileContents) => fileContents.split("$$newEntry$$,");
