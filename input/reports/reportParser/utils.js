//=====================//
//                     //
//   LOCAL FUNCTIONS   //
//                     //
//=====================//

const pad = (desiredLength) => (originalString) => {
  const difference = desiredLength - originalString.length;

  if (difference > 0) return `${"0".repeat(difference)}${originalString}`;
  return originalString;
};

const padYear = (year) => (year.length === 2 ? `20${year}` : year);

//========================//
//                        //
//   EXPORTED FUNCTIONS   //
//                        //
//========================//

module.exports.pluckField = (fieldMatcher, string) =>
  string.split(fieldMatcher);

module.exports.reformatTimestamp = (timestamp) => {
  const [oldDate, time] = timestamp.split(" ");
  const [month, day, year] = oldDate.split("/");
  const newDate = `${padYear(year)}-${pad(2)(month)}-${pad(2)(day)}`;

  return `${newDate}_${time}`;
};

module.exports.reformatDate = (date) => {
  const [day, month, year] = date.split("/");
  return `${padYear(year)}/${pad(2)(month)}/${pad(2)(day)}`;
};
