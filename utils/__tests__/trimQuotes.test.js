const { test } = require("@jest/globals");
const trimQuotes = require("../trimQuotes");

test("removes outer quotation marks", () => {
  expect(trimQuotes('"Rafael"')).toBe("Rafael");
});

test("ignores non starting nor ending quotation marks", () => {
  expect(trimQuotes('Rafa"el')).toBe('Rafa"el');
});

test("removes only one quotation mark at start and one at the end", () => {
  expect(trimQuotes('""Rafa"el""')).toBe('"Rafa"el"');
});
