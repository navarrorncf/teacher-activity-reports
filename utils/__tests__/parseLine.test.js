const { test } = require("@jest/globals");
const parseLine = require("../parseLine");

test("Detects header content", () => {
  const testString =
    '"Carimbo de data/hora","Nome de usuário","DATA","TURNO","ATIVIDADES DESENVOLVIDAS "';

  expect(parseLine(testString)).toEqual([
    "timestamp",
    "email",
    "date",
    "shift",
    "activities",
  ]);
});

test("Parses content correctly", () => {
  const testString = `"2021/04/14 9:57:33 AM GMT-3","marcoscarvalho@se.df.gov.br","2021-04-13","DIURNO","* Fala macia\n* Leitura de bola de cristal\n* Conferir se cresci mais um pouquinho durante a noite"`;

  expect(parseLine(testString)).toEqual([
    "2021/04/14 9:57:33 AM GMT-3",
    "marcoscarvalho@se.df.gov.br",
    "2021-04-13",
    "DIURNO",
    "* Fala macia\n* Leitura de bola de cristal\n* Conferir se cresci mais um pouquinho durante a noite",
  ]);
});

test("Detects data inconsistency and throws error", () => {
  const testString = `"2021/04/14 9:57:33 AM GMT-3","marcoscarvalho@se.df.gov.br","2021-04-13","DIURNO"`;

  expect(() => parseLine(testString)).toThrow(
    `Data inconsistency at line => 2021/04/14 9:57:33 AM GMT-3,marcoscarvalho@se.df.gov.br,2021-04-13`
  );
});

test("Detects data inconsistency and throws error", () => {
  const testString = `"1","2","3"`;

  expect(() => parseLine(testString)).toThrow(
    `Data inconsistency at line => 1,2,3`
  );
});
