const fetchP2PData = require("./utils/fetchP2PData.js");
const medianCalc = require("./utils/median.js");

const gathering = async (
  currency,
  operation,
  ticker,
  payTypes,
  countries,
  onPageChange,
) => {
  const firstPage = await fetchP2PData(
    1,
    currency,
    operation,
    ticker,
    payTypes,
    countries,
  );

  const totalPages =
    firstPage && firstPage.success ? Math.ceil(firstPage.total / 20) : 0;
  const totalElements = [];
  for (i = 1; i <= totalPages; i++) {
    if (onPageChange) {
      onPageChange(i, totalPages);
    }
    const pageResult = await fetchP2PData(
      i,
      currency,
      operation,
      ticker,
      payTypes,
      countries,
    );
    if (pageResult && pageResult.success) {
      totalElements.push(...pageResult.data);
    }
  }

  return new Promise((resolve) => {
    resolve(totalElements);
  });
};

const median = async (
  currency,
  operation,
  ticker,
  payTypes,
  countries,
  onPageChange,
) => {
  let totalPrices = [];

  const results = await gathering(
    currency,
    operation,
    ticker,
    payTypes,
    countries,
    onPageChange,
  );

  results.map((obj) => totalPrices.push(parseFloat(obj.adv.price)));

  const minimun = operation === "SELL" ? totalPrices.length - 1 : 0;
  const maximun = operation === "SELL" ? 0 : totalPrices.length - 1;

  return new Promise((resolve) => {
    resolve({
      minimum: totalPrices[minimun].toLocaleString(),
      maximun: totalPrices[maximun].toLocaleString(),
      median: medianCalc(totalPrices),
      offering: totalPrices.length,
    });
  });
};

module.exports = { gathering, median };
