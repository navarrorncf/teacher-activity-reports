module.exports.REGEX_MATCHERS = {
  Timestamp: /,\$\$datetime\$\$,/,
  Email: /,\$\$email\$\$,/,
  Date: /,\$\$referencedDate\$\$,/,
  MorningShift: /,\$\$morningShift\$\$,/,
  AfternoonShift: /,\$\$afternoonShift\$\$,/,
  NightShift: /,\$\$nightShift\$\$/,
};

module.exports.FIELD_NAMES = [
  "Timestamp",
  "Email",
  "Date",
  "MorningShift",
  "AfternoonShift",
  "NightShift",
];
