// Only run the line bellow if the database was not yet created
// require("./db/createDatabase");

/*=======
  IMPORTS
  =======*/

const { writeFileSync, readdirSync, rmSync } = require("fs");
const { join } = require("path");
const { RoleController } = require("./db/controller");
const { Report } = require("./reportGenerator");
const puppeteer = require("puppeteer");
const buildTemplate = require("./reportGenerator/buildTemplate");

/*=======================================
  MONTH SELECTION AND BASIC CONFIGURATION
  =======================================*/

const CURRENT_MONTH_NUMBER = "05";
const CURRENT_YEAR = "2021";
const PATH_TO_TEMP_DIR = join(__dirname, "temp");
const PATH_TO_OUTPUT_DIR = join(__dirname, "output");

/*====================
  FUNCTION DEFINITIONS
  ====================*/

const pluckID = ({ ID }) => ID;

const generateReport = (ID) =>
  new Report(ID, CURRENT_MONTH_NUMBER, CURRENT_YEAR).export();

const saveHtmlReports = (report) => {
  const { Shift, Name, Month } = report;
  const fileName = `${Shift} - ${Month} - ${Name}.html`;
  const fileContents = buildTemplate(report);

  writeFileSync(join(PATH_TO_TEMP_DIR, fileName), fileContents, "utf-8");
};

/*===================================
  SAVE ACTIVITY REPORTS AS HTML FILES
  ===================================*/

const allReports = RoleController.selectAllRoles()
  .map(pluckID)
  .map(generateReport);

allReports.forEach(saveHtmlReports);

/*=================================================
  CONVERT REPORTS TO PDF AND REMOVE TEMPORARY FILES
  =================================================*/

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const fileNames = readdirSync(PATH_TO_TEMP_DIR, "utf-8");

  for (file of fileNames) {
    const [fileName] = file.split(".");
    const inputFilePath = join(PATH_TO_TEMP_DIR, file);
    const outputFilePath = join(PATH_TO_OUTPUT_DIR, `${fileName}.pdf`);

    await page.goto(`file://${inputFilePath}`);

    await page.pdf({
      path: `${outputFilePath}`,
      format: "a4",
      printBackground: true,
      margin: {
        top: "1cm",
        bottom: "1cm",
        left: "1cm",
        right: "1cm",
      },
    });

    rmSync(inputFilePath);
  }

  await browser.close();
})();
