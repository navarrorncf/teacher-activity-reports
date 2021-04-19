const trimQuotes = (string) => string.replace(/(^\"|\"$)/g, "");

module.exports = trimQuotes;
