const { hasUndefinedProp } = require("../src/utils/commandValidations.js");
const { median } = require("./gather.js");
const QUESTIONS = require("./constants/questions.js");
const presentation = require("./presentation.js");
const thanks = require("./thanks.js");
const inquirer = require("inquirer");
const chalk = require("chalk");
const log = console.log;

const interview = async (input = null) => {
  let totalPrices = [];
  presentation();
  const isInterview = hasUndefinedProp(input);

  if (isInterview) {
    log(
      `${chalk.hex("#ffd654")(`⌥`)} ${chalk
        .hex("#f0b909")
        .bold(`I have a few questions`)}`,
    );
  }

  const answers = isInterview ? await inquirer.prompt(QUESTIONS) : input;

  if (isInterview) {
    log(" ");
  }

  log(
    `${chalk.hex("#ffd654")(`⌥`)} ${chalk
      .hex("#f0b909")
      .bold(`Collecting data for you`)}`,
  );

  const ui = new inquirer.ui.BottomBar();

  const onPageChanged = (page, totalPages) => {
    ui.updateBottomBar(
      `${chalk.grey(`🔍  Fetching page ${page}/${totalPages}`)} \n`,
    );
  };

  const result = await median(
    answers.fiat,
    answers.operation,
    answers.ticker,
    answers.payTypes ? [answers.payTypes] : [],
    [],
    onPageChanged,
  );

  log(
    `🔗  ${chalk.grey("Transaction type")} ${chalk.bold(
      answers.ticker,
    )} @ ${chalk.bold(answers.fiat)}`,
  );

  log(`💰  ${chalk.bold(result.offering)} ${chalk.grey("People offering")} \n`);

  log(
    `${chalk.hex("#ffd654")(`⌥`)} ${chalk
      .hex("#f0b909")
      .bold(`Here I have the results`)}`,
  );

  log(`📉  ${chalk.grey("Minimum price")} 💵  ${chalk.bold(result.minimum)}`);

  log(
    `📊  ${chalk.grey("Median price")}  💵  ✨ ${chalk.bold(result.median)}✨`,
  );

  log(
    `📈  ${chalk.grey("Maximum price")} 💵  ${chalk.bold(result.maximun)} \n`,
  );

  thanks();
};

module.exports = interview;
