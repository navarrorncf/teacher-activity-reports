const { v2: reportParser } = require("../reportParser");

const MONTH = "06";
const YEAR = "2021";

module.exports = reportParser(__dirname, YEAR, MONTH);
