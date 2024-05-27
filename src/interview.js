const { hasUndefinedProp } = require("../src/utils/commandValidations.js");
const gathering = require("./gather.js");
const QUESTIONS = require("./constants/questions.js");
const presentation = require("./presentation.js");
const median = require("./utils/median.js");
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

  const results = await gathering(
    answers.fiat,
    answers.operation,
    answers.ticker,
    answers.payTypes ? [answers.payTypes] : [],
    [],
    onPageChanged,
  );

  results.map((obj) => totalPrices.push(parseFloat(obj.adv.price)));

  const minimun = answers.operation === "SELL" ? totalPrices.length - 1 : 0;
  const maximun = answers.operation === "SELL" ? 0 : totalPrices.length - 1;

  log(
    `🔗  ${chalk.grey("Transaction type")} ${chalk.bold(
      answers.ticker,
    )} @ ${chalk.bold(answers.fiat)}`,
  );

  log(
    `💰  ${chalk.bold(totalPrices.length)} ${chalk.grey("People offering")} \n`,
  );

  log(
    `${chalk.hex("#ffd654")(`⌥`)} ${chalk
      .hex("#f0b909")
      .bold(`Here I have the results`)}`,
  );

  log(
    `📉  ${chalk.grey("Minimum price")} 💵  ${chalk.bold(
      totalPrices[minimun].toLocaleString(),
    )}`,
  );

  log(
    `📊  ${chalk.grey("Median price")}  💵  ✨ ${chalk.bold(
      median(totalPrices).toLocaleString(),
    )}✨`,
  );

  log(
    `📈  ${chalk.grey("Maximum price")} 💵  ${chalk.bold(
      totalPrices[maximun].toLocaleString(),
    )} \n`,
  );

  thanks();
};

module.exports = interview;
