const fetchP2PData = require("./utils/fetchP2PData.js");

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

module.exports = gathering;
