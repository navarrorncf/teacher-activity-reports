/*=========

  CONSTANTS

  =========*/

const ERROR_MESSAGES = {
  INVALID_STRING_INPUT: "Name must be a valid, non empty string",
  INVALID_ARRAY_INPUT: "Input must be an Array",
  INVALID_FIELD: (input) => `Invalid field ${input} in activity object`,
  INVALID_FIELDS_COUNT: (
    given,
    expected = VALID_FIELDS.length
  ) => `Invalid fields count in activity object.
    Expected: ${expected} - Given: ${given}`,
  INVALID_ACTIVITY_OBJECT: "Invalid activity object",
};

const VALID_FIELDS = ["Date", "MorningShift", "AfternoonShift", "NightShift"];

const ACTIVITY_FIELD_VALIDATORS = {
  Date: (value) =>
    validateStringInput(value) &&
    /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}/.test(value),
  MorningShift: (value) => validateStringInput(value),
  AfternoonShift: (value) => validateStringInput(value),
  NightShift: (value) => validateStringInput(value),
};

/*===============

  BASE VALIDATORS

  ===============*/

const throwIfFalse = (passChecks, errorMessage) => {
  if (!passChecks) {
    throw new Error(errorMessage);
  }
};

const isValidString = (value) => typeof value === "string" && value;

const validateStringInput = (value) => {
  throwIfFalse(isValidString(value), ERROR_MESSAGES.INVALID_STRING_INPUT);
  return true;
};

const validateArrayInput = (value) => {
  throwIfFalse(Array.isArray(value), ERROR_MESSAGES.INVALID_ARRAY_INPUT);
};

const validateNumberInput = (value) => !isNaN(value * 1);

const validateStringLength = (string, min, max) =>
  string.length >= min && string.length <= max;

/*===================
  SPECIFIC VALIDATORS
  ===================*/

const validateName = (name) => {
  return validateStringInput(name) && validateStringLength(name, 7, 75);
};

const validateEmail = (emailAddress) => {
  return (
    validateStringInput(emailAddress) &&
    validateStringLength(emailAddress, 16, 75) &&
    /.*@(edu\.)?se\.df\.gov\.br/.test(emailAddress)
  );
};

const validateRegistration = (registration) => {
  return (
    validateStringInput(registration) &&
    validateNumberInput(registration.replace("X", "0"))
  );
};

const validateMonth = (month) => {
  return validateStringInput(month) && validateStringLength(month, 4, 9);
};

const validateYear = (year) => {
  return validateStringInput(year) && validateNumberInput(year);
};

const validateFieldsCount = (count) => {
  throwIfFalse(
    count !== VALID_FIELDS.length,
    ERROR_MESSAGES.INVALID_FIELDS_COUNT(count)
  );
  return true;
};

const validateActivityFieldNames = (fieldNames) => {
  if (
    validateArrayInput(fieldNames) &&
    validateFieldsCount(fieldNames.length)
  ) {
    for (let fieldName of fieldNames) {
      if (!VALID_FIELDS.includes(fieldName)) {
        throw new Error(ERROR_MESSAGES.INVALID_FIELD(fieldName));
      }
    }
    return true;
  }
};

const validateActivity = (activity) => {
  const fieldNames = Object.keys(activity);

  if (validateActivityFieldNames(fieldNames)) {
    for (let fieldName of fieldNames) {
      const isValid = ACTIVITY_FIELD_VALIDATORS[fieldName](fieldName);
      throwIfFalse(isValid, ERROR_MESSAGES.INVALID_FIELD(fieldName));
    }
    return true;
  }
};

/*==============
  MAIN VALIDATOR
  ==============*/

const validateInput = (input) => {
  const { Name, Registration, Email, Month, Year, Activities, Supervisors } =
    input;

  if (validateArrayInput(Activities)) {
    for (let activity of Activities) {
      throwIfFalse(
        validateActivity(activity),
        ERROR_MESSAGES.INVALID_ACTIVITY_OBJECT
      );
    }
  } else {
    throw new Error("Invalid Activities Array");
  }

  const allChecksPassed =
    validateName(Name) &&
    validateEmail(Email) &&
    validateRegistration(Registration) &&
    validateMonth(Month) &&
    validateYear(Year);

  return allChecksPassed;
};

/*====================
  EXPORT MAIN FUNCTION
  ====================*/

module.exports = validateInput;
