const path = require("path");
const database = require("better-sqlite3");

const options = {
  // verbose: console.log, // development only
};

const db = new database(path.join(__dirname, "..", "cem02braz.db"), options);

module.exports = db;
