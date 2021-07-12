module.exports.isCsvFile = (fileName) => /\.csv$/.test(fileName);

module.exports.hasContent = (entry) => entry.length > 0;
